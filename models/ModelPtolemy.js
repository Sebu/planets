

/**
 * @constructor
 */
ModelPtolemy = function(params) {
    params.name = params.nam || "ModelPtolemy";
    ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/11.0;
    
    
    this.updateSunDist = function() {
      var dist = (this.sphere[3].radius-this.sphere[4].radius-this.sphere[3].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);


    };

    this.adjustAnomaly = function() {
      var tmp = this.sphere[3].getRotateAngle() - this.sphere[2].getOffsetRotateAngle(); 
      var realAngle = tmp/PI_SCALE - Math.asin((this.sphere[3].equant/this.sphere[3].radius) * Math.sin(tmp/PI_SCALE));
      this.sphere[3].anchor.rotation.y = realAngle;
       var adjustment = -this.sphere[3].anchor.rotation.y+(this.sphere[3].rotateAngle/PI_SCALE)-this.sphere   [2].getOffsetRotateAngle()/PI_SCALE;
       this.sphere[4].anchor.rotation.y += adjustment;
    }
    

};

ModelPtolemy.prototype = new ModelBase;
ModelPtolemy.prototype.constructor = ModelPtolemy;


ModelPtolemyInferior = function(params) {
    params.name = "ModelPtolemyInferior";
    ModelPtolemy.call(this, params);

    this.adjustAnomaly = function() {
      
    }	
}

ModelPtolemyInferior.prototype = new ModelBase;
ModelPtolemyInferior.prototype.constructor = ModelPtolemyInferior;
