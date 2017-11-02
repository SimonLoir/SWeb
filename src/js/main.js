const {dialog} = require("electron").remote;
const fs = require("fs");
const os = require('os')
var main = new main();
var terminal_last_id = 0;
var terms = {};
var project_dir = "";
folder = [project_dir]
var terminal = require(__dirname + "/../js/terminal").newTerminal;
var sml = require(__dirname + "/../js/sml").init();
function main(){
    
    this.createProject = function (dir){
        console.log(dir)
        mkdir(dir + "/releases");
        mkdir(dir + "/builds");
        mkdir(dir + "/builds/src");
        mkdir(dir + "/project");
        writeFile(dir + "/builds/main.js", fs.readFileSync(__dirname + "/../resources/base-app.js", "utf-8"));
        writeFile(dir + "/builds/package.json", fs.readFileSync(__dirname + "/../resources/base-app-packager.json", "utf-8"));
        writeFile(dir + "/builds/src/index.html", fs.readFileSync(__dirname + "/../resources/base-app.html", "utf-8"));
    }
    
    this.buildToFolder = function () {
        
        let parsed = sml.parse(sml.export($(".draw-area").get(0), true));
        
        let html = "<style>" + parsed[0] + "</style>" + parsed[1];
        
        writeFile(folder[0] + "/builds/src/index.html", fs.readFileSync(__dirname + "/../resources/base-app.html", "utf-8").replace("{ @@ body @@ }", html));
        
    }
    
    return this;
}

function writeFile(filename, data){
    fs.writeFileSync(filename, data, "utf-8");
}

function mkdir(dirname){
    if(fs.existsSync(dirname) != true){
        fs.mkdirSync(dirname);
    }
}