Camera = SceneJS.Camera;

Spherical = SceneJS.createNodeType("spherical");
Planet = SceneJS.createNodeType("planet");
Globe = SceneJS.createNodeType("globe");
Circle = SceneJS.createNodeType("circle", "geometry");
Curve = SceneJS.createNodeType("curve", "geometry");
Cloud = SceneJS.createNodeType("cloud", "geometry");


Planet.prototype._init = function(params) {
    var emit = params.emit || 0.0;
    this.dist = params.dist || 0.0;
    this.beta = params.betaRotate || 0.0;
    this.scale = params.scale;
    this.color = params.color || { r: 2.2, g: 2.2, b: 2.9 };
    this.addNode(
            this.betaRotate = SceneJS.rotate({angle: this.beta, x: 1.0},
                    this.distNode = SceneJS.translate({x: 0.0, y: this.dist, z: 0.0},
                            SceneJS.scale({ id: params.inner_id, x:this.scale, y: this.scale, z: this.scale },
                                    this._material = SceneJS.material({
                                        baseColor:  this.color,
                                        specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                        emit: emit, specular: 0.0, shine: 3.0},

                                        //    			new SceneJS.Texture({ layers: [ {  uri:"textures/earthmap1k.jpg" }] },
                                            SceneJS.sphere()
                                        //)

                                            )
                                    )
                            )
                    )
            );

};

Planet.prototype.setBeta = function(angle) {
    this.beta = angle;
    this.betaRotate.setAngle(this.beta);
};

Planet.prototype.setShade = function(color) {
    this._material.setBaseColor(color);
    //  state ? this._material.setBaseColor({r: 1.0, g: 1.0, b:1.0}) : this._material.setBaseColor({r: 0.0, g: 0.0, b:0.0});
}

Planet.prototype.setDist = function(dist) {
    this.dist = dist;
    this.distNode.setY(dist);
}


Curve.prototype._init = function(params) {
    var curvePos = params.pos;

    this._destroy = function() {
        SceneJS._geometryModule.extDestroyGeometry(this._handle);
    };

    this._create = function() {
        var positions = [];
        var colors = [];
        for (var i = 0; i < curvePos.length; i++) {
            positions.push(curvePos[i].x);
            positions.push(curvePos[i].y);
            positions.push(curvePos[i].z);
            colors.push(1.0);
            colors.push(0.4);
            colors.push(1.0);
        }
        var indices = [];
        for (var i = 0; i < curvePos.length; i++) {
            indices.push(i);
        }
        return {
            primitive : "line-strip",
            positions : positions,
            indices : indices
        };
    };

};


Circle.prototype.setAxisAngle = function(angle) {
    this.axisAngle = angle % 360;
}

Cloud.prototype._init = function(params) {
    this._count = params.count;


    this._create = function() {
        var positions = [];
        var indices = [];

        var x = 0,y = 0,z = 0;
        for (var sliceNum = 0; sliceNum < params.count; sliceNum++) {

            x = (Math.random() - 0.5); //*params.scale;
            y = (Math.random() - 0.5); //*params.scale;
            z = (Math.random() - 0.5); //*params.scale;

            norm = Math.sqrt(x * x + y * y + z * z) / 10.0;
            positions.push(x / norm);
            positions.push(y / norm);
            positions.push(z / norm);

            indices.push(sliceNum);

        }

        return {
            primitive : "points",
            positions : positions,
            indices : indices
        };
    };

};




Circle.prototype.setAngle = function(angle) {
    this.angle = angle % 360;
}

Circle.prototype.setBeta = function(angle) {
    this.beta = angle % 360;
}

Circle.prototype._init = function(params) {
    this.setAngle(params.angle);
    this.setBeta(params.betaRotate || 90);

    this.linewidth = params.width || 1;

    this._create = function(angle) {
        var slices = Math.abs(Math.round(this.angle / 5));
        var positions = [];
        var colors = [];
        var arc = (this.angle / 180.0) * Math.PI;
        var beta = (this.beta / 180) * Math.PI;
        var cosPhi = Math.cos(beta);
        var sinPhi = Math.sin(beta);
        var x = 0,y = 0,z = 0.2,delta = 0;
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
            var theta = sliceNum * arc / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);


            x = sinTheta * sinPhi;
            y = cosTheta * sinPhi;
            z = cosPhi; //0.2; //sinTheta;

            if (this.linewidth != 1)
                if (sliceNum % 2)
                    delta = 0.01;
                else
                    delta = -0.01;

            if (sliceNum == 0) {
                positions.push(x);
                positions.push(y);
                positions.push(z - delta);
            }
            positions.push(x);
            positions.push(y);
            positions.push(z + delta);


        }

        positions.push(x);
        positions.push(y);
        positions.push(z - delta);


        var indices = [];
        for (var sliceNum = 0; sliceNum <= slices + 2; sliceNum++) {
            indices.push(sliceNum);
        }
        if (this.linewidth != 1)
            resource = "facearc" + Math.round(this.angle) + ":" + Math.round(this.beta);
        else
            resource = "linearc" + Math.round(this.angle) + ":" + Math.round(this.beta);

        return {
            resource: resource,
            primitive : (this.linewidth == 1) ? "line-strip" : "triangle-strip",
            positions : positions,
            colors : colors,
            indices : indices
        };
    };

};


