


BaseMixin = function() {
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }
    
        // TODO: hacky all over
    this.setSpeed1 = function(speed) {
          if (this.sphere[1].getSpeed()==0 && speed == 1) {
            this.setAnimSpeed(this.getAnimSpeed()*this.speed0Factor);
          } else if(this.sphere[1].getSpeed()!=0 && speed == 0) {
            this.setAnimSpeed(this.getAnimSpeed()/this.speed0Factor);
          }
          $("#AnimSpeed > input").attr("value",Number(this.getAnimSpeed()));
          this.sphere[1].setSpeed(-speed);
    }
}

/**
 * @constructor
 */
ModelBase = function() {


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

ModelBase.prototype.constructor = ModelBase;

ModelBase.prototype = {


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
//        this.viewPoints = {"Free":0, "Earth":0, "Planet":0};
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

        
        // first and outer sphere
        this.sphere[1] = new Spherical({inner_id: this.name+"S1", scale: 9,  color: colors["S1"]})
        
        this.earth = new Planet({
            betaRotate:180.0,
            dist: 0.0, scale: 0.6,
            emit:0.0, 
//            map: THREE.ImageUtils.loadTexture('textures/earthmap1k.jpg'),
            color: colors["Earth"],
            inner_id: this.name+"Earth"})
        this.sphere[1].addNode(this.earth);
        
        this.root.addNode(this.sphere[1]);
        this.updateList[0] = this.sphere[1];

        // additional spheres
        for (var i = 2; i <= params.spheres; i++) {
            tmp = this.sphere[i] = new Spherical({inner_id: this.name+"S" + i + "", scale: 9-i*0.1, color: colors["S" + i + ""]});
            this.sphere[i - 1].anchor.addNode(tmp);
            this.updateList.push(tmp);
        }
        
        this.sphere[params.spheres].anchor.addNode(this.planet = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: params.name+"Planet",  color:colors["Planet"] }));

        // TODO: remove them, use model.sphere[x] etc.
        // create some shortcuts
        for (i in this.sphere) {
            this["setSpeed" + i] = new Function("value", "this.sphere[" + i + "].setSpeed(value);");
            this["setStep" + i] = new Function("value", "this.sphere[" + i + "].setStep(value);");
            this["setAxisAngle" + i] = new Function("value", "this.sphere[" + i + "].setAxisAngle(value);");
            this["setRotateStart" + i] = new Function("value", "this.sphere[" + i + "].setRotateStart(value);");
            this["getSpeed" + i] = new Function("return this.sphere[" + i + "].getSpeed();");
            this["getAxisAngle" + i] = new Function("return this.sphere[" + i + "].getAxisAngle();");
            this["getRotateStart" + i] = new Function("return this.sphere[" + i + "].getRotateStart();");
            this["setShowSphere" + i] = new Function("state", "this.sphere[" + i + "].setGfx([\"equator\",\"npole\",\"spole\",\"rotationarc\",\"markerarc\",\"arc1\",\"arc2\",\"markerball\",\"markerend\"], state);");
            this["getShowSphere" + i] = function() { return true; };

        }
        

   
        //TODO: hack white north pole
        this.sphere[1].gfx.npole.materials = [ new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ];

        // add stars
        this.sphere[1].anchor.addNode( this.stars = new Cloud({count:50}) );
        
        //TODO: deprecated? / override
        this.showSphere1 = function(state) {
            this.sphere[1].setGfx(["equator","npole","spole","rotationarc","markerarc","markerball","markerend"], state);
        }

        // add Sun and sun spheres
        this.sphere[2].pivot.addNode(this.ecliptic = new Spherical({ scale: 9, axisAngle: 0.0, speed: 0.0, color: {r:0.2, g:0.2, b:1.0}}));


        
        this.ecliptic.anchor.addNode(this.sun = new Planet({ glow: true, betaRotate: 90.0, emit: 0.5, scale: 0.3, dist: 9.0, inner_id: params.name+"Sun", color:colors["Sun"] }));
        this.updateList[this.sphere.length] = this.ecliptic;
        // shortcuts for the sun

        this.setSunSpeed = function(value) { this.ecliptic.setSpeed(value); };
        this.getSunSpeed = function() { return this.ecliptic.getSpeed(); };
  
        // hide everything
        this.root.setEnabled(false);

    },

    addLong : function() {    
      this.sphere[2].removeChild(this.sphere[3]);
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
//                {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: true },
//                {AxisAngle: 24.0, Speed: 365, RotateStart: 0, ShowSphere: true },
//                {AxisAngle: 90.0, Speed: 570, RotateStart: 0, ShowSphere: true },
//                {AxisAngle: 18.0, Speed: 0, RotateStart: 0, ShowSphere: true },
//                {AxisAngle: 0.0, Speed: 0, RotateStart: 0, Visible: true },
//                {AxisAngle: 0.0, Speed: 0, RotateStart: 0, Visible: true },
//                {AxisAngle: 0.0, Speed: 0, RotateStart: 0, Visible: true },
//                {AxisAngle: 0.0, Speed: 0, RotateStart: 0, Visible: true }
            ]
        };
        // extend default settings  
        $.extend(true, this.currentPlanet, node);
        
        this.ui = this.currentPlanet.ui;
        
        //TODO: better merge
        for(var i in this.currentPlanet.sphere) {
//            $.extend(true, this.sphere[i], this.currentPlanet.sphere[i-1]);
            for(var j in this.currentPlanet.sphere[i]) {
              this["set" + j + "" + (Number(i)+1)]( Utils.toDec( this.currentPlanet.sphere[i][j]) );
            }
//            if(this.currentPlanet.sphere[i]) this["setShowSphere"+i](this.currentPlanet.sphere[i-1].visible);
//            for(var b in this.currentPlanet.sphere[i]) { console.log(b); }
        }
        
        this.setShowStars(this.currentPlanet.showStars);
        this.setShowCurve0(this.currentPlanet.showPath);
        this.setShowCurve1(this.currentPlanet.showHippo);
        this.sun.setDist(this.currentPlanet.sunDist);
        this.planet.setBeta(this.currentPlanet.betaRotate);
        this.planet.setShade(this.currentPlanet.color);
        this.setSunSpeed(365.2466666);
