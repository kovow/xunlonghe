import React,{PureComponent} from 'react';
import { Map, Markers } from 'react-amap';
import {Modal} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
const randomMarker = (len) => (
  Array(len).fill(true).map((e, idx) => ({
    position: {
      longitude: 113.18 + Math.random() * .02,
      latitude: 28.34 + Math.random() * .02,
    },
    myIndex: idx,    //自定义内容
    myLabel: idx+'s'
  }))
);
export default class ParkCart extends PureComponent{
    constructor(props){
      super(props);
      this.center = {longitude: 113.1991994, latitude: 28.35021417}
      this.state ={
        lat: null,
        lng: null,
        modal1Visible: false
      };
      this.markers = randomMarker(30);
      this.markersEvents = {
        created:(allMarkers) => { 
          // console.log(AMap);
          // console.log('All Markers Instance Are Below');
          // console.log(allMarkers);
        },
        click: (MapsOption, marker) => {
          // console.log('MapsOptions:');
          // console.log(MapsOption);
          // console.log(marker);
          // console.log(marker.Pg.position);
          this.setState({
            lng: marker.Pg.position.lng,
            lat: marker.Pg.position.lat,
            modal1Visible: true
          });
        }
      };
      this.setModalVisible = this.setModalVisible.bind(this);
    }
    // 设置模态显示
    setModalVisible = ()=>{
      this.setState({
        modal1Visible: false
      });
    }
    render(){
      /*临时功能*/ 
      let pathname = this.props.location.pathname;
      let name = '';
      if(pathname.replace(/^\/?/ig,'').replace(/\//ig,'.').replace(/\//ig,'.') === 'cmp.ers_sys.e_dashboard'){
        name = '应急资源调度系统';
      }else if(pathname.replace(/^\/?/ig,'').replace(/\//ig,'.').replace(/\//ig,'.') === 'cmp.bus_sys.b_dashboard'){
        name = '摆渡车调度系统';
      }
      // end
      return   <PageHeaderLayout title={name}> 
        <div style={{width: '100%', height: 500,borderRadius:'15px',backgroundColor:'#fff',padding: '15px'}}>
          <Map plugins={['ToolBar']}  center={this.center} zoom={14}>
            <Markers 
              markers={this.markers}
              events={this.markersEvents}
              useAMapUI
              // render={this.renderMarkerLayout}
            />
          </Map>
          <Modal
            title="浔龙河"
            style={{ top: 20 }}
            visible={this.state.modal1Visible}
            onCancel={this.setModalVisible}
            onOk={this.setModalVisible}
          >
            <p>经度:{this.state.lng}</p>
            <p>维度:{this.state.lat}</p>
          </Modal>
        </div>
      </PageHeaderLayout>
    }
}