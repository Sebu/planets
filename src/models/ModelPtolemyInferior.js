/**
 * @constructor
 * @extends ModelPtolemyBase
 */
ModelPtolemyInferior = function() {

    this.create();
    
    this.factor = 1.0/11.0;
    
    this.sphere[4].anchor.eulerOrder = "XZY";    
    this.sphere[4].ptolemy.eulerOrder = "YXZ";  


    this.adjustAnomaly = function() {
      var 
      lambdaA = this.ptolemySphere.getApsidalAngle()/PI_SCALE,    
      lambdaMA = this.sphere[3].getRotateAngle()/PI_SCALE - lambdaA,
      lambdaAN = this.lambdaAN/PI_SCALE,
      lambdaN = mod(lambdaA - lambdaAN,360),
      lambdaCA = lambdaMA,
      lambdaD = lambdaCA + lambdaAN,
      earthDelta = Math.asin((this.sphere[2].radius/this.sphere[3].radius) * Math.sin(lambdaMA)),
      i = this.ptolemySphere.getInclination()/PI_SCALE * Math.sin( lambdaD ),
      j = this.getDeviation()/PI_SCALE * Math.sin( lambdaD + Math.PI/2 ),
      k = this.getKM()/PI_SCALE * Math.sin( lambdaD );      
      

      // longitude      
      // base & deferent motion

      lambdaMA = mod(lambdaMA,Math.PI*2);
            
      var e = this.sphere[2].radius,
      R = this.sphere[3].radius,
      PI41 = Math.PI/2,
      PI43 = PI41*3,
      sin1c = Math.sin(lambdaMA),
      sin2c = Math.sin(2*lambdaMA),      
      cos1c = Math.cos(lambdaMA),
      cos2c = Math.cos(2*lambdaMA),      
      s = Math.sqrt((R*R)-(e*e*(sin1c+sin2c)*(sin1c+sin2c))) + e*(cos1c+cos2c),
      w1 = sin1c*e,
      w2 = sin1c*s,
      w3 = w1+w2;
      angle = Math.PI - Math.asin(w3/R);
     
      // TODO: very fragile fix
//*
      if( (lambdaMA + angle < Math.PI) || (lambdaMA + angle > 3*Math.PI) ) {
        angle = Math.asin(w3/R);
        var angle2 = Math.acos(w3/R);
        var angle3 = Math.acos(w2/s);
      } else {
        var angle2 = Math.asin(w3/R);
        var angle3 = Math.asin(w2/s);
      }
      angleDiff = angle2-angle3;
//*/        

      var trueAngle = lambdaMA + angle;      
      
      // long. correction
      this.sphere[2].anchor.rotation.y = -lambdaMA;
      this.sphere[3].anchor.rotation.y = trueAngle;
      this.equantPoint.position.z = this.sphere[3].equant*this.factor/2;

      // mean anomaly correction
      this.sphere[4].rotation.y = angleDiff - earthDelta;
      this.sphere[4].anchor.rotation.y += earthDelta;

      // latitude
      // inclination correction
      this.ptolemySphere.pivot.rotation.y = lambdaN;
      this.ptolemySphere.anchor.rotation.y -= lambdaN + 0.15/PI_SCALE;
      this.ptolemySphere.pivot.rotation.z =  i;
      this.sphere[4].rotation.z = k;
      this.sphere[4].ptolemy.rotation.x = -j;
      this.sphere[4].gfx.crank.rotation.z = lambdaD + Math.PI;       

    };
    
    
    this.updateSunDist = function() {
      var dist = (this.sphere[2].radius+this.sphere[3].radius+this.sphere[4].radius+this.sphere[3].equant)*this.factor;  
      this.realSunS[1].setScale(dist);
      this.realSunS[2].anchor.position.z = dist;
      this.sun.setDist(dist);
    };    
}

ModelPtolemyInferior.prototype = new ModelPtolemyBase;
ModelPtolemyInferior.prototype.constructor = ModelPtolemyInferior;
ModelPtolemyInferior.prototype.name = "ModelPtolemyInferior";
