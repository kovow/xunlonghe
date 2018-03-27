import mockjs from 'mockjs';
import { format, delay } from 'roadhog-api-doc';
const noProxy = process.env.NO_PROXY === 'true';
// ,'type|0-2': 1 
const proxy = {
  'GET /api/tags': mockjs.mock({
    'list|100': [{ 'key|+1': 0,'id|+1': 0, 'status|1': ['0','1','2','3'], 'imgUrl|1': ['http://img1.ph.126.net/lbF_fBty3TbfvWaNr4KoCg==/1046523963411317422.jpg','http://img0.ph.126.net/iny0bAJfja79TxUL-TE5hQ==/2266717987452252591.jpg'],'barcode|1-5': 'PG6sa','itemName|1-3': '圆珠笔','assetType|1':['测试','嘤嘤嘤'],'spec|1':['大','中','小'],'unit|1':['件','份','支'],'price|100-120.2-5':110.24,'wharehouse|1':['厕所','女生宿舍'],'purchaseDate|1':['2015-06-07','2019-11-13','2018-10-01'],'costDepartment|1':['信息部','招商部','服务部'],'user:1-2':['万文峰','龚岚'],'supplier|1':['哇哈哈','腾讯'],'expiryDate|1':['1个月','2个月','3个月','4个月','5个月','6个月'],'source|1':[{id:1,name:'购入',id:2,name:'自建',id:3,name:'租赁',id:4,name:'捐赠',id:5,name:'其他'}],'remark|1':['吃屎吧','好吃就多吃点']}]
  }),
};
export default noProxy ? {} : delay(proxy, 1000);