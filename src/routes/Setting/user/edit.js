import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Icon,Button,Form,Input,message,Radio,Tag} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../TableList.less';
import { lang } from 'moment';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@connect(state => ({
  setting: state.setting,
}))
@Form.create()
export default class UserEdit extends PureComponent {
  constructor(props){
    super(props);
  }
  state = {
    confirmDirty: false
  };
  componentDidMount(){
    // 获取权限信息
    const {dispatch,match:{params}} = this.props;
    dispatch({
      type:'setting/fetchEditUser',
      id: params.userId
    });
  }
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch,match:{params}} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
       dispatch({
          type:'setting/editUser',
          id: params.userId,
          payload:values
       });
      }
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
      <PageHeaderLayout title="添加用户">
        <Card bordered={false}>
          { data && editData && <Form
          onSubmit={this.handleSubmit}
          style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="手机号码"
              hasFeedback
            >
              {getFieldDecorator('mobile', {
                initialValue: editData.mobile,
                rules: [{
                  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
                  message: '请输入正确的手机号码'
                }],
              })(
                  <Input placeholder="请输入手机号码!" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="真实姓名"
              hasFeedback
            >
              {getFieldDecorator('realName', {
                initialValue: editData.realName,
                rules: [{
                  required: true, message: '请输入用户名称',
                },{
                  pattern: new RegExp("[\u4E00-\u9FA5]+"), message: '请输入中文'
                }],
              })(
                <Input placeholder="请输入用户名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="登入账户名"
              hasFeedback
            >
              {getFieldDecorator('username', {
                initialValue: editData.username,
                rules: [{
                  required: true, message: '请输入登入账户名',
                },{
                  min: 3,message:'登入用户名不能少于3个字符'
                },{
                  max: 10,message:'登入用户名最多只能输入10个字符'
                },],
              })(
                <Input placeholder="请输入登入账户名" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择用户角色"
              hasFeedback
            >
              {getFieldDecorator('roleId',{
                initialValue: editData.role.id,
                rules: [{
                  required: true, message: '角色不能为空.',
                }]
              })(
                <RadioGroup>
                  { data && data.map((item)=>{
                    // console.log(item)
                    return <div key={item.key}><Radio value={item.id} key={item.key}>{item.roleName}</Radio><Tag color="#2db7f5">{item.roleType}</Tag></div>
                  })}
                </RadioGroup>
              )}
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
