

/**
 * @constructor
 */
ModelPtolemyBase = function(params) {
	  ModelBase.call(this);
    params.name = params.name || "ModelPtolemySun";
    params.spheres = params.spheres || 4;
    this.genSpheres(params);

    BaseMixin.call(this);
    this.ptolemizeSpheres(); // :) add some ecliptic/latitude and apsidal stuff to the daily

    this.sphere[1].realAngle = 0;

    this.updateList.push(this.ptolemySphere);


    this.realSunS = [];
    var realSunS1 = this.realSunS[1] = new Spherical({ scale: 7.0,  color: colors["S2"]});
    var realSunS2 = this.realSunS[2] = new Spherical({ scale: 6.5,  color: colors["S3"]});

    this.realSun = new Planet({ glow: true, dist: 6.5, emit: 0.5, scale: 0.2, inner_id: params.name+"realSun",  color:colors["Sun"]});
    this.realSun.setBeta(90.0);
  
    this.updateList.push(realSunS1);
    this.updateList.push(realSunS2);    
        
    this.ptolemySphere.addNode(realSunS1);
    realSunS1.anchor.addNode(realSunS2);
    realSunS2.anchor.addNode(this.realSun);

    this.startDate = DATES.PTOLEMY_EPOCH;
 
    this.earth.mesh.scale.set( 0.2, 0.2, 0.2 );  
    this.sun.mesh.scale.set( 0.2, 0.2, 0.2 );


    var material = new THREE.LineBasicMaterial( {  color: "0xFFAAFF" });
    this.equator = new THREE.Line(equator, material );
    this.equator.scale  = new THREE.Vector3( 9,9,9 );
    this.equator.rotation.x = Math.PI/2;
//    this.sphere[3].anchor.addNode(this.equator);


    this.apsidal = [ {x: 0,y: 0,z: -10}, {x: 0, y: 0,z: 10} ];
    this.apsidalLine = new Curve({trails: false, pos: this.apsidal, color: colors["S1"] }); 
    this.sphere[2].pivot.addNode(this.apsidalLine);


    this.earthToDeferent = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToDeferentLine = new Curve({trails: false, linewdith:1, pos: this.earthToDeferent, color: {r:0.6,g:0.6,b:1.0} }); 
    this.root.addNode(this.earthToDeferentLine);


    this.earthToPlanet = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToPlanetLine = new Curve({trails: false, pos: this.earthToPlanet, color: {r:1.0,g:1.0,b:1.0} }); 
    this.root.addNode(this.earthToPlanetLine);

    
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
    
    
    this.realSunS[1].setGfx(["equator", "npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], false);
    this.realSunS[2].setGfx(["equator", "npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], false);

/*
    // TODO: rotate anchor.anchor? of2?
    this.adjustAnomaly = function() {
       var adjustment = -this.sphere[3].anchor.rotation.y+(this.sphere[3].rotateAngle/PI_SCALE)-this.sphere[2].getOffsetRotateAngle()/PI_SCALE;
       this.sphere[4].anchor.rotation.y += adjustment;
    }
//*/


/*    
    this.addDays = function(days) {
      ModelBase.prototype.addDays.call(this, days);
      this.adjustAnomaly();
      this.updatePlanetMetadata(this.planet,this.sphere[1], this.ecliptic, this.sphere[3]);
    }
*/

    
    this.update = function(time) {
//        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Path"]});
        ModelBase.prototype.update.call(this, time);

//        this.updatePlanetMetadata(this.planet, this.sphere[1], this.ecliptic, this.sphere[3]);


        // mean sun
//        this.ecliptic.anchor.rotation.y = this.ptolemySphere.anchor.rotation.y + this.sphere[3].anchor.rotation.y + this.sphere[4].anchor.rotation.y;

        // lines
        this.equantPlanet[0] = this.equantPoint.currentPos();        
        this.equantPlanet[1] = this.sphere[3].gfx.markerball.currentPos();
        this.equantPlanetLine.setPos(this.equantPlanet);

        this.earthToDeferent[0] = this.earth.mesh.currentPos();     
        this.earthToDeferent[1] = this.sphere[3].gfx.markerball.currentPos();
        this.earthToDeferentLine.setPos(this.earthToDeferent);

        this.earthToPlanet[0] = this.earth.mesh.currentPos();     
        this.earthToPlanet[1] = this.planet.mesh.currentPos();
        this.earthToPlanetLine.setPos(this.earthToPlanet);

 

        
        this.date = this.startDate + this.days;
    }
    

    this.setAxisAngle2 = function(angle) {
        this.ptolemySphere.axisAngle = angle;
        this.ptolemySphere.rotation.z = degToRad(angle);
//        this.realSunS[1].setAxisAngle(angle);
    };
    
    this.getAxisAngle2 = function() {
      return this.ptolemySphere.axisAngle;
    };

 
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
    this.setBobAngle = function(angle) {
      this.bobAngle = Math.PI/4 + Math.sin(this.sphere[3].getRotateAngle()/PI_SCALE);
      this.sphere[4].anchor.rotation.x =  this.bobAngle;
    };
    this.getBobAngle = function() {
      return this.sphere[4].bobAngle;
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

    this.setDeviation = function(value) {
      this.deviation = value;
    }
    this.getDeviation = function() { return this.deviation; }

    this.setKM = function(value) {
      this.KM = value;
    }
    this.getKM = function() { return this.KM; }
    
    this.setLambdaAN = function(value) {
      this.lambdaAN = value;
    }
    this.getLambdaAN = function() { return this.lambdaAN; }
    
    this.reset = function () {
        ModelBase.prototype.reset.call(this);
        this.setEquant( Utils.toDec(this.currentPlanet.equant || 0 ));
        this.setRadiusD( Utils.toDec(this.currentPlanet.derefentRadius || 0) ); 
        this.setRadiusE( Utils.toDec(this.currentPlanet.epicycleRadius || 0) );
        this.setBaseRadius( Utils.toDec(this.currentPlanet.baseRadius || 0) );         
        this.ptolemySphere.setApsidalAngle( Utils.toDec(this.currentPlanet.apsidalAngle || 0) );
        this.ptolemySphere.setApsidalSpeed( Utils.toDec(this.currentPlanet.centuryStep || 0) );
        this.ptolemySphere.setInclination( Utils.toDec(this.currentPlanet.inclination || 0) );
        this.setDeviation( Utils.toDec(this.currentPlanet.deviation || 0) );
        this.setKM( Utils.toDec(this.currentPlanet.km || 0) );        
        this.setLambdaAN( Utils.toDec(this.currentPlanet.lambdaAN || 0) );
        this.adjustAnomaly();   
        
//        this.setBobAngle(30);
        // sun stuff
        this.realSunS[1].setOffsetRotateSpeed(0);
        this.realSunS[1].setOffsetRotateAngle( 56.5 );    
        this.realSunS[1].setRotateAngle( 274.25 );
        this.realSunS[2].setRotateAngle( (360-274.25) );

        this.realSunS[2].setScale(0);
        this.realSun.setDist(0);
        this.realSunS[1].setSpeed(365.2466666);
        this.realSunS[2].setSpeed(-365.2466666);

    }    
};

ModelPtolemyBase.prototype = new ModelBase;
ModelPtolemyBase.prototype.constructor = ModelPtolemyBase;
