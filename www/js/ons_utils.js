ons.notification._alert = ons.notification.alert;
ons.notification.alert = function (_opt) {
    if (typeof(_opt) === "string") {
        _opt = {
            message: _opt,
            // or messageHTML: '<div>Message in HTML</div>',
            title: '政大借書籃',
            buttonLabel: 'OK'
        };
    }

    ons.notification._alert(_opt);
};
