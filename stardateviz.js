SceneJS.Spherical  = SceneJS.createNodeType("spherical");
SceneJS.Planet  = SceneJS.createNodeType("planet");
SceneJS.Sky  = SceneJS.createNodeType("sky");
SceneJS.Circle  = SceneJS.createNodeType("circle", "geometry");

SceneJS.Sky.prototype._init = function(params) {

	this.addNode( new SceneJS.Scale({ x:-5.0, y:-5.0, z:-5.0}, 
			new SceneJS.Planet({emit:0.5, tex: "textures/starsmap.jpg"} )) 
	);           
}

SceneJS.Circle.prototype._init = function(params) {
    var slices = params.slices || 30;
    var angle = params.angle || 360;
        // this.setDensity(params.density);
     this._create = function() {
        var radius = 1;
        var positions = [];
        var normals = [];
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

        }

        var indices = [];
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
                indices.push(sliceNum);
        }

        return {
            primitive : "line-strip",
            positions : positions,
            normals: normals,
            uv : uv,
            indices : indices
        };		     
	   };
};


SceneJS.Planet.prototype._init = function(params) {
        // this.setDensity(params.density);
        var emit = params.emit || 0.0;
			  tmpNodes =  this.removeNodes();
        this.addNode( this._zRotate = SceneJS.rotate({angle: 22.0, z: 1.0}, 
								        this._yRotate = SceneJS.rotate({angle: 45.0, y: 1.0},
								        	SceneJS.material({              
								        	baseColor: { r: 0.0, g: 0.0, b: 0.0 },
						              specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
        						      emit: emit, specular: 0.0, shine: 1.0},
								          	new SceneJS.Texture({ layers: [{	uri: params.tex }] }, new SceneJS.Sphere())
								          )
	        						  )
	        						)
	        					);
        						
        this._yRotate.addNodes(tmpNodes);
};

SceneJS.Planet.prototype.setRotate = function(angle) {
		this._yRotate.setAngle(angle);
};
 



SceneJS.Spherical.prototype._init = function(params) {
        // this.setDensity(params.density);
			  tmpNodes =  this.removeNodes();
			  this.addNode(SceneJS.translate( {x: params.scale, y: 0.0 , z: 0.0  }, SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, new SceneJS.Sphere() )));
        this.addNode(this._zRotate = SceneJS.rotate({angle: params.angle, z: 1.0},
											 SceneJS.translate( {x: 0.0, y: params.scale, z: 0.0  }, SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, new SceneJS.Sphere() )),
											 SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale }, new SceneJS.Circle({angle: params.angle}) ),											        
										   this._yRotate = SceneJS.rotate({angle: 0.0, y: 1.0},
								              SceneJS.material({
	              baseColor:      { r: 0.9 , g: 0.7, b: 0.2 },
  	            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    	          emit: 0.0, specular: 0.0, shine: 1.0, opacity: 1.0
           },
        	
		        	SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale }, SceneJS.material({
	              baseColor:      { r: 0.9 , g: 0.7, b: 0.2 },
  	            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    	          emit: 0.0, specular: 0.0, shine: 1.0, opacity: 0.2
           			} )
           		)
		      ))
				));
        						
        this._yRotate.addNodes(tmpNodes);
};

SceneJS.Spherical.prototype.setRotate = function(angle) {
		this._yRotate.setAngle(angle);
};
