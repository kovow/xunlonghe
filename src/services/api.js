import { stringify } from 'qs';
import request from '../utils/request';
import {baseApi} from '../config/api';
import {http} from '../utils/ajax';
/**
 *   封装所有请求服务;
 * 基于async await 异步
 */ 
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}
// 登入请求
export async function fakeAccountLogin(params) {
  // return request(`${baseApi}/admin/login`, {
  //   method: 'POST',
  //   body: params
  // });
  return http.post('/admin/api/login',params);
}
// 注销用户
export async function userLogout(){
  return http.post('/admin/api/user/logout');
}

export async function fakeMobileLogin(params) {
  return request('/api/login/mobile', {
    method: 'POST',
    body: params
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
// 获取后台菜单数据
export async function getMenus() {
  return http.get('/admin/api/menu/list');
}
// 获取用户权限
export async function queryPermission(){
  return http.get('/admin/api/role/userRoles'); 
}
/**微信管理api**/
export async function queryShopList(payload){
  if(payload){
    return http.get('/admin/api/wxmall_sys/shop/list'+'?shopName='+payload);
  }else{
    return http.get('/admin/api/wxmall_sys/shop/list');
  }
} 
/**单个图片文件上传接口 */
export async function uploadSigImg(url,formData){
  return http.post(`${url}`,formData);
}
//更新商铺信息
export async function submitShopInfo(shopId,payload){
  return http.post(`/admin/api/wxmall_sys/shop/${shopId}/modify`,payload);
}
//获取商品信息列表
export async function queryShopProductList(payload){
  if(payload){
    if(payload.productName && !payload.shopName){
      return http.get('/admin/api/wxmall_sys/product/productList'+'?productName='+payload.productName);
    }else if(payload.productName && payload.shopName){
      return http.get('/admin/api/wxmall_sys/product/productList'+'?shopName='+payload.shopName+'&productName='+payload.productName);
    }else if(payload.shopName && !payload.productName){
      return http.get('/admin/api/wxmall_sys/product/productList'+'?shopName='+payload.shopName);
    }
  }else{
    return http.get('/admin/api/wxmall_sys/product/productList');
  }
}
// 修改商品信息
export async function submitShopProductInfo(productId,payload){
  return http.post(`/admin/api/wxmall_sys/product/${productId}/modify`,payload);
}
// 获取二维码信息
export async function queryQrcode(){
  return http.get('/admin/api/wxmall_sys/shop/qrcode');
}
// 获取树形分类数据
export async function queryTreeNodeCattegory(){
  return http.get('/admin/api/wxmall_sys/product/categroyList');
}
// 获取卡券列表
export async function queryCoupon(){
  return http.get('/admin/api/wxmall_sys/coupon/list');
}
//添加卡券
export async function submitCoupon(payload){
  return http.post('/admin/api/wxmall_sys/coupon/add',payload);
}
// 删除卡券
export async function submitDeleteCoupon(id){
  return http.post(`/admin/api/wxmall_sys/coupon/${id}/delete`);
}
// 获取微信会员信息
export async function queryUserManger(){
  return http.get('/admin/api/wxmall_sys/member/list');
}
// 获取订单列表
export async function queryOrderList(payload){
  if(payload){
    if(payload.startDate && payload.endDate){
      if(payload.shopName && payload.cellphone && payload.status){
        return http.get(`/admin/api/wxmall_sys/order/list?shopName=${payload.shopName}&cellphone=${payload.cellphone}&status=${payload.status}&startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }else if(payload.shopName && payload.cellphone){
        return http.get(`/admin/api/wxmall_sys/order/list?shopName=${payload.shopName}&cellphone=${payload.cellphone}&startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }else if(payload.cellphone && payload.status){
        return http.get(`/admin/api/wxmall_sys/order/list?cellphone=${payload.cellphone}&status=${payload.status}&startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }else if(payload.shopName && payload.status){
        return http.get(`/admin/api/wxmall_sys/order/list?shopName=${payload.shopName}&status=${payload.status}&startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }else if(payload.cellphone){
        return http.get(`/admin/api/wxmall_sys/order/list?cellphone=${payload.cellphone}&startDate=${payload.startDate}&endDate=${payload.endDate}`); 
      }else if(payload.shopName){
        return http.get(`/admin/api/wxmall_sys/order/list?shopName=${payload.shopName}&startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }else if(payload.status){
        return http.get(`/admin/api/wxmall_sys/order/list?status=${payload.status}&startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }else{
        return http.get(`/admin/api/wxmall_sys/order/list?startDate=${payload.startDate}&endDate=${payload.endDate}`);
      }
    }else{
      if(payload.status){
        return http.get(`/admin/api/wxmall_sys/order/list?status=${payload.status}`);
      }
    }
  }else{
    return http.get(`/admin/api/wxmall_sys/order/list`);
  }
}
// 获取订单详情
export async function queryOrderDetails(id){
  return http.get(`/admin/api/wxmall_sys/order/detail?orderId=${id}`);
}
// 销售明细
export async function querySales(payload){
  return http.post(`/admin/api/da_sys/sales`,payload);
}
// 查询商品类型跟商家名称
export async function queryShopTypeOrShopName(payload){
  return http.post('/admin/api/da_sys/selectData',payload);
}
// 查询商户
export async function queryShop(payload){
  return http.post('/admin/api/da_sys/merchant',payload);
}
// 查询商品
export async function queryProd(payload){
  return http.post('/admin/api/da_sys/product',payload);
}
// 支付明细
export async function queryPayInfo(payload){
  return http.post('/admin/api/da_sys/payInfo',payload);
}
// 支付查询
export async function querySearch(payload){
  return http.post('/admin/api/da_sys/paySearch',payload);
}
// 数据分析(月)
export async function queryDataMonth(payload){
  return http.post('/admin/api/da_sys/dataMonth',payload);
}
// 数据分析(周)
export async function queryDataWeek(payload){
  return http.post('/admin/api/da_sys/dataWeek',payload);
}
// 支付数据分析
export async function queryDataPayType(payload){
  return http.post('/admin/api/da_sys/payData',payload);
}
// 获取商家信息 select (新系统接口)
export async function queryShopInfo(){
  return http.get('/admin/api/da_sys/shopInfo');
}
// 查询微商城交易数据
export async function queryWxOrder(payload){
  return http.post('/admin/api/da_sys/wxOrder',payload);
}
// 获取云田谷信息 select (新系统接口)
export async function querywtShopInfo(){
  return http.get('/admin/api/da_sys/wtShopInfo');
}
// 查询云田谷交易数据
export async function querywtWxOrder(payload){
  return http.post('/admin/api/da_sys/ytWxOrder',payload);
}
// 微商城跟云田谷交易明细
export async function queryWeiYunOrderDetails(payload){
  return http.post('/admin/api/da_sys/wtShopInfo/orderInfo',payload);
}
// 微商城在线交易店铺
export async function queryWxShop(){
  return http.get('/admin/api/wxmall_sys/shopInfo');
}
// 樱花谷订单数据
export async function queryYhOrder(payload){
  if(payload){
    if(payload.status && !payload.cellphone){
      return http.get(`/admin/api/wxmall_sys/yhOrder/list?status=${payload.status}`);
    }else if(payload.cellphone && payload.status){
      return http.get(`/admin/api/wxmall_sys/yhOrder/list?cellphone=${payload.cellphone}&status=${payload.status}`)
    }else if(!payload.status && payload.cellphone){
      return http.get(`/admin/api/wxmall_sys/yhOrder/list?cellphone=${payload.cellphone}`)
    }
  }else{
    return http.get('/admin/api/wxmall_sys/yhOrder/list');
  }
}
export async function queryYhOrderDetails(id){
  return http.get(`/admin/api/wxmall_sys/yhOrder/detail?orderId=${id}`)
}
export async function queryYhOrderHx(payload){
  return http.post(`/admin/api/wxmall_sys/orderStatus/modify?orderId=${payload.id}&actionType=${payload.type}`);
}