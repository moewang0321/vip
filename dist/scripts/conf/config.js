requirejs({
    baseUrl:'http://localhost:8000',
    paths:{
        'jquery' : 'static/scripts/jquery-2.0.3',
        'jqCookie' : 'static/scripts/jquery.cookie.min',
        'swiper' : 'static/scripts/swiper.min',
        'jq.ui' : 'static/scripts/jquery-ui',
        'css' : 'scripts/lib/css',
        'smoothP' : 'scripts/lib/smoothproducts.min',
        'head' : 'script/mylib/head'
    },
    shim : {
        'swiper' : {
            deps : ['css!static/style/swiper.min.css']
        },
        'smoothP' : 'jquery'
        
    }
    
})