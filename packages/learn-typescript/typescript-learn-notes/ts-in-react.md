title: TypeScript in React
speaker: lampkid
transition: cards
plugins:
    - echarts

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

# TypeScript in React {.text-landing.text-shadow}

By lampkid {.text-intro}

[:fa-github: Github](https://github.com/ksky521/nodeppt){.button.ghost}

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">
## 泛型
- 泛型是为了解决类成员、函数参数、函数返回值之间的类型依赖

<slide>
## 泛型举例
```
class Queue<T> {
  private data = [];
  push(item: T) { this.data.push(item); }
  pop(): T | undefined { return this.data.shift(); }
}
```

<slide class="bg aligncenter">
## 泛型计算

```typescript
Partial<T>
Readonly<T>
Record<K,T>
Pick<T,K>
Omit<T,K>
Exclude<T,U>
Extract<T,U>
NonNullable<T>
Parameters<T>
ConstructorParameters<T>
ReturnType<T>
InstanceType<T>
Required<T>
ThisType<T>
```

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

# React生态

- **React**
- React-DOM
- React-Router
- React-Redux


<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

## React in TypeScript

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">
### React组件
  - JSX
  - 类组件
  - 函数组件
  - 高阶组件
  - Hook里的函数组件


<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">
## React声明文件

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">

### JSX
  - 编译选项preserve、react、react-native
  - 类型断言<> -> as

<slide>
## Class Component

```typescript
interface IProps {
  msg: string;
}

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
```

<slide>
## Function Component

```typescript
interface IProps {
  msg: string;
}
const FunctionApp: React.FC<IProps> = ({ msg = 'function component'}) => {
  return (
    <div className="App">
      Function component
        {msg}
    </div>
  );
}
```

<slide>
## Hooks in Function Component

```typescript
interface IProps {
  msg: string;
}
const HooksApp: React.FunctionComponent<IProps> = ({ msg = 'hooks'}) => {
  const [message, setMessage] = useState<string>('');
  return (
    <div>
      HooksApp
      {message}
    </div>
  )
}
```
<slide>
## HOC

```typescript
interface WithLoadingProps {
  loading: boolean;
}

const withLoading = <P extends {}>(Component: React.ComponentType<P>) =>
  class WithLoading extends React.Component<P & WithLoadingProps> {
    render() {
      const { loading, ...props } = this.props;
      return loading ? <span>loading...</span> : <Component {...props as P} />;
    }
  };

```

<slide>
## 发送请求

```typescript
const getJSON = <T>(config: {
    url: string,
    headers?: { [key: string]: string },
  }): Promise<T> => {
    const fetchConfig = ({
      method: 'GET',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(config.headers || {})
    });
    return fetch(config.url, fetchConfig)
      .then<T>(response => response.json());
  }
  ```

<slide>
## Event

```typescript
export class Button extends Component {

  handleClick(event: MouseEvent) {
    event.preventDefault();
    alert(event.currentTarget.tagName); // alerts BUTTON
  }

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

```

<slide>
## Problem
> 箭头函数里的泛型

```typescript
/*
 * const foo = <T>(x: T) => x; // error
 */
const foo = <T extends {}>(x: T) => x;
```

<slide>

## Problem

> TypeScript如何定义一个具有不确定key的对象

```typescript
interface DynamicKeyMap {
  [key:string]: string;
}
```

<slide class="bg-black-blue aligncenter" image="https://source.unsplash.com/C1HhAQrbykQ/ .dark">
## reference
- Github：https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
- [A Beginners Guide to using Typescript with React](https://dev.to/bmcmahen/a-beginners-guide-to-using-typescript-with-react-7m6)
- [Do's and Don'ts]()
- [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/types/generics.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
