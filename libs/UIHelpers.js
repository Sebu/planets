
var UI = {

    optionsFromHash : function(selector, hash) {
        $(selector).children().remove();
        for (i in hash) {
            var caption = hash[i].caption || i;
            $(selector).append("<option value='" + i + "'>" + caption + "</option>");
        }
    },
//*
    box : function(params) {
        var id = params.id;
        var text = params.element || params.text || params.id;
        return $("<div class=menu><div class='caption' id='cap" +id+ "'>" +
                text + "</div><div class='boxContent' id='" + id + "'></div></div>");
    },
/*/
    box : function(params) {
        var id = params.id,
        text = params.element || params.text || params.id,
        ele =  $("<div ><div class='caption' id='cap" +id+ "'" +
                "onclick='$(\".triangle\", this).toggle(); $(this).next().slideToggle();'>" +
                "<span class='triangle arrow-down' title='hide' ></span>" +
                "<span class='triangle arrow-right' style='display:none' title='show'></span>" +
                "</div><div class='boxContent' id='" + id + "'></div></div>");
        $("#cap" + id,ele).append(text);
        
        return ele;
    },
//*/
    input : function(params) {
        var model = params.model;
        var id = params.id;
        var text = params.text || params.id;
        var min = params.min || 0;
        var max = params.max || 100;
        var step = params.step || 1;
        var value = params.value || window[model]["get"+id]();
        var change = params.change || model+ ".set"+id+"(Number(value)); $(\"#" + id + " > input\").attr(\"value\",Number(value));"

        ele =  $("<div id='" + id + "'>" +
            "<div>" + text + "</div>" +

            "<input type='text' min="+min+" max="+max+" step="+step+" value='" +value+ "' class='range' onchange='"+change+"'/>" +
            "</div>");
        return ele;
    },

    text : function(params) {
        var model = params.model;
        var id = params.id;
        var tooltip = params.tip || "";
        var text = params.text || params.id;
        var min = params.min || 0;
        var max = params.max || 100;
        var step = params.step || 1;
        var value = params.value ||  model["get"+id]();
        var change = params.change || function(e)  { if(e.keyCode == 13) model["set"+id](this.value); };

        ele =  $( "<input type='text' placeholder='date' value='" + value + "' class='text'/>" );
        $(ele).bind("keyup",change);
        return ele;
    },

    slider : function(params) {
        var instance = params.model,
        id = params.id,
        tooltip = params.tip || "",
        text = params.text || params.id,
        min = params.min || 0,
        max = params.max || 100,
        toggle = params.toggle || false,
        step = params.step || 1,
        color = {r:0.1, g:0.3, b:0.4};
        //style='background:" + rgbToCSS(color) + "'
        
        
        var value = params.value ||  instance["get"+id]();
//        console.log(instance.valueOf());
        var change = params.change || function(event, ui)  { instance["set"+id](Number(Utils.toDec(ui.value))); $("#" + id + " > input").attr("value",Number(Utils.toDec(ui.value))); };

        var change2 = params.change || function()  { instance["set"+id](Number(Utils.toDec(this.value))); $("#" + id + " > .slider").slider("value",Number(Utils.toDec(this.value))); };



        if(toggle)
          tmp =  $("<div><input type=checkbox checked>" + text + "</div>");
        else
          tmp =  $("<div class='sliderBox'>" + text + "</div>");
        ele = $("<div  id='" + id + "'>" + //title='" + tooltip + "'
            "<div class='slider'></div>" +
            "<input  type='text' min="+min+" max="+max+" step="+step+" value='" + value + "'  class='range'/>" +
            "</div>");
        tmp.append(ele);
        $(".slider",ele).slider({slide:change, range: "min", animate: "fast", max: max, min: min, step: step, value: value});
        $("input",ele).bind("change",change2);
//        $(".slider",ele).bind("slidechange",change);
//         if(tooltip!="") tmp.append("<div class='container tooltip'>" + tooltip + "</div>");
         if(toggle) $(":checkbox",tmp).bind("click", function() 
          { 
            $("#" + id + " > input").attr('disabled', !this.checked);
            if(!this.checked) instance["set"+id](0);
            else instance["set"+id]( $("#" + id + " > .slider").val() );  
          } );
        return tmp;
    },



    checkbox : function(params) {
        var model = params.model,
        id = params.id,
        text = params.text || params.id,
        color = params.color || "#FFF";
        value = model["get"+id]() ? "checked" : "";
        var change = params.change || function()  { model["set"+id](this.checked); };
        var tmp  = $("<span style='color:" + color + "'></span>");
        var ele = $("<input type=checkbox " + value +">" + text + "</input>");
        tmp.append(ele);
        ele.bind("click", change);
                
        return tmp;
    }
};

UI.Label = function(params) {

        this.ele = document.createElement("div"); // $("<div class='label' style='top:0px;left:0px;'>" +  params.text + "</div>");
        this.ele.setAttribute("class","label");
        document.body.appendChild(this.ele); // this.ele.appendTo("body");
        this.setPosition(params.pos || {x:0, y:0, z:-1});
        this.setText(params.text);
};

UI.Label.prototype.constructor = UI.Label;


UI.Label.prototype.setText = function(text) {
  this.ele.innerText = text;
};

UI.Label.prototype.setPosition = function(pos) {
  if(pos.z<0) { this.ele.style.display = "none"; return; }
  this.ele.style.display = "block";
  this.pos = pos;
  this.ele.style.left = pos.x + "px";
  this.ele.style.top = pos.y + "px";  
//  this.ele.css('top', pos.y);
};





