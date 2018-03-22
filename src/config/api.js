// export const baseApi = 'http://192.168.1.206:8081';
// export const baseApi = 'http://hhs.ngrok.xiaomiqiu.cn';
// export const baseApi = 'http://admin.zlxlhwl.com';
// export const baseApi = 'http://192.168.1.205:8081';
let baseApi = '';
if (process.env.NODE_ENV == 'development') {
  // baseApi = 'http://192.168.1.205:8081';
  // baseApi = 'http://hhs.ngrok.xiaomiqiu.cn';
  baseApi = 'http://admin.zlxlhwl.com';
}else{
  baseApi = 'http://admin.zlxlhwl.com';
}
export{
  baseApi
}