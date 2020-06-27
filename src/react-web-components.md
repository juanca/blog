# React web components

### Expose DOM-like ref

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
    setter value(newValue) {
      setValue(newValue);
    },
  }));
});
```

### Expose native-like event handlers: e.g. `onChange` API

- Do not call `onChange` as direct responses to native DOM events (e.g. `click`)
- Consume native DOM events by setting component state (`click` -> `setValue`)
- Call `onChange` API when actual value state changes (and expose event-like actual parameter)
- Keep track of mounted state to avoid calling `onChange` on mount (`undefined` -> `props.value`)

```jsx
const [didMount, setDidMount] = useState(false);

useEffect(() => {
  setDidMount(true)
}, []);
```

```jsx
const [value, setValue] = useState(props.value);

useEffect(() => {
  if (!didMount) return;

  props.onChange({ target: ref.current });
}, [value]);
```
