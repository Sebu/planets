


nodePool = {};

THREE.Object3D.prototype.addNode = function(node) { this.addChild(node) };
THREE.Object3D.prototype.setBaseColor = function(params) { };
THREE.Object3D.prototype.setPos = function(pos) {
    this.position.set(pos.x, pos.y, pos.z);
}

THREE.Object3D.prototype.setEnabled = function(state) { this.visible = state; };
THREE.Object3D.prototype.getEnabled = function() { return this.visible; };

THREE.Object3D.prototype.currentMatrixWorld = function() {
    this.matrixAutoUpdate && this.updateMatrix();
    if(!this.parent) return this.matrix;
    this.matrixWorld.multiply(this.parent.currentMatrixWorld(), this.matrix);
    return this.matrixWorld;
}

THREE.Object3D.prototype.currentPos = function() {
    pos = this.currentMatrixWorld();
    return {x: pos.n14, y: pos.n24, z: pos.n34};
}

Node = THREE.Object3D;
Scale = THREE.Object3D;
Sphere = THREE.Object3D;

Material = function(params) { return new THREE.Object3D() };

degToRad = function(deg) {
    return (deg/180)*Math.PI;
}

rgbToHex = function(color) {
 return ~~ ( color.r * 255 ) << 16 ^ ~~ ( color.g * 255 ) << 8 ^ ~~ ( color.b * 255 );
}

THREE.Camera.prototype.setAspect = function(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
};


THREE.Camera.prototype.rotateTarget = function(target) {

    dx = target.x - this._lookX;
    dy = target.y - this._lookY;
    dz = target.z - this._lookZ;
    dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // move position
    this.position.x += dx;
    this.position.y += dy;
    this.position.z += dz;
    this.translateNew(0.0, 0.0, -dist);

    this.updateNew();
}

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
}

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
    m = Matrix.Rotation(angle, axis);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.up);
    this.updateNew();
}


