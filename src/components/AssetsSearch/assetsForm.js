import React,{Component} from 'react';
import {Form,Select,Modal,Input,Upload,Button,Icon} from 'antd';
const FormItem = Form.Item;
const {Option} = Select;
@Form.create()
class AssetsForms extends Component{
  constructor(props){
    super(props);
  }
  state = {
    imgList:[],
    previewVisible: false,
    preview: ''
  }
  handleCustomRequest = ()=>{

  }
  handleFormReset = ()=>{

  }
  handleImgCancel = ()=>{

  }
  handleImgPreview = ()=>{

  }
  handleImgRemove = ()=>{

  }
  handleImgBeforeUpload = ()=>{

  }
  handleSubmit = ()=>{

  }
  render(){
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const {form:{getFieldDecorator}} = this.props;
    const {imgList,preview,previewVisible} = this.state;
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
    return(
      <>
        <Form onSubmit={this.handleSubmit} layout="vertical">
            <FormItem
              {...formItemLayout}
              label="资产名称"
              hasFeedback
            >
              {getFieldDecorator('itemName', {
                rules: [{
                  required: true, message: '请输入资产名称!',
                }],
              })(
                <Input placeholder="请输入资产名称!"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产条码"
              hasFeedback
            >
              {getFieldDecorator('barcode', {
                rules: [{
                  required: true, message: '请输入资产条码!!',
                }],
              })(
                <Input placeholder="请输入资产条码"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
              hasFeedback
            >
              {getFieldDecorator('address', {
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
                  fileList={imgList}
                  accept="image/png, image/jpeg"
                  onRemove={this.handleImgRemove}
                  onPreview={this.handleImgPreview}
                  beforeUpload={this.handleImgBeforeUpload}
                  customRequest={this.handleCustomRequest}
                >
                  {imgList.length >= 1 ? null : uploadButton}
                </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleImgCancel}>
                <img alt="logo" style={{ width: '100%' }} src={preview} />
              </Modal>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="营业时间"
              hasFeedback
            >
              {getFieldDecorator('openTime', {
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
                rules: [{
                  required: true, message: '商户描述',
                }],
              })(
                <Input placeholder="商户描述"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资产类别"
              hasFeedback
            >
              {getFieldDecorator('assetTypeId', {
                rules: [
                  { required: true, message: 'Please select your country!' },
                ],
              })(
                <Select placeholder="请选择资产类别">
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
      </>
    );
  }
}
export default AssetsForms;