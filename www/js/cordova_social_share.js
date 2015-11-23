var cordova_social_share = function ($scope, $filter) {

    /**
     * @param {function} _callback
     * @param {String} _mock_text 如果沒有啟動cordova，則回傳mock_text。如果沒有mock_text，則回傳錯誤
     * @returns {undefined}
     */
    $scope.cordova_social_share = function (_message) {
        if (typeof (cordova) !== "undefined") {
            window.plugins.socialsharing.share(_message);
        }
        else {
            ons.notification.alert("只有手機上才能執行此功能");
        }
    };
};