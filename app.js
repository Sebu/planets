


// see libs/origami.js for Ori namespace
myApp = function(params) {
    Ori.App.call(this);
    this.init(params);
};
myApp.prototype = new Ori.App;
myApp.prototype.constructor = myApp;

myApp.CANVAS_ERROR = $("<div id='canvasError'>Your browser does not seem to support <a href='http://en.wikipedia.org/wiki/Canvas_element'>Canvas</a> or <a href='http://en.wikipedia.org/wiki/Webgl'>WebGL</a>.<br/>Find out how to get it <a href='http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>here</a>.</div>");

myApp.prototype.init = function(params) {
        this.domRoot = params.domRoot;
        this.currentScene = null;
        this.scenes = [];

        // create canvas (WebGL if possible)
        this.canvas = new Ori.Canvas({clearAlpha: 1, antialias: true});
        this.canvas.setSize(window.innerWidth, window.innerHeight);
        // set clear color        
        if(this.canvas.type == "webgl") this.canvas.setClearColorHex( 0x070707 );
        
        // add Canvas DOM Element & or error box
        if(this.canvas) {
          this.domRoot.append(this.canvas.domElement);
        } else {
          this.domRoot.append(myApp.CANVAS_ERROR);
          return 0;
        }
        
        // track inputs
        Ori.input.trackMouseOn(this.canvas.domElement);
//        Ori.input.trackKeysOn(window);
        Ori.input.register(Ori.KEY.DOWN, "DOWN");
        Ori.input.register(Ori.KEY.UP, "UP");

        // setup camera
        // TODO : shorten
        this.cameras = { 
          Trackball: { 
            caption: "Global",
            instance: new THREE.BallCamera({ fov: 70, aspect: window.innerWidth / window.innerHeight, near: 0.1, far : 10000})
          },
          FPS: { 
            caption: "Local",
            instance: new THREE.FPSCamera({ fov: 70, aspect: window.innerWidth / window.innerHeight, near: 0.1, far : 10000})
          },
          TrackballIso: { 
            caption: "Isometric",
            instance: new THREE.BallCamera({ fov: 70, aspect: window.innerWidth / window.innerHeight, near: 0.1, far : 10000})
          }
        };
        this.cameras["Trackball"].instance.setEye({x: 0, y: 0, z: -17});
        this.cameras["TrackballIso"].instance.setEye({x: 0, y: 0, z: -10});
        var ortho = 70;
        this.cameras["TrackballIso"].instance.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - ortho, window.innerWidth / ortho, window.innerHeight / ortho, window.innerHeight / - ortho, - 10, 1000 );	
        this.cameras["FPS"].instance.setEye({x: 0, y: 0.5, z: 0});

        // set trackball as default
        this.currentCamera = this.cameras["Trackball"].instance;


        // SKY SPHERE
/*        
        this.skyCam = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        this.skyCam.init({ eye : { x: 0.0 , y: 0.0, z: -600.0 } });
        this.skyScene = new THREE.Scene();
				var mesh = new THREE.Mesh( new THREE.SphereGeometry( 700, 32, 16 ), new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('textures/starsmap.jpg') }) );
				mesh.flipSided = true;
				this.skyScene.addObject( mesh );
//*/	



        // DEBUG und stats.js
        debugBox = $("<div class='container' id='debugContainer'>\
                     <div class='sexa' id='sexaInput'><input  type='text' value=0></input></div>\
                     <div class='sexa wert' id='sexaResult'>0</div>\
                     </div>").appendTo(this.domRoot);        
        this.stats = new Stats();
        Ori.input.register(Ori.KEY.SCROLL, "DEBUG");
