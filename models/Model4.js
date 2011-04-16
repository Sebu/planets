/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 13:17:19
 * To change this template use File | Settings | File Templates.
 */


Model4 = function(params) {
    params.name = "Model4";
    params.spheres = 4;
    this.init(params);

    this.setAxisAngle0 = function(angle) {
        this.sphere[0].setAxisAngle(90 - angle);
        //Spherical.prototype.setAxisAngle.call(this, 90 - angle);
    }

    this.setSpeed0 = function(speed) {
        this.sphere[0].setSpeed(-speed);
    }

    this.setAxisAngle2 = function(angle) {
    		this.sphere[2].setAxisAngle(angle);
//            		this.updateHippo();
    }
    
    this.setAxisAngle3 = function(angle) {
    		this.sphere[3].setAxisAngle(angle);    
//            		this.updateHippo();
    }
    
    this.setSpeed2 = function(speed) {
        this.sphere[2].setSpeed(speed);
        this.sphere[3].setSpeed(-speed);
    }

		this.updateHippo = function() {
//        this.removeCurve(1);
        if(this.showCurve1) this.addCurve(1, this.sphere[1].curve, this.calcCurve(1, this.name + "Planet"), colors["Hippo"]);
		}
		
    this.update = function() {
//        this.removeCurve(0);
        if(this.showCurve0) this.addCurve(0, this.sphere[0].curve, this.calcCurve(0, this.name + "Planet"), colors["Path"]);
        this.updateHippo();
        Model4.prototype.update.call(this);
        
    }
};

Model4.prototype = new BasePlanetModel;
Model4.prototype.constructor = Model4;

