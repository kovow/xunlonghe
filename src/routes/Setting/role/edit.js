import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Icon,Button,Form,Input,Spin,Tree,message} from 'antd';
import {routerRedux} from 'dva/router';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../TableList.less';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
@connect(state => ({
  setting: state.setting,
}))
@Form.create()
export default class RoleEdit extends PureComponent {
  constructor(props){
    super(props);
  }
  state = {
    autoExpandParent: true,
    checkedKeys: []
  }
  componentDidMount(){
    // 根据角色id 获取需要更新的角色信息
    const {dispatch,match:{params}} = this.props;
    dispatch({
      type: 'setting/fetchEditRole',
      id: params.roleId
    }).then(res=>{
      if(res.data.status === '200'){
        this.setState({
          checkedKeys:res.data.result.permissioId
        });
      }
    });
  }
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch,match:{params}} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if(this.state.checkedKeys.length >0){
          dispatch({
            type:'setting/editRole',
            id: params.roleId,
            payload: Object.assign(values,{'menuIds':this.state.checkedKeys})
          });
        }else{
          message.error('权限不能为空');
        }
      }
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  }
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
  render() {
    const { form:{getFieldDecorator},setting:{loading,data,editData} } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderLayout title="编辑角色">
        <Card bordered={false}>
          { data && editData &&<Form
          onSubmit={this.handleSubmit}
          style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="角色名称"
              hasFeedback
            >
              {getFieldDecorator('roleName', {
                initialValue: editData.roleName,
                rules: [{
                  required: true, message: '请输入角色名称',
                }],
              })(
                <Input placeholder="请输入角色名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色属性"
              hasFeedback
            >
              {getFieldDecorator('roleType', {
                initialValue: editData.roleType,
                rules: [{
                  required: true, message: '请输入任意一个英文字母',
                },{
                  min:1,message:'最少一个以上的英文字母'
                }],
              })(
                <Input placeholder="请输入任意一个英文字母" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色说明"
              hasFeedback
            >
              {getFieldDecorator('description',{
                initialValue: editData.description,
              })(
                <Input placeholder="请输入任意一个英文字母" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(<span><span style={{color:'red',marginRight:2}}>*</span>角色权限</span>)}
            >
              <Tree
                checkable
                onExpand={this.onExpand}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
              >
                {this.renderTreeNodes(data)}
              </Tree>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>取消</Button>
            </FormItem>
            </Form> }
        </Card>
      </PageHeaderLayout>
    );
  }
}
