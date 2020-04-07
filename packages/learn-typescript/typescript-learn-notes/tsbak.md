title: typescript初识与探讨
speaker: lampkid 
url: https://github.com/ksky521/nodeppt
transition: cards
files: /js/demo.js,/css/demo.css

[slide]

# typescript初识与探讨
## 演讲者： lampkid

[slide]

# 你能想到哪些标签
## 关于TypeScript
- JavaScript的超集
相比ES，TypeScript有哪些新特性？
- 强类型
- 静态类型 
- 命名空间与模块
- 接口
- 类?
- 泛型


[slide]
# 你有哪些疑问
## 关于TypeScript实战
- 怎么用TypeScript定义React组件 
  - 类组件
  - 函数组件
  - 高阶组件
  - Hook里的函数组件
- 泛型在React组件里的应用
- 在TypeScript里定义React事件
- TypeScript如何定义一个具有不确定key的对象

[slide]

# 类型系统
## 基本类型 
  - 原始类型
    - boolean
    - number
    - string
    - symbol
- 数组
  - Array<T>
  - T[]
- Tuple
- object 
- enum 
- any
- void
- never
- null
- undefined

[slide]
# 类型系统
## 字面量类型
## interface
### 函数类型
### 索引类型
### class Types
### 混合类型
## class
## 交叉类型
## 联合类型
## 泛型
## type



[slide]
## 类型系统里的机制 
### 机制
- 类型检查
- `类型推断
  - 变量初始化或成员属性初始化时推断, 
    let a = 2;
  - 根据表达式推断;最佳通用类型-> 联合类型
    let arr = [ "3", 2]
  - 上下文推断
`- 类型断言,不是类型转换
 - <string>myVar
 - myVar as string
- 类型保护
  在运行时检查以确保在某个作用域里的类型
  - typeof
  - instanceof
  - in
  - 字面量类型保护
  - 使用定义的类型保护
     - pet is Cat 
// - [Freshness](https://github.com/Microsoft/TypeScript/pull/3823)
- 类型兼容(duck typing | structural subtyping)
### interface的机制
- 单继承和多继承
- interface可以继承类,经测试可以继承多个类
当被继承的类属性为private时，只有类及子类可以实现通过继承类得到的interface

### 其他
- readonly & Readonly<T> & ReadonlyArray<T> & index signature & interface & class 自动推断类的getter属性
- 索引签名

[slide]

## 最佳实践 
### [Do's and Don'ts](/)
### React组件
### API定义


nodeppt是基于nodejs写的支持 **Markdown!** 语法的网页PPT，当前版本：1.4.5

Github：https://github.com/ksky521/nodeppt
