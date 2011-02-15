/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 13:53:01
 * some nice shortcuts for jQuery blocks to create a proto site
 */

var UI = {

    optionsFromHash : function(selector, hash) {
        for (i in hash)
            $(selector).append("<option value='" + i + "'>" + i + "</option>");
    },

    box : function(params) {
        var id = params.id;
        var text = params.text || params.id;
        return $("<div class='caption' id='cap" + id + "'" +
                "onclick='$(\".triangle\", this).toggle(); $(this).next().toggle(300);'>" +
                "<div class='triangle'><img src='textures/open.png'></div>" +
                "<div class='triangle' style='display:none' ><img src='textures/closed.png'></div>" +
                text + "</div><div id='" + id + "'></div>");
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
        
        return $("<input type=checkbox name='visMode' checked='true' onClick='"+model+"."+ id + "(this.checked)'>"+ text + "</input>");
    }
}



