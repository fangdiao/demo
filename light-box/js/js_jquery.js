;(function(){
	var lightBox = function () {};
	lightBox.prototype = {
		container:null,//遮罩层
  	box:null,//图片容器
  	img_url:[],//要显示图片的链接
  	index:0,//索引
   	count:0,//要显示图片的数量
  	max_width:0,//容器最大宽度
  	max_height:0,//容器最大高度
  	img_change:null,//box中要操作的图片元素
  	icon_list:null,//box中的小图标
    info:function () {
      this.max_width = $(window).width() * 0.8;
      this.max_height = $(window).height() * 0.7;
      this.container = $("<div class='container'></div>");
      this.box = $("<div class='box'></div>");
      var str_dom = '<img class="">'+
                    '<div class="show icon to-left"></div>'+
                    '<div class="show icon to-right"></div>'+
                    '<ul class="show"></ul>'+
                    '<p class="show"></p>'+
                    '<span class="show" id="close-box"></span>'+
                    '</div>';
      this.box.html(str_dom);
      ul  = this.box.children("ul")
      this.img_change = this.box.children("img");
      this.count = $(".js-light-box").length;
      for(var i = 0;i < this.count;i++){
        $(".js-light-box").eq(i).attr("index",i);
        this.img_url.push({
          data_url:$(".js-light-box").eq(i).attr("data-url"),
          alt:$(".js-light-box").eq(i).attr("alt")
        });
        var li = $("<li></li>");
        li.attr("index",i);
        ul.append(li);
      }
      this.icon_list = ul.children();
    },
    imgGo:function (num) {
      this.img_change.attr("src",this.img_url[num].data_url);  
      $(".box p").html(this.img_url[num].alt);
      var _this = this;
      this.img_change.load(function(){

        var width_rate = Math.floor((this.naturalWidth/_this.max_width)*100)/100;
        width_rate = width_rate > 1?width_rate:1;
        var height_rate = Math.floor((this.naturalHeight/_this.max_height)*100)/100;
        height_rate = height_rate > 1?height_rate:1;
        var rate = height_rate >= width_rate?height_rate:width_rate;
        var box_width = parseInt(this.naturalWidth/rate);
        var box_height = parseInt(this.naturalHeight/rate);

        _this.icon_list.eq(num).addClass("light-box-active").siblings().attr("class","");
        _this.box.animate({"width":box_width,
                          "height":box_height},300);
      });
    },
    action:function () {
      this.info();
      this.onClickMouse();
    },
    onClickMouse:function () {
      var _this = this;

      $("body").on("click",".js-light-box",function(e){
        $("body").append(_this.container,_this.box);
        $(".box").css("top","-90%").animate({"top":"0"},300);
        _this.imgGo($(this).attr("index"));
      });


      $("body").on("click",".box",function(e){
        var target = e.target;
        if(target.className === "show icon to-left"){
          $(".box").stop(true,true);
          _this.index = _this.index === 0?_this.count-1:--_this.index;
          _this.imgGo(_this.index);
        }else if(target.className === "show icon to-right"){
          console.log(e)
          $(".box").stop(true,true);
          _this.index = _this.index === _this.count-1?0:++_this.index;
          _this.imgGo(_this.index);
        }else if(target.nodeName === "LI"){
          $(".box").stop(true,true);
          _this.imgGo($(target).attr("index"));
        }
        else {
          return false;
        }
      });

      $("body").on("click",".container,#close-box",function(){
        $(".box,.container").remove();
      });

      $("body").on("mouseover mouseout",".box",function(e){
        if(e.type === "mouseover"){
          $(".box .show").show();
        }else if(e.type === "mouseout"){
          $(".box .show").hide();
        }
      });
    }
  }
  var light_box = new lightBox();
  light_box.action();
})(jQuery);