


// see libs/origami.js for Ori namespace
myApp = function(params) {
    Ori.App.call(this);
    this.init(params);
};
myApp.prototype = new Ori.App;
myApp.prototype.constructor = myApp;


myApp.prototype.init = function(params) {
        // create models
        models = {}; //new Object;
        // set start model
        model = this.getModel("Model4");
        this.loadPreset("Mercury1");

    };



myApp.prototype.updateInfoBox = function() {
        if(model.sun.getEnabled()) $("#sunAngle").text( model.planet.sunAngle.toFixed(1) );
        $("#days").text( Utils.daysToTime(model.getDays()) );

        if(model instanceof ModelSun) {
          $("#longitude").text( model.planet.longitude.toFixed(6) );
          $("#meanLongitude").text( model.getMeanLongitude().toFixed(6) );
          $("#equationOfTime").text( model.getEquationOfTime().toFixed(6) );
          $("#longitudeSpeed").text(model.planet.longitudeSpeed.toFixed(11) );
          $("#latitude").text( model.planet.latitude.toFixed(3) );
        } else {
          $("#longitude").text( model.planet.longitude.toFixed(1) );
          $("#longitudeSpeed").text(model.planet.longitudeSpeed.toFixed(2) );
          $("#latitude").text( model.planet.latitude.toFixed(1) );
        }
        if(model instanceof ModelPtolemy || model instanceof ModelPtolemySun) {
          $("#deferentLongitude").text( ((model.sphere[2].getRotateAngle() + model.sphere[2].getOffsetRotateAngle()) % 360.0).toFixed(2) );
          $("#gregorianDate").text( Utils.dateToString(Utils.jdToGregorian(model.date)) );                           
          $("#julianDate").text( Utils.dateToString(Utils.jdToJulian(model.date)) );                           
          $("#egyptianDate").text( Utils.dateToStringEgypt(Utils.jdToEgyptian(model.date)) );                          
          planetLabel2.setPosition(model.realSun.mesh.getPosCanvas(this.camera, this.canvas));   
        }

        if(model instanceof ModelMoonCompare) {
          // infoBox data
          $("#sunAngle2").text( model.planet2.sunAngle.toFixed(1) );
          $("#longitude2").text( model.planet2.longitude.toFixed(1) );
          $("#longitudeSpeed2").text(model.planet2.longitudeSpeed.toFixed(2));
          $("#latitude2").text( model.planet2.latitude.toFixed(1) );
          $("#days2").text(Math.round( model.getDays() ));

          planetLabel2.setPosition(model.planet2.mesh.getPosCanvas(this.camera, this.canvas));
        }
}
// update loop
myApp.prototype.update = function(time) {

        model.update(time);
    };


myApp.prototype.draw = function(time) {
    };



//TODO: shorten like eval(name + "()");
myApp.prototype.getModel = function(name) {
  var mod = models[name];
  if(!mod) {
      switch(name) {
        case "Model4":
        models[name] = new Model4({renderer: this});
        break;
      case "ModelMoonCompare":
        models[name] = new ModelMoonCompare({renderer: this});
        break;
     case "ModelSun":
        models[name] = new ModelSun({renderer: this});
        break;
      case "ModelSimple":
        models[name] = new ModelSimple({renderer: this});
        break;
      case "ModelHippo":
        models["ModelHippo"] = new ModelHippo({renderer: this});
        break;
      case "ModelYavetz":
        models["ModelYavetz"] = new ModelYavetz({renderer: this});
        break;
      case "Model5":
        models[name] = new Model5({renderer: this});
        break;
      case "ModelMoon":
        models[name] = new ModelMoon({renderer: this});
        break;
      case "ModelAristotle":
        models[name] = new ModelAristotle({renderer: this});
        break;
      case "ModelPtolemy":
        models[name] = new ModelPtolemy({renderer: this});
        break;        
      case "ModelPtolemySun":
        models[name] = new ModelPtolemySun({renderer: this});
        break;  
      default:
      break;
      };

    mod = models[name];
  };
  return mod;
};


//TODO: move to ui specific stuff
// change planet model and create the UI ELEMENTS + add to DOM
myApp.prototype.loadPreset = function(preset) {

        // switch model
        this.currentPreset = preset;
        var planet = planetPresets[preset];
        model = this.getModel(planet.model);
        this.setCurrentScene(model.root);
        model.loadPreset(planet);

    };
    



// setup site
// TODO: maybe move to index.html
app = new myApp({domRoot: $("#mainBox")});
window.onresize = function(e) { app.resize(e) };
app.run();


