const {dialog} = require("electron").remote;
const fs = require("fs");
const os = require('os')
var main = new main();
var terminal_last_id = 0;
var terms = {};
var project_dir = "";
folder = [project_dir]
var terminal = require(__dirname + "/../js/terminal").newTerminal;
function main(){
    
    this.createProject = function (dir){
        mkdir(dir + "/releases");
        mkdir(dir + "/builds");
        mkdir(dir + "/builds/src");
        mkdir(dir + "/project");
        writeFile(dir + "/builds/main.js", fs.readFileSync(__dirname + "/../resources/base-app.js"));
        writeFile(dir + "/builds/package.json", fs.readFileSync(__dirname + "/../resources/base-app-packager.json"));
        writeFile(dir + "/builds/src/index.html", fs.readFileSync(__dirname + "/../resources/base-app.html"));
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