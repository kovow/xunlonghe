import {getMenus} from '../services/api';
export default {
  namespace: 'menus',
  state: {
    menus: [],
    loading: false,
  },
  effects: {
    *fetchMenus(_,{call,put,}) {
      yield put({
          type: 'changeLoading',
          payload: true
      });
      const res = yield call(getMenus);
      yield put({
        type: 'saveMenus',
        payload: res.data
      });
      yield put({
        type: 'changeLoading',
        payload: false
      });
    }
  },
  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveMenus(state,action){
      return {
        ...state,
        menus: action.payload.result
      }
    }
  }
};