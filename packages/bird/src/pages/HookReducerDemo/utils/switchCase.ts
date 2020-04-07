const executeIfFunction = f => (f instanceof Function ? f() : f);
const _switchCase = cases => defaultCase => (key, prefix = "") => {
  const finalCases = Object.keys(cases).reduce(
    (newCases, nextKey) => ({
      ...newCases,
      [[prefix, nextKey].join("/")]: cases[nextKey]
    }),
    {}
  );
  return Object.prototype.hasOwnProperty.call(finalCases, key)
    ? finalCases[key]
    : defaultCase;
};
const switchCase = cases => defaultCase => (key, prefix) =>
  executeIfFunction(_switchCase(cases)(defaultCase)(key, prefix));
export default switchCase;
