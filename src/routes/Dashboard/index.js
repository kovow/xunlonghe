import React,{PureComponent} from 'react';
import {Card,Row,Col,Dropdown,Icon,Menu,Radio,Table} from 'antd';
import echarts from 'echarts';
// 面包屑
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Pie from '../../components/Charts/Pie/index';
import Area from '../../components/Charts/Area/index';
import Progress from '../../components/Charts/Progress/index';
import styles from './Analysis.less';
/*智慧停车管理系统模拟图表数据*/ 
class Dashboard extends PureComponent{
  state = {
    salesType: 'year',
    data:['2010年','2011年','2012年','2013年','2014年','2015年','2016年','2017年'],
    inputData:[233,168,188,322,798,888,669,1200],
    outputData:[666,535,455,999,1110,666,888,369],
    filteredInfo: null,
    sortedInfo: null
  }
  // 点击改变折折线图数据
  handleChangeSalesType = (e)=>{
    this.setState({
      salesType: e.target.value
    });
    if(e.target.value === 'year'){
      this.setState({
        data:['2010年','2011年','2012年','2013年','2014年','2015年','2016年','2017年'],
        inputData:[233,168,188,322,798,888,669,1200],
        outputData:[666,535,455,999,1110,666,888,369]
      });
    }else if(e.target.value === 'month'){
      this.setState({
        data:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        inputData:[66,15,99,45,6,9,47,12,66,47,25,120],
        outputData:[5,9,3,45,88,12,66,77,33,10,11,55]
      });
    }else if(e.target.value === 'day'){
      this.setState({
        data:['1号','2号','3号','4号','5号','6号','7号','8号','9号','10号','11号','12号','13号','14号','15号','16号','17号','18号','19号','20号','21号','22号','23号','24号','24号','26号','27号','28号','29号','30号','31号'],
        inputData:[66,15,99,45,6,9,47,12,66,47,25,135,158,99,233,144,669,14,333,123,1,55,69,26.33,15,46.33,15,88,99,15,66],
        outputData:[5,9,3,45,88,12,66,77,33,10,11,55,158,99,233,144,669,14,333,123,1,55,69,26.33,15,46.33,15,333,111,222]
      });
    }
  }
  // 改变表格数据
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }
  render(){
    let {salesType,data,inputData,outputData,sortedInfo, filteredInfo} = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    // 响应式
    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
      style: { marginBottom: 24 },
    };
    //折线图配置1
    const options = {
      title: {
        show: true,
        text: '周末工作日、车辆进出场时间分布',
        x: 'center',
        textStyle: {
          color: '#000',
          fontSize: '180%',
          align: 'center'
        }
      },
      legend: {
        show: true,
        bottom: '10px',
        data: [{
          name: '进场',
          // 强制设置图形为圆。
          icon: 'circle',
          // 设置文本为红色
          textStyle: {
            color: '#000'
          }
        },{
          name: '出场',
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
        name: '进场',
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
        name: '出场',
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
    // 折线图配置2
    const options1 = {
      title: {
        show: true,
        text: '当日车辆出入统计',
        x: 'center',
        textStyle: {
          color: '#000',
          fontSize: '180%',
          align: 'center'
        }
      },
      legend: {
        show: true,
        bottom: '10px',
        data: [{
          name: '进场',
          // 强制设置图形为圆。
          icon: 'circle',
          // 设置文本为红色
          textStyle: {
            color: '#000'
          }
        },{
          name: '出场',
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
        name: '进场',
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
        name: '出场',
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
    // 饼图配置
    const PieOption = {
      title: {
        text: '70%',
        x: 'center',
        y: 'center',
        textStyle: {fontWeight: 'normal',color: '#0580f2',fontSize: '22'}
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {orient:'horizontal',x:'center',y:'bottom',data:['入场','出场']},
      series: [
        {
          name:"当日车辆使用情况",
          type:'pie',
          radius: ['55%','70%'],
          avoidLabelOverlap: true,
          label: {
            normal: false,
            emphasis: {show:false,textStyle:{fontSize:'30',fontWeight:'blod'}}
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    };
    // 进度条配置
    const ProgressOption = {
        title: {
            text: ''
        },
        animationDuration: 5000,
        grid: {
          top: 'top',
          left: '0%',
          right: '0%',
          height: '100%',
          containLabel: false
      },
      tooltip: {
        trigger: 'item',
        formatter: "{c}%"
      },
        xAxis: {
            type: 'value',
            axisLabel: {
                show: false,
            },
            max: 100,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
        },
        yAxis: [{
            type: 'category',
            data: [],
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            z: 10
        }, {
            type: 'category',
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            data: [],
        }],
        series: [{
            name: '',
            type: 'bar',
            barWidth: '100%',
            // barMaxWidth: '100%',
            label: {
                normal: {
                    show: true,
                    // position:'inside',
                    formatter: '{c} %',
                    textStyle: {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontFamily: 'Microsoft YaHei',
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    shadowBlur: 10,
                    shadowColor: '#111',
                    color: '#2FD04F'
                }
            },
            data: [65],
            z: 10
        }, {
            type: 'bar',
            barWidth: '100%',
            yAxisIndex: 1,
            silent: true,
            // barMaxWidth: '100%',
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    color: '#42475B'
                }
            },
            data: [100],
        }]
    };
    // 模拟车辆进出场数据环形图
    const PieData = [{
      value:70,
      name: '入场'
    },{
      value: 30,
      name: '出场'
    }];
    // card 小菜单
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );
    // 模拟停车数据表格 --列
    const columns = [{
      title: '停车场名称',
      dataIndex: 'name',
      key: 'name',
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    }, {
      title: '今日收费',
      dataIndex: 'todayToll',
      key: 'todayToll',
      sorter: (a, b) => a.todayToll - b.todayToll,
      sortOrder: sortedInfo.columnKey === 'todayToll' && sortedInfo.order,
    }, {
      title: '昨日收费',
      dataIndex: 'yesToll',
      key: 'yesToll',
      sorter: (a, b) => a.yesToll - b.yesToll,
      sortOrder: sortedInfo.columnKey === 'yesToll' && sortedInfo.order,
    }, {
      title: '前日收费',
      dataIndex: 'befToll',
      key: 'befToll',
      sorter: (a, b) => a.befToll - b.befToll,
      sortOrder: sortedInfo.columnKey === 'befToll' && sortedInfo.order,
    }, {
      title: '环比增长',
      dataIndex: 'increase',
      key: 'increase',
      sorter: (a, b) => a.increase - b.increase,
      sortOrder: sortedInfo.columnKey === 'increase' && sortedInfo.order,
    },{
      title: '日均消费',
      dataIndex: 'dayToll',
      key: 'dayToll',
      sorter: (a, b) => a.dayToll - b.dayToll,
      sortOrder: sortedInfo.columnKey === 'dayToll' && sortedInfo.order,
    },{
      title: '近一周',
      dataIndex: 'sikeep',
      key: 'sikeep',
      sorter: (a, b) => a.sikeep - b.sikeep,
      sortOrder: sortedInfo.columnKey === 'sikeep' && sortedInfo.order,
    }];
    // 模拟停车数据表格 --数据
    const tableData = [{
      key: '1',
      name: '停车场1',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }, {
      key: '2',
      name: '停车场2',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }, {
      key: '3',
      name: '停车场3',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }, {
      key: '4',
      name: '停车场4',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }, {
      key: '5',
      name: '停车场6',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }, {
      key: '6',
      name: '停车场6',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }, {
      key: '7',
      name: '停车场7',
      todayToll: 12505.00,
      yesToll: 6669.66,
      befToll: 1566,
      increase: '50%',
      dayToll: 1300,
      sikeep: 165584
    }];
    // card 菜单
    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );
    return(
      <PageHeaderLayout title="智慧停车系统">
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <Card
                bodyStyle={{ padding: 24 }}
                bordered={false}
                title="周末工作日、车辆进出场时间分布"
                className={styles.salesCard}
                extra={(
                  <div className={styles.salesCardExtra}>
                    {iconGroup}
                  </div>
                )}
            >
              <Area
                options={options}
                data={data}
                inputData={inputData}
                outputData={outputData}
                height={400}
              />
              <div className={styles.styleRadio}>
                <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                  <Radio.Button value="year">年</Radio.Button>
                  <Radio.Button value="month">月</Radio.Button>
                  <Radio.Button value="day">日</Radio.Button>
                </Radio.Group>
              </div>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card
            bodyStyle={{ padding: 24 }}
            bordered={false}
            title="停车场收费分析"
            className={styles.salesCard}
            extra={(
              <div className={styles.salesCardExtra}>
                {iconGroup}
              </div>
            )}
            >
              <Table columns={columns} dataSource={tableData} onChange={this.handleChange} pagination={{pageSize:4}}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <Card
                bodyStyle={{ padding: 24 }}
                bordered={false}
                title="周末工作日、车辆进出场时间分布"
                className={styles.salesCard}
                extra={(
                  <div className={styles.salesCardExtra}>
                    {iconGroup}
                  </div>
                )}
            >
              <Area
                options={options1}
                data={['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']}
                inputData={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]}
                outputData={[24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]}
                height={400}
              />
            </Card>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 24 }}
              bordered={false}
              title="当日车辆使用情况"
              className={styles.salesCard}
              extra={(
                <div className={styles.salesCardExtra}>
                  {iconGroup}
                </div>
              )}
            > 
              <Pie
                height={400}
                options={PieOption}
                data={PieData} 
              />
            </Card>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 24 }}
              bordered={false}
              title="金额"
              className={styles.salesCard}
              extra={(
                <div className={styles.salesCardExtra}>
                  {iconGroup}
                </div>
              )}
            >
              <div className={styles.progress}>
                <p><span className={styles.left}>临停</span><span className={styles.right}>1922</span></p>
                <Progress
                  height={25}
                  options={ProgressOption}
                  data={[15]}
                />
              </div>
              <div className={styles.progress}>
                <p><span className={styles.left}>日租</span><span className={styles.right}>1922</span></p>
                <Progress
                  height={25}
                  options={ProgressOption}
                  data={[45]}
                />
              </div>
              <div className={styles.progress}>
                <p><span className={styles.left}>夜租</span><span className={styles.right}>1922</span></p>
                <Progress
                  height={25}
                  options={ProgressOption}
                  data={[66.6]}
                />
              </div>
              <div className={styles.progress}>
                <p><span className={styles.left}>月租</span><span className={styles.right}>1922</span></p>
                <Progress
                  height={25}
                  options={ProgressOption}
                  data={[98.33]}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
export default Dashboard;