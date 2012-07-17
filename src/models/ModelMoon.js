


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
    
    
ModelMoonBase.prototype.setPreset = function(node) {
        ModelBase.prototype.setPreset.call(this,node);
        this.setMetonYear(this.state.metonYear);
        this.setMetonSynodicMonths(this.state.metonSynodicMonths);
        this.setMetonDays(this.state.metonDays);
        this.setSarosDraconiticMonths(this.state.sarosDraconiticMonths);
        this.setSarosSynodicMonths(this.state.sarosSynodicMonths);
};

ModelMoonBase.prototype.getPreset = function() {
      var params = ModelBase.prototype.getPreset.call(this);
      params.params.metonYear = this.getMetonYear();
      params.params.metonSynodicMonths = this.getMetonSynodicMonths();
      params.params.metonDays = this.getMetonDays();
      params.params.sarosDraconiticMonths  = this.getSarosDraconiticMonths();
      params.params.sarosSynodicMonths = this.getSarosSynodicMonths();
      return params;
};

ModelMoonBase.prototype.create = function() {
  	ModelBase.prototype.create.call(this);
    this.genSpheres( { spheres : 3 } );

    this.setShowHippo = null;
    this.setShowPath = null;
    
    BaseMixin.call(this);
//    MoonMixin.call(this);
    
    var metonYear = 0,
    metonSynodicMonths = 0,
    metonDays = 0, // days per cycle
    sarosDraconiticMonths = 0,
    sarosSynodicMonths = 0;
        
    this.setMetonYear = function(val) {
        metonYear = Number(val);
        this.updateMoon();
    }
    this.getMetonYear = function() {
        return metonYear;
    }

    this.setMetonSynodicMonths = function(val) {
        metonSynodicMonths = Number(val);
        this.updateMoon();
    }
    this.getMetonSynodicMonths = function() {
        return metonSynodicMonths;
    }


    this.setMetonDays = function(val) {
        metonDays = Number(val);
        this.updateMoon();
    }
    this.getMetonDays = function() {
        return metonDays;
    }


    this.setSarosDraconiticMonths = function(val) {
        sarosDraconiticMonths = Number(val);
        this.updateMoon();
    }
    this.getSarosDraconiticMonths = function() {
        return sarosDraconiticMonths;
    }


    this.setSarosSynodicMonths = function(val) {
        sarosSynodicMonths = Number(val);
        this.updateMoon();
    }
    this.getSarosSynodicMonths = function() {
        return sarosSynodicMonths;
    }

    this.getMetonZodicalMonths = function() {
        return this.getMetonYear() + this.getMetonSynodicMonths();
    }
    this.getMetonDaysPerYear = function() {
        return this.getMetonDays() / this.getMetonYear();
    }
    this.getSynodicDaysPerMonth = function() {
        return this.getMetonDays() / this.getMetonSynodicMonths();
    }
    this.getZodicalDaysPerMonth = function() {
        return this.getMetonDays() / this.getMetonZodicalMonths();
    }

    this.getDraconiticDaysPerMonth = function() {
        return this.getSynodicDaysPerMonth()*(this.getSarosSynodicMonths() / this.getSarosDraconiticMonths());
    }
};

/**
 * @constructor
 * @extends ModelMoonBase
 */
ModelMoon = function() {
    this.create();
    this.setCurrentMoonModel("Mendell");   
};

ModelMoon.prototype = new ModelMoonBase;
ModelMoon.prototype.constructor = ModelMoon;
ModelMoon.prototype.name =  "ModelMoon";


