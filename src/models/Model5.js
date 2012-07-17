
/**
 * Callippus model
 * @constructor
 * @extends ModelBase
 */
Model5 = function() {

    this.create();
    this.genSpheres({spheres : 5});

    this.setShowHippo = null;
    BaseMixin.call(this);
  

    this._alpha=0;
    this.getAlpha = function() {return this._alpha; }
    this.setAlpha = function(val) {
        this._alpha=val;
        this.updateSteps();
    }


    this._beta=0;
    this.getBeta = function() {return this._beta; }
    this.setBeta = function(val) {
        this._beta=val;
        this.updateSteps();
    }

    this._gamma=0;
    this.getGamma = function() {return this._gamma; }
    this.setGamma = function(val) {
        this._gamma=val;
        this.updateSteps();
    }
    



};

Model5.prototype = new ModelBase;
Model5.prototype.constructor = Model5;
Model5.prototype.name = "Model5";


    /** @override */
Model5.prototype.setPreset = function(node) {
      ModelBase.prototype.setPreset.call(this, node);
      this.setAlpha(this.state.Alpha);
      this.setBeta(this.state.Beta);
      this.setGamma(this.state.Gamma);
    }

Model5.prototype.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.params.Alpha = this.getAlpha();
      params.params.Beta = this.getBeta();
      params.params.Gamma = this.getGamma();
      return params;
    }

Model5.prototype.updateSteps = function() {
      var
      alpha = (this.alpha!=0) ? 360/this._alpha : 0,
      beta = (this.beta!=0) ? 360/this._beta : 0,
      gamma = (this.gamma!=0) ? 360/this._gamma : 0;
      
      this.sphere[3].setStep(alpha);
      this.sphere[4].setStep(-beta);
      this.sphere[5].setStep(gamma);
    }

/** @override */
Model5.prototype.update = function(time) {
      this.addCurve({
          index: 0,
          anchor: this.sphere[1].anchor,
          start: 2,
          node: this.planet.gfx.mesh,
          color: config.colors["Path"] });
      ModelBase.prototype.update.call(this, time);
};
