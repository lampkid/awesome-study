export function trim(data: {}) {
  return Object.keys(data).reduce(
    (prevData, key) => ({
      ...prevData,
      [key]: typeof data[key] === "string" ? data[key].trim() : data[key]
    }),
    {}
  );
}
