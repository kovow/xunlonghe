import React,{Component} from 'react';
import echarts from 'echarts';
require('echarts/theme/macarons');
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import equal from '../equal';
/*封装折线图组件,根据父级组建传递来的配置跟数据改变*/ 
/* eslint react/no-danger:0 */
class Area extends Component{
  state = {
    areaData: []
  }
  componentDidMount(){
    this.renderChart();
    this.resize();
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    if (!equal(this.props, nextProps)) {
      this.renderChart(nextProps.data,nextProps.inputData,nextProps.outputData);
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize',this.resize);
    if(this.chart){
      this.chart.dispose();
    }
    this.chart = null;
  }
  @Bind()
  @Debounce()
  resize(){
    if(this.chart){
      this.chart.resize();
    }
  }
  handleRef = (n) => {
    this.node = n;
  }
  // handleRoot = (n) => {
  //   this.root = n;
  // }
  renderChart (d,i,o){
    const {options} = this.props;
    // x轴数据
    let data = d || this.props.data;
    // 折线图数据
    let inputData = i || this.props.inputData;
    let outputData = o || this.props.outputData; 
    // 合并折线图数据
    let arr = [inputData,outputData];
    // 折线图配置
    const op = {
      title: options.title,
      legend:options.legend,
      tooltip: options.tooltip,
      xAxis: Object.assign(...options.xAxis,{data:data}),
      // y轴
      yAxis: options.yAxis,
      series: options.series.map((item,i)=>{
        item.data = arr[i];
        return item;
      })
    };
    this.chart = echarts.init(this.node, 'macarons')
    this.chart.setOption(op);
  }
  render(){
    const {height} = this.props;
    return(
      <div ref={this.handleRef} style={{width:'100%',height:height}}>
      </div>
    );
  }
}
export default Area;