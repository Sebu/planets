SceneJS._contextModule = new (function() {

    var canvas;         // Currently active canvas
    
    SceneJS._eventModule.addListener(
            SceneJS._eventModule.CANVAS_ACTIVATED,
            function(c) {
                canvas = c;
            }
    );
    this.setLineWidth = function(width) {
    	canvas.context.lineWidth(width);
    }

});


SceneJS.LookAt.prototype.setTarget = function(target) {

	dx = target.x - this._lookX;
  dy = target.y - this._lookY;
	dz = target.z - this._lookZ;
	dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
	
	this._eyeX += dx;
	this._eyeY += dy;
	this._eyeZ += dz;
	this.translate(0.0,0.0,-dist);

	this.setLook({x: this._eyeX + this.dir.x, y: this._eyeY + this.dir.y, z: this._eyeZ + this.dir.z});
	this._setDirty(); 
}


SceneJS.LookAt.prototype._init = function(params) {
    this._mat = null;
    this._xform = null;

		this._yaw = 0.0;
		this._pitch = 0.0;		
		this._roll = 0.0;		
		this.up = params.up;
		this.right = {x: 1.0, y:0.0, z:0.0};
		this.dir = {x: 0.0, y:0.0, z:1.0};
		
    this.setEye(params.eye);
    this.setUp(params.up);

    this.setLook(params.look);

};

SceneJS.LookAt.prototype.update = function() {
  sinPitch = Math.sin(this._pitch);
  cosPitch = Math.cos(this._pitch);
  sinYaw   = Math.sin(this._yaw); 
  cosYaw   = Math.cos(this._yaw);
  sinRoll  = Math.sin(this._roll);
  cosRoll  = Math.cos(this._roll);
  
  this.right.x = cosYaw*cosRoll + sinYaw*sinPitch*sinRoll;
  this.right.y = sinRoll*cosPitch;
  this.right.z = cosYaw*sinPitch*sinRoll - sinYaw*cosRoll;

  this.up.x = sinYaw*sinPitch*cosRoll - cosYaw*sinRoll;
  this.up.y = cosRoll*cosPitch;
  this.up.z = sinRoll*sinYaw + cosRoll*cosYaw*sinPitch;

  this.dir.x = cosPitch*sinYaw;
  this.dir.y = -sinPitch;
  this.dir.z = cosPitch*cosYaw;  
  
  this.setLook({x: this._eyeX + this.dir.x, y: this._eyeY + this.dir.y, z: this._eyeZ + this.dir.z});
  this.setUp(this.up);
	this._setDirty();  
}

SceneJS.LookAt.prototype.translate = function(x,y,z) {
	this._eyeX += this.dir.x * z;
	this._eyeY += this.dir.y * z;
	this._eyeZ += this.dir.z * z;
	this._lookX = this._eyeX + this.dir.x;
	this._lookY = this._eyeY + this.dir.y;
	this._lookZ = this._eyeZ + this.dir.z;
	this._setDirty();
}


SceneJS.LookAt.prototype.rotate = function(x,y,z) {
	this._pitch += x;
	this._yaw  += y;
	this._roll += z;
}


getNodePos = function(node) {
  query = new SceneJS.utils.query.QueryNodePos({ canvasWidth : 1, canvasHeight : 1	});
	query.execute({ nodeId: node });
	return query.getResults().worldPos;
}

sunlight = function() {
	return new SceneJS.Light({
          mode: "point",
          pos: { x: 0.0, y: 0.0, z: 0.0 }, // Position
          color: { r: 1.0, g: 1.0, b: 1.0 },
          diffuse: true,   // Contribute to diffuse lighting
          specular: true,  // Contribute to specular lighting
        })
}


SceneJS.Spherical  = SceneJS.createNodeType("spherical");
SceneJS.Planet  = SceneJS.createNodeType("planet");
SceneJS.Globe  = SceneJS.createNodeType("globe");
SceneJS.Circle  = SceneJS.createNodeType("circle", "geometry");
SceneJS.Curve  = SceneJS.createNodeType("curve", "geometry");

SceneJS.Globe.prototype._init = function(params) {
	var emit = params.emit || 0.0;
	
	this.addNode( 
		SceneJS.scale({ x: params.scale, y: params.scale, z: params.scale}, 
			SceneJS.material({              
				baseColor:  { r: 0.0, g: 0.0, b: 0.0 },
				specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
		  	emit: emit, specular: 0.0, shine: 6.0},
				new SceneJS.Texture({ layers: [{	uri: params.tex, flipY : false }] }, SceneJS.sphere() )
			)
		)
	);
};



SceneJS.Planet.prototype._init = function(params) {
  var emit = params.emit || 0.0;
  shiftval = params.shiftval || 9.0;
  this.addNode(
  	SceneJS.translate({x:0.0, y:0.0, z:shiftval},
 			SceneJS.scale( { id: params.inner_id, x:params.scale, y:params.scale, z: params.scale },
      	SceneJS.material({              
					baseColor:  { r: 1.0, g: 1.0, b: 1.0 },
					specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    			emit: emit || 0.0, specular: 0.1, shine: 7.0},
					//SceneJS.texture({ layers: [{	uri: params.tex, flipY : false }] },
           SceneJS.sphere() //)
				)
			)
		)
  ); 
						
};



