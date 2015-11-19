<?php

header('Content-Type: application/json; charset=utf-8');

$data = array(
    array(
        "title" => "移動迷宮",
        "call_number" => "874.56 6161",
        "location" => "總圖三樓中文圖書區"
    ),
    array(
        "title" => "賈伯斯傳",
        "call_number" => "691.175.085",
        "location" => "商圖"
    ),
    array(
        "title" => "成功是故意的：蹲好成功的六個馬步",
        "call_number" => "694.25.1612",
        "location" => "商圖"
    ),
);
        
echo json_encode($data[0], JSON_UNESCAPED_UNICODE);