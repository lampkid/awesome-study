// todo 这种全局的可以设计一个插件系统，然后统一在入口处调度初始化run起来
import { createHashHistory } from 'history';

const history = createHashHistory();

const currentPathname = history.location.pathname;
export const historyRecords = {
  [currentPathname]: 1
};

history.listen((location, action) => {
  const { pathname } = location;
  if (!historyRecords[pathname]) {
    historyRecords[pathname] = 0;
  }
  historyRecords[pathname] += 1;
});

export function isFirstAccess(location) {
  const { pathname } = location;
  return getAccessCount(location) <= 1;
}

export function getAccessCount(location) {
  const { pathname } = location;
  return historyRecords[pathname] || 0;
}

export { history };