//        debugBox.append( this.stats.domElement );
        
		
        // create models
        this.models = {};
        // set start model
        model = this.getModel("Model4");


        // create labels
        equinoxLabel = new UI.Label({text: "Vernal Equinox"});
        npoleLabel = new UI.Label({text: "North pole"});
        spoleLabel = new UI.Label({text: "South pole"});
        northLabel = new UI.Label({text: "North"});
        southLabel = new UI.Label({text: "South"});
        eastLabel = new UI.Label({text: "East"});
        westLabel = new UI.Label({text: "West"});
        sunLabel = new UI.Label({text: "Sun"});
        planetLabel = new UI.Label({text: "Planet"});
        planetLabel2 = new UI.Label({text: "Moon"});

        // create some elements
        // TODO: more segmentation
        $("<div id='infoContainer'>\
            <table>\
              <thead><tr><td colspan=2 class=infoHeader>Planet</td></tr></thead>\
              <tr id='sunAngleBox'><td>angle planet/sun</td><td id='sunAngle'>0</td></tr>\
              <tr><td>longitude</td><td class=wert id='longitude'>0</td></tr>\
              <tr><td>longitude speed</td><td class=wert  id='longitudeSpeed'>0</span></tr>\
              <tr><td>latitude</td><td class=wert  id='latitude'>0</span></tr>\
              <tr><td>passed days</td><td  class=wert  id='days'>0</td></tr>\
              </table>\
            <table id='meanLongitudeBox' style='display:none'>\
              <tr><td>mean longitude</td><td class=wert  id='meanLongitude'>0</td></tr>\
              <tr><td>equation of time (hrs)</td><td class=wert id='equationOfTime'>0</td></tr>\
            </table>\
            <table id='infoContainer2' style='display:none'>\
              <thead><tr><td colspan=2 class=infoHeader>Planet 2</td></tr></thead>\
              <tr><td>angle planet/sun</td><td class=wert id='sunAngle2'>0</td></tr>\
              <tr><td>longitude</td><td class=wert id='longitude2'>0</td></tr>\
              <tr><td>longitude speed</td><td class=wert id='longitudeSpeed2'>0</td></tr>\
              <tr><td>latitude</td><td class=wert id='latitude2'>0</td></tr>\
              <tr><td>days</td><td class=wert id='days2'>0</td></tr>\
            </table>\
            <table id='sunInfoContainer' style='display:none'>\
              <tr><td>days per year</td><td class=wert id='sunDaysPerYear'>0</td></tr>\
            </table>\
            <table id='moonInfoContainer' style='display:none'>\
              <thead><tr><td colspan=2 class=infoHeader></td></tr></thead>\
              <tr><td>zodiacal months</td><td class=wert  id='metonZodicalMonths'>0</td></tr>\
              <tr><td>days/year</td><td class=wert id='metonDaysPerYear'>0</td></tr>\
              <tr><td>days/synodic month</td><td class=wert id='synodicDaysPerMonth'>0</td></tr>\
              <tr><td>days/zodical month</td><td class=wert id='zodicalDaysPerMonth'>0</td></tr>\
              <tr><td>days/draconitic month</td><td class=wert id='draconiticDaysPerMonth'>0</td></tr>\
            </table>\
            <table id='ptolemyInfoContainer' style='display:none'>\
              <thead><tr><td colspan=2 class=infoHeader></td></tr></thead>\
              <tr><td>apsidal</td><td class=wert id='apsidalLongitude'>0</td></tr>\
              <tr><td>epicycle</td><td class=wert id='epicycleLongitude'>0</td></tr>\
              <tr><td>longitude deferent</td><td class=wert id='deferentLongitude'>0</td></tr>\
              <tr><td>gregorian date</td><td class=wert id='gregorianDate'>0</td></tr>\
              <tr><td>julian days</td><td class=wert id='julianDate'>0</td></tr>\
              <tr><td>egyptian date</td><td class=wert id='egyptianDate'>0</td></tr>\
              <tr><td></td><td class=wert id='egyptianEpoch'></td></tr>\
            </table>\
            <div id='legendContainer'></div>\
             </div>").appendTo(this.domRoot);
             
          this.info = { 
            meanLongitude : document.getElementById("meanLongitude"),
            equationOfTime : document.getElementById("equationOfTime"),

            days : document.getElementById("days"),
            sunAngle : document.getElementById("sunAngle"),            
            longitude : document.getElementById("longitude"),
            longitudeSpeed : document.getElementById("longitudeSpeed"),
            latitude : document.getElementById("latitude"),

            days2 : document.getElementById("days2"),
            sunAngle2 : document.getElementById("sunAngle2"),            
            longitude2 : document.getElementById("longitude2"),
            longitudeSpeed2 : document.getElementById("longitudeSpeed2"),
            latitude2 : document.getElementById("latitude2"),
            
            apsidalLongitude : document.getElementById("apsidalLongitude"),
            epicycleLongitude : document.getElementById("epicycleLongitude"),
            deferentLongitude : document.getElementById("deferentLongitude"),
            gregorianDate : document.getElementById("gregorianDate"),
            julianDate : document.getElementById("julianDate"),
            egyptianDate : document.getElementById("egyptianDate"),
            egyptianEpoch : document.getElementById("egyptianEpoch")
          };  

        
        
