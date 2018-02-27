import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, message,Icon,Tabs} from 'antd';
import moment from 'moment';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';
const FormItem = Form.Item;
const { TabPane } = Tabs;
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class YhOrderList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      modalVisible: false, //显示标记modal
      shopName: '',
      activeKey: ''
    };
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch,form} = this.props;
    form.validateFields((err,value)=>{
      if(!err){
        if(value.cellphone && this.state.activeKey){
          dispatch({
            type: 'rule/fetchYhOrderList',
            payload: Object.assign(value,{status:this.state.activeKey})
          });
        }else if(value.cellphone){
          dispatch({
            type: 'rule/fetchYhOrderList',
            payload: value
          });
        }else{
          dispatch({
            type: 'rule/fetchYhOrderList'
          });
        }
      }else{
        message.error('搜索失败请检查输入是否合法');
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('cellphone', {
                rules: [{
                  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,
                  message: '请输入正确的联系电话'
                }],
              })(
                <Input style={{ width: '100%' }} />
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
      type: 'rule/fetchYhOrderList'
    });
  }
  // 改变获取订单状态数据
  handleChangeOrder = (e)=>{
    const {dispatch}  = this.props;
    if(e){
      dispatch({
        type: 'rule/fetchYhOrderList',
        payload: Object.assign({},{status: e})
      });
      this.setState({
        activeKey: e
      });
    }else{
      dispatch({
        type: 'rule/fetchYhOrderList'
      });
    }
  }
  // 订单详情
  handleDetails = (e,record,index)=>{
    const {dispatch,rule:{loading}}  = this.props;
    dispatch({
      type: 'rule/fetchYhOrderDetails',
      payload: record.id
    });
    if(record.shopName){
      this.setState({
        shopName: record.shopName
      });
    }
    if(!loading){
      this.handleModalVisible();
    }
  }
  // 核销------退款
  handleDone = (e,type)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'rule/YhOrderHx',
      payload: Object.assign({},{id:e.id,type:type})
    }).then(({data})=>{
      if(data.status === '200'){
        if(type === 1){
          this.setState({
            activeKey: '2'
          });
          dispatch({
            type: 'rule/fetchYhOrderList'
          });
        }else if(type === 2){
          this.setState({
            activeKey: '3'
          });
          dispatch({
            type: 'rule/fetchYhOrderList'
          });
        }
      }
    });
  }
  render() {
    // 表格数据
    const {rule: { loading, data,imgSig,details }} = this.props;
    // 表格列数据
    const columns = [{
      title: '订单ID',
      key:'id',
      dataIndex:'id'
    },{
      title: '商铺名称',
      key:'shopName',
      dataIndex:'shopName'
    },{
      title: '联系电话',
      key:'cellphone',
      dataIndex:'cellphone'
    },{
      title: '消费者名称',
      key:'nickname',
      dataIndex:'nickname'
    },{
      title: '商品数量',
      key:'totalQuantity',
      dataIndex:'totalQuantity'
    },{
      title:'商品总价',
      key: 'totalPrice',
      dataIndex: 'totalPrice'
    },{
      title:'商品状态',
      key: 'status',
      dataIndex: 'status'
    },{
      title: '订单创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (ket,record,index)=> moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
    },{
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record,index) => <><Button type="primary" icon="profile" size='small'  onClick={()=>this.handleDetails(key,record,index)}>查看订单详情</Button>{record.status === '已付款' && <><div style={{padding:'.5rem'}}><Button type="primary" icon="profile" size='small'  onClick={()=>this.handleDone(record,1)}>核销</Button></div><div style={{padding:'.5rem'}}><Button type="primary" icon="profile" size='small'  onClick={()=>this.handleDone(record,2)}>退款</Button></div></>} </>
    }];
    // 订单数据1
    const columns1 = [{
      title: '商品id',
      key:'productId',
      dataIndex:'productId'
    },{
      title: '商品名称',
      key:'productName',
      dataIndex:'productName'
    },{
      title: '商品价格',
      key:'price',
      dataIndex:'price'
    },{
      title: '商品数量',
      key:'quantity',
      dataIndex:'quantity'
    },{
      title: '商品总价',
      key:'totalPrice',
      dataIndex:'totalPrice'
    }];
    // 订单tab
    const tabList = [{
      key:'',
      tab: '所有订单'
    },{
      key:'0',
      tab: '待付款'
    },{
      key:'1',
      tab: '待核销'
    },{
      key:'2',
      tab: '已完成'
    },{
      key:'3',
      tab: '已退款'
    }];
    // 状态
    const {modalVisible,shopName} = this.state;
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
      <PageHeaderLayout title="订单列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Tabs size="large" tabBarStyle={{ marginBottom: 24 }} onChange={this.handleChangeOrder} defaultActiveKey={''} activeKey={this.state.activeKey}>
                {tabList.map((item,i)=> <TabPane tab={item.tab} key={item.key} />)}
              </Tabs>
            </div>
          {/* 表格信息 */}
            <TableList
              loading={loading}
              data={data}
              columns={columns}
            />
            <Modal
              title={shopName}
              visible={this.state.modalVisible}
              onOk={this.handleModalVisible}
              okText="确认"
              onCancel={this.handleModalVisible}
              width={1000}
            >
              <TableList
                loading={loading}
                data={details}
                columns={columns1}
              />
            </Modal>
          </div>
        </Card>
       
      </PageHeaderLayout>
    );
  }
}
