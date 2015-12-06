var _app_factory_config = function ($scope) {
    $scope.config_init = function () {

        $scope.CONFIG = {
            "proxy_url": "http://public-nccu-book-cart-2015.dlll.nccu.edu.tw/nccu-book-cart-server/",
            //"proxy_url": "http://pulipuli.tk/nccu-book-cart-server/",
            "test_mode": false
        };

        // ------------------------------------

        $scope.empty_todo_list = [
            {
                "location": "",
                "items": []
            }
        ];
        $scope.todo_list = $scope.empty_todo_list;
        $scope.completed_list = [];
        //$scope.isbn = "";
        $scope.mock_isbn = "9789862168370";  //賈伯斯傳
        $scope.mock_url = "http://jenda.lib.nccu.edu.tw/search~S5*cht?/X{u8CC8}{u4F2F}{u65AF}{u50B3}&SORT=D/X{u8CC8}{u4F2F}{u65AF}{u50B3}&SORT=D&SUBKEY=賈伯斯傳/1%2C29%2C29%2CB/frameset&FF=X{u8CC8}{u4F2F}{u65AF}{u50B3}&SORT=D&1%2C1%2C#.VmP-GxkVHqA";  //賈伯斯傳
        //$scope.isbn = $scope.mock_isbn; //備用

        $scope.location_image = {
            "社資二樓政大論文區": $scope.CONFIG.proxy_url + "img/map/ssic_2f_s.png",
            "總圖附件": $scope.CONFIG.proxy_url + "img/map/ccl_cht_1f.png",
            "總圖三樓中文圖書區": $scope.CONFIG.proxy_url + "img/map/ccl_cht_3f.png",
            "總圖三樓新書區": $scope.CONFIG.proxy_url + "img/map/ccl_cht_3f.png",
            "總圖四樓西文圖書區": $scope.CONFIG.proxy_url + "img/map/ccl_cht_4f.png",
            "總圖四樓新書區": $scope.CONFIG.proxy_url + "img/map/ccl_cht_4f.png",
            "綜圖一樓中文新書區": $scope.CONFIG.proxy_url + "img/map/cclsl_cht_1f.png",
            "綜圖二樓西文新書區": $scope.CONFIG.proxy_url + "img/mapcclsl_cht_2f.png",
            "綜圖B1中文": $scope.CONFIG.proxy_url + "img/map/cclsl_cht_b1.png",
            "綜圖2F西文": $scope.CONFIG.proxy_url + "img/map/cclsl_cht_2f.png",
            "商圖": $scope.CONFIG.proxy_url + "img/map/cbl_cht.png",
            "商圖附件": $scope.CONFIG.proxy_url + "img/map/cbl_cht.png",
            "傳圖": $scope.CONFIG.proxy_url + "img/map/cjl_cht.png",
            "總圖撤架區(點此申請)": "https://subweb.lib.nccu.edu.tw/offshelf/?m=1202",
            "九舍書庫(點此申請)": "https://subweb.lib.nccu.edu.tw/offshelf/?m=1202"
        };
        $scope.map_title = "";
        $scope.map_src = "";
        
    };  //$scope.config_init = function () {


    $scope.config_init();
};