# React + Redux Architecture

The purpose of this article is to introduce the different tools and testing strategies available in a React and Redux stack.
One of the goals of this article is to develop a simple UI component that is simple, extensible, and useful through its properties interface.
A basic and widely used component within any application is a text field.
This article will start with the presentational model of a text field;
customize the display structure with additional buttons and icons;
implement some behavioral states (e.g. keeping track of what has been typed);
and, finally, populate the component from stored database values.
User interfaces (and their implementations) have the potential to explode in complexity.
This article hopes to illustrate different architectural techniques to contain logic into orthogonal systems in order to lower cognitive overhead.


### Useful terminology

- A **component** is either a function that returns JSX or an instance of `React.Component`.
Note: React provides a component for every known HTML node.
- **JSX** represents the hierarchy of components (which includes regular HTML DOM nodes).
JavaScript code is injected into the markup with curly braces (i.e. `{someJavaScriptExpression}`).
- The **props** expression is the key-value argument to a component.
This object represents required and optional properties.
- The **propTypes** validations are the types of each key-value pair in `props` to a component.
These validations are only meant provide immediate feedback to a developer using a component (and all `propTypes` code is stripped out of the production version of a React application).
- A **store** is a key-value object which contains all shared data (i.e. model data and UI states).
- **Side effects** are any possible changes to different parts of the system.


### Assumptions

This article assumes common knowledge of JavaScript modules -- how to export a module, how to avoid exporting a private function, etc.

Testing strategies will be abstract.

Styling will be avoided for this article? Future article will discuss different strategies.


## Presentational Component

A presentational component is known as **stateless** or **pure** because it is derived entirely from the `props` passed into it.
Given the simplicity of this data flow, it is guaranteed that all other UI components will be unaffected by the inclusion of a presentational component.
A presentational component is known as **functional** because it does not have any side effects and it always returns the same HTML markup given a set of props.

Let's consider a text field component with two basic requirements:

1. A label
2. An input field

In HTML markup, it is straightforward. In JSX markup, it is straightforward as well.

```
export default function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      <input onChange={props.onChange} value={props.value} />
    </div>
  );
}
```

As with any HTML widget, it is good practice to simplify the DOM as much as possible.
React imposes one requirement to components: one root element (e.g. `<div>`).

The biggest responsibility of this component is displaying data.
In the case of the `PresentationalTextField`, it displays some text as a label (`props.labelText`) and populates a value into the input (`props.value`).
An additional property is exposed in order to make this component more useful: `props.onChange`.
Whenever there are possible user-actions on a component, it tends to be a good idea to allow binding of an event handler.
Given all the possible usages of user interfaces, it is crucial to develop a robust properties interface (i.e. `props`) which describes the desired usage of a component.


In order to provide a robust `props` API, there is the `propTypes` system -- a pseudo-type checking system to avoid misuses of the component.
A console warning is displayed in development whenever a type is violated.
However, these are stripped from the codebase in a production environment.

```
TextField.propTypes = {
  labelText: React.PropTypes.string,
  onInputChange: React.PropTypes.func.isRequired,
};
```


In addition, default values can be specified for optional properties.
This is more straightforward and less error-prone than defaulting the values in ternary-like expressions.

```
TextField.defaultProps = {
  labelText: ‘Some default label’,
};
```


The purpose of these presentational components is to provide the source of truth for the semantic DOM structure of commonly displayed data.
In a growing team of contributors, a simple, shareable, and straightforward system of components is essential to getting work done.
As long as the properties interface is respected, system-wide changes can easily be carried out by anyone without any breaking risks.


## Advanced Presentational Components: Decorations

Let's suppose a new requirement: a currency symbol to the left of the input and some icon to the right of the input.

A naive approach is a simple copy-and-paste of the original `TextField` source:

