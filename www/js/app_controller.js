// ----------------------------

var _ons_init = function () {

    
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