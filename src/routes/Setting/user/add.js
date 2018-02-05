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
export default class UserAdd extends PureComponent {
  constructor(props){
    super(props);
  }
  state = {
    confirmDirty: false
  };
  componentDidMount(){
    // 获取权限信息
    const {dispatch} = this.props;
    dispatch({
      type:'setting/fetchRoleList'
    });
  }
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
       dispatch({
          type:'setting/createUser',
          payload:values
       });
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  render() {
    const { form:{getFieldDecorator},setting:{loading,data} } = this.props;
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
          { data &&<Form
          onSubmit={this.handleSubmit}
          style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="手机号码"
              hasFeedback
            >
              {getFieldDecorator('mobile', {
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
                rules: [{
                  required: true, message: '请输入登入账户名',
                },{
                  min: 3,message:'登入用户名不能少于3个字符'
                },{
                  max: 10,message:'登入用户名最多只能输入10个字符'
                },],
              })(
                <Input placeholder="请输入登入账户名" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="登入密码"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '登入密码不能为空',
                },{
                  min: 8,message:'请输入不少于8位数的英文或英文字母组合密码'
                },{
                  max: 20,message:'请输入不能多余20位数的英文或英文字母组合密码'
                },{
                  validator: this.checkPassword,
                }],
              })(
                <Input placeholder="请输入登入密码" type="password"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '确认密码不能为空.',
                },{
                  min: 8,message:'请输入不少于8位数的英文或英文字母组合密码'
                },{
                  max: 20,message:'请输入不能多余20位数的英文或英文字母组合密码'
                },{
                  validator: this.checkPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="选择用户角色"
              hasFeedback
            >
              {getFieldDecorator('roleId',{
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
