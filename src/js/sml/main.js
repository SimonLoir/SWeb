exports.init = function() {

    this.parseAndBuild = function (text, parent) {

        let lines = text.split(/\r?\n/);
        let html_lines = [];

        for (a = 0; a < lines.length; a++) {

            let line = lines[a];

            if (line.indexOf("def ") == 0) {

                html_lines.push(line);

            } else if (line.indexOf("=") > 0) {
                /*let rule = line.split("=");

                if (rule[1].trim() != "" && rule[1].trim() != "undefined") {

                    style += rule[0].trim() + ":" + rule[1].trim().replace(";", "") + ";";

                }*/
            }

        }
        
        this.buildHTML(html_lines, parent);
        
        //console.log("e")
        
        let el = null;
        
        for (a = 0; a < lines.length; a++) {

            let line = lines[a];

            if (line.indexOf("def ") == 0) {
                
                
                el = parent.get(0).querySelector("#" + this.getId(line))
                //console.log(el, this.getId(line))


            } else if (line.indexOf("=") > 0) {
                let rule = line.split("=");

                if (rule[1].trim() != "" && rule[1].trim() != "undefined") {
                    
                    el.style[rule[0].trim()] = rule[1].trim().replace(";", "");

                }
            }

        }
    }
    
    this.getId = function ( line ){
        //console.log(line)
        line = line.replace("def ", "");
        //console.log(line)
        line = line.split(" ")[0];
        //console.log(line)
        line = line.split(">")[line.split(">").length - 1].trim();
        //console.log("l:" + line)
        return line;
    }
    
    this.parse = function(text) {

        let lines = text.split(/\r?\n/);
        let style = "";
        let html_lines = [];
        let n = 0;

        for (a = 0; a < lines.length; a++) {

            let line = lines[a];

            if (line.indexOf("def ") == 0) {
                n = n + 1;

                if (n != 1) {

                    style += "}";

                }

                style += "#" + line.replace("def ", "").replace(/\>/g, ">#").split("=")[0] + "{";
                html_lines.push(line);

            } else if (line.indexOf("=") > 0) {

                let rule = line.split("=");

                if (rule[1].trim() != "" && rule[1].trim() != "undefined") {

                    style += rule[0].trim() + ":" + rule[1].trim().replace(";", "") + ";";

                }

            }

        }
        style += "}"

        return [style, this.buildHTML(html_lines, $(document.body).child("div").addClass("parser-area"), true)];
    }

    this.buildHTML = function(array, html_area, remove) {
        
        elements = {};
        
        let html = "";

        for (i = 0; i < array.length; i++) {

            let line = array[i].replace(/\>/g, " ").split("=");

            line[0] = line[0].replace("def ", "").trim();

            if (line[1] == undefined) {

                line[1] = "div";

            } else {

                line[1] = line[1].trim();

            }

            let level = this.getLevel(line[0])

            if (level == 1) {

                var e = html_area;

            } else {
                
                if(remove){var e = $(".parser-area " + this.getElementPosition(line[0]));}else{
                var e = $(".draw-area " + this.getElementPosition(line[0]));}
                
            }

            //console.log(e)
            
            if(elements[line[1]] == undefined){
                elements[line[1]] = 0;
            }else{
                elements[line[1]] += 1;
            }
            
            addEditorFeatures(e.child(line[1]).addClass("always-visible").get(0)).id = line[0].split(" ")[line[0].split(" ").length - 1];
    
            
        }

        html = html_area.html();

        if(remove){html_area.remove()}

        return html;

    }

    this.getLevel = function(element_string) {

        return element_string.split(" ").length;

    }

    this.getElementPosition = function(element_string) {

        let path = element_string.split(" ");

        var real_path = "";

        for (x = 0; x < path.length - 1; x++) {

            real_path += "#" + path[x] + " ";

        }

        real_path = real_path.trim();

        //console.log("path : " + real_path)

        return real_path;

    }

    this.export = function(element, first) {

        var nodes = element.childNodes;
        var sml_content = "";
        let n;
        for (n = 0; n < nodes.length; n++) {

            if (nodes[n].nodeName.indexOf("#") == -1) {

                if (first == true) {
                    var e_name = nodes[n].id;
                } else {
                    var e_name = nodes[n].parentElement.id + ">" + nodes[n].id
                }

                sml_content += "def " + e_name + " = " + nodes[n].nodeName.toLowerCase() + "\n";
                sml_content += this.getStyle(nodes[n]) + "\n\n";
                sml_content += this.export(nodes[n]);
            }
        }

        return sml_content;
    }


    this.getStyle = function(element) {

        let i = 0;

        let style = Object.keys(element.style);

        let sml_style = "";

        for (i = 0; i < style.length; i++) {

            if (element.style[style[i]] != undefined && element.style[style[i]] != "") {
                sml_style += style[i] + "=" + element.style[style[i]] + "\n";
            }

        }

        return sml_style;
    }
    

    return this;
}