import React from 'react';

export interface HelloProps { user: string; }

export default class Hello extends React.Component<HelloProps, {}> {
  render() {
    const { user } = this.props;
    return <h1>hello, {user}</h1>
  }
}