//        legend = $("<div class='container' id='legendContainer'></div>").appendTo(this.domRoot);
          $("<div id='impressumContainer'><a>© 2011 Topoi</a> <a href>+henry mendell</a> <a href>+sebastian szczepanski</a></div>").appendTo(this.domRoot);

/*
          $("#sexaInput > input").bind("change", function() 
              { $("#sexaResult").text(Utils.sexagesimal(this.value)); });
//*/


        
        var uiBox = $("<div class='container' id='uiContainer'></div>").appendTo(this.domRoot);
        var presetsEle1 = $("<span><select class='chzn-select modelSelect' style='width:136px;' title='Planet presets' id='modelPreset' onchange='app.loadPlanets(this.options[this.selectedIndex].value);'>View</select></span>");
        this.presetsEle2 = $("<span><select class='chzn-select modelSelect' style='width:150px;' title='Planet presets' id='planetsPreset' onchange='app.loadPresets(this.options[this.selectedIndex].value);'>View</select></span>");
        this.presetsEle3 = $("<span><select class='chzn-select modelSelect' style='width:36px;' title='Planet presets' id='planetPreset' onchange='app.loadPreset(this.options[this.selectedIndex].value);'>View</select></span>");                
//        var vault = localStorage.getJson("customPresets") || {};
//        $.extend(true, planetPresets, vault);
        


        $("<div id=presetBox></div>").appendTo(uiBox);
        var presetBox = $("#presetBox");
        presetBox.append(presetsEle1); 
        presetBox.append("<div class='button' onclick='app.addPreset();'>+</div>");
        presetBox.append("<div class='button' onclick='app.removePreset();'>-</div>");
       
        presetBox.append(this.presetsEle2);
        presetBox.append(this.presetsEle3);        


        UI.optionsFromHash("#modelPreset", planetPresets);
        

        

        presetBox.append("<span><select class='chzn-select' title='Moon models' id='moonModel' onchange='model.setCurrentMoonModel(this.options[this.selectedIndex].value);model.reset();'></select></span>");
        UI.optionsFromHash("#moonModel", moonModels);

        uiBox.append("<div id='view'></div>");
        uiBox.append("<div id='parameters'></div>");
        uiBox.append("<div id='playback'></div>");
//DEAD?        $("#vis").hide();

        $("#modelPreset option[value='Eudoxus']").attr('selected',true);
        this.loadPlanets("Eudoxus");

//        uiBox.hover(function() { model.setRunning(false);}, function() {model.setRunning(true); } );

               

    };

myApp.prototype.loadPlanets = function(value) {
    this.currentModel = planetPresets[value];
    
    if(this.currentModel.model) {
      this.currentPlanet = planetPresets;
      this.presetsEle2.hide();
      this.presetsEle3.hide();      
      this.loadPreset(value);
      return;
    }
    
    UI.optionsFromHash("#planetsPreset", this.currentModel);
    this.presetsEle2.show();
    for(var i in this.currentModel) {
      if(i=="caption") continue;
      this.loadPresets(i);
      break;
    }
    
};

myApp.prototype.loadPresets = function(value) {
    this.currentPlanet = this.currentModel[value];

    if(this.currentPlanet.model) {
      this.currentPlanet = this.currentModel;
      this.presetsEle3.hide();
      this.loadPreset(value);
      return;
    }

    UI.optionsFromHash("#planetPreset", this.currentPlanet);
    this.presetsEle3.show();
    for(var i in this.currentPlanet) {
      if(i=="caption") continue;    
      this.loadPreset(i);
      break;
    }    
};

myApp.prototype.addPreset = function() {
    var vault = localStorage.getJson("customPresets") || {};
    var store = { model: model.name, writeable: true, sphere: [] };
    for(var i in model.sphere) {
      store.sphere[i] = { axisAngle: model.sphere[i].getAxisAngle(), speed: model.sphere[i].getSpeed(), rotateStart: model.sphere[i].getRotateStart()  };
    }
    var text = prompt('Please enter a name for the preset.', model.name + '1');
    if(text && (!vault[text] || confirm('Preset "' + text + '" already exists. Overwrite?'))) {
      vault[text] = store;
      localStorage.setJson("customPresets", vault);
      $.extend(true, planetPresets, vault);
      UI.optionsFromHash("#modelPreset", planetPresets);
      this.loadPreset(text); 
    }
};