SceneJS.Curve.prototype._init = function(params) {
    var curvePos = params.pos;
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
       colors : colors,
       indices : indices
     };		     
	 };
	   
};


SceneJS.Circle.prototype._init = function(params) {
		 this.angle = params.angle;
		 this.linewidth = params.width || 1;
        // this.setDensity(params.density);
     this._create = function(angle) {
     		//this.angle = angle;
		    var slices = Math.abs(Math.round(this.angle/5));
        var positions = [];
        var normals = [];
        var colors = [];
        var arc = (angle / 180.0) * Math.PI;
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
            var theta = sliceNum * arc / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

                var x = sinTheta;
                var y = cosTheta;
                var z = 0.0; //sinTheta;
                var u = 1;
                var v = sliceNum / slices;

								if(this.linewidth!=1)
									if(sliceNum % 2)
										z = 0.01;
									else 
										z = -0.01;
									
                positions.push(x);
                positions.push(y);
                positions.push(z);
                colors.push(1.0);
                colors.push(1.0);
                colors.push(1.0);

        }

        var indices = [];
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
                indices.push(sliceNum);
        }

        return {
        		resource: "arc" + Math.round(angle)%360,
            primitive : (this.linewidth==1) ? "line-strip" : "triangle-strip",
            positions : positions,
            //normals: normals,
            colors : colors,
            indices : indices
        };		     
	   };
	   
};

SceneJS.Circle.prototype._render = function(traversalContext) {
		if(this.linewidth!=1)
			resource = "Farc" + Math.round(this.angle)%360;
		else
			resource = "arc" + Math.round(this.angle)%360;
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
    SceneJS._contextModule.setLineWidth(1);//this.linewidth);
    this._renderNodes(traversalContext);
    SceneJS._geometryModule.popGeometry();

};






SceneJS.Spherical.prototype._init = function(params) {
        // this.setDensity(params.density);
        
    this._curve = null;
	  tmpNodes =  this.removeNodes();
  	color = params.color || { r: 0.5, g: 0.5, b: 0.5};
  	this._visuals = [];//new Object();
	  

		// equator marker arc/angle			
		this.addNode( 	this._visuals["rotationarc"] = SceneJS.rotate({angle: 90.0, x: 1.0},			
 				SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
	 				this.arcangle11 = new SceneJS.Circle({width: 2, angle: 0})
		)));					
						 	
    this.addNode( 		  // arc
   		this._visuals["arc1"] = SceneJS.scale( {x: params.scale, y: -params.scale, z: params.scale },
	 				this.arcangle21 = new SceneJS.Circle({angle: params.angle})));


    this.addNode( 		  // arc
   		this._visuals["arc2"] = SceneJS.scale( {x: -params.scale, y: params.scale, z: params.scale },
	 				this.arcangle22 = new SceneJS.Circle({angle: params.angle})));

    this.addNode(

	 				
	  this._zRotate = SceneJS.rotate({angle: 0.0, z: 1.0},



   	this._yRotate = SceneJS.rotate({angle: 0.0, y: 1.0},
   	

				this._anchor = SceneJS.material({
		      baseColor:      color,
          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
          emit: 0.2, specular: 0.0, shine: 1.0 
          },	
    	
		// equator marker ball
    this._visuals["markerarc"] = SceneJS.rotate({angle: 90.0, y: 1.0},
       		SceneJS.scale( {x: -params.scale, y: -params.scale, z: params.scale },
	 				  new SceneJS.Circle({angle: 90.0}))),

		SceneJS.translate( {x: 0.0, y: 0.0, z: params.scale  }, 
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
				 			new SceneJS.Circle({angle: 359})
				 		)
				 	)
			 	)
			)

		)
		);
    		
	
    this._anchor.addNodes(tmpNodes);
    this._zAngle= params.angle || 0;
    this.setAxis(this._zAngle);
    this._yAngle= 0.0;
    
    this._ySpeed= params.speed ? (360.0 / params.speed) : 0.0;

    this.update(1.0);
        
        
};

SceneJS.Spherical.prototype.setVisuals = function(vis, state) {
    for(i in vis) {
      console.log(vis[i]);
      this._visuals[vis[i]].setEnabled(state);		
    }
				
};
SceneJS.Spherical.prototype.setAxis = function(angle) {
		this._zAngle = angle;
		this.arcangle21.angle = angle;
		this.arcangle22.angle = angle;
		this._zRotate.setAngle(this._zAngle);
};

SceneJS.Spherical.prototype.getAxis = function() {
		return  this._zAngle;
};

SceneJS.Spherical.prototype.setSpeed = function(speed) {
		this._ySpeed = speed ? (360.0/speed) : 0.0;
};

SceneJS.Spherical.prototype.setArcAngle = function(angle) {
  this.arcangle11.angle = angle;
//  this.arcangle12.angle = angle;
};

SceneJS.Spherical.prototype.setRotate = function(angle) {
		this._yAngle = angle;
		this.arcangle11.angle = angle;
//		this.arcangle12.angle = angle;

		this._yRotate.setAngle(this._yAngle);
};

SceneJS.Spherical.prototype.update = function(step) {
		this._yAngle += this._ySpeed*step;
		this.setRotate(this._yAngle);
};
