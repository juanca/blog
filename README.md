# React + Redux Architecture

The purpose of this article is to introduce the different tools and testing strategies available in a React and Redux stack.
One of the goals of this article is to develop a simple UI component that is simple, extensible, and useful through its properties interface.
A basic and widely used component within any application is a text field.
This article will start with the presentational model of a text field;
customize the display structure with additional buttons and icons;
implement some behavioral states (e.g. keeping track of what has been typed);
and, finally, populate the component from stored database values.


### Useful terminology

- **component** is either a function that returns JSX or a instance of `React.Component`.
React provides a component for every known HTML node.
- **JSX** represents the hierarchy of components (which includes regular HTML DOM nodes).
JavaScript code is injected into the markup with curly braces (i.e. `{someJavaScriptExpression}`).
- **props** are the required and optional arguments to a component.
- **propTypes** are the types of each argument to a component.
- **store** is the storage manager which contains are all known data (either backend (model data) or frontend (UI states)).
- **side effects** are any possible changes to different parts of the system.


## Presentational Component

A presentational component is known as **stateless** or **pure** because it is derived entirely from the `props` passed into it.
Given this simplicity of this data flow, it is guaranteed that no other UI components will be affected by the inclusion of a presentational component.
A presentational component is known as **functional** because it has no side effects and it always returns the same things given a set of props -- or more easily, it is quite literally just a JavaScript function instead of a `React.Component` subclass.

Let's consider a text field component with two basic requirements:

1. A label
2. An input field

In HTML markup, it is straightforward. In JSX markup, it is straightforward as well.

```
export default function PresentationalTextField (props) {
  return (
    <div className={props.className}>
      <label>{props.labelText}</label>
      <input onChange={props.onChange} value={props.value} />
    </div>
  );
}
```

As with any HTML widget, it is good practice to simplify the DOM as much as possible.
React imposes one requirement to components: one root element (e.g. `<div className={props.className}>`).

Given that these components are just used to display data, its properties interface (i.e. `prop` argument) needs to be carefully planned.
`propTypes` is a pseudo type checking system to ensure developers do not misuse the component.
A console warning is displayed in development whenever a type is violated.
However, these are stripped from the codebase in a production environment.

```
TextField.propTypes = {
  labelText: React.PropTypes.string,
  onInputChange: React.PropTypes.func.isRequired,
};
```

In addition, default values can be specified.
This is more straightforward and less error-prone than defaulting the values in ternary-like expressions.

```
TextField.defaultProps = {
  labelText: ‘Some default label’,
};
```

The purpose of these presentational components is to provide the source of truth for the DOM semantic structure and basic styling of commonly displayed data.
In a growing team (of developers, designers, and product managers), a simple, shareable, and straightforward system of components is essential to agile iterations.
As long as the properties interface is respected, system-wide changes can easily be carried out by anyone without any breaking risks.
