import React from 'react';

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
