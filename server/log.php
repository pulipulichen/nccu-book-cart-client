<?php
if (isset($_POST["log"]) === FALSE) {
    //exit();
}

include_once 'lib/rb.php';
require_once 'lib/Mobile_Detect.php';

// 儲存歷程資料
//$log = $_POST["log"];
$log = "log";

 R::setup('sqlite:book_list.sqlite'); //sqlite
 
R::setAutoResolve( TRUE );        //Recommended as of version 4.2

$table = R::dispense('log');
$table->log = $log;

$ip = getenv('HTTP_CLIENT_IP')?:
getenv('HTTP_X_FORWARDED_FOR')?:
getenv('HTTP_X_FORWARDED')?:
getenv('HTTP_FORWARDED_FOR')?:
getenv('HTTP_FORWARDED')?:
getenv('REMOTE_ADDR');
$table->ip = $ip;

$detect = new Mobile_Detect;
$table->user_agent = $_SERVER['HTTP_USER_AGENT'];

R::store($table);