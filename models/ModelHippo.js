

/**
 * @constructor
 */
ModelHippo = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelHippo";
    params.spheres = 2;
    this.init(params);

    this.sun.setEnabled(false);
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }



    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(speed);
        this.sphere[1].setSpeed(-speed);
    }

    this.update = function(time) {
       this.addCurve(0, this.root, this.calcCurve({depth: -1, node: this.planet.mesh}), colors["Path"]);
       BasePlanetModel.prototype.update.call(this, time);
    }

};

ModelHippo.prototype = new BasePlanetModel;
ModelHippo.prototype.constructor = ModelHippo;
