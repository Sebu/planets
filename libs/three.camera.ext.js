// extend THREE.Camera with:
// aspect ratio setter
THREE.Camera.prototype.setAspect = function(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
};
// FOV getter & setter
THREE.Camera.prototype.getFov = function() { return this.fov; };
THREE.Camera.prototype.setFov = function(fov) {
	  this.fov = fov;
	  this.updateProjectionMatrix();
};

THREE.Camera.prototype.setEye = function(pos) {
    this.position.set(pos.x, pos.y, pos.z);
};

//*
// rotation around lookAt
THREE.Camera.prototype.rotateTarget = function(target) {


    var dx = target.x - this.position.x;
    var dy = target.y - this.position.y;
    var dz = target.z - this.position.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    this.position.x = target.x + this.dir.elements[0] * -dist;
    this.position.y = target.y + this.dir.elements[1] * -dist;
    this.position.z = target.z + this.dir.elements[2] * -dist;
    
}

// lookAt
THREE.Camera.prototype.setTarget = function(target) {

    
    this.dir.elements[0] = target.x - this.position.x;
    this.dir.elements[1] = target.y - this.position.y;
    this.dir.elements[2] = target.z - this.position.Z;

    // TODO: fix degenerate :D
    this.dir = this.dir.toUnitVector();
    this.upVec = this.upVec.toUnitVector();
    this.right = this.upVec.cross(this.dir);

//    this.update();
}



THREE.Camera.prototype.updateMatrix = function() {
    this.matrix.set(
            -this.right.elements[0], this.upVec.elements[0], -this.dir.elements[0], this.position.x,
            -this.right.elements[1], this.upVec.elements[1], -this.dir.elements[1], this.position.y,
            -this.right.elements[2], this.upVec.elements[2], -this.dir.elements[2], this.position.z,
            0, 0, 0, 1);

   this.matrixWorldNeedsUpdate = true;
}


THREE.Camera.prototype.translateNew = function(x, y, z) {
    this.position.x += this.dir.elements[0] * z;
    this.position.y += this.dir.elements[1] * z;
    this.position.z += this.dir.elements[2] * z;
    this.position.x += this.right.elements[0] * x;
    this.position.y += this.right.elements[1] * x;
    this.position.z += this.right.elements[2] * x;
//    this.update();
}

THREE.Camera.prototype.rotate = function(angle, axis) {
    var m = Matrix.Rotation(angle, axis);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.up);
//    this.update();
}


THREE.Camera.prototype.rotateX = function(angle) {
    var m = Matrix.Rotation(angle, $V([1,0,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
//    this.update();
}

THREE.Camera.prototype.rotateY = function(angle) {
    var m = Matrix.Rotation(angle, $V([0,1,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
//    this.update();
}


THREE.Camera.prototype.rotateRight = function(angle) {
    var m = Matrix.Rotation(angle, this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
//    this.update();
}

THREE.Camera.prototype.rotateUp = function(angle) {
    var m = Matrix.Rotation(angle, this.upVec);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
//    this.update();
}

THREE.Camera.prototype.reset = function() {
    this.right = Vector.create([1, 0, 0]);
    this.upVec = Vector.create([0, 1, 0]);
    this.dir = Vector.create(  [0, 0, 1]);
}

//*/

THREE.FPSCamera = function ( parameters ) {
    THREE.Camera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

    this.reset();
    this.useTarget = false;
    
    this.mouseX = this.rotateRight;
    this.mouseY = this.rotateY;    
    this.mouseWheel = function(val) {};
    
    this.update = function() {
        THREE.BallCamera.prototype.update.call(this);
    }
}

THREE.FPSCamera.prototype = new THREE.Camera();
THREE.FPSCamera.prototype.constructor = THREE.FPSCamera;

THREE.BallCamera = function ( parameters ) {
    THREE.Camera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

    this.reset();

    this.useTarget = false;
    this.mouseX = this.rotateRight;
    this.mouseY = this.rotateUp;    
    this.mouseWheel = this.translateNew;
    this.keyLeft = this.translateNew;    
    
    this.update = function() {
        this.rotateTarget({x: 0, y: 0, z: 0});
        THREE.BallCamera.prototype.update.call(this);
    }
}

THREE.BallCamera.prototype = new THREE.Camera();
THREE.BallCamera.prototype.constructor = THREE.BallCamera;
