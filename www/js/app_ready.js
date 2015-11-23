var _app_ready = function ($scope) {

    ons.ready(function () {
        $scope.load_todo_list();
        $scope.setup_menu_swipeable();
    });

};