var _app_factory_jquery_utils = function ($scope) {
    
    /**
     * 記錄功能的縮寫
     * @author Pudding 20151123
     * @param {String} _msg
     */    
    $.log = function (_msg) {
        console.log(_msg);
    };

    $.trigger_callback = function (_callback, _params) {
        if (typeof (_callback) === "function")
            _callback(_params);
    };
};