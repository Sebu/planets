

/**
 * @constructor
 * @extends ModelBase
 */
ModelPtolemyBase = function() {};

ModelPtolemyBase.prototype = new ModelBase;
ModelPtolemyBase.prototype.constructor = ModelPtolemyBase;
ModelPtolemyBase.prototype.name = "ModelPtolemySun";

ModelPtolemyBase.prototype.create = function() {
	  ModelBase.prototype.create.call(this);

    this.genSpheres({spheres : 4});
    
    this.setShowHippo = null;
 
    /** @lends BaseMixin */
    BaseMixin.call(this);
    
    // :) add some ecliptic/latitude and apsidal stuff to the daily


    // TODO:deprecated?
//    this.sphere[1].realAngle = 0;


    // Add Ptolemy Sun
    this.realSunS = [];
    var realSunS1 = this.realSunS[1] = new Spherical({ scale: 7.0,  color: config.colors["S2"]});
    var realSunS2 = this.realSunS[2] = new Spherical({ scale: 6.5,  color: config.colors["S2"]});
    this.realSun = new Planet({
        glow: false,
        glowMap: config.sunGlowTexture,
        dist: 6.5,
        emit: 0.5,
        scale: 0.2,
        inner_id: this.name+"realSun",
        color: config.colors["Sun"] });
    this.realSun.setBeta(90.0);
    this.updateList.push(realSunS1);
    this.updateList.push(realSunS2);    
    this.ptolemySphere.addNode(realSunS1);
    realSunS1.anchor.addNode(realSunS2);
    realSunS2.anchor.addNode(this.realSun);

    // date start
    this.startDate = DATES.PTOLEMY_EPOCH;

    // scale 
    this.earth.gfx.mesh.scale.set( 0.2, 0.2, 0.2 );  
    this.sun.gfx.mesh.scale.set( 0.2, 0.2, 0.2 );

    // add ecliptic vis
    var material = new THREE.LineBasicMaterial( {  color: rgbToHex(config.colors["S2"]) });
    this.equator = new THREE.Line(equator, material );
    this.equator.scale  = new THREE.Vector3( 9,9,9 );
    this.equator.rotation.x = Math.PI/2;
    this.sphere[3].anchor.addNode(this.equator);


    // add the bob crank vis
    this.sphere[4].gfx.crank = new THREE.Line(equator, material );
    this.sphere[4].gfx.crankRadius = new Curve({
        trails: false,
        pos:  [ {x: 0,y: 1,z: 0}, {x: 0, y: 0,z: 0} ],
        color: config.colors["S4"] });
    this.crank = new Node();
    this.crank.rotation.y = Math.PI/2;
    this.sphere[4].gfx.crank.addNode(this.sphere[4].gfx.crankRadius);
    this.sphere[4].gfx.crank.addNode(this.crankPoint0 = new Translate({x:0, y: 1, z: 0}));
    this.sphere[4].ptolemy.addNode(this.crankPoint1 = new Translate({x:0, y: 0, z: 0}));

    this.crank.addNode(this.sphere[4].gfx.crank);

    this.sphere[4].addNode(this.crank);
    
    // crank line
    this.cline = [ {x: 0,y: 0,z: -10}, {x: 0, y: 0,z: 10} ];
    this.sphere[4].gfx.crankLine = new Curve({
        trails: false,
        pos: this.cline,
        color: config.colors["S4"] }); 
    this.root.addNode(this.sphere[4].gfx.crankLine);
    
    

    this.adjustCrank = function () {
      var scale = Math.sin(this.getDeviation()/PI_SCALE) * this.sphere[4].radius*this.factor;
      this.crank.scale  = new THREE.Vector3( scale, scale, scale );
      this.crank.position.z = -this.sphere[4].radius*this.factor*1.2;  
      this.crankPoint1.position.z = -this.sphere[4].radius*this.factor;  
    }

    
    // apsidal line
    this.apsidal = [ {x: 0,y: 0,z: -10}, {x: 0, y: 0,z: 10} ];
    this.apsidalLine = new Curve({trails: false, pos: this.apsidal, color: config.colors["S3"] }); 
    this.sphere[2].addNode(this.apsidalLine);

    // and more lines
    this.earthToDeferent = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToDeferentLine = new Curve({trails: false, linewdith:1, pos: this.earthToDeferent, color: {r:0.6,g:0.6,b:1.0} }); 
    this.root.addNode(this.earthToDeferentLine);

    this.earthToPlanet = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.earthToPlanetLine = new Curve({trails: false, pos: this.earthToPlanet, color: {r:1.0,g:1.0,b:1.0} }); 
    this.root.addNode(this.earthToPlanetLine);
    
    this.equantPlanet = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.equantPlanetLine = new Curve({trails: false, pos: this.equantPlanet, color: {r:1.0,g:1.0,b:0.0} }); 
    this.root.addNode(this.equantPlanetLine);


    // inner crank
    this.centerL = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.centerLine = new Curve({trails: false, pos: this.centerL, color: config.colors["S3"] }); 
    this.root.addNode(this.centerLine);
    this.sphere[2].crankPoint = new Translate({x:0, y:0, z:0});
//    this.sphere[2].crankPoint.position.z = this.sphere[2].gfx.scale;
    this.sphere[2].anchor.addNode(this.sphere[2].crankPoint);


    var that = this;
    this.earth.setEnabled = function(state) {
      this.gfx.mesh.visible = state; 
      if(this.gfx.glow) this.gfx.meshGlow.visible = state; 
      that.earthToDeferentLine.setEnabled(state);
      that.earthToPlanetLine.setEnabled(state);
      that.equantPlanetLine.setEnabled(state); 
      that.apsidalLine.setEnabled(state);    
    }

    this.sphere[3].setShow = function(state) {
      this.visible = state;
      this.setGfx(this.gfx.visuals, state);
      that.centerLine.setEnabled(state);
      that.earthToDeferentLine.setEnabled(state);
      that.equantPlanetLine.setEnabled(state); 
      that.apsidalLine.setEnabled(state);               
    }
    
    // show/hide modifications    
    this.sphere[1].defaultVisuals(["equator","npole","spole","rotationarc","markerarc","markerball"]);
    this.sphere[2].defaultVisuals(["equator","centerLine"]);
    this.sphere[3].defaultVisuals(["equator"]);
    this.sphere[4].defaultVisuals(["crankLine", "crankRadius","crank","disc","equator","centerLine"]);
    this.realSunS[1].defaultVisuals([]);
    this.realSunS[2].defaultVisuals([]);

    /** @override */
    this.updateMovement = function(time) {
      ModelBase.prototype.updateMovement.call(this, time);
      //TODO: move wd parameter :)
      this.wd += this.dayDelta*0.05; //13.2293;
      this.adjustAnomaly();        
    };
    
    /** @override */
    this.update = function(time) {
        if(this.running)  
          this.addCurve({
              index: 0,
              anchor: this.sphere[1],
              start: 1,
              node: this.planet.gfx.mesh,
              color: config.colors["Path"] });
          
        ModelBase.prototype.update.call(this, time);


        // mean sun
//        this.ecliptic.anchor.rotation.y = this.ptolemySphere.anchor.rotation.y + this.sphere[3].anchor.rotation.y + this.sphere[4].anchor.rotation.y;

        // lines
        this.cline[0] = this.crankPoint0.currentPos();        
        this.cline[1] = this.crankPoint1.currentPos();  
        this.sphere[4].gfx.crankLine.setPoints(this.cline);

        this.equantPlanet[0] = this.equantPoint.currentPos();        
        this.equantPlanet[1] = this.sphere[3].gfx.markerball.currentPos();
        this.equantPlanetLine.setPoints(this.equantPlanet);

        this.earthToDeferent[0] = this.earth.gfx.mesh.currentPos();     
        this.earthToDeferent[1] = this.sphere[3].gfx.markerball.currentPos();
        this.earthToDeferentLine.setPoints(this.earthToDeferent);

        this.earthToPlanet[0] = this.earth.gfx.mesh.currentPos();     
        this.earthToPlanet[1] = this.planet.gfx.mesh.currentPos();
        this.earthToPlanetLine.setPoints(this.earthToPlanet);

        this.centerL[0] = this.sphere[2].crankPoint.currentPos();  
        this.centerL[1] = this.sphere[3].gfx.markerball.currentPos();
        this.centerLine.setPoints(this.centerL);

        this.date = this.startDate + this.days;

        if(this.realSun.getEnabled()) 
          this.sunLight.setPos(this.realSun.gfx.mesh.currentPos());
    }
    
    this.getDateValue = function() {
        return this.date;
    },
    /** @override */
    this.setAxisAngle2 = function(angle) {
        this.ptolemySphere.axisAngle = angle;
        this.ptolemySphere.rotation.z = angle/PI_SCALE;
    };

    /** @override */
    this.getAxisAngle2 = function() {
      return this.ptolemySphere.axisAngle;
    };

 
    this.updateBlob = function() {
      var scale = (this.sphere[3].radius+this.sphere[4].radius)*this.factor;
      this.sphere[1].setScale(scale); 
      this.equator.scale  = new THREE.Vector3( scale, scale, scale );
      this.apsidal = [ 
          {x: 0,y: 0, z: -(this.sphere[3].radius-this.sphere[3].equant)*this.factor},
          {x: 0, y: 0,z: (this.sphere[3].radius+this.sphere[3].equant)*this.factor} ];
      this.apsidalLine.setPoints(this.apsidal);       
    }

    this.updateSunDist = function() {};

    this.setEquant = function(value) {
      this.sphere[3].equant = value;
      this.sphere[2].anchor.position.z = this.sphere[3].equant*this.factor;
      
      this.equantPoint.position.z = this.sphere[3].equant*this.factor*2;
           
      this.updateBlob();
      this.updateSunDist();
    };
    this.getEquant = function() { return this.sphere[3].equant; }
    
   
    this.setRadiusDeferent = function(value) {
      this.sphere[3].radius = value;
      this.sphere[3].setScale(value*this.factor);
      this.sphere[4].position.z = value*this.factor;

     
      this.updateBlob();
      this.updateSunDist();
    };
    this.getRadiusDeferent = function() { return this.sphere[3].radius; }


    this.setRadiusEpicycle = function(value) {
      this.sphere[4].radius = value;
      this.sphere[4].setScale(value*this.factor);

      this.planet.setDist(value*this.factor);
      
      this.adjustCrank(); 
      this.updateBlob();
      this.updateSunDist();
    };
    this.getRadiusEpicycle = function() { return this.sphere[4].radius; }

    
    this.setBaseRadius = function(value) {
      this.sphere[2].radius = value;
      this.sphere[2].setScale(this.sphere[2].radius*this.factor);
      this.sphere[3].position.z = this.sphere[2].radius*this.factor;
      this.sphere[2].crankPoint.position.z = this.sphere[2].radius*this.factor;
    }
    this.getBaseRadius = function() { return this.sphere[2].radius; }


    this.setDeviation = function(value) { this.deviation = value; }
    this.getDeviation = function() { return this.deviation; }


    this.setKM = function(value) { this.KM = value; }
    this.getKM = function() { return this.KM; }
    

    this.setLambdaAN = function(value) { this.lambdaAN = value; }
    this.getLambdaAN = function() { return this.lambdaAN; }
    

    /** @override */
    this.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);    
      params.params.equant = this.getEquant();
      params.params.deferentRadius = this.getRadiusDeferent();
      params.params.epicycleRadius = this.getRadiusEpicycle();
      params.params.baseRadius = this.getBaseRadius();
      params.params.apsidalAngle = this.ptolemySphere.getApsidalAngle();
      params.params.centuryStep = this.ptolemySphere.getApsidalSpeed();
      params.params.inclination = this.ptolemySphere.getInclination();
      params.params.deviation = this.getDeviation();
      params.params.km = this.getKM();
      params.params.lambdaAN = this.getLambdaAN();
      
      return params;
    }

   
};

