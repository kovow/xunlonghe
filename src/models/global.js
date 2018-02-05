import { queryPermission } from '../services/api';
import Cookies from '../vendor/js.cookie.js';
import { httpToken } from '../utils/ajax';
import {isEmpty} from 'lodash';
export default {
  namespace: 'global',

  state: {
    permission: [],
    collapsed: false,
  },

  effects: {
    //获取权限信息
    *fetchPermission(_,{call,put}){
      const response = yield call(queryPermission);
      let permission = yield (isEmpty(response.data.result)?[]:response.data.result);
      yield Cookies.set('permission',permission);
      yield put({
        type: 'getPermission',
        payload: permission
      });
    },
    *setToken({payload},{call,put}){
      yield Cookies.set('token',payload);
      yield call(httpToken,payload);
      yield yield put({
        type: 'fetchPermission'
      });
    },
  },

  reducers: {
    getPermission(state,action){
      return{
        ...state,
        permission: action.payload
      }
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
    // setup({ history }) {
    //   // Subscribe history(url) change, trigger `load` action if pathname is `/`
    //   return history.listen(({ pathname, search }) => {
    //     if (typeof window.ga !== 'undefined') {
    //       window.ga('send', 'pageview', pathname + search);
    //     }
    //   });
    // },
    setup({ history,dispatch }) {
      if(Cookies.get('token')){
        dispatch({
          type: 'setToken',
          payload: Cookies.get('token')
        });
      }
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
