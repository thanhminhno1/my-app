import qs from 'qs';
import { createBrowserHistory } from 'history';

let history;

if (typeof document !== 'undefined') {
  // const createBrowserHistory = require('history/createBrowserHistory').default;

  history = createBrowserHistory();

  history.listen(() => {
    history.location = {
      ...history.location,
      query: qs.parse(history.location.search.substr(1)),
      state: history.location.state || {},
    };
  });
}

export default history;
