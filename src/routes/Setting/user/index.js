import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Icon,Button,Modal,Tag,Tree,Switch} from 'antd';
import {routerRedux} from 'dva/router';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../TableList.less';
const TreeNode = Tree.TreeNode;
@connect(state => ({
  setting: state.setting,
}))
export default class User extends PureComponent {
  constructor(props){
    super(props);

  }
  state = {
    modalVisible: false, //显示标记modal
    showUserData: undefined
  }
  // 获取表格数据
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/fetchUserList',
    });
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 添加角色
  handleAddRole = ()=>{
    this.props.dispatch(routerRedux.push('/setting/user_sys/add'));
  }
   // 编辑 
  handleRoleEdit = (record)=>{
    this.props.dispatch(routerRedux.push('/setting/user_sys/edit/'+record.id));
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
  // 显示用户详情
  handleShowUser = (record)=>{
    this.setState({
      modalVisible: true,
      showUserData: record
    });
  }
  // 改变用户状态
  handleChangeStatus = (e,record)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'setting/changeUserStatus',
      id: record.id
    });
  }
  render() {
    // 表格数据
    const {setting: { loading, data}} = this.props;
    const {showUserData} = this.state;
    // 表格列数据
    const columns = [{
      title: 'id',
      key:'id',
      dataIndex:'id',
    }, {
      title: '用户头像',
      key:'avatar',
      dataIndex:'avatar',
      render: (e) => <img src={e} style={{width:50,height:50,borderRadius:'50%'}}/>
    }, {
      title: '手机号码',
      key:'mobile',
      dataIndex:'mobile',
    },{
      title: '用户名称',
      key:'realName',
      dataIndex:'realName',
    },{
      title: '登入账号名称',
      key:'username',
      dataIndex:'username',
    }, {
      title: '创建时间',
      key:'createTime',
      dataIndex:'createTime',
    }, {
      title: '用户角色',
      key:'role',
      dataIndex:'role',
      render: (e)=><Tag color="magenta">{e ? e.roleName : ''}</Tag>
    },{
      title: '用户状态',
      key:'status',
      dataIndex:'status',
      render: (e,record)=><Switch style={{marginTop:'.2rem'}} checkedChildren={e===1 ? '启用' : ''} unCheckedChildren={e===0 ? '禁用' : ''}  defaultChecked={e===1?true:false} onChange={(event)=>this.handleChangeStatus(event,record)}/>
    },{
      title: '操作',
      key: 'actions',
      dataIndex: 'actions',
      render: (e,record,index)=><div><Button type="primary" icon="edit" size='small' onClick={() => this.handleRoleEdit(record)} style={{marginBottom:'.2rem',marginRight:'.2rem'}}>修改</Button><Button type="primary"  style={{marginTop:'.2rem'}} onClick={()=>{this.handleShowUser(record)}} size='small'>点击查看用户角色</Button></div>
    }];
    return (
      <PageHeaderLayout title="用户管理管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleAddRole}>添加用户</Button>
          </div>
          {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
          </div>
          <Modal
            title="查看用户信息"
            visible={this.state.modalVisible}
            onCancel={this.handleModalVisible}
            onOk={this.handleModalVisible}
          >
          {showUserData && <div>
              <h3 className={styles.textAlign}><span>用户角色:</span> <Tag color="magenta">{showUserData.role.roleName}</Tag></h3>
              <h3 className={styles.textAlign}><span>用户姓名:</span> <Tag color="magenta">{showUserData.realName}</Tag></h3>
              <h5 className={styles.textAlign}><span>用户登入名:</span><Tag color="magenta">{showUserData.username}</Tag></h5>  
              <h5 className={styles.textAlign}><span>用户手机:</span><Tag color="magenta">{showUserData.mobile}</Tag></h5>  
              <h5 className={styles.textAlign}><span>用户头像:</span><img src={showUserData.avatar} style={{width:50,height:50,borderRadius:'50%'}}/></h5>
              <div className={styles.borderDiv}>
                <h3 className={styles.textAlign}><span>角色权限:</span></h3>
                <Tree
                // defaultExpandAll
                showLine
                draggable={true}
                >
                  {this.renderTreeNodes(showUserData.menus)}
                </Tree>
              </div>
            </div>
          }
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
