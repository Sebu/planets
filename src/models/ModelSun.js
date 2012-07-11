
/**
 * @constructor
 * @extends ModelBase
 */
ModelSun = function() {

    this.create();
    this.genSpheres({spheres : 3});

    BaseMixin.call(this);
    
    this.setShowHippo = null;
    this.setShowPath = null;
    

    this.sunYears = 0;
    this.setSunYears = function(speed) {
        this.sunYears = speed;
        this.sphere[3].setSpeed(this.sunYears*365);
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

   
    this.getPreset = function(node) {
        ModelBase.prototype.getPreset.call(this,node);
        this.setSunYears(this.state.sunYears);
    }
    
    this.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.sunYears = this.getSunYears();
      return params;
    }

};

ModelSun.prototype = new ModelBase;
ModelSun.prototype.constructor = ModelSun;
ModelSun.prototype.name = "ModelSun";
