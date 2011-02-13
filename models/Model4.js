/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 13:17:19
 * To change this template use File | Settings | File Templates.
 */



Model4 = function(params) {
    params.name = "Model4";
    params.spheres = 4;
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
        //Spherical.prototype.setAxisAngle.call(this, 90 - angle);
    }

    this.updateHippo = function(step) {
        this.removeCurve(1);
        this.addCurve(1, this.sphere[1].curve, this.calcCurve(1, "Planet"), colors["Hippo"]);
    }


    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
    }
};

Model4.prototype = new BasePlanetModel;
Model4.prototype.constructor = Model4;

