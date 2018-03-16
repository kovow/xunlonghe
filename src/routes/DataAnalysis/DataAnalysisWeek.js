import React,{PureComponent} from 'react';
import {Row,Col,Card,Form, Select, Button, DatePicker,Icon} from 'antd';
// dva 连接组件
import { connect } from 'dva';
import Bar from '../../components/Charts/Bar/index';
// 面包屑
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import moment from 'moment'; //时间格式化插件
const FormItem = Form.Item;
const { Option } = Select;
const {MonthPicker} = DatePicker;
const dateFormat = 'YYYY/MM';
@connect(state => ({
  analysis: state.analysis,
}))
@Form.create()
class DataAnalysisWeek extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };
  componentWillMount(){
    const {dispatch} = this.props;
    dispatch({
      type: 'analysis/fetchDataWeek',
      payload:Object.assign({},{udf1: '',udf2: ''})
    });
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
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        const {udf1,udf2,shopId} = values;
        if(shopId){
          dispatch({
            type: 'analysis/fetchDataWeek',
            payload: {
              'udf1':udf1.format('YYYY-MM'),
              'udf2':udf2.format('YYYY-MM'),
              'shopId': shopId.join(',')
            }
          });
        }else{
          dispatch({
            type: 'analysis/fetchDataWeek',
            payload: {
              'udf1':udf1.format('YYYY-MM'),
              'udf2':udf2.format('YYYY-MM')
            }
          });
        }
      }
    });
  }
  /***限制时间***/
  disabledStartDate = (startValue) => {
    if (!startValue) {
      return false;
    }
    return startValue.valueOf() <= 1475251200000;
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return true;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  } 
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    let {analysis:{shopName}} = this.props;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="开始日期">
              {getFieldDecorator('udf1',{
                rules: [{
                  required: true, message: '请选择查询开始时间',
                }],
                initialValue: startValue
              })(
                <MonthPicker 
                  style={{ width: '100%' }} 
                  format={dateFormat} 
                  disabledDate={this.disabledStartDate}
                  // value={startValue}
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('udf2',{
                rules: [{
                  required: true, message: '请选择查询结束时间',
                }],
                initialValue: endValue
              })(
                <MonthPicker 
                  style={{ width: '100%' }}
                  format={dateFormat}
                  disabledDate={this.disabledEndDate}
                  // value={endValue}
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="选择商户">
              {getFieldDecorator('shopId')(
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }
  render(){
    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      style: { marginBottom: 24 },
    };
    let {analysis:{echarData,loading}} = this.props;
    const option = {
      title: {
        show: true,
        text: '数据分析(周)',
        x: 'center',
        textStyle: {
          color: '#000',
          fontSize: '180%',
          align: 'center'
        }
      },
      color: ['#3398DB'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['销售总额'],
        bottom: '10px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [{
        type : 'category',
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis : [{
        type : 'value'
      }],
      series : [{
        name:'销售总额',
        type:'bar',
        barWidth: '60%'
      }]
    };
    return(
      <PageHeaderLayout title="数据分析(周)">
        <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <Card
                  bodyStyle={{ padding: 24 }}
                  bordered={false}
                  title="数据分析(周)"
                  loading={loading}
              >
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  {this.renderForm()}
                </div>
              </div>
              {Object.keys(echarData).length !== 0 && <Bar
                  height={700}
                  options={option}
                  data={echarData}
                />}
              </Card>
            </Col>
          </Row>
        </PageHeaderLayout>
    );
  }
}
export default DataAnalysisWeek;