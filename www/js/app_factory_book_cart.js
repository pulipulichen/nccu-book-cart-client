/*global DB:false */
/*global modal:false */
/*global app:false */
var _app_factory_book_cart = function ($scope, $filter) {

    $scope.load_lists = function (_callback) {
        $scope.load_todo_list(function () {
            $scope.load_completed_list(function () {
                $scope.$digest();
                $.trigger_callback(_callback);
            });
        });
    };  //$scope.load_lists = function (_callback)

    $scope.load_todo_list = function (_callback) {

        var _db_callback = function (_results) {
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
            //console.log(_data);
            if (_data.length === 0) {
                _data = $scope.empty_todo_list;
            }
            $scope.todo_list = _data;
            $scope.$digest();
            if (typeof (_callback) === "function") {
                _callback(_data);
            }
        };

        $scope.DB.exec("SELECT * "
                + "FROM list WHERE checked = 0 ORDER BY update_timestamp DESC"
                , _db_callback);
    };  //$scope.load_todo_list = function (_callback) {

    $scope.load_completed_list = function (_callback) {

        var _db_callback = function (_results) {
            var _data = [];

            for (var _i = 0; _i < _results.rows.length; _i++) {
                var _item = _results.rows.item(_i);
                _data.push(_item);
            }
            $scope.completed_list = _data;
            //console.log(_data.length);
            //console.log(_data);
            $scope.$digest();
            if (typeof (_callback) === "function") {
                _callback(_data);
            }
        };
        $scope.DB.exec("SELECT * "
                + "FROM list WHERE checked = 1 ORDER BY update_timestamp DESC"
                , _db_callback);
    };  //$scope.load_completed_list = function (_callback) {

    $scope.clear_list = function (_callback) {
        ons.notification.confirm($filter('translate')('CLEAR_ALL_LIST_CONFIRM'), function (_answer) {
            if (_answer === 1) {
                $scope.DB.empty_table("list");
                $scope.load_lists(_callback);
            }
        });
    };  //$scope.clear_list = function (_callback) {

    $scope.clear_todo_list = function (_id, _callback) {
        if (typeof (_id) === "function") {
            _callback = _id;
            _id = undefined;
        }

        var _lang = 'CLEAR_TODO_LIST';
        var _sql = "DELETE FROM list WHERE checked = 0";
        if (_id !== undefined) {
            var _lang = 'CLEAR_ITEM';
            var _sql = "DELETE FROM list WHERE checked = 0 AND id = " + _id;
        }

        ons.notification.confirm($filter('translate')(_lang),
                function (_answer) {
                    //console.log(_answer);
                    if (_answer === 1) {
                        $scope.DB.exec(_sql, function () {
                            $scope.load_todo_list(_callback);
                        });
                    }
                }
        );
    };  //$scope.clear_todo_list = function (_callback) {

    $scope.clear_completed_list = function (_id, _callback) {
        if (typeof (_id) === "function") {
            _callback = _id;
            _id = undefined;
        }

        var _lang = 'CLEAR_COMPLETED_LIST';
        var _sql = "DELETE FROM list WHERE checked = 1";
        if (_id !== undefined) {
            var _lang = 'CLEAR_ITEM';
            var _sql = "DELETE FROM list WHERE checked = 1 AND id = " + _id;
        }

        ons.notification.confirm($filter('translate')(_lang),
                function (_answer) {
                    //console.log(_answer);
                    if (_answer === 1) {
                        $scope.DB.exec(_sql, function () {
                            $scope.load_completed_list(_callback);
                        });
                    }
                }
        );
    };  //$scope.clear_completed_list = function (_callback) {

    $scope.add = function (_isbn, _callback) {
        if (typeof (_isbn) === "function") {
            _callback = _isbn;
            _isbn = null;
        }

        if (typeof (_isbn) !== "string") {
            _isbn = $.trim($('[name="isbn"]').val());
        }

        if (_isbn === "") {
            return false;
        }

//        console.log(_isbn);
//        $scope.has_item(_isbn, function (_result, _item) {
//            //console.log("_.add" + _result);
//            if (_result === false) {

        //$scope.isbn = "";
        $scope.request_add(_isbn, function () {
            $scope.load_todo_list(function (_data) {
                //app.navi.pushPage('list.html');
                //console.log(_data);
                $("#isbn").val("");
                $scope.$digest();
                $.trigger_callback(_callback);
            });
        });
//            }
//            else {
//                $scope.has_item_notify(_item, _callback);
//            }
//        });
        return false;
    };  //$scope.add = function (_isbn, _callback) {

    $scope.has_item_notify = function (_item_list, _callback) {
        //console.log("has_item_notify");
        //console.log(_item_list);
        if (typeof (_item_list.length) !== "number") {
            _item_list = [_item_list];
        }
        var _title = "";
        for (var _i = 0; _i < _item_list.length; _i++) {
            if (_title !== "") {
                _title = _title + "、";
            }
            _title = _title + _item_list[_i];
        }
        ons.notification.alert(_title + " " + $filter('translate')('HAS_TIEM_ALERT'));

//        if (_item.checked === 1) {
//            $scope.load_completed_list(function () {
//                app.navi.replacePage("completed_list.html", {animation: 'none'});
//            });
//        }

        $.trigger_callback(_callback);
    };  //$scope.has_item_notify = function (_item_list, _callback) {

    $scope.request_add = function (_isbn, _callback) {
        //console.log(_isbn);
        modal.show();
        //alert("request_add 1");
        $.get($scope.CONFIG.proxy_url, {
            "isbn": _isbn
        }, function (_data_list) {
            //alert("request_add 2");
            if (typeof (_data_list.error) === "string") {
                modal.hide();
                ons.notification.alert($filter('translate')(_data_list.error));
                $.trigger_callback(_callback);
                return;
            }

            //console.log(_data);
            var _has_item_list = [];

            //alert("request_add 3");
            var _loop = function (_i) {
                //alert("request_add loop " + _i);
                if (_i < _data_list.length) {
                    //alert("request_add loop _data_list[_i]" + _i);
                    var _data = _data_list[_i];

                    var _author = $.trim(_data.author);
                    var _title = $.trim(_data.title);
                    var _call_number = $.trim(_data.call_number);
                    var _isbn = _data.isbn;
                    var _location = $.trim(_data.location);
                    var _checked = 0;
                    var _create_timestamp = (new Date()).getTime();
                    var _update_timestamp = _create_timestamp;
                    var _img = _data.img;

                    //alert("request_add [" + _i + "] 預備has_item");
                    $scope.has_item(_call_number, function (_result, _item) {
                        if (_result === false) {
                            //alert("request_add [" + _i + "] 預備DB exec");

                            var _db_callback = function () {
                                _i++;
                                _loop(_i);
                            };
                            $scope.DB.exec('INSERT INTO list '
                                    + '(author, title, call_number, isbn, location, checked'
                                    + ', create_timestamp, update_timestamp, img) '
                                    + 'VALUES ("' + _author + '", "' + _title + '", "' + _call_number + '", "' + _isbn
                                    + '", "' + _location + '", ' + _checked + ', "' + _create_timestamp
                                    + '", "' + _update_timestamp + '", "' + _img + '")',
                                    _db_callback);
                        }
                        else {
                            //$scope.has_item_notify(_item, _callback);
                            //alert("request_add [" + _i + "] 已經有資料，準備下一輪");
                            if ($.inArray(_item.title, _has_item_list) === -1) {
                                _has_item_list.push(_item.title);
                            }
                            _i++;
                            _loop(_i);
                        }
                    });
                }
                else {
                    //alert("request_add [" + _i + "] 全部完成");
                    modal.hide();
                    if (_has_item_list.length > 0) {
                        $scope.has_item_notify(_has_item_list, _callback);
                    }
                    else {
                        $.trigger_callback(_callback);
                    }
                }
            };

            //alert("request_add 4 準備loop");
            _loop(0);
        });
    };  //$scope.request_add = function (_isbn, _callback)

    $scope.has_item = function (_call_number, _callback) {
        if (_call_number === "") {
            _callback(false);
            return;
        }
        var _i = _call_number;
        $scope.DB.exec('SELECT title, id, checked FROM list WHERE call_number = "' + _i + '"'
                , function (_results) {
                    //console.log("has_item result: " + _results.rows.length);
                    if (_results.rows.length > 0) {
                        _callback(true, _results.rows.item(0));
                    }
                    else {
                        _callback(false);
                    }
                });
    };  //$scope.has_item = function (_isbn, _callback) {

    $scope.open_map = function (_location) {
        //ons.notification.alert(_location);
        var _src = $scope.location_image[_location];

        if (_src.substr(0, $scope.CONFIG.proxy_url.length) === $scope.CONFIG.proxy_url) {
            $scope.map_title = _location;
            $scope.map_src = _src;
            app.navi.pushPage("map.html");
        }
        else {
            window.open(_src, "_system");
        }
    };  //$scope.open_map = function (_location) {

    $scope.open_item_page = function (_isbn) {
        var _url = "http://jenda.lib.nccu.edu.tw/search~S5*cht/?searchtype=i&searcharg=" + _isbn + "&searchscope=5&SORT=DZ&extended=0&availlim=1=&searchorigarg=X%7Bu8CC8%7D%7Bu4F2F%7D%7Bu65AF%7D%7Bu50B3%7D%26SORT%3DD#.Vk6H3HYrLRY";
        window.open(_url, "_system");
    };

    $scope.complete_item = function (_id, $event, _callback) {
        if ($event !== undefined) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        var _time = (new Date()).getTime();
        $scope.DB.exec("update list SET checked = 1, update_timestamp = " + _time
                + " WHERE id = " + _id, function () {
                    $scope.load_todo_list(function () {
                        //$scope.$digest();
                    });
                });
    };  //$scope.complete_item = function (_id, _callback) {

    $scope.undo_item = function (_id, $event, _callback) {
        if ($event !== undefined) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        var _time = (new Date()).getTime();
        $scope.DB.exec("update list SET checked = 0, update_timestamp = " + _time
                + " WHERE id = " + _id, function () {
                    $scope.load_completed_list(function () {
                        $scope.$digest();
                    });
                });
    };  //$scope.undo_item = function (_id, _callback) {

    $scope.search = function () {
        if ($.trim($(".search-input").val()) === "") {
            $(".search-input").focus();
            return this;
        }
        $scope.add();
    };  //$scope.search = function () {

    $scope.scan_barcode = function () {
        var _search = function (_isbn) {
            if (_isbn !== undefined) {
                $scope.isbn = _isbn;
                $scope.add(_isbn);
            }
        };

        $scope.cordova_barcode_scan(_search, $scope.mock_url);
    };  //$scope.scan_barcode = function () {

    $scope.scan_barcode_help_disable = false;

    $scope.scan_barcode_help = function () {
        //console.log($("#scan_help_disable").attr("checked"));
        if ($("#scan_help_disable").attr("checked") === true) {
            $scope.scan_barcode();
        }
        else {
            scan_help_modal.show();
        }
    };  //$scope.scan_barcode = function () {

    $scope.set_scan_help_disable = function () {
        $scope.scan_barcode_help_disable = true;
    };

    $scope.share_app = function () {
        $scope.cordova_social_share($filter('translate')('SHARE_APP_TEXT'));
    };

    // ---------------------------------

    ons.createPopover('todo_list_submenu_popover.html').then(function (popover) {
        $scope.todo_list_popover = popover;
    });

    ons.createPopover('completed_list_submenu_popover.html').then(function (popover) {
        $scope.completed_list_popover = popover;
    });

    $scope.popover_item_id;
    $scope.popover_item_isbn;

    $scope.show_todo_list_popover = function (_id, _isbn, _e) {
        $scope.popover_item_id = _id;
        $scope.popover_item_isbn = _isbn;
        $scope.todo_list_popover.show(_e);
    };

    $scope.show_completed_list_popover = function (_id, _isbn, _e) {
        $scope.popover_item_id = _id;
        $scope.popover_item_isbn = _isbn;
        $scope.completed_list_popover.show(_e);
    };

    $scope.popover_complete_item = function () {
        $scope.complete_item($scope.popover_item_id);
        $scope.todo_list_popover.hide();
    };

    $scope.popover_undo_item = function () {
        $scope.undo_item($scope.popover_item_id);
        $scope.completed_list_popover.hide();
    };

    $scope.popover_clear_todo_list = function () {
        $scope.clear_todo_list($scope.popover_item_id);
        $scope.todo_list_popover.hide();
    };

    $scope.popover_clear_completed_list = function () {
        $scope.clear_completed_list($scope.popover_item_id);
        $scope.completed_list_popover.hide();
    };

    $scope.popover_open_item_page = function () {
        $scope.open_item_page($scope.popover_item_isbn);
        $scope.todo_list_popover.hide();
        $scope.completed_list_popover.hide();
    };
};