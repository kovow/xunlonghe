import React,{Component} from 'react';
import echarts from 'echarts';
require('echarts/theme/macarons');
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import equal from '../equal';
/*进度条组件*/ 
/* eslint react/no-danger:0 */
class Progress extends Component{
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
    let data = d || this.props.data;
    this.chart = echarts.init(this.node, 'macarons')
    // 改变进度条数据
    options.series[0].data = data;
    // 根据进度条数据显示文字
    if (data >= 50) {
      options.series[0].label.normal.position = 'inside';
    } else if (data < 50) {
      options.series[0].label.normal.position = 'right';
    }
    const op = {
      title: options.title,
      animationDuration: options.animationDuration,
      grid:options.grid,
      xAxis: options.xAxis,
      yAxis: options.yAxis,  
      tooltip: options.tooltip,
      series: options.series.map((item,i)=>{
        return item;
      })
    };
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
export default Progress;