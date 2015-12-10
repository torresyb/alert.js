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
		this.mark = doc.createElement('div');
		this.mark.id = "maskLayer";
		this.el = doc.createElement('div');
		this.el.id="alertBox";
		this.child_el = doc.createElement('div');
		this.child_el.className = 'alert';

		return this;
	};
	//获取弹框的高度
	// alertFun.prototype._height = function(){
	// 	return this.el.offsetHeight || this.el.clientHeight;
	// };
	//删除和添加Class
	alertFun.prototype._class = function(classname,isRemove){
		var el = this.el;
		if(el.classList){
			el.classList[isRemove ? 'remove' : 'add'](classname);
		}else{
			var defaultClass = el.className,
				reg = new RegExp('\\b'+classname+'\\b','g');
			el.className = isRemove ? defaultClass.replace(reg, ''):defaultClass.match(reg) ? defaultClass : (defaultClass+' '+classname);
		}
		return el;
	};
	// 初始化
	alertFun.prototype.init = function(message,duration){
		var message = typeof(message)=='string' ? {message:message} : message;
		// 进行copy
		this.config = Utils.copy({},this.defaults);
		this.config = Utils.copy(this.config,message);
		// 设置 class
		this.el.className="alertBox";
		this._class("alertBox-"+this.config.status);
		this.titlestyle = this.config.titlestyle ? this.config.titlestyle : "";

		switch(this.config.status){
			case 'error':
				this.strHtml = '<div class="alertText">'+this.config.message+'</div>';
				break;
			case 'confirm':
				this.strHtml = '<div class="alertText">'+this.config.message+'</div>'+
							   '<div class="alert-button display-table"><button class="cell col-6 close">取消</button><button class="cell col-6 confirm">确定</button></div>';
				break;
			case 'alert':
				this.strHtml = '<div class="alertText">'+this.config.message+'</div>'+
							   '<div class="alert-button"><button class="close">确定</button></div>';
				break;
			case 'know':
				this.strHtml = '<div class="alertText c-green">'+this.config.message+'</div>'+
							   '<div class="alert-button"><button class="confirm btn-red c-fff">知道了</button></div>';
				break;
			case 'close':
				this.strHtml = '<div class="alertTitle '+this.titlestyle+'">'+this.config.title+'</div>'+
							   '<span id="btn-close" class="close"></span>'+
						       '<div class="alertText">'+this.config.message+'</div>';
				break;
			case 'confirmClose':
				this.strHtml = '<div class="alertTitle '+this.titlestyle+'">'+this.config.title+'</div>'+
							   '<span id="btn-close" class="close"></span>'+
						       '<div class="alertText">'+this.config.message+'</div>'+
						       '<div class="alert-button display-table"><button class="cell col-6 close">取消</button><button class="cell col-6 confirm">确定</button></div>';
				break;
			default:
				this.strHtml = '<div class="alertText">'+this.config.message+'</div>';
				break;
		}						

		return this;
	};
	// 显示弹框 duration是否自动隐藏
	alertFun.prototype.show = function(message,duration,callback){
		var el = this.el,
			$mark = this.mark,
			self = this.init(message,duration);
		
		//加入到页面
		if(!!self.config.mark) {
			doc.body.appendChild($mark);
		}
		el.innerHTML = self.strHtml;
		doc.body.appendChild(el);

		duration && setTimeout(function(){
			self.hide();
			callback && callback();
		}, duration);
		
		//单击关闭按钮
		el.onclick = function(e){
			var e = e||win.e,
				target = e.target||e.srcElement;

			if(target.className.indexOf('close')!=-1) {
				self.hide();
				callback && callback();
			};

			if(target.className.indexOf('confirm')!=-1){
				var bloon = true;
				if(self.config.callback)  bloon=self.config.callback();
				//console.log(self.config.callback());
				if(typeof bloon == 'boolean' && bloon == true) self.hide();
			}
		};

		return this; 		
	};
	//隐藏弹框
	alertFun.prototype.hide = function(){
		var el = this.el,
			$mark = this.mark;
		document.body.removeChild(el);
		document.body.removeChild($mark);
		return this;
	};

	win.alerts = new alertFun();
})(window,document);