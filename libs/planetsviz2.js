
Planet = function(params) {
  var emit = params.emit || 0.0;
  dist = params.dist;

//   new THREE.Mesh( new Sphere( 200, 20, 20 ),  new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ) );


//  this.addNode(
//  	this._distNode = SceneJS.translate({x:0.0, y:0.0, z: dist},
// 			SceneJS.scale( { id: params.inner_id, x:params.scale, y:params.scale, z: params.scale },
//      	this._material = SceneJS.material({              
//					baseColor:  { r: 2.2, g: 2.2, b: 2.9 },
//					specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
//    			emit: emit, specular: 0.0, shine: 3.0},
//					SceneJS.sphere()
//				)
//			)
//		)
//  ); 
						
};

Planet.prototype.setDist = function(dist) {
	this._distNode.setZ(dist);
}




THREE.Camera.prototype.setAspect = function(fov, aspect, near, far) {
	this.projectionMatrix = THREE.Matrix4.makePerspective( fov, aspect, near, far );
};

Sunlight = function() {
	return new Object();
}
