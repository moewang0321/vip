require(['../../scripts/conf/config'] , function(){
    require(['jquery' , 'smoothP' , 'jqCookie'], function($){

        
	    $('.sp-wrap').smoothproducts();

        function getUrlParam (name) {
            var reg = new RegExp('(^|&)' + name + '=(.*)(&[^&=]+=)');
            var regLast = new RegExp('(^|&)' + name + '=(.*)($)');
            var r = window.location.search.substr(1).match(reg) || window.location.search.substr(1).match(regLast);
            if (r != null) {
                var l = r[2].match(/&[^&=]+=/)
                if (l) {
                    return decodeURIComponent(r[2].split(l[0])[0]);
                } else return decodeURIComponent(r[2]);
            }
            return null;
        }

        /* 
            头部功能
        */
        var user = getUrlParam('user');
        var $moeHeaderR = $('.moe-header-r');
        var $lis = $moeHeaderR.children('li');
        var $textUserSider = $('.sidebarcom-my-name');
        if(getUrlParam('user')){
            let listr = `
            <li class="head-user"><a class="moe-header-r-user">用户：${user}</a><i class="iconfont iconsanjiao"></i></li>
            `;
            //listr.prependTo($moeHeaderR);
            $moeHeaderR.prepend(listr);
            $('.head-user').on('click' , function(){
                if(confirm('确定退出登录吗')){
                    window.location.href = '../log/login.html';
                }else{
                    
                }
            });
            $textUserSider.css('display' , 'none')
            /* $('#J_shortTime a').attr('href' , '../cart/cart.html')*/
            if(window.localStorage.cartArr){
                var cartArr = JSON.parse(window.localStorage.cartArr);
                var cartCusArr = [];
                $('.tool-cn-in>p').html('');
                for (let i = 0; i < cartArr.length; i++) {
                    if(cartArr[i]['username'] == user){
                        cartCusArr.push(cartArr[i]);
                    }
                }

                var distinct = function (){
                    var arr = cartCusArr,
                    len = arr.length;
                    arr.sort(function(a,b){  //对数组进行排序才能方便比较
                        var value1 = a['itemSize'];
                        var value2 = b['itemSize'];
                        return value1 - value2;
                    })
                    function loop(index){
                        console.log(arr[index]['itemSize'])
                        if(index >= 1){
                        if(arr[index]['itemName'] == arr[index-1]['itemName'] && arr[index]['itemSize'] == arr[index-1]['itemSize']){
                            arr[index -1]['itemCount'] = parseInt(arr[index -1]['itemCount'])+parseInt(arr[index]['itemCount']);
                            arr.splice(index,1);
                        }
                        loop(index - 1); //递归loop函数进行去重
                        }
                    }
                    loop(len-1);
                    return cartCusArr = arr;
                }();
                console.log(cartCusArr);


                var priceSum = 0;
                var countSum = 0;
                for (let i = 0; i < cartCusArr.length; i++) {
                    var tr = document.createElement('tr');
                    priceSum += parseInt(cartCusArr[i].itemPrice) * parseInt(cartCusArr[i].itemCount);
                    countSum += parseInt(cartCusArr[i].itemCount);
                    tr.innerHTML = `
                    <td class="saleName">
                        <div class="tb-item-img">
                            <img src="${cartCusArr[i].itemImg}" alt="">
                        </div>
                        <span class="tb-title">
                            ${cartCusArr[i].itemName}
                        </span>
                        <span class="tb-size">
                            尺码：<span>${cartCusArr[i].itemSize}</span>
                        </span>
                    </td>
                    <td class="salePrice">
                        <span class="cart-tb-nowPrice">￥${cartCusArr[i].itemPrice}</span>
                        <span class="cart-tb-prePrice">￥${cartCusArr[i].itemPrePrice}</span>
                    </td>
                    <td class="saleCount">${cartCusArr[i].itemCount}</td>
                    <td class="saleSumP">￥${parseInt(cartCusArr[i].itemPrice) * parseInt(cartCusArr[i].itemCount)}</td>
                    <td class="saleDel">
                        <span>删除</span>
                    </td>
                    `;
                    tr.className = 'cart-inner-items';
                    $('.cart-inner-table').append(tr);
                
                }
                console.log(countSum)
                
                $('.cart-sum-top-all').html(`￥${priceSum}`);
                $('.cart-sum-top-count').html(countSum);
                $('#J_cart_num').html( $('.cart-sum-top-count').html() )
                
                $('.saleDel span').on('click' , function(){
                    
                    var name = $.trim($(this).parent('td').siblings('.saleName').children('.tb-title').html());
                    var size = $.trim($(this).parent('td').siblings('.saleName').children('.tb-size').children('span').html());
                    var cartDelArr = JSON.parse(window.localStorage.cartArr);

                    for (let i = 0; i < cartDelArr.length; i++) {
                        if(cartDelArr[i]['itemName'] == name && cartDelArr[i]['itemSize'] == size){
                            console.log(i)
                            cartDelArr.splice(i , 1);
                        }
                    }
                    $(this).parent('td').parent('tr').remove();
                    
                    window.localStorage.cartArr=JSON.stringify(cartDelArr);
                    window.location.reload();


                })
                
            }

            
            /*else{
                cartArr = [];
            } */



        }else{
            let listr = `
            <li><a href="../log/login.html">请登录</a></li>
            <li><a href="../log/zhuce.html">注册</a></li>
            `;
            $moeHeaderR.prepend(listr);
            $textUserSider.css('display' , 'inline');
        }

        $lis.on('mouseenter' , function(){
            
            let menu2 = $(this).children('.service-infor');
            menu2.css('display' , 'block');
        }).on('mouseleave' , function(){
            let menu2 = $(this).children('.service-infor');
            var timer = setTimeout(() => {
                menu2.css('display' , 'none');
            }, 200);
            menu2.on('mouseenter' , function(){
                clearTimeout(timer);
            }).on('mouseleave' , function(){
                menu2.css('display' , 'none');

            })

        })


        /* 
            侧边栏功能
        */
        var $siderbars = $('.sidebarcom-nav').children('div').children('ul').children('li');
        var oTop = $('.sidebarcom-top');
        $siderbars.on('mouseenter' , function(){
            let $menuSider = $(this).children('div').children('.sidebarcom-hover');
            
            $menuSider.css('right' , '36px');
        }).on('mouseleave' , function(){
            let $menuSider = $(this).children('div').children('.sidebarcom-hover');
            var timer = setTimeout(() => {
                $menuSider.css('right' , '-80px');
            }, 300);
            $menuSider.on('mouseenter' , function(){
                clearTimeout(timer);
            }).on('mouseleave' , function(){
                $menuSider.css('right' , '-80px');

            })

        })
        oTop.click(function(){
            $('body,html').animate({"scrollTop":0},500)
        })


        function setAttributes(el , attrs){
            for(var key in attrs){
            el.setAttribute(key ,  attrs[key]); 
            } 
        }
        function compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }

        

    })
})
    
