/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 13:53:01
 * some nice shortcuts for jQuery blocks to create a proto site
 */


$(function(){
    // Check if browser supports <input type=range/>
    var i = document.createElement("input");
    i.setAttribute("type", "range");
    var rangeNotSupported = (i.type === "text");
    delete i;

    // If browser doesn't support <input type=range/>
    // then use jQuery UI to display them
    if(rangeNotSupported) {
        // loop through all <input type=range/>
        // on the page
        $("input[type=range]").each(function(){
            var range = $(this);
            
            // Create <div/> to hold jQuery UI Slider
            var sliderDiv = $("<div/>");
            sliderDiv.width(range.width());
            
            // Insert jQuery UI Slider where the
            // <input type=range/> is located
            range.after(
                sliderDiv.slider({
                    // Set values that are set declaratively
                    // in the <input type=range/> element
                    min: parseFloat(range.attr("min")),
                    max: parseFloat(range.attr("max")),
                    value: parseFloat(range.val()),
                    step: parseFloat(range.attr("step")),
                    // Update the <input type=range/> when
                    // value of slider changes
                    slide: function(evt, ui) {
                        range.val(ui.value);
                    },
                    change: function(evt, ui) {
                        // set <input type=range/> value
                        range.val(ui.value);
                    }
                })
            ).
            // Hide <input type=range/> from display
            hide();
        });
    }
});

var UI = {

    optionsFromHash : function(selector, hash) {
        for (i in hash)
            $(selector).append("<option value='" + i + "'>" + i + "</option>");
    },

    box : function(params) {
        var id = params.id;
        var text = params.text || params.id;
        return $("<div class='caption' id='cap" +id+ "'" +
                "onclick='$(\".triangle\", this).toggle(); $(this).next().toggle(300);'>" +
                "<span class='triangle'><img src='textures/open.png'></span>" +
                "<span class='triangle' style='display:none' ><img src='textures/closed.png'></span>" +
                text + "</div><div id='" + id + "'></div>");
    },

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

    slider : function(params) {
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
            "<input type='range' min="+min+" max="+max+" step="+step+"  value='"+ value +"' class='slider'  onchange='"+change+"'/>" +
            "<input type='text' min="+min+" max="+max+" step="+step+" value='" +value+ "' class='range' onchange='"+change+"'/>" +
            "</div>");
        return ele;
    },

    checkbox : function(params) {
        var model = params.model;
        var id = params.id;
        var text = params.text || params.id;
        
        return $("<input type=checkbox name='visMode' checked='true' onClick='"+model+".set"+ id + "(this.checked)'>"+ text + "</input>");
    }
}



