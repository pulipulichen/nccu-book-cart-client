// ----------------------------

var _ons_init = function () {

    var app = ons.bootstrap('app', ['onsen', 'pascalprecht.translate']);

    /**
     * 翻譯
     * @param {type} param
     */
    app.config(function ($translateProvider) {
        $translateProvider.preferredLanguage('zh_TW');
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
    });

// --------------------------

    var _app_controller = function ($scope, $filter) {
        _app_factory_db($scope);

        _app_factory_config($scope);

        _app_factory_book_cart($scope, $filter);

        _app_factory_ons_view($scope);

        _app_factory_ons_utils($scope, $filter);
        _app_factory_jquery_utils($scope);
        // -----------------------------------

        _app_ready($scope);
    };

    app.controller('app_controller'
            , ['$scope',
                '$filter',
                _app_controller]);
};

var _load_script_list = function (_script_list, _callback) {
    var _loop = function (_i) {
        if (_i < _script_list.length) {
            var script = document.createElement('script');
            script.async = "async";
            script.src = _script_list[_i];
            script.onload = function () {
                _i++;
                _loop(_i);
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        else {
            _callback();
        }
    }
    _loop(0);
};
_load_script_list([
    "js/app_factory_config.js",
    "js/app_factory_db.js",
    "js/app_factory_book_cart.js",
    "js/app_factory_ons_view.js",
    "js/app_factory_ons_utils.js",
    "js/app_factory_jquery.js",
    "js/app_ready.js"
], _ons_init);