myApp.prototype.removePreset = function() {
  var text = this.currentPreset;
  if(!planetPresets[text] || !planetPresets[text].writeable) { 
    alert('Preset "' + text + '" is locked.'); return;
  }
  var vault = localStorage.getJson("customPresets") || {};
  delete planetPresets[text];
  delete vault[text];
  localStorage.setJson("customPresets", vault);
  UI.optionsFromHash("#modelPreset", planetPresets);
  this.loadPreset("Mercury1");   
};


// get new scene ( one for each model )
myApp.prototype.newScene = function() {
        var scene = new THREE.Scene();
        scene.addLight(new THREE.AmbientLight(0xFFFFFF));
        this.scenes.push(scene);
        return scene;
    };

myApp.prototype.setCurrentScene = function(scene) {
        this.currentScene = scene;
};

myApp.prototype.updateInfoBox = function() {
//*
        if(model instanceof ModelSun) {
          this.info.longitude.innerHTML = model.planet.longitude.toFixed(6);
          this.info.meanLongitude.innerText = model.getMeanLongitude().toFixed(6);
          this.info.equationOfTime.innerText = model.getEquationOfTime().toFixed(6);
          this.info.longitudeSpeed.innerText = model.planet.longitudeSpeed.toFixed(11);
          this.info.latitude.innerText = model.planet.latitude.toFixed(3);
        } else {
          this.info.longitude.innerText = model.planet.longitude.toFixed(1);
          this.info.longitudeSpeed.innerText = model.planet.longitudeSpeed.toFixed(2);
          this.info.latitude.innerText = model.planet.latitude.toFixed(1);
        }
        if(model.ui == "ModelPtolemy" || model.ui == "ModelPtolemySun") {
          this.info.longitude.innerText = Utils.toSexa(mod(model.planet.longitude,360) );
          this.info.latitude.innerText = Utils.toSexa(model.planet.latitude );
          this.info.apsidalLongitude.innerText = Utils.toSexa( mod(model.ptolemySphere.getApsidalAngle(), 360) );
          this.info.epicycleLongitude.innerText = Utils.toSexa( mod(model.sphere[4].getRotateAngle(), 360) );
          this.info.deferentLongitude.innerText =  Utils.toSexa(model.planet.deferentLongitude);
          this.info.gregorianDate.innerText =  Utils.dateToString(Utils.jdToMagic(model.date));                           
          this.info.julianDate.innerText =  model.date.toFixed(2); //Utils.dateToString(Utils.jdToJulian(model.date));                           
          this.info.egyptianDate.innerText =  Utils.dateToStringEgypt(Utils.jdToEgyptian(model.date));
          this.info.egyptianEpoch.innerText =  Utils.jdToEpoch(model.date);                          
          planetLabel2.setPosition(model.realSun.mesh.getPosCanvas(this.currentCamera, this.canvas));   
        }

        if(model instanceof ModelMoonCompare) {
          // infoBox data
          this.info.sunAngle2.innerText =  model.planet2.sunAngle.toFixed(1);
          this.info.longitude2.innerText =  model.planet2.longitude.toFixed(1);
          this.info.longitudeSpeed2.innerText =  model.planet2.longitudeSpeed.toFixed(2);
          this.info.latitude2.innerText =  model.planet2.latitude.toFixed(1);
          this.info.days2.innerText =  Math.round( model.getDays() );

          planetLabel2.setPosition(model.planet2.mesh.getPosCanvas(this.currentCamera, this.canvas));
        }
       if(model.sun.getEnabled()) this.info.sunAngle.innerText = model.planet.sunAngle.toFixed(1);
       this.info.days.innerText = Utils.daysToTime(model.getDays());      
//*/  
}
// update loop
myApp.prototype.update = function(time) {

        if(Ori.input.isDown("DEBUG")) debugBox.toggle();

/*
        // handle input     
        if (Ori.input.isDown("LEFT")) this.currentCamera.translateNew(0.6, 0, 0);
        if (Ori.input.isDown("RIGHT")) this.currentCamera.translateNew(-0.6, 0, 0);
        if (Ori.input.isDown("DOWN")) this.currentCamera.translateNew(0, 0, -0.6);
        if (Ori.input.isDown("UP")) this.currentCamera.translateNew(0, 0, 0.6);
//*/
        
        if (Ori.input.mouse.wheel) this.currentCamera.mouseWheel(0.0, 0.0, Ori.input.mouse.z);

        if (Ori.input.mouse.b1) {
            var x = Ori.input.mouse.x;
            var y = Ori.input.mouse.y;
            var pitch = (y - Ori.input.drag.y) * 0.2 * time;
            var yaw = (x - Ori.input.drag.x) * -0.2 * time;
            this.currentCamera.mouseY(yaw);
            this.currentCamera.mouseX(pitch);
//            this.skyCam.rotateRight(pitch);
            Ori.input.drag.x = x;
            Ori.input.drag.y = y;
        }
        
        // update model
        model.update(time);
        this.updateInfoBox();
        this.updateLabels();
        
//        this.currentCamera.setTarget(model.planet.currentPos());
};



