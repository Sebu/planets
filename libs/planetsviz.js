

Planet.prototype._init = function(params) {
  var emit = params.emit || 0.0;
  this._dist = params.dist || 0.0;
  this._beta = params.beta || 0.0;
  this._scale = params.scale;
  this._color = params.color || { r: 2.2, g: 2.2, b: 2.9 };
  this.addNode(
    this._betaRotate = SceneJS.rotate({angle: this._beta, x: 1.0},
  	this._distNode = SceneJS.translate({x: 0.0, y: this._dist, z: 0.0},
 			SceneJS.scale( { id: params.inner_id, x:this._scale, y: this._scale, z: this._scale },
      	this._material = SceneJS.material({              
					baseColor:  this._color,
					specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    			emit: emit, specular: 0.0, shine: 3.0},

//    			new SceneJS.Texture({ layers: [ {  uri:"textures/earthmap1k.jpg" }] },
					SceneJS.sphere()
					//)
					
				)
			)
			)
		)
  ); 
						
};

Planet.prototype.setBeta = function(angle) {
		this._beta = angle;
		this._betaRotate.setAngle(this._beta);
};

Planet.prototype.setShade = function(color) {
	this._material.setBaseColor(color);
//  state ? this._material.setBaseColor({r: 1.0, g: 1.0, b:1.0}) : this._material.setBaseColor({r: 0.0, g: 0.0, b:0.0});
}

Planet.prototype.setDist = function(dist) {
	this._dist = dist;
	this._distNode.setY(dist);
}





Curve.prototype._init = function(params) {
    var curvePos = params.pos;

    this._destroy = function() {
      SceneJS._geometryModule.extDestroyGeometry(this._handle);
    }
    
    this._create = function() {
      var positions = [];
      var colors = [];
      for (var i=0; i<curvePos.length; i++) {
        positions.push(curvePos[i].x);
        positions.push(curvePos[i].y);
        positions.push(curvePos[i].z);
        colors.push(1.0);
        colors.push(0.4);
        colors.push(1.0);
     }
     var indices = [];
     for (var i = 0; i <curvePos.length; i++) {
       indices.push(i);
     }
     return {
       primitive : "line-strip",
       positions : positions,

       indices : indices
     };		     
	 };
	   
};



Circle.prototype.setAngle = function(angle) {
	 this.angle = angle%360;
}

Cloud.prototype._init = function(params) {
     this._count = params.count; 
      

     this._create = function() {
        var positions = [];
        var indices = [];

        var x=0,y=0,z=0;
        for (var sliceNum = 0; sliceNum < params.count; sliceNum++) {

                x = (Math.random()-0.5); //*params.scale;
                y = (Math.random()-0.5); //*params.scale;
                z = (Math.random()-0.5); //*params.scale;

                norm = Math.sqrt(x*x+y*y+z*z)/10.0;
                positions.push(x/norm);
                positions.push(y/norm);
                positions.push(z/norm);

               indices.push(sliceNum);

        }        

        return {
            primitive : "points",
            positions : positions,
            indices : indices
        };		     
	   };
	   
};

Curve.prototype._init = function(params) {
    var curvePos = params.pos;

    this._destroy = function() {
      SceneJS._geometryModule.extDestroyGeometry(this._handle);
    }
    
    this._create = function() {
      var positions = [];
      var colors = [];
      for (var i=0; i<curvePos.length; i++) {
        positions.push(curvePos[i].x);
        positions.push(curvePos[i].y);
        positions.push(curvePos[i].z);
        colors.push(1.0);
        colors.push(0.4);
        colors.push(1.0);
     }
     var indices = [];
     for (var i = 0; i <curvePos.length; i++) {
       indices.push(i);
     }
     return {
       primitive : "line-strip",
       positions : positions,

       indices : indices
     };		     
	 };
	   
};



Circle.prototype.setAngle = function(angle) {
	 this.angle = angle%360;
}

Circle.prototype.setBeta = function(angle) {
	 this._beta = angle%360;
}

Circle.prototype._init = function(params) {
		 this.setAngle(params.angle);
		 this.setBeta(params.beta||90);
		 
		 this.linewidth = params.width || 1;

     this._create = function(angle) {
		    var slices = Math.abs(Math.round(this.angle/5));
        var positions = [];
        var colors = [];
        var arc = (this.angle / 180.0) * Math.PI;
				var beta = (this._beta/180)*Math.PI;
				var cosPhi = Math.cos(beta);
				var sinPhi = Math.sin(beta);				
        var x=0,y=0,z=0.2,delta=0;
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
            var theta = sliceNum * arc / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);



                x = sinTheta*sinPhi;
                y = cosTheta*sinPhi;
                z = cosPhi; //0.2; //sinTheta;

								if(this.linewidth!=1)
									if(sliceNum % 2)
										delta = 0.01;
									else 
										delta = -0.01;
									
                if(sliceNum==0) {
                  positions.push(x);
                  positions.push(y);
                  positions.push(z-delta);
                }  
                positions.push(x);
                positions.push(y);
                positions.push(z+delta);


          
        }
        
        positions.push(x);
        positions.push(y);
        positions.push(z-delta);
        

        
        var indices = [];
        for (var sliceNum = 0; sliceNum <= slices+2; sliceNum++) {
                indices.push(sliceNum);
        }
        if(this.linewidth!=1)
					resource = "facearc" + Math.round(this.angle) +":"+ Math.round(this._beta);
				else
					resource = "linearc" + Math.round(this.angle) +":"+ Math.round(this._beta);

        return {
        		resource: resource,
            primitive : (this.linewidth==1) ? "line-strip" : "triangle-strip",
            positions : positions,
            colors : colors,
            indices : indices
        };		     
	   };
	   
};



