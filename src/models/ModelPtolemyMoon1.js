/**
 * @constructor
 * @extends ModelPtolemyMoonBase
 */
ModelPtolemyMoon1a = function() {
    this.create();
  
    /** @override */
    this.adjustAnomaly = function() {
      var realAngle = mod(this.sphere[2].getRotateAngle(), 360) - mod(this.sphere[3].getRotateAngle(), 360);
      this.sphere[2].anchor.rotation.y = realAngle/PI_SCALE;
    }
        
    
};

ModelPtolemyMoon1a.prototype = new  ModelPtolemyMoonBase;
ModelPtolemyMoon1a.prototype.constructor = ModelPtolemyMoon1a;
ModelPtolemyMoon1a.prototype.name = "ModelPtolemyMoon1a";

/**
 * @constructor
 * @extends ModelPtolemyMoonBase
 */
ModelPtolemyMoon1b = function() {
    this.create();

    /** @override */
    this.adjustAnomaly = function() {
      this.sphere[4].anchor.rotation.y = -this.sphere[4].anchor.rotation.y;
    }
        
    
};

ModelPtolemyMoon1b.prototype = new ModelPtolemyMoonBase;
ModelPtolemyMoon1b.prototype.constructor = ModelPtolemyMoon1b;
ModelPtolemyMoon1b.prototype.name = "ModelPtolemyMoon1b";
