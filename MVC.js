
(function (window) {
	var MVC = {};

	
	var M = {};
	MVC.Model = {
		/**
		 * 读取数据点
		 * @str 	读取数据层级路径
		 **/
		get: function (str) {
			
			var path = str
				
				.replace(/^M\.|^\./, '')
				
				.split('.');
			
			var result = M;
			
			for (var i = 0; i < path.length; i++) {
				
				if (result[path[i]] === undefined) {
					
					return null;
				}
				
				result = result[path[i]];
				
			}
			return result;
		},
		/**
		 * 更新或者添加数据
		 * @key 	属性层级路径
		 * @value 	值
		 **/
		add: function (key, value) {
			
			var path = key
				
				.replace(/^M\.|^\./, '')
				
				.split('.');
			
			var result = M;
			
			for (var i = 0; i < path.length - 1; i++) {
				
				if (
					
					(result[path[i]] !== undefined && typeof result[path[i]] !== 'object') || 
					
					result[path[i]] === null
				) {
					
					throw new Error(typeof result[path[i]] + '类型的数据，不能添加属性，值是:' + result[path[i]])
				}
				
				if (result[path[i]] === undefined) {
					
					result[path[i]] = {};
				}
				
				result = result[path[i]]
			}
			
			result[path[i]] = value;
			
			return this;
		}
	}
	
	var V = {};
	MVC.View = {
		/**
		 * 添加视图创建
		 * @id 	id
		 * @fn 	创建函数
		 **/
		add: function (id, fn) {
			
			V[id] = fn;
			
			return this;
		},
		/**
		 * 执行创建视图
		 * @id 	id
		 **/
		create: function (id) {
			
			if (V[id]) {
				var dom = V[id].call(MVC, MVC.Model, MVC.template);
				return dom;
			}
		
		}
	}
	
	var C = {};
	MVC.Controller = {
		/**
		 * 添加控制器
		 * @id 		id
		 * @fn 		方法
		 **/
		add: function (id, fn) {
			
			C[id] = fn;
			
			return this;
		},
		/**
		 * 初始化所有控制器
		 **/
		init: function () {
			
			for (var i in C) {
				
				C[i].call(MVC, MVC.Model, MVC.View, MVC.Observer);
			}
		}
	};
	/**
	 * 定义格式化模板
	 * @str 	模板字符串
	 * @data 	模板数据
	 * return 	格式化后的模板字符串
	 **/ 
	MVC.template = function (str, data) {
		
		return str.replace(/\{#([\w\.]+)#\}/g, function (match, $1) {
			
			var path = $1.split('.');
			var result = data;
			
			for (var i = 0; i < path.length; i++) {
				
				if (undefined === result[path[i]]) {
					
					return '';
				}
				
				result = result[path[i]]
			}
			
			return result;
		})
	};
	// 观察者模式
	var __message = {};
	MVC.Observer = {
		/**
		 * 注册消息
		 * @type 	消息的名称
		 * @fn 		回调函数	
		 **/
		regist: function (type, fn) {
			
			if (__message[type]) {
				
				__message[type].push(fn);
			} else {
				
				__message[type] = [fn];
			}
		},
		/**
		 * 触发消息
		 * @type 	消息的名称
		 * @data 	传递的数据
		 **/
		fire: function (type, data) {
			
			var arg = [].slice.call(arguments, 0)
			
			if (__message[type]) {
				
				for (var i = 0; i < __message[type].length; i++) {
					
					__message[type][i].apply(null, arg)
				}
			}
		}
	};
	
	MVC.addModel = function (id, data) {
		
		MVC.Model.add(id, data);
		
		return this;
	}
	
	MVC.get = function (id) {
		
		return MVC.Model.get(id)
	}
	
	MVC.addView = function (id, fn) {
		MVC.View.add(id, fn);
		return this;
	}
	
	MVC.create = function (id) {
		
		return MVC.View.create(id)
	}
	MVC.addCtrl = function (id, fn) {
		MVC.Controller.add(id, fn);
		return this;
	}
	
	MVC.install = function () {
		
		$(function () {
			
			MVC.Controller.init();
		})
	}

	window.MVC = MVC;
})(window)