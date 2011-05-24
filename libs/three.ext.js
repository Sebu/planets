

const PI_SCALE = 180.0/Math.PI;

degToRad = function(deg) {
    return deg/PI_SCALE;
}

calcAngle = function(pos1, pos2) {
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

calcAngleRel = function(node1, node2, center) {
    var pos1 = center.subtract( node1 );
    var pos2 = center.subtract( node2 );
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

rgbToHex = function(color) {
	 return ~~ ( color.r * 255 ) << 16 ^ ~~ ( color.g * 255 ) << 8 ^ ~~ ( color.b * 255 );
}

// extend THREE.Object3D 
Node = THREE.Object3D;
THREE.Object3D.prototype.addNode = function(node) { this.addChild(node); };
//THREE.Object3D.prototype.setBaseColor = function(params) { };
THREE.Object3D.prototype.setPos = function(pos) { this.position.set(pos.x, pos.y, pos.z); }
THREE.Object3D.prototype.setEnabled = function(state) { this.visible = state; };
THREE.Object3D.prototype.getEnabled = function() { return this.visible; };

// fast update of current world matrix
THREE.Object3D.prototype.currentMatrixWorld = function() {
    this.matrixAutoUpdate && this.updateMatrix();
    if(!this.parent) return this.matrix;
    this.matrixWorld.multiply(this.parent.currentMatrixWorld(), this.matrix);
    return this.matrixWorld;
}

// determine current position in world space
THREE.Object3D.prototype.currentPos = function() {
    var pos = this.currentMatrixWorld();
    return {x: pos.n14, y: pos.n24, z: pos.n34};
}

THREE.Object3D.prototype.getPosCanvas = function(camera, canvas) {
    var posTmp = this.currentPos();

    camera.matrixWorldInverse.multiplyVector3( posTmp );
    var zTmp = -posTmp.z;
    camera.projectionMatrix.multiplyVector3( posTmp );
    
    pos = {x: (posTmp.x+1) * canvas.domElement.width/2, y: (-posTmp.y+1) * canvas.domElement.height/2, z: zTmp };

    //if node is outside of canvas shift pos to z=-1 
    if (pos.x<0 || pos.x>canvas.domElement.width-50) pos.z = -1.0;
    if (pos.y<0 || pos.y>canvas.domElement.height-20) pos.z = -1.0;

    return pos;
}



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

// rotation around lookAt
THREE.Camera.prototype.rotateTarget = function(target) {

    var dx = target.x - this._lookX;
    var dy = target.y - this._lookY;
    var dz = target.z - this._lookZ;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // move position
    this.position.x += dx;
    this.position.y += dy;
    this.position.z += dz;
    this.translateNew(0.0, 0.0, -dist);

    this.updateNew();
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

    this.updateNew();
}

THREE.Camera.prototype.setEye = function(pos) {
    this.position.set(pos.x, pos.y, pos.z);
};

// addition of up/right/dir vector
THREE.Camera.prototype.init = function(params) {

    this.right = Vector.create([1, 0, 0]);
    this.upVec = Vector.create([0, 1, 0]);
    this.dir = Vector.create(  [0, 0, 1]);
    this.setEye(params.eye);

    this.useTarget = false;
    this.updateNew();

};


THREE.Camera.prototype.updateMatrix = function() {
    this.matrix.set(
            -this.right.elements[0], this.upVec.elements[0], -this.dir.elements[0], this.position.x,
            -this.right.elements[1], this.upVec.elements[1], -this.dir.elements[1], this.position.y,
            -this.right.elements[2], this.upVec.elements[2], -this.dir.elements[2], this.position.z,
            0, 0, 0, 1);

   this.matrixWorldNeedsUpdate = true;
}

THREE.Camera.prototype.updateNew = function() {
    this._lookX  = this.position.x + this.dir.elements[0];
    this._lookY = this.position.y + this.dir.elements[1];
    this._lookZ = this.position.z + this.dir.elements[2];
    this.update();
}

THREE.Camera.prototype.translateNew = function(x, y, z) {
    this.position.x += this.dir.elements[0] * z;
    this.position.y += this.dir.elements[1] * z;
    this.position.z += this.dir.elements[2] * z;
    this.position.x += this.right.elements[0] * x;
    this.position.y += this.right.elements[1] * x;
    this.position.z += this.right.elements[2] * x;
    this.updateNew();
}

THREE.Camera.prototype.rotate = function(angle, axis) {
    var m = Matrix.Rotation(angle, axis);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.up);
    this.updateNew();
}


THREE.Camera.prototype.rotateX = function(angle) {
    var m = Matrix.Rotation(angle, $V([1,0,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}

THREE.Camera.prototype.rotateY = function(angle) {
    var m = Matrix.Rotation(angle, $V([0,1,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}


THREE.Camera.prototype.rotateRight = function(angle) {
    var m = Matrix.Rotation(angle, this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}

THREE.Camera.prototype.rotateUp = function(angle) {
    var m = Matrix.Rotation(angle, this.upVec);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.updateNew();
}





// disc of planet surface 
Disc = function(params) {
  THREE.Mesh.call(this, new THREE.Sphere(params.radius,20,30), new THREE.MeshLambertMaterial({color: 0x4444FF, shading: THREE.FlatShading}) );
  this.scale.y = 0.01;
  this.overdraw = true;
}
Disc.prototype = new THREE.Mesh;
Disc.prototype.constructor = Disc;


// translation node (used for compass labels)
Translate = function(params) {
  THREE.Object3D.call( this );
  this.position.x = params.x || 0.0;
  this.position.y = params.y || 0.0;
  this.position.z = params.z || 0.0;
}

Translate.prototype = new THREE.Object3D;
Translate.prototype.constructor = Translate;

/* sphere LOD
* @deprecated
*/
sphereGeo = [

                [ new THREE.Sphere( 1, 32, 16 ), 0 ],
                [ new THREE.Sphere( 1, 16, 8 ), 10 ],
                [ new THREE.Sphere( 1, 8, 4 ), 20 ]

];

planetGeo = new THREE.Sphere( 1 , 32, 16 );


/*
 * @constructor
 * provide dist(tance) from center, scale, color, and beta rotation
 */
Planet = function(params) {
    THREE.Object3D.call( this );

    //var emit = params.emit || 0.0;
    this.dist = params.dist || 0.0;
    this.beta = params.betaRotate || 0.0;
    this._scale = params.scale || 1.0;
    this.color = params.color || { r: 0.5, g: 0.5, b: 0.5 };  

    this.material =  new THREE.MeshLambertMaterial( { color: rgbToHex(this.color), shading: THREE.FlatShading });

//    this.mesh = new THREE.LOD();
//    for (i = 0; i < sphereGeo.length; i++ ) {
//       mesh = new THREE.Mesh( sphereGeo[ i ][ 0 ], this.material );
//       mesh.scale.set( params.scale, params.scale, params.scale );
//       mesh.updateMatrix();
//			 mesh.matrixAutoUpdate = false;
//       mesh.overdraw = true;
//			 this.mesh.add( mesh, sphereGeo[ i ][ 1 ] );
//    }

//    new THREE.MeshBasicMaterial( { color: this.color } )
//    this.material =  new THREE.MeshPhongMaterial( { ambient: this.color, specular: 0x000000, color: 0x888888, shininess: 3, shading: THREE.SmoothShading });
    //params.scale
    this.mesh = new THREE.Mesh(planetGeo, this.material);
    this.mesh.scale.set( params.scale, params.scale, params.scale );
    this.mesh.overdraw = true;
    this.mesh.position.y = this.dist;
    this.addNode(this.mesh);

    this.rotation.x = degToRad(this.beta);

//    nodePool[params.inner_id] = this.mesh;

};

Planet.prototype = new THREE.Object3D;
Planet.prototype.constructor = Planet;

Planet.prototype.setEnabled = function(state) { this.mesh.visible = state; }
Planet.prototype.getEnabled = function() { return this.mesh.visible; }

Planet.prototype.setBeta = function(angle) {
    this.beta = angle;
    this.rotation.x = degToRad(this.beta);
};

Planet.prototype.setShade = function(color) {
    this.material.color.setHex(rgbToHex(color));
}

Planet.prototype.setDist = function(dist) {
    this.dist = dist;
    this.mesh.position.y = this.dist;
};


/*
 * @constructor
 * 
 */
Curve  = function(params) {

    this.setPos = function(pos) {
        this.gen(pos);
    };

    this.gen = function(pos) {
        this.curvePos = pos;
        this.geo.vertices = [];
        this.geo.colors = [];
        for (var i = 0; i < this.curvePos.length; i++) {
            this.geo.vertices.push( new THREE.Vertex( new THREE.Vector3( this.curvePos[i].x, this.curvePos[i].y, this.curvePos[i].z ) ) );
            color = new THREE.Color( 0xFFFFFF );
            color.setHSV( 1.0, 0.0, 0.3 + 0.7*(i / this.curvePos.length) );
            this.geo.colors.push( color );
        }
        this.geo.__dirtyVertices = true;
    };

    this.geo = new THREE.Geometry();
    this.setPos(params.pos);

    var material = new THREE.LineBasicMaterial( { linewidth:2, color: rgbToHex(params.color)  } );     
    material.vertexColors = true;

    THREE.Line.call(this, this.geo, material);
};

Curve.prototype = new THREE.Line;
Curve.prototype.constructor = Curve;


/*
 * @constructor
 */
Circle = function(params) {
    THREE.Geometry.call( this );

    this.setAngle(params.angle);
    this.setBeta(params.betaRotate || 90);

};

Circle.prototype = new THREE.Geometry;
Circle.prototype.constructor = Circle;

Circle.prototype.gen = function() {
    this.vertices = [];

    var slices = 50;//Math.abs(Math.round(this.angle/5));
    var arc = (this.angle / 180.0) * Math.PI;
    var beta = (this.beta / 180) * Math.PI;
    var cosPhi = Math.cos(beta);
    var sinPhi = Math.sin(beta);
    var x = 0,y = 0,z = cosPhi;
    for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
        var theta = sliceNum * arc / slices;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        x = sinTheta * sinPhi;
        y = cosTheta * sinPhi;

        this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
    }
//    this.__webglLineCount = slices;
    this.__dirtyVertices = true;

}

Circle.prototype.setAngle = function(angle) {
    this.angle = angle % 360;
    this.dirty = true;
    this.gen();
}

Circle.prototype.setBeta = function(angle) {
    this.beta = angle % 360;
    this.dirty = true;
    this.gen();
}




/*
 * @constructor
 * point cloude
 */
Cloud = function(params) {
    var geo = new THREE.Geometry();
    var x = 0,y = 0,z = 0;
    for (var sliceNum = 0; sliceNum < params.count; sliceNum++) {
       x = (Math.random() - 0.5);
       y = (Math.random() - 0.5);
       z = (Math.random() - 0.5);
       norm = Math.sqrt(x * x + y * y + z * z) / 10.0;
       geo.vertices.push( new THREE.Vertex( new THREE.Vector3( x / norm, y / norm, z / norm ) ) );
    }

    THREE.ParticleSystem.call( this, geo, new THREE.ParticleBasicMaterial({size: 2.5, sizeAttenuation:false}));
};

Cloud.prototype = new THREE.ParticleSystem;
Cloud.prototype.constructor = Cloud;



var geometryBall = new THREE.Sphere( 0.1, 10, 10 );
var equator = new Circle({ angle : 359.9 });

/*
 * @constructor
 * the cosmological spheres
 */
Spherical = function Spherical(params) {
    THREE.Object3D.call( this );

    this.inner_id = params.inner_id;

    var color = params.color || { r: 0.5, g: 0.5, b: 0.5};
    color = rgbToHex(color);
    this.visuals = [];

    this.axisAngle = params.axisAngle || 0.0;
    this.rotateAngle = params.rotateStart || 0.0;
    this.rotateStart = params.rotateStart || 0.0;
    this.speed = params.speed;

    this.anchor = new Node();
    this.addNode(this.anchor);
//    this.curve = new Node();
//    this.anchor.addNode(this.curve);


    this.material = new THREE.LineBasicMaterial( {  color: color } );
    this.materialArc =  new THREE.LineBasicMaterial( {  color: color } );

    this.arcangle21 = new Circle({ angle : this.axisAngle });
    this.visuals.arc1 = this.arc1 = new THREE.Line(this.arcangle21, this.materialArc );
    this.visuals.arc1.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.addNode(this.visuals.arc1);

    this.visuals.arc2 = new THREE.Line(this.arcangle21, this.materialArc );
    this.visuals.arc2.scale  = new THREE.Vector3( -params.scale, -params.scale, -params.scale );
    this.addNode(this.visuals.arc2);

    var materialArc = new THREE.LineBasicMaterial( {  color: color });
    this.visuals.equator = new THREE.Line(equator, this.material );
    this.visuals.equator.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.visuals.equator.rotation.x = Math.PI/2;
    this.anchor.addNode(this.visuals.equator);

    this.markerArc = new Circle({ angle : 90 });
    this.visuals.markerarc = new THREE.Line(this.markerArc, this.material );
    this.visuals.markerarc.scale  = new THREE.Vector3( -params.scale, params.scale, params.scale );
    this.visuals.markerarc.rotation.y = Math.PI/2;
    this.anchor.addNode(this.visuals.markerarc);

    //var geometryBall = new THREE.Sphere( 0.1, 10, 10 );
    geometryBall.overdraw = true;
    
    var materialBall = new THREE.MeshBasicMaterial( { color: color } );

    this.visuals.markerball =  new THREE.Mesh(geometryBall, materialBall);
    this.visuals.npole = new THREE.Mesh(geometryBall, materialBall);
    this.visuals.spole = new THREE.Mesh(geometryBall, materialBall);
    this.visuals.markerball.position.z = params.scale;
    this.visuals.npole.position.y = params.scale;
    this.visuals.spole.position.y = -params.scale;
    this.anchor.addNode(this.visuals.markerball);
    this.anchor.addNode(this.visuals.npole);
    this.anchor.addNode(this.visuals.spole);
//    nodePool[this.inner_id] = this.visuals.markerball;
//    nodePool[this.inner_id+"npole"] = this.visuals.npole;
//    nodePool[this.inner_id+"spole"] = this.visuals.spole;

    this.progressArc = new Circle({ angle : 40 });
    this.visuals.rotationarc = new THREE.Line( this.progressArc, new THREE.LineBasicMaterial( { linewidth:6, color: color } ));
    this.visuals.rotationarc.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.visuals.rotationarc.rotation.x = Math.PI/2;
    this.anchor.addNode(this.visuals.rotationarc);

    this.setAxisAngle(this.axisAngle);
    this.setRotateAngle(this.rotateAngle);
    this.setSpeed(this.speed);

};

Spherical.prototype = new THREE.Object3D;
Spherical.prototype.constructor = Spherical;

Spherical.prototype.getPlane = function() {

//    var plane = Plane.create(Vector.Zero(3), posSyl(this.inner_id+"npole").toUnitVector());
    var plane = Plane.create(Vector.Zero(3), sceneToSyl(this.visuals.npole.currentPos()).toUnitVector());
    return plane;
}

Spherical.prototype.setVisuals = function(vis, state) {
    for (var i in vis) {
        this.visuals[vis[i]].setEnabled(state);
    }

};
Spherical.prototype.setAxisAngle = function(angle) {
    this.axisAngle = angle;
    this.rotation.z = degToRad(this.axisAngle);
    this.arcangle21.setAngle(angle);

};

Spherical.prototype.getAxisAngle = function() {
    return this.axisAngle;
};

Spherical.prototype.setRotateStart = function(val) {
    this.rotateStart = val;
};

Spherical.prototype.getRotateStart = function() {
    return this.rotateStart;
};


Spherical.prototype.setSpeed = function(speed) {
    this.speed = speed;
    this.step = (this.speed != 0) ? (360.0 / this.speed) : 0.0;
};
Spherical.prototype.getSpeed = function() {
    return this.speed;
};


Spherical.prototype.setStep = function(step) {
    this.step = step;
};

Spherical.prototype.getStep = function(step) {
    return this.step;
};


Spherical.prototype.setArcBeta = function(angle) {
    this.markerArc.setAngle(180-angle);
    this.progressArc .setBeta(angle);
};

Spherical.prototype.setArcAngle = function(angle) {
    this.progressArc.setAngle(-angle);
};

Spherical.prototype.setRotateAngle = function(angle) {
    this.rotateAngle = angle;
    this.setArcAngle(angle);
    this.anchor.rotation.y = degToRad(this.rotateAngle);
};

Spherical.prototype.getRotateAngle = function(angle) {
    return this.rotateAngle;
};


Spherical.prototype.updateMovement = function(step) {
    this.rotateAngle += this.step * step;
    this.setRotateAngle(this.rotateAngle);
};



Sunlight = function() {
    return new THREE.PointLight( 0xFFFFFF, 1, 0 );
}


sceneToSyl = function(pos) {
    return Vector.create([pos.x, pos.y, pos.z]);
}

//posSyl = function(node) {
//    return sceneToSyl(getNodePos(node));
//}

// store key/values of 3D nodes (planet,sun,poles etc.)
//nodePool = {};

// locate a specific node in world space
//getNodePos = function(name) {
//    var node = nodePool[name];
//    if(!node) return {x:0,y:0,z:0};
//    return node.currentPos();
//}

// locate a specific node on canvas (preseve z value of projection)
//getNodePosCanvas = function(name) {
//    var node = nodePool[name];
//    if(!node) return {x:0,y:0,z:0};
//
//    var posTmp = node.currentPos();
//
//    var canvas = app.canvas.domElement;
//    app.camera.matrixWorldInverse.multiplyVector3( posTmp );
//    var zTmp = -posTmp.z;
//
//    app.camera.projectionMatrix.multiplyVector3( posTmp );
//    pos = {x: (posTmp.x+1) * canvas.width/2, y: (-posTmp.y+1) * canvas.height/2, z: zTmp };

    //if node is outside of canvas shift pos to z=-1 
//    if (pos.x<0 || pos.x>canvas.width-50) pos.z = -1.0;
//    if (pos.y<0 || pos.y>canvas.height-20) pos.z = -1.0;

//  return pos;
//}
