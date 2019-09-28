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
            $('#J_shortTime a').attr('href' , `../cart/cart.html?user=${user}`)
            if(window.localStorage.cartArr){
                var cartArr = JSON.parse(window.localStorage.cartArr);
                var cartCusArr = [];
                $('.tool-cn-in>p').html('');
                for (let i = 0; i < cartArr.length; i++) {
                    if(cartArr[i]['username'] == user){
                        cartCusArr.push(cartArr[i]);
                    }
                }
                for (let j = 0; j < cartCusArr.length; j++) {
                    var div = document.createElement('div');
                    div.innerHTML = `
                    <span class="cartItem-top-title">
                        ${cartCusArr[j].itemName}
                    </span>
                    <span class="cartItem-top-size">
                        ${cartCusArr[j].itemSize}码
                    </span>
                    <span class="cartItem-top-count">
                        × <span>${cartCusArr[j].itemCount}</span>
                    </span>
                    <span class="cartItem-top-price">
                        ￥<span>${cartCusArr[j].itemPrice}</span>
                    </span>
                    `
                    div.className = 'cartItem-top';
                    $('.tool-cn-in').append(div);
                    $('#J_skuCount').html( parseInt(cartCusArr[j].itemCount) + parseInt($('#J_skuCount').html()));
                
                }
                
                $('#J_cart_num').html( $('#J_skuCount').html() )
            }else{
                cartArr = [];
            }
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
            搜索提示
            https://category.vip.com/ajax/getSuggest.php?callback=searchSuggestions&keyword=  &_=1568692863209
         */

        var searchInput = document.getElementsByClassName('c-search-input')[0];
        var suggestionsUl = document.getElementsByClassName('c-search-suggestions')[0];

        function suggSearch(){
            let val = searchInput.value.trim();
            suggestionsUl.innerHTML = '';
            getJSON('https://category.vip.com/ajax/getSuggest.php?callback=searchSuggestions&keyword='+ val +'&_=1568692863209',function(data){
                
                let g = data.data;
                if(g){
                    for(let i=0;i<10;i++){
                        let li = document.createElement('li');
                        li.innerHTML =`
                            <a href="${g[i].url}">
                            ${g[i].word}
                            </a>
                            `; 
                        suggestionsUl.appendChild(li);
                    }
                    $('.c-search-helper').css('display' , 'block');
                }
            });
            if(!searchInput.value){
                $('.c-search-helper').css('display' , 'none');
            }

        }
        searchInput.oninput = preAnti( suggSearch , 300)
        
        //防抖
        function preAnti(fn , delay){
            var searchtimer = '';
            return function(){
                clearTimeout(searchtimer);
                searchtimer = setTimeout(function(){
                    fn();
                } , delay)
            }
        }
        function getJSON(url , cbFn){

            let re = /callback=([^&]+)/;
            url = url.replace( re , function($0 , $1){
                return 'callback=' + $1 + '_' + Math.random().toString().substring(2);
            });
            let fnName = url.match(re)[1];
            window[fnName] = cbFn;
            let script = document.createElement('script');
            script.src = url;
            document.body.appendChild(script);

            script.onload = function(){
                document.body.removeChild(this);
                delete window[fnName];
            };

        }

        
        /* 
            头部商品分类下拉列表
        */

        let $cateNav = $('.nav-category');
        let $cateMenu = $('.cate-menu');
        let $catePop = $('.cate-pop')
        let cateDetail = document.getElementsByClassName('cate-detail')[0];
        $cateNav.on('mouseenter' , function(){
            $cateMenu.css({
                'height' : '495px',
                'transition' : '.2s linear'
            })
        }).on('mouseleave' , function(){
            var timer = setTimeout(() => {
                $cateMenu.css('height' , '1px');
            }, 200);
            $cateMenu.on('mouseenter' , function(){
                clearTimeout(timer);
                $catePop.css('display' , 'block');
            }).on('mouseleave' , function(){
                var timerMenu2 = setTimeout(() => {
                    $catePop.css('display' , 'none');
                }, 200);
                $catePop.on('mouseenter' , function(){
                    clearTimeout(timerMenu2);
                }).on('mouseleave' , function(){
                    var timerCatePop = setTimeout(() => {
                        $catePop.css('display' , 'none');
                        //$cateMenu.css('height' , '1px');
                    }, 200);
                })

            })
        })


        $.ajax({
            type:'POST',
            url:'https://category.vip.com/ajax/getTreeList.php?callback=getSubCategory30074&cid=30074&tree_id=117&_=1568635362152',
            contentType:'application/x-www-form-urlencoded;charset=utf-8',
            data:{},
            dataType:'JSONP',
            success:function(data){
                var $cartMenuItems = $('.cate-menu-item');
                var cateDetailData = data.data[30074][0];
                var cdCategory = cateDetailData['children'];
                var cdImg = cateDetailData.image;
                
                $cartMenuItems.on('mouseenter' , function(){
                    //var cateName = cdCategory[0]['cate-name'];
                    cateDetail.innerHTML = '';
                    for(var i = 0 ; i < cdCategory.length ; i++){
                        var cdDtTitle = cdCategory[i]['cate_name'];
                        
                        
                        var cateDetailDl = document.createElement('dl');
                        cateDetailDl.innerHTML = `
                            <dt class="cate-detail-tit">
                                <i>></i>
                                <span>${cdDtTitle}</span>
                            </dt>
                            
                            <dd class="cate-detail-con">

                            </dd>
                        `;
                        cateDetail.append(cateDetailDl);
                        cateDetailDl.className = 'cate-detail-item';


                        var cdDd = document.getElementsByClassName('cate-detail-con')[i];
                        var cdDtTitle2 = cdCategory[i]['children'];
                        //console.log(cdDtTitle2.length);
                        for(var j = 0 ; j < cdDtTitle2.length - 1 ; ++j){
                            var t = cdDtTitle2[j]['cate_name']
                            var u = cdDtTitle2[j]['url'];
                            //console.log( i , cdDtTitle2[i])
                            var a = document.createElement('a');
                            a.innerHTML = `
                                ${t}
                            `;
                            setAttributes( a , {
                                'target' : '_blank',
                            })
                            cdDd.append(a);

                            a.setAttribute('href' , u);
                        }

                        
                    }

                    var cateBrand = document.getElementsByClassName('cate-brand')[0];
                    cateBrand.innerHTML = '';
                    var imga = document.createElement('a');
                    imga.innerHTML = `
                        <img src="//a.vpimg3.com/upload/goadmin/2019/07/15/198/15631715845964.png">
                    `;
                    setAttributes( imga , {
                        'target' : '_blank',
                    })
                    
                    cateBrand.append(imga);
                    
                    //console.log(cateName);
                })

            },
            error:function(e){
                console.log(e)
            }
        })

        
        /* 吸顶 */

        
        var $mDetailTop = $('#J-top');
        var $top = $('#J-FW-detail').offset().top;
        $(window).scroll(function(){
            
            if($(window).scrollTop() >= $top){
                $mDetailTop.css({
                    'position' : 'fixed',
                    'top' : 0,
                    'left' : 0,
                    'right' : 0,
                    'z-index' : 999

                });
            } else{
                $mDetailTop.css({
                    'position' : 'relative',
                    'z-index' : 100
                }); 
            }
        });

        $('.dt-list-item').on('click' , function(){
            $(this).addClass('selected').siblings().removeClass('selected');
            var c = $(this).data('scroll');
            var top = $(`#${c}`).offset().top - 43;
            $('body,html').animate({"scrollTop":top},500)
        })





        /* 
            获取静态产品信息
        */

        $.ajax({
            url:'https://mapi.vip.com/vips-mobile/rest/shopping/pc/product/detail/v5?callback=detailInfoCB&productId=6918072065044747208&warehouse=VIP_BJ&client_type=pc&fdc_area_id=911101101102&brandid=1710665352&api_key=70f71280d5d547b2a7bb370a529aeea1&app_name=shop_pc&app_version=4&device=1&mars_cid=1568635366660_e7e2f0b1b9672e97cfcd6dd1ed014177&source_app=pc&mobile_platform=1',
            type:'POST',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSONP",
            jsonp:'jsonpCallback',
            jsonpCallback:'detailInfoCB',
            success: function(data){
                var itemData = data.data.product;
                //console.log(itemData)

                /* 标题填充 */

                var pipTitle = document.createElement('div');
                pipTitle.innerHTML = `
                <p class="pib-title-class">${itemData.brandStoreName}</p>
                <p class="pib-title-detail" title="${itemData.title}">${itemData.title}</p>
                <p>
                    <span class="goods-description-title" title="${itemData.pointDescribe}">${itemData.pointDescribe}</span>
                </p>
                `;
                pipTitle.className = 'pib-title';

                $('.pi-title-box').append(pipTitle);


                /* 价格填充 */
                var piPrice = document.createElement('div');
                piPrice.innerHTML = `
                <span class="pbox-price showthis" id="J_surpriseSprice_${itemData.productIdStr}">
                    <div class="pb-vipPrice">
                        <i class="pbox-yen">¥</i>
                        <em class="J-price">${itemData.vipshopPrice}</em>
                    </div>              
                </span>    
                <div class="pi-dicount-box">
                    <div class="pbox-off-box">
                        <span class="pbox-off J-discount">${itemData.agio}</span>
                    </div>
                    <span class="pbox-market">¥<del class="J-mPrice">${itemData.marketPrice}</del></span>
                </div>
            
                `
                $('#J-pi-price-box').append(piPrice);


                /* 地址填充 */

                
                

                
                /* 左部图片 */

                var preImgData = itemData.previewImages;
                for (let i = 0; i < preImgData.length; i++) {
                    var img = document.createElement('a');
                    var imgPre = document.createElement('a');
                    img.innerHTML = ``;
                    setAttributes( img , {
                        'href' : '//a.vpimg3.com' + preImgData[i]['imageUrl'],
                        'target' : '_blank',
                        'style' : 'background-image:url(//a.vpimg3.com'+ preImgData[i]['imageUrl'] +');background-size: cover;'

                    })

                    $('.sp-thumbs').append(img);


                    imgPre.innerHTML = `
                        <img src="//a.vpimg3.com${preImgData[i]['imageUrl']}">
                    `;
                    setAttributes( imgPre , {
                        'target' : '_blank',
                    })
                    $('.dc-img-con').append(imgPre);
                }
                $('.sp-thumbs a').eq(0).addClass('sp-current')




                /* 获取商品详情图 */
            },
            error:function(e){
                console.log(e);
                
            }
            
        })
        
        /* 尺码 */

        $.ajax({
            url:'https://stock.vip.com/detail/?callback=stock_detail&merchandiseId=6918072065044747208&is_old=0&areaId=911101101102&_=1568726360856',
            type:'POST',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSONP",
            jsonp:'jsonpCallback',
            jsonpCallback:'stock_detail',
            success:function(data){
                var sizeData = data.items;
                sizeData = sizeData.sort(compare('name'))
                for (let i = 0; i < sizeData.length; i++) {
                    var sizeli = document.createElement('li');
                    sizeli.innerHTML = `
                    <span class="size-list-item-name">${sizeData[i].name}</span>
                    <span class="i-select"></span>
                    <span class="i-recommand"></span>
                    <span class="J-size-waitlist size-waitlist"></span>
                    `
                    setAttributes( sizeli , {
                        'class' : 'size-list-item  J-sizeID size-list-item-small',
                        'id' : 'J-cartAdd-sizeID-'+sizeData[i]['id'],
                        'style' : 'z-index:9',
                        'data-stock' : sizeData[i]['stock']
                    })
                    
                    $('#J-sizeArea-wrap ul').append(sizeli);
                    
                    if(sizeli.dataset.stock == 0){
                        sizeli.className = 'size-list-item  J-sizeID size-list-item-small sli-disabled'
                    }
                    
                }
                
                $('.size-list-item').on('click' , function(){
                    
                    var itemstock = $(this).data('stock');
                    if(itemstock != 0){
                        $(this).toggleClass('sli-selected').siblings().removeClass('sli-selected');
                        var $reduceBtn = $('.num-reduce');
                        var $addBtn = $('.num-add');
                        //var selectedstock = $('.sli-selected').data('stock')
                        var startItemCount = parseInt($('.amount').html());
        
                        console.log(itemstock);
                        
                        $('.amount').html(1);
                        if( itemstock == 1 ){
                            $addBtn.addClass('num-add-disabled z-disable');

                        }else{
                            $addBtn.removeClass('num-add-disabled z-disable');
                        }
                        $reduceBtn.addClass('num-reduce-disabled z-disable')

                        $addBtn.on('click' , function(){
                            console.log(1213)
                            
                            if($addBtn.hasClass('.num-add-disabled')){
                                
                            }else{
                                if(startItemCount < itemstock && startItemCount > 0){
                                    startItemCount++;
                                    $('.amount').html(startItemCount);
                                    if(startItemCount >= itemstock){
                                        
                                        $(this).addClass('num-add-disabled z-disable')
                                    }
                                    $reduceBtn.removeClass('num-reduce-disabled z-disable')
                                    
                                }
                                $('#J-num-input').val(startItemCount);
                            }
                            console.log($('#J-num-input').val())
                            
                            
                        })
                        $reduceBtn.on('click' , function(){
                            if($reduceBtn.hasClass('.num-reduce-disabled')){
        
                            }else{
                                if(startItemCount > 1 ){
                                    startItemCount--;
                                    $('.amount').html(startItemCount);
                                    if(startItemCount < 1){
                                        startItemCount = 1;
                                        
                                    }
                                    $addBtn.removeClass('num-add-disabled z-disable')
                                    
                                }
                                $('#J-num-input').val(startItemCount);
                                console.log($('#J-num-input').val())
                            }
                            if(startItemCount == 1){
                                $(this).addClass('num-reduce-disabled z-disable')

                            }
                            
                        })
                    }else{
                        
                    }
                    
                })
                /* 数量增减功能 */ 
                    

                

                
                
            },
            error:function(e){
                console.log(e)
                
            }

        })

        /* 加入购物袋 */

        var $JCartAddSubmit = $('#J-cartAdd-submit');
        $JCartAddSubmit.on('click' , function(){
            var $cartCountSum = parseInt($('#J_skuCount').html());
            var cartItemCount = $('#J-num-input').val();
            var cartItemName = $('.pib-title-detail').html();
            var cartItemPrice = $('.J-price').html();
            var cartItemSize = $('.sli-selected .size-list-item-name').html();
            var cartItemImg = $('.sp-thumbs a').eq(0).attr('href');
            var cartItemPrePrice = $('.J-mPrice').html();
            
            var obj = {
                'username':getUrlParam('user'),
                'itemName' : cartItemName,
                'itemSize' : cartItemSize,
                'itemPrice' : cartItemPrice,
                'itemPrePrice' : cartItemPrePrice,
                'itemCount':cartItemCount,
                'itemImg' : cartItemImg,
            }
            cartArr.push(obj);
            if(getUrlParam('user')){
                window.localStorage.cartArr=JSON.stringify(cartArr);
                $('.tool-cn-in>p').html('');
                var div = document.createElement('div');
                div.innerHTML = `
                    <span class="cartItem-top-title">
                        ${obj.itemName}
                    </span>
                    <span class="cartItem-top-size">
                        ${obj.itemSize}码
                    </span>
                    <span class="cartItem-top-count">
                        × <span>${obj.itemCount}</span>
                    </span>
                    <span class="cartItem-top-price">
                        ￥<span>${obj.itemPrice}</span>
                    </span>
                `;
                div.className = 'cartItem-top';
                $('.tool-cn-in').append(div);

                $('#J_skuCount').html( $cartCountSum + parseInt(obj.itemCount) );
                $('#J_cart_num').html( $('#J_skuCount').html() )
                
                window.location.reload();
                
            }else{
                window.location.href = '../log/login.html';
            }
        })


        /* 
            看了又看
        */

        $.ajax({
            url:'https://pcapi.vip.com/vre/index.php?callback=getRecommendProductsCB&act=get_recommend_merchandise_list&product_id=6918072065044747208&count=50&abtest_id=132000&warehouse=VIP_BJ&_=1568811698523',
            type:'POST',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSONP",
            jsonp:'jsonpCallback',
            jsonpCallback:'getRecommendProductsCB',
            success:function(data){
                var data = data.data;
                var divsCount = Math.ceil(data.length / 10);
                var JrecoPanel = document.getElementsByClassName('J_reco_panel');
                var result = [];
                var recoItems = [];
                for (let i = 0; i < divsCount; i++) {
                    recoItems.push([]);
                    /* for(let m = 0 ; m < 10 ; m ++){
                        recoItems[0].push(m);

                    } */
                    var JrecoDiv = document.createElement('div');
                    JrecoDiv.innerHTML = '';
                    JrecoDiv.className = 'J_reco_panel wrap-block';
                    $('.body-wrap').append(JrecoDiv);
                    
                    for (let j = 10*i; j <10*i+10; j++) {
                        recoItems[i].push(data[j])
                    }
                    
                    for (let j = 0; j < recoItems[0].length; j++) {
                        
                        var Jrecoa = document.createElement('a');
                        Jrecoa.innerHTML =  `
                        <div class="item-img-wrap">
                            <img class="item-img" width="184" height="230" src="${recoItems[i][j].smallImage}" alt="${recoItems[i][j].productName}" title="" style=""> 
                        </div>
                        <div class="item-content">
                            <p class="item-name">
                            ${recoItems[i][j].productName}
                            </p>
                            <div class="item-price">
                                <span class="price-vipshop">¥${recoItems[i][j].vipshopPrice}${recoItems[i][j].vipshopPriceSuff}</span> 
                                <span class="price-market">¥${recoItems[i][j].marketPrice}</span> 
                            </div>
                        </div>
                        `
                        setAttributes( Jrecoa , {
                            'class' : 'reco-item',
                            'target' : '_blank',
                            'href' : recoItems[i][j].link,
                            'title' : recoItems[i][j].productName,
                        })

                        $('.wrap-block').eq(i).append(Jrecoa);
                        
                        
                    }
                }
                
                for(var i=0;i<JrecoPanel.length;i++){
                    result.push( { x : JrecoPanel[i].offsetLeft , y : JrecoPanel[i].offsetTop } );
                }
                //console.log( result );
                
                for(var i=0;i<JrecoPanel.length;i++){
                    JrecoPanel[i].style.position = 'absolute';
                    JrecoPanel[i].style.left = result[i].x + 'px';
                    JrecoPanel[i].style.top = result[i].y + 'px';
                    JrecoPanel[i].style.margin = 0;
                }


                
                var nowIndex = 0;
                //下一页按钮
                $('.J_reco_next').on('click' , function(){
                    var boxLeft = parseInt($('.wrap-block').eq(nowIndex+1).css('left'));
                    console.log(boxLeft)
                    if($(this).hasClass('icon-btn-disable')){
                        console.log(123)
                        
                    }else{
                        nowIndex ++;
                        if(nowIndex == divsCount - 1){
                            $(this).addClass('icon-btn-disable')
                        }
                        if(nowIndex > 0){
                            $('.J_reco_prev').removeClass('icon-btn-disable')
                        }
                        $('.body-wrap').css({
                            'left' : -boxLeft
                        })

                    }
                })
                $('.J_reco_prev').on('click' , function(){
                    var boxLeft = parseInt($('.wrap-block').eq(nowIndex - 1).css('left'));
                    console.log(boxLeft)
                    if($(this).hasClass('icon-btn-disable')){
                        console.log(123)
                        
                    }else{
                        nowIndex --;
                        if(nowIndex == 0){
                            $(this).addClass('icon-btn-disable')
                        }
                        if(nowIndex < divsCount){
                            $('.J_reco_next').removeClass('icon-btn-disable')
                        }
                        $('.body-wrap').css({
                            'left' : -boxLeft
                        })

                    }
                })
                //TODO:左右按钮




                $('.reco-body').hover(function(){
                    $('.J_reco_prev').css('left' , 0);
                    $('.J_reco_next').css('right' , 0);
                },function(){
                    $('.J_reco_prev').css('left' , -32);
                    $('.J_reco_next').css('right' , -32);
                })
            },
            error:function(e){
                console.log(e)
                
            }
        })







        /* 
            购物车
        */
        var $indexCart = $('#J_shortTime');
        $indexCart.on('mouseenter' , function(){
            if(getUrlParam('user')){
                $('.tool-cn-inner-no').css('display' , 'none');
                if(window.localStorage.cartArr){
                    $('.tool-cn-in>p').html('');
                }
            }else{
                $('.tool-cn-inner-yep').css('display' , 'none');
            }
            $('.tool-cn').css('display' , 'block');

        }).on('mouseleave' , function(){
            var cartTimer = setTimeout(() => {
                $('.tool-cn').css('display' , 'none');
            }, 200);
            $('.tool-cn').on('mouseenter' , function(){
                clearTimeout(cartTimer)
            }).on('mouseleave' , function(){
                $('.tool-cn').css('display' , 'none');
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

        $(function(){
            var $addr = $('#store-selector .text div').html();
            var itemaddr = document.createElement('span');
                itemaddr.innerHTML = $addr;
                itemaddr.setAttribute('id' , 'J_tab_default_name');
                $('.delivery-address-tips').append(itemaddr);
        })

        
    })
})
    
