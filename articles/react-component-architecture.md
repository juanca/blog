# React Component Architecture

User interfaces (and their implementation) have the potential to explode in complexity.
As a guided example, this article will focus on developing a UI component and the different approaches to separating responsibilities.
The purpose of this article is introducing different component architecture and their respective testing strategies
by developing a simple, extensible, and useful UI component.
Overall, standardizing design patterns to reduce complexity.

A basic and widely used component within any application is a text field.
This article will start with the presentational model of a text field;
customize the display structure with additional buttons and icons;
implement some behavioral states (e.g. keeping track of what has been typed);
and, finally, populate the component from stored database values.


### Audience Advisory

As a disclaimer, it is assumed the reader has some experience with the React and Redux libraries:

- JSX
- `props` nomenclature
- written some components
- written some components which use internal state
- written some components which use redux store state
- written some actions, action creators, and reducers to manage a redux store


## Stateless Components

Stateless components are the WYSIWYG building blocks of React.

### Presentational Component

#### What?

A stateless presentational component is entirely derived from the `props` passed into it.
Given the simplicity of this data flow, it is guaranteed that all other UI components will be unaffected by the inclusion of a presentational component.
Note: there are usages of using some state in a presentational component (e.g. managing unique `htmlFor` attributes) but, for the purposes of article, let's focus on a functional component example.

Let's consider a text field component with two basic requirements:

1. A label
2. An input field

In HTML markup, it is straightforward. In JSX markup, it is straightforward as well.

```javascript
function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      <input onChange={props.onChange} value={props.value} />
    </div>
  );
}
```

#### When?

The only responsibilities of these type of components are displaying **data** and **interactive elements**.
In the case of the `PresentationalTextField`:

- it displays some text as a label (i.e. `props.labelText`)
- it displays some value in an input (i.e. `props.value`)
- it interfaces the interactive element with parent components (i.e. `props.onChange`)

While the `onChange` prop is not directly displaying some content, it is indirectly responsible for managing the content of an element.

#### Why?

Using functional presentational components provides two benefits:

1. Manage the presentational layer with single responsibility components.
1. Functional components are lightweight and fast: there is no inheritance of `React.Component` and its lifecycle.
This is analogous to writing a vanilla JavaScript element.

#### How?

Designing a useful presentational component is designing a robust **properties interface**.
Given the responsibilities of displaying content,
a presentational component is only useful when it is usable in a variety of contexts
(i.e. its `props` should be robust enough to flexible in many contexts).
This requires some forethought and openness to restructuring an existing interface in order to better describe a component based on its `props`.

For a given presentational component, most `props` will serve as text and property values to other elements
while some will be used for event handlers on interactive elements.
In order to make a straightforward usage of the component, it is crucial to leverage `propTypes` and `defaultProps`.

##### Property types

React provides typechecking functionality.
This allows component to describe the type for each of its properties.
Careful descriptions can avoid bugs and avoid misuses of the component.
Whenever a type is violated, a console warning is displayed
(but only in development since typechecking is stripped in a production environment).

```javascript
TextField.propTypes = {
  labelText: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string
};
```

In the above example, each of the available properties on the text field component are listed.
The label text is described to be a string.
The change event handler is a function and it is a required property.
And, the input value is another string.

##### Default properties

In addition, default values should be specified for optional properties --
which is all other properties which are not required.
Whenever a property is being interpolated into an expression, a default value is better than an `undefined` value because `undefined` serializes to "undefined."

```javascript
TextField.defaultProps = {
  labelText: 'Text Field',
};
```

#### Testing

The testing strategy is straightforward because presentational components are entirely driven via `props`.

1. For an empty set of optional `props`, the component renders with the default markup.
1. For a given set of optional `props`, the component renders with customized markup.
1. For varying required `props`, the component renders with varying markup.
1. Event handlers are invoked on simulated DOM events.

### Decorated Presentational Component

#### What?

Decorating presentational components is an approach in designing a properties interface which allows other components as values.

Let's suppose a couple of new requirement on the original text field:

1. A currency symbol to the left of the input
1. A button to the right of the input

```javascript
function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      {props.prefix}
      <input onChange={props.onChange} value={props.value} />
      {props.postfix}
    </div>
  );
}

function CompositionalMoneyTextField (props) {
  return (
    <TextField {...props}
      prefix={<div>$</div>}
      postfix={<div>clear</div>}
    />
  );
}
```

