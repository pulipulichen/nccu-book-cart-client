app.controller('BookListController', function ($scope) {

    var CONFIG;
    $.getJSON("config.json", function (_config) {
        CONFIG = _config;
    });

    var _trigger_callback = function (_callback) {
        if (typeof (_callback) === "function")
            _callback();
    };

    // ---------------------------------------

    // 初始化資料庫
    DB.open_db();
    //DB.drop_table("list");
    DB.create_table("list", [
        "title",
        "call_number",
        "isbn",
        "location",
        "checked",
        "create_timestamp",
        "update_timestamp"
    ]);

    // -----------------

//    $scope.data = [
//        {
//            "location": "總圖",
//            "items": [
//                {title: "A"}
//            ]
//        },
//        {
//            "location": "商圖",
//            "items": [
//                {title: "A"}
//            ]
//        }
//        
//    ];
//    $scope.isbn = "121545487911";
    $scope.empty_todo_list = [
        {
            "location": "",
            "items": []
        }
    ];
    $scope.todo_list = $scope.empty_todo_list;
    $scope.completed_list = [];
    $scope.isbn = "";

    // -----------------

    $scope.load_lists = function (_callback) {
        $scope.load_todo_list(function () {
            $scope.load_completed_list(function () {
                $scope.$digest();
                _trigger_callback(_callback);
            });
        })
    };

    $scope.load_todo_list = function (_callback) {

        DB.exec("SELECT * "
                + "FROM list WHERE checked = 0 ORDER BY update_timestamp DESC"
                , function (_results) {
                    var _location_list = [];
                    var _data = [];

                    for (var _i = 0; _i < _results.rows.length; _i++) {
                        var _item = _results.rows.item(_i);
                        //_item.id = _results.rows.item(_i).rowid;
                        //console.log(_results.rows.item(_i));
                        var _location = _item.location;
                        //console.log(_location);
                        var _location_index = $.inArray(_location, _location_list);
                        if (_location_index === -1) {
                            _location_list.push(_location);
                            _location_index = _location_list.length - 1;
                            _data.push({
                                "location": _location,
                                "items": []
                            });
                        }
                        _data[_location_index].items.push(_item);
                    }

                    //console.log(_data.length);
                    console.log(_data);
                    if (_data.length === 0) {
                        _data = $scope.empty_todo_list;
                    }
                    $scope.todo_list = _data;
                    $scope.$digest();
                    if (typeof (_callback) === "function") {
                        _callback(_data);
                    }
                });
    };

    $scope.load_completed_list = function (_callback) {

        DB.exec("SELECT * "
                + "FROM list WHERE checked = 1 ORDER BY update_timestamp DESC"
                , function (_results) {
                    var _data = [];

                    for (var _i = 0; _i < _results.rows.length; _i++) {
                        var _item = _results.rows.item(_i);
                        _data.push(_item);
                    }
                    $scope.completed_list = _data;
                    console.log(_data.length);
                    console.log(_data);
                    $scope.$digest();
                    if (typeof (_callback) === "function") {
                        _callback(_data);
                    }
                });
    };

    $scope.clear_list = function (_callback) {
        ons.notification.confirm({
            message: "確定要清空借書籃嗎？",
            callback: function (_answer) {
                //console.log(_answer);
                if (_answer === 1) {
                    DB.empty_table("list");
                    $scope.load_lists(_callback);
                }
            }
        });
    };

    $scope.add = function (_callback) {
        var _isbn = parseInt($.trim($('[name="isbn"]').val()), 10);
        $scope.has_item(_isbn, function (_result, _item) {
            //console.log("_.add" + _result);
            if (_result === false) {
                $scope.request_add(_isbn, function () {
                    $scope.load_todo_list(function (_data) {
                        //app.navi.pushPage('list.html');
                        console.log(_data);
                        $scope.$digest();
                        _trigger_callback(_callback);
                    });
                });
            }
            else {
                $scope.has_item_notify(_item, _callback);
            }
        });
        return false;
    };
    
    $scope.has_item_notify = function (_item, _callback) {
        //console.log(_item);
        ons.notification.alert(_item.title + " 已經有資料了");

        if (_item.checked === 1) {
            $scope.load_completed_list(function () {
                app.navi.replacePage("completed_list.html", {animation: 'none'});
            });
        }

        _trigger_callback(_callback);
    };

    $scope.request_add = function (_isbn, _callback) {
        //console.log(_isbn);
        $.get(CONFIG.proxy_url, {
            "isbn": _isbn
        }, function (_data) {
            //console.log(_data);

            var _title = _data.title;
            var _call_number = _data.call_number;
            var _isbn = _data.isbn;
            var _location = _data.location;
            var _checked = 0;
            var _create_timestamp = (new Date()).getTime();
            var _update_timestamp = _create_timestamp;
            
            $scope.has_item(_isbn, function (_result, _item) {
                if (_result === false) {
                    DB.exec('INSERT INTO list '
                            + '(title, call_number, isbn, location, checked'
                            + ', create_timestamp, update_timestamp) '
                            + 'VALUES ("' + _title + '", "' + _call_number + '", "' + _isbn
                            + '", "' + _location + '", ' + _checked + ', "' + _create_timestamp
                            + '", "' + _update_timestamp + '")',
                            function () {
                                _trigger_callback(_callback);
                            });
                }
                else {
                    $scope.has_item_notify(_item, _callback);
                }
            });

            
        });
    };

    $scope.has_item = function (_isbn, _callback) {
        if (_isbn === "") {
            _callback(false);
            return;
        }
        var _i = _isbn;
        DB.exec('SELECT title, id, checked FROM list WHERE isbn = "' + _i + '"'
                , function (_results) {
                    //console.log("has_item result: " + _results.rows.length);
                    if (_results.rows.length > 0) {
                        _callback(true, _results.rows.item(0));
                    }
                    else {
                        _callback(false);
                    }
                });
    };

    $scope.open_map = function (_location) {
        ons.notification.alert(_location);
    };

    $scope.complete_item = function (_id, _callback) {
        var _time = (new Date()).getTime();
        DB.exec("update list SET checked = 1, update_timestamp = " + _time + " WHERE id = " + _id, function () {
            $scope.load_todo_list(function () {
                //$scope.$digest();
            });
        });
    };

    $scope.undo_item = function (_id, _callback) {
        var _time = (new Date()).getTime();
        DB.exec("update list SET checked = 0, update_timestamp = " + _time + " WHERE id = " + _id, function () {
            $scope.load_completed_list(function () {
                $scope.$digest();
            });
        });
    };

    // -------------------

    ons.ready(function () {
        //console.log("ready");
        $scope.load_todo_list(function () {
            //console.log("ready 2");

            // 要做這件事情才能夠更新畫面
            //$scope.$digest();
        });
    });

});