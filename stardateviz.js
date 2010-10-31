SceneJS.Spherical  = SceneJS.createNodeType("spherical");
SceneJS.Planet  = SceneJS.createNodeType("planet");
SceneJS.Circle  = SceneJS.createNodeType("circle", "geometry");

SceneJS.Circle.prototype._init = function(params) {
        // this.setDensity(params.density);
     this._create = function() {
		     
		      return {
		          primitive : "line-loop",
		          positions : [
						      -1.0,-1.0,0.0,
		      				1.0,-1.0,0.0,
		      				1.0,1.0,0.0,
						      -1.0,1.0,0.0
		
		      		],
		          indices : [ 0, 1, 2, 3 ]
		      };
	   };
};


SceneJS.Planet.prototype._init = function(params) {
        // this.setDensity(params.density);
			  tmpNodes =  this.removeNodes();
        this.addNode( this._zRotate = SceneJS.rotate({angle: 22.0, z: 1.0}, 
								        this._yRotate = SceneJS.rotate({angle: 45.0, y: 1.0},
								        	SceneJS.material({              
								        	baseColor: { r: 0.0, g: 0.0, b: 0.0 },
						              specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
        						      emit: 0.0, specular: 0.0, shine: 1.0},
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
        this.addNode( this._zRotate = SceneJS.rotate({angle: params.angle, z: 1.0}, 
								        this._yRotate = SceneJS.rotate({angle: 45.0, y: 1.0},
								              SceneJS.material({
              baseColor:      { r: 1.0, g: 1.0, b: 0.5 },
              specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
              emit: 0.0, specular: 0.0, shine: 1.0
           },
		        	SceneJS.scale( {x:0.05, y: 1.0 * params.scale, z:0.05 }, SceneJS.sphere()),
		        	SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale }, SceneJS.material({
	              baseColor:      { r: 0.9 , g: 0.7, b: 0.2 },
  	            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    	          emit: 0.0, specular: 0.0, shine: 1.0, opacity: 0.2
           }, SceneJS.sphere(), new SceneJS.Circle() ))
		        						)
        							)
        						));
        						
        this._yRotate.addNodes(tmpNodes);
};

SceneJS.Spherical.prototype.setRotate = function(angle) {
		this._yRotate.setAngle(angle);
};
