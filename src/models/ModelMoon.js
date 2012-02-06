


/**
 * @constructor
 * @extends ModelBase
 */
ModelMoonBase = function() {
};

ModelMoonBase.prototype = new ModelBase;
ModelMoonBase.prototype.constructor = ModelMoonBase;

ModelMoonBase.prototype.updateMoon = function() {
        var draco = 360.0/this.getDraconiticDaysPerMonth(),
        zodic = 360.0/this.getZodicalDaysPerMonth();

        this.sphere[2].setStep(this.moonSpeed1(draco, zodic));
        this.sphere[3].setStep(this.moonSpeed2(draco, zodic));        
};
    
ModelMoonBase.prototype.setCurrentMoonModel = function(name) {
        var currentModel = moonModels[name];
        this.moonSpeed1 = currentModel.Speed1;
        this.moonSpeed2 = currentModel.Speed2;
        this.updateMoon();
};
    
    
ModelMoonBase.prototype.loadPreset = function(node) {
        ModelBase.prototype.loadPreset.call(this,node);
        this.setMetonYear(this.currentPlanet.metonYear);
        this.setMetonSynodicMonths(this.currentPlanet.metonSynodicMonths);
        this.setMetonDays(this.currentPlanet.metonDays);
        this.setSarosDraconiticMonths(this.currentPlanet.sarosDraconiticMonths);
        this.setSarosSynodicMonths(this.currentPlanet.sarosSynodicMonths);
};

ModelMoonBase.prototype.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.metonYear = this.getMetonYear();
      params.metonSynodicMonths = this.getMetonSynodicMonths();
      params.metonDays = this.getMetonDays();
      params.sarosDraconiticMonths  = this.getSarosDraconiticMonths();
      params.sarosSynodicMonths = this.getSarosSynodicMonths();
      return params;
};

ModelMoonBase.prototype.create = function() {
  	ModelBase.prototype.create.call(this);
    this.genSpheres( { spheres : 3 } );

    this.setShowHippo = null;
    this.setShowPath = null;
    
    MoonMixin.call(this);
    BaseMixin.call(this);
    this.setCurrentMoonModel("Mendell");   
};

/**
 * @constructor
 * @extends ModelMoonBase
 */
ModelMoon = function() {
    this.create();
};

ModelMoon.prototype = new ModelMoonBase;
ModelMoon.prototype.constructor = ModelMoon;
ModelMoon.prototype.name =  "ModelMoon";


