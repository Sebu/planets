
/**
 * @constructor
 */
ModelAristotel = function(params) {
	BasePlanetModel.call(this);
    params.name = "Model4";
    params.spheres = 7;
    
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    this.setAxisAngle1 = function(angle) {
      this.sphere[1].setAxisAngle(angle);
      this.sphere[6].setAxisAngle(angle);
    }

    this.setAxisAngle2 = function(angle) {
      this.sphere[2].setAxisAngle(angle);
      this.sphere[5].setAxisAngle(angle);
    }

    this.setAxisAngle3 = function(angle) {
      this.sphere[4].setAxisAngle(angle);
      this.sphere[5].setAxisAngle(0);
    }


    this.setSpeed1 = function(speed) {
      this.sphere[1].setSpeed(speed);
      this.sphere[6].setSpeed(-speed);
    }

    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
        this.sphere[4].setSpeed(speed);
        this.sphere[5].setSpeed(-speed);
    }


    this.update = function(time) {
//        this.addCurve({index: 0, anchor: this.sphere[0].anchor, start: 0, node: this.planet.mesh, color: colors["Path"]});
//        this.addCurve({index: 1, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Hippo"]});
        BasePlanetModel.prototype.update.call(this, time);
        
    }
};

ModelAristotel.prototype = new BasePlanetModel;
ModelAristotel.prototype.constructor = ModelAristotel;

