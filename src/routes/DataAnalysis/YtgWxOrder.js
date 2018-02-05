import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Select, Button, DatePicker,Icon,Modal,message} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableList from '../../components/Table/index';
import styles from './TableList.less';
import moment, { lang } from 'moment'; //时间格式化插件
import {export_json_to_excel} from '../../vendor/Export2Excel';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(state => ({
  analysis: state.analysis,
}))
@Form.create()
class YtgWxOrder extends PureComponent {
  constructor(props){
    super(props);
    // 初始状态
    this.state = {
      modalVisible: false, //显示标记modal
      shopNameArr: [],
      endDate: null,
      startDate: null,
      isFooter: true
    };
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        const {date} = values;
        this.setState({
          startDate: Math.round(new Date(date[0]).getTime()/1000),
          endDate:Math.round(new Date(date[1]).getTime()/1000)
        });
        if(values.shopId){
          dispatch({
            type: 'analysis/fetchWtWxOrder',
            payload: {
              "startDate": Math.round(new Date(date[0]).getTime()/1000),
              "endDate":Math.round(new Date(date[1]).getTime()/1000),
              "shopId": values.shopId.join(',')
            }
          });
        }else{
          dispatch({
            type: 'analysis/fetchWtWxOrder',
            payload: {
              "startDate": Math.round(new Date(date[0]).getTime()/1000),
              "endDate":Math.round(new Date(date[1]).getTime()/1000)
            }
          });
        }
      }
    });
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  // 重置搜索
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  }
  // 过滤导出表格
  formatJson = (filterVal, jsonData)=>{
    return jsonData.map(v => filterVal.map(j => {
      if (j === 'timestamp') {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    }))
  }
  // 下载表格
  handleDownExcel = () => {
    let date = moment.unix(this.state.endDate).format('YYYY-MM-DD');
    const {analysis: { data}} = this.props;
    if(data){
      // import('../../vendor/Export2Excel')
      // .then(excel=>{
        const tHeader = ['序号', '门店名称', '订单金额','支付金额','支付方式','商家优惠金额','平台优惠金额','手续费金额'];
        const filterVal = ['key', 'shopName', 'totalAmount','payAmount','payType','shopDiscount','commonDiscount','charge','display_time'];
        const list = this.formatJson(filterVal, data)
        export_json_to_excel(tHeader, list, '云田谷交易数据'+date);
      // }).then(()=>{
      //   message.success('下载成功');
      // });
    }else{
      message.error('没有数据');
    }
    
  }
  // 下载明细表格
  handleDownDetailExcel = ()=>{
    let date = moment.unix(this.state.endDate).format('YYYY-MM-DD');
    const {analysis: { wy}} = this.props;
    if(wy){
      // import('../../vendor/Export2Excel')
      // .then(excel=>{
        const tHeader = ['序号', '订单时间', '订单编号','门店名称','订单金额','支付金额','支付方式','商家优惠金额','平台优惠金额','手续费金额','支付状态','微信流水号']
        const filterVal = ['key', 'createTime', 'orderNo','shopName','totalAmount','payAmount','payType','shopDiscount','commonDiscount','charge','status','wxOrderNo'];
        const list = this.formatJson(filterVal, wy)
        export_json_to_excel(tHeader, list, '云田谷交易明细'+date);
      // }).then(()=>{
        message.success('下载成功');
        this.handleModalVisible();
      // });
    }else{
      message.error('没有数据');
    }
  }
  // 搜索商户
  handleSelShop = (val)=>{
    let {analysis:{shopName}} = this.props;
    //验证是否是中文
    let pattern = new RegExp("[\u4E00-\u9FA5]+");
    let pattern2 = new RegExp("[A-Za-z]+");
    let name = ''
    if(pattern.test(val)){
      name = val;
    }else if(pattern2.test(val)){
      name = val;
    }
    this.setState({
      shopNameArr: shopName.filter((item)=>{
          return item.index.includes(name);
      })
    });
  }
  // 渲染搜索表单
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    let {analysis:{shopName}} = this.props;
    let {shopNameArr} = this.state;
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
              {getFieldDecorator('shopId')(
                <Select placeholder="请选择" style={{ width: '100%' }} mode="multiple" filterOption={false}  onSearch={this.handleSelShop}>
                  {shopNameArr.length === 0 ?shopName.map((item,i)=>{
                    return <Option value={item.id} key={i}>{item.name}</Option>
                  }) : shopNameArr.map((item,i)=>{
                    return <Option value={item.id} key={i}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleDownExcel}>导出表格</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }
  // 订单详情(单条)
  handleDetails = (text,record,index)=>{
    // fetchWeiYunOrderDetail
    const {dispatch,analysis:{loading}}  = this.props;
    if(record.id){
      dispatch({
        type: 'analysis/fetchWeiYunOrderDetail',
        payload: Object.assign({},{startDate:this.state.startDate,endDate:this.state.endDate,shopId:record.id})
      });
    }else{
      message.error('id不能为空');
    }
    if(!loading){
      this.setState({
        isFooter: false
      });
      this.handleModalVisible();
    }
  }
  // 订单详情(全部)
  handleDetailsAll = ()=>{
    // fetchWeiYunOrderDetail
    const {dispatch,analysis:{loading,data}}  = this.props;
    let shopId = data.map((item)=>{
      return item.id;
    });
    if(shopId.length >0){
      dispatch({
        type: 'analysis/fetchWeiYunOrderDetail',
        payload: Object.assign({},{startDate:this.state.startDate,endDate:this.state.endDate,shopId:shopId.join()})
      });
    }else{
      message.error('id不能为空');
    }
    if(!loading){
      this.setState({
        isFooter: true
      });
      this.handleModalVisible();
    }
  }
  // 获取表格数据
  componentWillMount() {
    const { dispatch } = this.props;
    this.setState({
      startDate: Math.round(new Date().getTime()/1000),
      endDate:Math.round(new Date().getTime()/1000)
    });
    dispatch({
      type: 'analysis/fetchWtWxOrder',
      payload: {
        "startDate": Math.round(new Date().getTime()/1000),
        "endDate": Math.round(new Date().getTime()/1000)
      }
    });
    // // 获取商家名称
    dispatch({
      type: 'analysis/fetchWtShopName'
    });
  }
  render() {
    // 表格数据
    const {analysis: { loading,data,wy}} = this.props;
    const {modalVisible,isFooter} = this.state;
    // 表格列数据
    const columns = [{
      title: '序号',
      key:'key',
      dataIndex:'key'
    },{
      title: '门店名称',
      key:'shopName',
      dataIndex:'shopName'
    },{
      title: '订单金额',
      key:'totalAmount',
      dataIndex:'totalAmount'
    },{
      title: '支付金额',
      key:'payAmount',
      dataIndex:'payAmount'
    },{
      title: '支付方式',
      key:'payType',
      dataIndex:'payType'
    },{
      title: '商家优惠金额',
      key:'shopDiscount',
      dataIndex:'shopDiscount'
    },{
      title: '平台优惠金额',
      key:'commonDiscount',
      dataIndex:'commonDiscount'
    },{
      title: '手续费金额',
      key:'charge',
      dataIndex:'charge'
    },{
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text,record,index) => <Button type="primary" icon="select"  size='small' onClick={()=>this.handleDetails(text,record,index)}>点击查看交易明细</Button>
    }];
    // 表格数据2
    const columns2 = [{
      title: '序号',
      key:'key',
      dataIndex:'key'
    },{
      title: '订单时间',
      key:'createTime',
      dataIndex:'createTime'
    },{
      title: '订单编号',
      key:'orderNo',
      dataIndex:'orderNo'
    },{
      title: '门店名称',
      key:'shopName',
      dataIndex:'shopName'
    },{
      title: '订单金额',
      key:'totalAmount',
      dataIndex:'totalAmount'
    },{
      title: '支付金额',
      key:'payAmount',
      dataIndex:'payAmount'
    },{
      title: '支付方式',
      key:'payType',
      dataIndex:'payType'
    },{
      title: '商家优惠金额',
      key:'shopDiscount',
      dataIndex:'shopDiscount'
    },{
      title: '平台优惠金额',
      key:'commonDiscount',
      dataIndex:'commonDiscount'
    },{
      title: '手续费金额',
      key:'charge',
      dataIndex:'charge'
    },{
      title: '支付状态',
      key:'status',
      dataIndex:'status'
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
      <PageHeaderLayout title="云田谷交易数据">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListForm}>
              {data !== null && <Button type="primary" style={{marginBottom:'24px'}} onClick={this.handleDetailsAll}>显示所有明细</Button>}
            </div>
            {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
            <Modal
              title="交易明细"
              visible={modalVisible}
              onOk={this.handleDownDetailExcel}
              okText="导出明细表格"
              onCancel={this.handleModalVisible}
              width={1000}
              footer={isFooter?[
                <Button key="back" onClick={this.handleModalVisible}>取消</Button>,
                <Button key="submit" type="primary" loading={loading} onClick={this.handleDownDetailExcel}>
                  导出明细表格
                </Button>
              ]:null}
            >
              <TableList
                loading={loading}
                data={wy}
                columns={columns2}
              />
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default YtgWxOrder;
