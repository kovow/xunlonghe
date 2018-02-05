import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button,  InputNumber, DatePicker, Modal, message,Icon,Tooltip} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class CouponList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      modalVisible: false, //显示标记modal
      initEditData: {}, //初始表格数据
      expandForm: false, //展开高级搜索,
      day: ''
    };
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  // 提交修改商铺表单数据
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'rule/addCoupon',
          payload: values
        });
        form.resetFields();
        this.handleModalVisible();
        this.setState({
          day: ''
        });
      }
    });
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
  }
  // 展开高级搜索
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchCoupon',
    });
  }
  // 检查金额
  checkNum = (rule, value, callback) => {

    if (value > 0) {
      callback();
      return;
    }
    callback('金额需要大于0');
  }
  // 删除卡券
  handleDelete = (record)=>{
    const {id} = record;
    this.props.dispatch({
      type: 'rule/deleteCoupon',
      id: id
    });
  }
  // 改变优惠券过期日期之后显示年月日
  handleValidDate = (item)=>{
    if(item>0){
      this.handleShowDate(item);
    }else{
      this.setState({
        day: '无过期时间'
      });
    }
  }
  // 计算显示日期
  handleShowDate = (n)=>{
    var uom = new Date(new Date()-0+n*86400000); 
    uom = uom.getFullYear() + "-" + (uom.getMonth()+1) + "-" + uom.getDate();
    this.setState({
      day:'卡券将在'+uom+'之后过期'
    });
  }
  render() {
    // 表格数据
    const {rule: { loading, data,imgSig },form:{getFieldDecorator}} = this.props;
    // 表格列数据
    const columns = [{
      title: '卡券ID',
      key:'id',
      dataIndex:'id'
    },{
      title: '卡券使用条件',
      key:'condition',
      dataIndex:'condition'
    },{
      title: '卡券说明',
      key:'couponDesc',
      dataIndex:'couponDesc'
    },{
      title: '卡券名称',
      key:'couponName',
      dataIndex:'couponName'
    },{
      title: '营销类型',
      key:'marketType',
      dataIndex:'marketType'
    },{
      title: '备注',
      key:'remark',
      dataIndex:'remark',
    }, {
      title: '卡券类型',
      key:'type',
      dataIndex:'type',
    }, {
      title: '有效期',
      key: 'validDate',
      dataIndex:'validDate',
    },{
      title: '卡券金额',
      key:'value',
      dataIndex: 'value'
    },{
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record) => <a onClick={() => this.handleDelete(record)}>删除卡券</a>
    }]
    // 状态
    const {modalVisible,initEditData,day} = this.state;
    const mydate = new Date();
    // 表单布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 8,
          offset: 17,
        },
      },
    };
    return (
      <PageHeaderLayout title="卡券列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleModalVisible}>添加卡券</Button>
            </div>
          {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
          </div>
        </Card>
        <Modal
          title="添加卡券"
          visible={modalVisible}
          onCancel={this.handleModalVisible}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <FormItem
              {...formItemLayout}
              label={(<span>
                折扣条件&nbsp;
                <Tooltip title="在用户购物满多少之后才能使用卡券">
                  <Icon type="question-circle-o" />
                </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('condition', {
                rules: [{
                  required: true, message: '请输入满足卡券使用的金额',
                },{validator: this.checkNum},{
                  pattern: /\d/ig,
                  message: '只能输入数字'
                }],
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入满足卡券使用的金额" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="卡券说明"
              hasFeedback
            >
              {getFieldDecorator('couponDesc', {
                rules: [{
                  required: true, message: '请输入卡券说明信息.',
                },{ min: 1, max: 100, message: '长度在 1 到 100 个之间字符'}],
              })(
                <Input placeholder="请输入卡券说明信息." />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="卡券名称"
              hasFeedback
            >
              {getFieldDecorator('couponName', {
                rules: [{ min: 1, max: 10, message: '长度在 1 到 10 之间个字符'},{
                  required: true, message: '请输入卡券名字',
                }],
              })(
                <Input placeholder="请输入卡券名字"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(<span>
                营销类型&nbsp;
                <Tooltip title="输入数字,0代表节假日使用,1代表新注册用户使用">
                  <Icon type="question-circle-o" />
                </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('marketType', {
                rules: [{
                  required: true, message: '请输入营销类型,输入数字,0代表节假日使用,1代表新注册用户使用',
                }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">节假日使用</Option>
                  <Option value="1">新注册用户使用</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="卡券备注"
              hasFeedback
            >
              {getFieldDecorator('remark')(
                <Input placeholder="请输入卡券备注" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(<span>
                卡券类型&nbsp;
                <Tooltip title="输入数字, 1 代表是满减券；2 代表有是折扣券">
                  <Icon type="question-circle-o" />
                </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('type', {
                rules: [{
                  required: true, message: '请选择卡券类型.1 代表是满减券；2 代表有是折扣券',
                }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">满减券</Option>
                  <Option value="2">折扣券</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(<span>
                卡券有效期&nbsp;
                <Tooltip title="输入数字,0 代表有效期无限制；其余数字代表有效日期">
                  <Icon type="question-circle-o" />
                </Tooltip>
                </span>
              )}
              hasFeedback
            >
              <Col span={12}>
                {getFieldDecorator('validDate', {
                  initialValue: "0",
                  rules: [{
                    required: true, message: "输入数字,0 代表有效期无限制；其余数字代表有效日期",
                  },{
                    pattern: /\d/ig,
                    message: '只能输入数字'
                  }],
                })(
                  <InputNumber style={{ width: '100%' }} placeholder="输入数字,0 代表有效期无限制；其余数字代表有效日期" onChange={this.handleValidDate}/>
                )}
              </Col>
              <Col span={12}>
                <div className={styles.datetext}><span>{day}</span></div>
              </Col>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="卡券金额"
              hasFeedback
            >
              {getFieldDecorator('value', {
                rules: [{
                  required: true, message: '请输入卡券金额',
                },{
                  pattern: /\d/ig,
                  message: '只能输入数字'
                }],
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入卡券金额" />
              )}
            </FormItem>
            
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">确定</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
