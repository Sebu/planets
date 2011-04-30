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

        this.canvas = new Ori.Canvas({});
        this.canvas.setSize(window.innerWidth, window.innerHeight);
        Ori.input.trackMouseOn(this.canvas.domElement);

        this.domRoot.append(this.canvas.domElement);

        Ori.input.register(Ori.KEY.A, "LEFT");
        Ori.input.register(Ori.KEY.D, "RIGHT");
        Ori.input.register(Ori.KEY.S, "DOWN");
        Ori.input.register(Ori.KEY.W, "UP");

        // TODO : shorten
        this.camera = new THREE.Camera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.init({ eye : { x: 0.0 , y: 0.0, z: -17.0 } });
        this.camera.rotateY(Math.PI + 0.1);


        models = {}; //new Object;
        models["Model4"] = new Model4({renderer: this});
        models["ModelMoonCompare"] = new ModelMoonCompare({renderer: this});
        models["ModelSun"] = new ModelSun({renderer: this});
        models["ModelSimple"] = new ModelSimple({renderer: this});
        models["ModelHippo"] = new ModelHippo({renderer: this});
        models["ModelYavetz"] = new ModelYavetz({renderer: this});
        models["Model5"] = new Model5({renderer: this});
        models["ModelMoon"] = new ModelMoon({renderer: this});

        model = models["Model4"];


        planetLabel = new UI.Label({text: "Planet"});
        sunLabel = new UI.Label({text: "Sun"});

        equinoxLabel = new UI.Label({text: "Equinox"});
        npoleLabel = new UI.Label({text: "North pole"});
        spoleLabel = new UI.Label({text: "South pole"});

        northLabel = new UI.Label({text: "North"});
        southLabel = new UI.Label({text: "South"});
        eastLabel = new UI.Label({text: "East"});
        westLabel = new UI.Label({text: "West"});

        //"http://www.pacdv.com/sounds/interface_sound_effects/sound37.mp3"
        var sound = Ori.loadContent("test.mp3");
//        sound.play();

        domRoot = $("#mainBox");


        $("<div class='container' id='infoContainer'>\
            <div>angle planet/sun <span style='float:right;' id='sunAngle'>0</span></div>\
            <div>longitude <span style='float:right; 'id='eclipticAngle'>0</span></div>\
            <div>longitude speed <span style='float:right;' id='eclipticSpeed'>0</span></div>\
            <div>latitude<span style='float:right;' id='latitude'>0</span></div>\
            <div>days<span style='float:right;' id='days'>0</span></div>\
            <div id='moonInfoContainer' style='display:none'>\
            <div>zodiacal month</div>\
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
            </div>").appendTo(domRoot);

        uiBox = $("<div class='container' id='uiContainer'></div>").appendTo(domRoot);


        uiBox.append("<span><select  title='current position' id='viewPresets' onchange='app.setView(model.viewPresets[this.value]);'></select></span>");
        UI.optionsFromHash("#viewPresets", model.viewPresets);

        uiBox.append("<span><select title='latitude presets' id='longitudePresets' onchange='$(\"#AxisAngle0 > input\").attr(\"value\",latitudePresets[this.value]); $(\"#AxisAngle0 >input\").change();  '></select></span>");
        UI.optionsFromHash("#longitudePresets", latitudePresets);

        $("#viewPresets option[value='World']").attr('selected', true);


        uiBox.append("<span>Presets<select title='Planet presets' id='planetPreset' onchange='app.setCurrentPlanet(planetPresets[this.options[this.selectedIndex].value]);'>View</select></span>");
        UI.optionsFromHash("#planetPreset", planetPresets);

        legend = $("<div class='container' id='legendContainer'></div>").appendTo(domRoot);

        uiBox.append("<span><select title='Moon models' id='moonModel' onchange='model.setCurrentMoonModel(this.options[this.selectedIndex].value);model.reset();'></select></span>");
        UI.optionsFromHash("#moonModel", moonModels);

        uiBox.append("<div id='playback'></div>");

//        $("<div id='playbackContainer'><div id='playback'></div></div>").appendTo(domRoot);

//        $("#playbackContainer").hover(function() {
//           $("#playback").slideToggle();
//        });
        
//        $("#playback").slideToggle();

        uiBox.append("<div id='view'></div>");
        uiBox.append("<div id='parameters'></div>");
        $("#vis").hide();

        this.setCurrentPlanet(planetPresets["Mercury1"]);

    };


