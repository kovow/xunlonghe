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
    *fetch({ payload }, { call, put}) {
      // let s = yield select();    //getState();
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryNote,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            payload: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        
      }
    },
    *addAgency({payload},{call,put}){
      try{
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
      }catch(err){

      } 
    },
    *fetchCategory({payload},{call,put}){
      try{
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
      }catch(err){

      }
    },
    *fetchAgency({payload},{call,put}){
      try{
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
      }catch(err){

      }
    },
    *addNot({payload},{call,put}){
      try{
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
      }catch(err){

      } 
    },
    *fetchPrint({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryPrint,payload);
        // yield put({
        //   type: 'savePrint',
        //   payload: response,
        // });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return response;
      }catch(err){

      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
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
