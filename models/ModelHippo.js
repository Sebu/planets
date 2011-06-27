

/**
 * @constructor
 */
ModelHippo = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelHippo";
    params.spheres = 4;
    this.genSpheres(params);

    this.sun.setEnabled(false);
    
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }


    this.setSpeed3 = function(speed) {
        this.sphere[3].setSpeed(speed);
        this.sphere[4].setSpeed(-speed);
    }

    this.update = function(time) {
       this.addCurve({index: 0, anchor: this.root, start: 0, node: this.planet.mesh, color: colors["Path"], trails: false});
       BasePlanetModel.prototype.update.call(this, time);
    }

};

ModelHippo.prototype = new BasePlanetModel;
ModelHippo.prototype.constructor = ModelHippo;
