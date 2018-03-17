import React,{PureComponent} from 'react';
import {connect} from 'dva';
import {Row, Col, Card, Form, Input, Select, Button,  InputNumber, DatePicker,  message,Icon,Modal} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableList from '../../components/Table/index';
import styles from '../Setting/TableList.less';
import Cookies from '../../vendor/js.cookie.js';
import moment from 'moment'; //时间格式化插件
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(state=>({
  print: state.print
}))
@Form.create()
export default class PrintLodop extends PureComponent{
  constructor(props){
    super(props);
  }
  state = {
    app: null,
    isDown: false,
    expandForm: false,//展开高级搜索
    modalVisible: false,
    modalVisibleOne:false,
    disabled: true,
    selDisabled: true,
    initData:{
      at: null,
      st: null
    }
  }
  // 搜索事件
  handleSearch = (e) => {
    e.preventDefault();
    const {form:{getFieldValue},dispatch} = this.props;
    if(!getFieldValue('agencyId') && !getFieldValue('ticketTypeId') && !getFieldValue('queryDate')){
      dispatch({
        type:'print/fetch'
      });
    }else{
      if(getFieldValue('agencyId') && getFieldValue('ticketTypeId') && getFieldValue('queryDate')){
        dispatch({
          type:'print/fetch',
          payload: Object.assign({},{agencyId:getFieldValue('agencyId'),ticketTypeId:getFieldValue('ticketTypeId'),startDate:getFieldValue('queryDate')[0].format('YYYY-MM-DD'),endDate:getFieldValue('queryDate')[1].format('YYYY-MM-DD')})
        });
      }
      if(getFieldValue('agencyId') && getFieldValue('ticketTypeId') && !getFieldValue('queryDate')){
        dispatch({
          type:'print/fetch',
          payload: Object.assign({},{agencyId:getFieldValue('agencyId'),ticketTypeId:getFieldValue('ticketTypeId')})
        });
      }
      if(getFieldValue('agencyId') && !getFieldValue('ticketTypeId') && !getFieldValue('queryDate')){
        dispatch({
          type:'print/fetch',
          payload: Object.assign({},{agencyId:getFieldValue('agencyId')})
        });
      }
      if(!getFieldValue('agencyId') && getFieldValue('ticketTypeId') && getFieldValue('queryDate')){
        dispatch({
          type:'print/fetch',
          payload: Object.assign({},{ticketTypeId:getFieldValue('ticketTypeId'),startDate:getFieldValue('queryDate')[0].format('YYYY-MM-DD'),endDate:getFieldValue('queryDate')[1].format('YYYY-MM-DD')})
        });
      }
      if(!getFieldValue('agencyId') && !getFieldValue('ticketTypeId') && getFieldValue('queryDate')){
        dispatch({
          type:'print/fetch',
          payload: Object.assign({},{startDate:getFieldValue('queryDate')[0].format('YYYY-MM-DD'),endDate:getFieldValue('queryDate')[1].format('YYYY-MM-DD')})
        });
      }
    }

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
    const {print:{agency,category}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="旅行社">
              {getFieldDecorator('agencyId')(
                <Select placeholder="请选择旅行社名称" style={{ width: '100%' }}>
                  {agency &&  agency.map((item,index)=>{
                    return <Option value={item.id} key={index}>{item.agencyName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="门票类型">
              {getFieldDecorator('ticketTypeId')(
                <Select placeholder="请选择票务类型" style={{ width: '100%' }} onChange={this.handleTicketType}>
                  {category &&  category.map((item,index)=>{
                    return <Option value={item.id} key={index}>{item.name}</Option>
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
    const {print:{agency,category}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
            <FormItem label="旅行社">
              {getFieldDecorator('agencyId')(
                <Select placeholder="请选择旅行社名称" style={{ width: '100%' }}>
                  {agency &&  agency.map((item,index)=>{
                    return <Option value={item.id} key={index}>{item.agencyName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="门票类型">
              {getFieldDecorator('ticketTypeId')(
                <Select placeholder="请选择票务类型" style={{ width: '100%' }} onChange={this.handleTicketType}>
                  {category &&  category.map((item,index)=>{
                    return <Option value={item.id} key={index}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="查询时间">
              {getFieldDecorator('queryDate')(
                <RangePicker style={{ width: '100%' }} format={dateFormat}/>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  // 添加区域 modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  // 添加区域1 modal
  handleModalVisibleOne = () => {
    const {dispatch} = this.props;
    this.setState({
      modalVisibleOne: !this.state.modalVisibleOne,
    });
  }
  // 售票联
  handleInitLodapOne = (data)=>{
    // this.state.app.PRINT_INIT("打印团体票");
    this.state.app.ADD_PRINT_TEXT(15,40,150,30,"票务客户联");
    this.state.app.SET_PRINT_STYLEA(1,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(1,"Bold",1);
    
    this.state.app.ADD_PRINT_TEXT(50,15,65,20,"客户名:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(50,67,120,20,data.agencyName);
    // 线条
    this.state.app.ADD_PRINT_LINE(70,14,70,510,0,1);

    this.state.app.ADD_PRINT_TEXT(75,15,65,20,"门票类型:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(75,67,120,20,data.ticketType);
    // 线条
    this.state.app.ADD_PRINT_LINE(95,14,95,510,0,1);

    this.state.app.ADD_PRINT_TEXT(100,15,65,20,"成人数量:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(100,67,120,20,data.atQuantity);
    // 线条
    this.state.app.ADD_PRINT_LINE(125,14,125,510,0,1);

    this.state.app.ADD_PRINT_TEXT(130,15,65,20,"学生数量:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(130,67,120,20,data.stQuantity);
    // 线条
    this.state.app.ADD_PRINT_LINE(155,14,155,510,0,1);

    this.state.app.ADD_PRINT_TEXT(160,15,65,20,"付款方式:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(160,67,120,20,data.payType);
    // 线条
    this.state.app.ADD_PRINT_LINE(185,14,185,510,0,1);

    this.state.app.ADD_PRINT_TEXT(190,15,65,20,"有效时间:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(190,67,120,20,data.validateTime);
    // 线条
    this.state.app.ADD_PRINT_LINE(215,14,215,510,0,1);

    // this.state.app.ADD_PRINT_TEXT(230,20,150,20,"合计金额："+data.totalPrice);
    // 20 remark
    this.state.app.ADD_PRINT_TEXT(230,20,150,50,"备注："+data.remark);
    // this.state.app.ADD_PRINT_LINE(iCurLine,14,iCurLine,510,0,1);
    this.state.app.ADD_PRINT_TEXT(290,20,165,20,"打印时间：");
    this.state.app.ADD_PRINT_TEXT(305,20,165,20,(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString());
    
    this.state.app.ADD_PRINT_TEXT(320,20,150,20,"出票人："+data.sellerName);
    // this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    this.state.app.ADD_PRINT_TEXT(350,20,150,290,'客户须知:'+data.notice);
    this.state.app.SET_PRINT_STYLEA(25,"FontSize",6);
    this.state.app.SET_PRINT_PAGESIZE(3,580+100,80,"");//这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
    // this.state.app.PREVIEW();
    this.state.app.PRINT();
  }
  // 检票联
  handleInitLodapTwo = (data)=>{
    this.state.app.PRINT_INIT("打印团体票");
    this.state.app.ADD_PRINT_TEXT(15,40,150,30,"票务售票联");
    this.state.app.SET_PRINT_STYLEA(1,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(1,"Bold",1);
    
    this.state.app.ADD_PRINT_TEXT(50,15,65,20,"客户名:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(50,67,120,20,data.agencyName);
    // 线条
    this.state.app.ADD_PRINT_LINE(70,14,70,510,0,1);

    this.state.app.ADD_PRINT_TEXT(75,15,65,20,"门票类型:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(75,67,120,20,data.ticketType);
    // 线条
    this.state.app.ADD_PRINT_LINE(95,14,95,510,0,1);

    this.state.app.ADD_PRINT_TEXT(100,15,65,20,"成人数量:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(100,67,120,20,data.atQuantity);
    // 线条
    this.state.app.ADD_PRINT_LINE(125,14,125,510,0,1);

    this.state.app.ADD_PRINT_TEXT(130,15,65,20,"学生数量:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(130,67,120,20,data.stQuantity);
    // 线条
    this.state.app.ADD_PRINT_LINE(155,14,155,510,0,1);

    this.state.app.ADD_PRINT_TEXT(160,15,65,20,"付款方式:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(160,67,120,20,data.payType);
    // 线条
    this.state.app.ADD_PRINT_LINE(185,14,185,510,0,1);

    this.state.app.ADD_PRINT_TEXT(190,15,65,20,"有效时间:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(190,67,120,20,data.validateTime);
    // 线条
    this.state.app.ADD_PRINT_LINE(215,14,215,510,0,1);

    this.state.app.ADD_PRINT_TEXT(230,20,150,20,"合计金额："+data.quantity);
    // 20 remark
    this.state.app.ADD_PRINT_TEXT(250,20,150,50,"备注："+data.remark);
    // this.state.app.ADD_PRINT_LINE(iCurLine,14,iCurLine,510,0,1);
    this.state.app.ADD_PRINT_TEXT(290,20,165,20,"打印时间：");
    this.state.app.ADD_PRINT_TEXT(305,20,165,20,(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString());
    
    this.state.app.ADD_PRINT_TEXT(320,20,150,20,"出票人："+data.sellerName);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    this.state.app.SET_PRINT_PAGESIZE(3,580+100,45,"");//这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
    // this.state.app.PREVIEW();
    this.state.app.PRINT();
  }

  // 客户联
  handleInitLodapThree = (data)=>{
    // this.state.app.PRINT_INIT("打印团体票");
    this.state.app.ADD_PRINT_TEXT(15,40,150,30,"票务检票联");
    this.state.app.SET_PRINT_STYLEA(1,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(1,"Bold",1);
    
    this.state.app.ADD_PRINT_TEXT(50,15,65,20,"客户名:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(50,67,120,20,data.agencyName);
    // 线条
    this.state.app.ADD_PRINT_LINE(70,14,70,510,0,1);

    this.state.app.ADD_PRINT_TEXT(75,15,65,20,"门票类型:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(75,67,120,20,data.ticketType);
    // 线条
    this.state.app.ADD_PRINT_LINE(95,14,95,510,0,1);

    this.state.app.ADD_PRINT_TEXT(100,15,65,20,"成人数量:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(100,67,120,20,data.atQuantity);
    // 线条
    this.state.app.ADD_PRINT_LINE(125,14,125,510,0,1);

    this.state.app.ADD_PRINT_TEXT(130,15,65,20,"学生数量:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(130,67,120,20,data.stQuantity);
    // 线条
    this.state.app.ADD_PRINT_LINE(155,14,155,510,0,1);

    this.state.app.ADD_PRINT_TEXT(160,15,65,20,"付款方式:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(160,67,120,20,data.payType);
    // 线条
    this.state.app.ADD_PRINT_LINE(185,14,185,510,0,1);

    this.state.app.ADD_PRINT_TEXT(190,15,65,20,"有效时间:");
    // this.state.app.SET_PRINT_STYLEA(4,"FontSize",10);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    // 内容
    this.state.app.ADD_PRINT_TEXT(190,67,120,20,data.validateTime);
    // 线条
    this.state.app.ADD_PRINT_LINE(215,14,215,510,0,1);

    // this.state.app.ADD_PRINT_TEXT(230,20,150,20,"合计金额："+data.quantity);
    // 20 remark
    this.state.app.ADD_PRINT_TEXT(250,20,150,50,"备注："+data.remark);
    // this.state.app.ADD_PRINT_LINE(iCurLine,14,iCurLine,510,0,1);
    this.state.app.ADD_PRINT_TEXT(290,20,165,20,"打印时间：");
    this.state.app.ADD_PRINT_TEXT(305,20,165,20,(new Date()).toLocaleDateString()+" "+(new Date()).toLocaleTimeString());
    
    this.state.app.ADD_PRINT_TEXT(320,20,150,20,"出票人："+data.sellerName);
    this.state.app.SET_PRINT_STYLEA(2,"Bold",1);
    this.state.app.SET_PRINT_PAGESIZE(3,580+100,45,"");//这里3表示纵向打印且纸高“按内容的高度”；1385表示纸宽138.5mm；45表示页底空白4.5mm
    // this.state.app.PREVIEW();
    this.state.app.PRINT();
  }
  componentDidMount(){
    const {dispatch} = this.props;
    if (!getLodop()){
      this.setState({
        isDown: true
      });
    }else{
      this.setState({
        app: getLodop()
      });
    }
    dispatch({
      type:'print/fetch'
    });
    dispatch({
      type: 'print/fetchCategory'
    });
    dispatch({
      type: 'print/fetchAgency'
    });
  }
  // 打印小票
  handlePrint = (record)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'print/fetchPrint',
      payload: record.id
    }).then(({data})=>{
      if(data.status === '200'){
        Modal.confirm({
          title: '确认是否打印',
          content: '请确认是否打印小票',
          okText: '确认',
          cancelText: '取消',
          onOk: async ()=>{
            await this.handleInitLodapTwo(data.result[0]);
            await this.handleInitLodapThree(data.result[1]);
            await this.handleInitLodapOne(data.result[2]);
          }
        });
      }
    });
    // this.handleInitLodapOne();
    // this.handleInitLodapTwo();
    // this.handleInitLodapThree();
  }
  // 添加旅行社信息
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(values.agencyName){
        dispatch({
          type:'print/addAgency',
          payload: {agencyName:values.agencyName}
        });
        this.handleModalVisible();
      }else{
        message.error('旅行社名字不能为空');
      }
    });
  }
  // 添加出票信息
  handleSubmitOne = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    let userInfo = JSON.parse(Cookies.get('userInfo'));
    form.validateFields((err,values)=>{
      if(Cookies.get('userInfo')){
        if(values.payType && values.agencyId && values.ticketTypeId && (values.atQuantity <= values.quantity && values.stQuantity <= values.quantity) && values.quantity){
          if(values.remark){
            dispatch({
              type: 'print/addNot',
              payload: Object.assign({},{payType:values.payType,agencyId:values.agencyId[1],agencyName:values.agencyId[0],ticketTypeId:values.ticketTypeId[3],ticketType:values.ticketTypeId[0],atQuantity:values.atQuantity,stQuantity:values.stQuantity,quantity:values.quantity,sellerName:userInfo.nickname,remark:values.remark})
            });
          }else{
            dispatch({
              type: 'print/addNot',
              payload: Object.assign({},{payType:values.payType,agencyId:values.agencyId[1],agencyName:values.agencyId[0],ticketTypeId:values.ticketTypeId[3],ticketType:values.ticketTypeId[0],atQuantity:values.atQuantity,stQuantity:values.stQuantity,quantity:values.quantity,sellerName:userInfo.nickname})
            });
          }
          this.handleModalVisibleOne();
        }else{
          message.error('请检查输入是否正确');
        }
      }else{
        message.error('无法获取用户信息.请注销后重新登入');
      }
    });
  }
  // change sel 'ticketType
  handleTicketType = (value)=>{
    const {resetFields} = this.props.form;
    if(value){
      this.setState({
        selDisabled: false,
        count: null,
        initData: {at:null,st:null}
      });
      resetFields(['quantity','stQuantity','atQuantity']);
    }else{
      this.setState({
        selDisabled: true
      });
    }
  }
  // 总票数
  handleQuantity = (value)=>{
    const {resetFields} = this.props.form;
    if(/^\d+(\.\d{0})?$/ig.test(value)){
      this.setState({
        disabled: false,
        initData:{st:null,at:null}
      });
      resetFields(['stQuantity','atQuantity']);
    }else{
      this.setState({
        disabled: true
      });
    }
  }
  // 学生  -- 成人票计算
  handleAt = (value)=>{
    const {getFieldValue,resetFields} = this.props.form;
    if(getFieldValue('ticketTypeId')){
      if((value <= getFieldValue('quantity'))){
        this.setState({
          initData:{st:getFieldValue('quantity')-value,at:value},
          count:  (getFieldValue('ticketTypeId')[1]*value) + (getFieldValue('quantity')-value)*getFieldValue('ticketTypeId')[2] 
        });
        
      }else{
        message.error('输入的成人票数不能大于总票数');
        this.setState({
          initData: {st:null,at:null},
          count: null
        });
        resetFields(['stQuantity','atQuantity']);
      }
    }else{
      message.error('请先选择票务类型');
      resetFields();
    }
  }
  handleSt = (value)=>{
    const {getFieldValue,resetFields} = this.props.form;
    if(getFieldValue('ticketTypeId')){
      if(value <= getFieldValue('quantity')){
        this.setState({
          initData:{at:getFieldValue('quantity')-value,st:value},
          count:  (getFieldValue('ticketTypeId')[2]*value) + (getFieldValue('quantity')-value)*getFieldValue('ticketTypeId')[1] 
        });
      }else{
        message.error('输入的学生票数不能大于总票数');
        this.setState({
          initData: {st:null,at:null},
          count: null
        });
        resetFields(['stQuantity','atQuantity']);
      }
    }else{
      message.error('请先选择票务类型');
      resetFields();
    }
  }
  render(){
    const {modalVisible,isDown,modalVisibleOne,disabled,initData,selDisabled,count} = this.state;
    const {print:{data,loading,agency,category},form:{getFieldDecorator}} = this.props
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
          span: 10,
          offset: 15,
        },
      },
    };
    const columns = [{
      title: '客户名',
      key:'agencyName',
      dataIndex:'agencyName'
    }, {
      title: '门票类型',
      key:'ticketType',
      dataIndex:'ticketType',
    },{
      title: '门票数量',
      key: 'quantity',
      dataIndex: 'quantity'
    },{
      title: '成人数量',
      key: 'atQuantity',
      dataIndex: 'atQuantity'
    },{
      title: '学生数量',
      key: 'stQuantity',
      dataIndex: 'stQuantity'
    },{
      title: '合计金额',
      key: 'totalPrice',
      dataIndex: 'totalPrice'
    },{
      title: '付款方式',
      key: 'payType',
      dataIndex: 'payType'
    },{
      title: '备注信息',
      key: 'remark',
      dataIndex: 'remark'
    },{
      title: '有效时间',
      key: 'validateTime',
      dataIndex: 'validateTime'
    },{
      title: '出票人',
      key: 'sellerName',
      dataIndex: 'sellerName'
    },{
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (key,record)=><Button type="primary" onClick={()=>this.handlePrint(record)}>打印</Button>
    }];
    return(
      <PageHeaderLayout title="团票管理">
        {isDown && <font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='/static/CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
              <Button type="primary" onClick={this.handleModalVisible}>添加旅行社信息</Button>
              <Button type="primary" onClick={this.handleModalVisibleOne} style={{marginLeft:'.5rem'}}>添加出票信息</Button>
            </div>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <TableList
                  loading={loading}
                  data={data}
                  columns={columns}
                />
              </Col>
            </Row>
          </div>
        </Card>
        <Modal
          title="添加旅行社信息"
          visible={modalVisible}
          onCancel={this.handleModalVisible}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <FormItem
              {...formItemLayout}
              label="旅行社名称"
              hasFeedback
            >
              {getFieldDecorator('agencyName',{
                 rules: [{
                  required: true, message: '请输入旅行社名称!',
                }]
              })(
                <Input  placeholder="请输入旅行社名称!"/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">确定</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="添加售票记录"
          visible={modalVisibleOne}
          onCancel={this.handleModalVisibleOne}
          footer={null}
        >
          <Form onSubmit={this.handleSubmitOne} layout="vertical" >
            <FormItem
              {...formItemLayout}
              label="旅行社名称"
              hasFeedback
            >
              {getFieldDecorator('agencyId',{
                 rules: [{
                  required: true, message: '请选择旅行社名称!',
                }]
              })(
                <Select placeholder="请选择旅行社名称" style={{ width: '100%' }}>
                  {agency &&  agency.map((item,index)=>{
                    return <Option value={[item.agencyName,item.id]} key={index}>{item.agencyName}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem 
              {...formItemLayout}
              label="选择票务类型"
            >
              {getFieldDecorator('ticketTypeId',{
                 rules: [{
                  required: true, message: '请选择票务类型!',
                }]
              })(
                <Select placeholder="请选择票务类型" style={{ width: '100%' }} onChange={this.handleTicketType}>
                  {category &&  category.map((item,index)=>{
                    return <Option value={[item.name,item.atPrice,item.stPrice,item.id]} key={index}>{item.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem 
              {...formItemLayout}
              label="总票数"
            >
              {getFieldDecorator('quantity',{
                 rules: [{
                  required: true, message: '输入总票数',
                },{
                  pattern: /^\d+(\.\d{0})?$/ig,
                  message: '只能输入数字'
                }]
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入总票数" onChange={this.handleQuantity} disabled={selDisabled}/>
              )}
            </FormItem>
            <FormItem 
              {...formItemLayout}
              label="成人票数"
            >
              {getFieldDecorator('atQuantity',{
                 rules: [{
                  required: true, message: '输入成人票数',
                },{
                  pattern: /^\d+(\.\d{0})?$/ig,
                  message: '只能输入数字'
                }],
                initialValue: initData.at
              })(
                <InputNumber style={{ width: '100%' }} placeholder="成人票数"  disabled={disabled} onChange={this.handleAt}/>
              )}
            </FormItem>
            <FormItem 
              {...formItemLayout}
              label="学生票数"
            >
              {getFieldDecorator('stQuantity',{
                 rules: [{
                  required: true, message: '输入学生票数',
                },{
                  pattern: /^\d+(\.\d{0})?$/ig,
                  message: '只能输入数字'
                }],
                initialValue: initData.st
              })(
                <InputNumber style={{ width: '100%' }} placeholder="请输入学生票数"  disabled={disabled} onChange={this.handleSt}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="支付类型"
              hasFeedback
            >
              {getFieldDecorator('payType',{
                 rules: [{
                  required: true, message: '请选择支付类型!',
                }]
              })(
                <Select placeholder="请选择支付类型" style={{ width: '100%' }}>
                  <Option value="现金">现金</Option>
                  <Option value="支付宝">支付宝</Option>
                  <Option value="微信支付">微信支付</Option>
                </Select>
              )}
            </FormItem>
            <FormItem 
              {...formItemLayout}
              label="备注信息"
            >
              {getFieldDecorator('remark')(
                <TextArea placeholder="输入备注信息" autosize />
              )}
            </FormItem>
            {count && <span style={{marginRight:'1.125rem',fontSize:'18px',color:'red',width:'100%'}}>{'总价:'+count+'元'}</span>}
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">确定</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </FormItem>
          </Form>
        </Modal>
        {/* <>
          <Button type="primary" onClick={this.MyPreview}>预览</Button>
          {this.state.isDown && <font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='/static/CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>}
        </> */}
      </PageHeaderLayout>
    );
  }
}