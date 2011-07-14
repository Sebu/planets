


// see libs/origami.js for Ori namespace
myApp = function(params) {
    Ori.App.call(this);
    this.init(params);
};
myApp.prototype = new Ori.App;
myApp.prototype.constructor = myApp;


myApp.prototype.init = function(params) {

        this.scenes = [];
        // create models
        models = {}; //new Object;


        for(var n in TestPairs) {
          this.loadPreset(n);
          var tests = TestPairs[n];
          var ul = $("#mainBox").append("<br>" + n + "<ul></ul>");
          for(var i in tests) { 

            model.setDate(tests[i].date);
            var longReal = Math.abs( model.planet.longitude-180 );
            var longRef =  Math.abs( Number(Utils.toDec( tests[i].longitude )) - 180 );
            console.log(model);
            ul.append("<li>" + ( longReal - longRef)  + "</li>");
            
          }
        }

    };



// update loop
myApp.prototype.update = function(time) {

//        model.update(time);
    };


myApp.prototype.draw = function(time) {
    };

myApp.prototype.newScene = function() {
        var scene = new THREE.Scene();
        scene.addLight(new THREE.AmbientLight(0xFFFFFF));
        this.scenes.push(scene);
        return scene;
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
//        this.setCurrentScene(model.root);
        model.loadPreset(planet);

    };
    



// setup site
// TODO: maybe move to index.html
app = new myApp({domRoot: $("#mainBox")});
window.onresize = function(e) { app.resize(e) };
app.run();


