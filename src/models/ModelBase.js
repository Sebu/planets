




/**
 * 
 * @constructor
 * @returns instance of ModelBase :)
 */
ModelBase = function() {
};

ModelBase.prototype = {

    constructor : ModelBase,
    
    /**
     * @param params
     * @param params.name name of the model
     * @returns instance of ModelBase :)
     */
     
    create : function() {
   
        this.showCurve = [];            
        this.curves = [];
        this.updateList = [];
        this.currentPlanet = {};

        this.days = 0;
        this.setAnimSpeed(config.animSpeed);
        this.setRunning(true);
    },
    
    setShowCurve : function(index, state) { this.showCurve[index] = state; if(this.curves[index]) this.curves[index].setEnabled(state); },
    getShowCurve : function(index) { return this.showCurve[index]; },
    /** set visiblity state of path */
    setShowPath : function(state) { this.setShowCurve(0, state); },
    /** get visiblity state of path */
    getShowPath : function()  { return this.getShowCurve(0); },
    /** set visiblity state of hippopede */
    setShowHippo : function(state) { this.setShowCurve(1, state); },
    /** get visiblity state of hippopede */
    getShowHippo : function() { return this.getShowCurve(1); },
    /** set visiblity state of stars */
    setShowStars : function(state) { this.stars.setEnabled(state); },
    /** get visiblity state of stars */
    getShowStars : function() { return this.stars.getEnabled(); },
    /** set visiblity state of sun */
    setShowSun : function(state) { this.sun.setEnabled(state); },
    /** get visiblity state of sun */
    getShowSun : function() { return this.sun.getEnabled(); },


    /** 
    * set the speed of the animation
    * @param val duration of year revelation in seconds
    */
    setAnimSpeed : function(val) {
        this.speed = val;
    },

    /** 
    * get the speed of the animation
    * @returns duration of year revelation in seconds
    */    
    getAnimSpeed : function() {
        return this.speed;
    },
    
    /**
    * create some standard shortcuts
    * TODO: remove them, use model.sphere[x] etc.
    * @private
    */
    setupShortcuts : function () {
        for (i in this.sphere) {

            this["setSpeed" + i] = new Function("value", "this.sphere[" + i + "].setSpeed(value);");
            this["setStep" + i] = new Function("value", "this.sphere[" + i + "].setStep(value);");
            this["setAxisAngle" + i] = new Function("value", "this.sphere[" + i + "].setAxisAngle(value);");
            this["setRotateStart" + i] = new Function("value", "this.sphere[" + i + "].setRotateStart(value);");
            this["getSpeed" + i] = new Function("return this.sphere[" + i + "].getSpeed();");
            this["getAxisAngle" + i] = new Function("return this.sphere[" + i + "].getAxisAngle();");
            this["getRotateStart" + i] = new Function("return this.sphere[" + i + "].getRotateStart();");
            this["setShowSphere" + i] = new Function("state", "this.sphere[" + i + "].setShow(state);");
            this["getShowSphere" + i] = new Function("return this.sphere[" + i + "].getShow();");
        }
    },


    /**
     genarate simple linear sphere system with a center earth/plane and planet
     @function 
     @param params
     @param params.spheres number of spheres to generate and connect
    */
    genSpheres : function(params) {
    
        this.sphere = new Array(params.spheres);
        
        // ROOT_NODE / SCENE       
        this.root = new THREE.Scene(); 
        
        // planet surface for earth view
        this.root.addNode(this.earthPlane = new Disc({radius: config.sphereRadius, color: config.colors["Earth"]}) );
        // DIRECTION MARKERS
        this.earthPlane.addNode( this.north = new Translate({id: "North", x:-config.labelDist, y:0.2}) );
        this.earthPlane.addNode( this.south = new Translate({id: "South", x:config.labelDist,  y:0.2}) );
        this.earthPlane.addNode( this.east =  new Translate({id: "East" , z:-config.labelDist, y:0.2}) );
        this.earthPlane.addNode( this.west =  new Translate({id: "West" , z:config.labelDist,  y:0.2}) );
        
        // hide markers when hiding earthPlane
        var that = this;
        this.earthPlane.setEnabled = function(state){
          this.visible = state;
          that.north.setEnabled(state);
          that.south.setEnabled(state);
          that.east.setEnabled(state);
          that.west.setEnabled(state);          
        }
        this.earthPlane.setEnabled(false);

                 

        // first and outer sphere S1
        this.sphere[1] = new Spherical({
            vortex: false, //(Ori.gfxProfile.geometry >= Ori.Q.HIGH), 
            inner_id: this.name+"S1", 
            scale: config.sphereRadius,  
            color: config.colors["S1"] });
        
        this.updateList[0] = this.sphere[1];
        // default visuals for sphere1        
        this.sphere[1].setVisuals( ["equator","npole","spole","rotationarc","markerball"] );


        // add additional spheres
        for (var i = 2; i <= params.spheres; i++) {
            this.sphere[i] = new Spherical({
                inner_id: this.name+"S" + i + "",
                scale: config.sphereRadius-i*0.1,
                color: config.colors["S" + i + ""] });
            this.updateList.push( this.sphere[i] );
        }
        
        
        // add earth to S1
        var earthMap = (Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? THREE.ImageUtils.loadTexture(config.earthTexture) : undefined;
        this.earth = new Planet({
            betaRotate:180.0,
            scale: 0.6,
            emit:0.0, 
            phong: (Ori.gfxProfile.shading >= Ori.Q.HIGH),
            map: earthMap,
            color: config.colors["Earth"],
            inner_id: this.name+"Earth" });    
        


        // create planet
        this.planet = new Planet({ 
            dist: config.sphereRadius,
            emit: 0.5,
            scale: 0.2,
            inner_id: params.name+"Planet",
            color: config.colors["Planet"] });
        

        // create hull
        this.hull = new Planet({ 
            dist: 0.0,
            emit: 0.0,
            phong: false, //(Ori.gfxProfile.shading >= Ori.Q.HIGH),
            opacity: 0.1,
            scale: config.sphereRadius,
            color: config.colors["S1"] });        


        // create ecliptic and attach to S2
        this.ecliptic = new Spherical({ 
            scale: config.sphereRadius,
            axisAngle: 0.0,
            speed: 0.0,
            color: config.colors["S4"] });    
        
        this.ecliptic.setVisuals([]); 
        
        // create SUN and attach to ECLIPTIC
        this.sun = new Planet({
            glow: false,
            glowMap: config.sunGlowTexture,
            betaRotate: 90.0,
            emit: 0.5,
            scale: 0.3,
            dist: config.sphereRadius,
            inner_id: params.name+"Sun",
            color: config.colors["Sun"] });           
        
        this.updateList[this.sphere.length] = this.ecliptic;
        this.setSunSpeed = function(value)  { this.ecliptic.setSpeed(value); };
        this.getSunSpeed = function()       { return this.ecliptic.getSpeed(); };
        
        // create ambient and sunlight
        this.root.add( new THREE.AmbientLight(0xFFFFFF) );
        this.sunLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
        this.root.add( this.sunLight );

        // add stars
        this.stars = new Cloud({count:50})

        
        // helper point
        this.equantPoint = new Translate({z:0.0})


        //TODO: hack white north pole
        this.sphere[1].gfx.npole.materials = [ new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ) ];
        
        
        // connect eveything
        this.connectSpheres(params);
            
        this.setupShortcuts();
    },

    /**
    * connect sphere nodes and earth/stars/planet etc.
    * @function
    */
    connectSpheres : function(params) {
        this.root.addNode(this.sphere[1]);
          // S1
          this.sphere[1].addNode( this.earth );
          this.sphere[1].addNode( this.hull );
          
          this.sphere[1].anchor.addNode( this.stars ); 
          this.sphere[1].anchor.addNode( this.sphere[2] );
            // S2
            this.sphere[2].addNode( this.equantPoint );               
            this.sphere[2].addNode( this.ecliptic ); 
              this.ecliptic.anchor.addNode(this.sun);
            // S3 - Slast
            for (var i = 3; i <= params.spheres; i++) {
              this.sphere[i - 1].anchor.addNode( this.sphere[i] );
            }
              // Slast
              this.sphere[params.spheres].anchor.addNode( this.planet );
    },
    /**
     * load preset model data
     * @function
     * @param preset the preset to load
    */   
    loadPreset : function(preset) {

    	 // default planet settings
        this.currentPlanet = {};
        $.extend(true, this.currentPlanet, defaultPreset);
                
        // extend default settings  
        $.extend(true, this.currentPlanet, preset);
        
        this.ui = this.currentPlanet.ui;
        
        //TODO: better merge
        for(var i in this.currentPlanet.sphere) {
            for(var j in this.currentPlanet.sphere[i]) {
              this["set" + j + "" + (Number(i)+1)]( Utils.toDec( this.currentPlanet.sphere[i][j]) );
            }
        }
        
        if(this.setShowStars) this.setShowStars(this.currentPlanet.showStars);
        if(this.setShowPath) this.setShowPath(this.currentPlanet.showPath);
        if(this.setShowHippo) this.setShowHippo(this.currentPlanet.showHippo);

        if(this.sun) this.sun.setDist(this.currentPlanet.sunDist);
        if(this.sun) this.sun.setEnabled(this.currentPlanet.showSun);
//        this.sun.setGlow(this.currentPlanet.showSun);
        if(this.setSunSpeed) this.setSunSpeed(this.currentPlanet.sunSpeed);

        this.planet.setBeta(this.currentPlanet.betaRotate);
        this.planet.setShade(this.currentPlanet.color);

        if(this.sphere[4]) this.sphere[4].setArcBeta(this.currentPlanet.betaRotate);

        // hide sun sphere / better never ever show aka don't generate
        this.ecliptic.setShow(false); 

        // reset everything
        this.reset();
    },

    /**
     * @function
     * @returns current state of model
    */
    getPreset : function() {
        
        var params = this.currentPlanet;
        //TODO: better merge
        for(var i in this.sphere) { 
          if(this["getAxisAngle"+i])   params.sphere[i-1].AxisAngle = this["getAxisAngle"+i]();
          if(this["getRotateStart"+i]) params.sphere[i-1].RotateStart = this["getRotateStart"+i]();
          if(this["getSpeed"+i])       params.sphere[i-1].Speed = this["getSpeed"+i]();

        }
        
        params.showStars = this.getShowStars();
        params.showPath = this.getShowPath();
        params.showHippo = this.getShowHippo();

        params.sunDist = this.sun.getDist();
        params.showSun = this.sun.getEnabled();
        params.sunSpeed = this.getSunSpeed();

        params.betaRotate = this.planet.getBeta();
        params.color = this.planet.getShade();

        return params;
    },

    /**
     * stop/start/pause toggle of the model
     */
    setRunning : function(state) {
        this.running = state;
    },
    
    getRunning : function() {
      return this.running;
    },
    
    toggleRunning : function() {
        this.running = !this.running;
    },


    /**
     * jump to a certain date in the model
     * @function
     * @param dateString DD.MM.YYYY or MM/DD/YYYY formated date string
     */
    setDate : function(value) {      
      var date = Number(value);
      if(date) this.addDays(date);
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

    /** 
     * (dummy function) return empty string ""
     * @interface 
     */
    getDate : function() {
      return "";
    },


    /** 
     * calculate angles (long/lat) and speeds of planet
     * @param planet the planet reference
     * @param dayRef the dayly reference point
     * @param the ecliptic reference
     * @param epi epicyle reference
     * @interface 
     */
    updatePlanetMetadata : function(planet, dayRef, ecliptic, epi) {
            
            
            var eclipticPos = sceneToSyl(ecliptic.anchor.currentPos()),
            eclipticPolePos = sceneToSyl(ecliptic.gfx.npole.currentPos()),
            eclipticUpVec = eclipticPos.subtract(eclipticPolePos),
            
            planetOnPlane = ecliptic.getPlane().pointClosestTo(sceneToSyl(planet.gfx.mesh.currentPos())).subtract(eclipticPos),
            planetPos = sceneToSyl(planet.gfx.mesh.currentPos()).subtract(eclipticPos),

            equinoxOnPlane = sceneToSyl(dayRef.gfx.markerball.currentPos()).subtract(eclipticPos),
            equinoxOnPlanePerp = equinoxOnPlane.rotate(Math.PI/2, Line.create(eclipticPos,eclipticUpVec)),

            epiPos = sceneToSyl(this.equantPoint.currentPos()),
            epiOnPlane = sceneToSyl(epi.gfx.markerball.currentPos()).subtract(epiPos),


            sunOnPlane = ecliptic.getPlane().pointClosestTo(sceneToSyl(this.sun.gfx.mesh.currentPos())).subtract(eclipticPos);
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

    /** @interface */
    adjustAnomaly : function() {},

    /** 
    update movement and parameters
    TODO: more comments!!!!
    @function 
    @param time millisecons passed since last call
    */
    update : function(time) {
       if(this.running) 
           this.updateMovement( this.ecliptic.getSpeed() * (time/this.speed) ); // days passed (speed indicates seconds for one solar year)

       this.updateMetadata();

       if(this.sun.getEnabled()) 
           this.sunLight.setPos(this.sun.gfx.mesh.currentPos());
    },

    /** 
    update movement
    @function 
    @param time millisecons passed since last call
    */
    updateMovement : function(time) {
            
        // set current dayDelta/time and add to global passed days
        this.dayDelta = time;
        this.days += this.dayDelta;

        // update movement of all objects(primary spheres) with updateMovement function
        for (i in this.updateList) {
            this.updateList[i].updateMovement( this.dayDelta );
        }
  
    },

    // separate it for easy modification
    updateMetadata : function() {
        this.updatePlanetMetadata( this.planet, this.sphere[1], this.ecliptic, this.sphere[3] );
    },
    

    /**
     * @function
     * @returns days since start
     */
    getDays : function() {
         return this.days;
    },

    /**
     * set days since start
     * @function
     * @param days the number of days to set
     */
    setDays : function(days) {
        this.reset();
        this.addDays( days );
    },

    /**
     * add days to the current state
     * @function
     * @param days the number of days to
     */
    addDays : function(days) {
      this.updateMovement( days );  
      this.updateMetadata();
    },

    
    /**
     reset movement of spheres and parameters 
     @function
    */
    reset : function () {
        for (var i in this.sphere) {
            this.sphere[i].reset();
        }
        this.ecliptic.setRotateAngle(0);
        this.days = 0;
        this.planet.reset();
    },

    
    /**
    * update or create&add a curve (hippopede or path) to an anchor node 
    * @function
    * @param params
    * @param params.index  index i of curves[i]
    * @param params.start  index of first moving sphere, previouse elements are fixed
    * @param params.stop   index of last  moving sphere, following elements are fixed
    * @param params.node   interpolate positions of this node
    * @param params.anchor attach curve to anchor node
    * @param params.color
    * @param params.trails use a dark->light color gradient for the curve
    */
    addCurve : function(params) {
        if(!this.getShowCurve(params.index)) return;

        var newCurve = this.calcCurve({start: params.start, stop: params.stop, node: params.node});
        if(!this.curves[params.index]) {
            this.curves[params.index] = new Curve({
                trails: params.trails, 
                pos: newCurve, 
                color: params.color});
            params.anchor.addNode(this.curves[params.index]);
        } else {
            this.curves[params.index].setPoints( newCurve );
        }
    },
    
    
    /**
    * calculate a curve (hippopede or path) 
    * @function
    * @param params
    * @param params.start  index of first moving sphere, previouse elements are fixed
    * @param params.stop   index of last  moving sphere, following elements are fixed
    * @param params.node   interpolate positions of this node
    * @returns {Array} of position vectors
    */
    //*    
    calcCurve : function(params) {
        var curvePos = [], // store curve points
        start = params.start, // first moving sphere
        stop = params.stop || this.sphere.length, // last moving sphere
        node = params.node, // observe this node
        maxSegments = (params.segments || 80) * Ori.gfxProfile.curveRes,
        j =  -10, // start segment of curve (-10 points before current state)
        i = 0, // universal loop counter
        step = 0; // default step width

        
        for (i = 1; i < this.sphere.length; i++) {
          this.sphere[i].visUpdate = false;              
        }
        
        // approximate step width
        for (i = start; i < stop; i++) {
            step += Math.abs(this.sphere[i].getStep());
        }
        step = 10.0 / (step * Ori.gfxProfile.curveRes);
        
        // jump to start position of curve
        this.updateMovement(j*step);

        // calculate positions of curve points            
        for (; j < maxSegments; j++) {
            this.updateMovement(step);
            pos = node.currentPosTill(this.sphere[start]).clone();
            curvePos.push(pos);
        }
        
        // RESTORE
        this.updateMovement(-maxSegments*step);

        for (i = 1; i < this.sphere.length; i++) {
          this.sphere[i].visUpdate = true;              
        }
        
        return curvePos;
    }
    //*/
    
    /**
    * OLD VERSION
    * calculate a curve (hippopede or path) 
    * @function
    * @param params
    * @param params.start  index of first moving sphere, previouse elements are fixed
    * @param params.stop   index of last  moving sphere, following elements are fixed
    * @param params.node   interpolate positions of this node
    * @returns {Array} of position vectors
    */  
    /*  
    calcCurve : function(params) {
        var curvePos = [],
        oldAngle = [],
        oldApsidal = 0,
        oldRotate = [],
        start = params.start,
        stop = params.stop || this.sphere.length,
        step = 0,
        node = params.node,
        maxSegments = (params.segments || 80) * Ori.gfxProfile.curveRes,
        pos = {x: 0, y: 0, z:0},
        j =  -10,
        i = 0;
      
        // SAVE axis and rotation state
        for (i = 1; i <= start; i++) {
            oldAngle[i] = this.sphere[i].getAxisAngle();
            oldRotate[i] = this.sphere[i].getRotateAngle();
            this.sphere[i].setAxisAngle(0.0);
            this.sphere[i].setRotateAngle(0.0);
        }
        if(this.ptolemySphere) oldApsidal = this.ptolemySphere.getApsidalAngle();
  
  
  
  
        // approximate step width
        for (i = start + 1; i < stop; i++) {
            this.sphere[i].visUpdate = false; // disable graphical update
            oldRotate[i] = this.sphere[i].getRotateAngle();
            step += Math.abs(this.sphere[i].getStep());
        }
        step = 10.0/(step*Ori.gfxProfile.curveRes);
        
        
        
        // jump to start position of curve
        for (i = start + 1; i < stop; i++) {
          this.sphere[i].updateMovement(j*step);
        }

        // calculate positions of curve points            
        for (; j < maxSegments; j++) {
            for (i = start + 1; i < stop; i++) {
                this.sphere[i].updateMovement(step);
            }
            if(this.ptolemySphere) this.ptolemySphere.updateMovement(step);
            this.adjustAnomaly();
            pos = node.currentPos().clone();
            curvePos.push(pos);
        }
        
        
        // RESTORE
        // restore axis state
        for (i = 1; i <= start; i++)
            this.sphere[i].setAxisAngle(oldAngle[i]);

        // restore rotation state
        for (i = 1; i < stop; i++) {
            this.sphere[i].setRotateAngle(oldRotate[i]);
            this.sphere[i].visUpdate = true; // enable graphical update
        }
        if(this.ptolemySphere) this.ptolemySphere.setApsidalAngle(oldApsidal);
        this.adjustAnomaly();


        return curvePos;
    }
    //*/


}

