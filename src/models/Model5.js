
/**
 * @constructor
  * @extends ModelBase
 */
Model5 = function(params) {
    params.name = "Model5";
	  ModelBase.call(this, params);
    params.spheres = 5;
    this.genSpheres(params);

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
    
    /** @override */
    this.loadPreset = function(node) {
      ModelBase.prototype.loadPreset.call(this, node);
      this.setAlpha(this.currentPlanet.Alpha);
      this.setBeta(this.currentPlanet.Beta);
      this.setGamma(this.currentPlanet.Gamma);
    }

    this.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.Alpha = this.getAlpha();
      params.Beta = this.getBeta();
      params.Gamma = this.getGamma();
      return params;
    }

    this.updateSteps = function() {
      var alpha = (this.alpha!=0) ? 360/this._alpha : 0,
      beta = (this.beta!=0) ? 360/this._beta : 0,
      gamma = (this.gamma!=0) ? 360/this._gamma : 0;
      
      this.sphere[3].setStep(alpha);
      this.sphere[4].setStep(-beta);
      this.sphere[5].setStep(gamma);
    }

    /** @override */
    this.update = function(time) {
      this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: config.colors["Path"]});
      ModelBase.prototype.update.call(this, time);
    }


};

Model5.prototype = new ModelBase;
Model5.prototype.constructor = Model5;
