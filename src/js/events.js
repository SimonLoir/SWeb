$(document).ready(() =>{
    $('#create_empty_project').click(() => {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Choisissez un dossier dans lequel mettre votre projet."}, function (f) {
            if(f== undefined){
                return;
            }
            main.createProject(f[0]);
            view.setDirectory(f[0]);
            $('#install-tools').click();
            view.hideStartScreen();
        });
    });
    $('#open_from_explorer').click(() => {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Ouvrir un dossier"}, function (f) {
            if(f== undefined){
                return;
            }
            try {
                sml.parseAndBuild(fs.readFileSync(f[0] + "/project/index.sml", "utf-8"), $(".draw-area"));
                var project_text = JSON.parse(fs.readFileSync(f[0] + "/project/content.sml-content", "utf-8"));
                let i;
                for(i = 0; i < Object.keys(project_text).length; i++){
                    
                    var key =  Object.keys(project_text)[i]
                    $("#" + key).html(project_text[key]);
                    
                }
                
                view.setDirectory(f[0]);
                view.hideStartScreen();
            } catch (error) {
                alert("Ce dossier n'est pas un projet sweb valide.");
            }
        });
    });
    
    $(".cross-quit").click(() => {
         var window = app.getCurrentWindow();
         window.close();
    });
    
    $("#filter").get(0).oninput = function () {
        
        main.updateProps(global_el[0], global_el[1], this.value)
        
    }
});