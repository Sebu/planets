


/**
 * @constructor
 * @extends BaseView
 */
SunView = function() {
};

SunView.prototype = new BaseView;
SunView.prototype.constructor = SunView;


        
SunView.prototype.setupSliders = function(model, camera) {
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


/**
 keep order!
*/
SunView.prototype.updateList = [
    'days',
    'equationOfTime',
    'latitude',
    'longitude',
    'longitudeSpeed',
    'meanLongitude',
    'sunDaysPerYear',
    'sunAngle'
];

SunView.prototype.longitude = function(model) {
        return model.planet.longitude.toFixed(6);
};

SunView.prototype.longitudeSpeed = function(model) {
        return model.planet.longitudeSpeed.toFixed(11);
};
    
SunView.prototype.latitude = function(model) {
        return model.planet.latitude.toFixed(3);
};


