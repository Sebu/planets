


// see libs/origami.js for Ori namespace
myApp = function(params) {
    Ori.App.call(this);
    this.init(params);
};
myApp.prototype = new Ori.App;
myApp.prototype.constructor = myApp;


myApp.prototype.init = function(params) {
        this.domRoot = params.domRoot;
        this.currentScene = null;
        this.scenes = [];

        // create canvas (WebGL if possible)
        this.canvas = new Ori.Canvas({});
        this.canvas.setSize(window.innerWidth, window.innerHeight);
        Ori.input.trackMouseOn(this.canvas.domElement);
        if(Modernizr.touch) Ori.input.trackTouchOn(this.canvas.domElement);
           
        // append to DOM
        this.domRoot.append(this.canvas.domElement);

        // register input
        Ori.input.register(Ori.KEY.A, "LEFT");
        Ori.input.register(Ori.KEY.D, "RIGHT");
        Ori.input.register(Ori.KEY.S, "DOWN");
        Ori.input.register(Ori.KEY.W, "UP");

        // setup camera
        // TODO : shorten
        this.camera = new THREE.Camera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.init({ eye : { x: 0.0 , y: 0.0, z: -17.0 } });
        this.camera.rotateY(Math.PI + 0.1);


        // create models
        models = {}; //new Object;
        models["Model4"] = new Model4({renderer: this});
        models["ModelMoonCompare"] = new ModelMoonCompare({renderer: this});
        models["ModelSun"] = new ModelSun({renderer: this});
        models["ModelSimple"] = new ModelSimple({renderer: this});
        models["ModelHippo"] = new ModelHippo({renderer: this});
        models["ModelYavetz"] = new ModelYavetz({renderer: this});
        models["Model5"] = new Model5({renderer: this});
        models["ModelMoon"] = new ModelMoon({renderer: this});
        // set start model
        model = models["Model4"];


        // setup moving labels        
        planetLabel = new UI.Label({text: "Planet"});
        sunLabel = new UI.Label({text: "Sun"});
        equinoxLabel = new UI.Label({text: "Equinox"});
        npoleLabel = new UI.Label({text: "North pole"});
        spoleLabel = new UI.Label({text: "South pole"});
        northLabel = new UI.Label({text: "North"});
        southLabel = new UI.Label({text: "South"});
        eastLabel = new UI.Label({text: "East"});
        westLabel = new UI.Label({text: "West"});



        // create some elements
        // TODO: more segmentation
        $("<div class='container' id='infoContainer'>\
            <div>angle planet/sun <span style='float:right;' id='sunAngle'>0</span></div>\
            <div>longitude <span style='float:right; 'id='eclipticAngle'>0</span></div>\
            <div>longitude speed <span style='float:right;' id='eclipticSpeed'>0</span></div>\
            <div>latitude<span style='float:right;' id='latitude'>0</span></div>\
            <div>days<span style='float:right;' id='days'>0</span></div>\
            <div id='moonInfoContainer' style='display:none'>\
            <div>zodiacal months</div>\
            <div id='metonZodicalMonths'>0</div>\
            <div>days per year</div>\
            <div id='metonDaysPerYear'>0</div>\
            <div>days per synodic month</div>\
            <div id='synodicDaysPerMonth'>0</div>\
            <div>days per zodical month</div>\
            <div id='zodicalDaysPerMonth'>0</div>\
            <div>days per draconitic month</div>\
            <div id='draconiticDaysPerMonth'>0</div>\
            </div>\
            </div>").appendTo(this.domRoot);

        uiBox = $("<div class='container' id='uiContainer'></div>").appendTo(this.domRoot);
        $("#viewPresets option[value='World']").attr('selected', true);
        uiBox.append("<span><select style='width:110px;' title='Planet presets' id='planetPreset' onchange='app.setCurrentPlanet(this.options[this.selectedIndex].value);'>View</select></span>");
        var vault = localStorage.getJson("customPresets") || {};
        $.extend(true, planetPresets, vault);
        UI.optionsFromHash("#planetPreset", planetPresets);
        
        uiBox.append("<input type='button' onclick='app.addPreset();' value='+'>");
        uiBox.append("<input type='button' onclick='app.removePreset();' value='-'>");
        
        legend = $("<div class='container' id='legendContainer'></div>").appendTo(this.domRoot);
        uiBox.append("<span><select title='Moon models' id='moonModel' onchange='model.setCurrentMoonModel(this.options[this.selectedIndex].value);model.reset();'></select></span>");
        UI.optionsFromHash("#moonModel", moonModels);

        uiBox.append("<div id='view'></div>");
        uiBox.append("<div id='parameters'></div>");
        uiBox.append("<div id='playback'></div>");
        $("#vis").hide();

        this.setCurrentPlanet("Mercury1");

    };


