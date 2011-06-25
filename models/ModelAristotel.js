
/**
 * @constructor
 */
ModelAristotle = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelAristotle";
    params.spheres = 4;
    
    this.init(params);

    // add unwinding spheres
    var s5 = this.sphere[5] = new Spherical({ scale: 7.0, axisAngle: 0.0, speed: 0.0, color: colors["S4"]});
    var s6 = this.sphere[6] = new Spherical({ scale: 6.5, axisAngle: 0.0, speed: 0.0, color: colors["S3"]});
    var s7 = this.sphere[7] = new Spherical({ scale: 6.0, axisAngle: 0.0, speed: 0.0, color: colors["S2"]});
    var s8 = this.sphere[8] = new Spherical({ scale: 5.0, axisAngle: 0.0, speed: 0.0, color: colors["S1"]});
    
    this.updateList.push(s5);
    this.updateList.push(s6);    
    this.updateList.push(s7);    
    this.updateList.push(s8);  
        
    this.sphere[4].anchor.addNode(s5);
    this.sphere[5].anchor.addNode(s6);
    this.sphere[6].anchor.addNode(s7);
    this.sphere[7].anchor.addNode(s8);


    this.s2Toggle = true;    
    this.s3Toggle = true;
    this.s4Toggle = true;
    this.s5Toggle = true;
    this.s6Toggle = true;    
    this.s7Toggle = true;
    this.s8Toggle = true;
    
 
