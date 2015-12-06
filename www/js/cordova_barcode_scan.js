/*global cordova:false */
var cordova_barcode_scan = function ($scope, $filter) {

    /**
     * @param {function} _callback
     * @param {String} _mock_text 如果沒有啟動cordova，則回傳mock_text。如果沒有mock_text，則回傳錯誤
     * @returns {undefined}
     */
    $scope.cordova_barcode_scan = function (_callback, _mock_text) {
        if (typeof (cordova) !== "undefined") {
            cordova.plugins.barcodeScanner.scan(
                    function (_result) {
                        _callback(_result.text);
                    },
                    function (error) {
                        ons.notification.alert("Scanning failed: " + error);
                        _callback();
                    }
            );
        }
        else if (typeof(_mock_text) !== "undefined") {
            _callback(_mock_text);
        }
        else {
            ons.notification.alert($filter('translate')('ONLY_PHONE_AVAILABLE'));
        }
    };
};