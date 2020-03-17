import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface IProps {
  msg: string;
}
const FunctionApp: React.FunctionComponent<IProps> = ({ msg = 'function component'}) => {
  return (
    <div>
      Function component
        {msg}
    </div>
  );
}

const HooksApp: React.FC<IProps> = ({ msg = 'hooks'}) => {
  const [message, setMessage] = useState<string>('');
  return (
    <div>
      HooksApp
      {message}
    </div>
  )
}

const foo = <T extends {}>(x: T) => x;


interface IState {
}
class ClassApp extends React.Component<IProps, IState>  {
  static defaultProps = {
    msg: "class component"
  }
  constructor(props: IProps) {
    super(props)
  }
  
  render() {
    return (
      <div>
        class component
        {this.props.msg}
      </div>
    )
  }
}

export default ClassApp;

interface Color {
  red: string;
  green: string;
  blue: string;
}

const color: Color = {
  red: '#f00',
  green: '#0f0',
  blue: '#00f'
}
const colorIndex = 'red';
const bgColor = color[colorIndex];

enum E {
  red,
  green,
  yellow
}

interface DynamicKeyMap {
  [key:string]: string;
}

const a : DynamicKeyMap = {
  a: '1'
}

interface WithLoadingProps {
  loading: boolean;
}

const withLoading = <P extends {}>(Component: React.ComponentType<P>) =>
  class WithLoading extends React.Component<P & WithLoadingProps> {
    render() {
      const { loading, ...props } = this.props;
      return loading ? <span>loading...</span>: <Component {...props as P} />;
    }
  };

  import React, { Component, MouseEvent } from 'react';

export class Button extends Component {
  /*
   Here we restrict all handleClicks to be exclusively on 
   HTMLButton Elements
  */
  handleClick(event: MouseEvent) {
    event.preventDefault();
    alert(event.currentTarget.tagName); // alerts BUTTON
  }

  /* 
    Generics support union types. This event handler works on
    HTMLButtonElement and HTMLAnchorElement (links).
  */
  handleAnotherClick(event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) {
    event.preventDefault();
    alert('Yeah!');
  }

  render() {
    return <button onClick={this.handleClick}>
      {this.props.children}
    </button>
  }
}


 const map = [['a',1],[],[]];

 const obj = {
  a: 1,
  b: 'string',
};

obj.c = null;





// declare interface myfoo {
//   (a: number):(number)
// }

// declare class myfoo {
//   static bar: number;
// }


// function myfoo (a:number) {
 
//   return a + 1;

// }

// foo.bar = 123;

type TFoo = {
  [key:string]: number;
}
let fooObj:TFoo = {};
  
for (let i = 0; i< 100; i++) {
    fooObj[String(i)] = i;
}

interface MyInterface {
  
}
class Bar implements MyInterface {
  constructor(public name: string) {}
}
class Foo implements MyInterface {
  constructor(public name: string) {}
}

function myfn(Klass: MyInterface, name: string) {
  return new Klass(name);
}

myfn(Bar);
myfn(Foo);


const fooMap:Map<string, number> = new Map();
fooMap.set('bar', 1);


new FileReader();