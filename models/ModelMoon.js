
/**
 * @constructor
 */
ModelMoon = function(params) {
	BasePlanetModel.call(this);	
    params.name = "ModelMoon";
    params.spheres = 3;
    this.init(params);


    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
        //Spherical.prototype.setAxisAngle.call(this, 90 - angle);
    }

    this.metonYear = 0;
    this.setMetonYear = function(val) {
        this.metonYear = Number(val);
        this.updateMoon();
    }
    this.getMetonYear = function() {
        return this.metonYear;
    }

    this.metonSynodicMonths = 0;
    this.setMetonSynodicMonths = function(val) {
        this.metonSynodicMonths = Number(val);
        this.updateMoon();
    }
    this.getMetonSynodicMonths = function() {
        return this.metonSynodicMonths;
        this.updateMoon();
    }

    this.metonDays = 0; // days per cycle
    this.setMetonDays = function(val) {
        this.metonDays = Number(val);
        this.updateMoon();
    }
    this.getMetonDays = function() {
        return this.metonDays;
    }

    this.sarosDraconiticMonths = 0;
    this.setSarosDraconiticMonths = function(val) {
        this.sarosDraconiticMonths = Number(val);
        this.updateMoon();
    }
    this.getSarosDraconiticMonths = function() {
        return this.sarosDraconiticMonths;
    }

    this.sarosSynodicMonths = 0;
    this.setSarosSynodicMonths = function(val) {
        this.sarosSynodicMonths = Number(val);
        this.updateMoon();
    }
    this.getSarosSynodicMonths = function() {
        return this.sarosSynodicMonths;
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
//        return this.getMetonDays() / this.getSarosDraconiticMonths();
    }

    this.updateMoon = function() {
        var draco = 360.0/this.getDraconiticDaysPerMonth();
        var zodic = 360.0/this.getZodicalDaysPerMonth();
        this.sphere[1].setStep(this.moonSpeed1(draco, zodic));
        this.sphere[2].setStep(this.moonSpeed2(draco, zodic));        
    }
    
    this.setCurrentMoonModel = function(name) {
        var currentModel = moonModels[name];
        this.moonSpeed1 = currentModel.speed1;
        this.moonSpeed2 = currentModel.speed2;
        this.updateMoon();
    }
    this.setCurrentPlanet = function(node) {
        BasePlanetModel.prototype.setCurrentPlanet.call(this,node);
        this.setMetonYear(this.currentPlanet.metonYear);
        this.setMetonSynodicMonths(this.currentPlanet.metonSynodicMonths);
        this.setMetonDays(this.currentPlanet.metonDays);
        this.setSarosDraconiticMonths(this.currentPlanet.sarosDraconiticMonths);
        this.setSarosSynodicMonths(this.currentPlanet.sarosSynodicMonths);
    }


    
    this.setCurrentMoonModel("Mendell");



};

ModelMoon.prototype = new BasePlanetModel;
ModelMoon.prototype.constructor = ModelMoon;
