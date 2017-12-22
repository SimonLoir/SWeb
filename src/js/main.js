const {
    dialog
} = require("electron").remote;
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
        let done = sab.initProject($('#dir_name').get(0).value, $('#app_name').get(0).value, $('.selected').get(0).getAttribute("data-type"));
        if(done == true){
            view.hideStartScreen();
        }else{
            console.log("aborded")
        }
    });
    $(".cross-quit").click(function() {
        var window = app.getCurrentWindow();
        window.close();
    });
    $("#choose_dir").click(function () {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Choisissez un dossier dans lequel mettre votre projet."}, function (f) {
            if(f== undefined){
                return;
            }
            $('#dir_name').get(0).value = f[0];
        });
    });
});

var view = {
    hideStartScreen : () => {
        $('.startscreen').css('display', "none");
        $('.start').removeClass('start');
        $('.project_creation_tool').removeClass('visible');        
    }
}
