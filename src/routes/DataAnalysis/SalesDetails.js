import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form,  Select, Button,  DatePicker,Icon,Table,Pagination} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
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
export default class SalesDetails extends React.Component {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      expandForm: false, //展开高级搜索,
      form:{}
    };
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        const {date} = values;
        if(values.shopName && values.shopProduct){
          this.props.dispatch({
            type: 'analysis/fetchSales',
            payload: {
              "search": true,
              "nd": new Date().getTime(),
              "shopId": values.shopProduct.join(','),
              "prodId": values.shopProduct.join(','),
              "rows": 10,
              "page": 1,
              "docDate": date[0].format('YYYY-MM-DD'),
              "docDateTo": date[1].format('YYYY-MM-DD'),
              "sidx": "updatedDate",
              "sord": "desc"
            }
          }); 
        }else if(!values.shopName && values.shopProduct){
          this.props.dispatch({
            type: 'analysis/fetchSales',
            payload: {
              "search": true,
              "nd": new Date().getTime(),
              "rows": 10,
              "page": 1,
              "prodId": values.shopProduct.join(','),
              "docDate": date[0].format('YYYY-MM-DD'),
              "docDateTo": date[1].format('YYYY-MM-DD'),
              "sidx": "updatedDate",
              "sord": "desc"
            }
          });
        }else if(!values.shopName && !values.shopProduct){
          this.props.dispatch({
            type: 'analysis/fetchSales',
            payload: {
              "search": true,
              "nd": new Date().getTime(),
              "rows": 10,
              "page": 1,
              "docDate": date[0].format('YYYY-MM-DD'),
              "docDateTo": date[1].format('YYYY-MM-DD'),
              "sidx": "updatedDate",
              "sord": "desc"
            }
          });
        }
      }
    })
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
    let {analysis: {shopCode}} = this.props;
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
            <FormItem label="商品分类">
              {getFieldDecorator('shopProduct')(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple">
                  {shopCode.map((item,i)=>{
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
    let {analysis: {shopName,shopCode}} = this.props;
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
            <FormItem label="商品分类">
              {getFieldDecorator('shopProduct')(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple">
                  {shopCode.map((item,i)=>{
                    return <Option value={item.value} key={item.key}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商家名称">
              {getFieldDecorator('shopName')(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple">
                  {shopName.map((item,i)=>{
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
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/fetchSales',
      payload: {
        "search": false,
        "nd": new Date().getTime(),
        "rows": 10,
        "page": 1,
        "sidx": "updatedDate",
        "sord": "desc"
      }
    });
    // // 获取商品编码
    dispatch({
      type: 'analysis/fetchShopCode',
      payload:{
        'dictName':'Product',
        'pName': '',
        'pValue': '',
        'search':false,
        'nd': new Date().getTime(),
        'rows': 100,
        'page':1,
        'sidx':'value',
        'sord':'asc'
      }
    }).then(()=>{
      // // 获取商家名称 因为再一个接口同时获取回宝异常.  等待一个获取完后再获取另外一个
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
    });
  }
  // 每页显示多少条数据
  onShowSizeChange = (page, size)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'analysis/fetchSales',
      payload: {
        "search": false,
        "nd": new Date().getTime(),
        "rows": size,
        "page": page,
        "sidx": "updatedDate",
        "sord": "desc"
      }
    });
  }
  // 分页改变数据
  handlePagination = (page,size)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'analysis/fetchSales',
      payload: {
        "search": false,
        "nd": new Date().getTime(),
        "rows": size,
        "page": page,
        "sidx": "updatedDate",
        "sord": "desc"
      }
    });
  }
  render() {
    // 表格数据
    const {analysis: { loading,data,totalCount,totalPage,sumInfo}} = this.props;
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
      title: '商品分类',
      key:'prodType',
      dataIndex:'prodType',
    }, {
      title: '商品分类',
      key:'prodTypeName',
      dataIndex:'prodTypeName',
    }, {
      title: '商品编码',
      key:'prodId',
      dataIndex:'prodId',
    },{
      title: '商品名称',
      key:'prodName',
      dataIndex:'prodName',
    },{
      title: '销售数量',
      key:'quantity',
      dataIndex:'quantity',
    },{
      title: '销售单价',
      key:'price',
      dataIndex:'price',
    },{
      title: '销售金额',
      key:'amount',
      dataIndex:'amount',
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
      <PageHeaderLayout title="销售明细">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
          {/* 表格信息 */}
            <Table
              loading={loading}
              rowKey={record => record.key}
              dataSource={data}
              columns={columns}
              pagination={false}      
            />
            {sumInfo && <div style={{textAlign:'right',fontSize:18,padding:'.5rem'}}>商品总价:{sumInfo.amount}元</div>}
            <div className={styles.pagination}>
              <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} defaultCurrent={1} total={totalCount} pageSizeOptions={['10','15','20','25','30','35','40','45','50','100']} onChange={this.handlePagination}/>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
