/**
 * @constructor
 * @extends ModelPtolemyMoon2
 */
ModelPtolemyMoon1a = function(params) {
    params.name = "ModelPtolemyMoon1a";
	  ModelPtolemyMoon2.call(this, params);	
  
    /** @override */
    this.adjustAnomaly = function() {
      var realAngle = mod(this.sphere[2].getRotateAngle(), 360) - mod(this.sphere[3].getRotateAngle(), 360);
      this.sphere[2].anchor.rotation.y = realAngle/PI_SCALE;
    }
        
    
};

ModelPtolemyMoon1a.prototype = new ModelBase;
ModelPtolemyMoon1a.prototype.constructor = ModelPtolemyMoon1a;


/**
 * @constructor
 * @extends ModelPtolemyMoon2
 */
ModelPtolemyMoon1b = function(params) {
    params.name = "ModelPtolemyMoon1b";
	  ModelPtolemyMoon2.call(this, params);	

    /** @override */
    this.adjustAnomaly = function() {
      this.sphere[4].anchor.rotation.y = -this.sphere[4].anchor.rotation.y;
    }
        
    
};

ModelPtolemyMoon1b.prototype = new ModelBase;
ModelPtolemyMoon1b.prototype.constructor = ModelPtolemyMoon1b;
