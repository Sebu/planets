
Wurst = function() {
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }



}
/**
 * @constructor
 */
Model4 = function(params) {
	ModelBase.call(this);
	params.name = params.name || "Model4";
  params.spheres = params.spheres || 4;
   
  this.genSpheres(params);
  
  BaseMixin.call(this);
  
  this.setSpeed3 = function(speed) {
        this.sphere[3].setSpeed(speed);
        this.sphere[4].setSpeed(-speed);
  }


    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, stop: 5, node: this.planet.mesh, color: colors["Path"]});
        this.addCurve({index: 1, anchor: this.sphere[2].anchor, start: 2, stop: 5, node: this.planet.mesh, color: colors["Hippo"]});
        ModelBase.prototype.update.call(this, time);
        
    }
};

Model4.prototype = new ModelBase;
Model4.prototype.constructor = Model4;

