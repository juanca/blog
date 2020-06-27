# React web components

This is a higly opinionated perspective on a React architecture:

1. Create accessible components
1. Create highly composable components
1. Create web components

## Expose DOM-like ref

- Do not expect everyone to use `ref`
- Expose (getter) state values through `useImperativeHandle`
- Expose (setter) state values through `useImperativeHandle`

```jsx
const SomeComponent = forwardRef(function SomeComponent(props, forwardedRef) {
  const [value, setValue] = useState(props.value);
  const backupRef = useRef();
  const ref = forwardedRef || backupRef;

  useImperativeHandle(ref, () => ({
    getter value() {
      return value;
    },
    setter value(bool) {
      setValue(bool);
    },
  }));
});
```

## Interactive accessibility

- A component has references to its sub-components
- An `active` component manages its own page tab sequence
- By default, all components are in the page tab sequence
- Focusing on a component implies focusing its (only) active sub-component
- Handling a key event for accessibility implies preventing browser default behavior

```jsx
funcion List(props) {
  const [active, setActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  function onKeyDown(keyEvent) {
    switch (keyEvent.key) {
      case 'ArrowUp':
        if (activeIndex > 0) {
          keyEvent.preventDefault();
          setActiveIndex(activeIndex - 1);
        }
        break;
      case 'ArrowDown':
        if (activeIndex < props.refs.length - 1) {
          keyEvent.preventDefault();
          setActiveIndex(activeIndex + 1);
        }
        break;
      case 'End':
        keyEvent.preventDefault();
        setActiveIndex(props.refs.length - 1);
        break;
      case 'Home':
        keyEvent.preventDefault();
        setActiveIndex(0);
        break;
      default:
    }
  }

  useEffect(() => {
    if (active) {
      props.refs.forEach((listItem, index) => {
        if (listItem.current) listItem.current.active = index === activeIndex;
      });
    }
  });

  function onFocus(event) {
    setActive(true);
  }

  return (
    <ul onFocus={onFocus} tabIndex="-1">
      {props.children}
    </ul>
  );
}

const ListItem = forwardRef(function ListItem(props, ref) {
  const [active, setActive] = useState(props.defaultActive);
  const [focusQueued, setFocusQueued] = useState(false);
  const nodeRef = useRef();

  useImperativeHandle(ref, () => {
    getter active() {
      return active;
    },
    setter active(bool) {
      setFocusQueued(bool);
      setActive(bool);
    }
  });

  useEffect(() => {
    if (focusQueued) {
      nodeRef.current.focus();
    }
  });

  return (
    <li ref={nodeRef} tabIndex={active ? "0" : "-1"}>
      {props.children}
    </li>
  );
});

// Usage

const items = ['1', '2', 'foo'];
const refs = items.map(() => createRef());

<List refs={refs}>
  {items.map((item, i) => (
    <ListItem ref={refs[i]}>{item}</ListItem>
  ))}
</List>
```

## Expose native-like event handlers: e.g. `onChange` API

- Do not call `onChange` as direct responses to native DOM events (e.g. `click`)
- Consume native DOM events by setting component state (`click` -> `setValue`)
- Call `onChange` API when actual value state changes (and expose event-like parameter)
- Keep track of mounted state to avoid calling `onChange` on mount (`undefined` -> `props.value`)

```jsx
const Select = forwardRef(function Select(props, ref) {
  const [didMount, setDidMount] = useState(false);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setDidMount(true)
  }, []);

  useEffect(() => {
    if (!didMount) return;

    props.onChange({ target: ref.current });
  }, [value]);

  return ( ... );
});
```
