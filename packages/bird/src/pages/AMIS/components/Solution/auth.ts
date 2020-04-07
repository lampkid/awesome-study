export const auths = {};

/*
 * 组件加载之前injectAuth，比如window变量
 * todo: injectAuth后触发组件重新渲染
 *
 */
export default function injectAuth(newAuths) {
  Object.assign(auths, newAuths);
}

export { injectAuth };

export function getAuth() {
  return auths;
}
