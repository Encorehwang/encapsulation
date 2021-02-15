function bindEvent(elem, type, selector, fn) {
	if (fn == null) {
		// 如果调用时没有传入第4个参数的情况下, 将第三个参数指定的处理函数赋值给第4个参数fn
		fn = selector;
		selector = null;
	}

	if (elem.addEventListener) {
		elem.addEventListener(type, function (ev) {
			// 除IE6-8之外的标准浏览器
			var target;
			if (selector) {
				target = ev.target;
				if (target.tagName.toLowerCase() === selector) {
					fn.call(target, ev);
				}
			} else {
				fn(ev);
			}
		});
	} else {
		// 兼容IE6-IE9
		elem.attachEvent('on' + type, function (ev) {
			var target;
			if (selector) {
				// 说明是要使用事件代理, 也就是要指明哪一个子元素发生事件的
				target = ev.srcElement;
				if (target.tagName.toLowerCase() === selector) {
					fn.call(target, ev);
				}
			} else {
				// 不是事件代理, 就是直接给某个元素绑定事件处理
				fn(ev);
			}
		});
	}
}