

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

    this.adjustAnomaly = function() {
      var lambdaA = this.ptolemySphere.getApsidalAngle()/PI_SCALE,    
      lambdaMA = this.sphere[3].getRotateAngle()/PI_SCALE - lambdaA,
      lambdaAN = 85.5/PI_SCALE,
      lambdaN = lambdaA - lambdaAN;
      defDelta = Math.asin((this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      earthDelta = Math.asin((-this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      lambdaCA = lambdaMA - defDelta - earthDelta;      
      console.log(mod(lambdaCA*PI_SCALE,360));
      this.sphere[3].anchor.rotation.y = lambdaMA - defDelta;
      this.sphere[4].rotation.y = earthDelta;
      this.sphere[4].anchor.rotation.y += (-earthDelta + defDelta);

      this.ptolemySphere.pivot.rotation.y = lambdaN;
      this.ptolemySphere.anchor.rotation.y -= lambdaN;
      //
      this.bobAngle = degToRad(this.getDeviation()) * Math.sin( lambdaCA + lambdaAN );
      this.sphere[4].anchor.rotation.x =  this.bobAngle;
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
