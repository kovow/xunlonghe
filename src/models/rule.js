import { queryShopList, uploadSigImg,submitShopInfo,queryShopProductList,submitShopProductInfo,queryQrcode,queryTreeNodeCattegory,queryCoupon,submitCoupon,submitDeleteCoupon,queryUserManger,queryOrderList,queryOrderDetails,queryWxShop } from '../services/api';
import {message} from 'antd';
export default {
  namespace: 'rule',
  state: {
    data: [],
    details: [],
    loading: true,
    imgSig: {},
    shopName:[]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 商铺图片上传
    *uploadShopLogo({url,payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(uploadSigImg, url,payload);
      yield put({
        type: 'uploadSigInfo',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 商铺信息修改
    *updateShopInfo({shopId,payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitShopInfo, shopId,payload);
      // 更新商铺信息成功之后重新异步调用获取商铺列表以更新信息;
      if(response.data.status === '200'){
        message.success(response.data.msg);
        yield put({
          type: 'fetch'
        });
      }else{
        message.error('修改失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取商品信息
    *fetchProduct({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryShopProductList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 更新商品信息
    *updateShopProductInfo({productId,payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitShopProductInfo,productId,payload);
      if(response.data.status === '200'){
        message.success(response.data.msg);
        yield put({
          type: 'fetchProduct'
        });
      }else{
        message.error('修改失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 二维码列表信息
    // 获取商品信息
    *fetchQrcode({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryQrcode);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取树形结构数据
    *fetchTree({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTreeNodeCattegory);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取卡券列表
    *fetchCoupon({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCoupon);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 添加卡券
    *addCoupon({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitCoupon,payload);
      // 添加成功卡券之后重新获取卡券列表信息
      if(response.data.status === '200'){
        message.success(response.data.msg);
        yield put({
          type: 'fetchCoupon'
        });
      }else{
        message.error('添加失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 删除卡券
    *deleteCoupon({id},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(submitDeleteCoupon,id);
      // 添加成功卡券之后重新获取卡券列表信息
      if(response.data.status === '200'){
        message.success(response.data.msg);
        yield put({
          type: 'fetchCoupon'
        });
      }else{
        message.error('删除失败');
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 获取微商城会员信息
     // 获取商品信息
     *fetchUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUserManger);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 模拟删除
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    // 获取订单数据
    *fetchOrderList({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderList,payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
     // 获取订单详情
    *fetchOrderDetails({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryOrderDetails,payload);
      yield put({
        type: 'details',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    // 查询微商城商户名称
    *fetchShopName({payload},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryWxShop,payload);
      yield put({
        type: 'saveShopName',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
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
    details(state, action) {
      if(action.payload.data.status === '200'){
        return {
          ...state,
          details: action.payload.data.result,
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
    uploadSigInfo(state,action){
      if(action.payload.data.status === '200'){
        message.success('上传成功');
        return {
          ...state,
          imgSig: action.payload.data.result
        }
      }else{
        message.error('上传失败');
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
