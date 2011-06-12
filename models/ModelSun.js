
/**
 * @constructor
 */
ModelSun = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelSun";
    params.spheres = 3;
    this.init(params);

    this.sun.setEnabled(false);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }
    
    

    this.sunYears = 0;
    this.setSunYears = function(speed) {
        this.sunYears = speed;
        //this.sunSpeed = (360.0 * this.sphere[1].getSpeed()) / (365.25 - this.sphere[1].getSpeed());
        //console.log(this.sunSpeed);
//        console.log(1.0/(speed) + (this.getSpeed1()/1.0));
        model.sphere[2].setSpeed(this.sunYears*365);
    }
    this.getSunYears = function() {
      return this.sunYears;
    }
    
    this.setCurrentPlanet = function(node) {
        BasePlanetModel.prototype.setCurrentPlanet.call(this,node);
        this.setSunYears(this.currentPlanet.sunYears);
    }

};

ModelSun.prototype = new BasePlanetModel;
ModelSun.prototype.constructor = ModelSun;
