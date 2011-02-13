/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 13.02.2011
 * Time: 02:10:16
 * To change this template use File | Settings | File Templates.
 */


ModelYavetz = function(params) {
    params.name = "ModelYavetz";
    params.spheres = 4;
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.updateHippo = function(step) {
        this.removeCurve(1);
        this.addCurve(1, this.sphere[1].curve, this.calcCurve(1, "Planet"), colors["Hippo"]);
    }


    this.beta=0;
    this.getBeta = function() {return this.beta;}
    this.setBeta = function(val) {
        this.beta=val;
        this.planet.setBeta(this.beta);
        this.sphere[3].setArcBeta(180-this.beta);
    }

    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed/2);
    }
};

ModelYavetz.prototype = new BasePlanetModel;
ModelYavetz.prototype.constructor = ModelYavetz;
