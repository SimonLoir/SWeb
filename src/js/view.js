
var view = {
    hideStartScreen : () => {
        $('.startscreen').css('display', "none");
        $('.start').removeClass('start');
        $('.project_creation_tool').removeClass('visible');        
    },
    createElement:function(data, x, y, el) {
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

        var name = el.getAttribute('data-name');

        let elements = x_elements[name];

        if(elements == undefined){
            elements = {};
        }

        if (elements[data] == undefined) {
            elements[data] = 0;
        } else {
            elements[data] = elements[data] + 1;
        }

        e.get(0).id = data + elements[data];

        if (data == "span") {
            e.html('Some text here');
        } else if (data == "button") {
            e.html('Click me');
        }        
        x_elements[name] = elements;
        sweb.save(name, el);
        addEditorFeatures(e.get(0), false)
    }, createEditor : function (el) {
        
        let id = el.id;

        let file = directory + "/project/events/" + id + ".js";
        
        if(fs.existsSync(file)){
            
            //open the editor
            tabmanager.newTab(file);
            
            
        }else{
            let base_code = "";
            
            if(id.indexOf("button") == 0){
                base_code = id + ".onclick = function (event) {\n\n}";
            }else if(id.indexOf("input") == 0){
                base_code = id + ".oninput = function (event) {\n\n}\n";
                base_code += id + ".onkeypress = function (event) {\n\n}\n";
                base_code += id + ".onkeyup = function (event) {\n\n}\n";
                base_code += id + ".onkeydown = function (event) {\n\n}\n";
            }
                        
            sab.writeFile(file, "/* This is the js file of the element that has this id : " + id + ". To be organised, please only use this file for that specific element. (Press ESC to exit the editor)*/\n\n" + base_code)
            
            tabmanager.newTab(file);
        }
        
    }
}

function addEditorFeatures(e, remove) {
    draggable(e);
    e.ondblclick = function(e) {
        if (e.toElement != this) {
            return;
        }
        view.createEditor(this);
    }

    e.onclick = function(e) {
        
        if (e.toElement != this) {
            return;
        }
        console.log(remove)
        if (remove != true) {
            console.log(this.nodeName)
            if (this.nodeName == "BUTTON" || this.nodeName == "SPAN") {
                var text = true;
            } else {
                var text = false;
            }
        }else{
            text = false;
        }
        
        main.updateProps(this, text, $("#filter").get(0).value);
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