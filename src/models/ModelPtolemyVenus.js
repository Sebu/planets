/**
 * @constructor
 * @extends ModelPtolemyBase
 */
ModelPtolemyVenus = function(params) {
    params.name = "ModelPtolemyVenus";
    ModelPtolemyBase.call(this, params);	

    this.factor = 1.0/11.0;
    
    this.sphere[4].anchor.eulerOrder = "XYZ";  
    this.sphere[4].ptolemy.eulerOrder = "YXZ";  
    

    this.adjustAnomaly = function() {
      var lambdaA = this.ptolemySphere.getApsidalAngle()/PI_SCALE,    
      lambdaMA = this.sphere[3].getRotateAngle()/PI_SCALE - lambdaA,
      lambdaAN = this.lambdaAN/PI_SCALE,
      lambdaN = lambdaA - lambdaAN,
      defDelta = Math.asin((this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      earthDelta = Math.asin((-this.sphere[3].equant/this.sphere[3].radius) * Math.sin(lambdaMA)),
      lambdaCA = lambdaMA - defDelta - earthDelta,
      lambdaD = lambdaCA + lambdaAN,
      i = this.ptolemySphere.inclination/PI_SCALE * Math.sin( lambdaD ),
      j = this.getDeviation()/PI_SCALE * Math.sin( lambdaD + Math.PI/2 ),
      k = this.getKM()/PI_SCALE * Math.sin( lambdaD );   


      // true deferent angle
      this.sphere[3].anchor.rotation.y = lambdaMA - defDelta;

      // inclination correction
      this.ptolemySphere.pivot.rotation.y = lambdaN;
      this.ptolemySphere.anchor.rotation.y -= lambdaN;
      this.ptolemySphere.pivot.rotation.z =  i;

      // bobbing motion
      this.sphere[4].rotation.y = earthDelta;
      this.sphere[4].rotation.z = k;
      
      this.sphere[4].ptolemy.rotation.x = j;
      this.sphere[4].gfx.crank.rotation.z = -lambdaD;      
      
      // mean anomaly correction     
      this.sphere[4].anchor.rotation.y += - earthDelta + defDelta;

    }
    
    
    this.updateSunDist = function() {
      var dist = (this.sphere[2].radius+this.sphere[3].radius+this.sphere[4].radius+this.sphere[3].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);
    };    
    

};

ModelPtolemyVenus.prototype = new ModelBase;
ModelPtolemyVenus.prototype.constructor = ModelPtolemyVenus;