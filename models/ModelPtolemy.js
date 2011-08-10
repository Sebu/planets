

/**
 * @constructor
 */
ModelPtolemy = function(params) {
    params.name = params.nam || "ModelPtolemy";
    ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/11.0;
    
    this.sphere[4].anchor.eulerOrder = "XYZ";  
    this.sphere[4].ptolemy.eulerOrder = "YXZ";  
    
    this.updateSunDist = function() {
      var dist = (this.sphere[3].radius-this.sphere[4].radius-this.sphere[3].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);


    };

    this.adjustAnomaly = function() {
      var lambdaA = this.ptolemySphere.getApsidalAngle()/PI_SCALE,    
      lambdaMA = this.sphere[3].getRotateAngle()/PI_SCALE - lambdaA,
      lambdaAN = this.lambdaAN/PI_SCALE,
      lambdaN = lambdaA - lambdaAN,
      defDelta = Math.asin((this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      earthDelta = Math.asin((-this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      lambdaCA = lambdaMA - defDelta - earthDelta,
      lambdaD = lambdaCA + lambdaAN,
      j = degToRad(this.getDeviation()) * Math.sin( lambdaD );

      var  k = degToRad(this.ptolemySphere.getInclination()) * Math.sin( lambdaMA );  

      // true deferent angle
      this.sphere[3].anchor.rotation.y = lambdaMA - defDelta;

      // inclination correction
      this.ptolemySphere.pivot.rotation.y = lambdaN;
      this.ptolemySphere.anchor.rotation.y -= lambdaN;

      // bobbing motion
      this.sphere[4].rotation.y = earthDelta;
      this.sphere[4].rotation.z = k;
      
      this.sphere[4].anchor.rotation.x = j;
      
      // mean anomaly correction
      this.sphere[4].anchor.rotation.y += - earthDelta + defDelta;

    }
    

};

ModelPtolemy.prototype = new ModelBase;
ModelPtolemy.prototype.constructor = ModelPtolemy;

ModelPtolemyVenus = function(params) {
    params.name = params.nam || "ModelPtolemyVenus";
    ModelPtolemyBase.call(this, params);	
    this.factor = 1.0/11.0;
    
    this.sphere[4].anchor.eulerOrder = "XYZ";  
    this.sphere[4].ptolemy.eulerOrder = "YXZ";  
    
    this.updateSunDist = function() {
      var dist = (this.sphere[3].radius-this.sphere[4].radius-this.sphere[3].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);


    };

    this.adjustAnomaly = function() {
      var lambdaA = this.ptolemySphere.getApsidalAngle()/PI_SCALE,    
      lambdaMA = this.sphere[3].getRotateAngle()/PI_SCALE - lambdaA,
      lambdaAN = this.lambdaAN/PI_SCALE,
      lambdaN = lambdaA - lambdaAN,
      defDelta = Math.asin((this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      earthDelta = Math.asin((-this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      lambdaCA = lambdaMA - defDelta - earthDelta,
      lambdaD = lambdaCA + lambdaAN,
      i = degToRad(this.ptolemySphere.inclination) * Math.sin( lambdaD ),
      j = degToRad(this.getDeviation()) * Math.sin( lambdaD + Math.PI/2 ),
      k = degToRad(this.getKM()) * Math.sin( lambdaD );   

//      var  k = degToRad(this.ptolemySphere.getInclination()) * Math.sin( lambdaMA );  

      // true deferent angle
      this.sphere[3].anchor.rotation.y = lambdaMA - defDelta;

      // inclination correction
      this.ptolemySphere.pivot.rotation.y = lambdaN;
      this.ptolemySphere.anchor.rotation.y -= lambdaN;
      this.ptolemySphere.pivot.rotation.z =  i;

      // bobbing motion
      this.sphere[4].rotation.y = earthDelta;
      this.sphere[4].rotation.z = k;
      
      this.sphere[4].anchor.rotation.x = j;
      
      // mean anomaly correction
      this.sphere[4].anchor.rotation.y += - earthDelta + defDelta;

    }
    

};

ModelPtolemyVenus.prototype = new ModelBase;
ModelPtolemyVenus.prototype.constructor = ModelPtolemyVenus;
ModelPtolemyInferior = function(params) {
    params.name = "ModelPtolemyInferior";
    ModelPtolemy.call(this, params);

    this.sphere[4].anchor.eulerOrder = "XZY";    
    this.sphere[4].ptolemy.eulerOrder = "YXZ";  

    this.adjustAnomaly = function() {
      var lambdaA = this.ptolemySphere.getApsidalAngle()/PI_SCALE,    
      lambdaMA = this.sphere[3].getRotateAngle()/PI_SCALE - lambdaA,
      lambdaAN = this.lambdaAN/PI_SCALE,
      lambdaN = lambdaA - lambdaAN,
      defDelta = Math.asin(((this.sphere[3].equant/2)/this.sphere[3].radius) * Math.sin(lambdaMA)),
      lambdaCA = lambdaMA,
      lambdaD = lambdaCA + lambdaAN,
      i = degToRad(this.ptolemySphere.inclination) * Math.sin( lambdaD ),
      j = degToRad(this.getDeviation()) * Math.sin( lambdaD + Math.PI/2 ),
      k = degToRad(this.getKM()) * Math.sin( lambdaD );      
      
//      var  k1 = degToRad(this.ptolemySphere.getInclination()) * Math.sin( lambdaMA ); 



      
      // base & deferent motion
      this.sphere[2].anchor.rotation.y = -lambdaMA;
      this.sphere[3].anchor.rotation.y = 2*lambdaMA;

      // inclination correction
      this.ptolemySphere.pivot.rotation.y = lambdaN;
      this.ptolemySphere.anchor.rotation.y -= lambdaN;
      this.ptolemySphere.pivot.rotation.z =  i;

      // bobbing motion
      this.sphere[4].rotation.z = k;

      // bobbing motion

      this.sphere[4].anchor.rotation.x = -j;

      // mean anomaly correction
      this.sphere[4].anchor.rotation.y -= defDelta;
      
    }	
}

ModelPtolemyInferior.prototype = new ModelBase;
ModelPtolemyInferior.prototype.constructor = ModelPtolemyInferior;