Circle.prototype._render = function(traversalContext) {
    if (this.linewidth != 1)
        resource = "facearc" + Math.round(this.angle) + ":" + Math.round(this.beta);
    else
        resource = "linearc" + Math.round(this.angle) + ":" + Math.round(this.beta);
    this._handle = resource;
    if (this._handle) { // Was created before - test if not evicted since
        if (!SceneJS._geometryModule.testGeometryExists(this._handle)) {
            this._handle = null;
        }
    }
    if (!this._handle) { // Either not created yet or has been evicted
        if (this._create) { // Use callback to create
            this._handle = SceneJS._geometryModule.createGeometry(resource, this._create(this.angle));
        }
    }
    SceneJS._geometryModule.pushGeometry(this._handle, { solid: this._solid });
    this._renderNodes(traversalContext);
    SceneJS._geometryModule.popGeometry();

};


Spherical.prototype._init = function(params) {

    tmpNodes = this.removeNodes();
    color = params.color || { r: 0.5, g: 0.5, b: 0.5};
    this.visuals = [];

    this.axisAngle = params.axisAngle || 0.0;
    this.rotateAngle = params.rotateStart || 0.0;
    this.rotateStart = params.rotateStart || 0.0;
    this.speed = params.speed;

    this.addNode(// arc
            this.visuals["arc1"] = SceneJS.scale({x: params.scale, y: -params.scale, z: params.scale },
                    this.arcangle21 = new Circle({angle: this.axisAngle})));


    this.addNode(// arc
            this.visuals["arc2"] = SceneJS.scale({x: -params.scale, y: params.scale, z: params.scale },
                    this.arcangle22 = new Circle({angle: this.axisAngle})));

    this.addNode(


            this.axis = SceneJS.rotate({angle: 0.0, z: 1.0},


                    this.rotate = SceneJS.rotate({angle: 0.0, y: 1.0},


                            this.curve = SceneJS.material({
                                baseColor:      { r: 0.0, g: 0.0, b: 0.0 },
                                specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                emit: 1.0, specular: 0.0, shine: 1.0
                            }),

                            this.anchor = SceneJS.material({
                                baseColor:      color,
                                specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                emit: 1.0, specular: 0.0, shine: 1.0
                            },


                                    this.visuals["markerarc"] = SceneJS.rotate({angle: 90.0, y: 1.0},
                                            SceneJS.scale({x: -params.scale, y: params.scale, z: params.scale },
                                                   this.markerArc = new Circle({ angle: 90.0}))),

                                // equator marker ball
                                    this.visuals["markerball"] = SceneJS.translate({id:params.inner_id, x: 0.0, y: 0.0, z: params.scale  },
                                            SceneJS.scale({x: 0.1, y: 0.1, z: 0.1 },
                                                    SceneJS.sphere()
                                                    )
                                            ),
                                // northpole
                                    this.visuals["npole"] = SceneJS.translate({id:"" + params.inner_id +"pole",x: 0.0, y: params.scale, z: 0.0  },
                                            SceneJS.scale({x: 0.1, y: 0.1, z: 0.1 },
                                                    SceneJS.sphere()
                                                    )
                                            ),
                                // southhpole
                                    this.visuals["spole"] = SceneJS.translate({x: 0.0, y: -params.scale, z: 0.0  },
                                            SceneJS.scale({x: 0.1, y: 0.1, z: 0.1 },
                                                    SceneJS.sphere()
                                                    )
                                            ),
                                // equator
                                    this.visuals["equator"] = SceneJS.rotate({angle: 90.0, x: 1.0},
                                            SceneJS.scale({x: params.scale, y: params.scale, z: params.scale },
                                                    new Circle({angle: 359})
                                                    )
                                            )
                                    )
                            )

                    )
            );

    // equator marker arc/angle
    this.anchor.addNode(this.visuals["rotationarc"] = SceneJS.rotate({angle: 90.0, x: 1.0},
            SceneJS.scale({x: params.scale, y: params.scale, z: params.scale },
                    this.arcangle11 = new Circle({width: 2, angle: 0})
                    )));

    this.anchor.addNodes(tmpNodes);

    this.setAxisAngle(this.axisAngle);
    this.setRotateAngle(this.rotateAngle);
    this.setSpeed(this.speed);


};

Spherical.prototype.getPlane = function() {
  return Plane.create(Vector.Zero(3), posSyl("S1pole").toUnitVector());
}

Spherical.prototype.setVisuals = function(vis, state) {
    for (i in vis) {
        this.visuals[vis[i]].setEnabled(state);
    }

};
Spherical.prototype.setAxisAngle = function(angle) {
    this.axisAngle = angle;
    this.axis.setAngle(this.axisAngle);
    this.arcangle21.setAngle(angle);
    this.arcangle22.setAngle(angle);
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
    this.arcangle11.setBeta(angle);
};

Spherical.prototype.setArcAngle = function(angle) {
    this.arcangle11.setAngle(-angle);
};

