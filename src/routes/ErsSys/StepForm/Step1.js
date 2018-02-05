import React from 'react';
import { Form, Input, Button, Select, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;

export default ({ formItemLayout, form, dispatch }) => {
  const { getFieldDecorator, validateFields } = form;
  const onValidateForm = () => {
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/saveStepFormData',
          payload: values,
        });
        dispatch(routerRedux.push('/ers_sys/resource/add/confirm'));
      }
    });
  };
  return (
    <div>
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Form.Item
          {...formItemLayout}
          label="调度员姓名"
        >
          {getFieldDecorator('payAccount', {
            initialValue: '',
            rules: [{ required: true, message: '请选择调度员' }],
          })(
            <Select placeholder="请选择调度员">
              <Option value="张三">张三</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="调度员级别"
        >
          <Input.Group compact>
            <Select defaultValue="user" style={{ width: 100 }}>
              <Option value="user">普通</Option>
              <Option value="admin">超级</Option>
            </Select>
            {getFieldDecorator('receiverAccount', {
              initialValue: '',
              rules: [
                { required: true, message: '调度员是否在岗' }
              ],
            })(
              <Input style={{ width: 'calc(100% - 100px)' }} placeholder="是" />
            )}
          </Input.Group>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="调度员签名"
        >
          {getFieldDecorator('receiverName', {
            initialValue: '',
            rules: [{ required: true, message: '请输入调度员姓名' }],
          })(
            <Input placeholder="请输入调度员姓名" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="停车位费用"
        >
          {getFieldDecorator('amount', {
            initialValue: '10',
            rules: [
              { required: true, message: '请输入停车位费用' },
              { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' },
            ],
          })(
            <Input prefix="￥" placeholder="请输入金额" />
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ margin: '40px 0 24px' }} />
      <div className={styles.desc}>
        <h3>说明</h3>
        {/* <h4>转账到支付宝账户</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        <h4>转账到银行卡</h4>
        <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p> */}
      </div>
    </div>
  );
};
