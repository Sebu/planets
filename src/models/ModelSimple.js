
/**
 * @constructor
 * @extends ModelBase
 */
ModelSimple = function() {
    ModelBase.prototype.create.call(this);
    this.genSpheres({spheres : 2});

    /** @lends BaseMixin */
    BaseMixin.call(this);
    
    this.setShowHippo = null;


  /**
   * s4 moves opposite to s3
   * @override 
   * @function
   * @param speed the speed to set for S3 and -S4
   */
  this.setSpeed3 = function(speed) {
        this.sphere[3].setSpeed( speed);
        this.sphere[4].setSpeed(-speed);
  }


    this.updateMetadata = function() {
       this.updatePlanetMetadata(this.planet,this.sphere[1],this.ecliptic, this.sphere[2]);
    }


  /** 
   * @override 
   * @function 
   * @param time millisecons passed since last call
   */
    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.root, start: 1, node: this.planet.mesh, color: config.colors["Path"]});
        ModelBase.prototype.update.call(this, time);
    }

};

ModelSimple.prototype = new ModelBase;
ModelSimple.prototype.constructor = ModelSimple;
ModelSimple.prototype.name = "ModelSimple";
