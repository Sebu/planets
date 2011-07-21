

/**
 * @constructor
 */
ModelPtolemy = function(params) {
    params.name = params.nam || "ModelPtolemy";
    ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/11.0;
    
    
    this.updateSunDist = function() {
      var dist = (this.sphere[3].radius-this.sphere[4].radius-this.sphere[3].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);

    };

    this.oldAdjustAnomaly = this.adjustAnomaly;
    this.adjustAnomaly = function() {
      var tmp = this.sphere[3].getRotateAngle() - this.sphere[2].getOffsetRotateAngle(); 
      var realAngle = tmp/PI_SCALE - Math.asin((this.sphere[3].equant/this.sphere[3].radius) * Math.sin(tmp/PI_SCALE));
      this.sphere[3].anchor.rotation.y = realAngle;
      this.oldAdjustAnomaly();
    }
    
    
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
        this.realSunS[1].setOffsetRotateAngle( 56.5 );    
        this.realSunS[1].setRotateAngle( 274.25 );
        this.realSunS[2].setRotateAngle( (360-274.25) );

        this.realSunS[2].setScale(0);
        this.realSun.setDist(0);
        this.realSunS[1].setSpeed(365.2466666);
        this.realSunS[2].setSpeed(-365.2466666);
    }    

};

ModelPtolemy.prototype = new ModelBase;
ModelPtolemy.prototype.constructor = ModelPtolemy;


ModelPtolemyInferior = function(params) {
    params.name = "ModelPtolemyInferior";
    ModelPtolemy.call(this, params);

    this.adjustAnomaly = function() {
    }	
}

ModelPtolemyInferior.prototype = new ModelBase;
ModelPtolemyInferior.prototype.constructor = ModelPtolemyInferior;