```
export default function PresentationalMoneyTextField (props) {
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

For the purposes of the requirements, this is a complete solution (albeit a good one).
Any improvements and changes to the `TextField` will need manual labor to propagate the same to the `MoneyTextField`.
As long as someone is dedicating time to normalize all components, this is a doable approach.
On the other hand, this is not a scalable approach -- each additional component just increases the on-boarding process for a contributor.

Another naive approach is a configurable approach with the original `TextField` source:

```
export default function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      {props.showCurrency ? <div>$$$</div> : undefined}
      <input onChange={props.onChange} value={props.value} />
      {props.showClear ? <div>clear</div> : undefined}
    </div>
  );
}
```

If the `MoneyTextField` is a defined component then its usage will look like the following:

```
export default function MoneyTextField (props) {
  return (
    <TextField {...props} showCurrency=true showClear=true />
  );
}
```

Although this solves the linearly increasing amount of components problems, this approach introduces a new problem:
an additional decoration implies another conditional.
These conditionals have the potential to clutter source code.
Cluttering the source code eventually leads to a higher mental overhead in determining the purpose of the original component.

An easier managed component approach is allowing nested components as `props` values.
The following is a revised implementation of the original text field:

```
export default function PresentationalTextField (props) {
  return (
    <div>
      <label>{props.labelText}</label>
      {props.prefix}
      <input onChange={props.onChange} value={props.value} />
      {props.postfix}
    </div>
  );
}
```

Then the `MoneyTextField` is the following defined component:

```
export default function CompositionalMoneyTextField (props) {
  return (
    <TextField {...props}
      prefix={<div>$</div>}
      postfix={<div>clear</div>}
    />
  );
}
```

The resulting `TextField` component is more versatile and straightforward.
Although this does not solve the one-off problem, it does minimize the mental overhead for any new contributor.
In addition, React allows for nested JSX components with the `children` property.


## Behavioral Component

A behavioral component is known as **stateful** or **impure** because it is derived from the `props` passed in and some hidden variables within the component.
Although it is not a presentation component, it is still considered **dumb** because it never directly accesses the store.
In order to introduce `state` into a component, the component needs to inherit from the `React.Component` in order to take advantage of the [React component lifecycle](https://facebook.github.io/react/docs/react-component.html).
This can be achieved by modifying the original presentational component or wrapping the original presentational component.
Normally, behavioral components are perfect opportunities to implement **higher-order components**.
A higher-order component is the technique of wrapping the original presentational component to produce a new component.

Whenever a component needs to do more than just displaying data, a behavior component would suffice.

Let's consider a requirement to programmatically keep track of the value within the `<input>` in the `TextField` component.

### Non-higher-order component

A React component has a `state` attached to its instance.
This can be updated with the `setState` asynchronous setter instance method.
In order to keep track of the input value, a simple `onChange` property can be attached to the `<input>` element.

```
export default class BehavioralTextField extends React.Component {
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

For the purpose of the requirements, this is a complete solution.
The component stores the input value in `this.state.value` and updates it on `change` events.
However, this approach forces the `TextField` to always manage its input value.
Any changes to this flow requires a modification to the original source code of the `TextField` --
whose purpose was to just display a label and an input element.


### Higher order component

A more versatile approach is decoupling the desired behavior from the desired presentation.
The distinction to draw is a new component which can remember some value for any given component.
A higher order component composes a new component with these criteria:

1. Takes components as arguments (and any configurable options)
2. Returns a new component with the desired behavior

```
export default function HigherOrderComponent(Component) {
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

The factory can be used to remember any value as long as the supplied component has an `onChange` and `value` properties.
Utilizing this pattern reinforces the importance of designing a consistent and robust `props` interface for components.
However, if for any reason a component's `props` interface does not match with the usage of a higher order component, additional arguments can be utilized to customize the binding of the generic component.


## General JavaScript Notes

Although this article focuses on a React and Redux stack, these design principles can be applied to any powerful framework.
In my personal experience, the distinct conceptual models (presentational, behavioral, and container components) can also be used in a [Backbone](http://backbonejs.org/) and [Marionette](http://marionettejs.com/) stack.
The abstract idea of composing new components is a worthwhile and powerful technique.
Whether composition is applied via arguments or wrappers, separating the concerns ultimately alleviates the classical growing pains of a codebase and facilitates the introduction to new contributors.
I would even go as far as to say these conceptual models are useful in any environment: backend systems can also benefit from such separation of concerns -- well-tested core classes, extensible core components, minimal memory usage, etc.
