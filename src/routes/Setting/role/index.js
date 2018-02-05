import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Icon,Button,Modal,Tag,Tree} from 'antd';
import {routerRedux} from 'dva/router';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../TableList.less';
const TreeNode = Tree.TreeNode;
@connect(state => ({
  setting: state.setting,
}))
export default class Role extends PureComponent {
  constructor(props){
    super(props);

  }
  state = {
    modalVisible: false, //显示标记modal
    showRoleData: undefined
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/fetchRoleList',
    });
  }
  // 添加角色
  handleAddRole = ()=>{
    this.props.dispatch(routerRedux.push('/setting/role_sys/add'));
  }
   // 编辑 
  handleRoleEdit = (record)=>{
    this.props.dispatch(routerRedux.push('/setting/role_sys/edit/'+record.id));
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 渲染权限结点
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  // 显示角色详情
  handleShowRole = (record)=>{
    this.setState({
      modalVisible: true,
      showRoleData: record
    });
  }
  render() {
    // 表格数据
    const {setting: { loading, data}} = this.props;
    const {showRoleData} = this.state;
    // 表格列数据
    const columns = [{
      title: 'id',
      key:'id',
      dataIndex:'id',
    }, {
      title: '角色名',
      key:'roleName',
      dataIndex:'roleName',
    }, {
      title: '角色属性',
      key:'roleType',
      dataIndex:'roleType',
    },{
      title: '角色状态',
      key:'status',
      dataIndex:'status',
    },{
      title: '角色说明',
      key: 'description',
      dataIndex: 'description'
    },{
      title: '操作',
      key: 'actions',
      dataIndex: 'actions',
      render: (e,record,index)=><div><Button type="primary" icon="edit" size='small' onClick={() => this.handleRoleEdit(record)} style={{marginBottom:'.2rem',marginRight:'.2rem'}}>修改</Button><Button type="primary"  style={{marginTop:'.2rem'}} onClick={()=>{this.handleShowRole(record)}} size='small'>点击查看角色权限</Button></div>
    }];
    return (
      <PageHeaderLayout title="角色管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleAddRole}>添加角色</Button>
          </div>
          {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
          </div>
          <Modal
            title="查看角色信息"
            visible={this.state.modalVisible}
            onCancel={this.handleModalVisible}
            onOk={this.handleModalVisible}
          >
            {showRoleData && <div>
              <h3 className={styles.textAlign}><span>角色名:</span> <Tag color="magenta">{showRoleData.roleName}</Tag></h3>
              <h5 className={styles.textAlign}><span>角色属性:</span><Tag color="magenta">{showRoleData.roleType}</Tag></h5> 
              <div className={styles.borderDiv}>
              <h3 className={styles.textAlign}><span>角色权限:</span></h3>
                <Tree
                // defaultExpandAll
                showLine
                draggable={true}
                >
                  {this.renderTreeNodes(showRoleData.menus)}
                </Tree>
              </div>
            </div> }
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