//    this.sphere[7].anchor.addNode( this.stars2 = new Cloud({count:50}) );


          
    this.createJoint = function(params) {
      var mat = new THREE.LineBasicMaterial( { linewidth: params.linewidth, color: rgbToHex(params.color) } );
      params.to.visuals.njoint = new THREE.Line( aLine, mat );
      params.to.visuals.sjoint = new THREE.Line( aLine, mat );
      params.to.visuals.njoint.scale.y = params.from.scaleFactor-params.to.scaleFactor;
      params.to.visuals.njoint.position.y = params.to.scaleFactor;
      params.to.visuals.sjoint.scale.y = -(params.from.scaleFactor-params.to.scaleFactor);
      params.to.visuals.sjoint.position.y = -params.to.scaleFactor;    
      params.to.anchor.addNode(params.to.visuals.njoint);
      params.to.anchor.addNode(params.to.visuals.sjoint);    
    }
   this.createJoint({from: this.sphere[4], to: this.sphere[5], color: colors["S4"], linewidth:4 }); 
   this.createJoint({from: this.sphere[3], to: this.sphere[6], color: colors["S3"], linewidth:3 }); 
   this.createJoint({from: this.sphere[2], to: this.sphere[7], color: colors["S2"], linewidth:2 }); 
   this.createJoint({from: this.sphere[1], to: this.sphere[8], color: colors["S1"], linewidth:1 }); 
    
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }

    // ecliptic
    this.setAxisAngle2 = function(angle) {
      var angle1 = this.sphere[2].getAxisAngle();
      var angle7 = this.sphere[8].getAxisAngle();
      var diff = angle - angle1;
      this.sphere[2].setAxisAngle(angle1 + diff);
      this.sphere[8].setAxisAngle(angle7 - diff);
    }

    this.setAxisAngle3 = function(angle) {
      var angle2 = this.sphere[3].getAxisAngle();
      var angle6 = this.sphere[7].getAxisAngle();
      var diff = angle - angle2;
      this.sphere[3].setAxisAngle(angle2 + diff);
      this.sphere[7].setAxisAngle(angle6 - diff);

    }


    this.setAxisAngle4 = function(angle) {
      var angle3 = this.sphere[4].getAxisAngle();
      var angle5 = this.sphere[6].getAxisAngle();
      var diff = angle - angle3;
      this.sphere[4].setAxisAngle(angle3 + diff);
      this.sphere[5].setAxisAngle(0);
      this.sphere[6].setAxisAngle(angle5 - diff);
    }


    this.setS2Toggle = function(state) { 
      this.s2Toggle = state;
      if(!state) this.sphere[2].setSpeed(0);
      else {
        this.sphere[2].setSpeed(-this.sphere[5].getSpeed());
        this.sphere[2].setRotateAngle(-this.sphere[5].getRotateAngle());
      }
      
    }

    this.getS2Toggle = function() { 
      return this.s2Toggle;
    }


    this.setS3Toggle = function(state) { 
      this.s3Toggle = state;
      if(!state) this.sphere[3].setSpeed(0);
      else {
        this.sphere[3].setSpeed(-this.sphere[4].getSpeed());
        this.sphere[3].setRotateAngle(-this.sphere[4].getRotateAngle());
      }
      
    }

    this.getS3Toggle = function() { 
      return this.s3Toggle;
    }


    this.setS4Toggle = function(state) { 
      this.s4Toggle = state;
      if(!state) this.sphere[4].setSpeed(0);
      else {
        this.sphere[4].setSpeed(-this.sphere[4].getSpeed());
        this.sphere[4].setRotateAngle(-this.sphere[4].getRotateAngle());
      }
      
    }

    this.getS4Toggle = function() { 
      return this.s4Toggle;
    }

    this.setS5Toggle = function(state) { 
      this.s5Toggle = state;
      if(!state) this.sphere[5].setSpeed(0);
      else {
        this.sphere[5].setSpeed(-this.sphere[4].getSpeed());
        this.sphere[5].setRotateAngle(-this.sphere[4].getRotateAngle());
      }
      
    }

    this.getS5Toggle = function() { 
      return this.s5Toggle;
    }

    this.setS6Toggle = function(state) { 
      this.s6Toggle = state;
      if(!state) this.sphere[6].setSpeed(0);
      else {
        this.sphere[6].setSpeed(-this.sphere[3].getSpeed());
        this.sphere[6].setRotateAngle(-this.sphere[3].getRotateAngle());
      }
      
    }

    this.getS6Toggle = function() { 
      return this.s6Toggle;
    }

    this.setS7Toggle = function(state) { 
      this.s7Toggle = state;
      if(!state) this.sphere[7].setSpeed(0);
      else {
        this.sphere[7].setSpeed(-this.sphere[2].getSpeed());
        this.sphere[7].setRotateAngle(-this.sphere[2].getRotateAngle());
      }
      
    }


    this.getS7Toggle = function() { 
      return this.s7Toggle;
    }    

    this.setS8Toggle = function(state) { 
      this.s8Toggle = state;
      if(!state) this.sphere[8].setSpeed(0);
      else {
        this.sphere[8].setSpeed(-this.sphere[1].getSpeed());
        this.sphere[8].setRotateAngle(-this.sphere[1].getRotateAngle());
      }
      
    }
    this.getS8Toggle = function() { 
      return this.s8Toggle;
    }



    this.setSpeed1Fix = function(speed) {
      this.setSpeed1(speed);
      if(this.s8Toggle) this.sphere[8].setSpeed(-this.sphere[1].getSpeed());
    }

    this.getSpeed1Fix = function() {
      return this.getSpeed1();
    }

    this.setSpeed2 = function(speed) {
      this.sphere[2].setSpeed(speed);
      if(this.s7Toggle) this.sphere[7].setSpeed(-speed);
    }

    this.setSpeed3 = function(speed) {
        this.sphere[3].setSpeed(speed);
        this.sphere[4].setSpeed(-speed);
        if(this.s5Toggle) this.sphere[5].setSpeed(speed);
        if(this.s6Toggle) this.sphere[6].setSpeed(-speed);
    }

   this.setShowSphere18 = function(state) {
      this.sphere[1].setVisuals(["npole","spole"], state);
      this.sphere[8].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere18 = function() { return false; };

   this.setShowSphere36 = function(state) {
      this.sphere[3].setVisuals(["npole","spole"], state);
      this.sphere[6].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere36 = function() { return false; };

   this.setShowSphere27 = function(state) {
      this.sphere[2].setVisuals(["npole","spole"], state);
      this.sphere[7].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere27 = function() { return false; };
   
   this.setShowSphere45 = function(state) {
      this.sphere[4].setVisuals(["npole","spole"], state);
      this.sphere[5].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere45 = function() { return false; };      
   
   this.setShowSphere5 = function(state) {
      this.sphere[5].setVisuals(["sjoint","njoint","equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere5 = function() { return true; };

   this.setShowSphere6 = function(state) {
      this.sphere[6].setVisuals(["sjoint","njoint","equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere6 = function() { return true; };

   this.setShowSphere7 = function(state) {
      this.sphere[7].setVisuals(["sjoint","njoint","equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere7 = function() { return true; };

   this.setShowSphere8 = function(state) {
      this.sphere[8].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere8 = function() { return true; };

    this.setRotateStart2 = function(start) {
      this.sphere[2].setRotateStart(start);
      this.sphere[7].setRotateStart(-start);
    }

    this.setRotateStart3 = function(start) {
      this.sphere[3].setRotateStart(start);
      this.sphere[6].setRotateStart(-start);
    }


    this.setRotateStart4 = function(start) {
      this.sphere[4].setRotateStart(start);
      this.sphere[5].setRotateStart(-start);
    }

    this.setCurrentPlanet = function(node) {
        BasePlanetModel.prototype.setCurrentPlanet.call(this,node);
        this.sphere[2].setAxisAngle(0);
        this.sphere[3].setAxisAngle(0);       
        this.sphere[4].setAxisAngle(0);
        this.setAxisAngle2(this.currentPlanet.sphere[1].axisAngle);
        this.setAxisAngle3(this.currentPlanet.sphere[2].axisAngle);
        this.setAxisAngle4(this.currentPlanet.sphere[3].axisAngle);

        this.sphere[2].setSpeed(0);
        this.sphere[2].setSpeed(0);
        this.setSpeed2(this.currentPlanet.sphere[1].speed);
        this.setSpeed3(this.currentPlanet.sphere[2].speed);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Path"]});
        this.addCurve({index: 1, anchor: this.sphere[2].anchor, start: 2, node: this.planet.mesh, color: colors["Hippo"]});
        BasePlanetModel.prototype.update.call(this, time);
        
    }
};

ModelAristotle.prototype = new BasePlanetModel;
ModelAristotle.prototype.constructor = ModelAristotle;

