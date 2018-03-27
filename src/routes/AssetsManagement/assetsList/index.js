import React, { PureComponent } from 'react';
import {Card,Table,Tag,Modal} from 'antd';
// dva 连接组件
import { connect } from 'dva';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// 资产管理搜索组件
import AssetsSearch from '../../../components/AssetsSearch/search';
import styles from './index.less';
// 添加 编辑资产
import AssetsForms from '../../../components/AssetsSearch/assetsForm';
/***********************资产管理列表********************************/ 
@connect(state=>({
  assets: state.assets
}))
export default class AssetsList extends PureComponent {
  constructor(props){
    super(props);
  }
  state={
    modalVisible: false
  }
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch({
      type:'assets/fetch'
    });
  }
  // 改变状态事件
  handleSelectStatus = (e)=>{
    console.log(e);
  }
  // 菜单1 
  handSelMenu = (e)=>{
    console.log(e);
  }
  // 菜单2
  handSelMenu1 = (e)=>{
    console.log(e);
  }
  // 关闭模态
  handleModalVisible = (val) => {
    this.setState({
      modalVisible: val,
    });
  }
  // 显示模态框
  render() {
    const {assets:{data,loading}} = this.props;
    const {modalVisible} = this.state;
    // // 表格数据
    const columns = [
      { title: '资产ID', width: 100, dataIndex: 'id', key: 'id'},
      { title: '状态', width: 100, dataIndex: 'status', key: 'status',
        render:(e)=>{
          switch(e){
            case '0':
              return <Tag color="#108ee9">闲置</Tag>;
            case '1':
              return <Tag color="#87d068">使用中</Tag>;
            case '2':
              return <Tag color="#2db7f5">调拨中</Tag>
            case '3':
              return <Tag color="#f50">报废</Tag>
          }
        }
      },
      { title: '照片链接地址', dataIndex: 'imgUrl', key: 'imgUrl', width: 150,render:(e)=><img src={e} className={styles.tableImg}/> },
      { title: '资产条码', dataIndex: 'barcode', key: 'barcode', width: 150 },
      { title: '资产名称', dataIndex: 'itemName', key: 'itemName', width: 150 },
      { title: '资产类别', dataIndex: 'assetType', key: 'assetType', width: 150 },
      { title: '规格', dataIndex: 'spec', key: 'spec', width: 150 },
      { title: '单位', dataIndex: 'unit', key: 'unit', width: 150 },
      { title: '金额', dataIndex: 'price', key: 'price', width: 150 },
      { title: '存放地址', dataIndex: 'wharehouse', key: 'wharehouse', width: 150 },
      { title: '购入时间', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 150 },
      { title: '领用部门', dataIndex: 'costDepartment', key: 'costDepartment', width: 150 },
      { title: '使用人', dataIndex: 'user', key: 'user', width: 150 },
      { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 150 },
      { title: '使用期限(月)', dataIndex: 'expiryDate', key: 'expiryDate', width: 150 },
      { title: '来源', dataIndex: 'source', key: 'source', width: 150 },
      { title: '备注', dataIndex: 'remark', key: 'remark', width: 150 }
    ];
    // 选择表单
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    // assetsSearch 组件 
    // 表单布局
    return (
      <PageHeaderLayout title="资产列表">
        <Card bordered={false}>
          <AssetsSearch onSelectStatus={this.handleSelectStatus} onSelMenu={this.handSelMenu} onSelMenu1={this.handSelMenu1} onModalVisible={this.handleModalVisible} menu={[{id:0,name:'资产领用'},{id:1,name:'资产借用'},{id:2,name:'资产调拨'},{id:3,name:'清理报废'}]} menu1={[{id:0,name:'修改'},{id:1,name:'删除'}]}/>
          <Table columns={columns} dataSource={data} scroll={{ x: 1500 }} loading={loading} rowSelection={rowSelection}/>
        </Card>
        <Modal
          title="修改店铺信息"
          visible={modalVisible}
          onCancel={()=>{this.setState({modalVisible:false})}}
          footer={null}
        >
          {/* 添加资产  编辑资产组件*/}
          <AssetsForms onModalVisible={this.handleModalVisible}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
