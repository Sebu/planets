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
    this.z = pos.z;
    this.position.set(pos.x, pos.y, pos.z);
};

//*
// rotation around lookAt
THREE.Camera.prototype.rotateTarget = function(target) {


    var dx = target.x - this.position.x;
    var dy = target.y - this.position.y;
    var dz = target.z - this.position.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    this.position.x = target.x + this.dir.x * -dist;
    this.position.y = target.y + this.dir.y * -dist;
    this.position.z = target.z + this.dir.z * -dist;
    
}

// lookAt
THREE.Camera.prototype.setTarget = function(target) {
    this.dir.sub(target, this.position);
    this.dir.normalize();
    this.upVec.normalize();
    this.right.cross(this.upVec, this.dir);
}



THREE.Camera.prototype.updateMatrix = function() {
    this.matrix.set(
            -this.right.x, this.upVec.x, -this.dir.x, this.position.x,
            -this.right.y, this.upVec.y, -this.dir.y, this.position.y,
            -this.right.z, this.upVec.z, -this.dir.z, this.position.z,
            0, 0, 0, 1);

   this.matrixWorldNeedsUpdate = true;
}



THREE.Camera.prototype.getZ = function() { return this.z; }
THREE.Camera.prototype.setZ = function(zoom) {
    
    this.position.x += this.dir.x * (zoom-this.z);
    this.position.y += this.dir.y * (zoom-this.z);
    this.position.z += this.dir.z * (zoom-this.z);
    this.z = zoom;
//    this.position.z = -zoom;
}

THREE.Camera.prototype.translateNew = function(x, y, z) {
    this.z += z;
    this.position.x += this.dir.x * z + this.right.x * x;
    this.position.y += this.dir.y * z + this.right.y * x;
    this.position.z += this.dir.z * z + this.right.z * x;
//    this.position.x += this.right.x * x;
//    this.position.y += this.right.y * x;
//    this.position.z += this.right.z * x;
////    this.update();
}

THREE.Camera.prototype.rotate = function(angle, axis) {
    var m = new THREE.Matrix4().rotateByAxis(axis, angle);
    this.right = m.multiplyVector3(this.right);
    this.dir = m.multiplyVector3(this.dir);
    this.upVec = m.multiplyVector3(this.up);
    this.update();
}


THREE.Camera.prototype.rotateX = function(angle) {
    var m = new THREE.Matrix4().rotateByAxis( new THREE.Vector3(1,0,0), angle);
    this.right = m.multiplyVector3(this.right);
    this.dir = m.multiplyVector3(this.dir);
    this.upVec = m.multiplyVector3(this.upVec);
    this.update();
}

THREE.Camera.prototype.rotateY = function(angle) {
    var m = new THREE.Matrix4().rotateByAxis(new THREE.Vector3(0,1,0), angle );
    this.right = m.multiplyVector3(this.right);
    this.dir = m.multiplyVector3(this.dir);
    this.upVec = m.multiplyVector3(this.upVec);
    this.update();
}


THREE.Camera.prototype.rotateRight = function(angle) {
    var m = new THREE.Matrix4().rotateByAxis(this.right, angle);
    this.dir = m.multiplyVector3(this.dir);
    this.upVec = m.multiplyVector3(this.upVec);
    this.update();
}

THREE.Camera.prototype.rotateUp = function(angle) {
    var m = new THREE.Matrix4().rotateByAxis(this.upVec, angle);
    this.right = m.multiplyVector3(this.right);
    this.dir = m.multiplyVector3(this.dir);
    this.update();
}

THREE.Camera.prototype.reset = function() {
    this.right = new THREE.Vector3(1, 0, 0); // Vector.create([1, 0, 0]);
    this.upVec = new THREE.Vector3(0, 1, 0); //Vector.create([0, 1, 0]);
    this.dir = new THREE.Vector3(0, 0, 1);  //Vector.create(  [0, 0, 1]); 
}

//*/

THREE.FPSCamera = function ( parameters ) {
    THREE.PerspectiveCamera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

    this.reset();
    this.useTarget = false;
    
    this.mouseX = this.rotateRight;
    this.mouseY = this.rotateY;    
    this.mouseWheel = function(val) {};
    
    this.update = function() {
//        THREE.BallCamera.prototype.update.call(this);
    }
}

THREE.FPSCamera.prototype = new THREE.PerspectiveCamera();
THREE.FPSCamera.prototype.constructor = THREE.FPSCamera;

THREE.BallCamera = function ( parameters ) {
    THREE.PerspectiveCamera.call( this, parameters.fov, parameters.aspect, parameters.near, parameters.far, parameters.target );

    this.reset();
    this.useTarget = false;
    this.mouseX = this.rotateRight;
    this.mouseY = this.rotateUp;    
    this.mouseWheel = this.translateNew;
    this.keyLeft = this.translateNew;   
     
    
    this.update = function() {
        this.rotateTarget({x: 0, y: 0, z: 0});
//        THREE.BallCamera.prototype.update.call(this);
    }
}

THREE.BallCamera.prototype = new THREE.PerspectiveCamera();
THREE.BallCamera.prototype.constructor = THREE.BallCamera;
