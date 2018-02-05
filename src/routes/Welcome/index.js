import React, { PureComponent } from 'react';
import { Row, Col, Card, Icon, Divider } from 'antd';
const RAF = (()=>{
  return requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame || function (callback) {setTimeout(callback, 1000 / 60); };
})();
var dots = [];
var DOT_SIZE = 1.3;
class Dot{
  constructor(x,y,vx,vy,tox,toy,color,ctx,canvas){
    this.x=x;
		this.y=y;
		this.vx=vx;
		this.vy=vy;
		this.visible = false;
		this.nextox = tox;
		this.nextoy = toy;
		this.color = color;
		this.globleDown = false;
		this.gravity = Math.random()*3+6.8;
    this.setEnd(tox , toy);
    this.canvas = canvas;
    this.ctx = ctx;
  }
  paint = ()=>{
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x-DOT_SIZE/2 , this.y-DOT_SIZE/2 , DOT_SIZE , DOT_SIZE)
  }
  // 设置结束
  setEnd = (tox,toy)=>{
    this.tox = tox;
    this.toy = toy;
  }
  // 更新粒子
  update = (time)=>{
    this.x += this.vx*time;
    this.y += this.vy*time;

    if(!this.globleDown){
      let yc = this.toy - this.y;
      let xc = this.tox - this.x;

      this.jl = Math.sqrt(xc*xc+yc*yc);

      let za = 20;

      let ax = za*(xc/this.jl);
      let ay = za*(yc/this.jl);

      this.vx = (this.vx + ax*time)*0.95;
      this.vy = (this.vy + ay*time)*0.95;
    }else {
      this.vy += this.gravity * time;

      if(this.y>this.canvas.height){
        dots.splice(dots.indexOf(this) , 1 , null);
      }
    }
  }
  // 循环
  loop = (time)=>{
    this.update(time);
    this.paint();
  }
}
class Welcome extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      status: 'before'
    };
  }
  componentDidMount(){
    this.parentWidth = this.refs.root.parentNode.clientWidth;
    this.parentHeight = this.refs.root.parentNode.clientHeight;
    this.canvas = this.refs.node;
    this.ctx = this.canvas.getContext('2d');
    this.handleInit()
    this.handleLoop();
  }
  // 初始化粒子动画
  handleInit(){
    this.osCanvas = document.createElement('canvas');
    let osCtx = this.osCanvas.getContext('2d');
    
    this.osCanvas.width = this.refs.root.parentNode.clientWidth;
    this.osCanvas.height = this.refs.root.parentNode.clientHeight;

    osCtx.textAlign = "center";
		osCtx.textBaseline = "middle";
		osCtx.font="65px 微软雅黑,黑体 bold";
		osCtx.fillStyle = "#1D181F";
		osCtx.fillText("欢迎光临" , this.osCanvas.width/2 , this.osCanvas.height/2-100);
		osCtx.fillText("浔龙河智慧系统集成平台" , this.osCanvas.width/2, this.osCanvas.height/2);
		let bigImageData = osCtx.getImageData(0,0,this.osCanvas.width,this.osCanvas.height);
    // 清空粒子数组
    dots = [];

    for(let x=0;x<bigImageData.width;x+=2){
			for(let y=0;y<bigImageData.height;y+=3){
				let i = (y*bigImageData.width + x)*4;
				if(bigImageData.data[i+3]>128){
					let dot = new Dot(
						this.canvas.width/2-1+2*Math.random(),
						this.canvas.height/2-1+2*Math.random(),
						0,
						0,
						x+(this.canvas.width/2-200),
						y+(this.canvas.height/2-250),
            "rgba("+bigImageData.data[i]+","+bigImageData.data[i+1]+","+bigImageData.data[i+2]+",1)",
            this.ctx,
            this.canvas
          );
					dot.setEnd(this.canvas.width/2,this.canvas.height/2);
					dots.push(dot);
				}
			}
		}
  }
  handleLoop = (time)=>{
    let that = this;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    
    this.handleUpdate(16);
    RAF(function(){
      that.handleLoop();
    })
  }
  getLogoData = ()=>{
    let osCtx = this.osCanvas.getContext('2d');
    osCtx.clearRect(0,0,this.osCanvas.width,this.osCanvas.height);
		// this.osCanvas.width = 1000;
		// this.osCanvas.height = 100;

		// osCtx.fillStyle="#5C5656";
		// osCtx.fillRect(20,20,60,60);

		osCtx.textAlign = "center";
		osCtx.textBaseline = "middle";
		osCtx.font="32px 微软雅黑,黑体 bold";
		osCtx.fillStyle="#E06D2F";
		osCtx.fillText("智慧系统" , 210 , this.osCanvas.height/2);
		osCtx.font="38px 微软雅黑,黑体 bold";
		osCtx.fillStyle="#405159";
		osCtx.fillText("浔龙河" , 80 , this.osCanvas.height/2);
		osCtx.fillText("集成平台" , 360, this.osCanvas.height/2);

		return osCtx.getImageData(0,0,this.osCanvas.width,this.osCanvas.height);
  }
  handleChangeCanvasStaet = ()=>{
    let bigImageData = this.getLogoData();
    let index=0;
		let d;

		dots.sort(function(){
			return Math.random()-Math.random();
		});

		for(var x=0;x<bigImageData.width;x+=1){
			for(var y=0;y<bigImageData.height;y+=2){
				if(!(d = dots[index])) continue;
        var i = (y*bigImageData.width + x)*4;
				if(bigImageData.data[i+3]>128){
					d.setEnd(x+(this.canvas.width/2-300) , y-150);
					d.color = "rgba("+bigImageData.data[i]+","+bigImageData.data[i+1]+","+bigImageData.data[i+2]+",1)";
					index++
				}
			}
		}

		while(index < dots.length){
			if(!(d = dots[index++])) continue;
			d.globleDown = true;
			d.vx = 0;
		}
  }
  handleUpdate = (time)=>{
    let i,d;
		time /= 100;

		let completeNum = 0;
		for(i=0;i<dots.length;i++){
			if(!(d = dots[i])) continue;

			d.loop(time);

			if(d.jl<3) completeNum++;
		}

		if(completeNum>=5*dots.length/6 ){
			switch (this.state.status){
				case 'before':
					this.setState({
            status: 'first'
          });

					for(i=0;i<dots.length;i++){
						if(!(d = dots[i])) continue;

						d.setEnd(d.nextox , d.nextoy);
					}
					break;
				case 'first':
					this.setState({
            status: 'second'
          });
					this.handleChangeCanvasStaet();
					break;
				default :break;
			}
		}
  }
  // handleRoot = (n)=>{
  //   this.parentWidth = n.parentNode.clientWidth;
  //   this.parentHeight = n.parentNode.clientHeight;
  // }
  // handleNode = (n)=>{
  //   this.canvas = n;
  //   this.ctx = n.getContext('2d');
  // }
  render() {
    return (
      // <div>
      //   <Row gutter={24}>
      //     <Col span={8}>
      //       <Card bordered={false}>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //       </Card>
      //     </Col>
      //     <Col span={8}>
      //       <Card bordered={false}>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //       </Card>
      //     </Col>
      //     <Col span={8}>
      //       <Card bordered={false}>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //       </Card>
      //     </Col>
      //   </Row>
      //   <Row gutter={24} style={{ marginTop: 24 }}>
      //     <Col span={12}>
      //       <Card bordered={false}>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //       </Card>
      //     </Col>
      //     <Col span={12}>
      //       <Card bordered={false}>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //         <p>卡片内容</p>
      //       </Card>
      //     </Col>
      //   </Row>
      // </div>
      
       
          <div ref="root">
            {/* <h1 style={{textAlign:'center'}}>欢迎光临浔龙河</h1> */}
            <canvas id="canvas" ref="node" width={this.parentWidth} height="550"></canvas>
          </div>
       
    );
  }
}

export default Welcome;
