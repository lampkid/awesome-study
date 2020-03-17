# TS Problem

## void 和 undefined 有什么区别

## 什么是 never 类型

## 下面代码会不会报错？怎么解决

```typescript
const obj = {
    a: 1,
    b: 'string',
};
  
obj.c = null;
```

## readonly 和 const 有什么区别

## 下面代码中，foo 的类型应该如何声明

```typescript
function foo (a: number) {
    return a + 1;
}
foo.bar = 123;
```

## 下面代码中，foo 的类型如何声明

```typescript
let foo = {};
  
for (let i = 0; i< 100; i++) {
    foo[String(i)] = i;
}
```

## 实现 MyInterface

```typescript
interface MyInterface {
    ...
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
```

## 什么是 Abstract Class

## 什么是 class mixin, 如何实现

## typeof 关键词有什么用

## keyof 关键词有什么用

## 下面代码中，fooFn 的类型如何声明

```typescript
function fn(value: number): string {
    return String(value);
}
const fooFn = fn;
下面代码会导致 TS 编译失败，如何修改 getValue 的类型声明。
function getValue() {
    return this.value;
}
  
getValue();
```

## 下面是 vue-class-component 的部分代码，解释为什么会有多个 Component 函数的声明，作用是什么？TS 官方文档的那一节有对应的解释文档

```typescript
function Component <U extends Vue>(options: ComponentOptions<U>): <V extends VueClass>(target: V) => V
function Component <V extends VueClass>(target: V): V
function Component <V extends VueClass, U extends Vue>(
 options: ComponentOptions<U> | V
): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: V) {
    return componentFactory(Component, options)
  }
}
```

## 如何声明 fooMap 的类型

```typescript
const fooMap = new Map();
foo.set('bar', 1);
```

## 如何声明 getProperty，以便能检查出第八行将会出现的运行错误。

```typescript
function getProperty(obj, key) {
    return obj[key].toString();
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
```

## 类型声明里 「&」和「|」有什么作用

## 下面代码里「date is Date」有什么作用

```typescript
function isDate(date: any): date is Date {
  if (!date) return false;
  return Object.prototype.toString.call(date) === '[object Date]';
}
```


## tsconfig.json 里 --strictNullChecks 参数的作用是什么

## interface 和 type 声明有什么区别

## 如何完善 Calculator 的声明

```typescript
interface Calculator {
    ...
}

let calcu: Calculator;
calcu(2)
  .multiply(5)
  .add(1)

```

## 「import ... from」、「 import ... = require()」 和 「import(path: string)」有什么区别

## declare 关键字有什么用

## module 关键字有什么用

## 如何处理才能在 TS 中引用 CSS 或者 图片使之不报错

```typescript
import "./index.scss";
import imgPath from "./home.png";
```

## 编写 d.ts 来声明下面的 js 文件

```typescript

class Foo {
}
module.exports = Foo;
module.exports.Bar = 1;
```

namespace 和 module 有什么区别
## 如何实现 module alias?编译成 JS 能否直接运行？
import Bar from '@src/Bar';
## 哪些声明类型既可以当做 type 也可以当做 value？