var _app_factory_ons_utils = function ($scope, $filter) {

    /**
     * 警告功能的覆寫
     * @author Pudding 20151123
     */
    ons.notification._alert = ons.notification.alert;
    ons.notification.alert = function (_opt) {
        if (typeof (_opt) === "string") {
            _opt = {
                message: _opt,
                // or messageHTML: '<div>Message in HTML</div>',
                title: $filter('translate')('ONS_TITLE'),
                buttonLabel: $filter('translate')('ONS_OK')
            };
        }

        ons.notification._alert(_opt);
    };
    
    /**
     * 確認功能的覆寫
     * @author Pudding 20151123
     */
    ons.notification._confirm = ons.notification.confirm;
    ons.notification.confirm = function (_opt, _callback) {
        if (typeof (_opt) === "string" 
                && typeof(_callback) === "function") {
            _opt = {
                title: $filter('translate')('ONS_TITLE'),
                buttonLabels: [$filter('translate')('ONS_NO'), $filter('translate')('ONS_YES')],
                message: _opt,
                callback: _callback
            };
        }

        ons.notification._confirm(_opt);
    };
    

};