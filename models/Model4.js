
/**
 * @constructor
 */
Model4 = function(params) {
	BasePlanetModel.call(this);
    params.name = "Model4";
    params.spheres = 4;
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
        //Spherical.prototype.setAxisAngle.call(this, 90 - angle);
    }

    this.setSpeed0 = function(speed) {
        if (this.sphere[0].getSpeed()==0 && speed == 1) {
          this.setSpeed(this.getSpeed()*10);

        } else if(this.sphere[0].getSpeed()!=0 && speed == 0) {
          this.setSpeed(this.getSpeed()/10);
        }
        this.sphere[0].setSpeed(-speed);

    }

    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
    }


    this.update = function(time) {
        this.addCurve({index: 0, anchor: this.sphere[0].anchor, start: 0, node: this.planet.mesh, color: colors["Path"]});
        this.addCurve({index: 1, anchor: this.sphere[1].anchor, start: 1, node: this.planet.mesh, color: colors["Hippo"]});
        BasePlanetModel.prototype.update.call(this, time);
        
    }
};

Model4.prototype = new BasePlanetModel;
Model4.prototype.constructor = Model4;

