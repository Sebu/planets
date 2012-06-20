


/**
 * @constructor
 * @extends BaseView
 */
PtolemyView = function() {
};

PtolemyView.prototype = new BaseView;
PtolemyView.prototype.constructor = PtolemyView;


PtolemyView.prototype.cleanUp = function(model) {
    this.planetLabel2.remove();
},
  

PtolemyView.prototype.updateOther = function(model, camera, canvas) {
    this.planetLabel2.setPosition(model.realSun.gfx.mesh.getPosCanvas(camera, canvas));
},  
        
PtolemyView.prototype.setupSliders = function(model, camera) {
           camera.rotateY((Math.PI*3)/2 - 0.1);
           camera.rotateRight(Math.PI/2);
           
           this.planetLabel2 = new UI.Label({text: APP_STRINGS.EN.MOON });
           this.planetLabel2.setText("Sun");   

//*
           UI.box({id:"daily"}).appendTo("#parameters");
           UI.checkbox({model: model, id:"Speed1", text:"movement"}).appendTo("#daily");           

           UI.box({id:"ecliptic"}).appendTo("#parameters");
           UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "obliquity"}).appendTo("#ecliptic");
           
            UI.box({id:"apsidal"}).appendTo("#parameters");
            UI.slider({model: model.ptolemySphere, id: "ApsidalAngle", max: 360, step:0.1, text: "Angle"}).appendTo("#apsidal");
            UI.slider({model: model.ptolemySphere, id: "ApsidalSpeed", max: 100, step:0.05, text: "degrees per century"}).appendTo("#apsidal");

            UI.box({id:"deferent"}).appendTo("#parameters");
            UI.slider({model: model, id: "RadiusDeferent", max: 1000, step:0.05, text: "radius"}).appendTo("#deferent");
            UI.slider({model: model, id: "Equant", max: 30, step:0.05, text: "earth to deferent"}).appendTo("#deferent");            

            UI.box({id:"epicycle"}).appendTo("#parameters");
            UI.slider({model: model, id: "RadiusEpicycle", max: 1000, step:0.01, text: "radius"}).appendTo("#epicycle");


            $("#date-input").show();
//            UI.text({model: this.model, id:"Date"}).appendTo("#playback");

            $("#apsidal input, #deferent input, #epicycle input").change();    
};


/**
 keep order!
*/
PtolemyView.prototype.updateList = [
    'longitude',
    'longitudeSpeed',
    'latitude',
    'apsidalLongitude',
    'epicycleLongitude',
    'deferentLongitude',
    'gregorianDate',
    'julianDate',
    'egyptianDate',
    'egyptianEpoch'

];


PtolemyView.prototype.longitude = function(model) {
        return Utils.toSexa( mod(model.planet.longitude,360) ) ;
};

PtolemyView.prototype.latitude = function(model) {
        return Utils.toSexa( model.planet.latitude );
};

PtolemyView.prototype.apsidalLongitude = function(model) {
    return Utils.toSexa( mod(model.ptolemySphere.getApsidalAngle(), 360) );
};


PtolemyView.prototype.epicycleLongitude  = function(model) {
    return Utils.toSexa( mod(model.sphere[4].getRotateAngle(), 360) );
};

PtolemyView.prototype.deferentLongitude  = function(model) {
    return Utils.toSexa( model.planet.deferentLongitude );
};

PtolemyView.prototype.gregorianDate  = function(model) {
    return Utils.dateToString( Utils.jdToMagic(model.getDateValue()) );
};

PtolemyView.prototype.julianDate  = function(model) {
    return model.getDateValue().toFixed(2);
};

PtolemyView.prototype.egyptianDate = function(model) {
    return Utils.dateToStringEgypt( Utils.jdToEgyptian(model.getDateValue()) );
};


PtolemyView.prototype.egyptianEpoch = function(model) {
    return Utils.jdToEpoch(model.getDateValue());
};


/**
 * @constructor
 * @extends BaseView
 */
PtolemySunView = function() {
};

PtolemySunView.prototype = new PtolemyView;
PtolemySunView.prototype.constructor = PtolemySunView;

PtolemySunView.prototype.setupSliders = function(model, camera) {
           camera.rotateY((Math.PI*3)/2 - 0.1);
           camera.rotateRight(Math.PI/2);    

           this.planetLabel2 = new UI.Label({text: APP_STRINGS.EN.MOON });
           this.planetLabel2.setText("Sun");
           
           $("<div id='visSuns'></div>").appendTo("#visSpheres");
           UI.checkbox({model: model, id:"ShowSun1", text:"Sun1"}).appendTo("#visSuns");
           UI.checkbox({model: model, id:"ShowSun2", text:"Sun2"}).appendTo("#visSuns");
           
       
//*
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"apsidal", text:"Apsidal line"}).appendTo("#parameters");
            UI.slider({model: model.ptolemySphere, id: "ApsidalAngle", max: 360, step:0.01, text: "Angle"}).appendTo("#apsidal");
            UI.slider({model: model, id: "Equant", max: 30, step:0.05, text: "earth to deferent"}).appendTo("#apsidal");
            UI.slider({model: model.ptolemySphere, id: "ApsidalSpeed", max: 100, step:0.05, text: "degrees per century"}).appendTo("#apsidal");

            UI.box({id:"deferent", text:"Deferent"}).appendTo("#parameters");
            UI.slider({model: model, id:"RotateStart2", max: 360, step:0.05, text:"start"}).appendTo("#deferent");
            UI.slider({model: model, id:"Speed2", max:1100, text:"speed"}).appendTo("#deferent");
            UI.slider({model: model, id:"Speed3", min: -1100, max:1100, text:"speed"}).appendTo("#deferent");

            UI.checkbox({model: model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#deferent");

            $("#date-input").show();
//            UI.text({model: this.model, id:"Date"}).appendTo("#playback");
            $("#apsidal input, #deferent input").change();
};


