var view = new view_object();

function view_object() {

    this.hideStartScreen = function() {

        $('.startscreen').css('display', "none");
        $('.start').removeClass('start');

    }

    this.setDirectory = function (dir) {
        project_dir = dir;
        folder = [dir]
        $('#dir').html(dir);
    }

    return this;
}