import _ from "lodash";

function intersect(now: any, old: any) {
  // 场景交集
  const _aIntersect = _.intersection(now, old);
  // 新增的场景 index
  const _add = _.xorWith(now, _aIntersect);
  // 删除的场景 index
  const _del = _.xorWith(_aIntersect, old);
  return {
    add: _add,
    del: _del
  };
}

export default intersect;
