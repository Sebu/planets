

/**
 * @constructor
 */
ModelSimple = function(params) {
    params.name = "ModelSimple";
    params.spheres = 2;
  	Model4.call(this, params);	

    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.root, start: 0, node: this.planet.mesh, color: colors["Path"]});
        BasePlanetModel.prototype.update.call(this, time);
    }

};

ModelSimple.prototype = new BasePlanetModel;
ModelSimple.prototype.constructor = ModelSimple;