myApp.prototype.setCamera = function(cam) {

     
  
  this.currentCamera = this.cameras[cam].instance;
  switch(cam) {
    case "Trackball":
    case "TrackballIso":
      model.earth.setEnabled(true);
      model.earthPlane.setEnabled(false);       
      break;
    case "FPS":
      model.earth.setEnabled(false);
      model.earthPlane.setEnabled(true);          
  };
  
}

myApp.prototype.updateLabels = function() {
        northLabel.setPosition(model.north.getPosCanvas(this.currentCamera, this.canvas));
        southLabel.setPosition(model.south.getPosCanvas(this.currentCamera, this.canvas));
        eastLabel.setPosition(model.east.getPosCanvas(this.currentCamera, this.canvas));
        westLabel.setPosition(model.west.getPosCanvas(this.currentCamera, this.canvas));
        equinoxLabel.setPosition(model.sphere[1].gfx.markerball.getPosCanvas(this.currentCamera, this.canvas));
        npoleLabel.setPosition(model.sphere[1].gfx.npole.getPosCanvas(this.currentCamera, this.canvas));
        spoleLabel.setPosition(model.sphere[1].gfx.spole.getPosCanvas(this.currentCamera, this.canvas));
        sunLabel.setPosition(model.sun.mesh.getPosCanvas(this.currentCamera, this.canvas)); 
        planetLabel.setPosition(model.planet.mesh.getPosCanvas(this.currentCamera, this.canvas));
//        planetLabel2.setPosition(model.planet2.mesh.getPosCanvas(this.currentCamera, this.canvas));                
};



myApp.prototype.draw = function(time) {
        this.canvas.clear();
//        this.canvas.render(this.skyScene, this.skyCam);
        this.canvas.render(this.currentScene, this.currentCamera);
    };

myApp.prototype.resize = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.currentCamera.setAspect(width / height);
        this.canvas.setSize(width, height);
    };



//return model instance or generate one (sort of a factory)
myApp.prototype.getModel = function(name) {
  var mod = this.models[name];
  if(!mod) {
    this.models[name] = new window[name]({renderer: this});
    mod = this.models[name];
  };
  return mod;
};


