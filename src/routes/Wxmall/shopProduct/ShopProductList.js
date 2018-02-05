import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button,  InputNumber, DatePicker, Modal, message,Upload,Icon} from 'antd';
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
export default class ShopProductList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      modalVisible: false, //显示标记modal
      initEditData: {}, //初始表格数据
      previewShopProductVisible: false,  //预览上传logo图片modal
      previewShopProduct: '', //预览上传logo文件
      shopProductList: [], //上传logo文件列表,
      productName: '',
      shopNameSel: '',
      shopNameArr: [],

    };
  }
  // 编辑表格
  handleTableEdit = (e)=>{
    const newData = {
      "agio": e.agio,
      "categoryId": e.categoryId,
      "categoryName": e.categoryName,
      "easyCode": e.easyCode,
      "price": e.price,
      "productId": e.productId,
      "productName": e.productName,
      "shopId": e.shopId,
      "unit": e.unit
    };
    this.setState({
      modalVisible: true,
      initEditData: newData
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
        if(this.state.shopProductList.length > 0){
          newObj = Object.assign({},{imgUrl:this.state.shopProductList[0].name,categoryId:values.categoryId,price:values.price,productName:values.productName,unit:values.unit});
        }else{
          newObj = Object.assign({},{categoryId:values.categoryId,price:values.price,productName:values.productName,unit:values.unit})
        }
        dispatch({
          type: 'rule/updateShopProductInfo',
          productId: this.state.initEditData.productId,
          payload: newObj
        });
        form.resetFields();
        this.handleModalVisible();
      }
    });
  }
  // 上传店铺logo图片预览
  handleProductPreview = (file) => {
    this.setState({
      previewShopProduct: file.url || file.thumbUrl,
      previewShopProductVisible: true,
    });
  }
  
  // 关闭预览logo上传图片modal
  handleProductCancel = () => this.setState({ previewShopProductVisible: false });

  // 商户logo 上传前处理方法
  handleShopProductBeforeUpload = (file)=>{
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
  handleProductRemove = (file)=>{
    this.setState({
      shopProductList: []
    });
  }
  // 搜索
  handleSearch = (value)=>{
    const {dispatch} = this.props;
    let {shopNameSel,productName} = this.state;
    if(shopNameSel.trim().length >0 && productName.trim().length >0){
      dispatch({
        type: 'rule/fetchProduct',
        payload: Object.assign({},{productName:productName,shopName:shopNameSel})
      });
    }else if(shopNameSel.trim().length >0 && productName.trim().length === 0){
      dispatch({
        type: 'rule/fetchProduct',
        payload: Object.assign({},{shopName:shopNameSel})
      });
    }else if(shopNameSel.trim().length === 0 && productName.trim().length >0){
      dispatch({
        type: 'rule/fetchProduct',
        payload: Object.assign({},{productName:productName})
      });
    }else{
      dispatch({
        type: 'rule/fetchProduct'
      });
    }
    // if(value){
    //   dispatch({
    //     type: 'rule/fetchProduct',
    //     payload: value
    //   });
    // }else{
    //   message.error('商品名称不能为空...')
    // }
  }
  // 清空商品信息
  emitEmpty = () => {
    this.productNameInput.focus();
    this.setState({ productName: '' });
  }
  // 商品改变数据
  handleProductChange = (e)=>{
    this.setState({productName:e.target.value});
  }
  // 搜索商户
  handleSelShop = (val)=>{
    let {rule:{shopName}} = this.props;
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
  // 商户改变时候状态
  handleShopChange = (val)=>{
      this.setState({
        shopNameSel: val
      });
  }
  // 渲染搜索
  renderForm() {
    const {productName,shopNameArr,shopNameSel} = this.state;
    let {rule:{shopName}} = this.props;
    const suffix = productName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <Input
                placeholder="输入商品名称"
                suffix={suffix}
                value={productName}
                onChange={this.handleProductChange}
                ref={node => this.productNameInput = node}
              />
            </Col>
            <Col md={8} sm={24}>
              <Select placeholder="请选择" style={{ width: '100%' }} mode="combobox" filterOption={false}   onSearch={this.handleSelShop} onChange={this.handleShopChange}>
                {shopNameArr.length === 0 ?shopName.map((item,i)=>{
                    return <Option value={item.name} key={i}>{item.name}</Option>
                  }) : shopNameArr.map((item,i)=>{
                    return <Option value={item.name} key={i}>{item.name}</Option>
                  })}
              </Select>
            </Col>
            <Col md={8} sm={24}>
              <Button type="primary" onClick={this.handleSearch}>查询</Button>
            </Col>
          </Row>;
  }
  // 获取表格数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchProduct',
    });
    dispatch({
      type: 'rule/fetchShopName'
    });
  }
  // 上传成功之后更新预览图
  componentWillReceiveProps(nextProps){
    if(Object.keys(nextProps.rule.imgSig).length !== 0){
      if(nextProps.rule.imgSig.type === 3){
        this.setState({
          shopProductList: [{uid:nextProps.rule.imgSig.key,url:nextProps.rule.imgSig.imgUrl,name: nextProps.rule.imgSig.image}]
        });
      }
    }
  }
  render() {
    // 表格数据
    const {rule: { loading, data,imgSig },form:{getFieldDecorator}} = this.props;
    // 表格列数据
    const columns = [{
      title: '商品id',
      key:'productId',
      dataIndex:'productId'
    },{
      title: '商品名称',
      key:'productName',
      dataIndex:'productName'
    },{
      title: '对应商铺',
      key:'shopName',
      dataIndex:'shopName'
    },{
      title: '商品单位',
      key:'unit',
      dataIndex:'unit'
    },{
      title: '对应分类',
      key:'categoryName',
      dataIndex:'categoryName',
    }, {
      title: '分类id',
      key:'categoryId',
      dataIndex:'categoryId',
    }, {
      title: 'EZ码',
      key:'easyCode',
      dataIndex:'easyCode',
    }, {
      title: '商品图片',
      key:'imgUrl',
      dataIndex:'imgUrl',
      render: (e) => <img style={{width:'100px',height:'100px',border:'1px solid #ddd',padding:'3px',borderRadius:'4px'}} src={e} />
    }, {
      title: '折扣',
      key:'agio',
      dataIndex:'agio',
      render: (e)=> <span>{e}%</span>
    }, {
      title: '商品价格',
      key:'price',
      dataIndex:'price',
      render: (e)=> <span>{e}元</span>
    },  {
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record) => <a onClick={() => this.handleTableEdit(record)}>修改</a>
    }]
    // 状态
    const {modalVisible,initEditData,previewShopProductVisible, previewShopProduct, shopProductList} = this.state;
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
      <PageHeaderLayout title="商品列表">
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
              label="折扣"
              hasFeedback
            >
              {getFieldDecorator('agio', {
                initialValue: initEditData.agio,
                rules: [{
                  required: true, message: '请输入商品折扣',
                }],
              })(
                <Input placeholder="请输入商品折扣" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品id"
              hasFeedback
            >
              {getFieldDecorator('categoryId', {
                initialValue: initEditData.categoryId,
                rules: [{
                  required: true, message: '请输入分类ID',
                }],
              })(
                <Input placeholder="请输入分类ID" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型名字"
              hasFeedback
            >
              {getFieldDecorator('categoryName', {
                initialValue: initEditData.categoryName,
                rules: [{
                  required: true, message: '请输入商品类型名字',
                }],
              })(
                <Input placeholder="请输入商品类型名字" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="EZ码"
              hasFeedback
            >
              {getFieldDecorator('easyCode', {
                initialValue: initEditData.easyCode,
                rules: [{
                  required: true, message: '请输入ez码.',
                }],
              })(
                <Input placeholder="请输入ez码" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品价格"
              hasFeedback
            >
              {getFieldDecorator('price', {
                initialValue: initEditData.price,
                rules: [{
                  required: true, message: '请输入商品价格.',
                }],
              })(
                <Input placeholder="请输入商品价格" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品ID"
              hasFeedback
            >
              {getFieldDecorator('productId', {
                initialValue: initEditData.productId,
                rules: [{
                  required: true, message: '请输入商品Id.',
                }],
              })(
                <Input placeholder="请输入商品Id"  disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品名称"
              hasFeedback
            >
              {getFieldDecorator('productName', {
                initialValue: initEditData.productName,
                rules: [{
                  required: true, message: '请输入商品名称.',
                }],
              })(
                <Input placeholder="请输入商品名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品单位"
              hasFeedback
            >
              {getFieldDecorator('unit', {
                initialValue: initEditData.unit,
                rules: [{
                  required: true, message: '请输入商品单位',
                }],
              })(
                <Input placeholder="请输入商品单位" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品图片"
            >
                  <Upload
                  action="/admin/api/file/fileUpload?type=3"
                  listType="picture-card"
                  fileList={shopProductList}
                  accept="image/png, image/jpeg"
                  onRemove={this.handleProductRemove}
                  onPreview={this.handleProductPreview}
                  beforeUpload={this.handleShopProductBeforeUpload}
                  customRequest={this.handleCustomRequest}
                >
                  {shopProductList.length >= 1 ? null : uploadButton}
                </Upload>
              <Modal visible={previewShopProductVisible} footer={null} onCancel={this.handleProductCancel}>
                <img alt="商品图片" style={{ width: '100%' }} src={previewShopProduct} />
              </Modal>
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
