var _app_factory_db = function ($scope) {
    $scope.db_init = function () {
        // ---------------------------------------
        // 初始化資料庫
        DB.open_db();

        //if (CONFIG.test_mode === true) {
        //    DB.drop_table("list");
        //}

        DB.create_table("list", [
            "author",
            "title",
            "call_number",
            "isbn",
            "location",
            "checked",
            "create_timestamp",
            "update_timestamp"
        ]);

    };


    $scope.db_init();
};