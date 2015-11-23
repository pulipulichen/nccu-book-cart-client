var _app_factory_ons_view = function ($scope) {
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
        if (typeof (cordova) !== "undefined") {
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

    $scope.setup_menu_swipeable = function () {
        var _swipeable_width = 400;
        var _menu_swipeable = true;
        var _set_menu_swipeable = function () {
            // This will execute whenever the window is resized
            //$(window).height(); // New height
            var _width = $(window).width(); // New width
            if (_width > _swipeable_width && _menu_swipeable === true) {
                _menu_swipeable = false;
                app.menu.setSwipeable(false);
            }
            else if (_width < _swipeable_width + 1 && _menu_swipeable === false) {
                _menu_swipeable = true;
                app.menu.setSwipeable(true);
            }
        };
        $(window).resize(_set_menu_swipeable);
        _set_menu_swipeable();
    };

};