

/**
 * @constructor
 */
ModelSimple = function(params) {
	BasePlanetModel.call(this);	
    params.name = "ModelSimple";
    params.spheres = 2;
    this.genSpheres(params);


       
    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.root, start: 0, node: this.planet.mesh, color: colors["Path"]});
        BasePlanetModel.prototype.update.call(this, time);
    }

};

ModelSimple.prototype = new BasePlanetModel;
ModelSimple.prototype.constructor = ModelSimple;