myApp.prototype.newScene = function() {
        var scene = new THREE.Scene();
        scene.addLight(new THREE.AmbientLight(0xFFFFFF));
        this.scenes.push(scene);
        return scene;
    };

myApp.prototype.setCurrentScene = function(scene) {

        //this.currentScene.enabled = false;
        this.currentScene = scene;
        this.currentScene.enabled = true;
        this.components = [];
        this.components.push(this.currentScene);
    };

myApp.prototype.update = function() {

        if (Ori.input.isDown("LEFT")) this.camera.translateNew(0.6, 0, 0);
        if (Ori.input.isDown("RIGHT")) this.camera.translateNew(-0.6, 0, 0);
        if (Ori.input.isDown("DOWN")) this.camera.translateNew(0, 0, -0.6);
        if (Ori.input.isDown("UP")) this.camera.translateNew(0, 0, 0.6);

        if (Ori.input.mouse.wheel) this.camera.translateNew(0.0, 0.0, Ori.input.mouse.z);
        if (Ori.input.mouse.b1) {
            x = Ori.input.mouse.x;
            y = Ori.input.mouse.y;
            pitch = (y - Ori.input.drag.y) * 0.005;

            yaw = (x - Ori.input.drag.x) * -0.005;
            if (model.currentPos == "Earth") {
                this.camera.rotateY(yaw);
            } else {
                this.camera.rotateUp(yaw);
            }

            this.camera.rotateRight(pitch);

            Ori.input.drag.x = x;
            Ori.input.drag.y = y;
        }
        model.update();

        $("#sunAngle").text(Math.round(model.sunAngle));
        $("#eclipticAngle").text(Math.round(model.eclipticAngle));
        $("#eclipticSpeed").text(model.eclipticSpeed.toFixed(2));
        $("#latitude").text(Math.round(model.latitude));
        $("#days").text(Math.round(model.days));


        // Labels
//*/
        if (model.currentPos == "Earth") {
            northLabel.setPosition(getNodePosCanvas("North"));
            southLabel.setPosition(getNodePosCanvas("South"));
            eastLabel.setPosition(getNodePosCanvas("East"));
            westLabel.setPosition(getNodePosCanvas("West"));
        } else {
            equinoxLabel.setPosition(getNodePosCanvas(model.name + "S0"));
            npoleLabel.setPosition(getNodePosCanvas(model.name + "S0npole"));
            spoleLabel.setPosition(getNodePosCanvas(model.name + "S0spole"));
        }
        planetLabel.setPosition(getNodePosCanvas(model.name + "Planet"));
        if (model.sun.getEnabled()) sunLabel.setPosition(getNodePosCanvas(model.name + "Sun"));
//*/        
    };


