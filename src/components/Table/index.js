import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const statusMap = ['default', 'processing', 'success', 'error'];
class TableList extends PureComponent {
  render() {
    const { data,loading,columns,pagination} = this.props;
    const pagetionsOptions = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10','20','30','40','50','100'],
      ...pagination,
    }
    return (
      <div className={styles.TableList}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={data}
          columns={columns}
          pagination={pagetionsOptions}      
        />
      </div>
    );
  }
}

export default TableList;
