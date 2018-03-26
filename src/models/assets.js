import {getAssetsList} from '../services/mock';

export default {
  namespace: 'assets',

  state: {
    data: [],
    loading: true
  },

  effects: {
    *fetch({payload},{put,call}){
      yield put({
        type: 'changeLoading',
        payload: true
      });
      const response = yield call(getAssetsList);
      console.log(response);
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
  },
};
