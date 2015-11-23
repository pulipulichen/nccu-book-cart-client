var _app_controller = function ($scope,$filter) {
    _app_factory_db($scope);

    _app_factory_config($scope);

    _app_factory_book_cart($scope, $filter);

    _app_factory_ons_view($scope);

    _app_factory_ons_utils($scope, $filter);
    _app_factory_jquery_utils($scope);
    // -----------------------------------

    _app_ready($scope);
};

app.controller('app_controller'
        , ['$scope',
            '$filter',
            _app_controller]);