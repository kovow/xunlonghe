import dynamic from 'dva/dynamic';
import { createElement } from 'react';
/* **
*** 更改为自动加载models
*** 增加按需加载
**/ 
// wrapper of dynamic
const dy = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});
// let routerDataCache;

// const modelNotExisted = (app, model) => (
//   // eslint-disable-next-line
//   !app._models.some(({ namespace }) => {
//     return namespace === model.substring(model.lastIndexOf('/') + 1);
//   })
// );

// // wrapper of dynamic
// const dy = (app, models, component) => {
//   // () => require('module')
//   // transformed by babel-plugin-dynamic-import-node-sync
//   if (component.toString().indexOf('.then(') < 0) {
//     models.forEach((model) => {
//       if (modelNotExisted(app, model)) {
//         // eslint-disable-next-line
//         app.model(require(`../models/${model}`).default);
//       }
//     });
//     return (props) => {
//       if (!routerDataCache) {
//         routerDataCache = getNavData(app);
//       }
//       return createElement(component().default, {
//         ...props,
//         routerData: routerDataCache,
//       });
//     };
//   }
//   // () => import('module')
//   return dynamic({
//     app,
//     models: () => models.filter(
//       model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
//     ),
//     // add routerData prop
//     component: () => {
//       if (!routerDataCache) {
//         routerDataCache = getNavData(app);
//       }
//       return component().then((raw) => {
//         const Component = raw.default || raw;
//         return props => createElement(Component, {
//           ...props,
//           routerData: routerDataCache,
//         });
//       });
//     },
//   });
// };

