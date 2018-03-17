import {getMenus} from '../services/api';
export default {
  namespace: 'menus',
  state: {
    menus: [],
    loading: false,
  },
  effects: {
    *fetchMenus(_,{call,put,}) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true
        });
        const res = yield call(getMenus);
        if(res.data.status === '200'){
          yield put({
            type: 'saveMenus',
            payload: res.data.result
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false
        });
      }catch(err){
      }
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
        menus: action.payload
      }
    }
  }
};