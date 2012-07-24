


(function( $ ){


    $.widget( "ui.tooltip", {
        options: {
            dataSource : 0
        },  
		_create: function() {
           
                var
                ele = this.element = $(this.element),
                text = ele.attr('title');
                if(text) {
                    var
                    tooltip = this.tooltip = $("<div>")
                        .addClass( "tooltip" )
                        .text(text);


                    ele.mouseover( function() {
                        $(document).append(tooltip);
//                        tooltip.style.left = ele.offset().left;
//                        tooltip.style.top = ele.offset().top;                        
                        tooltip.show();
                    })
                    .mouseleave( function() {
//                        document.removeChild(tooltip[0]);
                        tooltip.hide();
                    })
                }



                return ele;	
		},

        setText : function(value) {
            this.text.text(value);
        },

        destroy: function() {
            this.text.remove();
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call( this );
        }
	});


    $.widget( "ui.selectBox", {
        options: {
            dataSource : 0
        },  
		_create: function() {
            
                var
                i=0,
                ele = this.element = $(this.element),
                select = ele.hide(),
                dataSource = this.option('dataSource'),
                selected = select.children( ":selected" ),
                data = 0,
                wrapper = this.wrapper = $("<span>")
                    .addClass( ele.attr('class').toString() )
                    .insertAfter( select ),
                text = this.text = $("<span>")
                    .appendTo( wrapper ),
                list = $("<ul>")
                    .appendTo( wrapper );


                if( dataSource ) {
                    data = dataSource[ ele.attr('name') ];
                    text.text(ele.text() || data[0][1]);
                } else {
                    text.text("");
                }

                wrapper.click( function() {
                    list.empty();

                    if(!dataSource) {
                        data = select.children( "option" ).map(function() {
                            return [[ $( this ).text(), $( this ).attr('value') ]];
                        });
                    }

                    for(i=0; i<data.length; ++i) {
                        var 
                        ul = $("<li>" + data[i][0].toString() + "</li>")
                            .attr('title', data[i][1])
                            .click( function() {
                                text.text(this.title);
                                $("option", select).attr('selected', false);
                                $("option[value='"+ this.title +"']", select).attr('selected',true);
                                select.change();
                            }); 
                        list.append(ul);

                    }
                    list.toggle();
                })
                .mouseleave( function() {
                    list.hide();
                })
			


                //return ele;	
		},

 
        setText : function(value) {
            this.text.text(value);
        },

        destroy: function() {
            this.text.remove();
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call( this );
        }
	});


    var topics = {};

    $.fn.Topic = function( id ) {
        var callbacks,
            topic = id && topics[ id ];
        if ( !topic ) {
            callbacks = jQuery.Callbacks();
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove
            };
            if ( id ) {
                topics[ id ] = topic;
            }
        }
        return topic;
    };

    $.fn.collapsible = function( options ) {


        return this.each(function() {        
            
            var
            span =  $("<span>")
                .addClass("ori-triangle ori-arrow-down ori-arrow-up")
                .appendTo(this);
                     
            $(this).click(function() {
                $(span).toggleClass('ori-arrow-up'); 
                $(this).next().slideToggle('fast'); 
                return false;
           });
        
        });  
    };
    
    $.fn.inputSlider = function( options ) {
        
        var settings = $.extend( {
          'location'         : 'top',
          'background-color' : 'blue'
        }, options);
            
        return this.each(function() {     
       
            var 
            ele = $(this),
            instance = options.object,
            prop = options.property,
            min = options.min || 0,
            max = options.max || 100,
            toggle = options.toggle || false,
            step = options.step  || 0.2,
            value = options.value ||  instance["get"+prop](),
            sliderElement = $("<div>")
               .addClass('slider'),
            inputElement = $("<input type='text' min="+min+" max="+max+" step="+step+" value='" + value + "'  class='range'/>"),
            changeSlider = options.change || function(event, ui)  { 
                instance["set"+prop](Number(Utils.toDec(ui.value))); 
                inputElement.attr("value", Utils.toDec(ui.value) );
            },
            changeInput = options.change || function()  { 
                instance["set"+prop](Number(Utils.toDec(this.value)));
                sliderElement.slider("value", Number(Utils.toDec(this.value)));
            };

            sliderElement.slider({
                slide: changeSlider,
                range: "min",
                animate: "fast",
                max: max,
                min: min,
                step: step,
                value: value,
                orientation: options.orientation || "horizontal"

            });
            inputElement.bind("change", changeInput);

            ele.append(sliderElement);
            ele.append(inputElement);                       
            
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
                         "onclick='$(\".ori-triangle\", this).toggleClass(\"ori-arrow-up\"); $(this).next().slideToggle(\"fast\");'>" +
                         "<span class='ori-triangle ori-arrow-down ori-arrow-up'></span>" +
                     "</div>" +
                     "<div class='side-box' id='" + id + "'></div>" +
                 "</div>"),
        capEle =  $("#cap" + id, ele);
        
        capEle.append(text);
//        UI.addTooltip(capEle, tooltip);
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

//    text : function(params) {
//        var 
//        instance = params.model,
//        id = params.id,
//        text = params.text || params.id,
//        value = params.value ||  instance["get"+id](),
//        change = params.change || function(e)  { if(e.keyCode == 13) instance["set"+id](this.value); },
//        element =  $( "<input type='text' placeholder='date' value='" + value + "' class='text tipable'/>" );
        
//        UI.addTooltip(element, params.tooltip);
//        $(element).bind("keyup",change);
//        return element;
//    },


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
        $(".slider",ele).slider({
            slide: changeSlider,
            range: "min",
            animate: "fast",
            max: max,
            min: min,
            step: step,
            value: value,
            orientation:  params.orientation || "horizontal"
        });
        $("input",ele).bind("change", changeInput);
//        UI.addTooltip(tmp,params.tooltip);

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
        element =  $("<div class='checkbox' style='color:" + color + "'>"  + text +  "</div>"),
        change = params.change || function()  { 
            $(this).toggleClass('checked'); 
            instance["set"+id]($(this).is(".checked"));
        };
        
        element.checked = true;
        if(value) element.toggleClass("checked");
        element.bind("click", change);
//        UI.addTooltip(element, params.tooltip);        
        return element;
    }
};

UI.Label = function(params) {
        this.domRoot = document.getElementById("canvas-main"); // params.domElement ||  .body;
        
        if(params.ele) {
            this.ele = params.ele[0];        
        } else {        
            this.ele = document.createElement("div"); 
            this.ele.setAttribute("class","ori-label");
            this.ele.setAttribute("unselectable","on");
            this.domRoot.appendChild(this.ele);
            this.setPosition(params.pos || {x:0, y:0, z:-1});
            this.style = this.ele.style;
            this.ele.innerHTML = " ";
            this.setText(params.text);
        }
};

UI.Label.prototype = {
  constructor : UI.Label,
  
  setText : function(text) {
      this.ele.firstChild.nodeValue = text;
  },
  
  remove : function() {
      this.domRoot.removeChild(this.ele);        
  },

  setPosition : function(pos) {
    
      if(pos.z<0) { 
        this.ele.style.display = "none"; 
        return; 
      }
      this.pos = pos;
      this.style.display = "block";
      this.style.left = pos.x + "px";
      this.style.top = pos.y + "px";  
  }
};





