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
var terminal = require(__dirname + "/../js/terminal").newTerminal;

var sab = require(__dirname + "/../js/sweb-app-builder");
var sml = require(__dirname + "/../js/sml").init();
var x_elements = {};
var elements = {};
/**
 * Based on scode 2.17.12
 */
var tabs = {}, id = 0, project_settings, active_document = null, settings, folder, folder_status, language, first_use, terminal_last_id = 0, terms = {};
var tabmanager = require(__dirname + "/../js/tabs");
var highlighting = require(__dirname + "/../js/highlighting").init();
var directory = "";
var folder = [];

$(document).ready(() => {
    $('#create_empty_project').click(() => {
        $('.project_creation_tool').addClass('visible');
    });
    $('.app-type').click(function () {
        $('.app-type').removeClass('selected');
        $(this).addClass('selected');
    });
    $('.popup-close').click(() => {
        $('.project_creation_tool').removeClass('visible');
    });
    $('#build_app').click(() => {
        let done = sab.initProject($('#dir_name').get(0).value, $('#app_name').get(0).value, $('.selected').get(0).getAttribute("data-type"));
        if (done == true) {
            view.hideStartScreen();
        } else {
            //console.log("aborded")
        }
    });
    $(".cross-quit").click(() => {
        var window = app.getCurrentWindow();
        window.close();
    });
    $("#choose_dir").click(() => {
        dialog.showOpenDialog({ properties: ['openDirectory'], title: "Choisissez un dossier dans lequel mettre votre projet." }, function (f) {
            if (f == undefined) {
                return;
            }
            $('#dir_name').get(0).value = f[0];
        });
    });
    $("#open_from_explorer").click(() => {
        dialog.showOpenDialog({
            filters: [
                { name: "Fichiers SWeb", extensions: ["sweb"] }
            ], properties: ['openFile'], title: "Choisissez un dossier dans lequel mettre votre projet."
        }, function (f) {
            if (f == undefined) {
                return;
            }
            sab.loadProject(path.dirname(f[0]));
            view.hideStartScreen();
        });
    });
    $("#filter").get(0).oninput = function () {

        main.updateProps(global_el[0], global_el[1], this.value)

    }
    //$("#open_from_explorer").click(view.hideStartScreen);
    //$("#open_from_explorer").click()
});

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

String.prototype.find = function (regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    var value = regex.exec(this.substring(startpos || 0));

    try {
        return [(indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf, value[0], value[0].length];
    } catch (error) {
        return false;
    }
}

String.prototype.findStr = function (regex, startpos) {
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

var sweb = {
    manager: function (filename) {
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
        div.css("width", "calc(100% - 4px)")
        div.css('height', "calc(100% - 4px)")
        div.addClass('app-maker');

        div.get(0).setAttribute('data-name', real_file_name)
        div.get(0).ondrop = drop;
        div.get(0).ondragover = allowDrop;
        sweb.open(real_file_name, div.get(0));
        x_elements[real_file_name] = elements;
        elements = {};
        return div;
    },
    save: function (filename, el) {
        sab.writeFile(directory + "/project/content." + filename + "-content", JSON.stringify(sml.exportContent(el)));
        sab.writeFile(directory + "/project/" + filename, sml.export(el, true), "utf-8");
    },
    open: function (filename, el) {
        sml.parseAndBuild(fs.readFileSync(directory + "/project/" + filename, "utf-8"), $(el));
        var window_texts = fs.readFileSync(directory + "/project/content." + filename + "-content", "utf-8");
        window_texts = JSON.parse(window_texts);

        for (i = 0; i < Object.keys(window_texts).length; i++) {

            var key = Object.keys(window_texts)[i];

            $(el.querySelector("#" + key)).html(window_texts[key]);

        }

    }
}

var main = function () {
    this.updateProps = function (el, text, filter) {

        global_el = [el, text];

        var style = Object.keys(el.style)
        let i;

        $(".props").html('');

        let name = $(".props").child('p').html("<b>Nom : </b>" + el.id)

        let table = $(".props").child("table");

        let head = table.child("tr");
        head.child("th").html('Propriété');
        head.child("th").html('Valeur');

        if (text == true) {

            let tr = table.child("tr");
            let key_input = tr.child("td").child("input").get(0)
            key_input.value = "Texte";
            let input = tr.child("td").child("input").get(0);
            input.value = el.innerText;
            input.oninput = function () {
                el.innerText = this.value;
            }

        } else {
            //console.log(text)
        }

        for (i = 0; i < style.length; i++) {

            var key = style[i];
            var value = el.style[key];

            if ((isNaN(key) && filter == undefined) || (isNaN(key) && key.indexOf(filter) >= 0)) {
                let tr = table.child("tr");
                let key_input = tr.child("td").child("input").get(0)
                key_input.value = key;
                let input = tr.child("td").child("input").get(0);
                input.value = value;
                main.setUpdater(el, key, input);
            }


        }
    }

    this.setUpdater = function (e, k, i) {

        i.oninput = function () {
            e.style[k] = i.value;
            var parent = e.closest('.app-maker');
            var parent_name = parent.getAttribute('data-name');
            sweb.save(parent_name, parent);
        }

    }

    this.installTools = function () {
        this.run('npm install;pause;exit', false);
    }

    this.run = function (command, generate) {
        if(generate != false){
            this.buildToFolder();
        }
        let old = folder[0] + "";
        folder[0] = old + "/builds";
        let x = terminal();
        //console.log(x);
        x[0].css("height", "40px")
        x[1].fit();
        setTimeout(function () {
            x[2].write(command + ";exit\r")
        }, 1000)
        folder[0] = old;
    }

    this.buildToFolder = function () {

        this.saveAllOpened();

        var windows = fs.readdirSync(directory + '/project');
        var dir = fs.readdirSync(directory+ "/project/events/");
        for (let i = 0; i < windows.length; i++) {
            let window = windows[i];
            if (path.extname(window) == '.sml') {

                var window_name = path.basename(window, ".sml");

                console.log(window_name, "passed")

                var filename = directory + "/builds/src/" + window_name + ".html";

                let parsed = sml.parse(fs.readFileSync(directory + '/project/' + window, "utf8"));

                let html = "<style>" + parsed[0] + "</style>" + parsed[1];

                let app_name = JSON.parse(fs.readFileSync(directory + '/builds/package.json', "utf-8"))["name"];

                //console.log(html, app_name);

                //console.log(sml.addText(window_name));

                
                var x_dir = [];

                for (let i = 0; i < dir.length; i++) {
                    const dir_element = dir[i];
                    if(dir_element.indexOf(window) == 0){
                        x_dir.push(dir_element)
                    }
                }

                var content = fs.readFileSync(__dirname + "/../resources/base-app.html", "utf-8")
                content = content.replace("{ @@ app name @@ }", app_name)
                content = content.replace("{ @@ body @@ }",
                    html
                    + sml.addText(window_name)
                    + sml.buildJS(x_dir, directory + "/project/events/")
                );

                console.log("==> " + filename, content)

                sab.writeFile(filename, content);

            }
        }

    }

    this.saveAllOpened = function () {
        var ktabs = Object.keys(tabs);
        for (let i = 0; i < ktabs.length; i++) {
            let e = tabs[ktabs[i]];
            let id = e.id;
            let textarea = $('#' + e.id + ' .code-editor');
            if (textarea.node.length == 1) {
                let written = fs.writeFileSync(e.title, textarea.get(0).value, "utf8");
                //console.log(written)
            }
        }
    }

    return this;
}();

function updateTerms() {
    //do nothing
}