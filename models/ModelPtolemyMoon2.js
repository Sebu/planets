

/**
 * @constructor
 */
ModelPtolemyMoon2 = function(params) {
    params.name = "ModelPtolemyMoon2";
	  ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/7.0;
    this.setAnimSpeed(60);


    this.updateSunDist = function() {
      this.realSunS[1].setScale(this.sphere[3].radius*this.factor);
      this.realSunS[2].setScale(this.sphere[3].equant*this.factor);
      this.realSunS[2].anchor.position.z = this.sphere[3].radius*this.factor; 
      this.realSun.setDist(this.sphere[3].equant*this.factor);  
    };
    
    
    
    this.adjustAnomaly = function() {
      var tmp = this.sphere[2].getRotateAngle() - 2*this.sphere[3].getRotateAngle(); 
      this.sphere[2].anchor.rotation.y = degToRad(tmp);
      var tmp = 2*this.sphere[3].getRotateAngle();
      var realAngle = tmp/PI_SCALE - Math.asin((-this.sphere[2].radius/this.sphere[3].radius) * Math.sin(tmp/PI_SCALE));      
      this.sphere[3].anchor.rotation.y = realAngle;
      this.sphere[4].anchor.rotation.y = -this.sphere[4].anchor.rotation.y;

      //TODO: magic??? 
      var lambdaAN = (this.lambdaAN+this.wd)/PI_SCALE  + realAngle + Math.PI/2; 
      // inclination correction
      this.ptolemySphere.pivot.rotation.y = -lambdaAN;
      this.ptolemySphere.anchor.rotation.y = lambdaAN;   


      // mean anomaly correction
      //TODO: 2 disjoint models :)
      if(this.currentPlanet.accurateMoon) {
        var realAngle2 = tmp/PI_SCALE - Math.asin((this.sphere[2].radius/this.sphere[3].radius) * Math.sin(tmp/PI_SCALE));            
        var adjustment = realAngle2-realAngle;
      } else {
        var adjustment = tmp/PI_SCALE-realAngle;
      }
      this.sphere[4].anchor.rotation.y += adjustment;   
      
    }
        
    
};

ModelPtolemyMoon2.prototype = new ModelBase;
ModelPtolemyMoon2.prototype.constructor = ModelPtolemyMoon2;


ModelPtolemyMoon1a = function(params) {
    params.name = "ModelPtolemyMoon1a";
	  ModelPtolemyMoon2.call(this, params);	
  
    this.adjustAnomaly = function() {
      var realAngle = mod(this.sphere[2].getRotateAngle(), 360) - mod(this.sphere[3].getRotateAngle(), 360);
      this.sphere[2].anchor.rotation.y = degToRad(realAngle);
    }
        
    
};

ModelPtolemyMoon1a.prototype = new ModelBase;
ModelPtolemyMoon1a.prototype.constructor = ModelPtolemyMoon1a;


ModelPtolemyMoon1b = function(params) {
    params.name = "ModelPtolemyMoon1b";
	  ModelPtolemyMoon2.call(this, params);	

    
    this.adjustAnomaly = function() {
      this.sphere[4].anchor.rotation.y = -this.sphere[4].anchor.rotation.y;
    }
        
    
};

ModelPtolemyMoon1b.prototype = new ModelBase;
ModelPtolemyMoon1b.prototype.constructor = ModelPtolemyMoon1b;
