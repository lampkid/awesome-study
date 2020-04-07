import renders from './Table/ColumnRender';
import { compose } from '../utils';

export function renderFieldValue(text, data = {}, index, field = {}, provider = {}) {
  const { render: renderName } = field;
  if (Array.isArray(renderName)) {
      const funcs = renderName.map((renderItem) => {
        const func = typeof renderItem === 'function' ? renderItem : renders[renderItem];
        return func ? func : (text) => text
      });

    const finalFunc = compose(funcs)
    return finalFunc(text, data, index, field, provider)
  }
  if (typeof renderName === 'string' && typeof renders[renderName] === 'function') {
    const renderFunc = renders[renderName];
    return renderFunc(text, data, index, field, provider)
  }
  return text || ' - ';
}
