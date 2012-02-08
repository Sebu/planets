
/**
 * basic 4 sphere eudoxus model  
 * use as an example for your own models
 * @constructor
 * @extends ModelBase
 */
Model4 = function() {

  this.create();
  
  // generate 4 connected spheres
  this.genSpheres({spheres : 4});
  
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

  /** 
   * @override 
   * @function 
   * @param time millisecons passed since last call
   */
  update = function(time) {
      this.addCurve({
          index: 0,                       // curve storage index
          anchor: this.sphere[1].anchor,  // attach curve to anchor
          start: 2,                       // first moving sphere
          stop: 5,                        // last moving sphere
          node: this.planet.mesh,         // observe this node
          color: config.colors["Path"] });
      this.addCurve({
          index: 1,
          anchor: this.sphere[2].anchor,
          start: 3,
          stop: 5,
          node: this.planet.mesh,
          color: config.colors["Hippo"],
          trails: false  });
      ModelBase.prototype.update.call(this, time);        
  };

};

Model4.prototype = new ModelBase;
Model4.prototype.constructor = Model4;
Model4.prototype.name = "Model4";





  
  
  
