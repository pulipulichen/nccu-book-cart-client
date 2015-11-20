<?php

header('Content-Type: application/json; charset=utf-8');

$data = array(
    array(
        "title" => "移動迷宮",
        "call_number" => "874.56 6161",
        "location" => "總圖三樓中文圖書區",
        "isbn" => "121545487911"
    ),
    array(
        "title" => "賈伯斯傳",
        "call_number" => "691.175.085",
        "location" => "商圖",
        "isbn" => "9789862168370"
    ),
    array(
        "title" => "成功是故意的：蹲好成功的六個馬步",
        "call_number" => "694.25.1612",
        "location" => "商圖",
        "isbn" => "121545487933"
    ),
);

$index = array_rand($data, 1);
if (isset($_GET["isbn"]) && intval($_GET["isbn"]) < count($data)) {
    $index = intval($_GET["isbn"]);
}
//echo json_encode($data[], JSON_UNESCAPED_UNICODE);
echo json_encode($data[$index], JSON_UNESCAPED_UNICODE);

exit();

// ----------------------------------------------------

// ISBN=9789862168370
// http://jenda.lib.nccu.edu.tw/search~S5*cht/?searchtype=i&searcharg=9789862168370&searchscope=5&sortdropdown=-&SORT=DZ&extended=0&SUBMIT=%E6%9F%A5%E8%A9%A2&availlim=1&searchlimits=&searchorigarg=X%7Bu8CC8%7D%7Bu4F2F%7D%7Bu65AF%7D%7Bu50B3%7D%26SORT%3DD#.Vk6H3HYrLRY

$isbn = 9789862168370;
$url = "http://jenda.lib.nccu.edu.tw/search~S5*cht/?searchtype=i&searcharg=" . $isbn .  "&searchscope=5&sortdropdown=-&SORT=DZ&extended=0&SUBMIT=%E6%9F%A5%E8%A9%A2&availlim=1&searchlimits=&searchorigarg=X%7Bu8CC8%7D%7Bu4F2F%7D%7Bu65AF%7D%7Bu50B3%7D%26SORT%3DD#.Vk6H3HYrLRY";
$content = file_get_contents($url);
//$content = file_get_contents("test.html");

function get_field($content, $header, $footer = NULL, $header_padding = "") {
    //echo $content;
    echo mb_strpos($content, $header);
    $header_index = mb_strpos($content, $header) + mb_strlen($header) + mb_strlen($header_padding) - 2;
    echo "[".$header_index."]";
    if ($footer !== NULL) {
        $length = mb_strpos($content, $footer, $header_index) - $header_index;
    }
    else {
        $length = mb_strlen($content) - $header_index;
    }
    echo ",[".$length . "]";
    return mb_substr($content, $header_index, $length);
}

$title = get_field(
        $content,
        '<td valign="top" width="20%"  class="bibInfoLabel">題名/作者</td>
<td class="bibInfoData">
<strong>',
        " / "
        );
echo $title;
// ------------------------------------

$bibItemsEntry = get_field(
        $content,
        '<th width="30%"  class="bibItemsHeader">
館藏地
</th>
<th width="45%"  class="bibItemsHeader">
索書號
</th>
<th width="25%"  class="bibItemsHeader">
處理狀態
</th>
</tr>',
        '</table>
<!-- BEGIN BIBDETAIL TABLE BORDER -->',
        ""
        );
$list = explode('<tr  class="bibItemsEntry">', $bibItemsEntry);
$call_number = NULL;
foreach ($list AS $key => $item) {
    if (strpos($item, "可流通")) {
        $field_c = get_field($item, "<!-- field C -->", "</td>");
        $a = get_field($field_c, ">", "</a>");
        
        $c = get_field($field_c, "<!-- field # -->");
        $call_number = $a . " " . $c;
        
        // ---------------
        
        $f1 = get_field($item, '<!-- field 1 -->&nbsp;<a href="', "</a>");
        $location = get_field($f1, '">');
        //echo $location;
        
        break;
    }
}

$output = array(
    "title" => $title,
    "call_number" => $call_number,
    "location" => $location
);
//echo json_encode($output, JSON_UNESCAPED_UNICODE);

// ------------------------------------

//echo $bibItemsEntry;

//$xml = new SimpleXMLElement($content);
//$result = $xml->xpath('//*[@id="out_frame"]/table/tbody/tr[2]/td[2]/table[1]/tbody/tr/td/table/tbody/tr[2]/td[2]/strong');
//echo "/*";
//echo $result;
//echo $result;
//echo "*/";
//echo json_encode($data[0], JSON_UNESCAPED_UNICODE);