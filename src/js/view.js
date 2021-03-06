var style_palette = {
    win10light : {
        button : [
            ["font-family", "Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif"],
            ["border","none"],
            ["padding", "22px"],
            ["padding-top", "10px"],
            ["padding-bottom", "10px"],
            ["font-size", "13px"],
            ["cursor","pointer"],
            ["background", "rgb(205,205,205)"],
            ["color","black"]
        ]
    },
    win10dark : {
        button : [
            ["font-family", "Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif"],
            ["border","none"],
            ["padding", "22px"],
            ["padding-top", "10px"],
            ["padding-bottom", "10px"],
            ["font-size", "13px"],
            ["cursor","pointer"],
            ["background", "rgb(50,50,50)"],
            ["color","white"]
        ]
    }
};

var view = {
    hideStartScreen : () => {
        $('.startscreen').css('display', "none");
        $('.start').removeClass('start');
        $('.project_creation_tool').removeClass('visible');        
    },
    createElement:function(data, x, y, el) {

        let split = data.split('/');

        data = split[0].trim();

        
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

        if(split[1] != undefined){
            let style = style_palette[split[1].trim()][data];
            console.log(style)
            for (let i = 0; i < style.length; i++) {
                const element = style[i];
                e.css(element[0], element[1]);
            }
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
    }, createEditor : function (el, name) {
        
        let id = el.id;

        let file = directory + "/project/events/" + name + "." + id + ".js";
        
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
        var parent = this.closest('.app-maker');
        var parent_name = parent.getAttribute('data-name');
        view.createEditor(this, parent_name);
    }

    e.onclick = function(e) {
        
        if (e.toElement != this) {
            return;
        }
        //console.log(remove)
        if (remove != true) {
            //console.log(this.nodeName)
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
        if(inDrag == true){
            try {
                var parent = dragTarget.closest('.app-maker');
                var parent_name = parent.getAttribute('data-name');
                sweb.save(parent_name, parent);
            } catch (error) {
            }
        }
        inDrag = false;
        
    });

}