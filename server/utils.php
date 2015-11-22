<?php
function book_list_log($log) {
    $table = R::dispense('log');
    $table->log = $log;

    $ip = getenv('HTTP_CLIENT_IP')?:
    getenv('HTTP_X_FORWARDED_FOR')?:
    getenv('HTTP_X_FORWARDED')?:
    getenv('HTTP_FORWARDED_FOR')?:
    getenv('HTTP_FORWARDED')?:
    getenv('REMOTE_ADDR');
    $table->ip = $ip;
    $table->user_agent = $_SERVER['HTTP_USER_AGENT'];

    $table->get = json_encode($_GET, JSON_UNESCAPED_UNICODE);
    $table->post = json_encode($_POST, JSON_UNESCAPED_UNICODE);

    R::store($table);
}