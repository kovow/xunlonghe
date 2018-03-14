import React, { PureComponent } from 'react';
// dva 连接组件
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button,  InputNumber, DatePicker,  message,Icon,Tree,Modal} from 'antd';
// 面包屑头
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import TableList from '../../../components/Table/index';
import styles from '../../Setting/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
@connect(state => ({
  rule: state.rule,
}))
@Form.create()
export default class areaList extends PureComponent {
  constructor(props){
    super(props);
    // 出事状态
    this.state = {
      expandForm: false, //展开高级搜索
      tableData: [],
      modalVisible: false
    };
  }
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
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchAreaAllList',
    });
  }
  // 渲染分类树形节点
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.categorys) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.categorys)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.key} dataRef={item} />;
    });
  }
  onSelTree = (onKey,info)=>{
    if(onKey.length >0){
      if(info.node.props.dataRef.categorys && info.node.props.dataRef.categorys.length >0){
        this.setState({
          tableData: info.node.props.dataRef.categorys
        });
      }else{
        this.setState({
          tableData: [info.node.props.dataRef]
        });
      }
    }else{
      message.info('取消选择');
    }
  }
  // 添加区域 modal
  handleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }
  // 添加区域
  handleSubmit = (e)=>{
    e.preventDefault();
    const {form,dispatch} = this.props;
    form.validateFields((err,values)=>{
      if(!err){
        dispatch({
          type: 'rule/addArea',
          payload: values
        });
        this.handleModalVisible();
      }
    })
  }
  render() {
    // 表格数据
    const {rule: { loading, data},form:{getFieldDecorator}} = this.props;
    const {tableData,modalVisible} = this.state;
    // 表格列数据
    const columns = [{
      title: '分类id',
      key:'id',
      dataIndex:'id'
    }, {
      title: '分类名称',
      key:'name',
      dataIndex:'name',
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
      <PageHeaderLayout title="商品分类">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
              <Button type="primary" onClick={this.handleModalVisible}>添加区域</Button>
            </div>
          {/* 表格信息 */}
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Tree
                   showLine
                   defaultExpandedKeys={['1']}
                   onSelect={this.onSelTree}
                >
                  {data&& this.renderTreeNodes(data)}
                </Tree>
              </Col>
              <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                <TableList
                  loading={loading}
                  data={tableData}
                  columns={columns}
                />
              </Col>
            </Row>
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
              label="区域名称"
              hasFeedback
            >
              {getFieldDecorator('name',{
                 rules: [{
                  required: true, message: '请输入区域名称!',
                }]
              })(
                <Input  placeholder="请输入区域名称!"/>
              )}
            </FormItem>
            <FormItem 
              {...formItemLayout}
              label="选择区域"
            >
              {getFieldDecorator('parentId')(
                <Select placeholder="请选择区域" style={{ width: '100%' }}>
                  {/* <Option value="0" >父级区域</Option> */}
                  {data && data.map((item,index)=>{
                    return <Option value={item.id} key={index}>{item.name}</Option>
                  })}
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