//        this.sun.setEnabled(false);
        this.sun.setEnabled(this.currentPlanet.showSun);
        this.sun.setGlow(this.currentPlanet.showSun);
        if(this.sphere[4]) this.sphere[4].setArcBeta(this.currentPlanet.betaRotate);

        // hide arcs of outer sphere
        this.sphere[1].setGfx(["arc1","arc2"], false);
        this.sphere[2].pivot.addNode( this.equantPoint = new Translate({z:0.0}) );
        // hide sun sphere
        this.ecliptic.setGfx(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], false);

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
        if(date.length!=3) { 
          date = value.toString().split("/"); 
          var tmp = date[0];
          date[0] = date[1];
          date[1] = tmp;
        }
        if(date.length!=3) return;
        
        
        var realDays = Utils.magicToJd(Number(date[2]), Number(date[1]), Number(date[0]));
        var days = realDays - this.startDate;
        this.setDays(days);  
      }
      
    },

    getDate : function() {
      return "";
    },

    updatePlanetMetadata : function(planet, dayRef, ecliptic, epi) {
            
            //TODO: ecliptic latitude?
//            var earthPos = sceneToSyl(this.earth.mesh.currentPos()); 
//            var polePos = sceneToSyl(this.earth.npole.currentPos()); 
//            var upVec = earthPos.subtract(polePos);
            
            var eclipticPos = sceneToSyl(ecliptic.anchor.currentPos()),
            eclipticPolePos = sceneToSyl(ecliptic.gfx.npole.currentPos()),
            eclipticUpVec = eclipticPos.subtract(eclipticPolePos),
            
            planetOnPlane = ecliptic.getPlane().pointClosestTo(sceneToSyl(planet.mesh.currentPos())).subtract(eclipticPos),
            planetPos = sceneToSyl(planet.mesh.currentPos()).subtract(eclipticPos),

            equinoxOnPlane = sceneToSyl(dayRef.gfx.markerball.currentPos()).subtract(eclipticPos),
            equinoxOnPlanePerp = equinoxOnPlane.rotate(Math.PI/2, Line.create(eclipticPos,eclipticUpVec)),

            epiPos = sceneToSyl(this.equantPoint.currentPos()),
            epiOnPlane = sceneToSyl(epi.gfx.markerball.currentPos()).subtract(epiPos),

//            var equinoxOnEpiPlane = sceneToSyl(dayRef.gfx.markerball.currentPos()).subtract(epiPos);
//            var equinoxOnEpiPlanePerp = equinoxOnEpiPlane.rotate(Math.PI/2, Line.create(epiPos,eclipticUpVec));



            sunOnPlane = ecliptic.getPlane().pointClosestTo(sceneToSyl(this.sun.mesh.currentPos())).subtract(eclipticPos);
            sunOnPlanePerp = sunOnPlane.rotate(Math.PI/2, Line.create(eclipticPos, eclipticUpVec));

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
//*
            if (planet.perpAngle<=90)
                planet.longitude = 360-planet.longitude;
            if (planet.perpAngle>90 && planet.lastPerp<90)
                planet.lastLongitude -= 360;
//*/                


            planet.deferentLast = planet.deferentLongitude;
            planet.deferentLastPerp = planet.deferentPerp;
            planet.deferentLongitude = calcAngle(epiOnPlane, equinoxOnPlane);
            planet.deferentPerp = calcAngle(epiOnPlane, equinoxOnPlanePerp);
            if (planet.deferentPerp<=90)
                planet.deferentLongitude = 360-planet.deferentLongitude;
            if (planet.deferentPerp>90 && planet.deferentLastPerp<90)
                planet.deferentLast -= 360;
                
            planet.latitude = calcAngle(eclipticUpVec, planetPos)-90;


            
            // latitude speed in deg per day
            planet.longitudeSpeed = (planet.longitude - planet.lastLongitude)/this.dayDelta;
    },


    // update movement and parameters
    // TODO: comments!!!!
    update : function(time) {

        if(this.running) {
            // days passed (speed indicates seconds for one solar year)
            this.dayDelta = this.ecliptic.getSpeed()*(time/this.speed);
            this.days += this.dayDelta;

            // update movement of all spheres
            for (i in model.updateList) {
                model.updateList[i].updateMovement(this.dayDelta);
            }
            this.adjustAnomaly();        
            // OTHER
            // days determined by sun speed
          if(this.sun.getEnabled()) this.light.setPos(this.sun.mesh.currentPos());
        }
        //TODO: on model change -> events?
        this.updatePlanetMetadata(this.planet,this.sphere[1],this.ecliptic, this.sphere[2]);
    },

    adjustAnomaly : function() {
      
    },

     getDays : function() {
         return this.days;
     },

    addDays : function(days) {
      this.dayDelta = days; ///this.ecliptic.getSpeed();
      this.days += this.dayDelta;
        for (i in model.updateList) {
           model.updateList[i].updateMovement(this.dayDelta);
        }
      this.updatePlanetMetadata(this.planet,this.sphere[1],this.ecliptic, this.sphere[3]);
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
        this.ecliptic.setRotateAngle(0);
        this.days = 0;
        this.planet.reset();
    },

    
    // update or create&add a curve (hippopede or path) to an anchor node 
    addCurve : function(params) {
        if(!this.showCurve[params.index]) return;
        if(!this.curves[params.index]) {
            this.curves[params.index] = new Curve({trails: params.trails, pos: this.calcCurve({start: params.start, stop: params.stop, node: params.node}), color: params.color});
            params.anchor.addNode(this.curves[params.index]);
        } else {
            this.curves[params.index].setPos( this.calcCurve({start: params.start,  stop: params.stop, node: params.node}) );
        }
    },
    
    calcCurve : function(params) {
        var curvePos = []
        oldAngle = [],
        oldRotate = [],
        step = 0,
        start = params.start,
        stop = params.stop || this.sphere.length,
        node = params.node,
        maxSegments = params.segments || 80,
        pos = {x: 0, y: 0, z:0},
        j =  -10,
        i = 0;
      
        // save axis and rotation
        for (i = 1; i <= start; i++) {
            oldAngle[i] = this.sphere[i].getAxisAngle();
            oldRotate[i] = this.sphere[i].getRotateAngle();
            this.sphere[i].setAxisAngle(0.0);
            this.sphere[i].setRotateAngle(0.0);
        }

        // approximate step width
        for (i = start + 1; i < stop; i++) {
            this.sphere[i].visUpdate = false;
            oldRotate[i] = this.sphere[i].getRotateAngle();
            step += Math.abs(this.sphere[i].getStep());
        }
        step = 10.0/step;
        
        // calculate positions of curve points
        for (i = start + 1; i < stop; i++) {
          this.sphere[i].updateMovement(j*step);
        }
            
        for (; j < maxSegments; j++) {
            for (i = start + 1; i < stop; i++) {
                this.sphere[i].updateMovement(step);
            }
//            this.sphere[2].updateOffsetRotateMovement(step);
            this.adjustAnomaly();
            pos = node.currentPos();
            curvePos.push(pos);
        }
        
        // restore axis
        for (i = 1; i <= start; i++)
            this.sphere[i].setAxisAngle(oldAngle[i]);

        // restore rotation
        for (i = 1; i < stop; i++) {
            this.sphere[i].setRotateAngle(oldRotate[i]);
            this.sphere[i].visUpdate = true;
        }
        this.adjustAnomaly();


        return curvePos;
    }


}