//TODO: move to ui specific stuff
// change planet model and create the UI ELEMENTS + add to DOM
myApp.prototype.loadPreset = function(preset) {

        // switch model
        this.currentPreset = preset;
        var planet = this.currentPlanet[preset];
        model = this.getModel(planet.model);
        this.setCurrentScene(model.root);
        model.loadPreset(planet);
        planetLabel.setText(model.currentPlanet.label);

        this.setCamera("Trackball");
        this.currentCamera.reset();
        
        // build up ui
        $("#moonInfoContainer").fadeOut(500);
        $("#sunInfoContainer").fadeOut(500);

        $("#meanLongitudeBox").fadeOut(500);
        if(model instanceof ModelSun)  {
            $("#sunInfoContainer").fadeIn(500);
            $("#meanLongitudeBox").fadeIn(500);
        }      

        $("#ptolemyInfoContainer").fadeOut(500);
        if(model.ui == "ModelPtolemy" || model.ui == "ModelPtolemySun") 
            $("#ptolemyInfoContainer").fadeIn(500);

        $("#sunAngleBox").fadeOut(500);
        if (model.sun.getEnabled()) $("#sunAngleBox").fadeIn(500);
        
        $("#infoContainer2").fadeOut(500);


        $("#moonModel").fadeOut(500);

        // clear old ui elements
        $("#playback > *").remove();
        $("#view > *").remove();
        $("#parameters > *").remove();
        $("#legendContainer > *").remove();
        
        this.currentCamera.rotateY(Math.PI + 0.1);

        

/*
        for (i in model.sphere) {
            $("<div style='float:left; color:" + rgbToCSS(model.sphere[i].gfx.color) + "'> S" + (Number(i)) + " </div>").appendTo("#legendContainer");
        }
//*/


        // view sub box box 
        UI.box({id:"vis", text:"View"}).appendTo("#view");
        $("<span><select  style='width:85px;' class='chzn-select' title='current position' id='viewPresets' onchange='app.setCamera(this.value);'></select></span>").appendTo("#vis");
        UI.optionsFromHash("#viewPresets", this.cameras);
        $("<select style='width:105px;' title='latitude presets' id='longitudePresets' onchange='$(\"#AxisAngle1 > input\").attr(\"value\",latitudePresets[this.value]); $(\"#AxisAngle1 >input\").change();'></select>").appendTo("#vis");
        UI.optionsFromHash("#longitudePresets", latitudePresets);
        UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.01, text: "view latitude", tip: "change latitude"}).appendTo("#vis");
        UI.slider({model: this.currentCamera, id: "Fov", max: 160, step:1, tooltip: "field of view"}).appendTo("#vis");
        $("<div id='visSpheres'></div>").appendTo("#vis");
        for (i in model.sphere) {
            if(model["getShowSphere" + i])
              UI.checkbox({model:model, id:"ShowSphere" + i, text:"S" + (Number(i)), color:  rgbToCSS(model.sphere[i].gfx.color) }).appendTo("#visSpheres");
        }
        UI.checkbox({model:model, id:"ShowPath", text:"path"}).appendTo("#vis");
        UI.checkbox({model:model, id:"ShowHippo", text:"hippo"}).appendTo("#vis");
        UI.checkbox({model:model, id:"ShowStars", text:"stars"}).appendTo("#vis");


        // playback div       
        UI.box({id:"playbackBox", text:"Playback"}).appendTo("#playback");
        UI.slider({model: model, id: "AnimSpeed", min:-1000, max:20000, step: 0.1, text: "Animation Speed", tip:"duration of a year in seconds"}).appendTo("#playbackBox");
        $("#playbackBox").append("<div><div class='button' onclick='model.reset();' value='reset'>reset</div><div class='button' id='pauseButton' onclick='model.togglePause(); if(model.getRunning()) { $(\"#pauseButton\").text(\"pause\");} else {$(\"#pauseButton\").text(\"play\");} ' title='pause animation'>pause</div></div>");




        // create the right sliders for each model
        // TODO: tooltips and min/max values for each model and preset
        if (model instanceof ModelMoon || model instanceof ModelMoonCompare) {
            UI.box({id:"moon", text:"Moon year month day cycle"}).appendTo("#parameters");
            UI.slider({model:model, id:"MetonYear", "max":100, text:"Years"}).appendTo("#moon");
            UI.slider({model:model, id:"MetonSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon");
            UI.slider({model:model, id:"MetonDays", "max":30000, text:"days"}).appendTo("#moon");

            UI.box({id:"moon2", text:"Eclipse period"}).appendTo("#parameters");
            UI.slider({model:model, id:"SarosDraconiticMonths", "max":1000, text:"Draconitic months"}).appendTo("#moon2");
            UI.slider({model:model, id:"SarosSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon2");


            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model:model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

//            UI.slider({model:model, id:"Speed1", min: -6000, max:6000, text:"S 2 (zodiacal)"}).appendTo("#speed");
//           UI.slider({model:model, id:"Speed2", min: -6000, max:6000, text:"S 3 (synodic)"}).appendTo("#speed");
            UI.slider({model:model, id:"SunSpeed",  max:1100, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id: "rotateStart", text: "Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 1"}).appendTo("#rotateStart");
           UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 2"}).appendTo("#rotateStart");
           UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 3"}).appendTo("#rotateStart");

            $("#moon input").change();

            if(model instanceof ModelMoonCompare) {
              UI.checkbox({model:model, id:"ShowPhase", text:"separated moons"}).appendTo("#vis");
              $("#infoContainer2").fadeIn(500);
            }

            $("#moonInfoContainer,#moonModel").fadeIn(500);

            // moon sliders setup
            // onchange of a moon parameter -> update model
            $("#MetonYear > input,#MetonSynodicMonths > input,#SarosDraconiticMonths > input, #SarosSynodicMonths > input,#MetonDays > input").change(function() {

                $("#metonZodicalMonths").html(model.getMetonZodicalMonths().toFixed());
                $("#metonDaysPerYear").html(model.getMetonDaysPerYear().toFixed(2));
                $("#synodicDaysPerMonth").html(model.getSynodicDaysPerMonth().toFixed(3));
                $("#zodicalDaysPerMonth").html(model.getZodicalDaysPerMonth().toFixed(3));
                $("#draconiticDaysPerMonth").html(model.getDraconiticDaysPerMonth().toFixed(3));
                $("#Speed1 > input").attr({"value": model.moonSpeed1(model.draco, model.zodic) });
                $("#Speed2 > input").attr({"value": model.moonSpeed2(model.draco, model.zodic) });

            });
            $("#MetonYear > input").change();

        } else if (model.ui == "ModelYavetz") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "Alpha", max: 360, step:0.05}).appendTo("#angle");
            UI.slider({model:model, id: "Beta", max: 360, step:0.05}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model:model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model:model, id:"Speed2",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.box({id:"rotateStart", text: "Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");


        } else if (model.ui == "Model4") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({ model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
//            color: model.sphere[2].gfx.color,
            
            
            UI.slider({ model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({ model:model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model:model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({ model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({ model:model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({ model:model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");
            UI.slider({ model:model, id:"SunSpeed",  max:1000, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id:"rotateStart", text:"Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");

           
        } else if (model.ui == "ModelAristotle") {

            $("#visSpheres > *").remove();
            UI.checkbox({model:model, id:"ShowSphere1", text:"S1"}).appendTo("#visSpheres");
            UI.checkbox({model:model, id:"ShowSphere2", text:"S2"}).appendTo("#visSpheres");
            UI.checkbox({model:model, id:"ShowSphere3", text:"S3"}).appendTo("#visSpheres");
            UI.checkbox({model:model, id:"ShowSphere4", text:"S4"}).appendTo("#visSpheres");
            $("<div id='visSpheres1'></div>").appendTo("#visSpheres");
            UI.checkbox({model:model, id:"ShowSphere18", text:"P18"}).appendTo("#visSpheres1");
            UI.checkbox({model:model, id:"ShowSphere27", text:"P27"}).appendTo("#visSpheres1");
            UI.checkbox({model:model, id:"ShowSphere36", text:"P36"}).appendTo("#visSpheres1");
            UI.checkbox({model:model, id:"ShowSphere45", text:"P45"}).appendTo("#visSpheres1");
            $("<div id='visSpheres2'></div>").appendTo("#visSpheres");
            UI.checkbox({model:model, id:"ShowSphere8", text:"S8"}).appendTo("#visSpheres2");
            UI.checkbox({model:model, id:"ShowSphere7", text:"S7"}).appendTo("#visSpheres2");
            UI.checkbox({model:model, id:"ShowSphere6", text:"S6"}).appendTo("#visSpheres2");
            UI.checkbox({model:model, id:"ShowSphere5", text:"S5"}).appendTo("#visSpheres2");

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");

            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");           
            UI.slider({model:model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.checkbox({model:model.sphere[2], id: "Moving", max:1100, text:"S 2"}).appendTo("#speed");
            UI.checkbox({model:model.sphere[3], id: "Moving", max:1100, text:"S 3"}).appendTo("#speed");
            UI.checkbox({model:model.sphere[4], id: "Moving", max:1100, text:"S 4"}).appendTo("#speed");
            UI.checkbox({model:model.sphere[5], id: "Moving", max:1100, text:"S 5"}).appendTo("#speed");
            UI.checkbox({model:model.sphere[6], id: "Moving", max:1100, text:"S 6"}).appendTo("#speed");
            UI.checkbox({model:model.sphere[7], id: "Moving", max:1100, text:"S 7"}).appendTo("#speed");
            UI.checkbox({model:model.sphere[8], id: "Moving", max:1100, text:"S 8"}).appendTo("#speed");


            UI.box({id:"rotateStart", text:"Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");

        } else if (model.ui == "Model5") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle5", max: 360, step:0.05, text: "S 4-5 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model:model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model:model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Alpha", max:1100}).appendTo("#speed");
            UI.slider({model:model, id: "Beta", max:1100}).appendTo("#speed");
            UI.slider({model:model, id: "Gamma", max:1100}).appendTo("#speed");

            UI.box({id:"rotateStart", text:"Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart5", max: 360, step:0.05, text:"S 5"}).appendTo("#rotateStart");
            
            

        } else if (model.ui == "ModelSimple") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model:model, id:"Speed2",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");

       } else if (model.ui == "ModelPtolemy") {
           this.currentCamera.rotateY((Math.PI*3)/2 - 0.1);
           this.currentCamera.rotateRight(Math.PI/2);
           planetLabel2.setText("Sun");       

//*
           UI.box({id:"daily"}).appendTo("#parameters");
           UI.checkbox({model:model, id:"Speed1", text:"movement"}).appendTo("#daily");           

           UI.box({id:"ecliptic"}).appendTo("#parameters");
           UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "obliquity"}).appendTo("#ecliptic");
           
            UI.box({id:"apsidal"}).appendTo("#parameters");
            UI.slider({model:model.ptolemySphere, id: "ApsidalAngle", max: 360, step:0.01, text: "Angle"}).appendTo("#apsidal");
            UI.slider({model:model.ptolemySphere, id: "ApsidalSpeed", max: 100, step:0.05, text: "degrees per century"}).appendTo("#apsidal");

            UI.box({id:"deferent"}).appendTo("#parameters");
            UI.slider({model:model, id: "RadiusDeferent", max: 1000, step:0.05, text: "radius"}).appendTo("#deferent");
            UI.slider({model:model, id: "Equant", max: 30, step:0.05, text: "earth to deferent"}).appendTo("#deferent");            

            UI.box({id:"epicycle"}).appendTo("#parameters");
            UI.slider({model:model, id: "RadiusEpicycle", max: 1000, step:0.01, text: "radius"}).appendTo("#epicycle");



            UI.text({model:model, id:"Date"}).appendTo("#playbackBox");

            $("#apsidal input, #deferent input, #epicycle input").change();

       } else if (model.ui == "ModelPtolemySun") {

           $("<div id='visSuns'></div>").appendTo("#visSpheres");
           UI.checkbox({model:model, id:"ShowSun1", text:"Sun1"}).appendTo("#visSuns");
           UI.checkbox({model:model, id:"ShowSun2", text:"Sun2"}).appendTo("#visSuns");
           
           this.currentCamera.rotateY((Math.PI*3)/2 - 0.1);
           this.currentCamera.rotateRight(Math.PI/2);    
           planetLabel2.setText("Sun");       
   
//*
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"apsidal", text:"Apsidal line"}).appendTo("#parameters");
            UI.slider({model:model.ptolemySphere, id: "ApsidalAngle", max: 360, step:0.01, text: "Angle"}).appendTo("#apsidal");
            UI.slider({model:model, id: "Equant", max: 30, step:0.05, text: "earth to deferent"}).appendTo("#apsidal");
            UI.slider({model:model.ptolemySphere, id: "ApsidalSpeed", max: 100, step:0.05, text: "degrees per century"}).appendTo("#apsidal");

            UI.box({id:"deferent", text:"Deferent"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"start"}).appendTo("#deferent");
            UI.slider({model:model, id:"Speed2", max:1100, text:"speed"}).appendTo("#deferent");
            UI.slider({model:model, id:"Speed3", min: -1100, max:1100, text:"speed"}).appendTo("#deferent");

            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#deferent");
            UI.text({model:model, id:"Date"}).appendTo("#playbackBox");
            $("#apsidal input, #deferent input").change();
//*/            
        } else if (model.ui == "ModelHippo") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 3"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle4", max: 360, step:0.05, text: "S 4"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed2",  max:1100, text:"S 2"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed3",  max:1100, text:"S 3"}).appendTo("#speed");

        } else if (model instanceof  ModelSun) {


            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model:model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model:model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model:model, id:"Speed2",  max:1100, text:"S 2 (zodiacal) in days"}).appendTo("#speed");
            UI.slider({model:model, id: "SunYears", max:1100, text:"S 3 (synodic) in years"}).appendTo("#speed");
            
            $("#Speed1 > input, #SunYears > input").change(function() {
              $("#sunDaysPerYear").html(Utils.frac( model.getDaysPerYear() ));
            });
        }


        // initial update of sliders/state
        model.togglePause();
        $("#capvis,#caprotateStart, #pauseButton").click();
        $("#moon input, #angle  input, #speed  input").change();
        $("#AxisAngle1 input").change();
        
//        this.currentCamera.rotateTarget({x: 0, y: 0, z: 0});



    };
    



// setup site
// TODO: maybe move to index.html
app = new myApp({domRoot: $("#mainBox")});
if(app) {
  window.onresize = function(e) { app.resize(e) };
  app.run();
}


