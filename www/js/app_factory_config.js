app.factory("factory_config", function () {
    return {
        init_var: function ($scope) {

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
            //$scope.isbn = $scope.mock_isbn; //備用

            $scope.location_image = {
                "社資二樓政大論文區": CONFIG.proxy_url + "img/map/ssic_2f_s.png",
                "總圖附件": CONFIG.proxy_url + "img/map/ccl_cht_1f.png",
                "總圖三樓中文圖書區": CONFIG.proxy_url + "img/map/ccl_cht_3f.png",
                "總圖三樓新書區": CONFIG.proxy_url + "img/map/ccl_cht_3f.png",
                "總圖四樓西文圖書區": CONFIG.proxy_url + "img/map/ccl_cht_4f.png",
                "總圖四樓新書區": CONFIG.proxy_url + "img/map/ccl_cht_4f.png",
                "綜圖一樓中文新書區": CONFIG.proxy_url + "img/map/cclsl_cht_1f.png",
                "綜圖二樓西文新書區": CONFIG.proxy_url + "img/mapcclsl_cht_2f.png",
                "綜圖B1中文": CONFIG.proxy_url + "img/map/cclsl_cht_b1.png",
                "綜圖2F西文": CONFIG.proxy_url + "img/map/cclsl_cht_2f.png",
                "商圖": CONFIG.proxy_url + "img/map/cbl_cht.png",
                "商圖附件": CONFIG.proxy_url + "img/map/cbl_cht.png",
                "傳圖": CONFIG.proxy_url + "img/map/cjl_cht.png"
            };
            $scope.map_title = "";
            $scope.map_src = "";

        }
    };
});