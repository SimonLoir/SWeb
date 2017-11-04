const {
    dialog
} = require("electron").remote;
const app = require('electron').remote;
const fs = require("fs");
const os = require('os')
var main = new main();
var terminal_last_id = 0;
var terms = {};
var project_dir = "";
folder = [project_dir]
var terminal = require(__dirname + "/../js/terminal").newTerminal;
var sml = require(__dirname + "/../js/sml").init();
var tabmanager = require(__dirname + "/../js/tabs");
var highlighting = require(__dirname + "/../js/highlighting").init();
var global_el;
const path = require("path")
var tabs = {};
id = 1;
function main() {

    this.createProject = function(dir) {

        try {
            mkdir(dir + "/releases");
            mkdir(dir + "/builds");
            mkdir(dir + "/builds/src");
            mkdir(dir + "/project");
            mkdir(dir + "/project/events");

            writeFile(dir + "/project/index.sml", "\n", "utf8")
            writeFile(dir + "/project/content.sml-content", "{}", "utf8")
            writeFile(dir + "/builds/main.js", fs.readFileSync(__dirname + "/../resources/base-app.js", "utf-8"));
            writeFile(dir + "/builds/package.json", fs.readFileSync(__dirname + "/../resources/base-app-packager.json", "utf-8"));
            writeFile(dir + "/builds/src/index.html", fs.readFileSync(__dirname + "/../resources/base-app.html", "utf-8"));
        } catch (e) {
            alert("Erreur lors de la création des dossiers : \n" + e);
        }

    }

    this.buildToFolder = function() {

        this.buildProject();

        console.log(fs.readdirSync(folder[0] + "/project/events/"));

        let parsed = sml.parse(sml.export($(".draw-area").get(0), true));

        let html = "<style>" + parsed[0] + "</style>" + parsed[1];

        writeFile(folder[0] + "/builds/src/index.html", fs.readFileSync(__dirname + "/../resources/base-app.html", "utf-8").replace("{ @@ body @@ }", html + sml.addText() + sml.buildJS(fs.readdirSync(folder[0] + "/project/events/"), folder[0] + "/project/events/")));

    }

    this.updateProps = function(el, text, filter) {

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
            input.oninput = function() {
                el.innerText = this.value;
            }

        } else {
            console.log(text)
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

    this.setUpdater = function(e, k, i) {

        i.oninput = function() {
            e.style[k] = i.value;
        }

    }

    this.runError = function() {
        alert("Une erreur est survenue lors de l'exécution d'electron.")
    }

    this.installError = function() {
        alert("Une erreur est survenue lors de l'installation d'electron.")
    }

    this.run = function(command, error) {
        this.buildToFolder()
        let old = folder[0] + "";
        folder[0] = old + "/builds";
        let x = terminal(error);
        x[0].css("height", "40px")
        x[1].fit();
        setTimeout(function() {
            x[2].write(command + ";exit\r")
        }, 1000)
        folder[0] = old;
    }

    this.buildProject = function() {

        writeFile(folder[0] + "/project/content.sml-content", JSON.stringify(sml.exportContent($(".draw-area").get(0))));
        console.log("e:saved")
        writeFile(folder[0] + "/project/index.sml", sml.export($(".draw-area").get(0), true), "utf-8")
    }

    this.loadEditor = function(el) {

        view.createEditor(el.id);

    }

    return this;
}

function writeFile(filename, data) {
    fs.writeFileSync(filename, data, "utf-8");
}

function mkdir(dirname) {
    if (fs.existsSync(dirname) != true) {
        fs.mkdirSync(dirname);
    }
    
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

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
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
