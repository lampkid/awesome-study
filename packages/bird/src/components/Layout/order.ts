export default function orderFields(fields: []) {
  return fields.sort(({ order: orderA = 0 }, { order: orderB = 0 }) => {
    return orderA - orderB;
  });
}
