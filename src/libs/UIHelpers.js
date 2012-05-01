


(function( $ ){

    $.fn.uiBox = function( options ) {

        // Create some defaults, extending them with any options that were provided
        var settings = $.extend( {
          'location'         : 'top',
          'background-color' : 'blue'
        }, options);

        return this.each(function() {        

            var
            id = this.id,
            title = this.title,
            tooltip = APP_STRINGS.EN[id.toUpperCase() + "_TIP"],
            text = title || APP_STRINGS.EN[id.toUpperCase() + "_TEXT"] || params.id,
            header = $("<div  class='caption tipable'>" +
                             "<span class='ori-triangle ori-arrow-down' title='hide'></span>" +
                             "<span class='ori-triangle ori-arrow-right' title='show'></span>" +
                           title +
                         "</div>");
            $(this).before(header);
                     
            header.click(function() {$(".ori-triangle", this).toggle(); $(this).next().slideToggle(); } );
        
        });  
    };
    
    $.fn.uiSlider = function( options ) {
        return this.each(function() {     
       
            var 
            ele = $(this),
            id = this.id,
            instance = options.object,
            prop = options.prop,
            text = this.title || options.text || options.id,
            min = options.min || 0,
            max = options.max || 100,
            toggle = options.toggle || false,
            step = options.step  || 0.2,
            value = options.value ||  instance["get"+prop](),

            changeSlider = options.change || function(event, ui)  { 
                instance["set"+prop](Number(Utils.toDec(ui.value))); 
                $("#" + id + " > input").attr("value", Utils.toDec(ui.value) ); // Utils.decToBase(ui.value,60)
            },
            changeInput = options.change || function()  { 
              instance["set"+prop](Number(Utils.toDec(this.value)));
               $("#" + id + " > .slider").slider("value",Number(Utils.toDec(this.value)));
            };


//            tmp =  $("<div class='sliderBox tipable'>" + text + "</div>");
              
//            ele = $("<div id='" + id + "'>" + 
            ele.append(text);
            ele.append("<div class='slider'></div>" +
                "<input type='text' min="+min+" max="+max+" step="+step+" value='" + value + "'  class='range'/>");

            $(".slider",ele).slider({slide: changeSlider, range: "min", animate: "fast", max: max, min: min, step: step, value: value});
            $("input",ele).bind("change", changeInput);
            
        });     
    };
    
      
})( jQuery );


