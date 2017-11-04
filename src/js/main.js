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
var global_el;

function main() {

    this.createProject = function(dir) {
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
    }

    this.buildToFolder = function() {

        this.buildProject();

        let parsed = sml.parse(sml.export($(".draw-area").get(0), true));

        let html = "<style>" + parsed[0] + "</style>" + parsed[1];

        writeFile(folder[0] + "/builds/src/index.html", fs.readFileSync(__dirname + "/../resources/base-app.html", "utf-8").replace("{ @@ body @@ }", html + sml.addText()));

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
            
        }else{console.log(text)}

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
    
    this.loadEditor = function (el) {
        
        if(el.nodeName == "BUTTON"){
            
            view.createEditor(el.id);
            
        }
        
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