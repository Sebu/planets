

/**
 * @constructor
 */
ModelPtolemySun = function(params) {
    params.name = "ModelPtolemySun";
	  ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/7.0;



    this.setShowSun1 = function(state) { 
      this.planet.setEnabled(state); 
      this.sphere[2].setGfx(["equator"],state);
      this.sphere[3].setGfx(["equator"],state);
    };
        
    this.setShowSun2 = function(state) { 
      this.realSun.setEnabled(state); 
      this.realSunS[1].setGfx(["equator"],state);
      this.realSunS[2].setGfx(["equator"],state);
    };

    this.getShowSun1 = function(state) { return this.planet.getEnabled(); }    
    this.getShowSun2 = function(state) { return this.realSun.getEnabled(); }
    
    this.setShowSun2(true);
    
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
    
    
    this.oldReset = this.reset;
    this.reset = function () {
        this.oldReset();
       
        // sun stuff
        this.realSunS[1].setOffsetRotateSpeed(0);
        this.realSunS[1].setOffsetRotateAngle( Utils.toDec(this.currentPlanet.apsidalAngle) ); 
        this.realSunS[1].setRotateAngle( this.getRotateStart3() );
        this.realSunS[2].setRotateAngle( (360-this.getRotateStart3()) );

    }    

    
};

ModelPtolemySun.prototype = new ModelBase;
ModelPtolemySun.prototype.constructor = ModelPtolemySun;
