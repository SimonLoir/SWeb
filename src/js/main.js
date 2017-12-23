/**
 * Using some npm modules 
 */
const {
    dialog
} = require("electron").remote;
const app = require('electron').remote;
const fs = require("fs");
const os = require('os');
const path = require('path');

var sab = require(__dirname + "/../js/sweb-app-builder");
/**
 * Based on scode 2.17.12
 */
var tabs = {}, id = 0, project_settings, active_document = null, settings, folder, folder_status, language, first_use,terminal_last_id = 0,terms = {};
var tabmanager = require(__dirname + "/../js/tabs");
var highlighting = require(__dirname + "/../js/highlighting").init();
var directory = "";

$(document).ready( () => {
    $('#create_empty_project').click(() => {
        $('.project_creation_tool').addClass('visible');
    });
    $('.app-type').click(function () {
        $('.app-type').removeClass('selected');
        $(this).addClass('selected')
        console.log(this)
    });
    $('.popup-close').click(() => {
        $('.project_creation_tool').removeClass('visible');
    });
    $('#build_app').click(() => {
        let done = sab.initProject($('#dir_name').get(0).value, $('#app_name').get(0).value, $('.selected').get(0).getAttribute("data-type"));
        if(done == true){
            view.hideStartScreen();
        }else{
            console.log("aborded")
        }
    });
    $(".cross-quit").click(() => {
        var window = app.getCurrentWindow();
        window.close();
    });
    $("#choose_dir").click(() => {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Choisissez un dossier dans lequel mettre votre projet."}, function (f) {
            if(f== undefined){
                return;
            }
            $('#dir_name').get(0).value = f[0];
        });
    });
    //$("#open_from_explorer").click(view.hideStartScreen);
    //$("#open_from_explorer").click()
});

var view = {
    hideStartScreen : () => {
        $('.startscreen').css('display', "none");
        $('.start').removeClass('start');
        $('.project_creation_tool').removeClass('visible');        
    }
}
/*
 * Functions from scode 
 * 
 */
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

String.prototype.find = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    var value = regex.exec(this.substring(startpos || 0));
    
    try {
        return [(indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf, value[0], value[0].length];
    } catch (error) {
        return false;
    }
}

String.prototype.findStr = function(regex, startpos) {
    return this.find(new RegExp(regex, "i"), startpos);
}

/**
 * Inserts text at the position of the cursor
 * @param {String} text 
 */
function insertTextAtCursor(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

/**
 * Gets the cursor posiiton in the specified element
 * @param {String} input The element
 */
function getCaretPos(input) {
    // Internet Explorer Caret Position (TextArea)
    if (document.selection && document.selection.createRange) {
        var range = document.selection.createRange();
        var bookmark = range.getBookmark();
        var caret_pos = bookmark.charCodeAt(2) - 2;
    } else {
        // Firefox Caret Position (TextArea)
        if (input.setSelectionRange)
            var caret_pos = input.selectionStart;
    }
    return caret_pos;
}

function rmdir(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function (entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rmdir(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

function load_projet_setting() {
    if (fs.existsSync(folder[0] + "/.scode.json")) {

        try {
            project_settings = JSON.parse(fs.readFileSync(folder[0] + "/.scode.json"), 'utf-8');
            if (project_settings.address != undefined) {
                alert(language.liveReloadEnabled);
                ipcRenderer.send('render-project-reg', project_settings.address);
            }
        } catch (error) {
            
        }
    }
}

/*
* SCode module compatibility
*/
var editor = {
    updateWorkingDirOpenedFiles: function () {

    }
}

var sweb =  {
    manager : function (filename) {
        tabs[filename] = {
            "title": filename,
            "id": "tab" + id
        }

        try {
            editor.updateWorkingDirOpenedFiles();
            fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
        } catch (error) {
            alert(error);
        }

        id++;

        var tab = $('.tabmanager').child('div').addClass('tab');
        tab.get(0).id = tabs[filename].id;

        var cross;

        var xfilename = filename.replace(/\\/g, "/");

        var filename_split = xfilename.split('/');

        var real_file_name = filename_split[filename_split.length - 1];

        var frn_split = real_file_name.split('.');

        var xtab = $('.xheader').child('span').html(real_file_name + ' - view');
        xtab.addClass('xtab');
        xtab.get(0).setAttribute('data-file', filename);
        xtab.get(0).id = "x" + tabs[filename].id;
        xtab.get(0).setAttribute('data-id', tabs[filename].id);

        active_document = filename;

        xtab.click(function () {
            var all_tab = document.querySelectorAll('.tab');
            for (var i = 0; i < all_tab.length; i++) {
                var xxtab = all_tab[i];
                xxtab.style.display = "none";
            }
            try {
                $(document.querySelector('.active')).removeClass('active');
            } catch (error) {

            }
            $(this).addClass('active')
            $('#' + this.getAttribute("data-id")).get(0).style.display = "block";
            active_document = this.getAttribute('data-file');
        });

        xtab.click();

        cross = xtab.child('i').html("  ×");
        cross.get(0).setAttribute('data-id', tabs[filename].id);
        cross.get(0).setAttribute('data-file', filename);
        cross.addClass('cross');
        cross.click(function () {
            delete tabs[this.getAttribute('data-file')];
            editor.updateWorkingDirOpenedFiles();
            $('#' + this.getAttribute("data-id")).remove();
            $('#x' + this.getAttribute("data-id")).remove();

            active_document = "~";
            try {
                fs.writeFileSync(os.homedir() + "/.scode/files.json", JSON.stringify(tabs), "utf-8");
            } catch (error) {
                alert(error);
            }
        });

        var div = tab.child('div');
        div.css("width", "calc(100% - 30px)")
        div.css('height', "calc(100% - 30px)")
        div.addClass('app-maker');


        return div;
    }
}