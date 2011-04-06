

var BaseScene = function(params) {

    this.scene = SceneJS.scene({ canvasId: "glCanvas" });
    this.renderer = SceneJS.renderer({  id: "renderer" , clear: { depth : true, color : true },  clearColor: { r: 0.2, g : 0.2, b : 0.2 }, pointSize: 4 });
    this.lookAt = SceneJS.lookAt({ eye : { x: 0.0, y: 0.0, z: -30 }, look : { x:0.0, y:0.0, z: -24 }, up: { x:0.0, y: 1.0, z: 0.0 } });
    this.camera = new Camera();

    this.lookAt.addNode(this.camera);
    this.renderer.addNode(this.lookAt);
    this.scene.addNode(this.renderer);

    // initial start rotation
    this.lookAt.rotateY(Math.PI+0.1);

    this.resize = function() {
        canvas = document.getElementById("glCanvas");
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        model.camera.setOptics({ type: "perspective", fov : 45.0, aspect : canvas.width / canvas.height, near : 0.10, far : 500.0});
        this.renderer._props.props.viewport = { x : 1, y : 1, width: canvas.width, height: canvas.height };
    }

    this.mouseDown = function (event) {
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        this.dragging = true;
    }

    this.mouseUp = function() {
        this.dragging = false;

    }

    /* On a mouse drag, we'll re-render the scene, passing in
     * incremented angles in each time.
     */
    this.pitch = 0;
    this.mouseMove = function(event) {
        if (this.dragging) {
            pitch = (event.clientY - this.lastY) * 0.005;
            yaw = (event.clientX - this.lastX) * -0.005;

            if (model.currentPos == "Earth") {
                model.lookAt.rotateY(yaw);
            } else {
                model.lookAt.rotateUp(yaw);
            }
  
            if(model.currentPos=="Earth") {
              if(this.pitch+pitch>0.4)  pitch = 0;
              else if(this.pitch+pitch<-1.9)  pitch = 0;
            }
            this.pitch += pitch;
  		      this.lookAt.rotateRight(pitch);

            this.lastX = event.clientX;
            this.lastY = event.clientY;
        }
    }

    this.keyboard = function(e) {
        switch (e.keyCode) {
            case 119: model.lookAt.translate(0, 0, 0.6);  break;
            case 115: model.lookAt.translate(0, 0, -0.6);  break;
            case 97:  model.lookAt.translate(0.6, 0, 0);  break;
            case 100: model.lookAt.translate(-0.6, 0, 0);  break;
            default: return false;
        }
    }

    this.mouseWheel = function(event) {
        model.lookAt.translate(0.0, 0.0, event.wheelDelta / 120);
    }
    this.mouseWheel_firefox = function(event) {
        model.lookAt.translate(0.0, 0.0, event.detail);
    }
}

