THREE.Camera.prototype.setAspect = function(fov, aspect, near, far) {
	this.projectionMatrix = THREE.Matrix4.makePerspective( fov, aspect, near, far );
};
