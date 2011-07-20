

/**
 * @constructor
 */
ModelPtolemyMoon2 = function(params) {
    params.name = "ModelPtolemyMoon2";
    params.spheres = 4;
	  ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/7.0;


    this.updateSunDist = function() {
      this.realSunS[1].setScale(this.sphere[2].radius*this.factor);
      this.realSunS[2].setScale(this.sphere[2].equant*this.factor);
      this.realSunS[2].anchor.position.z = this.sphere[2].radius*this.factor; 
      this.realSun.setDist(this.sphere[2].equant*this.factor);  
    };
    
        
    
    this.reset = function () {
        ModelBase.prototype.reset.call(this);
        this.setEquant( Utils.toDec(this.currentPlanet.equant));
        this.setRadiusD( Utils.toDec(this.currentPlanet.derefentRadius) ); 
        this.setRadiusE( Utils.toDec(this.currentPlanet.epicycleRadius) ); 
        this.sphere[2].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle) );
        this.sphere[2].setOffsetRotateSpeed( this.currentPlanet.centuryStep );
       
        this.sphere[3].setBobAngle(0);
        this.adjustAnomaly();       
        
        this.sphere[3].anchor.rotation.x = Math.PI/2;
        
        // sun stuff
        this.realSunS[1].setOffsetRotateSpeed(0);
        this.realSunS[1].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle) ); 
        this.realSunS[1].setRotateAngle( this.getRotateStart2() );
        this.realSunS[2].setRotateAngle( (360-this.getRotateStart2()) );

    }    

    
};

ModelPtolemyMoon2.prototype = new ModelBase;
ModelPtolemyMoon2.prototype.constructor = ModelPtolemyMoon2;
