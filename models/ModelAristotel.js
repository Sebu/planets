
/**
 * @constructor
 */
ModelAristotle = function(params) {
	BasePlanetModel.call(this);
    params.name = "ModelAristotle";
    params.spheres = 4;
    
    this.init(params);

    // add unwinding spheres
    var s4 = this.sphere[4] = new Spherical({ scale: 7.0, axisAngle: 0.0, speed: 0.0, color: colors["S3"]});
    var s5 = this.sphere[5] = new Spherical({ scale: 6.5, axisAngle: 0.0, speed: 0.0, color: colors["S2"]});
    var s6 = this.sphere[6] = new Spherical({ scale: 6.0, axisAngle: 0.0, speed: 0.0, color: colors["S1"]});
    var s7 = this.sphere[7] = new Spherical({ scale: 5.0, axisAngle: 0.0, speed: 0.0, color: colors["S0"]});
    
    this.updateList.push(s4);
    this.updateList.push(s5);    
    this.updateList.push(s6);    
    this.updateList.push(s7);  
        
    this.sphere[3].anchor.addNode(s4);
    this.sphere[4].anchor.addNode(s5);
    this.sphere[5].anchor.addNode(s6);
    this.sphere[6].anchor.addNode(s7);
    
//    this.sphere[5].anchor.addNode( this.stars2 = new Cloud({count:50}) );
    
    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
    }

    // ecliptic
    this.setAxisAngle1 = function(angle) {
      var angle1 = this.sphere[1].getAxisAngle();
      var angle7 = this.sphere[7].getAxisAngle();
      var diff = angle - angle1;
      this.sphere[1].setAxisAngle(angle1 + diff);
      this.sphere[7].setAxisAngle(angle7 - diff);
    }

    this.setAxisAngle2 = function(angle) {
      var angle2 = this.sphere[2].getAxisAngle();
      var angle6 = this.sphere[6].getAxisAngle();
      var diff = angle - angle2;
      this.sphere[2].setAxisAngle(angle2 + diff);
      this.sphere[6].setAxisAngle(angle6 - diff);

    }

    this.setAxisAngle3 = function(angle) {
      var angle3 = this.sphere[3].getAxisAngle();
      var angle5 = this.sphere[5].getAxisAngle();
      var diff = angle - angle3;
      this.sphere[3].setAxisAngle(angle3 + diff);
      this.sphere[4].setAxisAngle(0);
      this.sphere[5].setAxisAngle(angle5 - diff);
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

ModelAristotle.prototype = new BasePlanetModel;
ModelAristotle.prototype.constructor = ModelAristotle;

