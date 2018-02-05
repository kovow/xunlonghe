import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal, message,Upload,Icon} from 'antd';
import QRCode from 'qrcode.react';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const Search = Input.Search;
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class ShopList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      modalVisible: false, //显示标记modal
      initEditData: {}, //初始表格数据
      previewShopLogoVisible: false,  //预览上传logo图片modal
      previewShopLogo: '', //预览上传logo文件
      shopLogoList: [], //上传logo文件列表
      previewShopDescVisible: false,  //预览上传logo图片modal
      previewShopDesc: '', //预览上传logo文件
      shopDescList: [], //上传logo文件列表
    };
  }
  // 编辑表格
  handleTableEdit = (e)=>{
    const newData = {
      "name": e.name,
      "typeDesc": e.typeDesc,
      "shopId": e.id,
      "description": e.description,
      "avg": e.avg,
      "address": e.address,
      "openTime": e.openTime,
      "orderType": e.orderType,
    };
    this.setState({
      modalVisible: true,
      initEditData: Object.assign(...this.state.initEditData,newData)
    });
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: false,
    });
  }
  // 提交修改商铺表单数据
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let newObj = {};
        if(this.state.shopDescList.length > 0 && this.state.shopLogoList.length > 0){
          newObj = Object.assign(values,{imgUrl:this.state.shopLogoList[0].name,imgArray:this.state.shopDescList[0].name});
        }else if(this.state.shopLogoList.length > 0 && this.state.shopDescList.length ===0){
          newObj = Object.assign(values,{imgUrl:this.state.shopLogoList[0].name});
        }else if(this.state.shopDescList.length > 0 && this.state.shopLogoList.length ===0){
          newObj = Object.assign(values,{imgArray:this.state.shopDescList[0].name});
        }else{
          newObj = values;
        }
        dispatch({
          type: 'rule/updateShopInfo',
          shopId: this.state.initEditData.shopId,
          payload: newObj
        });
        form.resetFields();
        this.handleModalVisible();
      }
    });
  }
  // 上传店铺logo图片预览
  handleLogoPreview = (file) => {
    this.setState({
      previewShopLogo: file.url || file.thumbUrl,
      previewShopLogoVisible: true,
    });
  }
  // 上传店铺宣传预览
  handleDescPreview = (file)=>{
    this.setState({
      previewShopDesc: file.url || file.thumbUrl,
      previewShopDescVisible: true,
    });
  };
  // 关闭预览logo上传图片modal
  handleLogoCancel = () => this.setState({ previewShopLogoVisible: false });
  // 关闭预览店铺宣传图片modal
  handleDescCancel = ()=>this.setState({previewShopDescVisible:false});

  // 商户logo 上传前处理方法
  handleShopLogoBeforeUpload = (file)=>{
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isJPG) {
      message.error('上传图片只能是 JPG或者png图片');
    }
    if (!isLt1M) {
      message.error('上传图片大小不能超过 1MB! ');
    }
    return isJPG && isLt1M;
  }
  // 覆盖默认请求方法
  handleCustomRequest = (obj)=>{
    let formData = new FormData();
    formData.append('file',obj.file);
    this.props.dispatch({
      type: 'rule/uploadShopLogo',
      url: obj.action,
      payload: formData
    });
  }
  // 清空店铺logo
  handleLogoRemove = (file)=>{
    this.setState({
      shopLogoList: []
    });
  }
  // 清空店铺宣传图片
  handleDescRemove = (file)=>{
    this.setState({
      shopDescList: []
    });
  }
  // 搜索
  handleSearch = (value)=>{
    const {dispatch} = this.props;
    if(value){
      dispatch({
        type: 'rule/fetch',
        payload: value
      });
    }else{
      message.error('商铺名称不能为空...')
    }
  }

  renderForm() {
    return <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <Search placeholder="请输入要搜索的商铺名称!" enterButton="搜索" size="large" onSearch={this.handleSearch} />
            </Col>
          </Row>;
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }
  // 上传成功之后更新预览图
  componentWillReceiveProps(nextProps){
    if(Object.keys(nextProps.rule.imgSig).length !== 0){
      if(nextProps.rule.imgSig.type === 1){
        this.setState({
          shopLogoList: [{uid:nextProps.rule.imgSig.key,url:nextProps.rule.imgSig.imgUrl,name: nextProps.rule.imgSig.image}]
        });
      }else if(nextProps.rule.imgSig.type ===2){
        this.setState({
          shopDescList: [{uid:nextProps.rule.imgSig.key,url:nextProps.rule.imgSig.imgUrl,name: nextProps.rule.imgSig.image}]
        });
      }
    }
  }
  showConfirm = (e)=>{
    confirm({
      title: '店铺二维码',
      content: e.qrCode ? <QRCode value={e.qrCode} size={300}/> : '此店铺没有二维码',
      onOk() {
      },
      onCancel() {},
    });
  }
  render() {
    // 表格数据
    const {rule: { loading, data,imgSig },form:{getFieldDecorator}} = this.props;
    // 表格列数据
    const columns = [{
      title: '名称',
      key:'name',
      dataIndex:'name',
    }, {
      title: '人均消费',
      key:'avg',
      dataIndex:'avg',
    }, {
      title: '地址',
      key:'address',
      dataIndex:'address',
    }, {
      title: '商户图标',
      key:'imgUrl',
      dataIndex:'imgUrl',
      render: (e) => <img style={{width:'100px',height:'100px',border:'1px solid #ddd',padding:'3px',borderRadius:'4px'}} src={e} />
    }, {
      title: '营业时间',
      key:'openTime',
      dataIndex:'openTime',
    }, {
      title: '商户分类',
      key:'typeDesc',
      dataIndex:'typeDesc',
    }, {
      title: '支持下单类型',
      key:'orderType',
      dataIndex:'orderType',
      render: (e,text, record) => {
        if(e=="1"){
          return ('仅支持扫码下单')
        }
        else{
          return ('在线下单')
        }
      }
    }, {
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record) => <div><Button type="primary" icon="edit" size='small' onClick={() => this.handleTableEdit(record)} style={{marginBottom:'.2rem',marginRight:'.2rem'}}>修改</Button><Button type="primary" icon="qrcode" style={{marginTop:'.2rem'}} onClick={()=>{this.showConfirm(record)}} size='small'>点击查看二维码</Button></div>
    }]
    // 状态
    const {modalVisible,initEditData,previewShopLogoVisible, previewShopLogo, shopLogoList,previewShopDescVisible, previewShopDesc, shopDescList} = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
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
      <PageHeaderLayout title="门店列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{marginBottom:'1.125rem'}}>
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
        <Modal
          title="修改店铺信息"
          visible={modalVisible}
          onCancel={this.handleModalVisible}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <FormItem
              {...formItemLayout}
              label="商户名称"
              hasFeedback
            >
              {getFieldDecorator('name', {
                initialValue: initEditData.name,
                rules: [{
                  required: true, message: '请输入商户名称!',
                }],
              })(
                <Input placeholder="请输入商品名称!" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="人均消费"
              hasFeedback
            >
              {getFieldDecorator('avg', {
                initialValue: initEditData.avg,
                rules: [{
                  required: true, message: '请输入人均消费!!',
                }],
              })(
                <Input placeholder="请输入人均消费"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
              hasFeedback
            >
              {getFieldDecorator('address', {
                initialValue: initEditData.address,
                rules: [{
                  required: true, message: '请输入地址!!',
                }],
              })(
                <Input placeholder="请输入地址"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商铺logo"
            >
                  <Upload
                  action="/admin/api/file/fileUpload?type=1"
                  listType="picture-card"
                  fileList={shopLogoList}
                  accept="image/png, image/jpeg"
                  onRemove={this.handleLogoRemove}
                  onPreview={this.handleLogoPreview}
                  beforeUpload={this.handleShopLogoBeforeUpload}
                  customRequest={this.handleCustomRequest}
                >
                  {shopLogoList.length >= 1 ? null : uploadButton}
                </Upload>
              <Modal visible={previewShopLogoVisible} footer={null} onCancel={this.handleLogoCancel}>
                <img alt="logo" style={{ width: '100%' }} src={previewShopLogo} />
              </Modal>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺展示"
            >
                  <Upload
                  action="/admin/api/file/fileUpload?type=2"
                  listType="picture-card"
                  fileList={shopDescList}
                  accept="image/png, image/jpeg"
                  onRemove={this.handleDescRemove}
                  onPreview={this.handleDescPreview}
                  beforeUpload={this.handleShopLogoBeforeUpload}
                  customRequest={this.handleCustomRequest}
                >
                  {shopDescList.length >= 1 ? null : uploadButton}
                </Upload>
              <Modal visible={previewShopDescVisible} footer={null} onCancel={this.handleDescCancel}>
                <img alt="Desc" style={{ width: '100%' }} src={previewShopDesc} />
              </Modal>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="营业时间"
              hasFeedback
            >
              {getFieldDecorator('openTime', {
                initialValue: initEditData.openTime,
                rules: [{
                  required: true, message: '选择营业时间',
                }],
              })(
                <Input placeholder="请选择营业时间"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商户类型介绍"
              hasFeedback
            >
              {getFieldDecorator('typeDesc', {
                initialValue: initEditData.typeDesc,
                rules: [{
                  required: true, message: '商户类型介绍',
                }],
              })(
                <Input placeholder="商户类型介绍"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商户描述"
              hasFeedback
            >
              {getFieldDecorator('description', {
                initialValue: initEditData.description,
                rules: [{
                  required: true, message: '商户描述',
                }],
              })(
                <Input placeholder="商户描述"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商户类型"
              hasFeedback
            >
              {getFieldDecorator('orderType', {
                initialValue: initEditData.orderType,
                rules: [
                  { required: true, message: 'Please select your country!' },
                ],
              })(
                <Select placeholder="请选择商户类型">
                  <Option value="1">仅支持扫码下单</Option>
                  <Option value="2">在线下单</Option>
                </Select>
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
