
/**
 * @constructor
 */
ModelSun = function(params) {
	ModelBase.call(this);
    params.name = "ModelSun";
    params.spheres = 3;
    this.genSpheres(params);

    BaseMixin.call(this);
    
    this.setShowHippo = null;
    this.setShowPath = null;
    

    this.sunYears = 0;
    this.setSunYears = function(speed) {
        this.sunYears = speed;
        model.sphere[3].setSpeed(this.sunYears*365);
    }
    this.getSunYears = function() {
      return this.sunYears;
    }
    
    this.getMeanLongitude = function() {
      return (this.sphere[2].getRotateAngle() + this.sphere[3].getRotateAngle())%360.0;
    }
    
    this.getEquationOfTime = function() {  
      return ( ( ( this.planet.longitude-this.getMeanLongitude() ) * 360.0 ) /  this.getDaysPerYear() )  * 24;
    }

    this.getDaysPerYear = function() {
      return  (1.0 - (1.0/this.getSunYears())) * this.sphere[2].getSpeed();
    }

   
    this.loadPreset = function(node) {
        ModelBase.prototype.loadPreset.call(this,node);
        this.setSunYears(this.currentPlanet.sunYears);
        this.planet.setGlow(true);
    }

};

ModelSun.prototype = new ModelBase;
ModelSun.prototype.constructor = ModelSun;