myApp.prototype.addPreset = function() {
    var vault = localStorage.getJson("customPresets") || {};
    var store = { model: model.name, writeable: true, sphere: [] };
    for(var i in model.sphere) {
      store.sphere[i] = { axisAngle: model.sphere[i].getAxisAngle(), speed: model.sphere[i].getSpeed(), rotateStart: model.sphere[i].getRotateStart()  };
    }
    var text = prompt('Please enter a name for the preset.',model.name + '1');
    if(text && (!vault[text] || confirm('Preset "' + text + '" already exists. Overwrite?'))) {
      vault[text] = store;
      localStorage.setJson("customPresets", vault);
      $.extend(true, planetPresets, vault);
      UI.optionsFromHash("#planetPreset", planetPresets);
      this.setCurrentPlanet(text); 
    }
    console.log(planetPresets);

     
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
  UI.optionsFromHash("#planetPreset", planetPresets);
  this.setCurrentPlanet("Mercury1");   
};


// get new scene ( one for each model )
myApp.prototype.newScene = function() {
        var scene = new THREE.Scene();
        scene.addLight(new THREE.AmbientLight(0xFFFFFF));
        this.scenes.push(scene);
        return scene;
    };

myApp.prototype.setCurrentScene = function(scene) {
//        this.currentScene.enabled = false;
        this.currentScene = scene;
        this.currentScene.enabled = true;
        this.components = [];
        this.components.push(this.currentScene);
    };


// update loop
myApp.prototype.update = function(time) {

        // handle input     
        if (model.currentPos != "Earth") {
          if (Ori.input.isDown("LEFT")) this.camera.translateNew(0.6, 0, 0);
          if (Ori.input.isDown("RIGHT")) this.camera.translateNew(-0.6, 0, 0);
          if (Ori.input.isDown("DOWN")) this.camera.translateNew(0, 0, -0.6);
          if (Ori.input.isDown("UP")) this.camera.translateNew(0, 0, 0.6);
        }
        
        
        if (Ori.input.mouse.wheel) this.camera.translateNew(0.0, 0.0, Ori.input.mouse.z);
        if (Ori.input.mouse.b1) {
            var x = Ori.input.mouse.x;
            var y = Ori.input.mouse.y;
            var pitch = (y - Ori.input.drag.y) * 0.2 * time;

            var yaw = (x - Ori.input.drag.x) * -0.2 * time;
            if (model.currentPos == "Earth") {
                this.camera.rotateY(yaw);
            } else {
                this.camera.rotateUp(yaw);
            }

            this.camera.rotateRight(pitch);

            Ori.input.drag.x = x;
            Ori.input.drag.y = y;
        }
        
        // update model
        model.update(time);

        // infoBox data
        $("#sunAngle").text( model.sunAngle.toFixed(1) );
        $("#eclipticAngle").text( model.eclipticAngle.toFixed(1) );
        $("#eclipticSpeed").text(model.eclipticSpeed.toFixed(2));
        $("#latitude").text( model.latitude.toFixed(1) );
        $("#days").text(Math.round(model.days));


        // update Label position/visibility
//*/
        if (model.currentPos == "Earth") {
            northLabel.setPosition(model.north.getPosCanvas(this.camera, this.canvas));
            southLabel.setPosition(model.south.getPosCanvas(this.camera, this.canvas));
            eastLabel.setPosition(model.east.getPosCanvas(this.camera, this.canvas));
            westLabel.setPosition(model.west.getPosCanvas(this.camera, this.canvas));
        } else {
            equinoxLabel.setPosition(model.sphere[0].visuals.markerball.getPosCanvas(this.camera, this.canvas)); //getNodePosCanvas(model.name + "S0"));
            npoleLabel.setPosition(model.sphere[0].visuals.npole.getPosCanvas(this.camera, this.canvas)); //getNodePosCanvas(model.name + "S0npole"));
            spoleLabel.setPosition(model.sphere[0].visuals.spole.getPosCanvas(this.camera, this.canvas)); //getNodePosCanvas(model.name + "S0spole"));
        }
        planetLabel.setPosition(model.planet.mesh.getPosCanvas(this.camera, this.canvas)); //getNodePosCanvas(model.name + "Planet"));
        if (model.sun.getEnabled()) sunLabel.setPosition(model.sun.mesh.getPosCanvas(this.camera, this.canvas)); //getNodePosCanvas(model.name + "Sun"));

//*/        
    };


