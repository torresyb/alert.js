/**
	模拟 alert 弹框
	autor：yangbin
	time:2015-1-24
*/
;(function(win,doc){
	//初始方法
	var Utils = {
		//判断类型
		is:function(obj,type){
			return Object.prototype.toString.call(obj).slice(8,-1) == type;
		},
		//拷贝
		copy:function(defaults,obj){
			for(var p in obj){
				if(obj.hasOwnProperty(p)){
					var val = obj[p];
					defaults[p] = this.is(val,'Object')?this.copy({},val):this.is(val,'Array')?this.copy([],val):val;
				}
			}
			return defaults;
		}
	};
	//定义alertFun 构造函数
	var alertFun = function(){
		var self = this;
		//默认属性
		this.defaults = {
			placemodel : 'cent',
			status:'normal'
		};
		//创建元素
		this.el = doc.createElement('div');
		this.el.id="alertBox";
		this.child_el = doc.createElement('div');
		this.child_el.className = 'alert';
		this.close = '<div class="alert-button"><button class="close">确定</button></div>';
		//单击关闭按钮
		this.el.onclick = function(e){
			var e = e||win.e,
				target = e.target||e.srcElement;
			if(target.className=='close') self.hide();
		};
	
		return this;
	};
	//获取弹框的高度
	alertFun.prototype._height = function(){
		return this.el.offsetHeight || this.el.clientHeight;
	};
	//删除和添加Class
	alertFun.prototype._class = function(classname,isRemove){
		var el = this.el;
		if(el.classList){
			el.classList[isRemove ? 'remove' : 'add'](classname);
		}else{
			var defaultClass = el.className,
				reg = new RegExp('\\b'+classname+'\\b','g');
			el.className = isRemove ? defaultClass.replace(reg, ''):defaultClass.match(reg) ? defaultClass : (defaultClass+''+classname);
		}
		return el;
	};
	// 初始化
	alertFun.prototype.init = function(message,duration){
		message = typeof(message)=='string' ? {message:message} : message;
		// 进行copy
		this.config = Utils.copy({},this.defaults);
		this.config = Utils.copy(this.config,message);
		// 设置 class
		this.el.className="alertBox";
		this._class("alertBox-"+this.config.status);

		return this;
	};
	// 显示弹框 duration是否自动隐藏
	alertFun.prototype.show = function(message,duration,callback){
		var el = this.el,
			innerStr = "",
			self = this.init(message,duration);
		
		//加入到页面
		!duration && (innerStr = this.close);

		el.innerHTML = '<p class="alertText">'+this.config.message+'</p>'+innerStr;
		doc.body.appendChild(el);
		//获取当前弹框的高度
		var top = -this._height()-50;
	
		// 弹框显示
		el.style.marginTop = top/2+'px';
		el.style.opacity=1;
		el.style.zIndex=1;
		duration && setTimeout(function(){
			self.hide();
			callback && callback();
		}, duration);
		return this; 		
	};
	//隐藏弹框
	alertFun.prototype.hide = function(callback){
		var el = this.el;
		el.style.opacity=0;
		el.style.zIndex=-1;
		callback && callback();
		return this;
	};

	win.alerts = new alertFun();
})(window,document);