// nav data
export const getNavData = app => [
  {
    component: dy(app, ['menus','login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '首页',
        icon: 'home',
        path: 'welcome',
        component: dy(app, [],() => import('../routes/Welcome')),
      },
      {
        name:'系统管理',
        icon: 'setting',
        path: 'setting',
        children:[{
          name: '用户管理',
          icon: 'user',
          path: 'user_sys',
          component: dy(app, ['setting'],() => import('../routes/Setting/user/index'))
        },{
          name: '添加用户',
          icon: 'add',
          path: 'user_sys/add',
          component: dy(app, ['setting'],() => import('../routes/Setting/user/add'))
        },{
          name: '编辑用户',
          icon: 'edit',
          path: 'user_sys/edit/:userId',
          component: dy(app, ['setting'],() => import('../routes/Setting/user/edit'))
        },{
          name: '角色管理',
          icon: 'lock',
          path: 'role_sys',
          component: dy(app, ['setting'],() => import('../routes/Setting/role/index'))
        },{
          name: '添加角色',
          icon: 'add',
          path: 'role_sys/add',
          component: dy(app, ['setting'],() => import('../routes/Setting/role/add'))
        },{
          name: '编辑角色',
          icon: 'edit',
          path: 'role_sys/edit/:roleId',
          component: dy(app, ['setting'],() => import('../routes/Setting/role/edit'))
        }]
      },
      {
        name: '智慧停车系统',
        icon: 'bulb',
        path: 'cmp',
        children: [{
          name: '监控台',
          icon: 'dashboard',
          path: 'park_sys/p_dashboard',
          component: dy(app, ['chart'], ()=> import('../routes/Dashboard/index'))
        }]
      },
      {
        name: '应急调度系统',
        icon: 'medicine-box',
        path: 'cmp',
        children: [{
          name: '监控台',
          icon: 'dashboard',
          path: 'ers_sys/e_dashboard',
          component: dy(app, ['chart'], ()=> import('../routes/ParkCart/index')),
        },{
          name: '资源管理',
          icon: 'calculator',
          path: 'resource',
          children: [{
            name: '添加资源',
            path: 'add',
            icon: 'plus-square',
            component: dy(app, ['form'], ()=> import('../routes/ErsSys/StepForm')),
            children: [
              {
                path: 'confirm',
                component: dy(app, ['form'], ()=> import('../routes/ErsSys/StepForm/Step2')),
              },
              {
                path: 'result',
                component: dy(app, ['form'], ()=> import('../routes/ErsSys/StepForm/Step3')),
              },
            ],
          }]
        }]
      },
      {
        name: '摆渡车调度系统',
        icon: 'car',
        path: 'cmp',
        children: [{
          name: '监控台',
          icon: 'dashboard',
          path: 'bus_sys/b_dashboard',
          component: dy(app, ['chart'], ()=> import('../routes/ParkCart/index')),
        }]
      },
      {
        name: '资产管理系统',
        icon: 'red-envelope',
        path: 'asset_sys',
        children: [{
          name: '资产管理',
          path: 'asset',
          icon: 'appstore-o',
          children: [{
            name: '资产列表',
            icon: 'profile',
            path: 'assetList',
            component: dy(app, ['rule'], ()=> import('../routes/AssetsManagement/assetsList/index')),
          },{
            name: '借还登记',
            icon: 'schedule',
            path: 'assetBorrow',
            component: dy(app, ['rule'], ()=> import('../routes/AssetsManagement/assetsBorrow/index')),
          }]
        },{
          name: '报表分析',
          path: 'report',
          icon: 'bar-chart',
          children: [{
            name: '资产总览',
            icon: 'pie-chart',
            path: 'overall',
            component: dy(app, ['assets'], ()=> import('../routes/AssetsManagement/reportAnalysis/index')),
          },{
            name: '借还报表',
            icon: 'file-excel',
            path: 'reportBorrow',
            component: dy(app, ['assets'], ()=> import('../routes/AssetsManagement/debitReport/index')),
          }]
        },{
          name: '资产盘点',
          path: 'check',
          icon: 'dot-chart',
          children: [{
            name: '盘点任务',
            icon: 'hourglass',
            path: 'task',
            component: dy(app, ['assets'], ()=> import('../routes/AssetsManagement/countTasks/index')),
          },{
            name: '盘点明细',
            icon: 'plus',
            path: 'item',
            component: dy(app, ['assets'], ()=> import('../routes/AssetsManagement/InventoryDetails/index')),
          }]
        },{
          name: '系统管理',
          icon: 'setting',
          path: 'mgrment',
          children: [{
            name: '资源类型',
            icon: 'database',
            path: 'assetType',
            component: dy(app, ['assets'], ()=> import('../routes/AssetsManagement/assetsType/index')),
          },{
            name: '部门管理',
            icon: 'usergroup-add',
            path: 'department',
            component: dy(app, ['assets'], ()=> import('../routes/Welcome')),
          }]
        }]
      },
      {
        name: '微商城管理系统',
        icon: 'wechat',
        path: 'business/wxmall_sys',
        children: [{
          name: '门店管理',
          icon: 'flag',
          path: 'shop',
          children: [{
            name: '门店列表',
            icon: 'profile',
            path: 'shopList',
            component: dy(app, ['rule'], ()=> import('../routes/Wxmall/shop/ShopList')),
          },{
            name: '台桌二维码',
            icon: 'qrcode',
            path: 'qrcode',
            component: dy(app, ['rule'], ()=> import('../routes/Wxmall/qrCode/QrCode')),
          }]
        },{
          name: '商品管理',
          path: 'product',
          icon: 'shop',
          children: [{
            name: '商品类型',
            // icon: 'layout',
            icon: 'database',
            path: 'categroyList',
            component: dy(app, ['rule'], ()=> import('../routes/Wxmall/categoryList/categoryList')),
          },{
            name: '商品列表',
            icon: 'profile',
            path: 'productList',
            component: dy(app, ['rule'], ()=> import('../routes/Wxmall/shopProduct/ShopProductList')),
          }]
        },{
          name: '会员管理',
          icon: 'user',
          path: 'member',
          children: [{
            name: '会员列表',
            icon: 'profile',
            path: 'memberList',
            component: dy(app, ['rule'], ()=> import('../routes/Wxmall/userManger/UserManger')),
          }]
        },{
          name: '卡券管理',
          path: 'coupon',
          icon: 'rocket',
          children: [{
            name: '卡券列表',
            icon: 'profile',
            path: 'couponList',
            component: dy(app, ['rule'], ()=> import('../routes/Wxmall/coupon/CouponList')),
          }]
        },{
          name: '订单管理',
          path: 'order',
          icon: 'profile',
          children: [{
            name: '订单列表',
            icon: 'profile',
            path: 'orderList',
            component: dy(app,['rule'],()=>import('../routes/Wxmall/order/OrderList'))
          },{
            name: '灯会门票订单列表',
            icon: 'profile',
            path: 'yhOrderList',
            component: dy(app,['rule'],()=>import('../routes/Wxmall/order/YhOrderList'))
          }]
        }]
      },
      {
        name: '数据分析系统',
        icon: 'database',
        path: 'da_sys',
        children: [{
          path: 'sales',
          icon: 'profile',
          name: '销售明细',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/SalesDetails')),
        },{
          path: 'merchant',
          icon: 'profile',
          name: '商家查询',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/Merchant')),
        },{
          path: 'product',
          icon: 'profile',
          name: '商品查询',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/Product')),
        },{
          path: 'payInfo',
          icon: 'profile',
          name: '支付明细',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/PayInfo')),
        },{
          path: 'paySearch',
          icon: 'profile',
          name: '支付查询',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/PaySearch')),
        },{
          path: 'dataMonth',
          icon: 'profile',
          name: '数据分析(月)',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/DataAnalysisMonth')),
        },{
          path: 'dataWeek',
          icon: 'profile',
          name: '数据分析(周)',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/DataAnalysisWeek')),
        },{
          path: 'payData',
          icon: 'profile',
          name: '数据分析(支付)',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/DataAnalysisPayType')),
        },{
          path: 'wxOrder',
          icon: 'profile',
          name: '微商城销售明细',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/WxOrder')),
        },{
          path: 'ytWxOrder',
          icon: 'profile',
          name: '云田谷销售明细',
          component: dy(app, ['analysis'], ()=> import('../routes/DataAnalysis/YtgWxOrder')),
        }] 
      }
      // {
      //   name: 'Dashboard',
      //   icon: 'dashboard',
      //   path: 'dashboard',
      //   children: [
      //     {
      //       name: '分析页',
      //       path: 'analysis',
      //       component: dy(app, [ChartModel], Analysis),
      //     },
      //     {
      //       name: '监控页',
      //       path: 'monitor',
      //       component: dy(app, [MonitorModel], Monitor),
      //     },
      //     {
      //       name: '工作台',
      //       path: 'workplace',
      //       component: dy(app, [ProjectModel, ActivitiesModel, ChartModel], Workplace),
      //     },
      //   ],
      // },
      // {
      //   name: '表单页',
      //   path: 'form',
      //   icon: 'form',
      //   children: [
      //     {
      //       name: '基础表单',
      //       path: 'basic-form',
      //       component: dy(app, ['form'], ()=> import('../routes/Forms/BasicForm')),
      //     },
      //     {
      //       name: '分步表单',
      //       path: 'step-form',
      //       component: dy(app, ['form'], ()=> import('../routes/Forms/StepForm')),
      //       children: [
      //         {
      //           path: 'confirm',
      //           component: dy(app, ['form'], ()=> import('../routes/Forms/StepForm/Step2')),
      //         },
      //         {
      //           path: 'result',
      //           component: dy(app, ['form'], ()=> import('../routes/Forms/StepForm/Step3')),
      //         },
      //       ],
      //     },
      //     {
      //       name: '高级表单',
      //       path: 'advanced-form',
      //       component: dy(app, ['form'], ()=> import('../routes/Forms/AdvancedForm')),
      //     },
      //   ],
      // }, {
      //   name: '列表页',
      //   path: 'list',
      //   icon: 'table',
      //   children: [
      //     {
      //       name: '查询表格',
      //       path: 'table-list',
      //       component: dy(app, ['rule'], ()=>import('../routes/List/TableList')),
      //     },
      //     {
      //       name: '标准列表',
      //       path: 'basic-list',
      //       component: dy(app, ['list'], ()=>import('../routes/List/BasicList')),
      //     },
      //     {
      //       name: '卡片列表',
      //       path: 'card-list',
      //       component: dy(app, ['list'], ()=>import('../routes/List/CardList')),
      //     },
      //     {
      //       name: '搜索列表（项目）',
      //       path: 'cover-card-list',
      //       component: dy(app, ['list'], ()=>import('../routes/List/CoverCardList')),
      //     },
      //     {
      //       name: '搜索列表（应用）',
      //       path: 'filter-card-list',
      //       component: dy(app, ['list'], ()=>import('../routes/List/FilterCardList')),
      //     },
      //     {
      //       name: '搜索列表（文章）',
      //       path: 'search',
      //       component: dy(app, ['list'], ()=>import('../routes/List/SearchList')),
      //     },
      //   ],
      // },
      // {
      //   name: '详情页',
      //   path: 'profile',
      //   icon: 'profile',
      //   children: [
      //     {
      //       name: '基础详情页',
      //       path: 'basic',
      //       component: dy(app, ['profile'], ()=>import('../routes/Profile/BasicProfile')),
      //     },
      //     {
      //       name: '高级详情页',
      //       path: 'advanced',
      //       component: dy(app, ['profile'], ()=>import('../routes/Profile/AdvancedProfile')),
      //     },
      //   ],
      // },
      // {
      //   name: '结果',
      //   path: 'result',
      //   icon: 'check-circle-o',
      //   children: [
      //     {
      //       name: '成功',
      //       path: 'success',
      //       component: dy(app, [], ()=>import('../routes/Result/Success')),
      //     },
      //     {
      //       name: '失败',
      //       path: 'fail',
      //       component: dy(app, [], ()=>import('../routes/Result/Error')),
      //     },
      //   ],
      // },
      // {
      //   name: '异常',
      //   path: 'exception',
      //   icon: 'warning',
      //   children: [
      //     {
      //       name: '403',
      //       path: '403',
      //       component: dy(app, [], ()=>import('../routes/Exception/403')),
      //     },
      //     {
      //       name: '404',
      //       path: '404',
      //       component: dy(app, [], ()=>import('../routes/Exception/404')),
      //     },
      //     {
      //       name: '500',
      //       path: '500',
      //       component: dy(app, [], ()=>import('../routes/Exception/500')),
      //     },
      //   ],
      // },
    ],
  },
  {
    component: dy(app, [], ()=>import('../layouts/UserLayout')),
    path: '/',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dy(app, ['login'], ()=>import('../routes/User/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dy(app, ['register'], ()=>import('../routes/User/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dy(app, [], ()=>import('../routes/User/RegisterResult')),
          },
          {
            name: '403',
            path: '403',
            component: dy(app, [], ()=>import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dy(app, [], ()=>import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dy(app, [], ()=>import('../routes/Exception/500')),
          },
        ],
      },
    ],
  }
];
