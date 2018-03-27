import {getAssetsList} from '../services/mock';

export default {
  namespace: 'assets',

  state: {
    data: [],
    loading: true
  },

  effects: {
    *fetch({payload},{put,call}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true
        });
        const response = yield call(getAssetsList);
        if(response.status === 200){
          yield put({
            type: 'save',
            payload: response.data.list
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false
        });
      }catch{
        
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
    save(state,action){
      return{
        ...state,
        data:action.payload
      }
    }
  },
};
