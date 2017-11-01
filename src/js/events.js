$(document).ready(() =>{
    $('#create_empty_project').click(() => {
        dialog.showOpenDialog({properties: ['openDirectory'], title:"Choisissez un dossier dans lequel mettre votre projet."}, function (folder) {
            if(folder == undefined){
                return;
            }
            main.createProject(folder[0]);
            view.hideStartScreen();
            view.setDirectory(folder[0]);
        });
    });
    view.setDirectory('C:\\Users\\simon\\Documents\\sweb-app');
    main.createProject(folder[0]);
});