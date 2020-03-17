import React from 'react';
export default class Child extends React.Component {

    state = { count: 0 }

    constructor(props) {
        super(props);
        console.log('child constructor');
    }

    componentDidMount() {
        console.log('child didMount')
    }

    shouldComponentUpdate() {
        console.log('child shouldComponentUpdate');
        return true;
    }

    componentDidUpdate() {
        console.log('child DidUpdate');
    }

    componentWillUnmount() {
        console.log('child WillUnmount');
    }

    handleUpdate() {
        this.setState({ count: this.state.count + 1 })
    }

    render() {
        const { count } = this.state;
        return (
            <div className="child" style={{ border: '1px solid green', padding: 20}}>
                Child Component  <p onClick={() => this.handleUpdate()}>点击更新子组件</p>
                更新了{count}次
            </div>
        )
    }

}