/*global cordova:false */
var cordova_inappbrowser_submit = function ($scope) {

    $scope.cordova_inappbrowser_submit = function (_selector) {
        var _form = $(_selector);
        
        var _get_parameters = "";
        
        var _collect_input = function (_selector) {
            var _inputs = _form.find(_selector);
            for (var _i = 0; _i < _inputs.length; _i++) {
                if (_get_parameters !== "") {
                    _get_parameters = _get_parameters + "&";
                }
                var _val = _inputs.eq(_i).val();
                _val = encodeURIComponent(_val);
                _get_parameters = _get_parameters + _inputs.eq(_i).attr("name") + "=" + _val;
            }
        };
        
        _collect_input("input");
        _collect_input("select");
            
        var _url = _form.attr("action") + "?" + _get_parameters;
        window.open(_url, "_system");
    };
};