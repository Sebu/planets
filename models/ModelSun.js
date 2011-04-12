/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 20:12:56
 * To change this template use File | Settings | File Templates.
 */


ModelSun = function(params) {
    params.name = "ModelSun";
    params.spheres = 4;
    this.init(params);

    this.sun.setEnabled(false);

    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(-speed);
    }

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }
    this.setSpeed2 = function(speed) {
        this.sunSpeed = (360.0 * this.sphere[1].getSpeed()) / (365.25 - this.sphere[1].getSpeed());
        model.sphere[2].setSpeed(this.sunSpeed);
        model.sphere[3].setSpeed(0);
    }

};

ModelSun.prototype = new BasePlanetModel;
ModelSun.prototype.constructor = ModelSun;