var BasePlanetModel = function() {


    // model specific moon
    this.sunYear = 365.0;

    this.time = 21;

    // CONTROLLS this.lastX = 0;
    this.lastY = 0;
    this.dragging = false;

    this.currentPlanet = {};
    this.currentPos = "Free";
    this.pitch=0;
    this.currentLookAt = "Earth";
    this.speed = 0;
    this.fps = 30.0;
    this.setSpeed = function(val) {
        this.speed = val;
    }
    this.getSpeed = function() {
        return this.speed;
    }
    this.setSpeed(60);

    this.posAngle = 10.0;
    this.betaRotate = 0;
    
    this.showCurve0 = true;
    this.showCurve1 = true;
    
    this.setShowCurve0 = function(state) { this.showCurve0=state; }
    this.setShowCurve1 = function(state) { this.showCurve1=state;  }
    this.setShowStars = function(state) { this.stars.setEnabled(state); }

    // SETUP
    // base structure
    // planet system
    this.init = function(params) {
        this.name = params.name;
        this.curves = {};
        this.sphere = new Array(params.spheres);

        this.systemSun = [];
        this.viewPoints = {"Free":0, "Earth":0, "Planet":0};
        this.viewPresets = {"World": {from: "Free",at:"Earth"}, "Earth": {from: "Earth",at:"Free"}};

        this.light = Sunlight();

        this.lookAt = params.renderer.lookAt;
        this.scene = params.renderer.scene;
        this.camera = params.renderer.camera;

        this.root = new SceneJS.node();
        this.camera.addNode(this.root);

        this.root.addNode(this.light);

        this.root.addNode(this.debug = SceneJS.translate({id: "debug"},
          SceneJS.scale({y:0.01}, SceneJS.sphere({radius: 0.2}) ) ));

        this.root.addNode(this.earthPlane =  SceneJS.material({
            baseColor:  { r: 0.5, g: 0.5, b: 1.0 },
            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
            emit: 0.0, specular: 0.0, shine: 3.0},

                // DIRECTION MARKERS 
                SceneJS.translate({id: "North", x:4.5,y:0.2}),
                SceneJS.translate({id: "South", x:-4.5,y:0.2}),
                SceneJS.translate({id: "East", z:4.5,y:0.2}),
                SceneJS.translate({id: "West", z:-4.5,y:0.2}),
                SceneJS.scale({y:0.01},SceneJS.sphere({radius: 9.0}))
                )
                );

        this.earthPlane.setEnabled(false);

        this.root.addNode(this.earth = new Planet({betaRotate:180.0, dist: 0.0, scale: 0.4, emit:0.0, color: colors["Earth"], id: this.name+"Earth"}));

        this.root.addNode(this.curve = SceneJS.material({
            baseColor:      { r: 0.0, g: 0.0, b: 0.0 },
            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
            emit: 1.0, specular: 0.0, shine: 1.0
        }));

        this.root.addNode(this.sphere[0] = new Spherical({inner_id: "S0", scale: 9, axisAngle: 0.0, speed: 0.0, color: colors["S0"]}));


        this.updateList = [];
        this.updateList[0] = this.sphere[0];
        for (var i = 1; i < this.sphere.length; i++) {
            tmp = this.sphere[i] = new Spherical({inner_id: "S" + i + "", scale: 9, axisAngle: 0.0, speed: 0.0, color: colors["S" + i + ""]});
            this.sphere[i - 1].anchor.addNode(tmp);
            this.updateList.push(tmp);

        }
        this.sphere[this.sphere.length - 1].anchor.addNode(this.planet = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: params.name+"Planet",  color:colors["Planet"] }));

        for (i in this.sphere) {
            this["setSpeed" + i] = new Function("value", "this.sphere[" + i + "].setSpeed(value);");
            this["setAxisAngle" + i] = new Function("value", "this.sphere[" + i + "].setAxisAngle(value);");
            this["setRotateStart" + i] = new Function("value", "this.sphere[" + i + "].setRotateStart(value);");
            this["getSpeed" + i] = new Function("return this.sphere[" + i + "].getSpeed();");
            this["getAxisAngle" + i] = new Function("return this.sphere[" + i + "].getAxisAngle();");
            this["getRotateStart" + i] = new Function("return this.sphere[" + i + "].getRotateStart();");
            this["setShowSphere" + i] = new Function("state", "this.sphere[" + i + "].setVisuals([\"equator\",\"npole\",\"spole\",\"rotationarc\",\"markerarc\",\"arc1\",\"arc2\",\"markerball\"], state);");
        }

        this.sphere[1].addNode(this.stars = new SceneJS.cloud({count:400, scale:20.0}));

        this["showSphere0"] = function(state) {
          this.sphere[0].setVisuals(["equator","npole","spole","rotationarc","markerarc","markerball"], state);
        } 

        this.sphere[0].curve.addNode(this.systemSun[0] = new Spherical({ scale: 9, axisAngle: 24.0, speed: 365.0, color: {r:0.2, g:0.2, b:1.0}},
                this.systemSun[1] = new Spherical({ scale: 9, axisAngle: 0.5, speed: 0.0 },
                        this.sun = new Planet({  betaRotate: 90.0, emit: 0.5, scale: 0.3, dist: 9.0, inner_id: params.name+"Sun", color:colors["Sun"] })
                        )
                )
                );

        this.updateList[this.sphere.length] = this.systemSun[0];
        this.updateList[this.sphere.length+1] = this.systemSun[1];

        this.root.setEnabled(false);

    }

    this.setCurrentPlanet = function(node) {

        this.currentPlanet = {
            sunDist: 8,
            color:colors["Planet"],
            betaRotate: 90.0,
            sphere: [
                {axisAngle: 38.0, speed: 0, rotateStart: 0 },
                {axisAngle: 24.0,  speed: 365, rotateStart: 0 },
                {axisAngle: 90.0, speed: 570, rotateStart: 0 },
                {axisAngle: 18.0, speed: 0, rotateStart: 0 },
            ]
        };

        $.extend(true, this.currentPlanet, node);

        //TODO: better merge
        for(i in this.sphere)
          $.extend(true, this.sphere[i], this.currentPlanet.sphere[i]);
        
        this.sun.setDist(this.currentPlanet.sunDist);
        this.planet.setBeta(this.currentPlanet.betaRotate);
        if(this.sphere[3]) this.sphere[3].setArcBeta(this.currentPlanet.betaRotate);

        this.sphere[0].setVisuals(["arc1","arc2"], false);

        this.systemSun[0].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], false);
        this.systemSun[1].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], false);

    }


    this.removeCurve = function(node) {
        if (this.curves[node])
            this.curves[node].destroy();
    }

    this.addCurve = function(node, anchor, curvePos, color) {
        this.curves[node] = new Curve({pos: curvePos});
        anchor.setBaseColor(color);
        anchor.addNode(this.curves[node]);
    }
    this.running=true;
    this.pause = function() {
      this.running=!this.running;
      
    }
    this.update = function() {
        
        if(this.running)   
          for (i in model.updateList) {
              model.updateList[i].update((365.0/this.fps)/this.speed);
          }
        this.time++;
        this.render();
    }


    this.render = function() {

        if (this.currentPos != "Free") {
            if (this.currentLookAt != "Free")
                this.lookAt.setTarget(getNodePos(this.name+this.currentLookAt));
        } else {
            if (this.currentLookAt != "Free")
                this.lookAt.rotateTarget(getNodePos(this.name+this.currentLookAt));
        }


        //TODO: on model change -> events?
        sunPos = getNodePos(this.name+"Sun");
        this.light.setPos(sunPos);
        if (this.sun.getEnabled() &&
            distance(sunPos, getNodePos(this.name+"Planet")) < 2.0)
            this.planet.setShade({r: 0.4, g: 0.4, b:0.4});
        else
            this.planet.setShade(model.currentPlanet.color);

        this.scene.render();
        //this.label(this.name+"Sun","Sun");
        //this.label(this.name+"Planet","Planet");
        //this.label("North","North");
        //this.label("South","South");
        //this.label("East","East");
        //this.label("West","West");

    }

    this.label = function(node,text) {
        $("#"+node).remove();
        var pos = getNodePosCanvas(node);
        
        $("body").append("<div id='"+node+"'; class='label' style='top:"+pos.y+"px;left:"+ pos.x+ "px;'>" +  text + "</div>");
    }


    this.reset = function () {
        if (this.sphere.length == 0) return;
        for (var i = 0; i < this.sphere.length; i++) {
            this.sphere[i].setRotateAngle(this.sphere[i].rotateStart);
        }

        this.systemSun[0].setRotateAngle(0);
        this.systemSun[1].setRotateAngle(0);

    }

    this.changeView = function(node) {
        if (node == "Free") pos = { x: 0.0, y: 0.0, z: -25 };
        else pos = getNodePos(this.name+node);

        this.earth.setEnabled(true);
        this.planet.setEnabled(true);
        this.earthPlane.setEnabled(false);


        if (node == "Earth") {
            this.earthPlane.setEnabled(true);
            this.earth.setEnabled(false);
            pos.y = 0.5;
            pos.z = 0.5;

            this.lookAt.dir = $V([0,0,1]);
            this.lookAt.up = $V([0,1,0]);
            this.lookAt.right = $V([1,0,0]);
            this.lookAt.update();

        }

        //  if(node=="earth") earth.setEnabled(false);
        if (node == "Planet") {
            this.planet.setEnabled(false);
        }

        this.lookAt.setEye(pos);
        this.lookAt.update();
    }


    // TODO: deprecated
    this.visMode = function(sys, state) {
        if (sys == "stars") {
            this.stars.setEnabled(state.checked);
            return;
        }

        this.sphere[sys].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], state.checked);
    }


    this.calcCurve = function(start, node) {
        curvePos = [];
        oldAngle = [];
        oldRotate = [];
        step = 0;

        // save axis
        for (var i = 0; i <= start; i++) {
            oldAngle[i] = this.sphere[i].getAxisAngle();
            oldRotate[i] = this.sphere[i].getRotateAngle();
            this.sphere[i].setAxisAngle(0.0);
            this.sphere[i].setRotateAngle(0.0);
        }

        for (var i = start + 1; i < this.sphere.length; i++) {
            oldRotate[i] = this.sphere[i].getRotateAngle();
            this.sphere[i].update(-20.0);
            step += Math.abs(this.sphere[i].getStep());
        }

        for (var j = 0; j < 80; j++) {
            for (var i = start + 1; i < this.sphere.length; i++) {
                this.sphere[i].update(20.0 / step);
            }
            pos = getNodePos(node);
            curvePos.push(pos);
        }
        // restore axis
        for (var i = 0; i <= start; i++)
            this.sphere[i].setAxisAngle(oldAngle[i]);

        // restore rotation
        for (var i = 0; i < this.sphere.length; i++)
            this.sphere[i].setRotateAngle(oldRotate[i]);


        return curvePos;
    }


}

