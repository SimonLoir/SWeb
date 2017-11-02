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
});