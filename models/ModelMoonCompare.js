/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 20:10:55
 * To change this template use File | Settings | File Templates.
 */


ModelMoonCompare = function(params) {
    params.name = "ModelMoonCompare";
    params.spheres = 3;
    this.init(params);


    this.sphere2 = new Array(2);
    s20 = this.sphere2[0] = new Spherical({inner_id: "S20", scale: 9, axisAngle: 0.0, speed: 0.0, color: colors["S1"]});
    s21 = this.sphere2[1] = new Spherical({inner_id: "S21", scale: 9, axisAngle: 0.0, speed: 0.0, color: colors["S3"]});
    this.updateList.push(s20);    
    this.updateList.push(s21);    
    this.sphere[0].anchor.addNode(s20);
    this.sphere2[0].anchor.addNode(s21);


    
    this.sun.setEnabled(false);

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

    this.setCurrentMoonModel2 = function(node) {
        var currentModel2 = moonModels[node];
        this.moonSpeed21 = currentModel2.speed1;
        this.moonSpeed22 = currentModel2.speed2;
    }


    this.setCurrentPlanet = function(node) {
        ModelMoonCompare.prototype.setCurrentPlanet.call(this,node);
        this.setMetonYear(this.currentPlanet.metonYear);
        this.setMetonSynodicMonths(this.currentPlanet.metonSynodicMonths);
        this.setMetonDays(this.currentPlanet.metonDays);
        this.setMetonDraconiticMonths(this.currentPlanet.metonDraconiticMonths);
    }

    this.setCurrentMoonModel("Mendell");
    this.setCurrentMoonModel2("Mendell");

    this.updateMoon = function() {
        this.draco = this.getDraconiticDaysPerMonth();
        this.zodic = this.getZodicalDaysPerMonth();
        this.sphere[1].setSpeed(this.moonSpeed1(this.draco, this.zodic));
        this.sphere[2].setSpeed(this.moonSpeed2(this.draco, this.zodic));
        this.sphere2[0].setSpeed(this.moonSpeed21(this.draco, this.zodic));
        this.sphere2[1].setSpeed(this.moonSpeed22(this.draco, this.zodic));

    }

    this.reset = function () {
        ModelMoonCompare.prototype.reset.call(this);
        this.sphere2[0].setRotateAngle(this.sphere[1].rotateStart);
        this.sphere2[1].setRotateAngle(this.sphere[2].rotateStart);
    }

    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(angle); 
        this.sphere2[0].setAxisAngle(angle);
    }

    this.setAxisAngle2 = function(angle) {
        this.sphere[2].setAxisAngle(angle); 
        this.sphere2[1].setAxisAngle(angle);
    }

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }
};

ModelMoonCompare.prototype = new BasePlanetModel;
ModelMoonCompare.prototype.constructor = ModelMoonCompare;
