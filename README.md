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
