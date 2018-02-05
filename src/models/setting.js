import { routerRedux } from 'dva/router';
import {queryRoleList,queryPermissionList,addRole,queryUserList, addUser,queryEditRole,updateRole,queryEditUser,updateUser,updateUserStatus} from '../services/user';
import {message} from 'antd';
export default {
  namespace: 'setting',
  state: {
    list:[],
    loading: true,
    editData: undefined
  },
  effects: {
    // 获取角色列表 
    *fetchRoleList({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRoleList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取编辑角色信息 
    *fetchEditRole({ id }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'fetchPermissionList'
      });
      const response = yield call(queryEditRole,id);
      yield put({
        type: 'edit',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return response;
    },
    // 获取用户列表 
    *fetchUserList({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取权限列表 
    *fetchPermissionList({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPermissionList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取编辑用户信息
    *fetchEditUser({ id }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield put({
        type: 'fetchRoleList'
      });
      const response = yield call(queryEditUser,id);
      yield put({
        type: 'edit',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 添加角色
    *createRole({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addRole,payload);
      if(response.data.status === '200'){
        message.success('添加成功');
        yield put(routerRedux.goBack());
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 编辑角色
    *editRole({ id,payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateRole,id,payload);
      if(response.data.status === '200'){
        message.success('编辑成功');
        yield put(routerRedux.goBack());
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 创建用户
    *createUser({ payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addUser,payload);
      if(response.data.status === '200'){
        message.success('添加成功');
        yield put(routerRedux.goBack());
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 编辑用户信息
    *editUser({ id,payload }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateUser,id,payload);
      if(response.data.status === '200'){
        message.success('编辑成功');
        yield put(routerRedux.goBack());
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 改变用户状态
    *changeUserStatus({ id }, { call, put,selected }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateUserStatus,id);
      if(response.data.status === '200'){
        yield put({
          type: 'fetchUserList'
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    save(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          data: action.payload.data.result,
        };
      }
    },
    edit(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          editData: action.payload.data.result,
        };
      }else{
        return{
          ...state
        }
      }
    },
  },
};
