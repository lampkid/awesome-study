export default function compose(funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  const finalFunc = funcs.reduce((prev, next) => {
    return (...args) => {
      const [text, ...otherArgs] = args;
      return next(prev(...args), ...otherArgs)
    }
  });
  return finalFunc
}
  