require(['../../scripts/conf/config'],function(){
    require(['jquery','jqCookie'],function($){
        
        let $iptPhone = $('#J_login_name');
        let $iptpsword = $('#J_login_pwd');
        let $logIn = $('#J_login_submit');
        let $loading = $('.ui-btn-loading-after');
        let $checked = $('#J_remember_username');
        let isHad = false;
        let remUser = true;
        let index = 0 ; //定义一个下标确定用户
        let $error  = $('.c-form-error .u-input-tip')

        if(window.localStorage.userArr){//判断是否存在
            var array = JSON.parse(window.localStorage.userArr);
        }else{
            array = [];//创建一个新数组
        }

        if($.cookie('userphone')){
            $iptPhone.val($.cookie('userphone'));
        }

        $iptPhone.on('focus' , function(){
            let $tips = $iptPhone.parent().siblings('.u-input-tip').children('span');
                if ($iptPhone.val() == '') {
                    $tips.html('账户名不能为空');
                    $tips.css('color' , '#f64a4a');
                }else{
                    $tips.html('');
                }
            
        })

        $iptpsword.on('focus' , function(){
            let $tips = $iptpsword.parent().siblings('.u-input-tip').children('span');
            if($iptpsword.val() == ''){
                $tips.html('密码不能为空');
                $tips.css('color' , '#f64a4a');

            }else{
                $tips.html('');
            }
        })
        
        $logIn.on('click' , function(){
            let userphone = $iptPhone.val();
            let password = $iptpsword.val();
            
            for(var i =0;i<array.length;i++){
			if(userphone==array[i].username){//有这个账号
				isHad=true;
				index=i;

			}
		}
		if(isHad){//如果存在
			if(password==array[index].password){
                console.log(1)
                $loading.css({
                    'display' : 'block',
                    'animation': 'loading-show 1s'
                })
                setTimeout(() => {
                    location.href = '../home/index.html?user=' + userphone;
                }, 200);
                

                if(remUser){
                    $.cookie('userphone', array[index].username, { expires: 7 , path : '/pages/'})
                }else{
                    $.cookie('userphone' , 'null' , {expires:-1});
                }
				
			}else{
                $error.children('span').html('用户名或密码错误').css('color' , '#f64a4a');
				
			}
		}else{//账号不存在或输入错误
        
            $error.children('span').html('账号不存在或输入错误').css('color' , '#f64a4a');

		}
        
        })

        $checked.on('click' , function(){
            if($checked.attr('checked') == 'checked'){
                $checked.removeAttr('checked');
                remUser = false;
                
            }else{
                $checked.attr('checked' , 'checked');
                remUser = true;
            }
            console.log($checked.attr('checked') , remUser)
        })
    })
})