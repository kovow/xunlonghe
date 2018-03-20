import {querySales,queryShopTypeOrShopName,queryShop,queryProd,queryPayInfo,querySearch,queryDataMonth,queryDataWeek,queryDataPayType,queryShopInfo,queryWxOrder,querywtShopInfo,querywtWxOrder,queryWeiYunOrderDetails} from '../services/api';
import {errorMessage} from '../utils/utils'
export default {
  namespace: 'analysis',

  state: {
    data: [],
    echarData:{},
    shopCode:[],
    shopName:[],
    sumInfo:null,
    loading: true,
    totalCount: 0,
    totalPage: 0,
    payMethod: [],
    wy:[]
  },

  effects: {
    *fetchSales({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(querySales,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result.resultList,
            totalCount: response.data.result.totalCount,
            totalPage: response.data.result.totalPage,
            sumInfo:response.data.result.sumInfo
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取销售明细失败');
      }
    },
    // 查询商品分类
    *fetchShopCode({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopTypeOrShopName,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveShopCode',
            shopCode: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取商品分类失败');
      }
    },
    // 查询商户名称
    *fetchShopName({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopTypeOrShopName,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveShopName',
            shopName: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取商户名称失败');
      }
    },
    // 查询支付方式
    *fetchPayMethod({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopTypeOrShopName,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'savePayMethod',
            payload: response,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取查询方式失败');
      }
    },
    // 查询商户
    *fetchShop({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShop,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result.resultList,
            totalCount: response.data.result.totalCount,
            totalPage: response.data.result.totalPage,
            sumInfo:response.data.result.sumInfo
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取商户失败');
      }
    },
    // 查询商品
    *fetchProd({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryProd,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result.resultList,
            totalCount: response.data.result.totalCount,
            totalPage: response.data.result.totalPage,
            sumInfo:response.data.result.sumInfo
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取商品信息失败');
      }
    },
    // 查询支付明细
    *fetchPayInfo({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryPayInfo,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result.resultList,
            totalCount: response.data.result.totalCount,
            totalPage: response.data.result.totalPage,
            sumInfo:response.data.result.sumInfo
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取支付明细失败');
      }
    },
     // 支付查询
     *fetchPaySearch({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(querySearch,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result.resultList,
            totalCount: response.data.result.totalCount,
            totalPage: response.data.result.totalPage,
            sumInfo:response.data.result.sumInfo
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取支付信息失败');
      }
    },
    //数据分析 (月)
    *fetchDataMonth({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryDataMonth,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveData',
            echarData: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取数据分析(月)失败');
      }
    },
    //数据分析 (周)
    *fetchDataWeek({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryDataWeek,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveData',
            echarData: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取数据分析(周)失败');
      }
    },
    //支付类型
    *fetchDataPayType({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryDataPayType,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveData',
            echarData: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取数据分析支付类型失败');
      }
    },
    // 查询商户信息  (微商城交易系统用)
    *fetchShopNameOne(_,{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopInfo);
        if(response.data.status === '200'){
          yield put({
            type: 'saveShopName',
            shopName: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取商户信息失败');
      }
    },
    // 查询微商城交易数据  (微商城交易系统用)
    *fetchWxOrder({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryWxOrder,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveOne',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取微商城数据失败');
      }
    },
     // 查询云田谷信息  (微商城交易系统用)
    *fetchWtShopName(_,{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(querywtShopInfo);
        if(response.data.status === '200'){
          yield put({
            type: 'saveShopName',
            shopName: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取商户名称失败');
      }
    },
    // 查询微商城交易数据  (微商城交易系统用)
    *fetchWtWxOrder({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(querywtWxOrder,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveOne',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取微商城订单数据失败');
      }
    },
    // 查询微商城跟云田谷交易明细
    *fetchWeiYunOrderDetail({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryWeiYunOrderDetails,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'saveWeiYun',
            wy: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
        errorMessage('获取云田谷交易数据失败');
      }
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
      return {
        ...state,
        shopCode: action.shopCode
      };
    },
    saveShopName(state,action){
      return {
        ...state,
        shopName: action.shopName
      };
    },
    savePayMethod(state,action){
      return {
        ...state,
        payMethod: action.payload.data.result
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        totalPage: action.totalPage,
        sumInfo: action.sumInfo
      };
    },
    saveOne(state, action) {
      return {
        ...state,
        data: action.data,
      };
    },
    // 微信云田谷交易明细
    saveWeiYun(state, action) {
      return {
        ...state,
        wy: action.wy,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        echarData: action.echarData,
      };
    },
  },
};