/**
* @override
*/
ModelPtolemyBase.prototype.connectSpheres = function(params) {
        this.ptolemySphere = new Longituder();  
        this.updateList.push(this.ptolemySphere);
      
        this.root.addNode(this.sphere[1]);
          //S1
          this.sphere[1].addNode( this.earth );
          this.sphere[1].addNode( this.hull );
          this.sphere[1].anchor.addNode( this.stars );
          this.sphere[1].anchor.addNode( this.ptolemySphere ); 
            this.ptolemySphere.addNode(this.ecliptic);                          
              this.ecliptic.anchor.addNode(this.sun);
            this.ptolemySphere.anchor.addNode( this.sphere[2] );          
              //S2
              this.sphere[2].addNode( this.equantPoint ); 
              this.sphere[2].anchor.addNode( this.sphere[3] );
                //S3
                this.sphere[3].anchor.addNode( this.sphere[4] );  
                  //S4
                  this.sphere[4].anchor.addNode( this.planet );
                  this.sphere[4].remove(this.sphere[4].anchor);
                  this.sphere[4].ptolemy =  new Node(); 
                  this.sphere[4].addNode(this.sphere[4].ptolemy);      
                  this.sphere[4].ptolemy.addNode(this.sphere[4].anchor);             
};
    
/** @override */
ModelPtolemyBase.prototype.reset = function () {
        ModelBase.prototype.reset.call(this);
        this.setEquant( Utils.toDec(this.state.equant || 0 ));
        this.setRadiusDeferent( Utils.toDec(this.state.derefentRadius || 0) );
        this.setRadiusEpicycle( Utils.toDec(this.state.epicycleRadius || 0) );
        this.setBaseRadius( Utils.toDec(this.state.baseRadius || 0) );         
        this.ptolemySphere.setApsidalAngle( Utils.toDec(this.state.apsidalAngle || 0) );
        this.ptolemySphere.setApsidalSpeed( Utils.toDec(this.state.centuryStep || 0) );
        this.ptolemySphere.setInclination( Utils.toDec(this.state.inclination || 0) );
        this.setDeviation( Utils.toDec(this.state.deviation || 0) );
        this.setKM( Utils.toDec(this.state.km || 0) );        
        this.setLambdaAN( Utils.toDec(this.state.lambdaAN || 0) );
        this.wd = 0;
        
        this.adjustAnomaly();   
        
        // sun stuff
        this.realSunS[1].setOffsetRotateSpeed(0);
        this.realSunS[1].setOffsetRotateAngle( 56.5 );    
        this.realSunS[1].setRotateAngle( 274.25 );
        this.realSunS[2].setRotateAngle( (360-274.25) );

        this.realSun.setDist(0);
        this.realSunS[2].setScale(0);
        this.realSunS[1].setSpeed(  this.state.sunSpeed );
        this.realSunS[2].setSpeed( -this.state.sunSpeed );

};


