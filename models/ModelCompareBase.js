/**

 * @constructor
 */
ModelCompareBase = function(params) {

  this.app = params.renderer;
  
  this.models = [ this.app.getModel("Model4"), this.app.getModel("ModelMoon")];
  this.ui = "Model4";
  this.models[0].loadPreset(planetPresets["Eudoxus"]["Mercury"][1]);  
  this.models[1].loadPreset(planetPresets["Eudoxus"]["Moon"]);
  
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
  this.sphere[1] = this.models[0].sphere[1];
    
  this.mergeSetFunctions({ setSpeed1 : "value", setSpeed2 : "value", setSpeed3 : "value", setSunSpeed : "value", update: "time", reset: "", setAxisAngle1 : "value",  setAxisAngle2 : "value", setAxisAngle3 : "value", setAxisAngle4 : "value",  getShowHippo : "",  setAnimSpeed : "value", togglePause : "state" });
  this.mergeGetFunctions({ getSpeed1: "", getSpeed2: "", getSpeed3: "", getSunSpeed: "", getRotateStart1: "", getRotateStart2: "", getRotateStart3: "", getRotateStart4: "", getAxisAngle1 : "",  getAxisAngle2 : "", getAxisAngle3 : "", getAxisAngle4 : "", getRunning: "", getAnimSpeed: "", getDays:"", getAxisAngle1 : "", getShowPath : "", getShowStars : "" });
  
  this.setAnimSpeed(60);

  this.root = this.app.newScene();    
  this.root.addNode(this.models[0].root);
  this.root.addNode(this.models[1].root);  
};

ModelCompareBase.prototype.constructor = ModelCompareBase;

    
ModelCompareBase.prototype.loadPreset = function(preset) {
  this.models[0].earth.setEnabled(true);
  this.models[1].earth.setEnabled(false);
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
