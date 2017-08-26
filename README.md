### Enapsulation
本仓库用来存放一些自己使用原生JavaScript编写的, 针对某些特定功能封装好的一些函数.

#### 1.bindEvent 绑定事件处理函数
在Js中, 绑定事件处理函数的方法有很多种, 直接使用onclick=function(){xx}只能适用于每个元素只执行一个函数而且元素在页面加载完毕后就存在于页面上而非动态加载的情况下. 如果有针对元素执行多个操作的情况, 则可以使用类似于addEventListener的事件绑定方式. 但是这个方法只适用于Chrome、Firefox浏览器和IE9及IE9以上的浏览器, 针对IE8及以下的浏览器只能选用attachEvent来绑定处理函数, 因此在这里封装了这么一个函数来兼容不同浏览器下的绑定事件的方式, 同时该函数具备较基本的事件委托功能, 后续可以继续完善.
首先该函数bindEvent是可以传递3个或者4个参数的, 看一下函数的代码:
```js
function bindEvent(elem, type, selector, fn) {
  if (fn == null) {
  // 如果调用时没有传入第4个参数的情况下, 将第三个参数指定的处理函数赋值给第4个参数fn
    fn = selector;
    selector = null;
  }

  if (elem.addEventListener) {
    elem.addEventListener(type, function(ev) {
      // 除IE6-8之外的标准浏览器
      var target;
      if (selector) {
        // 说明是要使用事件代理, 也就是要指明哪一个子元素发生事件的
        target = ev.target;
        if (target.tagName.toLowerCase() === selector) {
          fn.call(target, ev);
        }
      } else {
        // 不是事件代理, 就是直接给某个元素绑定事件处理
        fn(ev);
      }
    });
  } else {
    // 兼容IE6-IE9
    elem.attachEvent('on' + type, function(ev) {
      var target;
      if (selector) {
        target = ev.srcElement;
        if (target.tagName.toLowerCase() === selector) {
          fn.call(target, ev);
        }
      } else {
        fn(ev);
      }
    });
  }
}
```

这个函数是可以传递3个或者4个参数的, 如果调用时传递4个参数 则表明我是要达成事件委托的效果, 也就是说只有指定的elem的某些子元素才执行该处理函数, 不符合的元素不执行. 如果调用时只传递了3个参数, 那么表明我是直接执行函数而不采用事件委托的方式. 这里针对两类不同的情况的区别做说明:
(1) addEventListener的绑定方式的特点如下:
1. type就直接传事件类型, 比如说点击事件就传递click
2. 该方法中, 通过**ev.target**可以获取到触发事件的对象, 比如点击按钮则这里的target是该按钮
3. 如果绑定了3个处理函数a、b、c, 则执行顺序依次为a,b,c

同时在能够使用该方法的浏览器(Chrome, Firefox, Safari)下, 针对事件对象要取消冒泡和阻止默认事件分别使用: ev.stopPropagation()和ev.preventDefault();

(2)attachEvent的绑定方式的特点如下:
1. 传递type参数的时候需要在事件类型的前面加上字符串'on', 比如说点击事件要写成'onclick'
2. 该方法中, 通过**ev.srcElement**获取到触发事件的对象.
3. 如果绑定了3个处理函数a、b、c, 则执行顺序依次为c,b,a

在使用该方法的浏览器(IE6-8)下, 针对事件对象如果要取消冒泡和阻止默认事件分别使用: ev.cancelBubble=true和ev.returnValue=false;