myApp.prototype.draw = function(time) {
        this.canvas.clear();
        for (i in this.components) {
            component = this.components[i];
            if (component.enabled) this.canvas.render(component, this.camera);
        }
    };

myApp.prototype.resize = function() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera.setAspect(width / height);
        this.canvas.setSize(width, height);
    };


myApp.prototype.setView = function(view) {
        model.currentPos = view.from;
        model.currentLookAt = view.at;

        if (model.currentPos == "Earth") {
            equinoxLabel.setPosition({x:0, y:0, z:-1});
            npoleLabel.setPosition({x:0, y:0, z:-1});
            spoleLabel.setPosition({x:0, y:0, z:-1});
        } else {
            northLabel.setPosition({x:0, y:0, z:-1});
            southLabel.setPosition({x:0, y:0, z:-1});
            eastLabel.setPosition({x:0, y:0, z:-1});
            westLabel.setPosition({x:0, y:0, z:-1});
        }

        model.changeView(model.currentPos);
    };


// change planet model and create the UI ELEMENTS + add to DOM
myApp.prototype.setCurrentPlanet = function(preset) {

        // switch model
        this.currentPreset = preset;
        var planet = planetPresets[preset];
        model = models[planet.model];
        this.setCurrentScene(model.root);
        model.setCurrentPlanet(planet);
        planetLabel.setText(model.currentPlanet.label);
        //model.reset();
        
        this.setView({from: "Free",at:"Earth"});
        
        if(!model.sun.getEnabled()) sunLabel.setPosition({x:0, y:0, z:-1});

        // build up ui
        $("#moonInfoContainer").fadeOut(500);
        $("#moonModel").fadeOut(500);

        // clear old ui elements
        $("#playback > *").remove();
        $("#view > *").remove();
        $("#parameters > *").remove();
        $("#legendContainer > *").remove();

        // create legend
//        $("<div style='float:left;font-weight:bold;color:rgb(255,255,255)'>Path</div>").appendTo("#legendContainer");
        for (i in model.sphere) {
            var color = "rgb(" + colors["S" + i].r * 255 + "," + colors["S" + i].g * 255 + "," + colors["S" + i].b * 255 + ")";
            $("<div style='float:left;font-weight:bold;color:" + color + "'> S" + (Number(i) + 1) + " </div>").appendTo("#legendContainer");
            
        }

        // view div
        $("<select  title='current position' id='viewPresets' onchange='app.setView(model.viewPresets[this.value]);'></select>").appendTo("#view");
        UI.optionsFromHash("#viewPresets", model.viewPresets);

        $("<select style='width:75px;' title='latitude presets' id='longitudePresets' onchange='$(\"#AxisAngle0 > input\").attr(\"value\",latitudePresets[this.value]); $(\"#AxisAngle0 >input\").change();'></select>").appendTo("#view");
        UI.optionsFromHash("#longitudePresets", latitudePresets);
        UI.slider({model:model, id: "AxisAngle0", max: 360, step:0.05, text: "view latitude", tip: "change latitude"}).appendTo("#view");
        // view sub box box 
        UI.box({id:"vis", text:"Show"}).appendTo("#view");
        UI.slider({model: this.camera, id: "Fov", max: 160, step:1, tooltip: "field of view"}).appendTo("#vis");
        for (i in model.sphere) {
            UI.checkbox({model:model, id:"ShowSphere" + i, text:"S" + (Number(i) + 1)}).appendTo("#vis");
        }
        UI.checkbox({model:model, id:"ShowCurve0", text:"path"}).appendTo("#vis");
        UI.checkbox({model:model, id:"ShowCurve1", text:"hippo"}).appendTo("#vis");
        UI.checkbox({model:model, id:"ShowStars", text:"stars"}).appendTo("#vis");

        // playback div       
        $("#playback").append("<input type='button' onclick='model.reset();' value='reset'>");
        $("#playback").append("<input id='pauseButton' type='button' onclick='model.tooglePause(); if(model.running) { this.value=\"pause\";} else {this.value=\"start\";} ' title='pause animation'>");
        UI.slider({model: model, id: "Speed", min:0.001, max:20000, step: 0.1, text: "Animation Speed", tip:"length of a year in seconds"}).appendTo("#playback");



        // create the right sliders for each model
        // TODO: tooltips and min/max values for each model and preset
        if (model instanceof ModelMoon || model instanceof ModelMoonCompare) {
            UI.box({id:"moon", text:"Moon year month day cycle"}).appendTo("#parameters");
            UI.slider({model:model, id:"MetonYear", "max":100, text:"Years"}).appendTo("#moon");
            UI.slider({model:model, id:"MetonSynodicMonths", "max":1000, text:"Synodic months"}).appendTo("#moon");
            UI.slider({model:model, id:"MetonDays", "max":30000, text:"days"}).appendTo("#moon");

            UI.box({id:"moon2", text:"Eclipse period"}).appendTo("#parameters");
            UI.slider({model:model, id:"MetonDraconiticMonths", "max":1000, text:"Draconitic months"}).appendTo("#moon2");

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
//            UI.slider({model:model, id:"Speed1", min: -6000, max:6000, text:"S 2 (zodiacal)"}).appendTo("#speed");
//           UI.slider({model:model, id:"Speed2", min: -6000, max:6000, text:"S 3 (synodic)"}).appendTo("#speed");
            UI.slider({model:model, id:"SunSpeed",  max:1100, text:"S 2 Sun"}).appendTo("#speed");


            $("#moon input").change();

            if(model instanceof ModelMoon) $("#moonInfoContainer,#moonModel").fadeIn(500);

            // moon sliders setup
            // onchange of a moon parameter -> update model
            $("#MetonYear > input,#MetonSynodicMonths > input,#MetonDraconiticMonths > input,#MetonDays > input").change(function() {

                $("#metonZodicalMonths").html(model.getMetonZodicalMonths().toFixed());
                $("#metonDaysPerYear").html(model.getMetonDaysPerYear().toFixed(2));
                $("#synodicDaysPerMonth").html(model.getSynodicDaysPerMonth().toFixed(3));
                $("#zodicalDaysPerMonth").html(model.getZodicalDaysPerMonth().toFixed(3));
                $("#draconiticDaysPerMonth").html(model.getDraconiticDaysPerMonth().toFixed(3));
                $("#Speed1 > input").attr({"value": model.moonSpeed1(model.draco, model.zodic) });
                $("#Speed2 > input").attr({"value": model.moonSpeed2(model.draco, model.zodic) });

            });
            $("#MetonYear > input").change();

        } else if (model instanceof ModelYavetz) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "Alpha", max: 360, step:0.05}).appendTo("#angle");
            UI.slider({model:model, id: "Beta", max: 360, step:0.05}).appendTo("#angle");

            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed2", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");

            UI.box("rotateStart", "Rotation Start (degrees)").appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart0", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");


        } else if (model instanceof Model4) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            $("#AxisAngle1").hover(function (e) {
              model.sphere[1].materialArc.linewidth = 10;
            }, function (e) {
              model.sphere[1].materialArc.linewidth = 1;});
            
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed2", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");
            UI.slider({model:model, id:"SunSpeed",  max:1000, text:"S 2 Sun"}).appendTo("#speed");

            UI.box({id:"rotateStart", text:"Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart0", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");

        } else if (model instanceof Model5) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle4", max: 360, step:0.05, text: "S 4-5 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Alpha", max:1100}).appendTo("#speed");
            UI.slider({model:model, id: "Beta", max:1100}).appendTo("#speed");
            UI.slider({model:model, id: "Gamma", max:1100}).appendTo("#speed");

            UI.box({id:"rotateStart", text:"Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart0", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart4", max: 360, step:0.05, text:"S 5"}).appendTo("#rotateStart");

        } else if (model instanceof ModelSimple) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");

        } else if (model instanceof ModelHippo) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1,2"}).appendTo("#speed");


        } else if (model instanceof  ModelSun) {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed2", max:1100, text:"S 3 (synodic)"}).appendTo("#speed");

        }

        // fix range sliders in Firefox etc.
        // TODO: don't use range input
        fixRange();

        // initial update of sliders/state
        model.tooglePause();
        $("#capvis,#caprotateStart, #pauseButton").click();
        $("#moon input, #angle  input, #speed  input").change();
        $("#AxisAngle0 input").change();

    };



// setup site
// TODO: maybe move to index.html
app = new myApp({domRoot: $("#mainBox")});
window.onresize = function(e) { app.resize(e) };
app.run();


