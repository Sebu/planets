/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 13.02.2011
 * Time: 02:10:06
 * To change this template use File | Settings | File Templates.
 */


ModelHippo = function(params) {
    params.name = "ModelHippo";
    params.spheres = 2;
    this.init(params);

    this.sun.setEnabled(false);
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }



    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(speed);
        this.sphere[1].setSpeed(-speed);
    }

    this.update = function() {
        this.removeCurve(0);
        if(this.showCurve0) this.addCurve(0, this.curve, this.calcCurve(-1, this.name + "Planet"), colors["Path"]);
        ModelSimple.prototype.update.call(this);
    }

};

ModelHippo.prototype = new BasePlanetModel;
ModelHippo.prototype.constructor = ModelHippo;
