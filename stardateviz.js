SceneJS.Spherical  = SceneJS.createNodeType("spherical");

SceneJS.Spherical.prototype._init = function(params) {
        // this.setDensity(params.density);
			  tmpNodes =  this.removeNodes();
        this.addNode( this._zRotate = SceneJS.rotate({angle: 22.0, z: 1.0}, 
								        this._yRotate = SceneJS.rotate({angle: 45.0, y: 1.0},
								              SceneJS.material({
              baseColor:      { r: 0.2, g: 0.9, b: 0.2 },
              specularColor:  { r: 0.9, g: 0.9, b: 0.2 },
              emit: 0.0, specular: 0.9, shine: 6.0
           },
		        								SceneJS.scale( {x:0.02, y:5.0, z:0.02 }, SceneJS.cube()),
		        								SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale }, SceneJS.material({
              baseColor:      { r: 0.9, g: 0.2 * params.scale, b: 0.2 },
              specularColor:  { r: 0.9, g: 0.9, b: 0.2 },
              emit: 0.0, specular: 0.9, shine: 1.0, opacity: 0.2
           }, SceneJS.sphere()))
		        						)
        							)
        						));
        						
        this._yRotate.addNodes(tmpNodes);
};

SceneJS.Spherical.prototype.setRotate = function(angle) {
		this._yRotate.setAngle(angle);
};
 

SceneJS.Spherical.prototype._render = function(traversalContext) {
    if (SceneJS._traversalMode == SceneJS._TRAVERSAL_MODE_PICKING) {
 
        /* Don't need fog for pick traversal
         */
        this._renderNodes(traversalContext);
    } else {
        this._renderNodes(traversalContext);
    }
};
