var app = ons.bootstrap('my-app', ['onsen','pascalprecht.translate']);

/**
 * 翻譯
 * @param {type} param
 */
app.config(function ($translateProvider) {
    $translateProvider.preferredLanguage('zh_TW');
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
});
