/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 20:10:55
 * To change this template use File | Settings | File Templates.
 */


ModelMoon = function(params) {
    params.name = "ModelMoon";
    params.spheres = 3;
    this.init(params);


    
//    this.sun.setEnabled(false);
    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(-speed);
    }

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

    this.metonDraconiticMonths = 0;
    this.setMetonDraconiticMonths = function(val) {
        this.metonDraconiticMonths = Number(val);
    }
    this.getMetonDraconiticMonths = function() {
        return this.metonDraconiticMonths;
    }

    this.getMetonZodicalMonths = function() {
        return this.metonYear + this.metonSynodicMonths;
    }
    this.getMetonDaysPerYear = function() {
        return this.metonDays / this.metonYear;
    }
    this.getSynodicDaysPerMonth = function() {
        return this.metonDays / this.metonSynodicMonths;
    }
    this.getZodicalDaysPerMonth = function() {
        return this.metonDays / this.getMetonZodicalMonths();
    }
    this.getDraconiticDaysPerMonth = function() {
        return this.metonDays / this.metonDraconiticMonths;
    }

    this.setCurrentMoonModel = function(node) {
        var currentModel = moonModels[node];
        this.moonSpeed1 = currentModel.speed1;
        this.moonSpeed2 = currentModel.speed2;
    }
    this.setCurrentPlanet = function(node) {
        ModelMoon.prototype.setCurrentPlanet.call(this,node);
        this.setMetonYear(this.currentPlanet.metonYear);
        this.setMetonSynodicMonths(this.currentPlanet.metonSynodicMonths);
        this.setMetonDays(this.currentPlanet.metonDays);
        this.setMetonDraconiticMonths(this.currentPlanet.metonDraconiticMonths);
    }

    this.setCurrentMoonModel("Mendell");


    this.updateMoon = function() {
        this.draco = this.getDraconiticDaysPerMonth();
        this.zodic = this.getZodicalDaysPerMonth();
        this.sphere[1].setSpeed(this.moonSpeed1(this.draco, this.zodic));
        this.sphere[2].setSpeed(this.moonSpeed2(this.draco, this.zodic));
    }

};

ModelMoon.prototype = new BasePlanetModel;
ModelMoon.prototype.constructor = ModelMoon;
