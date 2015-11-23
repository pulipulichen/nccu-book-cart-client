var _app_factory_db_utils = function ($scope) {
    $scope.DB = {
        db: null,
        open_db: function () {
            this.db = openDatabase('book_list', '1.0', 'Book List DB', 2 * 1024 * 1024);
            //console.log(typeof(_DB.transaction));
            return this;
        },
        create_table: function (_table_name, _field_name_list, _success_callback) {
            var _sql = "CREATE TABLE IF NOT EXISTS " + _table_name + " (";

            _sql = _sql + "id INTEGER PRIMARY KEY, ";

            for (var _i in _field_name_list) {
                var _field_name = _field_name_list[_i];
                _sql = _sql + _field_name;
                if (_i < _field_name_list.length - 1) {
                    _sql = _sql + ",";
                }
            }
            _sql = _sql + ")";
            this.exec(_sql, _success_callback);
            return this;
        },
        drop_table: function (_table_name, _success_callback) {
            var _sql = 'DROP TABLE ' + _table_name;
            this.exec(_sql, _success_callback);
            return this;
        },
        empty_table: function (_table_name, _success_callback) {
            var _sql = 'DELETE FROM ' + _table_name;
            this.exec(_sql, _success_callback);
            return this;
        },
        exec: function (_sql, _success_callback) {
            var _ = this;
            //console.log(_sql);
            this.db.transaction(function (_tx) {
                _tx.executeSql(_sql, [], function (_tx, _results) {
                    if (typeof (_success_callback) === "function") {
                        _success_callback(_results);
                    }
                }, function (_tx, _error) {
                    _.error_handler(_tx, _error, _sql);
                });
            });
            return this;
        },
        error_handler: function (_tx, _error, _sql) {
            console.log("Database Error: " + _error.message + " in SQL: " + _sql);
        }
    };
};