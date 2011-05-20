
/**
 * @constructor
 */
Model4 = function(params) {
	BasePlanetModel.call(this);
    params.name = "Model4";
    params.spheres = 4;
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
        //Spherical.prototype.setAxisAngle.call(this, 90 - angle);
    }

    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(-speed);
    }

    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
    }

		this.updateHippo = function() {
        this.addCurve(1, this.sphere[1].curve, this.calcCurve({depth: 1, node: this.planet.mesh}), colors["Hippo"]);
		}
		
    this.update = function(time) {
        this.addCurve(0, this.sphere[0].curve, this.calcCurve({depth: 0, node: this.planet.mesh}), colors["Path"]);
        this.updateHippo();
        BasePlanetModel.prototype.update.call(this, time);
        
    }
};

Model4.prototype = new BasePlanetModel;
Model4.prototype.constructor = Model4;

