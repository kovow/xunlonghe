import React, { Component } from 'react';
import { Redirect } from 'dva/router';
import { notification, Spin } from 'antd';
import { connect } from 'dva';
import Cookies from '../vendor/js.cookie.js';
import {Map} from 'immutable';
// 根据后台权限数据匹配前台url;控制后台访问权限,
export default ChildComponent => {
  class RequireAuth extends Component {
    render() {
      // 测试代码
      // return <ChildComponent {...this.props} />;
      let token = Cookies.get('token');
      const props = this.props;
      // console.log(map.get('permission'));
      if(token){ 
        // let permission = props.permission.length >0 ? props.permission : props.loginPermission;
        var map = Map().set('permission',props.permission); 
        if(map.get('permission').length >0){
          let pathname = props.location.pathname;
          if(pathname === '/'){
            return <Redirect to="/welcome" />;
          }else{
            let regPath = pathname.replace(/^\/?/ig,'').replace(/(\/)/ig,'.').replace(/\d/ig,'').replace(/\.$/,'');
            // let regPath = pathname.replace(/^\/?/ig,'').replace(/\//ig,'.').replace(/\//ig,'.');
            // let permission = Cookies.get('permission');
            if(map.get('permission').indexOf(regPath) !== -1){
              return <ChildComponent {...this.props} />;
            }else if(regPath === null || regPath===''){
              return <Spin tip="加载中..."></Spin>
            }else{
              notification.error({
                message: '没有访问权限!!!!',
                description: '对不起你没有访问权限!!!!',
              });
              Cookies.remove('token');
              Cookies.remove('userInfo');
              Cookies.remove('permission');
              // 清空redux 数据
              props.dispatch({
                type: 'login/clearLogin'
              });
              return <Redirect to="/user/403" />;
            }
          }
        }else if(Cookies.get('permission')){
          let pathname = props.location.pathname;
          if(pathname === '/'){
            return <Redirect to="/welcome" />;
          }else{
            let regPath = pathname.replace(/^\/?/ig,'').replace(/(\/)/ig,'.').replace(/\d/ig,'').replace(/\.$/,'');
            // let regPath = pathname.replace(/^\/?/ig,'').replace(/\//ig,'.').replace(/\//ig,'.');
            // let permission = Cookies.get('permission');
            if(Cookies.get('permission').indexOf(regPath) !== -1){
              return <ChildComponent {...this.props} />;
            }else if(regPath === null || regPath===''){
              return <Spin tip="加载中..."></Spin>
            }else{
              notification.error({
                message: '没有访问权限!!!!',
                description: '对不起你没有访问权限!!!!',
              });
              Cookies.remove('token');
              Cookies.remove('userInfo');
              Cookies.remove('permission');
              // 清空redux 数据
              props.dispatch({
                type: 'login/clearLogin'
              });
              return <Redirect to="/user/403" />;
            }
          }
        }else{
          notification.error({
            message: '对不起获取权限失败.',
            description: '请检查网络是否正常',
          });
          return <Redirect to="/user/403" />;
        }
      }else{
        //notification.error({
          //message: '没有访问权限!!!!',
          //description: '对不起你没有登入!!!!,请先登入!!!!',
        //});
        // Cookies.remove('token');
        // Cookies.remove('userInfo');
        return <Redirect to="/user/login" />;
      }
    }
  }
  return connect(state=>({
    loginPermission: state.login.permission,
    permission: state.global.permission
  }))(RequireAuth);
};