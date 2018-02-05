import React,{PureComponent} from 'react';
import {Row,Col,Card} from 'antd';
import Pie from '../../../components/Charts/Pie/index';
// 面包屑
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
class AssetsReport extends PureComponent{
  render(){
    const topColResponsiveProps = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      style: { marginBottom: 24 },
    };
     // 饼图配置
    const PieOption = {
      title: {
        text: '',
        x: 'center',
        y: 'center',
        textStyle: {fontWeight: 'normal',color: '#0580f2',fontSize: '22'}
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {orient:'horizontal',x:'center',y:'top',data:['正常','租借','维修','报废']},
      series: [
        {
          name:"资产总览",
          type:'pie',
          radius: ['55%','20%'],
          avoidLabelOverlap: true,
          label: {
            normal: false,
            emphasis: {show:true,textStyle:{fontSize:'30',fontWeight:'blod'}}
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    };
    // 模拟车辆进出场数据环形图
    const PieData = [{
      value:70,
      name: '正常'
    },{
      value: 30,
      name: '租借'
    },{
      value: 22,
      name: '维修'
    },{
      value: 66,
      name: '报废'
    }];
    return(
      <PageHeaderLayout title="资产总览">
        <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <Card
                  bodyStyle={{ padding: 24 }}
                  bordered={false}
                  title="资产总览"
              >
                <Pie
                  height={400}
                  options={PieOption}
                  data={PieData} 
                />
              </Card>
            </Col>
          </Row>
        </PageHeaderLayout>
    );
  }
}
export default AssetsReport;