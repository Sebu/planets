


/**
 * @constructor
 * @extends BaseView
 */
SunView = function() {
};

SunView.prototype = new BaseView;
SunView.prototype.constructor = SunView;
//SunView.prototype.name = "Model4";


SunView.prototype.setupSliders = function(model) {
        UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
        UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
        UI.slider({model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3"}).appendTo("#angle");
        UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//      UI.slider({model: this.model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
        UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");
        UI.slider({model: model, id:"Speed2",  max:1100, text:"S 2 (zodiacal) in days"}).appendTo("#speed");
        UI.slider({model: model, id: "SunYears", max:1100, text:"S 3 (synodic) in years"}).appendTo("#speed");
//            $("#Speed1 > input, #SunYears > input").change(function() {
//              $("#sunDaysPerYear").html(Utils.frac( app.model.getDaysPerYear() ));
//            });   
};

SunView.prototype.update = function(model) {
        UI.innerText(this.info.longitude, model.planet.longitude.toFixed(6) );
        UI.innerText(this.info.meanLongitude, model.getMeanLongitude().toFixed(6) );
        UI.innerText(this.info.equationOfTime, model.getEquationOfTime().toFixed(6) );
        UI.innerText(this.info.longitudeSpeed, model.planet.longitudeSpeed.toFixed(11) );
        UI.innerText(this.info.latitude, model.planet.latitude.toFixed(3) );
        UI.innerText(this.info.sunDaysPerYear, Utils.frac( model.getDaysPerYear() ) );
        UI.innerText(this.info.days, Utils.daysToTime(model.getDays()) );          
        if(model.sun.getEnabled()) 
            UI.innerText(this.info.sunAngle, model.planet.sunAngle.toFixed(1) );
};


