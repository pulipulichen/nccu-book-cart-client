/*global cordova:false */
var cordova_inappbrowser_submit = function ($scope) {

    $scope.cordova_inappbrowser_submit = function (_selector) {
        var _form = $(_selector);

        if (typeof (cordova) === "undefined") {
            _form.submit();
            return;
        }
        else {
            // See PayPalMobilePGPlugin.js for full documentation
            // set environment you want to use
            window.plugins.PayPalMobile.setEnvironment("PayPalEnvironmentNoNetwork");

            // create a PayPalPayment object, usually you would pass parameters dynamically
            var payment = new PayPalPayment(
                    $scope.CONFIG.paypal.amount, 
                    $scope.CONFIG.paypal.money, 
                    $scope.CONFIG.paypal.product);

            // define a callback when payment has been completed
            var completionCallback = function (proofOfPayment) {
                // TODO: Send this result to the server for verification;
                // see https://developer.paypal.com/webapps/developer/docs/integration/mobile/verify-mobile-payment/ for details.
                console.log("Proof of payment: " + JSON.stringify(proofOfPayment));
            };

            // define a callback if payment has been canceled
            var cancelCallback = function (reason) {
                console.log("Payment cancelled: " + reason);
            };

            // launch UI, the PayPal UI will be present on screen until user cancels it or payment completed
            window.plugins.PayPalMobile.presentPaymentUI(
                    $scope.CONFIG.paypal.client_id, 
                    $scope.CONFIG.paypal.email_address, 
                    //"someuser@somedomain.com",
                    payment,
                    completionCallback, 
                    cancelCallback
            );

        }
//        
//        //$event.preventDefault();
//        //$event.stopPropagation();
//        
//        var _form = $(_selector);
//        
//        var _get_parameters = "";
//        
//        var _collect_input = function (_selector) {
//            var _inputs = _form.find("input");
//            for (var _i = 0; _i < _inputs.length; _i++) {
//                if (_get_parameters !== "") {
//                    _get_parameters = _get_parameters + "&";
//                }
//                _get_parameters = _get_parameters + _inputs.eq(_i).attr("name") + "=" + _inputs.eq(_i).val();
//            }
//        };
//        
//        _collect_input("input");
//        _collect_input("select");
//            
//        var _url = _form.attr("action") + "?" + _get_parameters;
//        //alert(_url);
//        window.open(_url, "_system");
    };
};