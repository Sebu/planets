


/**
 * @constructor
 * @extends BaseView
 */
MoonView = function() {
    this.planetLabel2 = new UI.Label({text: APP_STRINGS.EN.MOON });
};

MoonView.prototype = new BaseView;
MoonView.prototype.constructor = MoonView;


        
MoonView.prototype.setupSliders = function(model, camera) {
            UI.box({id:"moon_cycle" }).appendTo("#parameters");
            UI.slider({model: model, id:"MetonYear", "max":100, text:"Years"}).appendTo("#moon_cycle");
            UI.slider({model: model, id:"MetonSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon_cycle");
            UI.slider({model: model, id:"MetonDays", "max":30000, text:"days"}).appendTo("#moon_cycle");

            UI.box({id:"moon2", text:"Eclipse period"}).appendTo("#parameters");
            UI.slider({model: model, id:"SarosDraconiticMonths", "max":1000, text:"Draconitic months"}).appendTo("#moon2");
            UI.slider({model: model, id:"SarosSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon2");


            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

//            UI.slider({model: model, id:"Speed1", min: -6000, max:6000, text:"S 2 (zodiacal)"}).appendTo("#speed");
//           UI.slider({model: model, id:"Speed2", min: -6000, max:6000, text:"S 3 (synodic)"}).appendTo("#speed");
            UI.slider({model: model, id:"SunSpeed",  max:1100, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id: "rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION }).appendTo("#parameters");
            UI.slider({model: model, id:"RotateStart1", max: 360, step:0.05, text:"S 1"}).appendTo("#rotateStart");
           UI.slider({model: model, id:"RotateStart2", max: 360, step:0.05, text:"S 2"}).appendTo("#rotateStart");
           UI.slider({model: model, id:"RotateStart3", max: 360, step:0.05, text:"S 3"}).appendTo("#rotateStart");

            $("#moon input").change();

            if(model instanceof ModelMoonCompare) {
              UI.checkbox({model: model, id:"ShowPhase", text:"separated moons"}).appendTo("#vis");
              $("#infoContainer2").show();
            }

            $("#moonInfoContainer, #moon-select").show();

            // moon sliders setup
            // onchange of a moon parameter -> update model
            $("#MetonYear > input,#MetonSynodicMonths > input,#SarosDraconiticMonths > input, #SarosSynodicMonths > input,#MetonDays > input").change(function() {

//                $("#metonZodicalMonths").html(  app.model.getMetonZodicalMonths().toFixed());
//                $("#metonDaysPerYear").html(  app.model.getMetonDaysPerYear().toFixed(2));
//                $("#synodicDaysPerMonth").html(  app.model.getSynodicDaysPerMonth().toFixed(3));
//                $("#zodicalDaysPerMonth").html(  app.model.getZodicalDaysPerMonth().toFixed(3));
//                $("#draconiticDaysPerMonth").html(  app.model.getDraconiticDaysPerMonth().toFixed(3));
         
                $("#Speed1 > input").attr({"value":  app.model.moonSpeed1(app.model.draco, app.model.zodic) });
                $("#Speed2 > input").attr({"value":  app.model.moonSpeed2(app.model.draco, app.model.zodic) });

            });
            $("#MetonYear > input").change();
};


/**
 keep order!
*/
MoonView.prototype.updateList = [
    'sunAngle',
    'longitude',
    'longitudeSpeed',
    'latitude',
    'metonZodicalMonths',
    'metonDaysPerYear',
    'synodicDaysPerMonth',
    'zodicalDaysPerMonth',
    'draconiticDaysPerMonth',
    'days'
];



/**
 * @constructor
 * @extends MoonView
 */
MoonCompareView = function() {

};

MoonCompareView.prototype = new MoonView;
MoonCompareView.prototype.constructor = MoonCompareView;


MoonCompareView.prototype.cleanUp = function(model) {
    this.planetLabel2.remove();
},
  

MoonCompareView.prototype.updateOther = function(model, camera, canvas) {
    this.planetLabel2.setPosition(model.planet2.gfx.mesh.getPosCanvas(camera, canvas));
},    
  
 
MoonCompareView.prototype.setupSliders = function(model, camera) {
    MoonView.prototype.setupSliders.call(this, model, camera);
    this.planetLabel2 = new UI.Label({text: APP_STRINGS.EN.MOON });
};

/**
 keep order!
*/
MoonCompareView.prototype.updateList = [
    'sunAngle',
    'longitude',
    'longitudeSpeed',
    'latitude',
    'metonZodicalMonths',
    'metonDaysPerYear',
    'synodicDaysPerMonth',
    'zodicalDaysPerMonth',
    'draconiticDaysPerMonth',
    'days',
    'sunAngle2',
    'longitude2',
    'longitudeSpeed2',
    'latitude2',
    'days2'
];




