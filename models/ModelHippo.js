

/**
 * @constructor
 */
ModelHippo = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelHippo";
    params.spheres = 4;
    this.init(params);

    this.sun.setEnabled(false);
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(-speed);
    }


    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
    }

    this.update = function(time) {
       this.addCurve({index: 0, anchor: this.root, start: -1, node: this.planet.mesh, color: colors["Path"]});
       BasePlanetModel.prototype.update.call(this, time);
    }

};

ModelHippo.prototype = new BasePlanetModel;
ModelHippo.prototype.constructor = ModelHippo;
