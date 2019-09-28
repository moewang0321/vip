const gulp = require('gulp')

const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins();

gulp.task('server' , ['build'] , ()=>{
    gulp.src('./dist')
        .pipe( plugins.webserver({
            livereload : true,
            directoryListing:true,
            proxies: [
                {
                    source: './dist', 
                    target: 'https://pcapi.vip.com/cmc/index.php?callback=shopAds&type=ADSEC56K%2CADSP1Q2W%2CADSZBA78%2CADSIR7IX%2CADSX7W3G%2CADSNNLS7%2CADS7JI3F%2CADS2B669%2CADSITG64%2CADS45AV4%2CADSHS93V%2CADS44T33%2CADS14OC5%2CADSU3XLQ%2CADSY2DWE%2CADS3NGX5&warehouse=VIP_BJ&areaid=101103&preview=0&date_from=&time_from=&user_class=&channelId=0'
                },
                {
                    source: './dist',
                    target: 'https://category.vip.com/ajax/getTreeList.php?callback=getSubCategory30074&cid=30074&tree_id=117&_=1568635362152'
                },
                {
                    source: './dist',
                    target: 'https://mapi.vip.com/vips-mobile/rest/layout/pc/operations/multi_page?callback=lightartDataCallback&app_name=shop_pc&warehouse=VIP_BJ&fdc_area_id=101103101&app_version=1&client=pc&mobile_platform=1&province_id=101103&page_code_and_contexts=pc_kuaiqiang_fengqiang_small%2Cpc_kuaiqiang_fengqiang_big&split_content=1&api_key=70f71280d5d547b2a7bb370a529aeea1&changeResolution=0&mars_cid=1568635366660_e7e2f0b1b9672e97cfcd6dd1ed014177&standby_id=0&_=1568678421518'
                },
                {
                    source: './dist',
                    target: 'https://www.vip.com/ajax/getBrandRank.php?floorId=1&newDapLogic=1&warehouse=VIP_BJ&channelId=0&sortType=1&areaCode=101103&pagecode=a&provinceName=河北省&cityName=石家庄市&brandInfoExt%5Bfields%5D=activeIndexTips%2CdisplayEndtime%2CsalesNo%2CbrandImage%2CmobileImageOne%2Cagio%2CsalesName%2CbrandStoreSn%2CvendorSaleMessage%2CisSpecialBanner%2ChiddenEndTime%2CiconInfo%2Clink%2CbrandType%2Cpms_act_no%2CshowTimeFrom&brandInfoExt%5BstartIndex%5D=0&brandInfoExt%5Bnum%5D=12&preview=&token=&sell_time_from=&time_from=&_=1568703248345'
                },
                {
                    source:'./dist',
                    target:'https://www.vip.com/ajax/getBrandRank.php?floorId=2&newDapLogic=1&warehouse=VIP_BJ&channelId=0&sortType=1&areaCode=101103&pagecode=a&provinceName=河北省&cityName=石家庄市&brandInfoExt%5Bfields%5D=activeIndexTips%2CdisplayEndtime%2CsalesNo%2CbrandImage%2CmobileImageOne%2Cagio%2CsalesName%2CbrandStoreSn%2CvendorSaleMessage%2CisSpecialBanner%2ChiddenEndTime%2CiconInfo%2Clink%2CbrandType%2Cpms_act_no%2CshowTimeFrom&brandInfoExt%5BstartIndex%5D=0&brandInfoExt%5Bnum%5D=36&preview=&token=&sell_time_from=&time_from=&_=1568710344291'
                },
                {
                    source:'./dist',
                    target:'https://www.vip.com/ajax/getBrandRank.php?floorId=10&newDapLogic=1&warehouse=VIP_BJ&channelId=0&sortType=1&areaCode=101103&pagecode=a&provinceName=河北省&cityName=石家庄市&brandInfoExt%5Bfields%5D=activeIndexTips%2CdisplayEndtime%2CsalesNo%2CbrandImage%2CmobileImageOne%2Cagio%2CsalesName%2CbrandStoreSn%2CvendorSaleMessage%2CisSpecialBanner%2ChiddenEndTime%2CiconInfo%2Clink%2CbrandType%2Cpms_act_no%2CshowTimeFrom&brandInfoExt%5BstartIndex%5D=0&brandInfoExt%5Bnum%5D=36&preview=&token=&sell_time_from=&time_from=&_=1568710344305'
                },
                {
                    source:'./category',
                    target:'https://mapi.vip.com/vips-mobile/rest/shopping/pc/product/detail/v5?callback=detailInfoCB&productId=6918072065044747208&warehouse=VIP_BJ&client_type=pc&fdc_area_id=911101101102&brandid=1710665352&api_key=70f71280d5d547b2a7bb370a529aeea1&app_name=shop_pc&app_version=4&device=1&mars_cid=1568635366660_e7e2f0b1b9672e97cfcd6dd1ed014177&source_app=pc&mobile_platform=1'
                },
                {
                    source:'./category',
                    target:'https://stock.vip.com/detail/?callback=stock_detail&merchandiseId=6918072065044747208&is_old=0&areaId=911101101102&_=1568726360856'
                },
                {
                    source:'./category',
                    target:'https://pcapi.vip.com/vre/index.php?callback=getRecommendProductsCB&act=get_recommend_merchandise_list&product_id=6918072065044747208&count=50&abtest_id=132000&warehouse=VIP_BJ&_=1568811698523'
                }
                    
            ]
        }) )

    gulp.watch('./src/**/*.js' , ['compileJS'])
    gulp.watch('./src/**/*.html' , ['compileHTML'])
    gulp.watch('./src/**/*.scss' , ['compileCSS'])
})

gulp.task('build' , ()=>{
    gulp.src('./src/**/*.js' ,{
        base : './src'
    }).pipe( gulp.dest('./dist'))

    gulp.src('./src/**/*.html' ,{
        base : './src'
    }).pipe( gulp.dest('./dist'))

    gulp.src('./src/**/*.scss' ,{
        base : './src'
    }).pipe(plugins.sass({
        outputStyle : 'expanded'
    }).on('error' , plugins.sass.logError))
    .pipe( gulp.dest('./dist'))
        
    gulp.src('./src/static/**/*.*' , {
        base : './src'
    }).pipe( gulp.dest('./dist'))
})

gulp.task("compileJS", ()=>{
	gulp.src("./src/**/*.js")
		.pipe( gulp.dest("./dist") )
})

gulp.task("compileHTML", ()=>{
	gulp.src("./src/**/*.html")
		.pipe( gulp.dest("./dist") )
})

gulp.task("compileCSS", ()=>{
	gulp.src("./src/**/*.scss")
		.pipe(plugins.sass({
			outputStyle : "expanded"  //设定生成代码风格
		}).on('error', plugins.sass.logError))
		.pipe( gulp.dest("./dist") )
})