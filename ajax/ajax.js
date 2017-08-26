function ajax(method, url, data, fn){  //method指通过get还是post,url指发送指令的地址,data指传递的数据
	var xhr = null;
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}
	else{		//为了兼容IE6,IE6下没有XMLHttpRequest对象
		xhr = new ActiveXObject('Microsoft.XMLHttp');
	}
	
	if(method == 'get' && data){
		url += '?' + data;
	}
	
	xhr.open(method,url,true);
	
	if(method == 'get'){			//用get方法传递数据
		xhr.send();		
	}
	else{							//用post方法传递数据
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(data);	
	}
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if( xhr.status == 200){
				//alert(xhr.responseText);
				fn && fn(xhr.responseText);
			}
			else{
				alert('出错了,Err:' + xhr.status);
			}
		}	
	}		
}