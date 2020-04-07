/*
 * params()
 * return()
 * */

function selectValue(data: string | number) {
  return data !== "" && data !== 0 ? data + "" : undefined;
}
export default selectValue;
