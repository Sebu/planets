
/**
 * @constructor
 */
Model5 = function(params) {
	ModelBase.call(this);
    params.name = "Model5";
    params.spheres = 5;
    this.genSpheres(params);

    BaseMixin.call(this);
  
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }

    this.alpha=0;
    this.getAlpha = function() {return this.alpha; }
    this.setAlpha = function(val) {
        this.alpha=val;
        this.updateMovement();
    }


    this.beta=0;
    this.getBeta = function() {return this.beta; }
    this.setBeta = function(val) {
        this.beta=val;
        this.updateMovement();
    }

    this.gamma=0;
    this.getGamma = function() {return this.gamma; }
    this.setGamma = function(val) {
        this.gamma=val;
        this.updateMovement();
    }

    this.loadPreset = function(node) {
      ModelBase.prototype.loadPreset.call(this,node);
      this.setAlpha(this.currentPlanet.alpha);
      this.setBeta(this.currentPlanet.beta);
      this.setGamma(this.currentPlanet.gamma);

    }
    this.updateMovement = function() {
        var alpha = (this.alpha!=0) ? 360/this.alpha : 0;
        var beta = (this.beta!=0) ? 360/this.beta : 0;
        var gamma = (this.gamma!=0) ? 360/this.gamma : 0;
        this.sphere[3].setStep(alpha);
        this.sphere[4].setStep(-beta);
        this.sphere[5].setStep(gamma);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Path"]});
        ModelBase.prototype.update.call(this, time);
    }


};

Model5.prototype = new ModelBase;
Model5.prototype.constructor = Model5;