The original text field component is revised to include two additional properties: `props.prefix` and `props.postfix`.
These represent placeholders for other components as decorations.
If any is `undefined` then React will just skip it.
Note: any string value is actually considered a text node.

#### When?

The sole responsibility of a decorations on a presentational component is facilitate complex user interfaces.
This is useful when complex user interfaces can be composed of many simple and robust  components.

#### Why?

A naive approach is a simple copy-and-paste of the original `PresentationalTextField` source:

```javascript
function PresentationalMoneyTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      <div>$$$</div>
      <input onChange={props.onChange} value={props.value} />
      <div>clear</div>
    </div>
  );
}
```

For the purposes of the requirements, this is a complete solution -- albeit a good one.
This is not a scalable approach as it takes a lot of manual effort to normalize all components (i.e. changes to either component will require changes to the other component).
Each additional component just increases the on-boarding process for a contributor.

Another naive approach is configurable functionality with the original `PresentationalTextField` source:

```javascript
function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      {props.showCurrency ? <div>$$$</div> : undefined}
      <input onChange={props.onChange} value={props.value} />
      {props.showClear ? <div>clear</div> : undefined}
    </div>
  );
}

function ConfiguredMoneyTextField (props) {
  return (
    <TextField {...props} showCurrency=true showClear=true />
  );
}
```

Although configurable components eases normalization problems,
this approach introduces a new problem:
an additional decoration implies another conditional.
These conditionals have the lead to cluttered source code and a higher cyclomatic complexity.
This obfuscates the original purpose of the component.

Instead, using decorations as a means of defining complex user interfaces is an approach which separates the concerns of components among many.
The resulting `PresentationalTextField` component is more versatile and straightforward:
it solves the normalization problem and lowers cyclomatic complexity.

#### How?

Designing useful decorations in a presentational component is designing a robust **properties interface** which have structural meaning.
By keeping properties DRY, components have the potential to be versatile.


#### Testing

The testing strategy is straightforward because decorated presentational components are entirely driven via `props`.

1. Given a set of `props`, the component renders the presentational component (which is itself in this case).
1. For each hardcoded `prop`, the component renders additional DOM markup.

###

Overall, the purpose of presentational components is to provide the DOM structure of user interfaces.
By developing a set of useful presentational components, design patterns can be more easily established; there exists a source of truth for the semantics, structure, and API for user interfaces.
In a growing team of contributors, a simple, shareable, and straightforward system of components is essential to getting work done.
As long as the properties interfaces are respected, system-wide changes can easily be carried out by any contributor without any breaking risks.


## Stateful Components

#### What?

