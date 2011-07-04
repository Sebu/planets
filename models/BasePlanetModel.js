



/**
 * @constructor
 */
BasePlanetModel = function() {


    this.showCurve = [];
    this.showCurve[0] = true;
    this.showCurve[1] = true;
    
    this.currentPlanet = {};
    this.currentPos = "Free";
    this.currentLookAt = "Earth";
    this.speed0Factor = 100;

    // model specific moon
    this.days = 0;

    this.setAnimSpeed(60);
    this.running=true;

    
};

BasePlanetModel.prototype.constructor = BasePlanetModel;

BasePlanetModel.prototype = {


    setShowCurve0 : function(state) { this.showCurve[0] = state; if(this.curves[0]) this.curves[0].setEnabled(state); },
    getShowCurve0 : function() { if(!this.curves[0]) return this.showCurve[0]; },
    setShowCurve1 : function(state) { this.showCurve[1] = state; if(this.curves[1]) this.curves[1].setEnabled(state); },
    getShowCurve1 : function() { return this.showCurve[1]; },
    setShowStars : function(state) { this.stars.setEnabled(state); },
    getShowStars : function() { return this.stars.getEnabled(); },


    setAnimSpeed : function(val) {
        this.speed = val;
    },
    
    getAnimSpeed : function() {
        return this.speed;
    },
    
    // SETUP
    // base structure
    // planet system
    genSpheres : function(params) {
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
// {r: 0.992, g: 0.906, b: 0.796}
        this.root.addNode(this.earthPlane = new Disc({radius: 9.0, color: colors["Earth"]}) );
        this.earthPlane.setEnabled(false);

        
        this.earth = new Planet({betaRotate:180.0, dist: 0.0, scale: 0.4, emit:0.0, color: colors["Earth"], inner_id: this.name+"Earth"})
        this.root.addNode(this.earth);

        // first and outer sphere
        this.sphere[1] = new Spherical({inner_id: this.name+"S1", scale: 9,  color: colors["S1"]})
        this.root.addNode(this.sphere[1]);
        this.updateList[0] = this.sphere[1];

        // additional spheres
        for (var i = 2; i <= params.spheres; i++) {
            console.log(i); 
            tmp = this.sphere[i] = new Spherical({inner_id: this.name+"S" + i + "", scale: 9-i*0.02, color: colors["S" + i + ""]});
            this.sphere[i - 1].anchor.addNode(tmp);
            this.updateList.push(tmp);

        }
        this.sphere[params.spheres].anchor.addNode(this.planet = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: params.name+"Planet",  color:colors["Planet"] }));

        // TODO: remove them, use model.sphere[x] etc.
        // create some shortcuts
        for (i in this.sphere) {
            console.log(i);
            this["setSpeed" + i] = new Function("value", "this.sphere[" + i + "].setSpeed(value);");
            this["setAxisAngle" + i] = new Function("value", "this.sphere[" + i + "].setAxisAngle(value);");
            this["setRotateStart" + i] = new Function("value", "this.sphere[" + i + "].setRotateStart(value);");
            this["getSpeed" + i] = new Function("return this.sphere[" + i + "].getSpeed();");
            this["getAxisAngle" + i] = new Function("return this.sphere[" + i + "].getAxisAngle();");
            this["getRotateStart" + i] = new Function("return this.sphere[" + i + "].getRotateStart();");
            this["setShowSphere" + i] = new Function("state", "console.log(state); this.sphere[" + i + "].setVisuals([\"equator\",\"npole\",\"spole\",\"rotationarc\",\"markerarc\",\"arc1\",\"arc2\",\"markerball\",\"markerend\"], state);");
            this["getShowSphere" + i] = function() { return true; };

        }
        
        // TODO: hacky all over
        this.setSpeed1 = function(speed) {
//          console.log(speed);
          if (this.sphere[1].getSpeed()==0 && speed == 1) {
            this.setAnimSpeed(this.getAnimSpeed()*this.speed0Factor);
          } else if(this.sphere[1].getSpeed()!=0 && speed == 0) {
            this.setAnimSpeed(this.getAnimSpeed()/this.speed0Factor);
          }
          $("#AnimSpeed > input").attr("value",Number(this.getAnimSpeed()));
          this.sphere[1].setSpeed(-speed);
        }

   
        //TODO: hack white north pole
        this.sphere[1].visuals.npole.materials = [ new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ];

        // add stars
        this.sphere[1].anchor.addNode( this.stars = new Cloud({count:50}) );
        
        //TODO: deprecated? / override
        this.showSphere1 = function(state) {
            this.sphere[1].setVisuals(["equator","npole","spole","rotationarc","markerarc","markerball","markerend"], state);
        }

        // add Sun and sun spheres
        this.sphere[2].pivot.addNode(this.systemSun[0] = new Spherical({ scale: 9, axisAngle: 0.0, speed: 0.0, color: {r:0.2, g:0.2, b:1.0}}));
        this.systemSun[0].anchor.addNode(this.sun = new Planet({  betaRotate: 90.0, emit: 0.5, scale: 0.3, dist: 9.0, inner_id: params.name+"Sun", color:colors["Sun"] }));
        this.updateList[this.sphere.length] = this.systemSun[0];
        // shortcuts for the sun

        this.setSunSpeed = function(value) { this.systemSun[0].setSpeed(value); };
        this.getSunSpeed = function() { return this.systemSun[0].getSpeed(); };
  
        // hide everything
        this.root.setEnabled(false);

    },

    loadPreset : function(node) {

    	// default planet settings
        this.currentPlanet = {
            sunDist: 8,
            color: colors["Planet"],
            betaRotate: 90.0,
            label: "Planet",
            showStars: true,
            showHippo: true,
            showPath: true,
            showSun: true,
            sphere: [
                {axisAngle: 38.0, speed: 0, rotateStart: 0, visible: true },
                {axisAngle: 24.0,  speed: 365, rotateStart: 0, visible: true },
                {axisAngle: 90.0, speed: 570, rotateStart: 0, visible: true },
                {axisAngle: 18.0, speed: 0, rotateStart: 0, visible: true },
                {axisAngle: 0.0, speed: 0, rotateStart: 0, visible: true },
                {axisAngle: 0.0, speed: 0, rotateStart: 0, visible: true },
                {axisAngle: 0.0, speed: 0, rotateStart: 0, visible: true },
                {axisAngle: 0.0, speed: 0, rotateStart: 0, visible: true }
            ]
        };
        // extend default settings  
        $.extend(true, this.currentPlanet, node);
        
        this.ui = this.currentPlanet.ui;
        
        //TODO: better merge
        for(var i in this.sphere) {
            $.extend(true, this.sphere[i], this.currentPlanet.sphere[i-1]);
            if(this.currentPlanet.sphere[i]) this["setShowSphere"+i](this.currentPlanet.sphere[i-1].visible);
        }
        
        this.setShowStars(this.currentPlanet.showStars);
        this.setShowCurve0(this.currentPlanet.showPath);
        this.setShowCurve1(this.currentPlanet.showHippo);
        this.sun.setDist(this.currentPlanet.sunDist);
        this.planet.setBeta(this.currentPlanet.betaRotate);
        this.planet.setShade(this.currentPlanet.color);
        this.setSunSpeed(365);
        this.sun.setEnabled(this.currentPlanet.showSun);
        if(this.sphere[4]) this.sphere[4].setArcBeta(this.currentPlanet.betaRotate);

        // hide arcs of outer sphere
        this.sphere[1].setVisuals(["arc1","arc2"], false);

        // hide sun sphere
        this.systemSun[0].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], false);

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


    setDate : function(value) {
      
      var date = Number(value);
      if(date)
        this.addDays(date);
      else {  
        var date = value.toString().split(".");
        if(date.length!=3) return;
        console.log(date);
        var realDays = Utils.gregorianToJd(date[2], date[1], date[0]);
        console.log(realDays);
        var days = realDays - this.startDate;
        this.setDays(days);  
        console.log(days);//.toString().split("/"));
      }
      
    },

    getDate : function() {
      return "";
    },

    updatePlanetMetadata : function(planet, dayRef, epiRef, time) {
            var earthPos = sceneToSyl(epiRef.anchor.currentPos()); //this.earth.mesh.currentPos());
            var polePos = sceneToSyl(epiRef.visuals.npole.currentPos());
            var upVec = earthPos.subtract(polePos);
            var planetOnPlane = epiRef.getPlane().pointClosestTo(sceneToSyl(planet.mesh.currentPos())).subtract(earthPos);
            var planetPos = sceneToSyl(planet.mesh.currentPos()).subtract(earthPos);

            var equinoxOnPlane = sceneToSyl(dayRef.visuals.markerball.currentPos()).subtract(earthPos);

            var equinoxOnPlanePerp = equinoxOnPlane.rotate(Math.PI/2, Line.create(earthPos,upVec));



            var sunOnPlane = epiRef.getPlane().pointClosestTo(sceneToSyl(this.sun.mesh.currentPos())).subtract(earthPos);
            var sunOnPlanePerp = sunOnPlane.rotate(Math.PI/2, Line.create(earthPos,upVec));
            planet.sunAngle = calcAngle(planetOnPlane, sunOnPlane);

            // shade planet if sun is in a 15deg region
            if (this.sun.getEnabled() && this.sunAngle<=15)
                planet.setShade({r: 0.4, g: 0.4, b: 0.4});
            else
                planet.setShade(this.currentPlanet.color);

            // dot product angle fix > 90
            if (calcAngle(planetOnPlane, sunOnPlanePerp)<90)
                planet.sunAngle = -planet.sunAngle;


            planet.lastLongitude = planet.longitude;
            planet.lastPerp = planet.perpAngle;
            planet.longitude = calcAngle(planetOnPlane, equinoxOnPlane);
            planet.perpAngle = calcAngle(planetOnPlane, equinoxOnPlanePerp);

            // HACK: dot product angle fix > 90
            if (planet.perpAngle<=90)
                planet.longitude = 360-planet.longitude;
            if (planet.perpAngle>90 && planet.lastPerp<90)
                planet.lastLongitude -= 360;
            planet.latitude = calcAngle(upVec,planetPos)-90;

            // days passed
            var dayDelta = (this.systemSun[0].getSpeed()/this.speed)*time;
            
            // latitude speed in deg per day
            planet.longitudeSpeed = (planet.longitude - planet.lastLongitude)/dayDelta;
    },


    // update movement and parameters
    // TODO: comments!!!!
    update : function(time) {

        if(this.running) {
            // update movement of all spheres
            for (i in model.updateList) {
                model.updateList[i].updateMovement((365.0*time)/this.speed);
            }        
        	
            this.updatePlanetMetadata(this.planet,this.sphere[1],this.sphere[2], time);
            //time*(this.speed/this.systemSun[0].getSpeed());

            var dayDelta = (this.systemSun[0].getSpeed()/this.speed)*time;
            // OTHER
            // days determined by sun speed
            this.days += dayDelta;

            //TODO: on model change -> events?
            if(this.sun.getEnabled()) this.light.setPos(this.sun.mesh.currentPos());
        }


        if (this.currentPos != "Free") {
          if (this.currentLookAt != "Free") {
//            this.camera.setTarget(getNodePos(this.name+this.currentLookAt));
            }
        } else {
          if (this.currentLookAt != "Free") {
             this.camera.rotateTarget({x: 0, y: 0, z: 0});
            }
        }
    },


     getDays : function() {
         return this.days;
     },

    addDays : function(days) {
      this.days += days;
      var time = days/this.systemSun[0].getSpeed();
        for (i in model.updateList) {
           model.updateList[i].updateMovement((365.0*time));
        }
    },

     setDays : function(days) {
        this.reset();
        this.addDays(days);
     },
    
    // reset movement of spheres and parameters 
    reset : function () {
        for (var i in this.sphere) {
            this.sphere[i].setRotateAngle(this.sphere[i].rotateStart);
        }
        this.systemSun[0].setRotateAngle(0);
        this.days = 0;
        this.planet.reset();
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
        if(!this.showCurve[params.index]) return;
        if(!this.curves[params.index]) {
            this.curves[params.index] = new Curve({trails: params.trails, pos: this.calcCurve({start: params.start, node: params.node}), color: params.color});
            params.anchor.addNode(this.curves[params.index]);
        } else {
            this.curves[params.index].setPos( this.calcCurve({start: params.start, node: params.node}) );
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
        var j =  -10;
      
        // save axis and rotation
        for ( i = 1; i <= start; i++) {
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
        for (i = start + 1; i < this.sphere.length; i++) {
          this.sphere[i].updateMovement(j*step);
        }
            
        for (; j < maxSegments; j++) {
            for (i = start + 1; i < this.sphere.length; i++) {
                this.sphere[i].updateMovement(step);
//                angle = this.sphere[i].rotateAngle + j*(this.sphere[i].step * step);
//                this.sphere[i].anchor.rotation.y = degToRad(angle);
            }
            var pos = node.currentPos();
            curvePos.push(pos);
        }
        
        // restore axis
        for (var i = 1; i <= start; i++)
            this.sphere[i].setAxisAngle(oldAngle[i]);

        // restore rotation
        for (var i = 1; i < this.sphere.length; i++)
            this.sphere[i].setRotateAngle(oldRotate[i]);


        return curvePos;
    }


}

