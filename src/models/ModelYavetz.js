
/**
 * @constructor
 * @extends ModelBase
 */
ModelYavetz = function(params) {
    params.name = "ModelYavetz";
	ModelBase.call(this, params);
    params.spheres = 4;
    this.genSpheres(params);

    BaseMixin.call(this);
  

//    this.alpha=0;
    this.getAlpha = function() {return this.alpha; }
    this.setAlpha = function(val) {
        this.alpha=val;
        this.sphere[3].setArcBeta(180-this.alpha);
        this.sphere[4].setAxisAngle(this.alpha);
    }


//    this.beta=0;
    this.getBeta = function() {return this.beta; }
    this.setBeta = function(val) {
        this.beta=val;
        this.planet.setBeta(this.beta);
        this.sphere[4].setArcBeta(180-this.beta);
    }

    this.setSpeed3 = function(speed) {
        this.sphere[3].setSpeed(speed);
        this.sphere[4].setSpeed(-speed/2);
    }

    this.loadPreset = function(node) {
      ModelBase.prototype.loadPreset.call(this,node);
      this.setAlpha(this.currentPlanet.sphere[3].AxisAngle);
      this.setBeta(this.currentPlanet.betaRotate);
    }

    this.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.sphere[3].AxisAngle = this.getAlpha();
      params.betaRotate = this.getBeta();
      return params;
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: config.colors["Path"]});
        this.addCurve({index: 1, anchor: this.sphere[2].anchor, start: 2, node: this.planet.mesh, color: config.colors["Hippo"]});
        ModelBase.prototype.update.call(this, time);
    }
};

ModelYavetz.prototype = new ModelBase;
ModelYavetz.prototype.constructor = ModelYavetz;
