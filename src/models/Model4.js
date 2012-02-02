
/**
 * @constructor
 * @extends ModelBase
 */
Model4 = function(params) {
	this.name = "Model4";
  params.spheres = 4;

  this.create(params);
  this.genSpheres(params);
  
  /** @lends BaseMixin */
  BaseMixin.call(this);
  
  
  /**
   * s4 moves opposite to s3
   * @override 
   * @param speed the speed to set for S3 and -S4
   */
  this.setSpeed3 = function(speed) {
    this.sphere[3].setSpeed( speed);
    this.sphere[4].setSpeed(-speed);
  };


};

Model4.prototype = new ModelBase;
Model4.prototype.constructor = Model4;

/** 
 * @override 
 * @function 
 * @param time millisecons passed since last call
 */
Model4.prototype.update = function(time) {
    this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, stop: 5, node: this.planet.mesh, color: config.colors["Path"]});
    this.addCurve({index: 1, anchor: this.sphere[2].anchor, start: 2, stop: 5, node: this.planet.mesh, color: config.colors["Hippo"], trails: false});
    ModelBase.prototype.update.call(this, time);        
};



  
  
  
