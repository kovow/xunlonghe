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
export default class PaySearch extends PureComponent {
  constructor(props){
    super(props);
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        const {date} = values;
        dispatch({
          type: 'analysis/fetchPaySearch',
          payload: {
            'search':true,
            'nd':new Date().getTime(),
            "methodNo": values.payMethod.join(','),
            "docDate": date[0].format('YYYY-MM-DD'),
            "docDateTo": date[1].format('YYYY-MM-DD'),
            'rows':10,
            'page':1,
            'sidx':'methodNo',
            'sord':'asc'
          }
        });
      }
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
    let {analysis: {payMethod}} = this.props;
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
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/fetchPaySearch',
      payload: {
        'search':false,
        'nd':new Date().getTime(),
        'rows':10,
        'page':1,
        'sidx':'methodNo',
        'sord':'asc'
      }
    });
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
  }
  render() {
    // 表格数据
    const {analysis: { loading,data,totalCount,totalPage}} = this.props;
    // 表格列数据
    const columns = [{
      title: '付款方式',
      key:'methodNo',
      dataIndex:'methodNo'
    },{
      title: '付款方式',
      key:'methodName',
      dataIndex:'methodName'
    },{
      title: '销售数量',
      key:'cnt',
      dataIndex:'cnt'
    },{
      title: '销售金额',
      key:'amount',
      dataIndex:'amount'
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
      <PageHeaderLayout title="支付查询">
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
