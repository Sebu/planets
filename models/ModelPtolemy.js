

/**
 * @constructor
 */
ModelPtolemy = function(params) {
	BasePlanetModel.call(this);	
    params.name = "ModelPtolemy";
    params.spheres = 3;
    this.init(params);

    this.factor = 1.0/10.0;
    
    this.sphere[0].realAngle = 0;

    this.JULIAN_EPOCH = 0.0831088;
    this.PTOLEMY_EPOCH = 1448637.91689121;



    var material = new THREE.LineBasicMaterial( {  color: "0xFFEEFF" });
    this.equator = new THREE.Line(equator, material );
    this.equator.scale  = new THREE.Vector3( 9,9,9 );
    this.equator.rotation.x = Math.PI/2;
    this.sphere[1].anchor.addNode(this.equator);

    this.updateBlob = function() {
      var scale = (this.sphere[1].radius+this.radius1)*this.factor;
      this.sphere[0].setScale(scale); 
      this.equator.scale  = new THREE.Vector3( scale, scale, scale );
    }

    this.epicycleRadius = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.epicycleRadiusLine = new Curve({trails: false, pos: this.epicycleRadius, color: colors["S2"] }); 
    this.root.addNode(this.epicycleRadiusLine);
    
    this.deferentRadius = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.deferentRadiusLine = new Curve({trails: false, pos: this.deferentRadius, color: colors["S1"] }); 
    this.root.addNode(this.deferentRadiusLine);


    
    this.equantPlanet = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 10} ];
    this.equantPlanetLine = new Curve({trails: false, pos: this.equantPlanet, color: {r:1.0,g:1.0,b:0.0} }); 
    this.root.addNode(this.equantPlanetLine);
    
    this.setShowSphere0(false);
    this.setShowSphere1(false);
    this.setShowSphere2(false);

//    this.setShowSphere0 = function(state) { this.sphere[0].setVisuals(["npole","equator"], state) };    
    this.setShowSphere1 = function(state) { this.sphere[1].setVisuals(["equator"], state) };
    this.setShowSphere2 = function(state) { this.sphere[2].setVisuals(["equator"], state) };
    
    
    this.setEquant = function(value) {
      this.sphere[1].equant = value;
//      this.earth.setDist(value*this.factor);
      this.sphere[1].anchor.position.z = value*this.factor;
      this.equantPlanet[0] = {x: 0,y: 0, z: 0};
    };
    this.getEquant = function() { return this.sphere[1].equant; }
    
    this.sphere[1].updateMovement = function(step) {
      this.rotateAngle += this.step * step;
      
      this.setRotateAngle(this.rotateAngle);
    };
  
    this.sphere[1].setRotateAngle = function(angle) {
      this.rotateAngle = angle; 
      var realAngle = this.rotateAngle/PI_SCALE - Math.asin((this.equant/this.radius) * Math.sin(this.rotateAngle/PI_SCALE));
      this.setArcAngle(realAngle*PI_SCALE);
      this.anchor.rotation.y = realAngle;
    };

    this.setRadiusD = function(value) {
      this.sphere[1].radius = value;
      this.sphere[1].setScale(value*this.factor);
//      this.sphere[0].visuals.npole.position.y = 0.0;      
//      this.sphere[1].anchor.position.z = value*this.factor;
      this.sphere[2].anchor.position.z = value*this.factor;
      this.updateBlob();

    };
    this.getRadiusD = function() { return this.sphere[1].radius; }

  
        
    this.setRadiusE = function(value) {
      this.radius1 = value;
      this.sphere[2].setScale(value*this.factor);
      this.planet.setDist(value*this.factor);
      this.updateBlob();
    };
    this.getRadiusE = function() { return this.radius1; }

    
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.root, start: -1, node: this.planet.mesh, color: colors["Path"]});
  

        this.epicycleRadius[0] = this.sphere[1].visuals.markerball.currentPos();
        this.epicycleRadius[1] = this.sphere[2].visuals.markerball.currentPos();
        this.epicycleRadiusLine.setPos(this.epicycleRadius);
          
        this.deferentRadius[1] = this.sphere[1].visuals.markerball.currentPos();
        this.deferentRadiusLine.setPos(this.deferentRadius);
        
        this.equantPlanet[1] = this.planet.mesh.currentPos();;
        this.equantPlanetLine.setPos(this.equantPlanet);
        
        
        BasePlanetModel.prototype.update.call(this, time);
        this.date = this.PTOLEMY_EPOCH + this.days;
    }
    
    this.reset = function () {
        BasePlanetModel.prototype.reset.call(this);
        this.setEquant(this.currentPlanet.equant);
        this.setRadiusD(this.currentPlanet.derefentRadius); 
        this.setRadiusE(this.currentPlanet.epicycleRadius);   
    }    

};

ModelPtolemy.prototype = new BasePlanetModel;
ModelPtolemy.prototype.constructor = ModelPtolemy;
