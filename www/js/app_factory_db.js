var _app_factory_db = function ($scope) {
    $scope.db_init = function () {
        // ---------------------------------------
        // 初始化資料庫
        $scope.DB.open_db();

        //if (CONFIG.test_mode === true) {
        //    $scope.DB.drop_table("list");
        //}

        $scope.DB.create_table("list", [
            "author",
            "title",
            "call_number",
            "isbn",
            "location",
            "checked",
            "img",
            "create_timestamp",
            "update_timestamp"
        ]);

    };


    $scope.db_init();
};