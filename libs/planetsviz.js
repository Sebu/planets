
Planet.prototype._init = function(params) {
  var emit = params.emit || 0.0;
  dist = params.dist;
  this.addNode(
  	this._distNode = SceneJS.translate({x:0.0, y:0.0, z: dist},
 			SceneJS.scale( { id: params.inner_id, x:params.scale, y:params.scale, z: params.scale },
      	this._material = SceneJS.material({              
					baseColor:  { r: 2.2, g: 2.2, b: 2.9 },
					specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    			emit: emit, specular: 0.0, shine: 3.0},
					SceneJS.sphere()
				)
			)
		)
  ); 
						
};

Planet.prototype.setShade = function(state) {
	this._material.setBaseColor({r: state, g: state, b:state});
//  state ? this._material.setBaseColor({r: 1.0, g: 1.0, b:1.0}) : this._material.setBaseColor({r: 0.0, g: 0.0, b:0.0});
}

Planet.prototype.setDist = function(dist) {
	this._distNode.setZ(dist);
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

Circle.prototype._init = function(params) {
		 this.setAngle(params.angle);
		 this.linewidth = params.width || 1;

     this._create = function(angle) {
		    var slices = Math.abs(Math.round(this.angle/5));
        var positions = [];
        var colors = [];
        var arc = (this.angle / 180.0) * Math.PI;
        var x=0,y=0,z=0;
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
            var theta = sliceNum * arc / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

                x = sinTheta;
                y = cosTheta;
                z = 0.0; //sinTheta;

								if(this.linewidth!=1)
									if(sliceNum % 2)
										z = 0.01;
									else 
										z = -0.01;
									
                if(sliceNum==0) {
                  positions.push(x);
                  positions.push(y);
                  positions.push(-z);
                }  
                positions.push(x);
                positions.push(y);
                positions.push(z);


          
        }
        
        positions.push(x);
        positions.push(y);
        positions.push(-z);
        

        
        var indices = [];
        for (var sliceNum = 0; sliceNum <= slices+2; sliceNum++) {
                indices.push(sliceNum);
        }
        if(this.linewidth!=1)
					resource = "facearc" + Math.round(this.angle);
				else
					resource = "linearc" + Math.round(this.angle);

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
			resource = "facearc" + Math.round(this.angle);
		else
			resource = "linearc" + Math.round(this.angle);
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
          emit: 0.2, specular: 0.0, shine: 1.0 
          }),	

				this._anchor2 = SceneJS.material({
		      baseColor:      color,
          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
          emit: 0.2, specular: 0.0, shine: 1.0 
          },	
    	
		// equator marker ball
    this._visuals["markerarc"] = SceneJS.rotate({angle: 90.0, y: 1.0},
       		SceneJS.scale( {x: -params.scale, y: -params.scale, z: params.scale },
	 				  new Circle({angle: 90.0}))),

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
		
    this._anchor2.addNode(this._zRotate2 = SceneJS.rotate({angle: 0.0, z: 1.0}));
    this._zRotate2.addNodes( tmpNodes );

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
		this._step = (speed!=0) ? (360.0/speed) : 0.0;
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
