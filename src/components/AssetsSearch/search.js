import React,{Component} from 'react';
import {Button,Dropdown,Select,Row,Col,Menu,Input} from 'antd';
import classNames from 'classnames';
import styles from './search.less';
const {Option} = Select;
const {Item} = Menu;
const {Search} = Input;
const SearchComponent = (props)=>{
  // 把数据选择状态传给父组件
  const handleSelectStatus = (e)=>{
    props.onSelectStatus(e);
  }
  // 下拉选项1事件
  const handleDropAssets = (e)=>{
    props.onSelMenu(e.key);
  }
  // 下拉选项2 事件
  const handleDropAssets1 = (e)=>{
    props.onSelMenu1(e.key);
  }
  // 打开增加资产modal
  const handleAddAssets = (e)=>{
    props.onModalVisible(true);
  }
  // 下拉菜单1
  const menu = props.menu ? (
    <Menu onClick={handleDropAssets}> 
      {props.menu.map((item)=>{
        return <Item key={item.id}>{item.name}</Item>
      })}
    </Menu>
  ):(
    <Menu onClick={handleDropAssets}>
      <Item key="0">资产领用</Item>
      <Item key="1">资产借用</Item>
      <Item key="2">资产调拨</Item>
      <Item key="3">清理报废</Item>
    </Menu>
  );
  // 下拉菜单2
  const menu1 = props.menu1 ? (
    <Menu onClick={handleDropAssets1}> 
      {props.menu1.map((item)=>{
        return <Item key={item.id}>{item.name}</Item>
      })}
    </Menu>
  )
  :(
    <Menu>
      <Item key="1">修改</Item>
      <Item key="2">删除</Item>
    </Menu>
  );
  const rowLayout = {
    xs: 16, 
    sm: 16, 
    md: 16
  };
  // 响应式布局
  const colLayout = {
    xs: {span:24}, 
    sm: {span:24}, 
    md: {span:18}
  };
  const colLayout1 = {
    xs: {span:24}, 
    sm: {span:2}, 
    md: {span:6}
  };
  const colChildLayout={
    xs: {span:24}, 
    sm: {span:12}, 
    md: {span:8}
  };
  return(
    <Row gutter={rowLayout}>
      <Col {...colLayout}>
        <Row gutter={rowLayout}>
          <Col {...colChildLayout} className={styles.mb10}>
            <div className={styles.changeStatus}>
              <div className={styles.statusLabel}>
                <label title="使用状态">使用状态:</label>
              </div>
              <div className={styles.statusSel}>
                <Select placeholder="请选择使用状态" style={{width:'100%'}} onChange={handleSelectStatus}>
                  <Option value="1">test</Option>
                  <Option value="2">test</Option>
                </Select>
              </div>
            </div>
          </Col>
          <Col {...colChildLayout}>
            <Dropdown overlay={menu} trigger={['click']} >
              <Button type="primary" className={styles.assetsBtn} icon="down">
                处理 
              </Button>
            </Dropdown>
            <Button className={classNames(styles.assetsBtn,styles.assetsBtnSuccess)} icon="plus" onClick={handleAddAssets}>增加</Button>
            <Dropdown overlay={menu1} trigger={['click']} >
              <Button className={styles.assetsBtn} icon="edit">
                  编辑
              </Button>
            </Dropdown>
          </Col>
          <Col {...colChildLayout}>
            <Button className={classNames(styles.assetsBtn)} icon="file-word">导出</Button>
            <Button className={classNames(styles.assetsBtn)} icon="printer">打印</Button>
          </Col>
        </Row>
      </Col>
      <Col {...colLayout1}>
        <Search
          placeholder="搜索"
          onSearch={value => console.log(value)}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>
  );
};
export default SearchComponent;