Stateful components are distinguished from stateless components from the fact that there exists state information.
Once a component has significant state information, it is assumed it behaves different based on different states and its properties interface.
In order to introduce state information, the component needs to inherit from `React.Component`.
Instances of a `React.Component` have their own `this.state` and use the [React Component Lifecycle methods](https://facebook.github.io/react/docs/react-component.html).

Let's consider a new requirement to the text field:

1. Programmatically keep track of the value within the `<input>` element

```javascript
class BehavioralTextField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        <label>{this.props.labelText}</label>
        <input onChange={this.onChange} value={this.state.value} />
      </div>
    );
  }
}
```

For the purpose of the requirements, this is a complete solution (albeit a good one).
The component stores the input value in `this.state.value` and uses it to populate the value property of the input.
The value is updated on `change` events (from the input element) via the `setState` asynchronous setter method.
And the presentational model is also implemented.

#### When and why?

Once requirements indicate responsibilities outside the presentational layer, stateful components will suffice in accommodating any required **behavior** responsibilities.

#### How?

This can be achieved by duplicating or modifying the original presentational component. However, each approaches exhibit problems:

- Assuming a duplication implementation: this approach experiences normalization problems.
- Assuming a modification implementation (to avoid any normalization problems):
this approach forces the text field to always manage its input value --
blocking any modifications capabilities from its parent component.

#### Testing

In addition to testing all presentational component responsibilities, state related tests are required as a function of DOM output.

1. For each state value, the component renders with a default value.
1. For a given state value, the component renders with the given value.
1. For each state value, the component updates the state value via some event handler.

### Higher-order Component

A better approach would be akin to decorations on presentational components without foregoing performance and SRP benefits.

#### What?

Encapsulating behavior responsibilities for components are perfect opportunities to implement **higher-order components**.
A higher-order component is a factory which produces a new component based on existing components and options.
By using a factory to produce a desired component, it decouples the required behaviors from the required presentation.

Revisiting the new requirement to the text field:

1. Programmatically keep track of the value within the `<input>` element

```javascript
function HigherOrderComponent(Component) {
  return class RememberValueComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        value: '',
      };

      this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
      this.setState({ value: event.target.value });
    }

    render() {
      return <Component
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      />;
    }
  }
}
```

This `HigherOrderComponent` is a factory with takes any kind of component and returns a different component.
The outputted component has the sole responsibility of remembering some value via `onChange` and `value` properties.

#### When?

Once requirements indicate responsibilities outside the presentational layer, stateful components will suffice in accommodating any required **behavior** responsibilities.  
Higher-order components are best used when the presentational models are pre-existing or extractable from the requirements.

#### Why?

Given existing components, a higher-order component can produce the desired component without violating the DRY and SRP principles.

#### How?

In this example, the outputted component can be used to remember any value as long as the supplied component (to the factory) has the `onChange` and `value` properties.
Utilizing this pattern reinforces the importance of designing a robust `props` interface for components.
A higher-order component binds certain `props` to the internal state of the outputted component.

Note:
if for any reason the given component's properties interface does not match with the implementation of the higher-order component,
additional arguments can be utilized to customize the binding of the generic component.
However, this introduces cyclomatic complexity.

#### Testing

The testing strategy is straightforward because higher-order components implement state information on pre-existing property interfaces.
For testing purposes, a generic component is used without imposing any additional logic.

1. For each state value, the `Component` has specific default `props` values.
1. For a given state value, the `Component` has the given `props` values.
1. For each tracked state value, the `Component` updates the state value via the given `props` event handler.

### Connected Component

#### What?

A redux connected component is another example of a higher-order component which outputs a stateful component.
However, instead of using `this.state` on an instance of a `React.Component`:

- The higher-order component binds certain `props` to the state of the store.
- The higher-order component has access to the synchronous setter method for the store (`dispatch`).

All of their DOM markup was driven by their `props` and internal state.
A container component is driven by the store: it reads and writes to the store.
The store is composed of data from the server and other container components.
These container components are useful in facilitating complex and coupled user interfaces.

The common use case it to connect an existing component with the store in order to display its data via the component's `props` interface.


```javascript
const mapStateToProps = (state) => {
  return {
    value: state.textField.value,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (event) => {
      dispatch(actions.updateValue(event.target.value));
    }
  };
};

const ServerTextField = connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);
```

The other usage of a connected container is server data fetching.
In order to avoid cluttering the presentational text field, the fetching logic is implemented within the component which uses the presentational text field.
Utilizing the React component lifecycle method `componentWillMount`, fetching data from the server is straightforward:
Fetch an endpoint, parse the response, and then dispatch the data via the same action creator.

```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    fetchServerData: () => {
      fetch('server-api/text-field.json')
        .then((response) => response.json())
        .then((json) => JSON.parse(json))
        .then((data) => dispatch(textFieldActions.updateValue(data.value)));
    }
  };
};
```

```javascript
componentWillMount() {
  this.props.fetchServerData();
}
```

#### When?
#### Why?
#### How?
#### Testing

Given the one-to-one mapping of the store state to the component `props`:

1. For the default store state, the component has specific default `props` values.
1. For a given store state, the component has the given `props` values.
1. For each event handler (closed with `dispatch`), the component updates the store state via the given `props` event handler.


## Conclusion

### Component API: `props` and `propTypes`

Designing a useful component is easily achievable with carefully designed properties interface.


### leads to... Complexity reduction

Presentational, decorated, behavioral, and higher-order components are powerful tools in breaking up the responsibilities of a complex user interface.
In addition, testing is also broken up among these components.

Having a set of simple user interface components still allows for a complex user interface.
It also allows for easier development of new complex user interfaces.

### Universal design principles

Overall, these design principles can be applied to any powerful programming framework.
Despite this article being geared towards a React and Redux stack, this also works in a Backbone and Marionette stack.
The abstract idea of composing new components is a worthwhile and powerful technique.
Whether composition is applied via arguments or wrappers, separating the concerns ultimately alleviates the classical growing pains of a codebase and facilitates the introduction to new contributors.
These conceptual models are useful in any environment: backend systems can also benefit from such separation of concerns -- well-tested core classes, extensible core components, minimal memory usage, etc.
