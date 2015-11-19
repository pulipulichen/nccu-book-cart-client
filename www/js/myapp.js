scan_barcode = function () {
    if (typeof (cordova) !== "undefined") {
        cordova.plugins.barcodeScanner.scan(
                function (result) {
                    $(".demo-search-input").val(result.text);
                },
                function (error) {
                    ons.notification.alert({
                        message: "Scanning failed: " + error,
                        // or messageHTML: '<div>Message in HTML</div>',
                        title: '錯誤',
                        buttonLabel: 'OK'
                    });
                }
        );
    }
    else {
        ons.notification.alert({
            message: '只有手機才能使用掃描條碼功能',
            // or messageHTML: '<div>Message in HTML</div>',
            title: '錯誤',
            buttonLabel: 'OK'
        });
    }
};
//



//            ons.bootstrap();
//            ons.ready(function () {
//                var app = angular.module('app', ['pascalprecht.translate']);
//app.config(function ($translateProvider) {
//    $translateProvider.preferredLanguage('en');
//   $translateProvider.useStaticFilesLoader({
//        prefix: 'i18n/',
//        suffix: '.json'
//    });
//});
//            });
//ons.bootstrap();

//      module.controller('AppController', function($scope) { });
//      module.controller('PageController', function($scope) {
//        ons.ready(function() {
//          // Init code here
//        });
//      });