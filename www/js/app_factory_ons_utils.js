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
                title: $filter('translate')('TITLE'),
                buttonLabel: 'OK'
            };
        }

        ons.notification._alert(_opt);
    };

};