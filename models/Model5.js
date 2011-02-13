/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 13.02.2011
 * Time: 02:10:46
 * To change this template use File | Settings | File Templates.
 */



Model5 = function(params) {
    params.name = "Model5";
    params.spheres = 5;
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.updateHippo = function(step) {
        this.removeCurve(1);
        this.addCurve(1, this.sphere[1].curve, this.calcCurve(1, "Planet"), colors["Hippo"]);
    }


};

Model5.prototype = new BasePlanetModel;
Model5.prototype.constructor = Model5;
