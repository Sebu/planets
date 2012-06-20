/**

 * @constructor
 */
ModelCompareBase = function(params) {

  this.app = params.renderer;
  
  this.models = [ this.app.getModel("ModelPtolemyMoon1a"), this.app.getModel("ModelPtolemyMoon1b")];
  this.ui = "PtolemyView";
  this.models[0].loadPreset(planetPresets["Ptolemy"]["Moon"]["1a"]);  
  this.models[1].loadPreset(planetPresets["Ptolemy"]["Moon"]["1b"]);
  
  // TODO: extract into function
  this.currentPlanet = this.models[0].currentPlanet;
  this.earth = this.models[0].earth;
  this.planet = this.models[0].planet;
  this.earthPlane = this.models[0].earthPlane;  
  this.sun = this.models[0].sun; 
  this.sphere = [];
  this.north = this.models[0].north; 
  this.south = this.models[0].south;   
  this.east = this.models[0].east;   
  this.west = this.models[0].west; 
  

    
  this.viewPresets = {"World": {from: "Free",at:"Earth"}, "Earth": {from: "Earth",at:"Free"}};
  this.realSun = this.models[0].realSun;
  this.sphere[1] = this.models[0].sphere[1];
  this.sphere[4] = this.models[0].sphere[4];
  this.ptolemySphere = this.models[0].ptolemySphere;
    
  this.mergeSetFunctions({ 
        setSpeed1 : "value",
        setSpeed2 : "value",
        setSpeed3 : "value",
        setSunSpeed : "value",
        update: "time",
        updateMovement: "time",
        setAxisAngle1 : "value",
        setAxisAngle2 : "value",
        setAxisAngle3 : "value",
        setAxisAngle4 : "value",
        getShowHippo : "",
        setAnimSpeed : "value",
        togglePause : "state",
        setApsidalAngle : "value",
//        setRadiusEpicycle: "value",
//        setBaseRadius: "value",
        setEquant: "value",
        setRadiusDeferent: "value",
        setDeviation : "value",
        setKM : "value",
        setLambdaAN : "value",
        toggleRunning:"",
        reset: "",
        adjustAnomaly: "",
        adjustCrank : ""        
  });
  this.mergeGetFunctions({ 
        getSpeed1: "",
        getSpeed2: "",
        getSpeed3: "",
        getSunSpeed: "",
        getRotateStart1: "",
        getRotateStart2: "",
        getRotateStart3: "",
        getRotateStart4: "",
        getAxisAngle1 : "",
        getAxisAngle2 : "",
        getAxisAngle3 : "",
        getAxisAngle4 : "",
        getRunning: "",
        getAnimSpeed: "",
        getDays:"",
        getAxisAngle1 : "",
        getShowPath : "",
        getShowStars : "",
        getApsidalAngle : "",
//        getRadiusEpicycle: "",        
//        getBaseRadius: "",
        getEquant: "",
        getRadiusDeferent: "",
        getDeviation : "",
        getKM : "",
        getLambdaAN : "",
        getPreset : ""

  });
  
  this.setAnimSpeed(60);

  this.root = new THREE.Scene();   
  this.root.addNode(this.models[0].root);
  this.root.addNode(this.models[1].root);  
};

ModelCompareBase.prototype.constructor = ModelCompareBase;

    
ModelCompareBase.prototype.loadPreset = function(preset) {
  this.models[0].earth.setEnabled(true);
  this.models[1].earth.setEnabled(false);
}


ModelCompareBase.prototype.setBaseRadius = function(value) {
  return this.models[0].setBaseRadius(value);
}

ModelCompareBase.prototype.getBaseRadius = function() {
  return this.models[0].getBaseRadius();
}

ModelCompareBase.prototype.setRadiusEpicycle = function(value) {
  return this.models[1].setRadiusEpicycle(value);
}

ModelCompareBase.prototype.getRadiusEpicycle = function() {
  return this.models[1].getRadiusEpicycle();
}

// for some convenience :)
ModelCompareBase.prototype.mergeGetFunctions = function(list) {
  for(var f in list) {
      this[f] = new Function("return this.models[0]." + f + "();");
  }
}

ModelCompareBase.prototype.mergeSetFunctions = function(list) {
  for(var f in list) {
      this[f] = new Function(list[f].params, 
        "for(var i in this.models) {" +
        "if(this.models[i]." + f + ") this.models[i]." + f + "(" + list[f].params + ");" +
        "};");
  }
}