myApp.prototype.draw = function() {
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

myApp.prototype.setCurrentPlanet = function(planet) {

        // switch model
        model = models[planet.model];
        
        
        this.setCurrentScene(model.root);
        model.setCurrentPlanet(planet);
        model.reset();

        // build up ui
        $("#moonInfoContainer").fadeOut(500);
        $("#moonModel").fadeOut(500);


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




        UI.slider({model:model, id: "AxisAngle0", max: 360, step:0.05, text: "view latitude", tip: "change latitude"}).appendTo("#view");

        UI.slider({model: this.camera, id: "Fov", max: 160, step:1, text: "field of view"}).appendTo("#view");


        $("#playback").append("<input type='button' onclick='model.reset();' value='reset'>");
        $("#playback").append("<input id='pauseButton' type='button' onclick='model.tooglePause(); if(model.running) { this.value=\"pause\";} else {this.value=\"start\";} ' title='pause animation'>");
        UI.slider({model: model, id: "Speed", min:0.001, max:2000, step: 0.1, text: "Animation Speed", tip:"length of a year in seconds"}).appendTo("#playback");

        UI.box({id:"vis", text:"Show"}).appendTo("#view");
        for (i in model.sphere) {
            UI.checkbox({model:model, id:"ShowSphere" + i, text:"S" + (Number(i) + 1)}).appendTo("#vis");
        }
        UI.checkbox({model:model, id:"ShowCurve0", text:"path"}).appendTo("#vis");
        UI.checkbox({model:model, id:"ShowCurve1", text:"hippo"}).appendTo("#vis");
        UI.checkbox({model:model, id:"ShowStars", text:"stars"}).appendTo("#vis");


        if (model.name == "ModelMoon" || model.name == "ModelMoonCompare") {
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
            UI.slider({model:model, id:"Speed1", min: -600, max:600, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed2", min: -600, max:600, text:"S 3 (synodic)"}).appendTo("#speed");

            $("#moon input").change();

            $("#moonInfoContainer,#moonModel").fadeIn(500);

            // moon sliders setup
            // onchange of a moon parameter -> update model
            $("#MetonYear > input,#MetonSynodicMonths > input,#MetonDraconiticMonths > input,#MetonDays > input").change(function() {

                $("#metonZodicalMonths").html(model.getMetonZodicalMonths().toFixed());
                $("#metonDaysPerYear").html(model.getMetonDaysPerYear().toFixed(2));
                $("#synodicDaysPerMonth").html(model.getSynodicDaysPerMonth().toFixed());
                $("#zodicalDaysPerMonth").html(model.getZodicalDaysPerMonth().toFixed());
                $("#draconiticDaysPerMonth").html(model.getDraconiticDaysPerMonth().toFixed());
                $("#Speed1 > input").attr({"value": model.moonSpeed1(model.draco, model.zodic) });
                $("#Speed2 > input").attr({"value": model.moonSpeed2(model.draco, model.zodic) });

            });
//            $("#Speed1 > input").attr({"value": model.moonSpeed1(model.draco, model.zodic) });
//            $("#Speed2 > input").attr({"value": model.moonSpeed2(model.draco, model.zodic) });

            $("#MetonYear > input").change();

        } else if (model.name == "ModelYavetz") {

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


        } else if (model.name == "Model4") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle3", max: 360, step:0.05, text: "S 3-4 (unknown)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:12000, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed2", max:1100, text:"S 3,4 (synodic)"}).appendTo("#speed");
            UI.slider({model:model, id:"SunSpeed",  max:1100, text:"S 2 Sun"}).appendTo("#speed");
            UI.box({id:"rotateStart", text:"Rotation Start (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id:"RotateStart0", max: 360, step:0.05, text:"S 1 (right ascension)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart1", max: 360, step:0.05, text:"S 2 (longitude)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart2", max: 360, step:0.05, text:"S 3 (synodic)"}).appendTo("#rotateStart");
            UI.slider({model:model, id:"RotateStart3", max: 360, step:0.05, text:"S 4"}).appendTo("#rotateStart");

        } else if (model.name == "Model5") {

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

        } else if (model.name == "ModelSimple") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");

        } else if (model.name == "ModelHippo") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1,2"}).appendTo("#speed");


        } else if (model.name == "ModelSun") {

            UI.box({id:"angle", text:"Angle (degrees)"}).appendTo("#parameters");
            UI.slider({model:model, id: "AxisAngle1", max: 360, step:0.05, text: "S 1-2 (obliquity of ecliptic)"}).appendTo("#angle");
            UI.slider({model:model, id: "AxisAngle2", max: 360, step:0.05, text: "S 2-3 (right angle)"}).appendTo("#angle");
            UI.box({id:"speed", text:"Sphere Period (days)"}).appendTo("#parameters");
            UI.slider({model:model, id:"Speed0",  max:1100, text:"S 1 (daily)"}).appendTo("#speed");
            UI.slider({model:model, id:"Speed1",  max:1100, text:"S 2 (zodiacal)"}).appendTo("#speed");
            UI.slider({model:model, id: "Speed2", max:1100, text:"S 3 (synodic)"}).appendTo("#speed");

        }

        fixRange();



        model.tooglePause();
        $("#capvis,#caprotateStart, #pauseButton").click();
        $("#moon input, #angle  input, #speed  input").change();
        $("#AxisAngle0 input").change();

//        $("#rotateStart,#vis").hide();
    };



// setup site
//$(document).ready(function() {

    app = new myApp({domRoot: $("#mainBox")});
    window.onresize = function(e) { app.resize(e) };
    app.run();

//});

