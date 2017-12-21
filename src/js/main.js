const app = require('electron').remote;
const fs = require("fs");
const os = require('os');
var sab = require(__dirname + "/../js/sweb-app-builder");
$(document).ready(function () {
    $('#create_empty_project').click(function () {
        $('.project_creation_tool').addClass('visible');
    });
    $('.app-type').click(function () {
        $('.app-type').removeClass('selected');
        $(this).addClass('selected')
    });
    $('.popup-close').click(function () {
        $('.project_creation_tool').removeClass('visible');
    });
    $('#build_app').click(function () {
        sab.initProject($('#dir_name').get(0).value, $('#app_name').get(0).value);
    });
    $(".cross-quit").click(function() {
        var window = app.getCurrentWindow();
        window.close();
    });
});
