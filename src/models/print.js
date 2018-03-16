import {queryNote,submitAgency,queryNoteCategory,queryAgency,submitNot, queryPrint} from '../services/api';
import {message} from 'antd';
export default {
  namespace: 'print',
  state: {
    data: [],
    loading: true,
    category:null,
    agency: null
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryNote,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addAgency({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitAgency,payload);
      if(response.data.status === '200'){
        message.success('添加成功');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      }); 
    },
    *fetchCategory({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryNoteCategory,payload);
      yield put({
        type: 'saveCategory',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchAgency({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAgency,payload);
      yield put({
        type: 'saveAgency',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addNot({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitNot,payload);
      if(response.data.status === '200'){
        message.success('添加成功');
        yield put({
          type: 'fetch'
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      }); 
    },
    *fetchPrint({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPrint,payload);
      yield put({
        type: 'savePrint',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
      return response;
    },
  },

  reducers: {
    save(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          data: action.payload.data.result,
        };
      }
    },
    saveCategory(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          category: action.payload.data.result,
        };
      }
    },
    saveAgency(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          agency: action.payload.data.result,
        };
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
