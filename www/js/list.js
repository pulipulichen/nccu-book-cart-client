
add_list = function (_isbn) {
    $.get(CONFIG.proxy_url, _isbn, function (_data) {
        console.log(_data);
    });
};