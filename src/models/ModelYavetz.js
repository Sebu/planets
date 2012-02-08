
/**
 * @constructor
 * @extends ModelBase
 */
ModelYavetz = function() {

    ModelBase.prototype.create.call(this);
    this.genSpheres({spheres : 4});
    BaseMixin.call(this);

    var alpha=0,
    beta=0;  

    this.getAlpha = function() {return alpha; }
    this.setAlpha = function(val) {
        alpha=val;
        this.sphere[3].setArcBeta(180-alpha);
        this.sphere[4].setAxisAngle(alpha);
    }


    this.getBeta = function() {return beta; }
    this.setBeta = function(val) {
        beta=val;
        this.planet.setBeta(beta);
        this.sphere[4].setArcBeta(180-beta);
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
        this.addCurve({index: 0, anchor: this.sphere[1].anchor, start: 2, node: this.planet.mesh, color: config.colors["Path"]});
        this.addCurve({index: 1, anchor: this.sphere[2].anchor, start: 3, node: this.planet.mesh, color: config.colors["Hippo"]});
        ModelBase.prototype.update.call(this, time);
    }
};

ModelYavetz.prototype = new ModelBase;
ModelYavetz.prototype.constructor = ModelYavetz;
ModelYavetz.prototype.name = "ModelYavetz";
