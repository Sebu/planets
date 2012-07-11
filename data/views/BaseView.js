

/**
 * 
 * @constructor
 * @returns instance of ModelBase :)
 */
BaseView = function() {
//    this.setupInfos();
};

BaseView.prototype = {
    
    constructor: BaseView,
    
    setupInfos : function() {
        this.domElements = { 
            // default
            days : document.getElementById("days"),
            sunAngle : document.getElementById("sunAngle"),            
            longitude : document.getElementById("longitude"),
            longitudeSpeed : document.getElementById("longitudeSpeed"),
            latitude : document.getElementById("latitude"),

            // compare
            days2 : document.getElementById("days2"),
            sunAngle2 : document.getElementById("sunAngle2"),            
            longitude2 : document.getElementById("longitude2"),
            longitudeSpeed2 : document.getElementById("longitudeSpeed2"),
            latitude2 : document.getElementById("latitude2"),
            
            // moon
            metonZodicalMonths : document.getElementById("metonZodicalMonths"),
            metonDaysPerYear : document.getElementById("metonDaysPerYear"),
            synodicDaysPerMonth : document.getElementById("synodicDaysPerMonth"),
            zodicalDaysPerMonth : document.getElementById("zodicalDaysPerMonth"),
            draconiticDaysPerMonth : document.getElementById("draconiticDaysPerMonth"),           
            
            // sun
            meanLongitude : document.getElementById("meanLongitude"),            
            equationOfTime : document.getElementById("equationOfTime"),            
            sunDaysPerYear : document.getElementById("sunDaysPerYear"),
            
            // ptolemy
            apsidalLongitude : document.getElementById("apsidalLongitude"),
            epicycleLongitude : document.getElementById("epicycleLongitude"),
            deferentLongitude : document.getElementById("deferentLongitude"),
            gregorianDate : document.getElementById("gregorianDate"),
            julianDate : document.getElementById("julianDate"),
            egyptianDate : document.getElementById("egyptianDate"),
            egyptianEpoch : document.getElementById("egyptianEpoch")
          };      
    
        var 
        i=0,
        key='',
        mapping=0;
        
        for(i=0; i<this.updateList.length; ++i) {
            key = this.updateList[i];
            if(this.domElements[key]) {
                $("#" + key + "").parent().show();

            }
//                UI.innerText(this.domElements[key], this[key](model) );
            
        }     
    },
    
    setPreset : function(model, pre) {
    
        // default planet settings
        var preset = {};
        
        $.extend(true, preset, defaultPreset.viewParams);
        // extend default settings  
        $.extend(true, preset, pre);
        
        if(model.setShowStars) model.setShowStars(preset.showStars);
        if(model.setShowPath) model.setShowPath(preset.showPath);
        if(model.setShowHippo) model.setShowHippo(preset.showHippo);
        if(model.sun) model.sun.setDist(preset.sunDist);
        if(model.sun) model.sun.setEnabled(preset.showSun);
//        this.sun.setGlow(this.state.showSun);
        model.planet.setShade(preset.color);
        // hide sun sphere / better never ever show aka don't generate
        model.ecliptic.setShow(false);   
        planetLabel.setText(preset.label);

    },
    
    setupSliders : function(model, camera) {
        
    },
    
    updateOther : function(model, camera, canvas) {
    },
    
    
    setVisibleSpheres : function(model, list) {
        var i=0;
        for(i=1; i<=model.sphere.length; ++i) {
            model["setShowSphere" + i](false); 
        }

        for(i=0; i<list.length; ++i) {
            model["setShowSphere" + list[i]](true); 
        }
    },


    
    updateInfos : function(model) {
        var 
        i=0,
        key='',
        mapping=0;
        
        for(i=0; i<this.updateList.length; ++i) {
            key = this.updateList[i];
            if(this[key])
                UI.innerText(this.domElements[key], this[key](model) );
            
        }    
    },
    
    exportCSV : function(model) {
        // TODO: generate data
        
        var 
        i=0,
        data="";

        for(i=0; i<this.updateList.length; ++i) {
            key = this.updateList[i];
   
            if(this[key]) {
                data += key + ";";
                data += this[key](model).toString();
                data += "\n";
            }
        }       
        downloadDataURI({
            filename: "test.csv", 
            data:   "data:application/csv;charset/=utf-8," + data    
        });
    },
    
    cleanUp : function() {},
    
    
    /**
     keep order!
    */
    updateList : [
    'sunAngle',
    'longitude',
    'longitudeSpeed',
    'latitude',
    'days'
    ],
    
    days : function(model) {
        return Utils.daysToTime( model.getDays() );
    },
    
    sunAngle : function(model) {
        if( model.sun.getEnabled() ) 
            return model.planet.sunAngle.toFixed(1);
        else return 0;            
    },
         
    longitude : function(model) { 
        return model.planet.longitude.toFixed(1); 
    },
    
    meanLongitude :function(model) {
        return model.getMeanLongitude().toFixed(6);
    },
    
    equationOfTime : function(model) {
        return model.getEquationOfTime().toFixed(6);
    },
    
    longitudeSpeed : function(model) {
        return model.planet.longitudeSpeed.toFixed(2);
    },
    
    latitude : function(model) {
        return model.planet.latitude.toFixed(1);
    },
    
    sunDaysPerYear : function(model) {
        return Utils.frac( model.getDaysPerYear() );
    },
    
    metonZodicalMonths : function(model) {
        return model.getMetonZodicalMonths().toFixed(); 
    },
    
    metonDaysPerYear : function(model) {
        return model.getMetonDaysPerYear().toFixed(2);
    },
          
    synodicDaysPerMonth : function(model) {
        return model.getSynodicDaysPerMonth().toFixed(3);
    },
    
    zodicalDaysPerMonth : function(model) {
        return model.getZodicalDaysPerMonth().toFixed(3);
    },
      
    draconiticDaysPerMonth : function(model) {
        return model.getDraconiticDaysPerMonth().toFixed(3);    
    },
    
    
    sunAngle2 : function(model) {
        return model.planet2.sunAngle.toFixed(1);
    }, 
    
    longitude2 : function(model) {
        return  model.planet2.longitude.toFixed(1);
    },
    
    longitudeSpeed2 : function(model) {
        return model.planet2.longitudeSpeed.toFixed(2);
    },
        
    latitude2 : function(model) {
        return model.planet2.latitude.toFixed(1);
    },
    
    days2 :function(model) {
        return Math.round( model.getDays() );
    }
    
};

