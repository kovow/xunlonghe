import React,{PureComponent} from 'react';
import {Row,Col,Card,DatePicker,Button} from 'antd';
import echarts from 'echarts';
import Area from '../../../components/Charts/Area/index';
import styles from '../../Dashboard/Analysis.less';
import { getTimeDistance } from '../../../utils/utils';
// 面包屑
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
const { RangePicker } = DatePicker;
class AssetsReport extends PureComponent{
  state={
    rangePickerValue: []
  }
  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });
  }
  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day')) {
      return styles.currentDate;
    }
  }
  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
  }
  render(){
    const {rangePickerValue} = this.state;
    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      style: { marginBottom: 24 },
    };
    // 折线图配置2
    const options1 = {
      title: {
        show: false,
        text: ''
      },
      legend: {
        show: true,
        top: '10px',
        data: [{
          name: '借出数',
          // 强制设置图形为圆。
          icon: 'circle',
          // 设置文本为红色
          textStyle: {
            color: '#000'
          }
        },{
          name: '归还数',
          // 强制设置图形为圆。
          icon: 'circle',
          // 设置文本为红色
          textStyle: {
            color: '#000'
          }
        }]
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false, //坐标轴两边留空白策略
        axisTick: {
          alignWithLabel: true //刻度线与标签对其
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#000'
          }
        },
        //  改变x轴字体颜色和大小
        axisLabel: {
          textStyle: {
            color: '#000'
          }
        }
      },
      // y轴
      yAxis: {
        type: 'value',
        scale: true, //脱离0的束缚
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#000'
          }
        },
        //  改变x轴颜色
        axisLine: {
          lineStyle: {
            color: '#000'
          }
        }
      },
      series: [{
        name: '借出数',
        type: 'line',
        stacked: true,
        smooth: true, //是否平滑曲线显示
        symbol: 'circle', //标记的图形。ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        symbolSize: 5, //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10[ default: 4 ] 
        showSymbol: true, //是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示
        lineStyle: { //线条样式
          normal: {
            width: 1 //线宽。[ default: 2 ] 
          }
        },
        areaStyle: { //区域填充样式
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //填充的颜色。
              offset: 0, // 0% 处的颜色
              color: 'rgba(104, 221, 109, 0.3)'
            }, {
              offset: 0.8, // 80% 处的颜色
              color: 'rgba(104, 221, 109, 0.3)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)', //阴影颜色。支持的格式同color
            shadowBlur: 10 //图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果
          }
        },
        itemStyle: {
          normal: {
            color: '#68DD77',
            borderColor: 'rgba(104, 221, 109, 0.27)', //图形的描边颜色。支持的格式同 color
            borderWidth: 6 //描边线宽。为 0 时无描边。[ default: 0 ] 
          }
        }
      },{
        name: '归还数',
        type: 'line',
        stacked: true,
        smooth: true, //是否平滑曲线显示
        symbol: 'circle', //标记的图形。ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        symbolSize: 5, //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10[ default: 4 ] 
        showSymbol: true, //是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示
        lineStyle: { //线条样式
          normal: {
            width: 1 //线宽。[ default: 2 ] 
          }
        },
        areaStyle: { //区域填充样式
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //填充的颜色。
              offset: 0, // 0% 处的颜色
              color: 'rgba(24,144,255, 0.3)'
            }, {
              offset: 0.8, // 80% 处的颜色
              color: 'rgba(24,144,255, 0.3)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)', //阴影颜色。支持的格式同color
            shadowBlur: 10 //图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果
          }
        },
        itemStyle: {
          normal: {
            color: '#1890FF',
            borderColor: 'rgba(24,144, 255, 0.27)', //图形的描边颜色。支持的格式同 color
            borderWidth: 6 //描边线宽。为 0 时无描边。[ default: 0 ] 
          }
        }
      }]
    };
    // 页头内容
    const pageHeaderContent = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra} style={{marginBottom: '.325rem'}}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            全年
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
    // 搜索按钮
    const pageHeaderExtra = (
      <div className="">
        <Button type="primary" shape="circle" icon="search" />
      </div>
    );
    return(
      <PageHeaderLayout title="资产总览"
        content={pageHeaderContent}
        extraContent={pageHeaderExtra}
      >
        <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <Card
                  bodyStyle={{ padding: 24 }}
                  bordered={false}
                  title="资产总览"
              >
                <Area
                  options={options1}
                  data={['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']}
                  inputData={[1,-2,3,-4,5,6,-7,8,9,-10,11,12,13,14,15,16,17,-18,19,20,21,22,23,24]}
                  outputData={[-24,23,-22,21,-20,19,18,17,16,15,-14,13,12,11,10,-9,8,7,6,5,4,3,2,-1]}
                  height={700}
                />
              </Card>
            </Col>
          </Row>
        </PageHeaderLayout>
    );
  }
}
export default AssetsReport;