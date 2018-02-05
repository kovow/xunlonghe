import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Select, Button, DatePicker,Icon} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableList from '../../components/Table/index';
import styles from './TableList.less';
import moment from 'moment'; //时间格式化插件
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(state => ({
  analysis: state.analysis,
}))
@Form.create()
export default class PayInfo extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      expandForm: false, //展开高级搜索,
    };
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        const {date} = values;
        if(values.shopId && values.payMethod){
          dispatch({
            type: 'analysis/fetchPayInfo',
            payload: {
              'search':true,
              'nd':new Date().getTime(),
              "shopId": values.shopId.join(','),
              "methodNo": values.payMethod.join(','),
              "docDate": date[0].format('YYYY-MM-DD'),
              "docDateTo": date[1].format('YYYY-MM-DD'),
              'rows':10,
              'page':1,
              'sidx':'updatedDate',
              'sord':'asc'
            }
          });
        }else if(values.shopId && !values.payMethod){
          dispatch({
            type: 'analysis/fetchPayInfo',
            payload: {
              'search':true,
              'nd':new Date().getTime(),
              "shopId": values.shopId.join(','),
              "docDate": date[0].format('YYYY-MM-DD'),
              "docDateTo": date[1].format('YYYY-MM-DD'),
              'rows':10,
              'page':1,
              'sidx':'updatedDate',
              'sord':'asc'
            }
          });
        }
      }
    });
  }
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  // 展开高级搜索
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    let {analysis: {shopName}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单日期">
              {getFieldDecorator('date',{
                initialValue:[moment(new Date(), dateFormat), moment(new Date(), dateFormat)],
                rules: [{
                  required: true, message: '请选择查询时间',
                }]
              })(
                <RangePicker style={{ width: '100%' }} format={dateFormat}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商家名称">
              {getFieldDecorator('shopId',{
                rules: [{
                  required: true, message: '请选择商家',
                }]
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple">
                  {shopName.map((item,i)=>{
                    return <Option value={item.value} key={item.key}>{item.name}</Option>
                  })}
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
    let {analysis: {shopName,payMethod}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单日期">
              {getFieldDecorator('date',{
                initialValue:[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]
              })(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商家名称">
              {getFieldDecorator('shopId',{
                rules: [{
                  required: true, message: '请选择商家',
                }]
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple">
                  {shopName.map((item,i)=>{
                    return <Option value={item.value} key={item.key}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="付款方式">
              {getFieldDecorator('payMethod',{
                rules: [{
                  required: true, message: '请选择付款方式',
                }]
              })(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple">
                  {payMethod.map((item,i)=>{
                    return <Option value={item.value} key={item.key}>{item.name}</Option>
                  })}
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
      type: 'analysis/fetchPayInfo',
      payload: {
        'search':false,
        'nd':new Date().getTime(),
        'rows':10,
        'page':1,
        'sidx':'updatedDate',
        'sord':'asc'
      }
    });
    // 付款方式
    dispatch({
      type: 'analysis/fetchPayMethod',
      payload:{
        'dictName':'MethodNo',
        'pName': '',
        'pValue': '',
        'search':false,
        'nd': new Date().getTime(),
        'rows': 100,
        'page':1,
        'sidx':'value',
        'sord':'asc'
      }
    });
    // // 获取商家名称
    dispatch({
      type: 'analysis/fetchShopName',
      payload:{
        'dictName':'Shop',
        'pName': '',
        'pValue': '',
        'search':false,
        'nd': new Date().getTime(),
        'rows': 100,
        'page':1,
        'sidx':'value',
        'sord':'asc'
      }
    });
  }
  render() {
    // 表格数据
    const {analysis: { loading,data,totalCount,totalPage}} = this.props;
    // 表格列数据
    const columns = [{
      title: '订单编号',
      key:'docNo',
      dataIndex:'docNo'
    },{
      title: '明细编码',
      key:'docdNo',
      dataIndex:'docdNo'
    },{
      title: '订单日期',
      key:'docDate',
      dataIndex:'docDate'
    },{
      title: '商家编码',
      key:'shopId',
      dataIndex:'shopId'
    },{
      title: '商家名称',
      key:'shopName',
      dataIndex:'shopName'
    },{
      title: '销售金额',
      key:'amount',
      dataIndex:'amount'
    },{
      title: '支付方法',
      key:'methodName',
      dataIndex:'methodName'
    },{
      title: '付款方式',
      key: 'methodNo',
      dataIndex: 'methodNo'
    }];
    
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
      <PageHeaderLayout title="支付明细">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
