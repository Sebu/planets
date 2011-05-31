



/**
 * @constructor
 */
BasePlanetModel = function() {


    this.currentPlanet = {};
    this.currentPos = "Free";
    this.currentLookAt = "Earth";
    this.speed0Factor = 100;

    // model specific moon
//    this.sunYear = 365.0;
    this.days = 0;
    this.lastAngle = 0;
    this.lastPerp = 0;
    this.eclipticAngle2 = 0;

    this.setSpeed(60);
    this.running=true;

    
};

BasePlanetModel.prototype.constructor = BasePlanetModel;

BasePlanetModel.prototype = {


    setShowCurve0 : function(state) { this.curves[0].setEnabled(state); },
    getShowCurve0 : function() { if(!this.curves[0]) return true; return this.curves[0].getEnabled(); },
    setShowCurve1 : function(state) { this.curves[1].setEnabled(state); },
    getShowCurve1 : function() { if(!this.curves[1]) return true; return this.curves[1].getEnabled(); },
    setShowStars : function(state) { this.stars.setEnabled(state); },
    getShowStars : function() { return this.stars.getEnabled(); },


    setSpeed : function(val) {
        this.speed = val;
    },
    
    getSpeed : function() {
        return this.speed;
    },
    
    // SETUP
    // base structure
    // planet system
    init : function(params) {
        this.name = params.name;
        this.curves = {};
        this.sphere = new Array(params.spheres);
        this.updateList = [];
        this.systemSun = [];
        this.viewPoints = {"Free":0, "Earth":0, "Planet":0};
        this.viewPresets = {"World": {from: "Free",at:"Earth"}, "Earth": {from: "Earth",at:"Free"}};

        this.light = Sunlight();

        this.camera = params.renderer.camera;
        this.renderer = params.renderer;
        this.root = this.renderer.newScene();
        this.root.addNode(this.light);


        // DIRECTION MARKERS
        this.root.addNode( this.north = new Translate({id: "North", x:-4.5,y:0.2}) );
        this.root.addNode( this.south = new Translate({id: "South", x:4.5,y:0.2}) );
        this.root.addNode( this.east = new Translate({id: "East", z:-4.5,y:0.2}) );
        this.root.addNode( this.west = new Translate({id: "West", z:4.5,y:0.2}) );

        // planet surface for earth view
        this.root.addNode(this.earthPlane = new Disc({radius: 9.0}) );
        this.earthPlane.setEnabled(false);

        
        this.earth = new Planet({betaRotate:180.0, dist: 0.0, scale: 0.4, emit:0.0, color: colors["Earth"], inner_id: this.name+"Earth"})
        this.root.addNode(this.earth);

        // first and outer sphere
        this.sphere[0] = new Spherical({inner_id: this.name+"S0", scale: 9, axisAngle: 33.0, speed: 0.0, color: colors["S0"]})
        this.root.addNode(this.sphere[0]);
        this.updateList[0] = this.sphere[0];

        // additional spheres
        for (var i = 1; i < this.sphere.length; i++) {
            tmp = this.sphere[i] = new Spherical({inner_id: this.name+"S" + i + "", scale: 9-i*0.02, axisAngle: 33.0, speed: 0.0, color: colors["S" + i + ""]});
            this.sphere[i - 1].anchor.addNode(tmp);
            this.updateList.push(tmp);

        }
        this.sphere[this.sphere.length - 1].anchor.addNode(this.planet = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: params.name+"Planet",  color:colors["Planet"] }));

        // TODO: remove them, use model.sphere[x] etc.
        // create some shortcuts
        for (i in this.sphere) {
            this["setSpeed" + i] = new Function("value", "this.sphere[" + i + "].setSpeed(value);");
            this["setAxisAngle" + i] = new Function("value", "this.sphere[" + i + "].setAxisAngle(value);");
            this["setRotateStart" + i] = new Function("value", "this.sphere[" + i + "].setRotateStart(value);");
            this["getSpeed" + i] = new Function("return this.sphere[" + i + "].getSpeed();");
            this["getAxisAngle" + i] = new Function("return this.sphere[" + i + "].getAxisAngle();");
            this["getRotateStart" + i] = new Function("return this.sphere[" + i + "].getRotateStart();");
            this["setShowSphere" + i] = new Function("state", "this.sphere[" + i + "].setVisuals([\"equator\",\"npole\",\"spole\",\"rotationarc\",\"markerarc\",\"arc1\",\"arc2\",\"markerball\"], state);");
            this["getShowSphere" + i] = function() { return true; };

        }
        
        // TODO: hacky all over
        this.setSpeed0 = function(speed) {
          if (this.sphere[0].getSpeed()==0 && speed == 1) {
            this.setSpeed(this.getSpeed()*this.speed0Factor);
          } else if(this.sphere[0].getSpeed()!=0 && speed == 0) {
            this.setSpeed(this.getSpeed()/this.speed0Factor);
          }
          $("#Speed > input").attr("value",Number(this.getSpeed()));
          this.sphere[0].setSpeed(-speed);
        }

        //TODO: hack white north pole
        this.sphere[0].visuals.npole.materials = [ new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ];

        // add stars
        this.sphere[0].anchor.addNode( this.stars = new Cloud({count:50}) );
        
        //TODO: deprecated?
        this.showSphere0 = function(state) {
            this.sphere[0].setVisuals(["equator","npole","spole","rotationarc","markerarc","markerball"], state);
        }

        // add Sun and sun spheres
        this.sphere[1].addNode(this.systemSun[0] = new Spherical({ scale: 9, axisAngle: 0.0, speed: 0.0, color: {r:0.2, g:0.2, b:1.0}}));
        this.systemSun[0].anchor.addNode(this.sun = new Planet({  betaRotate: 90.0, emit: 0.5, scale: 0.3, dist: 9.0, inner_id: params.name+"Sun", color:colors["Sun"] }));
        this.updateList[this.sphere.length] = this.systemSun[0];
        // shortcuts for the sun

        this.setSunSpeed = function(value) { this.systemSun[0].setSpeed(value); };
        this.getSunSpeed = function() { return this.systemSun[0].getSpeed(); };
  
        // hide everything
        this.root.setEnabled(false);

    },

    setCurrentPlanet : function(node) {

    	// default planet settings
        this.currentPlanet = {
            sunDist: 8,
            color: colors["Planet"],
            betaRotate: 90.0,
            label: "Planet",
            showStars: true,
            showSun: true,
            sphere: [
                {axisAngle: 38.0, speed: 0, rotateStart: 0, visible: true },
                {axisAngle: 24.0,  speed: 365, rotateStart: 0, visible: true },
                {axisAngle: 90.0, speed: 570, rotateStart: 0, visible: true },
                {axisAngle: 18.0, speed: 0, rotateStart: 0, visible: true }
            ]
        };
        // extend default settings  
        $.extend(true, this.currentPlanet, node);
        
        //TODO: better merge
        for(var i in this.sphere) {
            $.extend(true, this.sphere[i], this.currentPlanet.sphere[i]);
            if(this.currentPlanet.sphere[i]) this.sphere[i].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], this.currentPlanet.sphere[i].visible);
        }
        
        this.setShowStars(this.currentPlanet.showStars);
        this.sun.setDist(this.currentPlanet.sunDist);
        this.planet.setBeta(this.currentPlanet.betaRotate);
        this.planet.setShade(this.currentPlanet.color);
        this.setSunSpeed(365);
        this.sun.setEnabled(this.currentPlanet.showSun);
        if(this.sphere[3]) this.sphere[3].setArcBeta(this.currentPlanet.betaRotate);

        // hide arcs of outer sphere
        this.sphere[0].setVisuals(["arc1","arc2"], false);

        // hide sun sphere
        this.systemSun[0].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], false);

        // reset everything
        this.reset();
    },

    // stop/start/pause toggle of the model
    setRunning : function(state) {
        this.running=state;
    },
    tooglePause : function() {
        this.running=!this.running;
    },


    // update movement and parameters
    // TODO: comments!!!!
    update : function(time) {

        if(this.running) {
        	
            var earthPos = sceneToSyl(this.earth.mesh.currentPos());
            var polePos = sceneToSyl(this.sphere[1].visuals.npole.currentPos());
            var upVec = earthPos.subtract(polePos);
            var planetOnPlane = this.sphere[1].getPlane().pointClosestTo(sceneToSyl(this.planet.mesh.currentPos())).subtract(earthPos);
            var planetPos = sceneToSyl(this.planet.mesh.currentPos()).subtract(earthPos);

            var sunOnPlane = model.sphere[1].getPlane().pointClosestTo(sceneToSyl(this.sun.mesh.currentPos())).subtract(earthPos);
            var sunOnPlanePerp = sunOnPlane.rotate(Math.PI/2, Line.create(earthPos,upVec));

            var equinoxOnPlane = sceneToSyl(this.sphere[0].visuals.markerball.currentPos()).subtract(earthPos);

            var equinoxOnPlanePerp = equinoxOnPlane.rotate(Math.PI/2, Line.create(earthPos,upVec));
            this.sunAngle = calcAngle(planetOnPlane, sunOnPlane);


            // shade planet if sun is in a 15deg region
            if (this.sun.getEnabled() && this.sunAngle<=15)
                this.planet.setShade({r: 0.4, g: 0.4, b: 0.4});
            else
                this.planet.setShade(this.currentPlanet.color);

            // dot product angle fix > 90
            if (calcAngle(planetOnPlane, sunOnPlanePerp)<90)
                this.sunAngle = -this.sunAngle;


            this.lastAngle = this.eclipticAngle2;
            this.lastPerp = this.perpAngle;
            this.eclipticAngle2 = this.eclipticAngle = calcAngle(planetOnPlane, equinoxOnPlane);
            this.perpAngle = calcAngle(planetOnPlane, equinoxOnPlanePerp);

            // HACK: dot product angle fix > 90
            if (this.perpAngle<=90)
                this.eclipticAngle2 = 360-this.eclipticAngle2;
            if (this.perpAngle>90 && this.lastPerp<90)
                this.lastAngle  -=360;
            this.latitude = calcAngle(upVec,planetPos)-90;

            this.eclipticSpeed = (this.eclipticAngle2 - this.lastAngle)/time*(this.speed/this.systemSun[0].getSpeed());



            // OTHER
            // days determined by sun speed
            this.days += (this.systemSun[0].getSpeed()/this.speed)*time;
            
            // update movement of all spheres
            for (i in model.updateList) {
                model.updateList[i].updateMovement((365.0*time)/this.speed);
            }
            //TODO: on model change -> events?
            if(this.sun.getEnabled()) this.light.setPos(this.sun.mesh.currentPos());
        }

        if (this.currentPos != "Free") {
          if (this.currentLookAt != "Free") {
            this.camera.setTarget(getNodePos(this.name+this.currentLookAt));
            }
        } else {
          if (this.currentLookAt != "Free")
              this.camera.rotateTarget({x: 0, y: 0, z: 0});
        }
    },

    // reset movement of spheres and parameters 
    reset : function () {
        if (this.sphere.length == 0) return;
        for (i = 0; i < this.sphere.length; i++) {
            this.sphere[i].setRotateAngle(this.sphere[i].rotateStart);
        }
        this.systemSun[0].setRotateAngle(0);
        this.days = 0;
        this.lastAngle = 0;
        this.lastPerp = 0
        this.eclipticAngle2 = 0;        

    },

    
    changeView : function(node) {
        if (node == "Free") var pos = { x: 0.0, y: 0.0, z: -19 };
        else var pos = getNodePos(this.name+node);

        this.earth.setEnabled(true);
        this.planet.setEnabled(true);
        this.earthPlane.setEnabled(false);


        if (node == "Earth") {
            this.earthPlane.setEnabled(true);
            this.earth.setEnabled(false);
            pos.y = 0.5;
            pos.z = 0.0;

        }

        if (node == "Planet") {
            this.planet.setEnabled(false);
        }

        this.camera.right = $V([1,0,0]);
        this.camera.upVec = $V([0,1,0]);
        this.camera.dir = $V([0,0,1]);
        this.camera.setEye(pos);
        this.camera.updateNew();
    },


    // update or create&add a curve (hippopede or path) to an anchor node 
    addCurve : function(params) {
        if(!this.curves[params.index]) {
            this.curves[params.index] = new Curve({trails: params.trails, pos: this.calcCurve({start: params.start, node: params.node}), color: params.color});
            params.anchor.addNode(this.curves[params.index]);
        } else {
            if(this.curves[params.index].getEnabled()) this.curves[params.index].setPos( this.calcCurve({start: params.start, node: params.node}) );
        }
    },
    
    calcCurve : function(params) {
        curvePos = [];
        oldAngle = [];
        oldRotate = [];
        var step = 0;
        var start = params.start;
        var node = params.node;
        var maxSegments = params.segments || 80; //-Math.round(20/step);
        var j = params.start || -20;
      
        // save axis and rotation
        for ( i = 0; i <= start; i++) {
            oldAngle[i] = this.sphere[i].getAxisAngle();
            oldRotate[i] = this.sphere[i].getRotateAngle();
            this.sphere[i].setAxisAngle(0.0);
            this.sphere[i].setRotateAngle(0.0);
        }

        // approximate step width
        for (i = start + 1; i < this.sphere.length; i++) {
            oldRotate[i] = this.sphere[i].getRotateAngle();
            step += Math.abs(this.sphere[i].getStep());
        }
        step = 10.0/step;
        
        // calculate positions of curve points
        for (; j < maxSegments; j++) {
            for (i = start + 1; i < this.sphere.length; i++) {
                angle = this.sphere[i].rotateAngle + j*(this.sphere[i].step * step);
                this.sphere[i].anchor.rotation.y = degToRad(angle);
            }
            var pos = node.currentPos();
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