Spherical.prototype.setRotateAngle = function(angle) {
    this.rotateAngle = angle;
    this.setArcAngle(angle);
    this.rotate.setAngle(this.rotateAngle);
};

Spherical.prototype.getRotateAngle = function(angle) {
    return this.rotateAngle;
};


Spherical.prototype.update = function(step) {
    this.rotateAngle += this.step * step;
    this.setRotateAngle(this.rotateAngle);
};

function distance(from, to) {
    dx = from.x - to.x;
    dy = from.y - to.y;
    dz = from.z - to.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

SceneJS.LookAt.prototype.rotateTarget = function(target) {

    dx = target.x - this._lookX;
    dy = target.y - this._lookY;
    dz = target.z - this._lookZ;
    dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // move position
    this._eyeX += dx;
    this._eyeY += dy;
    this._eyeZ += dz;
    this.translate(0.0, 0.0, -dist);

    this.update();
    this._setDirty();
}

SceneJS.LookAt.prototype.setTarget = function(target) {

    this.dir.elements[0] = target.x - this._eyeX;
    this.dir.elements[1] = target.y - this._eyeY;
    this.dir.elements[2] = target.z - this._eyeZ;

    // TODO: fix degenerate :D
    this.dir = this.dir.toUnitVector();
    this.up = this.up.toUnitVector();
    this.right = this.up.cross(this.dir);

    this.update();
    this._setDirty();
}


SceneJS.LookAt.prototype._init = function(params) {
    this._mat = null;
    this._xform = null;

    this.up = Vector.create([0, 1, 0]);
    this.right = Vector.create([1,0,0]);
    this.dir = Vector.create([0,0,1]);
    this.setEye(params.eye);

    this.update();

};

SceneJS.LookAt.prototype.rotate = function(angle, axis) {
    m = Matrix.Rotation(angle, axis);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.up = m.multiply(this.up);
    this.update();
}


SceneJS.LookAt.prototype.rotateX = function(angle) {
    m = Matrix.Rotation(angle, $V([1,0,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.up = m.multiply(this.up);
    this.update();
}

SceneJS.LookAt.prototype.rotateY = function(angle) {
    m = Matrix.Rotation(angle, $V([0,1,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.up = m.multiply(this.up);
    this.update();
}


SceneJS.LookAt.prototype.rotateRight = function(angle) {
    m = Matrix.Rotation(angle, this.right);
    this.dir = m.multiply(this.dir);
    this.up = m.multiply(this.up);
    this.update();
}

SceneJS.LookAt.prototype.rotateUp = function(angle) {
    m = Matrix.Rotation(angle, this.up);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.update();
}

SceneJS.LookAt.prototype.update = function() {
    this.setLook({x: this._eyeX + this.dir.elements[0], y: this._eyeY + this.dir.elements[1], z: this._eyeZ + this.dir.elements[2]});
    this.setUp({x: this.up.elements[0], y: this.up.elements[1], z: this.up.elements[2]});
    this._setDirty();
}

SceneJS.LookAt.prototype.translate = function(x, y, z) {
    this._eyeX += this.dir.elements[0] * z;
    this._eyeY += this.dir.elements[1] * z;
    this._eyeZ += this.dir.elements[2] * z;
    this._eyeX += this.right.elements[0] * x;
    this._eyeY += this.right.elements[1] * x;
    this._eyeZ += this.right.elements[2] * x;
    this._lookX = this._eyeX + this.dir.elements[0];
    this._lookY = this._eyeY + this.dir.elements[1];
    this._lookZ = this._eyeZ + this.dir.elements[2];
    //	this._setDirty();
}



sylToScene = function(pos) {
 return {x: pos.elements[0], y: pos.elements[1], z: pos.elements[2]};
}

sceneToSyl = function(pos) {
 return Vector.create([pos.x, pos.y, pos.z]);
}

posSyl = function(node) {
  return sceneToSyl(getNodePos(node));
}


PI_SCALE = 180.0/Math.PI;


getAngle = function(node1, node2, center) {
	 	pos1 = center.subtract( node1 ); 
	 	pos2 = center.subtract( node2 );
	  return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

getNodePos = function(node) {
    query = new SceneJS.utils.query.QueryNodePos({ canvasWidth : 1, canvasHeight : 1    });
    query.execute({ nodeId: node });
    return query.getResults().worldPos;
}

getNodePosCanvas = function(node) {
    canvas = document.getElementById("glCanvas");

    query = new SceneJS.utils.query.QueryNodePos({ canvasWidth : canvas.width, canvasHeight : canvas.height    });
    query.execute({ nodeId: node });
    pos = query.getResults().canvasPos;
//    console.log(pos);
    return pos; //{x: pos.x+canvas.width*0.5, 
            //y: pos.y+canvas.height*0.5};
}

Sunlight = function() {
    return new SceneJS.Light({
        mode: "point",
        pos: { x: 0.0, y: 0.0, z: 0.0 }, // Position
        color: { r: 1.0, g: 1.0, b: 1.0 },
        diffuse: true,   // Contribute to diffuse lighting
        specular: true  // Contribute to specular lighting
    })
}
