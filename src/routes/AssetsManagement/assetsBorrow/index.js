import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button,  InputNumber, DatePicker, Modal, message,Upload,Icon,Alert} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../DataAnalysis/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class AssetsBorrow extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      modalVisible: false, //显示标记modal
      initEditData: {}, //初始表格数据
      previewShopProductVisible: false,  //预览上传logo图片modal
      previewShopProduct: '', //预览上传logo文件
      shopProductList: [], //上传logo文件列表
      expandForm: false, //展开高级搜索,
      modalTitle: '',
      url: ''
    };
  }
  // 编辑表格
  handleTableEdit = (e)=>{
    const newData = {
      "id": e.id,
      "assetsName": e.assetsName,
      "categoryType": e.categoryType,
      "status": e.status,
      "sector": e.sector,
      "assetsNumber": e.assetsNumber
    };
    this.setState({
      modalVisible: true,
      initEditData: Object.assign(...this.state.initEditData,newData),
      modalTitle: '编辑资产',
      url: 'edit'
    });
  }
  // 显示modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }
  // 提交修改商铺表单数据
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err, values) => {
      if (!err) {
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
  // 添加资产
  handleAddAssets(){
    this.setState({
      modalVisible: true,
      modalTitle: '添加资产',
      initEditData: {},
      url: 'add'
    });
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
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'rule/fetchProduct',
    // });
  }
  // 上传成功之后更新预览图
  componentWillReceiveProps(nextProps){
    // if(Object.keys(nextProps.rule.imgSig).length !== 0){
    //   if(nextProps.rule.imgSig.type === 3){
    //     this.setState({
    //       shopProductList: [{uid:nextProps.rule.imgSig.key,url:nextProps.rule.imgSig.imgUrl,name: nextProps.rule.imgSig.image}]
    //     });
    //   }
    // }
  }
  render() {
    // 表格数据
    const {rule: { loading, imgSig },form:{getFieldDecorator}} = this.props;
    // 表格列数据
    const columns = [{
      title: '借还人id',
      key:'id',
      dataIndex:'id'
    },{
      title: '预计归还时间',
      key:'date',
      dataIndex:'date'
    },{
      title: 'uuid',
      key: 'uuid',
      dataIndex: 'uuid'
    },{
      title: '资产编号',
      key:'assetsNumber',
      dataIndex:'assetsNumber'
    },{
      title: '名称',
      key:'assetsName',
      dataIndex:'assetsName'
    },{
      title: '资产类型',
      key: 'categoryType',
      dataIndex: 'categoryType'
    },{
      title: '所属网点',
      key: 'sector',
      dataIndex: 'sector'
    },{
      title: '状态',
      key:'status',
      dataIndex:'status',
    },{
      title: '备注',
      key:'notes',
      dataIndex:'notes',
    },{
      title: '操作',
      key:'operating',
      dataIndex:'operating',
      render: (key,record) =>(<span><Button type="primary" size='small' onClick={() => this.handleTableEdit(record)}>修改</Button> <Button type="danger" size='small' >删除</Button></span>)
    }];
    // 模拟数据
    const data = [{
      key: '1',
      id: 1,
      uuid: 'dsadaas-d-sad12-sad-sa-dzxcasd',
      date: '2017-08-11',
      assetsNumber: '971846561',
      assetsName: '圆珠笔',
      categoryType: '+87',
      sector: '客户部',
      status: '正常',
      notes: '测试'
    }, {
      key: '2',
      id: 2,
      uuid: 'dsadaas-d-sad12-sad-sa-dzxcasd',
      assetsNumber: '971846561',
      assetsName: '记事本',
      date: '2017-08-11',
      categoryType: '+87',
      sector: '客户部',
      status: '外借',
      notes: '测试'
    }, {
      key: '3',
      id: 3,
      uuid: 'dsadaas-d-sad12-sad-sa-dzxcasd',
      assetsNumber: '971846561',
      assetsName: '热水壶',
      date: '2017-08-11',
      categoryType: '+87',
      sector: '客户部',
      status: '丢失',
      notes: '测试'
    }];
    // 状态
    const {modalVisible,initEditData,previewShopProductVisible, previewShopProduct, shopProductList,modalTitle,url} = this.state;
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
      <PageHeaderLayout title="借还登记列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAddAssets.bind(this)}>登记借还</Button>
            </div>
          {/* 表格信息 */}
            <TableList
              loading={false}
              data={data}
              columns={columns}
            />
          </div>
        </Card>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.handleModalVisible}
          footer={null}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical">
          <FormItem
              {...formItemLayout}
              label="借/还人id"
              hasFeedback
            >
            {getFieldDecorator('id', {
                initialValue: initEditData.id,
                rules: [{
                  required: true, message: '请选择借/还人id',
                }],
              })(
                <Select placeholder="请选择借/还人id">
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                  <Option value="88">+88</Option>
                  <Option value="89">+89</Option>
                  <Option value="90">+90</Option>
                  <Option value="91">+91</Option>
                  <Option value="92">+92</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="归还时间"
            >
              {getFieldDecorator('date', {
                initialValue: initEditData.date,
                rules: [{
                  required: true, message: '请选择归还时间',
                }],
              })(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产名称"
              hasFeedback
            >
              {getFieldDecorator('assetsName', {
                initialValue: initEditData.assetsName,
                rules: [{
                  required: true, message: '请输入资产名称',
                }],
              })(
                <Input placeholder="请输入资产名称" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产类型"
              hasFeedback
            >
            {getFieldDecorator('categoryType', {
                initialValue: initEditData.categoryType,
                rules: [{
                  required: true, message: '请选择资产类型',
                }],
              })(
                <Select >
                  <Option value="86">+86</Option>
                  <Option value="87">+87</Option>
                  <Option value="88">+88</Option>
                  <Option value="89">+89</Option>
                  <Option value="90">+90</Option>
                  <Option value="91">+91</Option>
                  <Option value="92">+92</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产状态"
              hasFeedback
            >
            {getFieldDecorator('status', {
                initialValue: initEditData.status,
                rules: [{
                  required: true, message: '请选择资产类型',
                }],
              })(
                <Select >
                  <Option value="外借">外借</Option>
                  <Option value="已归还">已归还</Option>
                  <Option value="丢失">丢失</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="所属部门"
              hasFeedback
            >
            {getFieldDecorator('sector', {
                initialValue: initEditData.sector,
                rules: [{
                  required: true, message: '请选择所属部门',
                }],
              })(
                <Select >
                  <Option value="客服部">客服部</Option>
                  <Option value="管理部">管理部</Option>
                  <Option value="维修部">维修部</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产编号(uuid)"
              hasFeedback
            >
              {getFieldDecorator('assetsNumber', {
                initialValue: initEditData.assetsNumber,
                rules: [{
                  required: true, message: '请输入资产编号',
                }],
              })(
                <Input placeholder="资产编号" />
              )}
               <Alert message="资产编号是由用户提供的,定位物品；便于物品丢失时索引" type="info"  style={{marginTop:'.5rem'}}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产图片"
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
                <img alt="资产图片" style={{ width: '100%' }} src={previewShopProduct} />
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
