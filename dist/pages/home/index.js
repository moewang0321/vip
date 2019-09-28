require(['../../scripts/conf/config'] , function(){
    require(['jquery' , 'jqCookie'], function($){

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
            
            
            $textUserSider.css('display' , 'none');
            for (let i = 0; i < $('.main-nav-atag').length; i++) {
                $('.main-nav-atag').eq(i).attr("href",`../category/product2.html?user=${user}&productId=${$('.main-nav-atag').eq(i).data('proid')}`); 
            }            //document.getElementsByClassName("main-nav-lastSell")[0].setAttribute("href",`../category/product2.html?user=${user}&productId=${$('.main-nav-lastSell').data('proid')}`); 
            //document.getElementsByClassName("main-nav-fastSell")[0].setAttribute("href",`../category/product2.html?user=${user}&productId=${$('.main-nav-fastSell').data('proid')}`); 
            //$('.main-nav-lastSell').attr('href' , ''../category/product.html?user=' + user');
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
                        ${cartArr[j].itemName}
                    </span>
                    <span class="cartItem-top-count">
                        × <span>${cartArr[j].itemCount}</span>
                    </span>
                    <span class="cartItem-top-price">
                        ￥<span>${cartArr[j].itemPrice}</span>
                    </span>
                    `
                    div.className = 'cartItem-top';
                    $('.tool-cn-in').append(div);
                    $('#J_skuCount').html( parseInt(cartArr[j].itemCount) + parseInt($('#J_skuCount').html()));
                
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
            for (let i = 0; i < $('.main-nav-atag').length; i++) {
                $('.main-nav-atag').eq(i).attr("href",`../category/product2.html?productId=${$('.main-nav-atag').eq(i).data('proid')}`); 
            }            //document.getElementsByClassName("main-nav-lastSell")[0].setAttribute("href",`../category/product2.html?productId=${$('.main-nav-lastSell').data('proid')}`);
            //document.getElementsByClassName("main-nav-fastSell")[0].setAttribute("href",`../category/product2.html?productId=${$('.main-nav-fastSell').data('proid')}`);
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
                    
                    cateBrand.append(imga);
                    
                    //console.log(cateName);
                })

            },
            error:function(e){
                console.log(e)
            }
        })

        /* 
            nav吸顶效果  173px
         */
        
        var $mainNav = $('#J_main_nav');
        $(window).scroll(function(){
            // 滚动条距离顶部的距离 大于 200px时
            if($(window).scrollTop() >= 175){
                $mainNav.css({
                    'position' : 'fixed',
                    'top' : 0,
                    'left' : 0,
                    'right' : 0,
                    'z-index' : 999

                });
            } else{
                $mainNav.css({
                    'position' : 'absolute',
                    'top' : 0,
                    'left' : 0,
                    'right' : 0,
                    'z-index' : 100
                }); // 如果小于等于 200 淡出
            }
            });

        /* 
            轮播
        */
        let bannerUl = document.getElementById('J_slideBanner_panel');
        let bannerTitleUl = document.getElementById('J_slideBanner_btns')
        let $fbctriggerLine = $('.fbc-trigger-line');
        
        $.ajax({
            type: "POST",
            url: "https://pcapi.vip.com/cmc/index.php?callback=shopAds&type=ADSEC56K%2CADSP1Q2W%2CADSZBA78%2CADSIR7IX%2CADSX7W3G%2CADSNNLS7%2CADS7JI3F%2CADS2B669%2CADSITG64%2CADS45AV4%2CADSHS93V%2CADS44T33%2CADS14OC5%2CADSU3XLQ%2CADSY2DWE%2CADS3NGX5&warehouse=VIP_BJ&areaid=101103&preview=0&date_from=&time_from=&user_class=&channelId=0",
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSONP",
            success: function(data){
                
                var bannerData = data.ADADSEC56K.items;
                
                for(var i = 0 ; i < bannerData.length ; ++i){
                    var bannerId = bannerData[i].id,
                        bannerLink = bannerData[i].link,
                        bannerImg = bannerData[i].img,
                        bannerTitle = bannerData[i].name;
                    
                    var insertBanner = document.createElement('li');
                    insertBanner.innerHTML = `
                    <a href="${bannerLink}" target="_blank">
                        <img src="${bannerImg}" data-original="${bannerImg}" class="fbc_list_img" alt="${bannerTitle}">
                    </a>
                    `
                    insertBanner.setAttribute('data-id' , bannerId);
                    insertBanner.className = 'fbc-list-item';
                    bannerUl.append(insertBanner);
                    var $bannerItems = $('.fbc-list-item');
                    $bannerItems.eq(0).css('z-index' , '2');
                    
                    var insertBannerTitle = document.createElement('li');
                    insertBannerTitle.innerHTML = `
                        ${bannerTitle}
                    `;
                    insertBannerTitle.setAttribute('data-id' , bannerId);
                    bannerTitleUl.append(insertBannerTitle);
                    var $bannerTitles = $('#J_slideBanner_btns').children('li');
                    $bannerTitles.eq(0).addClass('selected');
                    
                }
                let startLeft = $('#J_slideBanner_btns').children('li').eq(0).offset().left - 186;
                $fbctriggerLine.css({
                    'left' : startLeft,
                    'display' : 'block'
                });
                var curIndex = 0;
                var timer2 = setInterval(function() {
                    
                    //调用变换处理函数
                    if(curIndex < $bannerItems.length - 1){
                        curIndex++;

                    }else{
                        curIndex = 0;
                    }
                    changeTo(curIndex); 
                }, 2500);
        
                function changeTo(num){ 
                    $bannerItems.css({'opacity' : '0' , 'z-index' : 0}).eq(num).css({'opacity' : '1' , 'z-index' : 2});
                    
                    $bannerTitles.removeClass('selected').eq(num).addClass('selected');
                    var barLeft = $bannerTitles.eq(num).offset().left - 186;
                    $fbctriggerLine.css('left' , barLeft);
                }
                $bannerTitles.each(function(item){ 
                    $(this).hover(function(){ 
                        clearInterval(timer2);
                        changeTo(item);
                        curIndex = item;
                    },function(){ 
                        timer2 = setInterval(function(){ 
                            if(curIndex < $bannerItems.length - 1){
                                curIndex++;
        
                            }else{
                                curIndex = 0;
                            }
                            changeTo(curIndex); 
                        },2500);
                    });
                });
            },
            error:function(e){
                        console.log(e);
            }
        })
        
        

        /* 
            每日必看
        */
        var kuaiBox = document.getElementById('pc-kuaiqiang:2');
        var fengBox = document.getElementById('pc-fengqiang:2');
        $.ajax({
            type: 'GET',
            url: 'https://mapi.vip.com/vips-mobile/rest/layout/pc/operations/multi_page?callback=lightartDataCallback&app_name=shop_pc&warehouse=VIP_BJ&fdc_area_id=101103101&app_version=1&client=pc&mobile_platform=1&province_id=101103&page_code_and_contexts=pc_kuaiqiang_fengqiang_small%2Cpc_kuaiqiang_fengqiang_big&split_content=1&api_key=70f71280d5d547b2a7bb370a529aeea1&changeResolution=0&mars_cid=1568635366660_e7e2f0b1b9672e97cfcd6dd1ed014177&standby_id=0&_=1568678421518',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            jsonp:'jsonpCallback',
            jsonpCallback:'lightartDataCallback',
            data: {},
            dataType: 'jsonp',
            success:function(data){
                /* 
                    快抢疯抢背景图
                */
                var dataDaily = data['data']['page_list'][1];
                var kuaiBgImgData = dataDaily['floor_list'][0]['data']['resourceGroupList'][0]['resourceList'][0]['lightArtImage']['imageUrl'];
                var fengBgImgData = dataDaily['floor_list'][1]['data']['resourceGroupList'][0]['resourceList'][0]['lightArtImage']['imageUrl'];
                
                var kuaiBgImg = document.createElement('img');
                var fengBgImg = document.createElement('img');

                kuaiBgImg.setAttribute('src' , kuaiBgImgData);
                fengBgImg.setAttribute('src' , fengBgImgData);

                kuaiBox.append(kuaiBgImg);
                fengBox.append(fengBgImg);

                /* 
                    快抢商品
                */

                //商品1

                var kuaiItem1ImgUrl = dataDaily['floor_list'][0]['data']['resourceGroupList'][0]['resourceList'][2]['lightArtImage']['imageUrl'];
                var kuaiItem1BoxTsize = kGetSize(0 , 1);
                var kuaiItem1ImgSize = kGetSize(0 , 2);
                var kuaiItem1BoxBsize = kGetSize(0 , 3);
                var kuaiItem1LogoBoxsize = kGetSize(0 , 4);
                var kuaiItem1LogoImgsize = kGetSize(0 , 5);
                var kuaiItem1Tipsize = kGetSpanSize(0 ,6);
                var kuaiItem1NowPsize = kGetSpanSize(0 ,7);
                var kuaiItem1RenPsize = kGetSpanSize(0 ,8);
                

                var kuaiItem1BoxT = document.createElement('div');
                var kuaiItem1BoxB = document.createElement('div');
                var kuaiItem1LogoBox = document.createElement('img');
                var kuaiItem1LogoImg = document.createElement('img');
                var kuaiItem1Tip = document.createElement('span');
                var kuaiItem1NowP = document.createElement('span');
                var kuaiItem1RenP = document.createElement('span');
                kuaiItem1BoxT.innerHTML = `
                    <img src="${kuaiItem1ImgUrl}" style="position:absolute; z-index:${kuaiItem1ImgSize.zIndex}; width: ${kuaiItem1ImgSize.w}px ;height: ${kuaiItem1ImgSize.h}px;">
                `
                setAttributes( kuaiItem1BoxT , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem1BoxTsize.zIndex +'; left: '+ kuaiItem1BoxTsize.l +'px; top: '+ kuaiItem1BoxTsize.t +'px; width: '+ kuaiItem1BoxTsize.w +'px; height: '+ kuaiItem1BoxTsize.h +'px; background-color: '+ kuaiItem1BoxTsize.bgColor +'; overflow: hidden; position: absolute;'
                } )
                kuaiBox.append(kuaiItem1BoxT);
                kuaiItem1BoxB.innerHTML = '';
                setAttributes( kuaiItem1BoxB , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem1BoxBsize.zIndex +'; left: '+ kuaiItem1BoxBsize.l +'px; top: '+ kuaiItem1BoxBsize.t +'px; width: '+ kuaiItem1BoxBsize.w +'px; height: '+ kuaiItem1BoxBsize.h +'px; background-color: '+ kuaiItem1BoxBsize.bgColor +'; overflow: hidden; position: absolute;'
                } )
                kuaiBox.append(kuaiItem1BoxB);
                
                setAttributes( kuaiItem1LogoBox , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem1LogoBoxsize.zIndex +'; left: '+ kuaiItem1LogoBoxsize.l +'px; top: '+ kuaiItem1LogoBoxsize.t +'px; width: '+ kuaiItem1LogoBoxsize.w +'px; height: '+ kuaiItem1LogoBoxsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : kuaiItem1LogoBoxsize.url
                } )
                setAttributes( kuaiItem1LogoImg , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem1LogoImgsize.zIndex +'; left: '+ kuaiItem1LogoImgsize.l +'px; top: '+ kuaiItem1LogoImgsize.t +'px; width: '+ kuaiItem1LogoImgsize.w +'px; height: '+ kuaiItem1LogoImgsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : kuaiItem1LogoImgsize.url
                } )
                kuaiBox.append(kuaiItem1LogoBox);
                kuaiBox.append(kuaiItem1LogoImg);

                kuaiItem1Tip.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem1Tipsize.text}</span>
                `
                kuaiItem1NowP.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem1NowPsize.text}</span>
                `
                kuaiItem1RenP.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem1RenPsize.text}</span>
                `

                setAttributes( kuaiItem1Tip , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "z-index: "+ kuaiItem1Tipsize.zIndex +"; left: "+ kuaiItem1Tipsize.l +"px; top: "+ kuaiItem1Tipsize.t +"px; width: "+ kuaiItem1Tipsize.w +"px; height: "+ kuaiItem1Tipsize.h +"px; overflow: hidden; background-color: "+ kuaiItem1Tipsize.bgColor +"; font-size: "+ kuaiItem1Tipsize.fontSize +"px; color: "+ kuaiItem1Tipsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem1Tipsize.align +"; position: absolute;"
                } )
                setAttributes( kuaiItem1NowP , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "z-index: "+ kuaiItem1NowPsize.zIndex +"; left: "+ kuaiItem1NowPsize.l +"px; top: "+ kuaiItem1NowPsize.t +"px; width: "+ kuaiItem1NowPsize.w +"px; height: "+ kuaiItem1NowPsize.h +"px; overflow: hidden; background-color: "+ kuaiItem1NowPsize.bgColor +"; font-size: "+ kuaiItem1NowPsize.fontSize +"px; color: "+ kuaiItem1NowPsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem1NowPsize.align +"; position: absolute;"
                } )
                setAttributes( kuaiItem1RenP , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "text-decoration: line-through;z-index: "+ kuaiItem1RenPsize.zIndex +"; left: "+ kuaiItem1RenPsize.l +"px; top: "+ kuaiItem1RenPsize.t +"px; width: "+ kuaiItem1RenPsize.w +"px; height: "+ kuaiItem1RenPsize.h +"px; overflow: hidden; background-color: "+ kuaiItem1RenPsize.bgColor +"; font-size: "+ kuaiItem1RenPsize.fontSize +"px; color: "+ kuaiItem1RenPsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem1RenPsize.align +"; position: absolute;"
                } )
                kuaiBox.append(kuaiItem1Tip);
                kuaiBox.append(kuaiItem1NowP);
                kuaiBox.append(kuaiItem1RenP);
                //商品2

                var kuaiItem2ImgUrl = dataDaily['floor_list'][0]['data']['resourceGroupList'][0]['resourceList'][10]['lightArtImage']['imageUrl'];
                var kuaiItem2BoxTsize = kGetSize(0 , 9);
                var kuaiItem2ImgSize = kGetSize(0 , 10);
                var kuaiItem2BoxBsize = kGetSize(0 , 11);
                var kuaiItem2LogoBoxsize = kGetSize(0 , 12);
                var kuaiItem2LogoImgsize = kGetSize(0 , 13);
                var kuaiItem2Tipsize = kGetSpanSize(0 ,14);
                var kuaiItem2NowPsize = kGetSpanSize(0 ,15);
                var kuaiItem2RenPsize = kGetSpanSize(0 ,16);
                

                var kuaiItem2BoxT = document.createElement('div');
                var kuaiItem2BoxB = document.createElement('div');
                var kuaiItem2LogoBox = document.createElement('img');
                var kuaiItem2LogoImg = document.createElement('img');
                var kuaiItem2Tip = document.createElement('span');
                var kuaiItem2NowP = document.createElement('span');
                var kuaiItem2RenP = document.createElement('span');
                kuaiItem2BoxT.innerHTML = `
                    <img src="${kuaiItem2ImgUrl}" style="position:absolute; z-index:${kuaiItem2ImgSize.zIndex}; width: ${kuaiItem2ImgSize.w}px ;height: ${kuaiItem2ImgSize.h}px;">
                `
                setAttributes( kuaiItem2BoxT , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem2BoxTsize.zIndex +'; left: '+ kuaiItem2BoxTsize.l +'px; top: '+ kuaiItem2BoxTsize.t +'px; width: '+ kuaiItem2BoxTsize.w +'px; height: '+ kuaiItem2BoxTsize.h +'px; background-color: '+ kuaiItem2BoxTsize.bgColor +'; overflow: hidden; position: absolute;'
                } )
                kuaiBox.append(kuaiItem2BoxT);
                kuaiItem2BoxB.innerHTML = '';
                setAttributes( kuaiItem2BoxB , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem2BoxBsize.zIndex +'; left: '+ kuaiItem2BoxBsize.l +'px; top: '+ kuaiItem2BoxBsize.t +'px; width: '+ kuaiItem2BoxBsize.w +'px; height: '+ kuaiItem2BoxBsize.h +'px; background-color: '+ kuaiItem2BoxBsize.bgColor +'; overflow: hidden; position: absolute;'
                } )
                kuaiBox.append(kuaiItem2BoxB);
                
                setAttributes( kuaiItem2LogoBox , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem2LogoBoxsize.zIndex +'; left: '+ kuaiItem2LogoBoxsize.l +'px; top: '+ kuaiItem2LogoBoxsize.t +'px; width: '+ kuaiItem2LogoBoxsize.w +'px; height: '+ kuaiItem2LogoBoxsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : kuaiItem2LogoBoxsize.url
                } )
                setAttributes( kuaiItem2LogoImg , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem2LogoImgsize.zIndex +'; left: '+ kuaiItem2LogoImgsize.l +'px; top: '+ kuaiItem2LogoImgsize.t +'px; width: '+ kuaiItem2LogoImgsize.w +'px; height: '+ kuaiItem2LogoImgsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : kuaiItem2LogoImgsize.url
                } )
                kuaiBox.append(kuaiItem2LogoBox);
                kuaiBox.append(kuaiItem2LogoImg);

                kuaiItem2Tip.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem2Tipsize.text}</span>
                `
                kuaiItem2NowP.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem2NowPsize.text}</span>
                `
                kuaiItem2RenP.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem2RenPsize.text}</span>
                `

                setAttributes( kuaiItem2Tip , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "z-index: "+ kuaiItem2Tipsize.zIndex +"; left: "+ kuaiItem2Tipsize.l +"px; top: "+ kuaiItem2Tipsize.t +"px; width: "+ kuaiItem2Tipsize.w +"px; height: "+ kuaiItem2Tipsize.h +"px; overflow: hidden; background-color: "+ kuaiItem2Tipsize.bgColor +"; font-size: "+ kuaiItem2Tipsize.fontSize +"px; color: "+ kuaiItem2Tipsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem2Tipsize.align +"; position: absolute;"
                } )
                setAttributes( kuaiItem2NowP , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "z-index: "+ kuaiItem2NowPsize.zIndex +"; left: "+ kuaiItem2NowPsize.l +"px; top: "+ kuaiItem2NowPsize.t +"px; width: "+ kuaiItem2NowPsize.w +"px; height: "+ kuaiItem2NowPsize.h +"px; overflow: hidden; background-color: "+ kuaiItem2NowPsize.bgColor +"; font-size: "+ kuaiItem2NowPsize.fontSize +"px; color: "+ kuaiItem2NowPsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem2NowPsize.align +"; position: absolute;"
                } )
                setAttributes( kuaiItem2RenP , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "text-decoration: line-through;z-index: "+ kuaiItem2RenPsize.zIndex +"; left: "+ kuaiItem2RenPsize.l +"px; top: "+ kuaiItem2RenPsize.t +"px; width: "+ kuaiItem2RenPsize.w +"px; height: "+ kuaiItem2RenPsize.h +"px; overflow: hidden; background-color: "+ kuaiItem2RenPsize.bgColor +"; font-size: "+ kuaiItem2RenPsize.fontSize +"px; color: "+ kuaiItem2RenPsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem2RenPsize.align +"; position: absolute;"
                } )
                kuaiBox.append(kuaiItem2Tip);
                kuaiBox.append(kuaiItem2NowP);
                kuaiBox.append(kuaiItem2RenP);
                //商品3

                var kuaiItem3ImgUrl = dataDaily['floor_list'][0]['data']['resourceGroupList'][0]['resourceList'][18]['lightArtImage']['imageUrl'];
                var kuaiItem3BoxTsize = kGetSize(0 , 17);
                var kuaiItem3ImgSize = kGetSize(0 , 18);
                var kuaiItem3BoxBsize = kGetSize(0 , 19);
                var kuaiItem3LogoBoxsize = kGetSize(0 , 20);
                var kuaiItem3LogoImgsize = kGetSize(0 , 21);
                var kuaiItem3Tipsize = kGetSpanSize(0 ,22);
                var kuaiItem3NowPsize = kGetSpanSize(0 ,23);
                var kuaiItem3RenPsize = kGetSpanSize(0 ,24);
                

                var kuaiItem3BoxT = document.createElement('div');
                var kuaiItem3BoxB = document.createElement('div');
                var kuaiItem3LogoBox = document.createElement('img');
                var kuaiItem3LogoImg = document.createElement('img');
                var kuaiItem3Tip = document.createElement('span');
                var kuaiItem3NowP = document.createElement('span');
                var kuaiItem3RenP = document.createElement('span');
                kuaiItem3BoxT.innerHTML = `
                    <img src="${kuaiItem3ImgUrl}" style="position:absolute; z-index:${kuaiItem3ImgSize.zIndex}; width: ${kuaiItem3ImgSize.w}px ;height: ${kuaiItem3ImgSize.h}px;">
                `
                setAttributes( kuaiItem3BoxT , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem3BoxTsize.zIndex +'; left: '+ kuaiItem3BoxTsize.l +'px; top: '+ kuaiItem3BoxTsize.t +'px; width: '+ kuaiItem3BoxTsize.w +'px; height: '+ kuaiItem3BoxTsize.h +'px; background-color: '+ kuaiItem3BoxTsize.bgColor +'; overflow: hidden; position: absolute;'
                } )
                kuaiBox.append(kuaiItem3BoxT);
                kuaiItem3BoxB.innerHTML = '';
                setAttributes( kuaiItem3BoxB , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem3BoxBsize.zIndex +'; left: '+ kuaiItem3BoxBsize.l +'px; top: '+ kuaiItem3BoxBsize.t +'px; width: '+ kuaiItem3BoxBsize.w +'px; height: '+ kuaiItem3BoxBsize.h +'px; background-color: '+ kuaiItem3BoxBsize.bgColor +'; overflow: hidden; position: absolute;'
                } )
                kuaiBox.append(kuaiItem3BoxB);
                
                setAttributes( kuaiItem3LogoBox , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem3LogoBoxsize.zIndex +'; left: '+ kuaiItem3LogoBoxsize.l +'px; top: '+ kuaiItem3LogoBoxsize.t +'px; width: '+ kuaiItem3LogoBoxsize.w +'px; height: '+ kuaiItem3LogoBoxsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : kuaiItem3LogoBoxsize.url
                } )
                setAttributes( kuaiItem3LogoImg , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ kuaiItem3LogoImgsize.zIndex +'; left: '+ kuaiItem3LogoImgsize.l +'px; top: '+ kuaiItem3LogoImgsize.t +'px; width: '+ kuaiItem3LogoImgsize.w +'px; height: '+ kuaiItem3LogoImgsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : kuaiItem3LogoImgsize.url
                } )
                kuaiBox.append(kuaiItem3LogoBox);
                kuaiBox.append(kuaiItem3LogoImg);

                kuaiItem3Tip.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem3Tipsize.text}</span>
                `
                kuaiItem3NowP.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem3NowPsize.text}</span>
                `
                kuaiItem3RenP.innerHTML = `
                    <span class="ltart-label-inner">${kuaiItem3RenPsize.text}</span>
                `

                setAttributes( kuaiItem3Tip , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "z-index: "+ kuaiItem3Tipsize.zIndex +"; left: "+ kuaiItem3Tipsize.l +"px; top: "+ kuaiItem3Tipsize.t +"px; width: "+ kuaiItem3Tipsize.w +"px; height: "+ kuaiItem3Tipsize.h +"px; overflow: hidden; background-color: "+ kuaiItem3Tipsize.bgColor +"; font-size: "+ kuaiItem3Tipsize.fontSize +"px; color: "+ kuaiItem3Tipsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem3Tipsize.align +"; position: absolute;"
                } )
                setAttributes( kuaiItem3NowP , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "z-index: "+ kuaiItem3NowPsize.zIndex +"; left: "+ kuaiItem3NowPsize.l +"px; top: "+ kuaiItem3NowPsize.t +"px; width: "+ kuaiItem3NowPsize.w +"px; height: "+ kuaiItem3NowPsize.h +"px; overflow: hidden; background-color: "+ kuaiItem3NowPsize.bgColor +"; font-size: "+ kuaiItem3NowPsize.fontSize +"px; color: "+ kuaiItem3NowPsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem3NowPsize.align +"; position: absolute;"
                } )
                setAttributes( kuaiItem3RenP , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable',
                    'style' : "text-decoration: line-through;z-index: "+ kuaiItem3RenPsize.zIndex +"; left: "+ kuaiItem3RenPsize.l +"px; top: "+ kuaiItem3RenPsize.t +"px; width: "+ kuaiItem3RenPsize.w +"px; height: "+ kuaiItem3RenPsize.h +"px; overflow: hidden; background-color: "+ kuaiItem3RenPsize.bgColor +"; font-size: "+ kuaiItem3RenPsize.fontSize +"px; color: "+ kuaiItem3RenPsize.fontColor +"; white-space: nowrap; text-align: "+ kuaiItem3RenPsize.align +"; position: absolute;"
                } )
                kuaiBox.append(kuaiItem3Tip);
                kuaiBox.append(kuaiItem3NowP);
                kuaiBox.append(kuaiItem3RenP);

                /* 
                    疯抢商品
                */

                //商品1
                var fengItem1ImgSize = kGetSize(1 , 1);
                var fengItem1LogoBoxBsize = kGetSize(1 , 2);
                var fengItem1LogoSpansize = kGetSpanSize(1 , 3);
                var fengItem1TipSpansize = kGetSpanSize(1 , 4);
                var fengItem1PriceSpansize = kGetSpanSize(1 , 5);
                var fengItem1LogoImgsize = kGetSize(1 , 6);

                var fengItem1Img = document.createElement('img');
                var fengItem1LogoBoxB = document.createElement('div');
                var fengItem1LogoImg = document.createElement('img');
                var fengItem1LogoSpan = document.createElement('span');
                var fengItem1TipSpan = document.createElement('span');
                var fengItem1PriceSpan = document.createElement('span');

                fengItem1LogoSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem1LogoSpansize.text}</span>
                `
                fengItem1TipSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem1TipSpansize.text}</span>
                `
                fengItem1PriceSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem1PriceSpansize.text}</span>
                `
                setAttributes( fengItem1Img , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem1ImgSize.zIndex +'; left: '+ fengItem1ImgSize.l +'px; top: '+ fengItem1ImgSize.t +'px; width: '+ fengItem1ImgSize.w +'px; height: '+ fengItem1ImgSize.h +'px; overflow: hidden; position: absolute;',
                    'src' : fengItem1ImgSize.url
                } )

                setAttributes( fengItem1LogoBoxB , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem1LogoBoxBsize.zIndex +'; left: '+ fengItem1LogoBoxBsize.l +'px; top: '+ fengItem1LogoBoxBsize.t +'px; width: '+ fengItem1LogoBoxBsize.w +'px; height: '+ fengItem1LogoBoxBsize.h +'px; overflow: hidden; position: absolute; background : rgba(255,255,255,0.8)'
                } )
                setAttributes( fengItem1LogoSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem1LogoSpansize.zIndex +'; left: '+ fengItem1LogoSpansize.l +'px; top: '+ fengItem1LogoSpansize.t +'px; width: '+ fengItem1LogoSpansize.w +'px; height: '+ fengItem1LogoSpansize.h +'px; overflow: hidden;background-color: '+ fengItem1LogoSpansize.bgColor +'; font-size: '+ fengItem1LogoSpansize.fontSize +'px; color: '+ fengItem1LogoSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem1LogoSpansize.align +'; position: absolute;'
                } )
                setAttributes( fengItem1TipSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem1TipSpansize.zIndex +'; left: '+ fengItem1TipSpansize.l +'px; top: '+ fengItem1TipSpansize.t +'px; width: '+ fengItem1TipSpansize.w +'px; height: '+ fengItem1TipSpansize.h +'px; overflow: hidden;background-color: '+ fengItem1TipSpansize.bgColor +'; font-size: '+ fengItem1TipSpansize.fontSize +'px; color: '+ fengItem1TipSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem1TipSpansize.align +'; position: absolute;'
                } )
                setAttributes( fengItem1PriceSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem1PriceSpansize.zIndex +'; left: '+ fengItem1PriceSpansize.l +'px; top: '+ fengItem1PriceSpansize.t +'px; width: '+ fengItem1PriceSpansize.w +'px; height: '+ fengItem1PriceSpansize.h +'px; overflow: hidden;background-color: '+ fengItem1PriceSpansize.bgColor +'; font-size: '+ fengItem1PriceSpansize.fontSize +'px; color: '+ fengItem1PriceSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem1PriceSpansize.align +'; position: absolute;'
                } )

                setAttributes( fengItem1LogoImg , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem1LogoImgsize.zIndex +'; left: '+ fengItem1LogoImgsize.l +'px; top: '+ fengItem1LogoImgsize.t +'px; width: '+ fengItem1LogoImgsize.w +'px; height: '+ fengItem1LogoImgsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : fengItem1LogoImgsize.url
                } )

                fengBox.append(fengItem1Img);
                fengBox.append(fengItem1LogoBoxB);
                fengBox.append(fengItem1LogoSpan);
                fengBox.append(fengItem1TipSpan);
                fengBox.append(fengItem1PriceSpan);
                fengBox.append(fengItem1LogoImg);
                //商品2
                var fengItem2ImgSize = kGetSize(1 , 7);
                var fengItem2LogoBoxBsize = kGetSize(1 , 8);
                var fengItem2LogoSpansize = kGetSpanSize(1 , 9);
                var fengItem2TipSpansize = kGetSpanSize(1 , 10);
                var fengItem2PriceSpansize = kGetSpanSize(1 , 11);
                var fengItem2LogoImgsize = kGetSize(1 , 12);

                var fengItem2Img = document.createElement('img');
                var fengItem2LogoBoxB = document.createElement('div');
                var fengItem2LogoImg = document.createElement('img');
                var fengItem2LogoSpan = document.createElement('span');
                var fengItem2TipSpan = document.createElement('span');
                var fengItem2PriceSpan = document.createElement('span');

                fengItem2LogoSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem2LogoSpansize.text}</span>
                `
                fengItem2TipSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem2TipSpansize.text}</span>
                `
                fengItem2PriceSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem2PriceSpansize.text}</span>
                `
                setAttributes( fengItem2Img , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem2ImgSize.zIndex +'; left: '+ fengItem2ImgSize.l +'px; top: '+ fengItem2ImgSize.t +'px; width: '+ fengItem2ImgSize.w +'px; height: '+ fengItem2ImgSize.h +'px; overflow: hidden; position: absolute;',
                    'src' : fengItem2ImgSize.url
                } )

                setAttributes( fengItem2LogoBoxB , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem2LogoBoxBsize.zIndex +'; left: '+ fengItem2LogoBoxBsize.l +'px; top: '+ fengItem2LogoBoxBsize.t +'px; width: '+ fengItem2LogoBoxBsize.w +'px; height: '+ fengItem2LogoBoxBsize.h +'px; overflow: hidden; position: absolute; background : rgba(255,255,255,0.8)'
                } )
                setAttributes( fengItem2LogoSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem2LogoSpansize.zIndex +'; left: '+ fengItem2LogoSpansize.l +'px; top: '+ fengItem2LogoSpansize.t +'px; width: '+ fengItem2LogoSpansize.w +'px; height: '+ fengItem2LogoSpansize.h +'px; overflow: hidden;background-color: '+ fengItem2LogoSpansize.bgColor +'; font-size: '+ fengItem2LogoSpansize.fontSize +'px; color: '+ fengItem2LogoSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem2LogoSpansize.align +'; position: absolute;'
                } )
                setAttributes( fengItem2TipSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem2TipSpansize.zIndex +'; left: '+ fengItem2TipSpansize.l +'px; top: '+ fengItem2TipSpansize.t +'px; width: '+ fengItem2TipSpansize.w +'px; height: '+ fengItem2TipSpansize.h +'px; overflow: hidden;background-color: '+ fengItem2TipSpansize.bgColor +'; font-size: '+ fengItem2TipSpansize.fontSize +'px; color: '+ fengItem2TipSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem2TipSpansize.align +'; position: absolute;'
                } )
                setAttributes( fengItem2PriceSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem2PriceSpansize.zIndex +'; left: '+ fengItem2PriceSpansize.l +'px; top: '+ fengItem2PriceSpansize.t +'px; width: '+ fengItem2PriceSpansize.w +'px; height: '+ fengItem2PriceSpansize.h +'px; overflow: hidden;background-color: '+ fengItem2PriceSpansize.bgColor +'; font-size: '+ fengItem2PriceSpansize.fontSize +'px; color: '+ fengItem2PriceSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem2PriceSpansize.align +'; position: absolute;'
                } )

                setAttributes( fengItem2LogoImg , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem2LogoImgsize.zIndex +'; left: '+ fengItem2LogoImgsize.l +'px; top: '+ fengItem2LogoImgsize.t +'px; width: '+ fengItem2LogoImgsize.w +'px; height: '+ fengItem2LogoImgsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : fengItem2LogoImgsize.url
                } )

                fengBox.append(fengItem2Img);
                fengBox.append(fengItem2LogoBoxB);
                fengBox.append(fengItem2LogoSpan);
                fengBox.append(fengItem2TipSpan);
                fengBox.append(fengItem2PriceSpan);
                fengBox.append(fengItem2LogoImg);
                //商品3
                var fengItem3ImgSize = kGetSize(1 , 13);
                var fengItem3LogoBoxBsize = kGetSize(1 , 14);
                var fengItem3LogoSpansize = kGetSpanSize(1 , 15);
                var fengItem3TipSpansize = kGetSpanSize(1 , 16);
                var fengItem3PriceSpansize = kGetSpanSize(1 , 17);
                var fengItem3LogoImgsize = kGetSize(1 , 18);

                var fengItem3Img = document.createElement('img');
                var fengItem3LogoBoxB = document.createElement('div');
                var fengItem3LogoImg = document.createElement('img');
                var fengItem3LogoSpan = document.createElement('span');
                var fengItem3TipSpan = document.createElement('span');
                var fengItem3PriceSpan = document.createElement('span');

                fengItem3LogoSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem3LogoSpansize.text}</span>
                `
                fengItem3TipSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem3TipSpansize.text}</span>
                `
                fengItem3PriceSpan.innerHTML = `
                    <span class="ltart-label-inner" style="margin:0 auto">${fengItem3PriceSpansize.text}</span>
                `
                setAttributes( fengItem3Img , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem3ImgSize.zIndex +'; left: '+ fengItem3ImgSize.l +'px; top: '+ fengItem3ImgSize.t +'px; width: '+ fengItem3ImgSize.w +'px; height: '+ fengItem3ImgSize.h +'px; overflow: hidden; position: absolute;',
                    'src' : fengItem3ImgSize.url
                } )

                setAttributes( fengItem3LogoBoxB , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem3LogoBoxBsize.zIndex +'; left: '+ fengItem3LogoBoxBsize.l +'px; top: '+ fengItem3LogoBoxBsize.t +'px; width: '+ fengItem3LogoBoxBsize.w +'px; height: '+ fengItem3LogoBoxBsize.h +'px; overflow: hidden; position: absolute; background : rgba(255,255,255,0.8)'
                } )
                setAttributes( fengItem3LogoSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem3LogoSpansize.zIndex +'; left: '+ fengItem3LogoSpansize.l +'px; top: '+ fengItem3LogoSpansize.t +'px; width: '+ fengItem3LogoSpansize.w +'px; height: '+ fengItem3LogoSpansize.h +'px; overflow: hidden;background-color: '+ fengItem3LogoSpansize.bgColor +'; font-size: '+ fengItem3LogoSpansize.fontSize +'px; color: '+ fengItem3LogoSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem3LogoSpansize.align +'; position: absolute;'
                } )
                setAttributes( fengItem3TipSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem3TipSpansize.zIndex +'; left: '+ fengItem3TipSpansize.l +'px; top: '+ fengItem3TipSpansize.t +'px; width: '+ fengItem3TipSpansize.w +'px; height: '+ fengItem3TipSpansize.h +'px; overflow: hidden;background-color: '+ fengItem3TipSpansize.bgColor +'; font-size: '+ fengItem3TipSpansize.fontSize +'px; color: '+ fengItem3TipSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem3TipSpansize.align +'; position: absolute;'
                } )
                setAttributes( fengItem3PriceSpan , {
                    'class' : 'ltart-label ltart-flex-h ltart-clkable ltart-flex-h-center ltart-flex-v-center',
                    'style' : 'z-index: '+ fengItem3PriceSpansize.zIndex +'; left: '+ fengItem3PriceSpansize.l +'px; top: '+ fengItem3PriceSpansize.t +'px; width: '+ fengItem3PriceSpansize.w +'px; height: '+ fengItem3PriceSpansize.h +'px; overflow: hidden;background-color: '+ fengItem3PriceSpansize.bgColor +'; font-size: '+ fengItem3PriceSpansize.fontSize +'px; color: '+ fengItem3PriceSpansize.fontColor +'; white-space: nowrap; text-align: '+ fengItem3PriceSpansize.align +'; position: absolute;'
                } )

                setAttributes( fengItem3LogoImg , {
                    'class' : 'ltart-clkable',
                    'style' : 'z-index: '+ fengItem3LogoImgsize.zIndex +'; left: '+ fengItem3LogoImgsize.l +'px; top: '+ fengItem3LogoImgsize.t +'px; width: '+ fengItem3LogoImgsize.w +'px; height: '+ fengItem3LogoImgsize.h +'px; overflow: hidden; position: absolute;',
                    'src' : fengItem3LogoImgsize.url
                } )

                fengBox.append(fengItem3Img);
                fengBox.append(fengItem3LogoBoxB);
                fengBox.append(fengItem3LogoSpan);
                fengBox.append(fengItem3TipSpan);
                fengBox.append(fengItem3PriceSpan);
                fengBox.append(fengItem3LogoImg);

                /* 
                    封装函数
                 */
                
                function kGetSize( a , i){
                    return {
                        
                        url: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['imageUrl'],
                        bgColor : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['backGroundColor'],
                        zIndex : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['zindex'],
                        l: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['bounds']['l'],
                        t: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['bounds']['t'],
                        w: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['bounds']['w'],
                        h: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtImage']['bounds']['h']
                    }
                }
                function kGetSpanSize(a , i){
                    return {
                        bgColor : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['backGroundColor'],
                        text : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['text'],
                        align : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['align'],
                        fontSize : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['fontSize'],
                        fontColor : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['fontColor'],
                        zIndex : dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['zindex'],
                        l: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['bounds']['l'],
                        t: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['bounds']['t'],
                        w: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['bounds']['w'],
                        h: dataDaily['floor_list'][a]['data']['resourceGroupList'][0]['resourceList'][i]['lightArtLabel']['bounds']['h']
                    }
                }

                

            },
            error:function(e){
                console.log(e);
            }
        })

        /* 
            楼层1
        */

        $.ajax({
            type:'GET',
            url:'../../static/data/vip_data.json',
            //contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSON",
            success: function(data){
                var starList = data.data;
                var starItemCount = starList.items;
                var JFloor1 = document.getElementById('J-floorBrandList-1');
                var JBrandData = document.getElementsByClassName('J-brand-item-data1')[0];
                setAttributes( JFloor1 , {
                    'data-len' : starItemCount,
                    'style' : 'height:' + starItemCount.length/2 * 370 + 'px;'
                })

                for(var i = 0 ; i < starItemCount.length ; ++i ){
                    var starItemDiv = document.createElement('div');
                    setAttributes(starItemDiv , {
                        'class' : 'brand-item'
                    })
                    starItemDiv.innerHTML = `
                    <a href="${starList.brandInfo[starItemCount[i]]['link']}" target="_blank" class="brand-item-hover">
                        <img src="${starList.brandInfo[starItemCount[i]]['brandImage']['size1']}" class="brand-img"  alt="${starList.brandInfo[starItemCount[i]]['salesName']}">
                        
                        <div class="brand-info">
                            <span class="brand-name" title="${starList.brandInfo[starItemCount[i]]['salesName']}">${starList.brandInfo[starItemCount[i]]['salesName']}</span>
                            <div class="brand-discount-pms">
                                <span class="brand-discount">
                                ${starList.brandInfo[starItemCount[i]]['agio']}
                                </span>
                            </div>
                        </div>
                    </a>                
                    `
                    JBrandData.append(starItemDiv);




                }

            },
            error:function(e){
                console.log(e);
                
            }

        })

        /* 
            楼层2
        */

        $.ajax({
            type:'POST',
            url:'https://www.vip.com/ajax/getBrandRank.php?floorId=2&newDapLogic=1&warehouse=VIP_BJ&channelId=0&sortType=1&areaCode=101103&pagecode=a&provinceName=河北省&cityName=石家庄市&brandInfoExt%5Bfields%5D=activeIndexTips%2CdisplayEndtime%2CsalesNo%2CbrandImage%2CmobileImageOne%2Cagio%2CsalesName%2CbrandStoreSn%2CvendorSaleMessage%2CisSpecialBanner%2ChiddenEndTime%2CiconInfo%2Clink%2CbrandType%2Cpms_act_no%2CshowTimeFrom&brandInfoExt%5BstartIndex%5D=0&brandInfoExt%5Bnum%5D=36&preview=&token=&sell_time_from=&time_from=&_=1568710344291',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSONP",
            success: function(data){
                var starList = data.data;
                var starItemCount = starList.items;
                var JFloor2 = document.getElementById('J-floorBrandList-2');
                var JBrandData = document.getElementsByClassName('J-brand-item-data2')[0];
                setAttributes( JFloor2 , {
                    'data-len' : starItemCount,
                    'style' : 'height:' + starItemCount.length/2 * 370 + 'px;'
                })

                for(var i = 0 ; i < starItemCount.length ; ++i ){
                    var starItemDiv = document.createElement('div');
                    setAttributes(starItemDiv , {
                        'class' : 'brand-item'
                    })
                    starItemDiv.innerHTML = `
                    <a href="${starList.brandInfo[starItemCount[i]]['link']}" target="_blank" class="brand-item-hover">
                        <img src="${starList.brandInfo[starItemCount[i]]['brandImage']['size1']}" class="brand-img"  alt="${starList.brandInfo[starItemCount[i]]['salesName']}">
                        
                        <div class="brand-info">
                            <span class="brand-name" title="${starList.brandInfo[starItemCount[i]]['salesName']}">${starList.brandInfo[starItemCount[i]]['salesName']}</span>
                            <div class="brand-discount-pms">
                                <span class="brand-discount">
                                ${starList.brandInfo[starItemCount[i]]['agio']}
                                </span>
                            </div>
                        </div>
                    </a>                
                    `
                    JBrandData.append(starItemDiv);




                }

            },
            error:function(e){
                console.log(e);
                
            }

        })
        /* 
            楼层3
        */

        $.ajax({
            type:'POST',
            url:'https://www.vip.com/ajax/getBrandRank.php?floorId=2&newDapLogic=1&warehouse=VIP_BJ&channelId=0&sortType=1&areaCode=101103&pagecode=a&provinceName=河北省&cityName=石家庄市&brandInfoExt%5Bfields%5D=activeIndexTips%2CdisplayEndtime%2CsalesNo%2CbrandImage%2CmobileImageOne%2Cagio%2CsalesName%2CbrandStoreSn%2CvendorSaleMessage%2CisSpecialBanner%2ChiddenEndTime%2CiconInfo%2Clink%2CbrandType%2Cpms_act_no%2CshowTimeFrom&brandInfoExt%5BstartIndex%5D=0&brandInfoExt%5Bnum%5D=36&preview=&token=&sell_time_from=&time_from=&_=1568710344291',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            data: {},
            dataType: "JSONP",
            success: function(data){
                var starList = data.data;
                var starItemCount = starList.items;
                var JFloor3 = document.getElementById('J-floorBrandList-3');
                var JBrandData = document.getElementsByClassName('J-brand-item-data3')[0];
                setAttributes( JFloor3 , {
                    'data-len' : starItemCount,
                    'style' : 'height:' + starItemCount.length/3 * 370 + 'px;'
                })

                for(var i = 0 ; i < starItemCount.length ; ++i ){
                    var starItemDiv = document.createElement('div');
                    setAttributes(starItemDiv , {
                        'class' : 'brand-item'
                    })
                    starItemDiv.innerHTML = `
                    <a href="${starList.brandInfo[starItemCount[i]]['link']}" target="_blank" class="brand-item-hover">
                        <img src="${starList.brandInfo[starItemCount[i]]['brandImage']['size1']}" class="brand-img"  alt="${starList.brandInfo[starItemCount[i]]['salesName']}">
                        
                        <div class="brand-info">
                            <span class="brand-name" title="${starList.brandInfo[starItemCount[i]]['salesName']}">${starList.brandInfo[starItemCount[i]]['salesName']}</span>
                            <div class="brand-discount-pms">
                                <span class="brand-discount">
                                ${starList.brandInfo[starItemCount[i]]['agio']}
                                </span>
                            </div>
                        </div>
                    </a>                
                    `
                    JBrandData.append(starItemDiv);
                }

            },
            error:function(e){
                console.log(e);
                
            }

        })


        /*  */

        

        /*  */






        /* 电梯 */
        var oNav = $('#LoutiNav');//导航壳
        var aNav = oNav.find('li');//导航
        var aDiv = $('.wrap .J-index-floor');//楼层
        var oTop = $('.sidebarcom-top');
        //回到顶部
        $(window).scroll(function(){
                var winH = $(window).height();//可视窗口高度
                var iTop = $(window).scrollTop();//鼠标滚动的距离
                //console.log($('.wrap').offset().top , iTop)
                if(iTop>=$('.wrap').offset().top){
                oNav.fadeIn();
                //鼠标滑动式改变	
                aDiv.each(function(){
                if(winH+iTop - $(this).offset().top > winH/2){
                    aNav.removeClass('active');
                    aNav.eq($(this).index() - 1).addClass('active');
                }
                })
                }else{
                oNav.fadeOut();
                }
        })
        //点击top回到顶部
        oTop.click(function(){
            $('body,html').animate({"scrollTop":0},500)
        })
        //点击回到当前楼层
        aNav.click(function(){
            var t = aDiv.eq($(this).index()).offset().top - 50;
            $('body,html').animate({"scrollTop":t},1000);
            $(this).addClass('active').siblings().removeClass('active');
        });

        /* 
            购物车
        */
        var $indexCart = $('#J_shortTime');
        $indexCart.on('mouseenter' , function(){
            if(getUrlParam('user')){
                $('.tool-cn-inner-no').css('display' , 'none');
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




    function setAttributes(el , attrs){
        for(var key in attrs){
        el.setAttribute(key ,  attrs[key]); 
        } 
    }

    })
})



