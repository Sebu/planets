

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

SceneJS.LookAt.prototype.move = function(delta) {
	this._eyeX += 0.0 * delta;
	this._eyeY += 0.0 * delta;
	this._eyeZ += 1.0 * delta;
	this._lookX = this._eyeX + 0.0;
  this._lookY = this._eyeY + 0.0;
	this._lookZ = this._eyeZ + 1.0;
	this._setDirty();
}


//Camera.prototype.pitch = function(delta) {
//	dir = this._dir;
//	this._pos += this._dir * delta;
//}

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

SceneJS.Globe.prototype._init = function(params) {
	var emit = params.emit || 0.0;
	
	this.addNode( 
		SceneJS.scale({ x: params.scale, y: params.scale, z: params.scale}, 
			SceneJS.material({              
				baseColor:  { r: 0.0, g: 0.0, b: 0.0 },
				specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
		  	emit: emit, specular: 0.0, shine: 6.0},
				SceneJS.texture({ layers: [{	uri: params.tex }] }, SceneJS.sphere() )
			)
		)
	);
};



SceneJS.Planet.prototype._init = function(params) {
  var emit = params.emit || 0.0;
  this.addNode(
  	SceneJS.translate({x:0.0, y:0.0, z:9.0},
 			SceneJS.scale( { id: params.inner_id, x:params.scale, y:params.scale, z: params.scale },
      	SceneJS.material({              
					baseColor:  { r: 1.0, g: 1.0, b: 0.0 },
					specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    			emit: emit || 0.0, specular: 0.0, shine: 6.0},
					SceneJS.texture({ layers: [{	uri: params.tex }] }, SceneJS.sphere())
				)
			)
		)
  );      						
};

SceneJS.Circle.prototype._init = function(params) {
    var angle = params.angle;
    var slices = Math.abs(Math.round(angle/5));
        // this.setDensity(params.density);
     this._create = function() {
        var positions = [];
        var normals = [];
        var colors = [];
        var uv = [];
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

                normals.push(-x);
                normals.push(-y);
                normals.push(-z);
                uv.push(u);
                uv.push(v);
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
        		resource: "arc" + angle,
            primitive : "line-strip",
            positions : positions,
            normals: normals,
            uv : uv,
            colors : colors,
            indices : indices
        };		     
	   };
	   
};
SceneJS.Circle.prototype._render = function(traversalContext) {
    if (this._handle) { // Was created before - test if not evicted since
        if (!SceneJS._geometryModule.testGeometryExists(this._handle)) {
            this._handle = null;
        }
    }
    if (!this._handle) { // Either not created yet or has been evicted
        if (this._create) { // Use callback to create
            this._handle = SceneJS._geometryModule.createGeometry(this._resource, this._create());
        } else { // Or supply arrays
            this._handle = SceneJS._geometryModule.createGeometry(this._resource, this._geo);
        }
    }
    SceneJS._geometryModule.pushGeometry(this._handle, { solid: this._solid });
    SceneJS._contextModule.setLineWidth(2);
    this._renderNodes(traversalContext);
    SceneJS._geometryModule.popGeometry();

};






SceneJS.Spherical.prototype._init = function(params) {
        // this.setDensity(params.density);
        
	  tmpNodes =  this.removeNodes();
    this._color = params.color || { r: 0.5, g: 0.5, b: 0.5};
	  
//		this.addNode( 				
//			SceneJS.rotate({angle: 90.0, x: 1.0},
// 				SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
//	 				new SceneJS.Circle({angle: this._yAngle})
//		)));
				 	
    this.addNode(

   	
    	this._yRotate = SceneJS.rotate({angle: 0.0, y: 1.0},

				SceneJS.material({
		      baseColor:      this._color,
          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
          emit: 0.2, specular: 0.0, shine: 1.0 
          },	    	
	    	  // northpole
					SceneJS.translate( {x: 0.0, y: params.scale, z: 0.0  }, 
						SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
							SceneJS.sphere() 
						)
					),
	    	  // southhpole
					SceneJS.translate( {x: 0.0, y: -params.scale, z: 0.0  }, 
						SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
							SceneJS.sphere() 
						)
					),
					// arc
				 	SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
				 		new SceneJS.Circle({angle: -params.angle})
				 	),
					// equator
					SceneJS.rotate({angle: 90.0, x: 1.0},
				 		SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
				 			new SceneJS.Circle({angle: 360})
				 		)
				 	),
				 	this._zRotate = SceneJS.rotate({angle: 0.0, z: 1.0}
			 	)
			)

		)
		);
    						
    this._zRotate.addNodes(tmpNodes);
    this._zAngle= params.angle || 0;
    this.setAxis(this._zAngle);
    this._yAngle= params.yAngle || 0.0;
    this._ySpeed=  params.speed || 0.0;
    this.update(1.0);
        
        
};

SceneJS.Spherical.prototype.setAxis = function(angle) {
		this._zAngle = angle;
		this._zRotate.setAngle(this._zAngle);
};

SceneJS.Spherical.prototype.setRotate = function(angle) {
		this._yAngle = angle;
		this._yRotate.setAngle(this._yAngle);
};

SceneJS.Spherical.prototype.update = function(step) {
		this._yAngle += this._ySpeed*step;
		this.setRotate(this._yAngle);
};
