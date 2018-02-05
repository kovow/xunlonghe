import React from 'react';
import { Form, Input, Button, Alert, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';

export default ({ formItemLayout, form, data, dispatch, submitting }) => {
  const { getFieldDecorator, validateFields } = form;
  const onPrev = () => {
    dispatch(routerRedux.push('/ers_sys/resource/add'));
  };
  const onValidateForm = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitStepForm',
          payload: {
            ...data,
            ...values,
          },
        });
      }
    });
  };
  return (
    <Form layout="horizontal" className={styles.stepForm}>
      <Alert
        closable
        showIcon
        message="确认车辆信息录入。"
        style={{ marginBottom: 24 }}
      />
      <Form.Item
        {...formItemLayout}
        className={styles.stepFormText}
        label="车牌号"
      >
        {data.payAccount}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        className={styles.stepFormText}
        label="车类型"
      >
        {data.receiverAccount}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        className={styles.stepFormText}
        label="车主"
      >
        {data.receiverName}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        className={styles.stepFormText}
        label="转账金额"
      >
        <span className={styles.money}>{data.amount}</span>
        <span className={styles.uppercase}>（{digitUppercase(data.amount)}）</span>
      </Form.Item>
      <Divider style={{ margin: '24px 0' }} />
      <Form.Item
        {...formItemLayout}
        label="支付密码"
        required={false}
      >
        {getFieldDecorator('password', {
          initialValue: '123456',
          rules: [{
            required: true, message: '需要支付密码才能进行支付',
          }],
        })(
          <Input type="password" autoComplete="off" style={{ width: '80%' }} />
        )}
      </Form.Item>
      <Form.Item
        style={{ marginBottom: 8 }}
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
        }}
        label=""
      >
        <Button type="primary" onClick={onValidateForm} loading={submitting}>
          提交
        </Button>
        <Button onClick={onPrev} style={{ marginLeft: 8 }}>
          上一步
        </Button>
      </Form.Item>
    </Form>
  );
};
