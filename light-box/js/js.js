"use strict";
function lightBox(){}
lightBox.prototype = {
	container:null,//遮罩层
	box:null,//图片容器
	img_url:[],//要显示图片的链接
	index:0,//索引
  count:0,//要显示图片的数量
	timer:null,//动画定时器
  is_run:false,//判断是否在动画
  img_width_height:{"width":0,"height":0},//将要显示的图片宽度高度
  max_width:0,//容器最大宽度
  max_height:0,//容器最大高度
  img_change:null,//box中要操作的图片元素
  icon_list:null,//box中的小图标
  text:null,//box中的文字说明
  show:null,//box除图片外的其他元素
	//获取dom节点
	$:function(obj){
		if(typeof(obj) === "string"){
			if(obj.indexOf("#") >= 0){
        obj = obj.replace("#","");
        if(document.getElementById(obj)){
          return document.getElementById(obj);
        }else{
          console.log("没有"+obj+"id对象");
        }
      }else if(obj.indexOf(".") >= 0){
        obj = obj.replace(".","");
        if(document.getElementsByClassName(obj)){
          return document.getElementsByClassName(obj);
        }else{
          console.log("没有"+obj+"class对象")
        }
      }else{
        return document.createElement(obj);
      }
		}else{
			return obj;
		}
	},
  //获取css属性的值
  getStyle:function(obj,attr){
    if(obj.currentStyle){
      return obj.currentStyle[attr];
    }else{
      return getComputedStyle(obj,false)[attr];
    }
  },
	//初始化dom
	info:function(){
    //根据屏幕大小初始化max值
    this.max_width = Math.ceil(window.screen.availWidth * 0.8);
    this.max_height = Math.ceil(window.screen.availHeight * 0.7);
    //初始化最外层遮罩
    this.container = this.$("div");
    this.container.className = "container";
    //初始化显示图片的box
    this.box = this.$("div");
    this.box.className = "box";
    this.box.innerHTML = '<img>'+
                         '<div class="show icon to-left"></div>'+
                         '<div class="show icon to-right"></div>'+
                         '<ul class="show">'+
                         '</ul>'+
                         '<p class="show"></p>'+
                         '<span class="show" id="close-box"></span>'+
                         '</div>';
    //初始化text
    this.text = this.box.getElementsByTagName("p")[0];
    //初始化img_change
    this.img_change = this.box.getElementsByTagName("img")[0];
    //获取图片个数
    this.count = this.$(".js-light-box").length;
    //初始化ul，根据图片个数添加索引点
    var ul = this.box.getElementsByTagName("ul")[0];
    for(var i = 0;i < this.count;i++){
      //给每张图片添加索引值
      this.$(".js-light-box")[i].index = i;
      //初始化img_url
      this.img_url.push({
        data_url:this.$(".js-light-box")[i].getAttribute("data-url"),
          alt:this.$(".js-light-box")[i].getAttribute("alt")});
      var li = this.$("li");
       ul.appendChild(li);
    }
    //初始化icon_list
    this.icon_list = ul.children;
    //初始化show
    this.show = this.box.getElementsByClassName("show");
    
    //
  },
	//封装程序的入口
	action:function(){
    this.body = document.body || document.getElementsByTagName("body")[0];//获取body元素
    this.info();//初始化
    this.onClickMouse();//绑定事件
  },
	//动画
	imgGo:function(num,width_height){
    this.index = num;//获取索引
    this.img_change.src = this.img_url[num].data_url;//获取图片
    this.text.innerHTML = this.img_url[num].alt;//获取alt
    var _this = this;
    clearInterval(_this.timer); //清楚定时器
    this.img_change.onload = function(){
      //根据图片宽度与最大值宽度的比值确定图片要缩小的比例
      //宽高都小于1，则不缩小，若大于1则按照比值大的缩小
      var width_rate = Math.floor((this.naturalWidth/ _this.max_width)*100)/100;
      width_rate = width_rate > 1?width_rate:1;
      var height_rate = Math.floor((this.naturalHeight/ _this.max_height)*100)/100;
      height_rate = height_rate > 1?height_rate:1;
      var rate = height_rate >= width_rate?height_rate:width_rate;
      _this.img_width_height.width = parseInt(this.naturalWidth/rate);
      _this.img_width_height.height = parseInt(this.naturalHeight/rate);
      
      //根据索引值显示小图标
      for(var i = 0;i < _this.count;i++){
        _this.icon_list[i].className = "";
      }
      _this.icon_list[num].className = "light-box-active";
      //清楚定时器
      _this.timer = setInterval(function(){
        //is_run设置为true表示正在动画
        _this.is_run = true;
        for(var attr in width_height){
          //根据attr的值判断值为width还是height并获取
          var current = attr === "width"?parseInt(_this.getStyle(_this.box,"width")):parseInt(_this.getStyle(_this.box,"height"));
          //speed的值为图片减去当前,大于0向上取整，小于0向下取整
          var speed = (width_height[attr] - current)/10 > 0?Math.ceil((width_height[attr] - current)/10):Math.floor((width_height[attr] - current)/10);
          if(current !== width_height[attr]){
            //改变盒子大小
            _this.box.style[attr] = current + speed + "px";
            //宽高未都达到指定值，则is_run始终为false，不能执行下面的if语句
            _this.is_run = false;
          }
        }
        if(_this.is_run){
          //动画结束，is_run值变为false，并清楚定时器
          _this.is_run = false;
          clearInterval(_this.timer);   
        }
      },20);
    } 
  },
	//box内的点击左右按钮事件和鼠标移入移出事件
	onClickMouse:function(){
    var _this = this;
    //将点击事件委托在body上，根据target的属性值判断点击目标
    this.body.onclick = function(ev){
      var target = ev.target;
      if(target.className.toLocaleLowerCase() === "js-light-box"){
        if(_this.count === 1){
          for(var i = 0;i < _this.show.length;i++){
            _this.show[i].style.display = "none";
          }
        }
        _this.body.appendChild(_this.container);
        _this.body.appendChild(_this.box);
        _this.imgGo(target.index,_this.img_width_height);
      }else if(target.className.toLocaleLowerCase() === "show icon to-left") {
        if(!_this.is_run){
          _this.index = _this.index === 0?_this.count-1:--_this.index;
          _this.imgGo(_this.index,_this.img_width_height);
        }else{
          return false;
        }
      }else if(target.className.toLocaleLowerCase() === "show icon to-right"){
        if(!_this.is_run){
          _this.index = _this.index === _this.count-1?0:++_this.index;
          _this.imgGo(_this.index,_this.img_width_height);
        }else{
          return false;
        }
      }else if(target.id.toLocaleLowerCase() === "close-box" || target.className.toLocaleLowerCase() === "container"){
        _this.body.removeChild(_this.box);
        _this.body.removeChild(_this.container);
        _this.box.style.width = "200px";
        _this.box.style.height = "200px";   
      }else{
        return false;
      }
    }

    this.box.onmouseover = function(){
      if(_this.count > 1){
        for(var i = 0;i < _this.show.length;i++){
        _this.show[i].style.display = "block";
        }
      }
    }
    this.box.onmouseout = function(){
      if(_this.count > 1){
        for(var i = 0;i < _this.show.length;i++){
          _this.show[i].style.display = "none";
        }
      }
    } 
  }
};
var light_box = new lightBox();
light_box.action();