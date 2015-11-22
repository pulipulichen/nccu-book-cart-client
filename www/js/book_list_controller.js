var CONFIG;
$.getJSON("config.json", function (_config) {
    CONFIG = _config;
    
    
});

app.controller('book_list_controller', ['$scope', '$filter', function ($scope, $filter) {

    

    var _trigger_callback = function (_callback) {
        if (typeof (_callback) === "function")
            _callback();
    };

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
    $scope.mock_isbn = "9789862168370";  //賈伯斯傳

    $scope.location_image = {
        "社資二樓政大論文區": "img/ssic_2f_s.png",
        
        "總圖附件": "img/ccl_cht_1f.png",
        "總圖三樓中文圖書區": "img/ccl_cht_3f.png",
        "總圖三樓新書區": "img/ccl_cht_3f.png",
        "總圖四樓西文圖書區": "img/ccl_cht_4f.png",
        "總圖四樓新書區": "img/ccl_cht_4f.png",
        
        "綜圖一樓中文新書區": "img/cclsl_cht_1f.png",
        "綜圖二樓西文新書區": "img/cclsl_cht_2f.png",
        "綜圖B1中文": "img/cclsl_cht_b1.png",
        "綜圖2F西文": "img/cclsl_cht_2f.png",
        
        "商圖": "img/cbl_cht.png",
        "商圖附件": "img/cbl_cht.png",
        
        "傳圖": "img/cjl_cht.png"
    };
    $scope.map_title = "";
    $scope.map_src = "";

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
    
    $scope.clear_todo_list = function (_callback) {
        ons.notification.confirm({
            //message: $translate("TODO_LIST_EMPTY_CONFIRM"),
            message: $filter('translate')('TODO_LIST_EMPTY_CONFIRM'),
            callback: function (_answer) {
                //console.log(_answer);
                if (_answer === 1) {
                    DB.exec("DELETE FROM list WHERE checked = 0", function () {
                        $scope.load_todo_list(_callback);
                    });
                }
            }
        });
    };
    
    $scope.clear_completed_list = function (_callback) {
        ons.notification.confirm({
            message: "確定要清空歷史記錄嗎？",
            callback: function (_answer) {
                //console.log(_answer);
                if (_answer === 1) {
                    DB.exec("DELETE FROM list WHERE checked = 1", function () {
                        $scope.load_completed_list(_callback);
                    });
                }
            }
        });
    };

    $scope.add = function (_isbn, _callback) {
        if (typeof(_isbn) === "function") {
            _callback = _isbn;
            _isbn = null;
        }
        
        if (typeof(_isbn) !== "string") {
            _isbn = $.trim($('[name="isbn"]').val());
        }
        console.log(_isbn);
        $scope.has_item(_isbn, function (_result, _item) {
            //console.log("_.add" + _result);
            if (_result === false) {
                $scope.request_add(_isbn, function () {
                    $scope.load_todo_list(function (_data) {
                        //app.navi.pushPage('list.html');
                        console.log(_data);
                        $scope.isbn = "";
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

    $scope.has_item_notify = function (_item_list, _callback) {
        //console.log("has_item_notify");
        //console.log(_item_list);
        if (typeof(_item_list.length) !== "number") {
            _item_list = [_item_list];
        }
        var _title = "";
        for (var _i = 0; _i < _item_list.length; _i++) {
            if (_title !== "") {
                _title = _title + "、";
            }
            _title = _title + _item_list[_i].title;
        }
        ons.notification.alert(_title + " 已經有資料了。");

//        if (_item.checked === 1) {
//            $scope.load_completed_list(function () {
//                app.navi.replacePage("completed_list.html", {animation: 'none'});
//            });
//        }

        _trigger_callback(_callback);
    };

    $scope.request_add = function (_isbn, _callback) {
        //console.log(_isbn);
        modal.show();
        $.get(CONFIG.proxy_url, {
            "isbn": _isbn
        }, function (_data_list) {
            
            if (typeof(_data_list.error) === "string") {
                modal.hide();
                ons.notification.alert(_data_list.error);
                _trigger_callback(_callback);
                return;
            }
            
            //console.log(_data);
            var _has_item_list = [];

            var _loop = function (_i) {
                if (_i < _data_list.length) {
                    var _data = _data_list[_i];
                    
                    var _author = $.trim(_data.author);
                    var _title = $.trim(_data.title);
                    var _call_number = $.trim(_data.call_number);
                    var _isbn = _data.isbn;
                    var _location = $.trim(_data.location);
                    var _checked = 0;
                    var _create_timestamp = (new Date()).getTime();
                    var _update_timestamp = _create_timestamp;

                    $scope.has_item(_isbn, function (_result, _item) {
                        if (_result === false) {
                            DB.exec('INSERT INTO list '
                                    + '(author, title, call_number, isbn, location, checked'
                                    + ', create_timestamp, update_timestamp) '
                                    + 'VALUES ("' + _author + '", "' + _title + '", "' + _call_number + '", "' + _isbn
                                    + '", "' + _location + '", ' + _checked + ', "' + _create_timestamp
                                    + '", "' + _update_timestamp + '")',
                                    function () {
                                        _i++;
                                        _loop(_i);
                                    });
                        }
                        else {
                            //$scope.has_item_notify(_item, _callback);
                            _has_item_list.push(_item);
                            _i++;
                            _loop(_i);
                        }
                    });
                }
                else {
                    modal.hide();
                    if (_has_item_list.length > 0) {
                        $scope.has_item_notify(_has_item_list, _callback);
                    }
                    else {
                        _trigger_callback(_callback);
                    }
                }
            };

            _loop(0);
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
        //ons.notification.alert(_location);
        $scope.map_title = _location;
        $scope.map_src = $scope.location_image[_location];
        
        app.navi.pushPage("map.html");
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

    $scope.search = function () {
        $scope.add();
    };

    $scope.scan_barcode = function () {
        var _search = function (_isbn) {
            $scope.isbn = _isbn;
            //$scope.$digest();
            $scope.add(_isbn);
        };

        if (typeof (cordova) !== "undefined") {
            cordova.plugins.barcodeScanner.scan(
                    function (_result) {
                        _search(_result.text);
                    },
                    function (error) {
                        ons.notification.alert({
                            message: "Scanning failed: " + error,
                            // or messageHTML: '<div>Message in HTML</div>',
                            title: '錯誤',
                            buttonLabel: 'OK'
                        });
                    }
            );
        }
        else {
            _search($scope.mock_isbn);
//        ons.notification.alert({
//            message: '只有手機才能使用掃描條碼功能',
//            // or messageHTML: '<div>Message in HTML</div>',
//            title: '錯誤',
//            buttonLabel: 'OK'
//        });

        }
    };

    $scope.presplit = function () {
        $("#split").addClass("split");
    };

    $scope.precollapse = function () {
        $("#split").removeClass("split");
    };

    $scope.menu_open = function () {
        //$(".onsen-split-view__secondary").css({
        //    "display": "block",
        //    "position": "absolute",
        //    "width": "200px",
        //    "left": "0px",
        //    "z-index": "3",
        //    "opacity": "1"
        //});
        //$(".onsen-split-view__secondary").animate({
        //    left: "0"
        //}, 1000000, "ease-out");
        $(".onsen-sliding-menu__main").addClass("menu-open");
    };

    $scope.menu_close = function () {
        //$(".onsen-split-view__secondary").css({
        //    "display": "none"
        //})
        $(".onsen-sliding-menu__main").removeClass("menu-open");
    };

    $scope.exit_app = function () {
        if (typeof(cordova) !== "undefined") {
            navigator.app.exitApp();
        }
        else {
            window.close();
        }
    };

    // -------------------

    // 初始化動作，很重要
    if (ons.platform.isWebView()) {
        $("body").addClass("web-view");
    }
    
    ons.ready(function () {
        //console.log("ready");
        $scope.load_todo_list(function () {
            //console.log("ready 2");
            //$("#search_barcode_button").click();
            //$scope.$digest();
            // 要做這件事情才能夠更新畫面
            //$scope.$digest();
        });
        

        var _setup_menu_swipeable = function () {
            var _menu_swipeable = true;
            var _set_menu_swipeable = function() {
              // This will execute whenever the window is resized
              //$(window).height(); // New height
              var _width = $(window).width(); // New width
              if (_width > 700 && _menu_swipeable === true) {
                _menu_swipeable = false
            app.menu.setSwipeable(false);
              }
              else if (_width < 701 && _menu_swipeable === false) {
                _menu_swipeable = true;
                app.menu.setSwipeable(true);
              }
            };
            $(window).resize(_set_menu_swipeable);
            _set_menu_swipeable();
        };
        _setup_menu_swipeable();
            
    });

}]);

