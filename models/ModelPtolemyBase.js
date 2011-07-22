

/**
 * @constructor
 */
ModelPtolemyBase = function(params) {
	  ModelBase.call(this);
    params.name = params.name || "ModelPtolemySun";
    params.spheres = params.spheres || 4;
    this.genSpheres(params);

    BaseMixin.call(this);

    this.sphere[1].realAngle = 0;


    this.realSunS = [];
    var realSunS1 = this.realSunS[1] = new Spherical({ scale: 7.0,  color: colors["S2"]});
    var realSunS2 = this.realSunS[2] = new Spherical({ scale: 6.5,  color: colors["S3"]});

    this.realSun = new Planet({ glow: true, dist: 6.5, emit: 0.5, scale: 0.2, inner_id: params.name+"realSun",  color:colors["Sun"]});
    this.realSun.setBeta(90.0);
  
    this.updateList.push(realSunS1);
    this.updateList.push(realSunS2);    
        
    this.sphere[1].anchor.addNode(realSunS1);
    realSunS1.anchor.addNode(realSunS2);
    realSunS2.anchor.addNode(this.realSun);

    this.startDate = DATES.PTOLEMY_EPOCH;
 
    this.earth.mesh.scale.set( 0.2, 0.2, 0.2 );  
    this.sun.mesh.scale.set( 0.2, 0.2, 0.2 );


    var material = new THREE.LineBasicMaterial( {  color: "0xFFAAFF" });
    this.equator = new THREE.Line(equator, material );
    this.equator.scale  = new THREE.Vector3( 9,9,9 );
    this.equator.rotation.x = Math.PI/2;
    this.sphere[3].anchor.addNode(this.equator);


    this.apsidal = [ {x: 0,y: 0,z: -10}, {x: 0, y: 0,z: 10} ];
    this.apsidalLine = new Curve({trails: false, pos: this.apsidal, color: colors["S1"] }); 
    this.sphere[2].pivot.addNode(this.apsidalLine);

    this.epicycleRadius = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.epicycleRadiusLine = new Curve({trails: false, pos: this.epicycleRadius, color: colors["S3"] }); 
    this.root.addNode(this.epicycleRadiusLine);
    
    this.deferentRadius = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.deferentRadiusLine = new Curve({trails: false, pos: this.deferentRadius, color: colors["S2"] }); 
    this.root.addNode(this.deferentRadiusLine);


    this.earthToDeferent = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToDeferentLine = new Curve({trails: false, linewdith:1, pos: this.earthToDeferent, color: {r:0.6,g:0.6,b:1.0} }); 
    this.root.addNode(this.earthToDeferentLine);


    this.earthToPlanet = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToPlanetLine = new Curve({trails: false, pos: this.earthToPlanet, color: {r:1.0,g:1.0,b:1.0} }); 
    this.root.addNode(this.earthToPlanetLine);

    this.earthToVernal = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToVernalLine = new Curve({trails: false, pos: this.earthToVernal, color: colors["S1"] }); 
    this.root.addNode(this.earthToVernalLine);

    
    this.equantPlanet = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.equantPlanetLine = new Curve({trails: false, pos: this.equantPlanet, color: {r:1.0,g:1.0,b:0.0} }); 
    this.root.addNode(this.equantPlanetLine);

    
    this.setShowSphere1(false);
    this.setShowSphere2(false);
    this.setShowSphere3(false);
    this.setShowSphere4(false);
    this.setShowSphere1 = function(state) { this.sphere[1].setGfx(["equator","npole","spole","rotationarc","markerarc","markerball"], state) };
    this.setShowSphere2 = function(state) { this.sphere[2].setGfx(["equator"], state) };
    this.setShowSphere3 = function(state) { this.sphere[3].setGfx(["equator"], state) };
    this.setShowSphere4 = function(state) { this.sphere[4].setGfx(["equator"], state) };
    this.setShowSphere1(true);
    this.setShowSphere2(true);
    this.setShowSphere3(true);
    this.setShowSphere4(true);
    
    
    this.realSunS[1].setGfx(["npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], false);
    this.realSunS[2].setGfx(["npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], false);

    // TODO: rotate anchor.anchor? of2?
    this.adjustAnomaly = function() {
       var adjustment = -this.sphere[3].anchor.rotation.y+(this.sphere[3].rotateAngle/PI_SCALE)-this.sphere[2].getOffsetRotateAngle()/PI_SCALE;
       this.sphere[4].anchor.rotation.y += adjustment;
    }


    this.addDays = function(days) {
      this.sphere[2].updateOffsetRotateMovement(days); 
      ModelBase.prototype.addDays.call(this, days);
      this.adjustAnomaly();
      this.updatePlanetMetadata(this.planet,this.sphere[1], this.ecliptic, this.sphere[3]);
    }


    
    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Path"]});
        ModelBase.prototype.update.call(this, time);
        if(this.running) {
          this.sphere[2].updateOffsetRotateMovement(this.dayDelta);
          this.adjustAnomaly();
        }
                
        this.updatePlanetMetadata(this.planet, this.sphere[1], this.ecliptic, this.sphere[3]);


        // mean sun
        this.ecliptic.anchor.rotation.y = this.sphere[3].anchor.rotation.y + this.sphere[4].anchor.rotation.y;

        // lines
        this.epicycleRadius[0] = this.sphere[3].gfx.markerball.currentPos();
        this.epicycleRadius[1] = this.planet.mesh.currentPos();
        this.epicycleRadiusLine.setPos(this.epicycleRadius);
          
        this.deferentRadius[0] = this.sphere[3].anchor.currentPos();
        this.deferentRadius[1] = this.sphere[3].gfx.markerball.currentPos();
        this.deferentRadiusLine.setPos(this.deferentRadius);

        this.equantPlanet[0] = this.equantPoint.currentPos();        
        this.equantPlanet[1] = this.sphere[3].gfx.markerball.currentPos();
        this.equantPlanetLine.setPos(this.equantPlanet);

        this.earthToDeferent[0] = this.earth.mesh.currentPos();     
        this.earthToDeferent[1] = this.sphere[3].gfx.markerball.currentPos();
        this.earthToDeferentLine.setPos(this.earthToDeferent);

        this.earthToPlanet[0] = this.earth.mesh.currentPos();     
        this.earthToPlanet[1] = this.planet.mesh.currentPos();
        this.earthToPlanetLine.setPos(this.earthToPlanet);

        this.earthToVernal[0] = this.earth.mesh.currentPos();        
        this.earthToVernal[1] = this.sphere[1].gfx.markerball.currentPos();
        this.earthToVernalLine.setPos(this.earthToVernal);        

        
        this.date = this.startDate + this.days;
    }
    

    this.setAxisAngle2 = function(angle) {
        this.sphere[2].setAxisAngle(angle);
        this.realSunS[1].setAxisAngle(angle);
    }

 
    
    this.setShowSun1 = function(state) { 
      this.planet.setEnabled(state); 
      this.sphere[2].setGfx(["equator"],state);
      this.sphere[3].setGfx(["equator"],state);
    };
        
    this.setShowSun2 = function(state) { 
      this.realSun.setEnabled(state); 
      this.realSunS[1].setGfx(["equator"],state);
      this.realSunS[2].setGfx(["equator"],state);
    };

    this.getShowSun1 = function(state) { return true; }    
    this.getShowSun2 = function(state) { return true; }

    this.updateBlob = function() {
      var scale = (this.sphere[3].radius+this.sphere[4].radius)*this.factor;
      this.sphere[1].setScale(scale); 
      this.equator.scale  = new THREE.Vector3( scale, scale, scale );
      this.apsidal = [ {x: 0,y: 0, z: -(this.sphere[3].radius-this.sphere[3].equant)*this.factor}, {x: 0, y: 0,z: (this.sphere[3].radius+this.sphere[3].equant)*this.factor} ];
      this.apsidalLine.setPos(this.apsidal);       
    }


    // TODO: change    
    this.sphere[4].setBobAngle = function(angle) {
      var scale = 90/12;
      this.bobAngle = (Math.abs(mod(angle, 360)-180)-90)/scale;
      this.anchor.rotation.x = 0;// degToRad(this.bobAngle);
    };
    this.sphere[4].getBobAngle = function() {
      return this.bobAngle;
    };

    this.setEquant = function(value) {
      this.sphere[3].equant = value;
      this.equantPoint.position.z = this.sphere[3].equant*this.factor*2;
      this.sphere[2].anchor.position.z = this.sphere[3].equant*this.factor;
      
            
      this.updateBlob();
      this.updateSunDist();
    };
    this.getEquant = function() { return this.sphere[3].equant; }
    
   
    this.setRadiusD = function(value) {
      this.sphere[3].radius = value;
      this.sphere[3].setScale(value*this.factor);
      this.sphere[4].pivot.position.z = value*this.factor;

     
      this.updateBlob();
      this.updateSunDist();
    };
    this.getRadiusD = function() { return this.sphere[3].radius; }


    this.setRadiusE = function(value) {
      this.sphere[4].radius = value;
      this.sphere[4].setScale(value*this.factor);

      this.planet.setDist(value*this.factor);
      
      this.updateBlob();
      this.updateSunDist();
    };
    this.getRadiusE = function() { return this.sphere[4].radius; }    
    
    this.setBaseRadius = function(value) {
      this.sphere[2].radius = value;
      this.sphere[2].setScale(this.sphere[2].radius*this.factor);
      this.sphere[3].pivot.position.z = this.sphere[2].radius*this.factor;  
    }
    this.getBaseRadius = function() { return this.sphere[2].radius; }
};

ModelPtolemyBase.prototype = new ModelBase;
ModelPtolemyBase.prototype.constructor = ModelPtolemyBase;
