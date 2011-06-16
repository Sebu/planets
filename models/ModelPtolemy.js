

/**
 * @constructor
 */
ModelPtolemy = function(params) {
	BasePlanetModel.call(this);	
    params.name = "ModelPtolemy";
    params.spheres = 2;
    this.init(params);

    this.sphere[0].realAngle = 0;
    this.setEquant = function(value) {
      this.sphere[0].equant = value;
      this.earth.setDist(value*6.0);
    };
    this.getEquant = function() { return this.sphere[0].equant; }
    
    this.sphere[0].updateMovement = function(step) {
      this.rotateAngle += this.step * step;
      
      this.setRotateAngle(this.rotateAngle);
    };
  
    this.sphere[0].setRotateAngle = function(angle) {
      this.rotateAngle = angle; 
      var realAngle = this.rotateAngle/PI_SCALE - Math.asin((this.equant/this.radius) * Math.sin(this.rotateAngle/PI_SCALE));
      this.setArcAngle(realAngle*PI_SCALE);
      this.anchor.rotation.y = realAngle;
    };

    this.setRadius0 = function(value) {
      this.sphere[0].radius = value;
      this.sphere[0].setScale(value*6.0);
      this.sphere[1].anchor.position.z = value*6.0;
    };
    this.getRadius0 = function() { return this.sphere[0].radius; }

  
        
    this.setRadius1 = function(value) {
      this.radius1 = value;
      this.sphere[1].setScale(value*6.0);
      this.planet.setDist(value*6.0);
    };
    this.getRadius1 = function() { return this.radius1; }

    this.setEquant(0.1);
    this.setRadius0(1.0); 
    this.setRadius1(0.66);    
    
    this.setSpeed0 = function(speed) {
      this.sphere[0].setSpeed(speed);
    }
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.root, start: -1, node: this.planet.mesh, color: colors["Path"]});
        BasePlanetModel.prototype.update.call(this, time);
    }

};

ModelPtolemy.prototype = new BasePlanetModel;
ModelPtolemy.prototype.constructor = ModelPtolemy;
