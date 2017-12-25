exports.writeFile = (filename, data) => {
    fs.writeFileSync(filename, data, "utf-8");
}

exports.mkdir = (dirname) => {
    if (fs.existsSync(dirname) != true) {
        fs.mkdirSync(dirname);
    }
}

exports.initProject = (dir, appname, type)  => {
    let fs = require("fs");
    if(fs.existsSync(dir) == false){
        alert("Ce répertoire n'existe pas.");
        return false;
    }
    if(fs.readdirSync(dir).length != 0){
        alert("Le dossier de destination doit être vide");
        return false;
    }
    let sweb_config = {
        appname: appname,
        type:type
    };
    try {
        this.mkdir(dir + "/releases");
        this.mkdir(dir + "/builds");
        this.mkdir(dir + "/builds/src");
        this.mkdir(dir + "/project");
        this.mkdir(dir + "/project/events");
        
        this.writeFile(dir + ".scode.json", '{"project_type":"electron","launch_command" : "electron builds/."}');
        this.writeFile(dir + "/project/events/index.ready.js", '/* When index.html is ready */ \ndocument.addEventListener("DOMContentLoaded", function () {\n\t/* Some code here */\n\t//console.log("app is loaded")\n});');
        this.writeFile(dir + "/project/index.sml", "\n", "utf8");
        this.writeFile(dir + "/project.sweb", JSON.stringify(sweb_config) , "utf8");
        this.writeFile(dir + "/project/content.index.sml-content", "{}", "utf8");
        this.writeFile(dir + "/builds/main.js", fs.readFileSync(__dirname + "/../../resources/base-app.js", "utf-8"));
        this.writeFile(dir + "/builds/package.json", fs.readFileSync(__dirname + "/../../resources/base-app-packager.json", "utf-8").replace("app-name", appname));
        this.writeFile(dir + "/builds/src/index.html", fs.readFileSync(__dirname + "/../../resources/base-app.html", "utf-8"));
    } catch (e) {
        alert("Erreur lors de la création des dossiers : \n" + e);
        return false;
    }

    this.loadProject(dir);

    return true;
}

exports.loadProject = function (dirname){
    $('#dir').html(dirname);
    directory = dirname;
    folder[0] = directory;
    var windows = fs.readdirSync(dirname + '/project');
    for (let i = 0; i < windows.length; i++) {
        const window = windows[i];
        if(path.extname(window) == '.sml'){
            this.addToList(window, dirname);
        }
    }
}

exports.addToList = function (window, dirname) {
    $('#app_windows').child("p").html(window).click(function () {
        tabmanager.newTab(dirname + "/project/" + window)
    });
}