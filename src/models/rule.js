import { queryShopList, uploadSigImg,submitShopInfo,queryShopProductList,submitShopProductInfo,queryQrcode,queryTreeNodeCattegory,queryCoupon,submitCoupon,submitDeleteCoupon,queryUserManger,queryOrderList,queryOrderDetails,queryWxShop,
  queryYhOrder,
  queryYhOrderDetails,
  queryYhOrderHx,
  queryShopAreaAllList,
  queryShopAreaAdd,
  updateShopArea
} from '../services/api';
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
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopList,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){
      }
    },
    // 商铺图片上传
    *uploadShopLogo({url,payload}, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(uploadSigImg, url,payload);
        if(response.data.status === '200'){
          message.success('上传成功');
          yield put({
            type: 'uploadSigInfo',
            imgSig: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
    },
    // 商铺信息修改
    *updateShopInfo({shopId,payload},{call,put}){
      try{
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
      }catch(err){}
    },
    // 获取商品信息
    *fetchProduct({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopProductList,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
    },
    // 更新商品信息
    *updateShopProductInfo({productId,payload},{call,put}){
      try{
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
      }catch(err){}
    },
    // 二维码列表信息
    // 获取商品信息
    *fetchQrcode({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryQrcode);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
    },
    // 获取树形结构数据
    *fetchTree({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryTreeNodeCattegory);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
    },
    // 获取卡券列表
    *fetchCoupon({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryCoupon);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
    },
    // 添加卡券
    *addCoupon({payload},{call,put}){
      try{
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
      }catch(err){}
      
    },
    // 删除卡券
    *deleteCoupon({id},{call,put}){
      try{
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
      }catch(err){}
    },
    // 获取微商城会员信息
     // 获取商品信息
     *fetchUser({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryUserManger);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    },
    // 模拟删除
    *remove({ payload, callback }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(removeRule, payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
  
        if (callback) callback();
      }catch(err){}
    },
    // 获取订单数据
    *fetchOrderList({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryOrderList,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    },
     // 获取订单详情
    *fetchOrderDetails({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryOrderDetails,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'details',
            details: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    },
    // 查询微商城商户名称
    *fetchShopName({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryWxShop,payload);
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
      }catch(err){}
      
    },
     // 获取订单数据
    *fetchYhOrderList({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryYhOrder,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){} 
      
    },
     // 获取订单详情
    *fetchYhOrderDetails({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryYhOrderDetails,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'details',
            details: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    },
     // 核销退款
    *YhOrderHx({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryYhOrderHx,payload);
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        return response;
      }catch(err){}
      
    },
    // 获取所有区域列表
    *fetchAreaAllList({ payload }, { call, put }) {
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopAreaAllList,payload);
        if(response.data.status === '200'){
          yield put({
            type: 'save',
            data: response.data.result,
          });
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    },
    // 添加区域
    *addArea({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(queryShopAreaAdd,payload);
        if(response.data.status === '200'){
          message.success('添加成功');
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    },
    // 修改区域
    *editArea({payload},{call,put}){
      try{
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        const response = yield call(updateShopArea,payload);
        if(response.data.status === '200'){
          yield put({type:'fetchAreaAllList'});
          message.success('修改成功');
        }
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }catch(err){}
      
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.data,
      };
    },
    details(state, action) {
      return {
        ...state,
        details: action.details,
      };
    },
    saveShopName(state,action){
      return {
        ...state,
        shopName: action.shopName
      };
    },
    uploadSigInfo(state,action){
      return {
        ...state,
        imgSig: action.imgSig
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
