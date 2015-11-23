var _app_ready = function ($scope) {

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
            var _set_menu_swipeable = function () {
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

};