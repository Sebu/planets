

/**
 * @constructor
 */
ModelPtolemy = function(params) {
	BasePlanetModel.call(this);	
    params.name = "ModelPtolemy";
    params.spheres = 3;
    this.genSpheres(params);
    this.factor = 1.0/7.0;
    
    this.sphere[1].realAngle = 0;



    this.JULIAN_EPOCH = 0.0831088;
    this.PTOLEMY_EPOCH = 1448637.91689121;

    this.startDate = this.PTOLEMY_EPOCH;
 
    this.earth.mesh.scale.set( 0.2, 0.2, 0.2 );  
    this.sun.mesh.scale.set( 0.2, 0.2, 0.2 );

    var material = new THREE.LineBasicMaterial( {  color: "0xFFAAFF" });
    this.equator = new THREE.Line(equator, material );
    this.equator.scale  = new THREE.Vector3( 9,9,9 );
    this.equator.rotation.x = Math.PI/2;
    this.sphere[2].anchor.addNode(this.equator);


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
    this.earthToDeferentLine = new Curve({trails: false, pos: this.earthToDeferent, color: {r:0.6,g:0.6,b:1.0} }); 
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

    this.setShowSphere0 = function(state) { this.sphere[1].setVisuals(["equator","npole","spole","rotationarc","markerarc"], state) };    
    this.setShowSphere2 = function(state) { this.sphere[2].setVisuals(["equator","rotationarc"], state) };
    this.setShowSphere3 = function(state) { this.sphere[3].setVisuals(["equator"], state) };
    


    this.sphere[2].pivot.addNode( this.equantPoint = new Translate({z:4.0}) );    
    this.setEquant = function(value) {
      this.sphere[2].equant = value;
      this.equantPoint.position.z = this.sphere[2].equant*this.factor*2;
      this.sphere[2].anchor.position.z = this.sphere[2].equant*this.factor;
    };
    this.getEquant = function() { return this.sphere[2].equant; }
    

    this.sphere[2].updateMovement = function(step) {
      this.rotateAngle += this.step * step;
      this.setRotateAngle(this.rotateAngle);
    };


    this.sphere[2].setRotateAngle = function(angle) {
      this.rotateAngle = angle; 
      var realAngle = this.rotateAngle/PI_SCALE - Math.asin((this.equant/this.radius) * Math.sin(this.rotateAngle/PI_SCALE));
      this.setArcAngle(realAngle*PI_SCALE);
      this.anchor.rotation.y = realAngle;
    };


    this.updateBlob = function() {
      var scale = (this.sphere[2].radius+this.radius1)*this.factor;
      this.sphere[1].setScale(scale); 
      this.equator.scale  = new THREE.Vector3( scale, scale, scale );
    }
    
    this.setRadiusD = function(value) {
      this.sphere[2].radius = value;
      this.sphere[2].setScale(value*this.factor);
      this.sphere[3].anchor.position.z = value*this.factor;
      this.updateBlob();

    };
    this.getRadiusD = function() { return this.sphere[2].radius; }

  
        
    this.setRadiusE = function(value) {
      this.radius1 = value;
      this.sphere[3].setScale(value*this.factor);
      this.planet.setDist(value*this.factor);
      this.updateBlob();
    };
    this.getRadiusE = function() { return this.radius1; }

    
    
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Path"]});

        BasePlanetModel.prototype.update.call(this, time);
        this.sphere[2].updateOffsetRotateMovement((365.0*time)/this.speed);

        this.epicycleRadius[0] = this.sphere[2].visuals.markerball.currentPos();
        this.epicycleRadius[1] = this.planet.mesh.currentPos();//this.sphere[3].visuals.markerball.currentPos();
        this.epicycleRadiusLine.setPos(this.epicycleRadius);
          
        this.deferentRadius[0] = this.sphere[2].anchor.currentPos();
        this.deferentRadius[1] = this.sphere[2].visuals.markerball.currentPos();
        this.deferentRadiusLine.setPos(this.deferentRadius);

        this.equantPlanet[0] = this.equantPoint.currentPos();        
        this.equantPlanet[1] = this.sphere[2].visuals.markerball.currentPos();
        this.equantPlanetLine.setPos(this.equantPlanet);

        this.earthToDeferent[0] = this.earth.mesh.currentPos();     
        this.earthToDeferent[1] = this.sphere[2].visuals.markerball.currentPos();
        this.earthToDeferentLine.setPos(this.earthToDeferent);

        this.earthToPlanet[0] = this.earth.mesh.currentPos();     
        this.earthToPlanet[1] = this.planet.mesh.currentPos();
        this.earthToPlanetLine.setPos(this.earthToPlanet);

        this.earthToVernal[0] = this.earth.mesh.currentPos();        
        this.earthToVernal[1] = this.sphere[1].visuals.markerball.currentPos();
        this.earthToVernalLine.setPos(this.earthToVernal);        

        


        this.date = this.startDate + this.days;
    }
    
    this.reset = function () {
        BasePlanetModel.prototype.reset.call(this);
        this.setEquant( Utils.toDec(this.currentPlanet.equant));
        this.setRadiusD( Utils.toDec(this.currentPlanet.derefentRadius) ); 
        this.setRadiusE( Utils.toDec(this.currentPlanet.epicycleRadius) ); 
        this.sphere[2].setOffsetRotateSpeed(0);
        this.sphere[2].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle) );   

    }    

};

ModelPtolemy.prototype = new BasePlanetModel;
ModelPtolemy.prototype.constructor = ModelPtolemy;
