

/**
 * @constructor
 */
ModelPtolemySun = function(params) {
    params.name = "ModelPtolemySun";
    params.spheres = 3;
	  ModelPtolemyBase.call(this, params);	
};

ModelPtolemySun.prototype = new BasePlanetModel;
ModelPtolemySun.prototype.constructor = ModelPtolemySun;
