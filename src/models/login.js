import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeMobileLogin, queryPermission,userLogout } from '../services/api';
import { httpToken } from '../utils/ajax';
import Cookies from '../vendor/js.cookie.js';
import {isEmpty} from 'lodash';
import {message} from 'antd';
export default {
  namespace: 'login',

  state: {
    token: null,
    permission: [],
    loginStatus: null
  },

  effects: {
    // 登入
    *accountSubmit({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response
      });
      if(response.data.status === '200'){
        yield (isEmpty(response.data.result.userInfo)?null : Cookies.set('userInfo',response.data.result.userInfo));
        let token = yield (isEmpty(response.data.result.token)?null:response.data.result.token);
        yield put({
          type: 'setToken',
          payload: token
        });
        yield put({
          type: 'fetchPermission'
        });
      }
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    // 注销登入
    *logout({url}, { call, put }) {
      const response = yield call(userLogout);
      if(response.data.status === '200'){
        message.success('注销成功');
        yield Cookies.remove('token');
        yield Cookies.remove('userInfo');
        yield Cookies.remove('permission');
        yield put({type:'clearLogin'});
        yield put(routerRedux.push(url));
      }
    },
    // 设置token请求头
    *setToken({payload},{call,put}){
      yield put({
        type: 'changeTokenStatus',
        payload: payload
      });
      yield Cookies.set('token',payload);
      yield call(httpToken,payload);
    },
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
  },

  reducers: {
    // 权限
    getPermission(state,action){
      return{
        ...state,
        permission: action.payload
      }
    },
    // 清除登入信息
    clearLogin(state,action){
      return{
        ...state,
        token: null,
        loginStatus: null,
        permission: []
      };
    },
    // 改变token 状态
    changeTokenStatus(state, { payload }) {
      return {
        ...state,
        token: payload
      };
    },
    // 登入失败状态
    changeLoginStatus(state, { payload }) {
      if(payload.data.status === '0'){
        return {
          ...state,
          loginStatus: payload.data
        };
      }else{
        return{
          ...state
        }
      }
    },
    // 登入按钮状态
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