var UI = {
    innerText : function(element, value) { element.firstChild.nodeValue = value; },
    
    optionsFromHash : function(selector, hash) {
        $(selector).children().remove();
        for (i in hash) {
            if(i=="caption") continue;
            var caption = hash[i].caption || i;
            $(selector).append("<option value='" + i + "'>" + caption + "</option>");
        }
    },
    
    addTooltip : function(ele,tooltip) {
      if(tooltip) ele.append("<div class='ORItooltip'>" + tooltip + "</div>");
    },

    box : function(params) {
        var id = params.id,
        color = params.color || {r: 1, g: 1, b: 1},
        tooltip = params.tooltip || APP_STRINGS.EN[params.id.toUpperCase() + "_TIP"],
        text = params.element || params.text || APP_STRINGS.EN[params.id.toUpperCase() + "_TEXT"] || params.id,
        ele =  $("<div class='ORIbox'>" +
                     "<div  style='color: " + rgbToCSS(color) + ";' class='caption tipable' id='cap" +id+ "'" +
                         "onclick='$(\".ori-triangle\", this).toggle(); $(this).next().slideToggle();'>" +
                         "<span class='ori-triangle ori-arrow-down' title='hide'></span>" +
                         "<span class='ori-triangle ori-arrow-right' title='show'></span>" +
                     "</div>" +
                     "<div class='side-box' id='" + id + "'></div>" +
                 "</div>"),
        capEle =  $("#cap" + id, ele);
        
        capEle.append(text);
        UI.addTooltip(capEle, tooltip);
        return ele;
    },


    
    input : function(params) {
        var instance = params.model,
        id = params.id,
        text = params.text || params.id,
        min = params.min || 0,
        max = params.max || 100,
        step = params.step || 1,
        value = params.value || window[instance]["get"+id](),
        change = params.change || instance + ".set"+id+"(Number(value)); $(\"#" + id + " > input\").attr(\"value\",Number(value));",
        element =  $("<div id='" + id + "'>" +
            "<div>" + text + "</div>" +
            "<input type='text' min="+min+" max="+max+" step="+step+" value='" +value+ "' class='range' onchange='"+change+"'/>" +
            "</div>");
        return element;
    },

    text : function(params) {
        var instance = params.model,
        id = params.id,
        text = params.text || params.id,
        value = params.value ||  instance["get"+id](),
        change = params.change || function(e)  { if(e.keyCode == 13) instance["set"+id](this.value); },
        element =  $( "<input type='text' placeholder='date' value='" + value + "' class='text tipable'/>" );
        
        UI.addTooltip(element, params.tooltip);
        $(element).bind("keyup",change);
        return element;
    },


    slider : function(params) {
        var instance = params.model,
        id = params.id,
        text = params.text || params.id,
        min = params.min || 0,
        max = params.max || 100,
        toggle = params.toggle || false,
        step = params.step  || 0.2,
//        color = {r:0.1, g:0.3, b:0.4},
        value = params.value ||  instance["get"+id](),

        changeSlider = params.change || function(event, ui)  { 
            instance["set"+id](Number(Utils.toDec(ui.value))); 
            $("#" + id + " > input").attr("value", Utils.toDec(ui.value) ); // Utils.decToBase(ui.value,60)
        },
        changeInput = params.change || function()  { 
          instance["set"+id](Number(Utils.toDec(this.value)));
           $("#" + id + " > .slider").slider("value",Number(Utils.toDec(this.value)));
        };


//        if(toggle)
//          tmp =  $("<div><input type=checkbox checked>" + text + "</div>");
//        else
        tmp =  $("<div class='sliderBox tipable'>" + text + "</div>");
          
        ele = $("<div  id='" + id + "'>" + 
            "<div class='slider'></div>" +
            "<input type='text' min="+min+" max="+max+" step="+step+" value='" + value + "'  class='range'/>" +
            "</div>");
        tmp.append(ele);
        $(".slider",ele).slider({slide: changeSlider, range: "min", animate: "fast", max: max, min: min, step: step, value: value});
        $("input",ele).bind("change", changeInput);
        UI.addTooltip(tmp,params.tooltip);

//         if(toggle) $(":checkbox",tmp).bind("click", function() { 
//            $("#" + id + " > input").attr('disabled', !this.checked);
//            if(!this.checked) instance["set"+id](0);
//            else instance["set"+id]( $("#" + id + " > .slider").val() );  
//          } );

        return tmp;
    },


    checkbox : function(params) {
        var instance = params.model,
        id = params.id,
        text = params.text || params.id,
        color = params.color || "#FFF",
        value = instance["get"+id](),
        element =  $("<div class='ORIcheckbox tipable' style='font-weight:bold;color:" + color + "'>"  + text +  "</div>"),
        change = params.change || function()  { $(this).toggleClass('ORIchecked'); instance["set"+id]($(this).is(".ORIchecked")); };
        
        element.checked = true;
        if(value) element.toggleClass("ORIchecked");
        element.bind("click", change);
        UI.addTooltip(element, params.tooltip);        
        return element;
    }
};

UI.Label = function(params) {

        this.ele = document.createElement("div"); 
        this.ele.setAttribute("class","ORIlabel");
        this.ele.setAttribute("unselectable","on");
        document.body.appendChild(this.ele);
        this.setPosition(params.pos || {x:0, y:0, z:-1});
        this.ele.innerHTML = " ";
        this.setText(params.text);
};

UI.Label.prototype = {
  constructor : UI.Label,
  
  setText : function(text) {
      this.ele.firstChild.nodeValue = text;
  },

  setPosition : function(pos) {
      if(pos.z<0) { 
        this.ele.style.display = "none"; 
        return; 
      }
      this.ele.style.display = "block";
      this.pos = pos;
      this.ele.style.left = pos.x + "px";
      this.ele.style.top = pos.y + "px";  
  }
};





