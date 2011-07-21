

/**
 * @constructor
 */
ModelPtolemySun = function(params) {
    params.name = "ModelPtolemySun";
    params.spheres = 4;
	  ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/7.0;


    this.updateSunDist = function() {
      this.realSunS[1].setScale(this.sphere[3].radius*this.factor);
      this.realSunS[2].setScale(this.sphere[3].equant*this.factor);
      this.realSunS[2].anchor.position.z = this.sphere[3].radius*this.factor; 
      this.realSun.setDist(this.sphere[3].equant*this.factor);  
    };
    
        
    this.setSpeed3 = function(speed) {
      this.sphere[3].setSpeed(speed);
      this.realSunS[1].setSpeed(speed);
      this.realSunS[2].setSpeed(-speed);
    };
    
    
    
    this.reset = function () {
        ModelBase.prototype.reset.call(this);
        this.setEquant( Utils.toDec(this.currentPlanet.equant));
        this.setRadiusD( Utils.toDec(this.currentPlanet.derefentRadius) ); 
        this.setRadiusE( Utils.toDec(this.currentPlanet.epicycleRadius) ); 
        this.sphere[3].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle) );
        this.sphere[3].setOffsetRotateSpeed( this.currentPlanet.centuryStep );
       
        this.sphere[4].setBobAngle(0);
//        this.setMeanLongitude( Utils.toDec(this.currentPlanet.MeanLongitude) );
        this.adjustAnomaly();       
        
        // sun stuff
        this.realSunS[1].setOffsetRotateSpeed(0);
        this.realSunS[1].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle) ); 
        this.realSunS[1].setRotateAngle( this.getRotateStart2() );
        this.realSunS[2].setRotateAngle( (360-this.getRotateStart2()) );

    }    

    
};

ModelPtolemySun.prototype = new ModelBase;
ModelPtolemySun.prototype.constructor = ModelPtolemySun;
