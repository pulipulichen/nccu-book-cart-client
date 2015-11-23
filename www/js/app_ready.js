var _app_ready = function ($scope) {

    ons.ready(function () {
        $scope.load_todo_list();
        $scope.setup_menu_swipeable();
        //alert($(window).width())
        
        $(document).keyup(function (_event) {
            //alert(_event.keyCode);
            if (_event.keyCode === 27) {
                $scope.main_back();
            }
        });
    });

};