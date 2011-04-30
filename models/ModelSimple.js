/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 13.02.2011
 * Time: 02:10:06
 * To change this template use File | Settings | File Templates.
 */


ModelSimple = function(params) {
    params.name = "ModelSimple";
    params.spheres = 2;
    this.init(params);

    this.sun.setEnabled(false);
    
    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(-speed);
    }
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.update = function() {
        this.addCurve(0, this.root, this.calcCurve({depth: -1, node: this.planet.mesh}), colors["Path"]);
        BasePlanetModel.prototype.update.call(this);
    }

};

ModelSimple.prototype = new BasePlanetModel;
ModelSimple.prototype.constructor = ModelSimple;
