
/**
 * @constructor
 */
ModelAristotle = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelAristotle";
    params.spheres = 4;
    
    this.init(params);

    // add unwinding spheres
    var s4 = this.sphere[4] = new Spherical({ scale: 7.0, axisAngle: 0.0, speed: 0.0, color: colors["S3"]});
    var s5 = this.sphere[5] = new Spherical({ scale: 6.5, axisAngle: 0.0, speed: 0.0, color: colors["S2"]});
    var s6 = this.sphere[6] = new Spherical({ scale: 6.0, axisAngle: 0.0, speed: 0.0, color: colors["S1"]});
    var s7 = this.sphere[7] = new Spherical({ scale: 5.0, axisAngle: 0.0, speed: 0.0, color: colors["S0"]});
    
    this.updateList.push(s4);
    this.updateList.push(s5);    
    this.updateList.push(s6);    
    this.updateList.push(s7);  
        
    this.sphere[3].anchor.addNode(s4);
    this.sphere[4].anchor.addNode(s5);
    this.sphere[5].anchor.addNode(s6);
    this.sphere[6].anchor.addNode(s7);

    this.s4Toggle = true;
    this.s5Toggle = true;    
    this.s6Toggle = true;
    
 
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
   this.createJoint({from: this.sphere[3], to: this.sphere[4], color: colors["S3"], linewidth:4 }); 
   this.createJoint({from: this.sphere[2], to: this.sphere[5], color: colors["S2"], linewidth:3 }); 
   this.createJoint({from: this.sphere[1], to: this.sphere[6], color: colors["S1"], linewidth:2 }); 
   this.createJoint({from: this.sphere[0], to: this.sphere[7], color: colors["S0"], linewidth:1 }); 
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    // ecliptic
    this.setAxisAngle1 = function(angle) {
      var angle1 = this.sphere[1].getAxisAngle();
      var angle7 = this.sphere[7].getAxisAngle();
      var diff = angle - angle1;
      this.sphere[1].setAxisAngle(angle1 + diff);
      this.sphere[7].setAxisAngle(angle7 - diff);
    }

    this.setAxisAngle2 = function(angle) {
      var angle2 = this.sphere[2].getAxisAngle();
      var angle6 = this.sphere[6].getAxisAngle();
      var diff = angle - angle2;
      this.sphere[2].setAxisAngle(angle2 + diff);
      this.sphere[6].setAxisAngle(angle6 - diff);

    }


    this.setAxisAngle3 = function(angle) {
      var angle3 = this.sphere[3].getAxisAngle();
      var angle5 = this.sphere[5].getAxisAngle();
      var diff = angle - angle3;
      this.sphere[3].setAxisAngle(angle3 + diff);
      this.sphere[4].setAxisAngle(0);
      this.sphere[5].setAxisAngle(angle5 - diff);
    }


    this.setS5Toggle = function(state) { 
      this.s5Toggle = state;
      if(!state) this.sphere[5].setSpeed(0);
      else {
        this.sphere[5].setSpeed(-this.sphere[2].getSpeed());
        this.sphere[5].setRotateAngle(-this.sphere[2].getRotateAngle());
      }
      
    }

    this.getS5Toggle = function(state) { 
      return this.s5Toggle;
    }

    this.setS6Toggle = function(state) { 
      this.s6Toggle = state;
      if(!state) this.sphere[6].setSpeed(0);
      else {
        this.sphere[6].setSpeed(-this.sphere[1].getSpeed());
        this.sphere[6].setRotateAngle(-this.sphere[1].getRotateAngle());
      }
      
    }

    this.getS6Toggle = function(state) { 
      return this.s6Toggle;
    }



    this.setSpeed1 = function(speed) {
      this.sphere[1].setSpeed(speed);
      if(this.s6Toggle) this.sphere[6].setSpeed(-speed);
    }

    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
        this.sphere[4].setSpeed(speed);
        if(this.s5Toggle) this.sphere[5].setSpeed(-speed);
    }

   this.setShowSphere07 = function(state) {
      this.sphere[0].setVisuals(["npole","spole"], state);
      this.sphere[7].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere07 = function() { return false; };

   this.setShowSphere25 = function(state) {
      this.sphere[2].setVisuals(["npole","spole"], state);
      this.sphere[5].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere25 = function() { return false; };

   this.setShowSphere16 = function(state) {
      this.sphere[1].setVisuals(["npole","spole"], state);
      this.sphere[6].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere16 = function() { return false; };
   
   this.setShowSphere34 = function(state) {
      this.sphere[3].setVisuals(["npole","spole"], state);
      this.sphere[4].setVisuals(["sjoint","njoint","npole","spole"], state);
    }
   this.getShowSphere34 = function() { return false; };      
   
   this.setShowSphere4 = function(state) {
      this.sphere[4].setVisuals(["sjoint","njoint","equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere4 = function() { return true; };

   this.setShowSphere5 = function(state) {
      this.sphere[5].setVisuals(["sjoint","njoint","equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere5 = function() { return true; };

   this.setShowSphere6 = function(state) {
      this.sphere[6].setVisuals(["sjoint","njoint","equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere6 = function() { return true; };

   this.setShowSphere7 = function(state) {
      this.sphere[7].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball","markerend"], state);
    }
   this.getShowSphere7 = function() { return true; };

    this.setRotateStart1 = function(start) {
      this.sphere[1].setRotateStart(start);
      this.sphere[6].setRotateStart(-start);
    }

    this.setRotateStart2 = function(start) {
      this.sphere[2].setRotateStart(start);
      this.sphere[5].setRotateStart(-start);
    }


    this.setRotateStart3 = function(start) {
      this.sphere[3].setRotateStart(start);
      this.sphere[4].setRotateStart(-start);
    }

    this.setCurrentPlanet = function(node) {
        BasePlanetModel.prototype.setCurrentPlanet.call(this,node);
        this.sphere[1].setAxisAngle(0);
        this.sphere[2].setAxisAngle(0);       
        this.sphere[3].setAxisAngle(0);
        this.setAxisAngle1(this.currentPlanet.sphere[1].axisAngle);
        this.setAxisAngle2(this.currentPlanet.sphere[2].axisAngle);
        this.setAxisAngle3(this.currentPlanet.sphere[3].axisAngle);

        this.sphere[1].setSpeed(0);
        this.sphere[2].setSpeed(0);
        this.setSpeed1(this.currentPlanet.sphere[1].speed);
        this.setSpeed2(this.currentPlanet.sphere[2].speed);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[0].anchor, start: 0, node: this.planet.mesh, color: colors["Path"]});
        this.addCurve({index: 1, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Hippo"]});
        BasePlanetModel.prototype.update.call(this, time);
        
    }
};

ModelAristotle.prototype = new BasePlanetModel;
ModelAristotle.prototype.constructor = ModelAristotle;

