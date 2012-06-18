

/**
 constructor of the Topoi Cosmology App
 setup canvas, input, camera, gui, models etc.
 @extends Ori.App
 @constructor
 @param params
 @param params.domRoot dom element to add the canvas to
*/
cosmoApp = function(params) {
        this.domRoot = params.domRoot;
        this.currentScene = null;
        this.models = {};
        
        // create canvas (WebGL if possible)
        this.canvas = new Ori.Canvas({forceCanvas: 0, clearAlpha: 0, antialias: 1});
        
        setupCommonGeomerty();
        
        this.splashStatus = $("#splash-status");

        // add Canvas DOM Element & or error box
        this.splashStatus.empty();
        if(this.canvas) {
          this.domRoot.append(this.canvas.domElement);
        } else {
          this.splashStatus.append(APP_STRINGS.EN.NO_HTML5);
          return;
        }

        this.setupCameras();
        this.setupInput();

        // setupPicking  for collision
        this.projector = new THREE.Projector();
        
        this.setupUI();
};
cosmoApp.prototype = new Ori.App;
cosmoApp.prototype.constructor = cosmoApp;


/**
 * 
 */
cosmoApp.prototype.setupUI = function() {
        // setupDebug
        // DEBUG und stats.js
        that = this;
        this.debugBox = $("<div class='container' id='debugContainer'>\
                     </div>").appendTo(this.domRoot);        
        this.stats = new Stats();
        Ori.input.register(Ori.KEY.SCROLL, "DEBUG");
        this.debugBox.append( this.stats.domElement );
        

        this.splashStatus.empty();
        this.splashStatus.append("setup default model...");

        
        // setupLabels
        this.splashStatus.empty();
        this.splashStatus.append("setup labels...");
        
        //TODO: move labels to html code (style / rename etc.)
        equinoxLabel = new UI.Label({text: APP_STRINGS.EN.VERNAL});
        npoleLabel = new UI.Label({text: APP_STRINGS.EN.NORTH_POLE });
        spoleLabel = new UI.Label({text: APP_STRINGS.EN.SOUTH_POLE});
        northLabel = new UI.Label({text: "North"});
        southLabel = new UI.Label({text: "South"});
        eastLabel = new UI.Label({text: "East"});
        westLabel = new UI.Label({text: "West"});
        sunLabel = new UI.Label({text: APP_STRINGS.EN.SUN });
        planetLabel = new UI.Label({text: APP_STRINGS.EN.PLANET });
        planetLabel2 = new UI.Label({text: APP_STRINGS.EN.MOON });

        // setupInfobox
        this.splashStatus.empty();
        this.splashStatus.append("setup infobox...");
        
        
        //TODO: generate?     
        this.info = { 
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

        
        this.splashStatus.empty();
        this.splashStatus.append("setup UI...");

       
        this.modelSelect = $("#model-select");
        this.planetSelect = $("#planet-select");
        this.presetSelect = $("#preset-select");                

        this.modelSelect.change(function() { app.loadModel(this.options[this.selectedIndex].value); });  
        this.planetSelect.change(function() { app.loadPlanet(this.options[this.selectedIndex].value); }); 
        this.presetSelect.change(function() { app.loadPreset(this.options[this.selectedIndex].value); }); 

        $("#moon-select").click(function() { app.model.setCurrentMoonModel(this.options[this.selectedIndex].value); app.model.reset(); } );  
        UI.optionsFromHash("#moon-select", moonModels);
          
        $("#add-preset").click(function() { app.addPreset(); } );  
        $("#remove-preset").click(function() { app.removePreset(); } ); 
      
        this.loadCustomPresets();
        
        $("#ui-container h3").collapsible();
        //$("#info-container h3").collapsible();
        
        $("#ui-container, #info-container").show();

//        $("#ui-container, #info-container").draggable({ snap: "#canvas-main", containment: "window"});


 
        $("#camera-select").change(function() { app.setCamera(this.value); } ); 


        $("#longitude-select").change(function() { 
            $("#AxisAngle1 > input")
                .attr("value",this.value)
                .change(); 
        }); 


        
        // load default model
        this.loadModel("Eudoxus");

       
        
       
        $("#reset-button").click(function() { 
            app.model.reset();
        });
        
        $("#pause-button").click(function() { 
            app.model.toggleRunning(); 
            if(app.model.getRunning()) { 
                $("#pause-button").text("pause");
            } else { 
                $("#pause-button").text("play");
            }
        }); 

        $("#screenshot-button").click(function() {
            app.canvas.render(app.currentScene, app.currentCamera);
            window.open(app.canvas.domElement.toDataURL("image/jpeg"));
        }); 
        
        $("#date-input").bind("keyup", function(e) { 
            if(e.keyCode == 13) 
                that.setDate(this.value); 
        });

        $("#parameters-hide-button").click(function() { 
             $("#content-scroll").toggleClass('hide');
             $("#ui-container").toggleClass('hide');
        });

        $("#info-button").click(function() { 
            $("#page").toggleClass('slide');
            $("#book").toggleClass('hide');
            $("#content-scroll").toggleClass('hide', !$("#page").hasClass('slide'));
            $("#ui-container").toggleClass('hide', !$("#page").hasClass('slide'));
            that.resize();
        });
        
        
        $("#rotate-left").click(function() {
            that.currentCamera.mouseY(0.05);
        });

        $("#rotate-right").click(function() {
            that.currentCamera.mouseY(-0.05);
        });
                
        $("#zoom-plus").click(function() { 
            that.setZ(that.getZ()+1);
            $("#zoom-slider").slider('value',that.getZ());
        });
        
        $("#zoom-minus").click(function() { 
            that.setZ(that.getZ()-1);
            $("#zoom-slider").slider('value',that.getZ());
        });
                
        $("#zoom-slider").slider({
                slide: function(event, ui) { that.setZ(ui.value); },
                value: -17,
                range: "min",
                animate: "fast",
                min:-60,
                max: 1,
                step:1,
                orientation: "vertical"
         });
//        UI.slider({model: this, id: "Z", min:-60, max: 1, step:1, text:"zoom level", tooltip: "set view distance"}).appendTo("#nav-container");
        
  
        
        // NO WEBGL error
        if(this.canvas.type==="canvas") {
          this.debugBox.show();
          this.splashStatus.empty();
          this.splashStatus.append(APP_STRINGS.EN.NO_WEBGL);
          this.splashStatus.append("<br><div class='button' onclick='$(\"#splash\").addClass(\"hide\");' value='ok'>CONITUNE</div>");
        } else                       
          $("#splash").addClass("hide");
}
/**
  setup input (mouse and keyboard)
  @function
*/
cosmoApp.prototype.setupInput = function() {
        this.splashStatus.empty();
        this.splashStatus.append("register input...");
        // track inputs
        Ori.input.trackMouseOn(this.canvas.domElement);
//        Ori.input.trackKeysOn(window);
        Ori.input.register(Ori.KEY.DOWN, "DOWN");
        Ori.input.register(Ori.KEY.UP, "UP");
}

/**
  setup Cameras ()
  @function
*/
cosmoApp.prototype.setupCameras = function() {
  this.splashStatus.empty();
  this.splashStatus.append("setup cameras...");
  // setup camera
  // TODO : shorten
  
  var cameraParams = { 
    fov: 70,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far : 10000
  };
  
  this.cameras = { 
    Trackball: { 
      caption: "Global",
      instance: new THREE.BallCamera(cameraParams)
    },
    FPS: { 
      caption: "Local",
      instance: new THREE.FPSCamera(cameraParams)
    },
    TrackballIso: { 
      caption: "Isometric",
      instance: new THREE.BallCamera(cameraParams)
    }
  };
  this.cameras["Trackball"].instance.setEye({x: 0, y: 0, z: -18});
  this.cameras["FPS"].instance.setEye({x: 0, y: 0.5, z: 0});
  this.cameras["TrackballIso"].instance.setEye({x: 0, y: 0, z: -10});
  var ortho = 70;
  this.cameras["TrackballIso"].instance.projectionMatrix.makeOrthographic( 
      window.innerWidth / - ortho,
      window.innerWidth / ortho,
      window.innerHeight / ortho,
      window.innerHeight / - ortho,
      -10,
      1000
   );	


  // set trackball as default camera
  this.setCamera("Trackball");
  this.resize();

}

cosmoApp.prototype.setDate = function(date) {
    this.model.setDate(date);
}

cosmoApp.prototype.loadModel = function(value) {
  $("#model-select option[value='"+value+"']").attr('selected',true);
  this.currentModel = planetPresets[value];
  
  if(this.currentModel.model) {
    this.currentPlanet = planetPresets;
    this.planetSelect.hide();
    this.presetSelect.hide();      
    this.loadPreset(value);
    return;
  }
  
  UI.optionsFromHash("#planet-select", this.currentModel);
  this.planetSelect.show();
  for(var i in this.currentModel) {
    if(i=="caption") continue;
    this.loadPlanet(i);
    break;
  }
    
};

cosmoApp.prototype.loadPlanet = function(value) {
  $("#planet-select option[value='"+value+"']").attr('selected',true);
  this.currentPlanet = this.currentModel[value];

  if(this.currentPlanet.model) {
    this.currentPlanet = this.currentModel;
    this.presetSelect.hide();
    this.loadPreset(value);
    return;
  }

  UI.optionsFromHash("#preset-select", this.currentPlanet);
  this.presetSelect.show();
  for(var i in this.currentPlanet) {
    if(i=="caption") continue;    
    this.loadPreset(i);
    break;
  }    
};

/** 
 * change planet model and create the UI ELEMENTS + add to DOM 
 * @param preset the preset to load
 */
cosmoApp.prototype.loadPreset = function(preset) {

  // switch model
  this.currentPreset = preset;
  var planet = this.currentPlanet[preset];
  this.model = this.getModel(planet.model);
  this.setCurrentScene(this.model.root);
  this.model.loadPreset(planet);
  planetLabel.setText(this.model.currentPlanet.label);
  
  // default camera
  this.setCamera("Trackball");
  this.currentCamera.reset();

  // update UI 
  this.updateUI();
};

/**
 * @function
 * @returns the vault of custom presets from browser localStorage
 */
cosmoApp.prototype.getVault = function() {
  // be able to update the format
  if(!localStorage["version"]) {
     localStorage['version'] = 1;
     localStorage["presetCount"] = 0;
     localStorage.setJson("customPresets", { custom: {} });
  }
  var vault = localStorage.getJson("customPresets");
  return vault;
};

/** 
 * add vault/custom data to UI presets list 
 * @function
 */
cosmoApp.prototype.loadCustomPresets = function() {
  var vault = this.getVault();
  vault.custom.caption = APP_STRINGS.EN.CUSTOM;
  if(localStorage["presetCount"] && localStorage["presetCount"]>0) $.extend(true, planetPresets, vault);
  UI.optionsFromHash("#model-select", planetPresets);
};


/** 
 * add a new custom preset to the vault 
 * @function
 */
cosmoApp.prototype.addPreset = function() {
    var vault = this.getVault();

    var text = prompt(APP_STRINGS.EN.CUSTOM_NEW, this.model.name + '1');
    if(text && (!vault.custom[text] || confirm('Preset "' + text + '" already exists. Overwrite?'))) {
      var store = this.model.getPreset(); //{ model: model.name, ui: model.ui, writeable: true, sphere: [] };
      store.caption = text;
      if(!vault.custom[text]) localStorage["presetCount"] = Number(localStorage["presetCount"]) + 1;      
      vault.custom[text] = store;
      localStorage.setJson("customPresets", vault);

      this.loadCustomPresets();
      this.loadModel("custom"); 
      this.loadPlanet(text);
    }
};


/** 
 * remove a custom preset from the vault 
 * @function
 */
cosmoApp.prototype.removePreset = function() {
  var text = this.currentPreset;
  if(!planetPresets.custom[text]) { 
    alert('Preset "' + text + '" is locked.'); return;
  }
  if(confirm('Delete preset "' + text + '"?')) {
    var vault = this.getVault();
    delete planetPresets.custom;
    delete vault.custom[text];
    localStorage["presetCount"] = Number(localStorage["presetCount"]) - 1;
    localStorage.setJson("customPresets", vault);
  
    this.loadCustomPresets();
    if(Number(localStorage["presetCount"])>0)   
      this.loadModel("custom"); 
    else {
      this.loadModel("Eudoxus");   
    }
  }
};



/**
 * set the current render root scene
 * @param scene the scene from the model to set
 */
cosmoApp.prototype.setCurrentScene = function(scene) {
        if(this.currentScene) {
            this.currentScene.remove( this.currentCamera );
        }
        this.currentScene = scene;
        this.currentScene.add( this.currentCamera );
};

/**
 * update the planet info box
 */
cosmoApp.prototype.updateInfoBox = function() {
//*
        //OPT: merge dom updates
        if(this.model.ui === "ModelSun") {
          UI.innerText(this.info.longitude, this.model.planet.longitude.toFixed(6) );
          UI.innerText(this.info.meanLongitude, this.model.getMeanLongitude().toFixed(6) );
          UI.innerText(this.info.equationOfTime, this.model.getEquationOfTime().toFixed(6) );
          UI.innerText(this.info.longitudeSpeed, this.model.planet.longitudeSpeed.toFixed(11) );
          UI.innerText(this.info.latitude, this.model.planet.latitude.toFixed(3) );
          UI.innerText(this.info.sunDaysPerYear, Utils.frac( this.model.getDaysPerYear() ) );
        } else {
          UI.innerText(this.info.longitude, this.model.planet.longitude.toFixed(1) );
          UI.innerText(this.info.longitudeSpeed, this.model.planet.longitudeSpeed.toFixed(2) );
          UI.innerText(this.info.latitude, this.model.planet.latitude.toFixed(1) );
        }
        if(this.model.ui === "ModelPtolemy" || this.model.ui === "ModelPtolemySun") {
          UI.innerText(this.info.longitude, Utils.toSexa(mod(this.model.planet.longitude,360) ) );
          UI.innerText(this.info.latitude, Utils.toSexa(this.model.planet.latitude ) );
          UI.innerText(this.info.apsidalLongitude, Utils.toSexa( mod(this.model.ptolemySphere.getApsidalAngle(), 360) ) );
          UI.innerText(this.info.epicycleLongitude, Utils.toSexa( mod(this.model.sphere[4].getRotateAngle(), 360) ) );
          UI.innerText(this.info.deferentLongitude, Utils.toSexa(this.model.planet.deferentLongitude) );
          UI.innerText(this.info.gregorianDate, Utils.dateToString(Utils.jdToMagic(this.model.date)) );                           
//          UI.innerText(this.info.julianDate, this.model.date.toFixed(2) );
          UI.innerText(this.info.egyptianDate, Utils.dateToStringEgypt(Utils.jdToEgyptian(this.model.date)) );
          UI.innerText(this.info.egyptianEpoch, Utils.jdToEpoch(this.model.date) ); 
                                   
          planetLabel2.setPosition(this.model.realSun.gfx.mesh.getPosCanvas(this.currentCamera, this.canvas));   
        }

        if(this.model.ui === "ModelMoon" || this.model.ui === "ModelMoonCompare") {
          UI.innerText(this.info.metonZodicalMonths, this.model.getMetonZodicalMonths().toFixed() ); 
          UI.innerText(this.info.metonDaysPerYear, this.model.getMetonDaysPerYear().toFixed(2) );
          UI.innerText(this.info.synodicDaysPerMonth, this.model.getSynodicDaysPerMonth().toFixed(3) );
          UI.innerText(this.info.zodicalDaysPerMonth, this.model.getZodicalDaysPerMonth().toFixed(3) );
          UI.innerText(this.info.draconiticDaysPerMonth, this.model.getDraconiticDaysPerMonth().toFixed(3) );
        }
        
        if(this.model.ui === "ModelMoonCompare") {
          // infoBox data
          UI.innerText(this.info.sunAngle2, this.model.planet2.sunAngle.toFixed(1) );
          UI.innerText(this.info.longitude2, this.model.planet2.longitude.toFixed(1) );
          UI.innerText(this.info.longitudeSpeed2, this.model.planet2.longitudeSpeed.toFixed(2) );
          UI.innerText(this.info.latitude2, this.model.planet2.latitude.toFixed(1) );
          UI.innerText(this.info.days2,  Math.round( this.model.getDays() ) );

          planetLabel2.setPosition(this.model.planet2.gfx.mesh.getPosCanvas(this.currentCamera, this.canvas));
        }
        
       if(this.model.sun.getEnabled()) 
         UI.innerText(this.info.sunAngle, this.model.planet.sunAngle.toFixed(1) );
         
       UI.innerText(this.info.days, Utils.daysToTime(this.model.getDays()) );      
//*/  
}

/** 
*  update loop
*  @override 
*/
cosmoApp.prototype.update = function(time) {

       
//        if(Ori.input.isDown("DEBUG")) debugBox.toggle();

        // zoom with middle button or wheel      
        if (Ori.input.mouse.b2) {
           var y = Ori.input.mouse.y;
           var pitch = (y - Ori.input.drag.y) * time;
           this.currentCamera.mouseWheel(0.0, 0.0, -pitch);
           Ori.input.drag.y = y;
        }
        if (Ori.input.mouse.wheel) {
         this.currentCamera.mouseWheel(0.0, 0.0, Ori.input.mouse.z);
         $("#zoom-slider").slider('value',that.getZ());
         //$("#Z > input").attr("value",Number( this.currentCamera.getZ() ));
        }

        // rotate with left button
        if (Ori.input.mouse.b1) {
            var x = Ori.input.mouse.x;
            var y = Ori.input.mouse.y;
            var pitch = (y - Ori.input.drag.y) * 0.2 * time;
            var yaw = (x - Ori.input.drag.x) * -0.2 * time;
            this.currentCamera.mouseY(yaw);
            this.currentCamera.mouseX(pitch);
            Ori.input.drag.x = x;
            Ori.input.drag.y = y;
        }
        
        // update model, info, labels
        this.model.update(time);
        
        //this.handlePicking(time);

       
        
};

/**
* check for collision/picking of pickable objects
* NOT USED YET
*/
cosmoApp.prototype.handlePicking = function(time) {
    
/* 
        this.currentCamera.update();
        var x = ( Ori.input.mouse.x / window.innerWidth ) * 2 - 1;
	      var y = -( Ori.input.mouse.y / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3( x, y, 0.5 );

        model.earth.mesh.currentPosFast();
        model.sun.mesh.currentPosFast();        
        model.planet.mesh.currentPosFast();

        vector = this.projector.unprojectVector( vector, this.currentCamera );
//        model.dline[0] = this.currentCamera.position;     
//        model.dline[1] = vector.clone();
//        model.dlineLine.setPos(model.dline);
        var ray = new THREE.Ray( this.currentCamera.position, vector.subSelf( this.currentCamera.position ).normalize() );
        var cs = ray.intersectScene(model.root)[0];
        if(cs) { cs.object.material.color.setHex( 0xaa0000 ); }
//*/ 
};


/**
 * sets the current camera select from this.cameras (trackball, isometric trackball, FPS)
 * @param cam the label of the camera to set 
 */
cosmoApp.prototype.setCamera = function(cam) {

  // fix some Three.js bogus  
  if(this.currentCamera && this.currentScene) 
    this.currentScene.remove(this.currentCamera);
  this.currentCamera = this.cameras[cam].instance;
  if(this.currentScene) this.currentScene.add(this.currentCamera);
  
  if(!this.model) return;
  switch(cam) {
    case "Trackball":
    case "TrackballIso":
      this.model.earth.setEnabled(true);
      this.model.earthPlane.setEnabled(false);       
      break;
    case "FPS":
      this.model.earth.setEnabled(false);
      this.model.earthPlane.setEnabled(true);          
  };
  
}

/** update the moving labels (north etc.)  */
cosmoApp.prototype.updateLabels = function() {
  //OPT: merge dom updates
  northLabel.setPosition( this.model.north.getPosCanvas(this.currentCamera, this.canvas) );
  southLabel.setPosition( this.model.south.getPosCanvas(this.currentCamera, this.canvas) );
  eastLabel.setPosition( this.model.east.getPosCanvas(this.currentCamera, this.canvas) );
  westLabel.setPosition( this.model.west.getPosCanvas(this.currentCamera, this.canvas) );
  equinoxLabel.setPosition( this.model.sphere[1].gfx.markerball.getPosCanvas(this.currentCamera, this.canvas) );
  npoleLabel.setPosition( this.model.sphere[1].gfx.npole.getPosCanvas(this.currentCamera, this.canvas) );
  spoleLabel.setPosition( this.model.sphere[1].gfx.spole.getPosCanvas(this.currentCamera, this.canvas) );
  sunLabel.setPosition( this.model.sun.gfx.mesh.getPosCanvas(this.currentCamera, this.canvas) ); 
  planetLabel.setPosition( this.model.planet.gfx.mesh.getPosCanvas(this.currentCamera, this.canvas) );
};



cosmoApp.prototype.draw = function(time) {
  this.canvas.render(this.currentScene, this.currentCamera);
  this.updateInfoBox();
  this.updateLabels();        
  this.stats.update();
};

/** on resize adjust camera aspect and canvas size */
cosmoApp.prototype.resize = function() {
  var 
  width = this.domRoot.innerWidth(),
  height = this.domRoot.innerHeight(), //-35,
  factor = Ori.gfxProfile.resolution;
  this.currentCamera.setAspect(width / height);
  this.canvas.setSize(width*factor, height*factor);
};


/**
 * @param name of the model to get 
 * @returns a model instance from cache or generates one (sort of a factory)
 */
cosmoApp.prototype.getModel = function(name) {
  // fetch existing model
  var mod = this.models[name];
  // or create new
  if(!mod) {
    this.models[name] = new window[name]({renderer: this});
    mod = this.models[name];
  };
  return mod;
};

cosmoApp.prototype.setFov = function(val) {
  this.currentCamera.setFov(val);
};


cosmoApp.prototype.getFov = function() {
  return  this.currentCamera.getFov();
};

cosmoApp.prototype.setZ = function(val) {
  this.currentCamera.setZ(val);
};


cosmoApp.prototype.getZ = function() {
  if(!this.currentCamera) return 0;
  return  this.currentCamera.getZ();
};

/**
 * build up ui from current model state
 * TODO: move to ui specific stuff or split up a little
 */
cosmoApp.prototype.updateUI = function() {
  
        $("#moonInfoContainer").hide();
        $("#sunInfoContainer").hide();
        $("#meanLongitudeBox").hide();
        
        
        if(this.model.ui === "ModelSun")  {
            $("#sunInfoContainer").show();
            $("#meanLongitudeBox").show();
        }      

        $("#ptolemyInfoContainer").hide();
        if(this.model.ui == "ModelPtolemy" || this.model.ui == "ModelPtolemySun") 
            $("#ptolemyInfoContainer").show();

        $("#sunAngleBox").fadeOut(500);
        if (this.model.sun.getEnabled()) 
            $("#sunAngleBox").fadeIn(500);
        
        $("#infoContainer2").fadeOut(500);


        $("#moon-select").fadeOut(500);

        $("#date-input").hide();
        
        // clear old ui elements
        $("#parameters").empty();
        planetLabel2.setPosition({x:0, y:0, z:-1});
        
        this.currentCamera.rotateY(Math.PI + 0.1);

        this.splashStatus.append("setup UI...2");
        


        $("#view-sliders").empty();
        UI.slider({model: this.model, id: "AxisAngle1", max: 360, step:0.01, text: "view latitude", tooltip: "change latitude"}).appendTo("#view-sliders");
        UI.slider({model: this, id: "Fov", max: 160, step:1, text: "field of view", tooltip: "set field of view"}).appendTo("#view-sliders");


        $("#visSpheres").empty();
        for (i in this.model.sphere) {
            if(this.model["setShowSphere" + i]) 
              UI.checkbox({model: this.model, id:"ShowSphere" + i, text:"S" + (Number(i)), color:  rgbToCSS( this.model.sphere[i].gfx.color) }).appendTo("#visSpheres");
        }
        
        $("#visOther").empty();
        if(this.model.setShowPath) UI.checkbox({model: this.model, id:"ShowSun", text:"sun", tooltip: "toggle sun visibilty", color: rgbToCSS(config.colors["Sun"]) }).appendTo("#visOther");
        if(this.model.setShowPath) UI.checkbox({model: this.model, id:"ShowPath", text:"path", color: rgbToCSS(config.colors["Path"]) }).appendTo("#visOther");
        if(this.model.setShowHippo) UI.checkbox({model: this.model, id:"ShowHippo", text:"hippopede", tooltip: "toggle hippopede visibilty", color:  rgbToCSS(config.colors["Hippo"]) }).appendTo("#visOther");
        if(this.model.setShowStars) UI.checkbox({model: this.model, id:"ShowStars", text:"stars"}).appendTo("#visOther");




        $("#anim-speed").empty().inputSlider({ 
            object: this.model,
            property: "AnimSpeed",
            min: -1000,
            max: 20000, 
            step: 0.1,
            text: "Animation Speed",
            tooltip:"duration of a year in seconds"
        });


        // create the right sliders for each model
        // TODO: tooltips and min/max values for each model and preset
        if (this.model instanceof ModelMoon || this.model instanceof ModelMoonCompare) {
            UI.box({id:"moon_cycle" }).appendTo("#parameters");
            UI.slider({model: this.model, id:"MetonYear", "max":100, text:"Years"}).appendTo("#moon_cycle");
            UI.slider({model: this.model, id:"MetonSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon_cycle");
            UI.slider({model: this.model, id:"MetonDays", "max":30000, text:"days"}).appendTo("#moon_cycle");

            UI.box({id:"moon2", text:"Eclipse period"}).appendTo("#parameters");
            UI.slider({model: this.model, id:"SarosDraconiticMonths", "max":1000, text:"Draconitic months"}).appendTo("#moon2");
            UI.slider({model: this.model, id:"SarosSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon2");


            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: this.model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

//            UI.slider({model: this.model, id:"Speed1", min: -6000, max:6000, text:"S 2 (zodiacal)"}).appendTo("#speed");
//           UI.slider({model: this.model, id:"Speed2", min: -6000, max:6000, text:"S 3 (synodic)"}).appendTo("#speed");
            UI.slider({model: this.model, id:"SunSpeed",  max:1100, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id: "rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION }).appendTo("#parameters");
            UI.slider({model: this.model, id:"RotateStart1", max: 360, step:0.05, text:"S 1"}).appendTo("#rotateStart");
           UI.slider({model: this.model, id:"RotateStart2", max: 360, step:0.05, text:"S 2"}).appendTo("#rotateStart");
           UI.slider({model: this.model, id:"RotateStart3", max: 360, step:0.05, text:"S 3"}).appendTo("#rotateStart");

            $("#moon input").change();

            if(this.model instanceof ModelMoonCompare) {
              UI.checkbox({model: this.model, id:"ShowPhase", text:"separated moons"}).appendTo("#vis");
              $("#infoContainer2").fadeIn(500);
            }

            $("#moonInfoContainer, #moon-select").fadeIn(500);

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

        } else if (this.model.ui == "ModelYavetz") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "Alpha", max: 360, step:0.05, text: "S 3-4"}).appendTo("#angle");
            UI.slider({model: this.model, id: "Beta", max: 360, step:0.05, text: "planet latitude"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: this.model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model: this.model, id:"Speed2",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model: this.model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.box({id:"rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION }).appendTo("#parameters");
            UI.slider({model: this.model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");


        } else if (this.model.ui == "Model4") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({ model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
//            color: model.sphere[2].gfx.color,
            
            
            UI.slider({ model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({ model: this.model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: this.model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({ model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({ model: this.model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({ model: this.model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");
            UI.slider({ model: this.model, id:"SunSpeed",  max:1000, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id:"rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION }).appendTo("#parameters");
            UI.slider({model: this.model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
//*/
           
        } else if (this.model.ui == "ModelAristotle") {

            $("#visSpheres > *").remove();
            UI.checkbox({model: this.model, id:"ShowSphere1", text:"S1", color: rgbToCSS(config.colors["S1"]) }).appendTo("#visSpheres");
            UI.checkbox({model: this.model, id:"ShowSphere2", text:"S2", color: rgbToCSS(config.colors["S2"])}).appendTo("#visSpheres");
            UI.checkbox({model: this.model, id:"ShowSphere3", text:"S3", color: rgbToCSS(config.colors["S3"])}).appendTo("#visSpheres");
            UI.checkbox({model: this.model, id:"ShowSphere4", text:"S4", color: rgbToCSS(config.colors["S4"])}).appendTo("#visSpheres");
            $("<div id='visSpheres1'></div>").appendTo("#visSpheres");
            UI.checkbox({model: this.model, id:"ShowSphere18", text:"P18", color: rgbToCSS(config.colors["S1"]) }).appendTo("#visSpheres1");
            UI.checkbox({model: this.model, id:"ShowSphere27", text:"P27", color: rgbToCSS(config.colors["S2"])}).appendTo("#visSpheres1");
            UI.checkbox({model: this.model, id:"ShowSphere36", text:"P36", color: rgbToCSS(config.colors["S3"])}).appendTo("#visSpheres1");
            UI.checkbox({model: this.model, id:"ShowSphere45", text:"P45", color: rgbToCSS(config.colors["S4"])}).appendTo("#visSpheres1");
            $("<div id='visSpheres2'></div>").appendTo("#visSpheres");
            UI.checkbox({model: this.model, id:"ShowSphere8", text:"S8", color: rgbToCSS(config.colors["S1"]) }).appendTo("#visSpheres2");
            UI.checkbox({model: this.model, id:"ShowSphere7", text:"S7", color: rgbToCSS(config.colors["S2"])}).appendTo("#visSpheres2");
            UI.checkbox({model: this.model, id:"ShowSphere6", text:"S6", color: rgbToCSS(config.colors["S3"])}).appendTo("#visSpheres2");
            UI.checkbox({model: this.model, id:"ShowSphere5", text:"S5", color: rgbToCSS(config.colors["S4"])}).appendTo("#visSpheres2");

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            
            UI.slider({model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");

            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");           
            UI.slider({model: this.model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model: this.model, id: "Speed3", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.checkbox({model: this.model.sphere[2], id: "Moving", max:1100, text:"S 2"}).appendTo("#speed");
            UI.checkbox({model: this.model.sphere[3], id: "Moving", max:1100, text:"S 3"}).appendTo("#speed");
            UI.checkbox({model: this.model.sphere[4], id: "Moving", max:1100, text:"S 4"}).appendTo("#speed");
            UI.checkbox({model: this.model.sphere[5], id: "Moving", max:1100, text:"S 5"}).appendTo("#speed");
            UI.checkbox({model: this.model.sphere[6], id: "Moving", max:1100, text:"S 6"}).appendTo("#speed");
            UI.checkbox({model: this.model.sphere[7], id: "Moving", max:1100, text:"S 7"}).appendTo("#speed");
            UI.checkbox({model: this.model.sphere[8], id: "Moving", max:1100, text:"S 8"}).appendTo("#speed");


            UI.box({id:"rotateStart", text:APP_STRINGS.EN.ROTATION_START_CAPTION}).appendTo("#parameters");
            UI.slider({model: this.model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");

        } else if (this.model.ui == "Model5") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle4", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle5", max: 360, step:0.05, text: "S 4-5 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: this.model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model: this.model, id:"Speed2",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model: this.model, id: "Alpha", max:1100}).appendTo("#speed");
            UI.slider({model: this.model, id: "Beta", max:1100}).appendTo("#speed");
            UI.slider({model: this.model, id: "Gamma", max:1100}).appendTo("#speed");

            UI.box({id:"rotateStart", text: APP_STRINGS.EN.ROTATION_START_CAPTION}).appendTo("#parameters");
            UI.slider({model: this.model, id:"RotateStart1", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart2", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart3", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart4", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
            UI.slider({model: this.model, id:"RotateStart5", max: 360, step:0.05, text:"S 5"}).appendTo("#rotateStart");
            
            

        } else if (this.model.ui == "ModelSimple") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model: this.model, id:"Speed2",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");

       } else if (this.model.ui == "ModelPtolemy") {
           this.currentCamera.rotateY((Math.PI*3)/2 - 0.1);
           this.currentCamera.rotateRight(Math.PI/2);
           planetLabel2.setText("Sun");       

//*
           UI.box({id:"daily"}).appendTo("#parameters");
           UI.checkbox({model: this.model, id:"Speed1", text:"movement"}).appendTo("#daily");           

           UI.box({id:"ecliptic"}).appendTo("#parameters");
           UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "obliquity"}).appendTo("#ecliptic");
           
            UI.box({id:"apsidal"}).appendTo("#parameters");
//            UI.slider({model: this.model.ptolemySphere, id: "ApsidalAngle", max: 360, step:0.1, text: "Angle"}).appendTo("#apsidal");
//            UI.slider({model: this.model.ptolemySphere, id: "ApsidalSpeed", max: 100, step:0.05, text: "degrees per century"}).appendTo("#apsidal");

            UI.box({id:"deferent"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "RadiusDeferent", max: 1000, step:0.05, text: "radius"}).appendTo("#deferent");
            UI.slider({model: this.model, id: "Equant", max: 30, step:0.05, text: "earth to deferent"}).appendTo("#deferent");            

            UI.box({id:"epicycle"}).appendTo("#parameters");
//            UI.slider({model: this.model, id: "RadiusEpicycle", max: 1000, step:0.01, text: "radius"}).appendTo("#epicycle");


            $("#date-input").show();
//            UI.text({model: this.model, id:"Date"}).appendTo("#playback");

            $("#apsidal input, #deferent input, #epicycle input").change();

       } else if (this.model.ui == "ModelPtolemySun") {

           $("<div id='visSuns'></div>").appendTo("#visSpheres");
           UI.checkbox({model: this.model, id:"ShowSun1", text:"Sun1"}).appendTo("#visSuns");
           UI.checkbox({model: this.model, id:"ShowSun2", text:"Sun2"}).appendTo("#visSuns");
           
           this.currentCamera.rotateY((Math.PI*3)/2 - 0.1);
           this.currentCamera.rotateRight(Math.PI/2);    
           planetLabel2.setText("Sun");       
   
//*
            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"apsidal", text:"Apsidal line"}).appendTo("#parameters");
            UI.slider({model: this.model.ptolemySphere, id: "ApsidalAngle", max: 360, step:0.01, text: "Angle"}).appendTo("#apsidal");
            UI.slider({model: this.model, id: "Equant", max: 30, step:0.05, text: "earth to deferent"}).appendTo("#apsidal");
            UI.slider({model: this.model.ptolemySphere, id: "ApsidalSpeed", max: 100, step:0.05, text: "degrees per century"}).appendTo("#apsidal");

            UI.box({id:"deferent", text:"Deferent"}).appendTo("#parameters");
            UI.slider({model: this.model, id:"RotateStart2", max: 360, step:0.05, text:"start"}).appendTo("#deferent");
            UI.slider({model: this.model, id:"Speed2", max:1100, text:"speed"}).appendTo("#deferent");
            UI.slider({model: this.model, id:"Speed3", min: -1100, max:1100, text:"speed"}).appendTo("#deferent");

            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#deferent");

            $("#date-input").show();
//            UI.text({model: this.model, id:"Date"}).appendTo("#playback");
            $("#apsidal input, #deferent input").change();
//*/            
        } else if (this.model.ui == "ModelHippo") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 3"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle4", max: 360, step:0.05, text: "S 4"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model: this.model, id:"Speed2",  max:1100, text:"S 2"}).appendTo("#speed");
            UI.slider({model: this.model, id:"Speed3",  max:1100, text:"S 3"}).appendTo("#speed");

        } else if (this.model.ui === "ModelSun") {


            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model: this.model, id: "AxisAngle2", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model: this.model, id: "AxisAngle3", max: 360, step:0.05, text: "S 2-3"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
//            UI.slider({model: this.model, id:"Speed0",  max:1, text:"S 1 (daily)"}).appendTo("#speed");
            UI.checkbox({model: this.model, id:"Speed1", text:"S 1 (daily)"}).appendTo("#speed");

            UI.slider({model: this.model, id:"Speed2",  max:1100, text:"S 2 (zodiacal) in days"}).appendTo("#speed");
            UI.slider({model: this.model, id: "SunYears", max:1100, text:"S 3 (synodic) in years"}).appendTo("#speed");
            
//            $("#Speed1 > input, #SunYears > input").change(function() {
//              $("#sunDaysPerYear").html(Utils.frac( app.model.getDaysPerYear() ));
//            });
        }


        // initial update of sliders/state
        this.model.toggleRunning();
        $("#view-header, #caprotateStart").click(); // #pauseButton
        this.model.toggleRunning();
        $("#moon input, #angle  input, #speed input").change();
        $("#AxisAngle1 input").change();
        
        this.currentCamera.rotateTarget({x: 0, y: 0, z: 0});



    };
    



// setup site
// TODO: maybe move to index.html
app = new cosmoApp({domRoot: $("#canvas-main")});
if(app) {
  window.onresize = function(e) { app.resize(e) };
  app.run();
}


