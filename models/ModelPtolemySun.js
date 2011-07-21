

/**
 * @constructor
 */
ModelPtolemySun = function(params) {
    params.name = "ModelPtolemySun";
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
        this.setEquant( Utils.toDec(this.currentPlanet.equant || 0 ));
        this.setRadiusD( Utils.toDec(this.currentPlanet.derefentRadius || 0) ); 
        this.setRadiusE( Utils.toDec(this.currentPlanet.epicycleRadius || 0) );
        this.setBaseRadius( Utils.toDec(this.currentPlanet.baseRadius || 0) );         
        this.sphere[2].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle || 0) );
        this.sphere[2].setOffsetRotateSpeed( this.currentPlanet.centuryStep || 0 );
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
