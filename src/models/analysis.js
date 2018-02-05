import {querySales,queryShopTypeOrShopName,queryShop,queryProd,queryPayInfo,querySearch,queryDataMonth,queryDataWeek,queryDataPayType,queryShopInfo,queryWxOrder,querywtShopInfo,querywtWxOrder,queryWeiYunOrderDetails} from '../services/api';

export default {
  namespace: 'analysis',

  state: {
    data: [],
    echarData:{},
    shopCode:[],
    shopName:[],
    loading: true,
    totalCount: 0,
    totalPage: 0,
    payMethod: [],
    wy:[]
  },

  effects: {
    *fetchSales({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(querySales,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询商品分类
    *fetchShopCode({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopTypeOrShopName,payload);
      yield put({
        type: 'saveShopCode',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询商户名称
    *fetchShopName({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopTypeOrShopName,payload);
      yield put({
        type: 'saveShopName',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询支付方式
    *fetchPayMethod({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopTypeOrShopName,payload);
      yield put({
        type: 'savePayMethod',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询商户
    *fetchShop({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShop,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询商品
    *fetchProd({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProd,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询支付明细
    *fetchPayInfo({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryPayInfo,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
     // 支付查询
     *fetchPaySearch({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(querySearch,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    //数据分析 (月)
    *fetchDataMonth({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDataMonth,payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    //数据分析 (周)
    *fetchDataWeek({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDataWeek,payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    //支付数据分析 (周)
    *fetchDataPayType({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDataPayType,payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询商户信息  (微商城交易系统用)
    *fetchShopNameOne(_,{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopInfo);
      yield put({
        type: 'saveShopName',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询微商城交易数据  (微商城交易系统用)
    *fetchWxOrder({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryWxOrder,payload);
      yield put({
        type: 'saveOne',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
     // 查询云田谷信息  (微商城交易系统用)
     *fetchWtShopName(_,{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(querywtShopInfo);
      yield put({
        type: 'saveShopName',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询微商城交易数据  (微商城交易系统用)
    *fetchWtWxOrder({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(querywtWxOrder,payload);
      yield put({
        type: 'saveOne',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询微商城跟云田谷交易明细
    *fetchWeiYunOrderDetail({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryWeiYunOrderDetails,payload);
      yield put({
        type: 'saveWeiYun',
        payload: response,
      });
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
    saveShopCode(state,action){
      if(action.payload.data.status === '200'){
        return {
          ...state,
          shopCode: action.payload.data.result
        };
      }
    },
    saveShopName(state,action){
      if(action.payload.data.status === '200'){
        return {
          ...state,
          shopName: action.payload.data.result
        };
      }
    },
    savePayMethod(state,action){
      if(action.payload.data.status === '200'){
        return {
          ...state,
          payMethod: action.payload.data.result
        };
      }
    },
    save(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          data: action.payload.data.result.resultList,
          totalCount: action.payload.data.result.totalCount,
          totalPage: action.payload.data.result.totalPage
        };
      }
    },
    saveOne(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          data: action.payload.data.result,
        };
      }
    },
    // 微信云田谷交易明细
    saveWeiYun(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          wy: action.payload.data.result,
        };
      }
    },
    saveData(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          echarData: action.payload.data.result,
        };
      };
    },
  },
};