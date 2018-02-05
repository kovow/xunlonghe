import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import 'moment/locale/zh-cn';
import './requestAnimationFrame';
// 去掉单页瞄点   #;需要服务端nginx 定位到index.html索引页面
import browserHistory from 'history/createBrowserHistory';
import './index.less';
// import {message} from 'antd';
// 1. Initialize
const app = dva({
  history: browserHistory(),
  // onError(e) {
  //   message.error(e.message, /* duration */3);
  // }
});

// 2. Plugins
// app.use({});

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
export default app._store;  // eslint-disable-line