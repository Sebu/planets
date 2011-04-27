
Model4 = function(params) {
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
        if(this.showCurve1) this.addCurve(1, this.sphere[1].curve, this.calcCurve(1, this.name + "Planet"), colors["Hippo"]);
		}
		
    this.update = function() {
        if(this.showCurve0) this.addCurve(0, this.sphere[0].curve, this.calcCurve(0, this.name + "Planet"), colors["Path"]);
        this.updateHippo();
        BasePlanetModel.prototype.update.call(this);
        
    }
};

Model4.prototype = new BasePlanetModel;
Model4.prototype.constructor = Model4;

