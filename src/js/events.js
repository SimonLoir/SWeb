$(document).ready(() =>{
    $('#create_empty_project').click(() => {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Choisissez un dossier dans lequel mettre votre projet."}, function (f) {
            if(f== undefined){
                return;
            }
            main.createProject(f[0]);
            view.hideStartScreen();
            view.setDirectory(f[0]);
        });
    });
    $('#open_from_explorer').click(() => {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Ouvrir un dossier"}, function (f) {
            if(f== undefined){
                return;
            }
            view.hideStartScreen();
            sml.parseAndBuild(fs.readFileSync(f[0] + "/project/index.sml", "utf-8"), $(".draw-area"));
            
            view.setDirectory(f[0]);
        });
    });
    
    $(".cross-quit").click(() => {
         var window = app.getCurrentWindow();
         window.close();
    });
});