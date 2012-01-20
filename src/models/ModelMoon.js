

/**
 * @constructor
 * @extends ModelBase
 */
ModelMoon = function(params) {
    params.name =  params.name || "ModelMoon";
  	ModelBase.call(this, params);
    params.spheres = 3;
    this.genSpheres(params);

    this.setShowHippo = null;
    this.setShowPath = null;
    
    MoonMixin.call(this);
    BaseMixin.call(this);    

    this.updateMoon = function() {
        var draco = 360.0/this.getDraconiticDaysPerMonth(),
        zodic = 360.0/this.getZodicalDaysPerMonth();

        this.sphere[2].setStep(this.moonSpeed1(draco, zodic));
        this.sphere[3].setStep(this.moonSpeed2(draco, zodic));        
    }
    
    this.setCurrentMoonModel = function(name) {
        var currentModel = moonModels[name];
        this.moonSpeed1 = currentModel.Speed1;
        this.moonSpeed2 = currentModel.Speed2;
        console.log(this);        
        this.updateMoon();
    }
    this.loadPreset = function(node) {
        ModelBase.prototype.loadPreset.call(this,node);
        this.setMetonYear(this.currentPlanet.metonYear);
        this.setMetonSynodicMonths(this.currentPlanet.metonSynodicMonths);
        this.setMetonDays(this.currentPlanet.metonDays);
        this.setSarosDraconiticMonths(this.currentPlanet.sarosDraconiticMonths);
        this.setSarosSynodicMonths(this.currentPlanet.sarosSynodicMonths);
    }

    this.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.metonYear = this.getMetonYear();
      params.metonSynodicMonths = this.getMetonSynodicMonths();
      params.metonDays = this.getMetonDays();
      params.sarosDraconiticMonths  = this.getSarosDraconiticMonths();
      params.sarosSynodicMonths = this.getSarosSynodicMonths();
      return params;
    }


    this.setCurrentMoonModel("Mendell");
    
    



};

ModelMoon.prototype = new ModelBase;
ModelMoon.prototype.constructor = ModelMoon;
