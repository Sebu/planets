PtolemyMixin = function() {

}

/**
 * @constructor
 */
ModelPtolemyBase = function(params) {
	  ModelBase.call(this);
    params.name = params.name || "ModelPtolemySun";
    params.spheres = params.spheres || 4;
    this.genSpheres(params);
    
    this.setShowHippo = null;
   
    

    BaseMixin.call(this);
    
    this.ptolemizeSpheres(); // :) add some ecliptic/latitude and apsidal stuff to the daily

    this.sphere[1].realAngle = 0;

    this.updateList.push(this.ptolemySphere);

    // Add Ptolemy Sun
    this.realSunS = [];
    var realSunS1 = this.realSunS[1] = new Spherical({ scale: 7.0,  color: colors["S2"]});
    var realSunS2 = this.realSunS[2] = new Spherical({ scale: 6.5,  color: colors["S2"]});
    this.realSun = new Planet({ glow: true, glowMap: config.sunGlowTexture, dist: 6.5, emit: 0.5, scale: 0.2, inner_id: params.name+"realSun",  color:colors["Sun"]});
    this.realSun.setBeta(90.0);
    this.updateList.push(realSunS1);
    this.updateList.push(realSunS2);    
    this.ptolemySphere.addNode(realSunS1);
    realSunS1.anchor.addNode(realSunS2);
    realSunS2.anchor.addNode(this.realSun);

    // date start
    this.startDate = DATES.PTOLEMY_EPOCH;

    // scale 
    this.earth.mesh.scale.set( 0.2, 0.2, 0.2 );  
    this.sun.mesh.scale.set( 0.2, 0.2, 0.2 );

    // add ecliptic vis
    var material = new THREE.LineBasicMaterial( {  color: rgbToHex(colors["S2"]) });
    this.equator = new THREE.Line(equator, material );
    this.equator.scale  = new THREE.Vector3( 9,9,9 );
    this.equator.rotation.x = Math.PI/2;
    this.sphere[3].anchor.addNode(this.equator);


    // add the bob crank vis
    this.sphere[4].gfx.crank = new THREE.Line(equator, material );
    this.sphere[4].gfx.crankRadius = new Curve({trails: false, pos:  [ {x: 0,y: 1,z: 0}, {x: 0, y: 0,z: 0} ], color: colors["S4"] });
    this.crank = new Node();
    this.crank.rotation.y = Math.PI/2;
    this.sphere[4].gfx.crank.addNode(this.sphere[4].gfx.crankRadius);
    this.sphere[4].gfx.crank.addNode(this.crankPoint0 = new Translate({x:0, y: 1, z: 0}));
    this.sphere[4].ptolemy.addNode(this.crankPoint1 = new Translate({x:0, y: 0, z: 0}));

    this.crank.addNode(this.sphere[4].gfx.crank);

    this.sphere[4].addNode(this.crank);
    
    // crank line
    this.cline = [ {x: 0,y: 0,z: -10}, {x: 0, y: 0,z: 10} ];
    this.sphere[4].gfx.crankLine = new Curve({trails: false, pos: this.cline, color: colors["S4"] }); 
    this.root.addNode(this.sphere[4].gfx.crankLine);

    this.adjustCrank = function () {
      var scale = Math.sin(this.getDeviation()/PI_SCALE) * this.sphere[4].radius*this.factor;
      this.crank.scale  = new THREE.Vector3( scale, scale, scale );
      this.crank.position.z = -this.sphere[4].radius*this.factor*1.2;  
      this.crankPoint1.position.z = -this.sphere[4].radius*this.factor;  
    }

    
    // apsidal line
    this.apsidal = [ {x: 0,y: 0,z: -10}, {x: 0, y: 0,z: 10} ];
    this.apsidalLine = new Curve({trails: false, pos: this.apsidal, color: colors["S3"] }); 
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
    this.centerLine = new Curve({trails: false, pos: this.centerL, color: colors["S3"] }); 
    this.root.addNode(this.centerLine);
    this.sphere[2].crankPoint = new Translate({x:0, y:0, z:0});
//    this.sphere[2].crankPoint.position.z = this.sphere[2].gfx.scale;
    this.sphere[2].anchor.addNode(this.sphere[2].crankPoint);


    var that = this;
    this.earth.setEnabled = function(state) {
      this.mesh.visible = state; 
      if(this.glow) this.meshGlow.visible = state; 
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
    this.sphere[1].setVisuals(["equator","npole","spole","rotationarc","markerarc","markerball"]);
    this.sphere[2].setVisuals(["equator","centerLine"]);
    this.sphere[3].setVisuals(["equator"]);
    this.sphere[4].setVisuals(["crankLine", "crankRadius","crank","disc","equator","centerLine"]);
    this.realSunS[1].setVisuals([]);
    this.realSunS[2].setVisuals([]);


    
    this.update = function(time) {
        if(this.running)  this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Path"]});
        ModelBase.prototype.update.call(this, time);


        // mean sun
//        this.ecliptic.anchor.rotation.y = this.ptolemySphere.anchor.rotation.y + this.sphere[3].anchor.rotation.y + this.sphere[4].anchor.rotation.y;

        // lines
        this.cline[0] = this.crankPoint0.currentPos();        
        this.cline[1] = this.crankPoint1.currentPos();  
        this.sphere[4].gfx.crankLine.setPos(this.cline);

        this.equantPlanet[0] = this.equantPoint.currentPos();        
        this.equantPlanet[1] = this.sphere[3].gfx.markerball.currentPos();
        this.equantPlanetLine.setPos(this.equantPlanet);

        this.earthToDeferent[0] = this.earth.mesh.currentPos();     
        this.earthToDeferent[1] = this.sphere[3].gfx.markerball.currentPos();
        this.earthToDeferentLine.setPos(this.earthToDeferent);

        this.earthToPlanet[0] = this.earth.mesh.currentPos();     
        this.earthToPlanet[1] = this.planet.mesh.currentPos();
        this.earthToPlanetLine.setPos(this.earthToPlanet);

        this.centerL[0] = this.sphere[2].crankPoint.currentPos();  
        this.centerL[1] = this.sphere[3].gfx.markerball.currentPos();
        this.centerLine.setPos(this.centerL);

        this.date = this.startDate + this.days;
        if(this.realSun.getEnabled()) 
        this.light.setPos(this.realSun.mesh.currentPos());
    }
    


    this.setAxisAngle2 = function(angle) {
        this.ptolemySphere.axisAngle = angle;
        this.ptolemySphere.rotation.z = angle/PI_SCALE;
    };
    
    this.getAxisAngle2 = function() {
      return this.ptolemySphere.axisAngle;
    };

 
    this.updateBlob = function() {
      var scale = (this.sphere[3].radius+this.sphere[4].radius)*this.factor;
      this.sphere[1].setScale(scale); 
      this.equator.scale  = new THREE.Vector3( scale, scale, scale );
      this.apsidal = [ {x: 0,y: 0, z: -(this.sphere[3].radius-this.sphere[3].equant)*this.factor}, {x: 0, y: 0,z: (this.sphere[3].radius+this.sphere[3].equant)*this.factor} ];
      this.apsidalLine.setPos(this.apsidal);       
    }

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
    
    this.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);    
      params.equant = this.getEquant();
      params.deferentRadius = this.getRadiusDeferent();
      params.epicycleRadius = this.getRadiusEpicycle();
      params.baseRadius = this.getBaseRadius();
      params.apsidalAngle = this.ptolemySphere.getApsidalAngle();
      params.centuryStep = this.ptolemySphere.getApsidalSpeed();
      params.inclination = this.ptolemySphere.getInclination();
      params.deviation = this.getDeviation();
      params.km = this.getKM();
      params.lambdaAN = this.getLambdaAN();
      
      return params;
    }

    this.reset = function () {
        ModelBase.prototype.reset.call(this);
        this.setEquant( Utils.toDec(this.currentPlanet.equant || 0 ));
        this.setRadiusDeferent( Utils.toDec(this.currentPlanet.derefentRadius || 0) );
        this.setRadiusEpicycle( Utils.toDec(this.currentPlanet.epicycleRadius || 0) );
        this.setBaseRadius( Utils.toDec(this.currentPlanet.baseRadius || 0) );         
        this.ptolemySphere.setApsidalAngle( Utils.toDec(this.currentPlanet.apsidalAngle || 0) );
        this.ptolemySphere.setApsidalSpeed( Utils.toDec(this.currentPlanet.centuryStep || 0) );
        this.ptolemySphere.setInclination( Utils.toDec(this.currentPlanet.inclination || 0) );
        this.setDeviation( Utils.toDec(this.currentPlanet.deviation || 0) );
        this.setKM( Utils.toDec(this.currentPlanet.km || 0) );        
        this.setLambdaAN( Utils.toDec(this.currentPlanet.lambdaAN || 0) );
        this.adjustAnomaly();   
        
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


