/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 13:53:01
 * some nice shortcuts for jQuery blocks
 */

var UI = {

    optionsFromHash : function(selector, hash) {
        for (i in hash)
            $(selector).append("<option value='" + i + "'>" + i + "</option>");
    },

    box : function(id, text) {
        return $("<div class='caption'" +
                "onclick='$(\".triangle\", this).toggle(); $(this).next().toggle(0);'>" +
                " <img class='triangle' src='textures/open.png'>" +
                " <img class='triangle' style='display:none' src='textures/closed.png'>" +
                text + "</div><div id='" + id + "'></div>");
    },

    slider : function(params) {
        var model = params.model;
        var id = params.id;
        var text = params.text || params.id;
        var min = params.min || 0;
        var max = params.max || 100;
        var step = params.step || 1;

        ele =  $("<div id='" + id + "'>" +
            "<div>" + text + "</div>" +
            "<input type='range' min="+min+" max="+max+" step="+step+"  value='"+ window[model]["get"+id]() +"' class='slider'  onchange='"+model+".set"+id+"(Number(value)); $(\"#" + id + " > input\").attr(\"value\",Number(value));'/>" +
            "<input type='text' min="+min+" max="+max+" step="+step+" value='"+ window[model]["get"+id]() +"' class='range' onchange='"+model+".set"+id+"(Number(value)); $(\"#" + id + " > input\").attr(\"value\",Number(value));'/>" +
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