Model4View = function() {
};
Model4View.prototype = new BaseView;
Model4View.prototype.constructor = Model4View;
Model4View.prototype.setupSliders = function(model, camera) {
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({ model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
//            color: model.sphere[2].gfx.color,
            
            
            UI.slider({ model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({ model: model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({ model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({ model: model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({ model: model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");
            UI.slider({ model: model, id:"SunSpeed",  max:1000, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id:"rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION }).appendTo("#parameters");
            UI.slider({model: model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
};


SimpleView = function() {
};
SimpleView.prototype = new BaseView;
SimpleView.prototype.constructor = SimpleView;
SimpleView.prototype.setupSliders = function(model, camera) {
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model: model, id:"Speed2",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
};

HippoView = function() {
};
HippoView.prototype = new BaseView;
HippoView.prototype.constructor = HippoView;
HippoView.prototype.setupSliders = function(model, camera) {
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 3"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle4", max: 360, step:0.05, text: "S 4"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model: model, id:"Speed2",  max:1100, text:"S 2"}).appendTo("#speed");
            UI.slider({model: model, id:"Speed3",  max:1100, text:"S 3"}).appendTo("#speed");
};

Model5View = function() {
};
Model5View.prototype = new BaseView;
Model5View.prototype.constructor = Model5View;
Model5View.prototype.setupSliders = function(model, camera) {
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle5", max: 360, step:0.05, text: "S 4-5 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model: model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model: model, id: "Alpha", max:1100}).appendTo("#speed");
            UI.slider({model: model, id: "Beta", max:1100}).appendTo("#speed");
            UI.slider({model: model, id: "Gamma", max:1100}).appendTo("#speed");

            UI.box({id:"rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION}).appendTo("#parameters");
            UI.slider({model: model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart5", max: 360, step:0.05, text:"S 5"}).appendTo("#rotateStart");
};


AristotleView = function() {
};
AristotleView.prototype = new BaseView;
AristotleView.prototype.constructor = AristotleView;
AristotleView.prototype.setupSliders = function(model, camera) {
            $("#visSpheres > *").remove();
            UI.checkbox({model: model, id:"ShowSphere1", text:"S1", color: rgbToCSS(config.colors["S1"]) }).appendTo("#visSpheres");
            UI.checkbox({model: model, id:"ShowSphere2", text:"S2", color: rgbToCSS(config.colors["S2"])}).appendTo("#visSpheres");
            UI.checkbox({model: model, id:"ShowSphere3", text:"S3", color: rgbToCSS(config.colors["S3"])}).appendTo("#visSpheres");
            UI.checkbox({model: model, id:"ShowSphere4", text:"S4", color: rgbToCSS(config.colors["S4"])}).appendTo("#visSpheres");
            $("<div id='visSpheres1'></div>").appendTo("#visSpheres");
            UI.checkbox({model: model, id:"ShowSphere18", text:"P18", color: rgbToCSS(config.colors["S1"]) }).appendTo("#visSpheres1");
            UI.checkbox({model: model, id:"ShowSphere27", text:"P27", color: rgbToCSS(config.colors["S2"])}).appendTo("#visSpheres1");
            UI.checkbox({model: model, id:"ShowSphere36", text:"P36", color: rgbToCSS(config.colors["S3"])}).appendTo("#visSpheres1");
            UI.checkbox({model: model, id:"ShowSphere45", text:"P45", color: rgbToCSS(config.colors["S4"])}).appendTo("#visSpheres1");
            $("<div id='visSpheres2'></div>").appendTo("#visSpheres");
            UI.checkbox({model: model, id:"ShowSphere8", text:"S8", color: rgbToCSS(config.colors["S1"]) }).appendTo("#visSpheres2");
            UI.checkbox({model: model, id:"ShowSphere7", text:"S7", color: rgbToCSS(config.colors["S2"])}).appendTo("#visSpheres2");
            UI.checkbox({model: model, id:"ShowSphere6", text:"S6", color: rgbToCSS(config.colors["S3"])}).appendTo("#visSpheres2");
            UI.checkbox({model: model, id:"ShowSphere5", text:"S5", color: rgbToCSS(config.colors["S4"])}).appendTo("#visSpheres2");

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            
            UI.slider({model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");

            UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");           
            UI.slider({model: model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model: model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.checkbox({model: model.sphere[2], id: "Moving", max:1100, text:"S 2"}).appendTo("#speed");
            UI.checkbox({model: model.sphere[3], id: "Moving", max:1100, text:"S 3"}).appendTo("#speed");
            UI.checkbox({model: model.sphere[4], id: "Moving", max:1100, text:"S 4"}).appendTo("#speed");
            UI.checkbox({model: model.sphere[5], id: "Moving", max:1100, text:"S 5"}).appendTo("#speed");
            UI.checkbox({model: model.sphere[6], id: "Moving", max:1100, text:"S 6"}).appendTo("#speed");
            UI.checkbox({model: model.sphere[7], id: "Moving", max:1100, text:"S 7"}).appendTo("#speed");
            UI.checkbox({model: model.sphere[8], id: "Moving", max:1100, text:"S 8"}).appendTo("#speed");


            UI.box({id:"rotateStart", text:APP_STRINGS.EN.ROTATION_START_CAPTION}).appendTo("#parameters");
            UI.slider({model: model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");

};

YavetzView = function() {
};
YavetzView.prototype = new BaseView;
YavetzView.prototype.constructor = YavetzView;
YavetzView.prototype.setupSliders = function(model, camera) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model: model, id: "Alpha", max: 360, step:0.05, text: "S 3-4"}).appendTo("#angle");
            UI.slider({model: model, id: "Beta", max: 360, step:0.05, text: "planet latitude"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model: model, id:"Speed2",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model: model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.box({id:"rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION }).appendTo("#parameters");
            UI.slider({model: model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
};

