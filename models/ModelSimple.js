

/**
 * @constructor
 */
ModelSimple = function(params) {
    params.name = "ModelSimple";
    params.spheres = 2;
  	Model4.call(this, params);	

    this.setShowHippo = null;



    this.updateMetadata = function() {
       this.updatePlanetMetadata(this.planet,this.sphere[1],this.ecliptic, this.sphere[2]);
    }


    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.root, start: 0, node: this.planet.mesh, color: colors["Path"]});
        ModelBase.prototype.update.call(this, time);
    }

};

ModelSimple.prototype = new ModelBase;
ModelSimple.prototype.constructor = ModelSimple;
