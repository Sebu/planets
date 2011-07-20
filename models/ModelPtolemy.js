

/**
 * @constructor
 */
ModelPtolemy = function(params) {
    params.name = "ModelPtolemy";
    params.spheres = 3;
    ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/11.0;
    
    
    this.updateSunDist = function() {
      var dist = (this.sphere[2].radius-this.radius1-this.sphere[2].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);

    };

    this.sphere[2].setRotateAngle = function(angle) {
      this.rotateAngle = angle;
      var tmp = this.rotateAngle - this.getOffsetRotateAngle(); 
      var realAngle = tmp/PI_SCALE - Math.asin((this.equant/this.radius) * Math.sin(tmp/PI_SCALE));
      this.anchor.rotation.y = realAngle;
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
