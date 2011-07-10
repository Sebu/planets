

/**
 * @constructor
 */
ModelMoonCompare = function(params) {
	  ModelMoon.call(this,params);	

    this.showPhase = false;


    var s20 = this.sphere[4] = new Spherical({inner_id: "S20", scale: 9, axisAngle: 0.0, speed: 0.0, color: colors["S2"]});
    var s21 = this.sphere[5] = new Spherical({inner_id: "S21", scale: 9, axisAngle: 0.0, speed: 0.0, color: colors["S4"]});
    this.planet2 = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: params.name+"Planet2",  color:colors["Planet"]});
    this.planet2.setBeta(90.0);
    
    this.updateList.push(s20);    
    this.updateList.push(s21);    
    this.sphere[1].anchor.addNode(s20);
    this.sphere[4].anchor.addNode(s21);
    this.sphere[5].anchor.addNode(this.planet2);


   this.setShowSphere4 = function(state) {
      this.sphere[4].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], state);
    }
   this.getShowSphere4 = function() { return true; };
       
   this.setShowSphere5 = function(state) {
      this.sphere[5].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], state);
    }
   this.getShowSphere5 = function() { return true; };


    
    this.updateMoon = function() {
        var draco = 360.0/this.getDraconiticDaysPerMonth();
        var zodic = 360.0/this.getZodicalDaysPerMonth();
                 
        this.sphere[2].setStep(this.moonSpeed1(draco, zodic));
        this.sphere[3].setStep(this.moonSpeed2(draco, zodic));
        
        this.sphere[4].setStep(this.moonSpeed3(draco, zodic));
        this.sphere[5].setStep(this.moonSpeed4(draco, zodic));

    }

    this.setCurrentMoonModels = function(node1, node2) {
        var currentModel1 = moonModels[node1];
        
        this.moonSpeed1 = currentModel1.speed1;
        this.moonSpeed2 = currentModel1.speed2;
        
        var currentModel2 = moonModels[node2];
        this.moonSpeed3 = currentModel2.speed1;
        this.moonSpeed4 = currentModel2.speed2;
        this.updateMoon();
    }



    this.reset = function () {
        BasePlanetModel.prototype.reset.call(this);
        this.sphere[2].setRotateAngle(this.sphere[2].rotateStart);
        this.sphere[3].setRotateAngle(this.sphere[3].rotateStart);
        
        this.sphere[4].setRotateAngle(this.sphere[2].rotateStart);
        this.sphere[5].setRotateAngle(this.sphere[3].rotateStart);
    }

    this.setShowPhase = function(state) {  
      this.showPhase = state;
      this.setAxisAngle3(5);
    }

    this.getShowPhase = function() {
      return this.showPhase;
    } 

    this.setAxisAngle2 = function(angle) {
        this.sphere[2].setAxisAngle(angle); 
        this.sphere[4].setAxisAngle(angle);
    }

    this.setAxisAngle3 = function(angle) {
        if(this.showPhase) this.sphere[3].setAxisAngle(angle); 
        else this.sphere[3].setAxisAngle(-angle);
        this.sphere[5].setAxisAngle(angle);
    }



    this.update = function(time) {
        BasePlanetModel.prototype.update.call(this, time);
//        if(this.running) {
            this.updatePlanetMetadata(this.planet2,  this.sphere[1],this.sphere[4], time);
//        }
    };    

    this.setCurrentMoonModels("Mendell", "SchFixed");
};

ModelMoonCompare.prototype = new BasePlanetModel;
ModelMoonCompare.prototype.constructor = ModelMoonCompare;