Circle.prototype._render = function(traversalContext) {
		if(this.linewidth!=1)
			resource = "facearc" + Math.round(this.angle) +":"+ Math.round(this._beta);
		else
			resource = "linearc" + Math.round(this.angle) +":"+ Math.round(this._beta);
		this._handle  = resource;
    if (this._handle) { // Was created before - test if not evicted since
        if (!SceneJS._geometryModule.testGeometryExists(this._handle)) {
            this._handle = null;
        }
    }
    if (!this._handle) { // Either not created yet or has been evicted
        if (this._create) { // Use callback to create
            this._handle = SceneJS._geometryModule.createGeometry(resource, this._create(this.angle));
        } 
    }
    SceneJS._geometryModule.pushGeometry(this._handle, { solid: this._solid });
    this._renderNodes(traversalContext);
    SceneJS._geometryModule.popGeometry();

};






Spherical.prototype._init = function(params) {
        
    this._curve = null;
	  tmpNodes =  this.removeNodes();
  	color = params.color || { r: 0.5, g: 0.5, b: 0.5};
  	this._visuals = [];
	  

						 	
    this.addNode( 		  // arc
   		this._visuals["arc1"] = SceneJS.scale( {x: params.scale, y: -params.scale, z: params.scale },
	 				this.arcangle21 = new Circle({angle: params.angle})));


    this.addNode( 		  // arc
   		this._visuals["arc2"] = SceneJS.scale( {x: -params.scale, y: params.scale, z: params.scale },
	 				this.arcangle22 = new Circle({angle: params.angle})));

    this.addNode(

	 				
	  this._zRotate = SceneJS.rotate({angle: 0.0, z: 1.0},



   	this._yRotate = SceneJS.rotate({angle: 0.0, y: 1.0},
   	

        
      this._anchor = SceneJS.material({
		      baseColor:      { r: 0.0, g: 0.0, b: 0.0 },
          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
          emit: 1.0, specular: 0.0, shine: 1.0 
          }),	

				this._anchor2 = SceneJS.material({
		      baseColor:      color,
          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
          emit: 1.0, specular: 0.0, shine: 1.0 
          },	
    	

    this._visuals["markerarc"] = SceneJS.rotate({angle: 90.0, y: 1.0},
       		SceneJS.scale( {x: -params.scale, y: params.scale, z: params.scale },
	 				  new Circle({ angle: 90.0}))),

		// equator marker ball
		this._visuals["markerball"]  = SceneJS.translate( {x: 0.0, y: 0.0, z: params.scale  }, 
			SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
				SceneJS.sphere() 
			)
		),
	    	  // northpole
					this._visuals["npole"] = SceneJS.translate( {x: 0.0, y: params.scale, z: 0.0  }, 
						SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
							SceneJS.sphere() 
						)
					),
	    	  // southhpole
					this._visuals["spole"] = SceneJS.translate( {x: 0.0, y: -params.scale, z: 0.0  }, 
						SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
							SceneJS.sphere() 
						)
					),
					// equator
					this._visuals["equator"] = SceneJS.rotate({angle: 90.0, x: 1.0},
				 		SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
				 			new Circle({angle: 359})
				 		)
				 	)
			 	)
			)

		)
		);
    		
		// equator marker arc/angle			
		this._anchor2.addNode( 	this._visuals["rotationarc"] = SceneJS.rotate({angle: 90.0, x: 1.0},			
 				SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
	 				this.arcangle11 = new Circle({width: 2, angle: 0})
		)));	
	
		this._anchor2.addNodes(tmpNodes);

    this.setAxis(params.angle || 0.0);
    this.setRotate(params.rotate || 0.0);
    this.setSpeed(params.speed);
       
        
};

Spherical.prototype.setVisuals = function(vis, state) {
    for(i in vis) {
      this._visuals[vis[i]].setEnabled(state);		
    }
				
};
Spherical.prototype.setAxis = function(angle) {
		this._zAngle = angle;
		this.arcangle21.setAngle(angle);
		this.arcangle22.setAngle(angle);
		this._zRotate.setAngle(this._zAngle);
};

Spherical.prototype.getAxis = function() {
		return this._zAngle;
};

Spherical.prototype.setSpeed = function(speed) {
		this._speed = speed;
		this._step = (this._speed!=0) ? (360.0/this._speed) : 0.0;
};


Spherical.prototype.setArcBeta = function(angle) {
  this.arcangle11.setBeta(angle);
};

Spherical.prototype.setArcAngle = function(angle) {
  this.arcangle11.setAngle(-angle);
};

Spherical.prototype.setRotate = function(angle) {
		this._yAngle = angle;
		this.setArcAngle(angle);
		this._yRotate.setAngle(this._yAngle);
};

Spherical.prototype.update = function(step) {
		this._yAngle += this._step*step;
		this.setRotate(this._yAngle);
};
