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
};