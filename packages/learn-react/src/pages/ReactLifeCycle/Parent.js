import React from 'react';
import Child from './Child';
export default class Parent extends React.Component {

    state = { count: 0 }
    constructor(props) {
        super(props);
        console.log('parent constructor');
    }

    componentDidMount() {
        console.log('parent didMount')
    }

    shouldComponentUpdate() {
        console.log('parent shouldComponentUpdate');
        return true;
    }

    componentDidUpdate() {
        console.log('parent DidUpdate');
    }

    componentWillUnmount() {
        console.log('parent WillUnmount');
    }

    handleUpdate() {
        this.setState({ count: this.state.count + 1 })
    }

    render() {
        const { count } = this.state;
        return (
            <div className="parent" style={{ border: '1px solid red', padding: 20, width: 300 }}>
                <p onClick={() => this.handleUpdate()}>点击更新父组件</p>
                父组件更新了{count}次
                <Child />
            </div>
        )
    }

}