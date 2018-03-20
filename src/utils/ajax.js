import axios from 'axios';
import {baseApi} from '../config/api';
import {isArray} from 'lodash';
import { notification } from 'antd';
import Cookies from '../vendor/js.cookie.js';
// api 地址
export const http = axios.create({
    baseURL: baseApi,
    timeout:  10000   //设置请求超时时间.在网络不可用或者网络有问题的时候处理错误
});
// 默认请求头
http.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};
//设置 token api 请求头
export function httpToken(token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
};
export function middleware(history,store){
        // 请求拦截
    http.interceptors.request.use((config) => {
        return config;
    },(error) =>{
        return Promise.reject(error);
    });
    // 响应拦截
    http.interceptors.response.use(
        // 返回请求数据
        response => {
            if(response.data.status === '500'){
                notification.error({
                    message: response.data.msg,
                    description: response.data.msg
                });
                return history.push('/user/500');
            }
            if(response.data.status === '0'){
                notification.error({
                    message: response.data.msg,
                    description: response.data.msg
                });
            }
            if(['401','400','403'].indexOf(response.data.status) > -1)
            {
                notification.error({
                    message: response.data.msg,
                    description: response.data.msg
                });
                Cookies.remove('token');
                Cookies.remove('userInfo');
                Cookies.remove('permission');
                store.dispatch({
                    type: 'login/clearLogin'
                });
                return history.push('/user/403');
            }
            // if(response.data.status !== '200'){
            //     notification.error({
            //         message: response.data.msg,
            //         description: response.data.msg
            //     });
            // }
            return response
        },
        (error)=>{
            const {response,request} = error;
            if(request.readyState === 4 && request.status === 0){
                notification.error({
                    message: '网络请求超时',
                    description: '请检查网络'
                });
            
            }
            if([401,400,403].indexOf(response.status) > -1)
            {
                notification.error({
                    message: '没有权限',
                    description: '对不起你没有访问权限!!!!,token过期了!!!!'
                });
                Cookies.remove('token');
                Cookies.remove('permission');
                Cookies.remove('userInfo');
                return history.push('/user/403');
            }
            if([500].indexOf(response.status)){
                notification.error({
                    message: '服务器错误',
                    description: '服务器发生错误.'
                });
                return history.push('/user/500');
            }
            // 如果响应的数据是数组，显示错误数据
            if(isArray(response.data))
            {
                notification.error({
                    message: response.data,
                    description: response.data,
                });
                return history.push('/user/404');
            }else
            {
                notification.error({
                    message: response.data,
                    description: response.data
                });
                return history.push('/user/404');
            }
            return Promise.reject(error);
        }
    );
}
// // 请求拦截
// http.interceptors.request.use((config) => {
//     return config;
// },(error) =>{
//   return Promise.reject(error);
// });
// // 响应拦截
// http.interceptors.response.use(
//     // 返回请求数据
//     response => {
//         if(response.data.status === '500'){
//             notification.error({
//                 message: response.data.msg,
//                 description: response.data.msg
//             });
//         }
//         return response
//     },
//     (error)=>{
//         const {response,request} = error;
//         if(request.readyState == 4 && request.status == 0){
// 			notification.error({
//                 message: '网络请求超时',
//                 description: '请检查网络'
//             });
           
// 		}
//         if([401,400,403].indexOf(response.status) > -1)
//         {
//             notification.error({
//                 message: '没有权限',
//                 description: '请联系管理员!!!!',
//                 onClose: ()=>{
//                     Cookies.remove('token');
//                     Cookies.remove('permission');
//                 }
//             });
//         }
//         if([500].indexOf(response.status)){
//             notification.error({
//                 message: '服务器错误',
//                 description: '服务器发生错误.',
//                 onClose: ()=>{window.location.href = '/user/500';}
//             });
//         }
//         // 如果响应的数据是数组，显示错误数据
//         if(isArray(response.data))
//         {
//             notification.error({
//                 message: response.data,
//                 description: response.data,
//                 onClose: ()=>{window.location.href = '/user/500';}
//             });
//         }else
//         {
//             notification.error({
//                 message: response.data,
//                 description: response.data,
//                 onClose: ()=>{window.location.href = '/user/500';}
//             }); 
//         }
//         return Promise.reject(error);
//     }
// );
