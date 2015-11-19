var app = ons.bootstrap('my-app', ['onsen','pascalprecht.translate']);
app.config(function ($translateProvider) {
    $translateProvider.preferredLanguage('zh_TW');
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    
    $.getJSON("config.json", function (_config) {
        CONFIG = _config;
    });
});