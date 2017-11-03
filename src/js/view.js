var view = new view_object();

var elements = {

}

function view_object() {

    this.hideStartScreen = function() {

        $('.startscreen').css('display', "none");
        $('.start').removeClass('start');

    }

    this.setDirectory = function(dir) {
        project_dir = dir;
        folder = [dir]
        $('#dir').html(dir);
    }

    this.createElement = function(data, x, y, el) {
        var e = $(el).child(data);
        e.css("position", "absolute");
        e.css("top", y + "px");
        e.css("left", x + "px");
        if (data == "div") {
            e.css("width", "200px");
            e.css("height", "200px");
            e.addClass("always-visible")
            e.get(0).ondragover = allowDrop;
        }

        if (elements[data] == undefined) {
            elements[data] = 0;
        } else {
            elements[data] = elements[data] + 1;
        }

        e.get(0).id = data + elements[data];

        addEditorFeatures(e.get(0))
    }

    return this;
}

function addEditorFeatures(e) {
    draggable(e);
    e.ondblclick = function(e) {
        if (e.toElement != this) {
            return;
        }
        main.loadEditor(this);
    }

    e.onclick = function(e) {
        if (e.toElement != this) {
            return;
        }
        main.updateProps(this);
    }
    return e;
}

function draggable(el) {
    var dragStartX, dragStartY;
    var objInitLeft, objInitTop;
    var inDrag = false;
    var dragTarget = el;
    dragTarget.addEventListener("mousedown", function(e) {
        if (e.toElement != dragTarget) {
            return false;
        }
        inDrag = true;
        objInitLeft = dragTarget.offsetLeft;
        objInitTop = dragTarget.offsetTop;
        dragStartX = e.pageX;
        dragStartY = e.pageY;
    });
    document.addEventListener("mousemove", function(e) {
        if (!inDrag) {
            return;
        }
        dragTarget.style.left = (objInitLeft + e.pageX - dragStartX) + "px";
        dragTarget.style.top = (objInitTop + e.pageY - dragStartY) + "px";
    });
    document.addEventListener("mouseup", function(e) {
        inDrag = false;
    });
}