THREE.Camera.prototype.rotateX = function(angle) {
    m = Matrix.Rotation(angle, $V([1,0,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}

THREE.Camera.prototype.rotateY = function(angle) {
    m = Matrix.Rotation(angle, $V([0,1,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}


THREE.Camera.prototype.rotateRight = function(angle) {
    m = Matrix.Rotation(angle, this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}

THREE.Camera.prototype.rotateUp = function(angle) {
    m = Matrix.Rotation(angle, this.upVec);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.updateNew();
}

THREE.Camera.prototype.setFov = function(fov) {
  this.fov = fov;
  this.updateProjectionMatrix();
}

THREE.Camera.prototype.getFov = function() {
  return this.fov;
}

var App = function(params) {

    this.init = function(params) {
      this.domRoot = params.domRoot;

      //TODO: move to input and camera
//      this.lastX = 0;
//      this.lastY = 0;

      this.currentScene = null;
      this.scenes = [];
        
      this.graphics = new Ori.Canvas();
      this.graphics.setSize(window.innerWidth, window.innerHeight);
      Ori.input.trackMouseOn(this.graphics.domElement);
    
      if(this.graphics.type) {
          this.domRoot.innerHTML = "";
          this.domRoot.append(this.graphics.domElement);
      }

      Ori.input.register(Ori.KEY.A, "LEFT");
      Ori.input.register(Ori.KEY.D, "RIGHT");
      Ori.input.register(Ori.KEY.S, "DOWN");
      Ori.input.register(Ori.KEY.W, "UP");
      
      // TODO : shorten
      this.camera = new THREE.Camera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
      this.camera.init({ eye : { x: 0.0, y: 0.0, z: -17 } });
      this.camera.rotateY(Math.PI+0.1);
    }

    this.init(params);

    this.newScene = function() {
        scene = new THREE.Scene();
//        scene.fog = new THREE.Fog(0x353535, 15.0, 20.0 );
        scene.addLight(new THREE.AmbientLight(0xFFFFFF));
        this.scenes.push(scene);
        return scene;
    }

    this.setCurrentScene = function(scene) {

        //this.currentScene.enabled = false;
        this.currentScene = scene;
        this.currentScene.enabled = true;
        this.components = [];
        this.components.push(this.currentScene);
    }

    this.update = function() {

        if(Ori.input.isDown("LEFT")) this.camera.translateNew(0.6, 0, 0);
        if(Ori.input.isDown("RIGHT")) this.camera.translateNew(-0.6, 0, 0);
        if(Ori.input.isDown("DOWN")) this.camera.translateNew(0, 0, -0.6);
        if(Ori.input.isDown("UP")) this.camera.translateNew(0, 0, 0.6);

        if(Ori.input.mouse.wheel) this.camera.translateNew(0.0, 0.0, Ori.input.mouse.z);
        if (Ori.input.mouse.b1) {
            x = Ori.input.mouse.x;
            y = Ori.input.mouse.y;
            pitch = (y - Ori.input.drag.y) * 0.005;

            yaw = (x - Ori.input.drag.x) * -0.005;
            if (model.currentPos == "Earth") {
                this.camera.rotateY(yaw);
            } else {
                this.camera.rotateUp(yaw);
            }

            this.camera.rotateRight(pitch);
            
            Ori.input.drag.x = x;
            Ori.input.drag.y = y;
        }        
        Ori.input.update();
    }


    // general
    this.draw = function() {
        this.graphics.clear();
        for(i in this.components) {
            component = this.components[i];
            if(component.enabled) this.graphics.render( component, this.camera );

        }
    }

    this.resize = function() {
        width = window.innerWidth;
        height = window.innerHeight;
        this.camera.setAspect(width/height);
        this.graphics.setSize(width, height);
    }

}


Disc = function(params) {
  THREE.Mesh.call(this, new THREE.Sphere(params.radius,20,30), new THREE.MeshLambertMaterial({color: 0x4444FF, shading: THREE.FlatShading}) );
  this.scale.y = 0.01;
  this.overdraw = true;
}

Disc.prototype = new THREE.Mesh;
Disc.prototype.constructor = Disc;



Translate = function(params) {
  THREE.Object3D.call( this );
  this.position.x = params.x || 0.0;
  this.position.y = params.y || 0.0;
  this.position.z = params.z || 0.0;
  nodePool[params.id] = this;
}

Translate.prototype = new THREE.Object3D;
Translate.prototype.constructor = Translate;

sphereGeo = [

                [ new THREE.Sphere( 1, 32, 16 ), 0 ],
                [ new THREE.Sphere( 1, 16, 8 ), 10 ],
                [ new THREE.Sphere( 1, 8, 4 ), 20 ]

];



Planet = function(params) {
    THREE.Object3D.call( this );

    var emit = params.emit || 0.0;
    this.dist = params.dist || 0.0;
    this.beta = params.betaRotate || 0.0;
    this._scale = params.scale;
    this.color = params.color || { r: 2.2, g: 2.2, b: 2.9 };  var emit = params.emit || 0.0;
    dist = params.dist;

    this.material =  new THREE.MeshLambertMaterial( { color: rgbToHex(this.color), shading: THREE.FlatShading });


    this.mesh = new THREE.LOD();

    for (i = 0; i < sphereGeo.length; i++ ) {
        				mesh = new THREE.Mesh( sphereGeo[ i ][ 0 ], this.material );
                        mesh.scale.set( params.scale, params.scale, params.scale );
        				mesh.updateMatrix();
						mesh.matrixAutoUpdate = false;
                        mesh.overdraw = true;
						this.mesh.add( mesh, sphereGeo[ i ][ 1 ] );
    }
//    new THREE.MeshBasicMaterial( { color: this.color } )
//    this.material =  new THREE.MeshPhongMaterial( { ambient: this.color, specular: 0x000000, color: 0x888888, shininess: 3, shading: THREE.SmoothShading });
//    this.mesh = new THREE.Mesh(new THREE.Sphere( params.scale, 10, 10 ), this.material);
//    this.mesh.overdraw = true;
    this.mesh.position.y = dist;
    this.addNode(this.mesh);

    this.rotation.x = degToRad(this.beta);

    nodePool[params.inner_id] = this.mesh;

};

Planet.prototype = new THREE.Object3D;
Planet.prototype.constructor = Planet;

Planet.prototype.setEnabled = function(state) { this.mesh.visible = state; }

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

    material = new THREE.LineBasicMaterial( { color: rgbToHex(params.color)  } );     
    material.vertexColors = true;

    THREE.Line.call(this, this.geo, material);
};

Curve.prototype = new THREE.Line;
Curve.prototype.constructor = Curve;



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

Cloud = function(params) {
    geo = new THREE.Geometry();
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



Spherical = function Spherical(params) {
    THREE.Object3D.call( this );

    this.inner_id = params.inner_id;

    color = params.color || { r: 0.5, g: 0.5, b: 0.5};
    color = rgbToHex(color);
    this.visuals = [];

    this.axisAngle = params.axisAngle || 0.0;
    this.rotateAngle = params.rotateStart || 0.0;
    this.rotateStart = params.rotateStart || 0.0;
    this.speed = params.speed;

    this.anchor = new Node();
    this.addNode(this.anchor);
    this.curve = new Node();
    this.anchor.addNode(this.curve);


    this.material = new THREE.LineBasicMaterial( {  color: color } );
    materialArc = this.material;

    this.arcangle21 = new Circle({ angle : this.axisAngle });
    this.visuals["arc1"] = this.arc1 = new THREE.Line(this.arcangle21, materialArc );
    this.visuals["arc1"].scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.addNode(this.visuals["arc1"]);

    this.visuals["arc2"] = new THREE.Line(this.arcangle21, materialArc );
    this.visuals["arc2"].scale  = new THREE.Vector3( -params.scale, -params.scale, -params.scale );
    this.addNode(this.visuals["arc2"]);

    materialArc = new THREE.LineBasicMaterial( {  color: color });
    this.visuals["equator"] = new THREE.Line(new Circle({ angle : 359.9 }), this.material );
    this.visuals["equator"].scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.visuals["equator"].rotation.x = Math.PI/2;
    this.anchor.addNode(this.visuals["equator"]);

    this.markerArc = new Circle({ angle : 90 });
    this.visuals["markerarc"] = new THREE.Line(this.markerArc, this.material );
    this.visuals["markerarc"].scale  = new THREE.Vector3( -params.scale, params.scale, params.scale );
    this.visuals["markerarc"].rotation.y = Math.PI/2;
    this.anchor.addNode(this.visuals["markerarc"]);

    geometryBall = new THREE.Sphere( 0.1, 10, 10 );
    geometryBall.overdraw = true;
    materialBall = new THREE.MeshBasicMaterial( { color: color } );

    this.visuals["markerball"] =  new THREE.Mesh(geometryBall, materialBall);
    this.visuals["npole"] = new THREE.Mesh(geometryBall, materialBall);
    this.visuals["spole"] = new THREE.Mesh(geometryBall, materialBall);
    this.visuals["markerball"].position.z = params.scale;
    this.visuals["npole"].position.y = params.scale;
    this.visuals["spole"].position.y = -params.scale;
    this.anchor.addNode(this.visuals["markerball"]);
    this.anchor.addNode(this.visuals["npole"]);
    this.anchor.addNode(this.visuals["spole"]);
    nodePool[this.inner_id] = this.visuals["markerball"];
    nodePool[this.inner_id+"npole"] = this.visuals["npole"];
    nodePool[this.inner_id+"spole"] = this.visuals["spole"];

    this.progressArc = new Circle({ angle : 40 });
    this.visuals["rotationarc"] = new THREE.Line( this.progressArc, new THREE.LineBasicMaterial( { linewidth:6, color: color  } ));
    this.visuals["rotationarc"].scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.visuals["rotationarc"].rotation.x = Math.PI/2;
    this.anchor.addNode(this.visuals["rotationarc"]);

    this.setAxisAngle(this.axisAngle);
    this.setRotateAngle(this.rotateAngle);
    this.setSpeed(this.speed);

};

Spherical.prototype = new THREE.Object3D;
Spherical.prototype.constructor = Spherical;

Spherical.prototype.getPlane = function() {
    plane = Plane.create(Vector.Zero(3), posSyl(this.inner_id+"npole").toUnitVector());
    return plane;
}

Spherical.prototype.setVisuals = function(vis, state) {
    for (i in vis) {
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

//sylToScene = function(pos) {
//    return {x: pos.elements[0], y: pos.elements[1], z: pos.elements[2]};
//}

sceneToSyl = function(pos) {
    return Vector.create([pos.x, pos.y, pos.z]);
}

posSyl = function(node) {
    return sceneToSyl(getNodePos(node));
}

getNodePos = function(name) {
    node = nodePool[name];
    if(!node) return {x:0,y:0,z:0};
    return node.currentPos();

}

getNodePosCanvas = function(name) {
    node = nodePool[name];
    if(!node) return {x:0,y:0,z:0};

    posTmp = node.currentPos();

    canvas = app.graphics.domElement;
    app.camera.matrixWorldInverse.multiplyVector3( posTmp );
    zTmp = -posTmp.z;

    app.camera.projectionMatrix.multiplyVector3( posTmp );
    pos = {x: (posTmp.x+1) * canvas.width/2, y: (-posTmp.y+1) * canvas.height/2, z: zTmp };


    if (pos.x<0 || pos.x>canvas.width-50) pos.z = -1.0;
    if (pos.y<0 || pos.y>canvas.height-20) pos.z = -1.0;

    return pos;
}
