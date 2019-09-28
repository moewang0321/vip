require(['../../scripts/conf/config'],function(){
    require(['jquery','jqCookie'],function($){
        var rePhone = /^1\d{10}$/;
        var reIsPs = /^\S{6,20}$/;
        var reEasy = /^(\d+|[a-zA-Z0-9]+|_+)$/,
            reMedium = /^(?![a-zA-z0-9]+$)(?!\d+$)(?![!@#$%^&*_-]+$)[a-zA-Z0-9\d!@#$%^&*_-]+$/,
            rePer =/^(?![a-zA-z0-9]+$)(?!\d+$)(?![!@#$%^&*_-]+$)(?![a-zA-z0-9\d]+$)(?![a-zA-z0-9!@#$%^&*_-]+$)(?![\d!@#$%^&*_-]+$)[a-zA-Z0-9\d!@#$%^&*_-]+$/;
        var flagArr = [];
        var checkFlag = 1;
        
        var $iptPhone = $('.ipt-phone');
        var $iptpsword = $('.ipt-psword');
        var $iptensurepsw = $('.ipt-ensurepassword');
        var $loyalCheck = $('.ui-checkbox');
        var $submit = $('.ui-btn1');
        

        if(window.localStorage.userArr){//判断是否存在
            var userArr = JSON.parse(window.localStorage.userArr);
        }else{
            userArr = [];//创建一个新数组
        }   
        
        
        console.log($iptPhone.siblings('.u-input-tip').children('span'))
        $iptPhone.on('input' ,function(){
            let $tips = $iptPhone.siblings('.u-input-tip').children('span');
            let phoneNumber = $iptPhone.val();
            console.log(rePhone.test(phoneNumber));
            if (rePhone.test(phoneNumber)) {
                flagArr.push(1);
                console.log(flagArr);
                $tips.css('color' , '#47b85c');
                $tips.html('手机号输入正确');

            } else {
                flagArr.pop(1);
                $tips.html('手机号输入不正确');
                $tips.css('color' , '#f64a4a');
            }

        })
        $iptPhone.on('focus' , function(){
            let $tips = $iptPhone.siblings('.u-input-tip').children('span');
                if ($iptPhone.val() == '') {
                    $tips.html('手机号输入不正确');
                    $tips.css('color' , '#f64a4a');
                }
            
        })

        $iptpsword.on('input' , function(){
            let $tips = $iptpsword.siblings('.u-input-tip').children('span');
            let psVal = $iptpsword.val();
            if(reIsPs.test(psVal)){
                if (reEasy.test(psVal)) {
                    $tips.html('密码强度弱');
                    $tips.css('color' , '#f64a4a');
                }
                if (reMedium.test(psVal)) {
                    $tips.html('密码强度中');
                    $tips.css('color' , '#ffa200');
                }
                if (rePer.test(psVal)) {
                    $tips.html('密码强度高');
                    $tips.css('color' , '#47b85c');
                }
            }else{
                
                $tips.html('密码为6-20位字母数字和符号组合');
                $tips.css('color' , '#f64a4a');
            }
        })

        $iptpsword.on('focus' , function(){
            let $tips = $iptpsword.siblings('.u-input-tip').children('span');

            $tips.html('密码不能为空');
            $tips.css('color' , '#f64a4a');
        })

        $iptensurepsw.on('input' ,function(){
            let ensureVal = $iptensurepsw.val();
            let psVal = $iptpsword.val();
            let $tips = $iptensurepsw.siblings('.u-input-tip').children('span');
            if(ensureVal == psVal){
                $tips.html('两次密码输入一致');
                $tips.css('color' , '#47b85c');
                flagArr.push(1);
                console.log(flagArr);
            }else{
                $tips.html('两次密码输入不一致');
                $tips.css('color' , '#f64a4a');
            }
        })
        $iptensurepsw.on('focus' , function(){
            let $tips = $iptensurepsw.siblings('.u-input-tip').children('span');

            $tips.html('两次密码输入不一致');
            $tips.css('color' , '#f64a4a');
        })

        $loyalCheck.on('click' , function(){
            let $tips = $loyalCheck.parent().siblings('.u-input-tip').children('span');
            
            if(checkFlag == 1){
                $tips.html('');
                $('.ui-checkbox-simulation').css('background-position' , '-24px 0');
                flagArr.push(1);
                checkFlag *= -1;
                console.log(flagArr);
            }else{
                $tips.html('请同意以上条款');
                $tips.css('color' , '#f64a4a');
                $('.ui-checkbox-simulation').css('background-position' , '-48px 0');
                
                flagArr.pop(1);
                checkFlag *= -1;
                console.log(flagArr);

            }
        })

        $submit.on('click' , function(){
            let $url = $('.ui-btn1');
            console.log($url.attr('href'))
            console.log(flagArr.length)
            
            if(flagArr.length == 3){
                //console.log(flagArr.length)
                let psVal = $iptpsword.val();
                let password = encodeURI(psVal);
                let phoneNumber = $iptPhone.val();
                console.log(phoneNumber , psVal)
                /*  $.cookie('userphone', phoneNumber, { expires: 7 , path : '/pages/'});
                $.cookie('password', password, { expires: 7 , path : '/pages/'}); */
                for(var i =0;i<userArr.length;i++){
                    //判断是否有相同账号
                    if(phoneNumber==userArr[i].username){
                        let $tips = $iptPhone.siblings('.u-input-tip').children('span');
                
                        $tips.html('该手机号已注册');
                        $tips.css('color' , '#f64a4a');
                
                        return;
                    }
                }
                //创建对象
                var obj = {'username':phoneNumber,'password':password}
                console.group(obj);
                userArr.push(obj);
                console.log(userArr)
                window.localStorage.userArr=JSON.stringify(userArr);
                
            }else{
                $url.attr('href' , 'zhuce.html')
            }
        })
        

        
    })
})
    
    
