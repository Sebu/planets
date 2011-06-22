
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
        model.sphere[2].setSpeed(this.sunYears*365);
    }
    this.getSunYears = function() {
      return this.sunYears;
    }
    
    this.getMeanLongitude = function() {
      return (this.sphere[1].getRotateAngle() + this.sphere[2].getRotateAngle())%360.0;
//      return (this.longitudeSpeed*this.days)%360.0;
    }
    this.getEquationOfTime = function() {  
      return ( (this.longitude-this.getMeanLongitude() ) * 360.0 ) / ( this.getDaysPerYearTrue()  * 24);
    }

    this.getDaysPerYearTrue = function() {
       return  (1.0 - (1.0/this.getSunYears())) * this.sphere[1].getSpeed();
    }

    this.getDaysPerYear = function() {
       return  frac(this.getDaysPerYearTrue());
    }
    
    this.setCurrentPlanet = function(node) {
        BasePlanetModel.prototype.setCurrentPlanet.call(this,node);
        this.setSunYears(this.currentPlanet.sunYears);
    }

};

ModelSun.prototype = new BasePlanetModel;
ModelSun.prototype.constructor = ModelSun;
