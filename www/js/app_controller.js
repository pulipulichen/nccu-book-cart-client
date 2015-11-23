//var CONFIG;
//$.getJSON("config.json", function (_config) {
//    CONFIG = _config;
//});

app.controller('app_controller'
    , ['$scope', 
        '$filter', 
        'factory_config', 
        //'factory_db',
        'factory_book_cart'
    , function (
        $scope, 
        $filter, 
        factory_config, 
        //factory_db,
        factory_book_cart) {

    var _trigger_callback = function (_callback) {
        if (typeof (_callback) === "function")
            _callback();
    };
    
    CONFIG = {
        "proxy_url": "http://www.pulipuli.tk/book-list/server/",
        "test_mode": false
    };

    //app.db.init($scope);
    //factory_db.init();
    _app_factory_db($scope);
    $scope.db_init();
    
    // -----------------
    factory_config.init_var($scope);

    // -----------------

    $scope.load_lists = function (_callback) {
        return factory_book_cart.load_lists($scope, _callback);
    };

    $scope.load_todo_list = function (_callback) {
        return factory_book_cart.load_todo_list($scope, _callback);
    };

    $scope.load_completed_list = function (_callback) {
return factory_book_cart.load_completed_list($scope, _callback);
    };

    $scope.clear_list = function (_callback) {
        return factory_book_cart.clear_list($scope, _callback);
    };
    
    $scope.clear_todo_list = function (_callback) {
        return factory_book_cart.clear_todo_list($scope, _callback);
    };
    
    $scope.clear_completed_list = function (_callback) {
        return factory_book_cart.clear_completed_list($scope, _callback);
    };

    $scope.add = function (_isbn, _callback) {
        return factory_book_cart.add($scope, _isbn, _callback);
    };

    $scope.has_item_notify = function (_item_list, _callback) {
        return factory_book_cart.has_item_notify($scope, _item_list, _callback);
    };

    $scope.request_add = function (_isbn, _callback) {
        //console.log(_isbn);
        modal.show();
        alert("request_add 1");
        $.get(CONFIG.proxy_url, {
            "isbn": _isbn
        }, function (_data_list) {
            alert("request_add 2");
            if (typeof(_data_list.error) === "string") {
                modal.hide();
                ons.notification.alert(_data_list.error);
                _trigger_callback(_callback);
                return;
            }
            
            //console.log(_data);
            var _has_item_list = [];

            alert("request_add 3");
            var _loop = function (_i) {
                alert("request_add loop " + _i);
                if (_i < _data_list.length) {
                    alert("request_add loop _data_list[_i]" + _i);
                    var _data = _data_list[_i];
                    
                    var _author = $.trim(_data.author);
                    var _title = $.trim(_data.title);
                    var _call_number = $.trim(_data.call_number);
                    var _isbn = _data.isbn;
                    var _location = $.trim(_data.location);
                    var _checked = 0;
                    var _create_timestamp = (new Date()).getTime();
                    var _update_timestamp = _create_timestamp;

                    
                    alert("request_add [" + _i + "] 預備has_item");
                    $scope.has_item(_isbn, function (_result, _item) {
                        if (_result === false) {
                            alert("request_add [" + _i + "] 預備DB exec");
                            DB.exec('INSERT INTO list '
                                    + '(author, title, call_number, isbn, location, checked'
                                    + ', create_timestamp, update_timestamp) '
                                    + 'VALUES ("' + _author + '", "' + _title + '", "' + _call_number + '", "' + _isbn
                                    + '", "' + _location + '", ' + _checked + ', "' + _create_timestamp
                                    + '", "' + _update_timestamp + '")',
                                    function () {
                                        alert("request_add [" + _i + "] 儲存完成，準備下一輪");
                                        _i++;
                                        _loop(_i);
                                    });
                        }
                        else {
                            //$scope.has_item_notify(_item, _callback);
                            alert("request_add [" + _i + "] 已經有資料，準備下一輪");
                            _has_item_list.push(_item);
                            _i++;
                            _loop(_i);
                        }
                    });
                }
                else {
                    alert("request_add [" + _i + "] 全部完成");
                    modal.hide();
                    if (_has_item_list.length > 0) {
                        $scope.has_item_notify(_has_item_list, _callback);
                    }
                    else {
                        _trigger_callback(_callback);
                    }
                }
            };

            alert("request_add 4 準備loop");
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
    
    // -----------------------------------
    
/**
 * 警告功能的覆寫
 * @author Pudding 20151123
 */
ons.notification._alert = ons.notification.alert;
ons.notification.alert = function (_opt) {
    if (typeof(_opt) === "string") {
        _opt = {
            message: _opt,
            // or messageHTML: '<div>Message in HTML</div>',
            title: $filter('translate')('TITLE'),
            buttonLabel: 'OK'
        };
    }

    ons.notification._alert(_opt);
};

/**
 * 記錄功能的縮寫
 * @author Pudding 20151123
 */
$.log = function (_msg) {
    console.log(_msg);
};
    
    
    ons.ready(function () {
        ons.notification.alert("測試");
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
