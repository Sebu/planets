PI_SCALE = 180.0/Math.PI;


calcAngle = function(pos1, pos2) {
    return	Math.acos( pos1.toUnitVector().dot(pos2.toUnitVector()) )*PI_SCALE;
}

calcAngleRel = function(node1, node2, center) {
    var pos1 = center.substract( node1 ),
    pos2 = center.substract( node2 );
    return	Math.acos( pos1.toUnitVector.dot(pos2.toUnitVector()) )*PI_SCALE;
}

rgbToHex = function(color) {
	 return ~~ ( color.r * 255 ) << 16 ^ ~~ ( color.g * 255 ) << 8 ^ ~~ ( color.b * 255 );
}

rgbToCSS = function(color) {
  var rgb = "rgb(" + Math.round(color.r * 255) + "," + Math.round(color.g * 255) + "," + Math.round(color.b * 255) + ")";
  return rgb;
};



// extend THREE.Vector4 into Plane

THREE.Vector4.prototype.createPlane = function() {
};

THREE.Vector4.prototype.pointOnPlane = function(v) {
    var dot = dot( plane, sub(v,plane*plane.w) );
    return sub(v, plane * dot );
};

/*
  // Returns the point in the plane closest to the given point
  pointClosestTo: function(point) {
    var P = point.elements || point;
    var A = this.anchor.elements, N = this.normal.elements;
    var dot = (A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2];
    return Vector.create([P[0] + N[0] * dot, P[1] + N[1] * dot, (P[2] || 0) + N[2] * dot]);
  },
*/


// extend THREE.Object3D 
Node = THREE.Object3D;
THREE.Object3D.prototype.addNode = function(node) { this.add(node); };
THREE.Object3D.prototype.setPos = function(pos) { this.position.set(pos.x, pos.y, pos.z); }
THREE.Object3D.prototype.setEnabled = function(state) { this.visible = state; };
THREE.Object3D.prototype.getEnabled = function() { return this.visible; };


// fast update of current world matrix
THREE.Object3D.prototype.currentMatrixWorldTill = function(end) {
    this.matrixAutoUpdate && this.updateMatrix();
    if(!this.parent || this == end) return this.matrix;
    this.matrixWorld.multiply(this.parent.currentMatrixWorldTill(end), this.matrix);
    return this.matrixWorld;
}

// determine current position in world space
THREE.Object3D.prototype.currentPosTill = function(end) {
    var pos = this.currentMatrixWorldTill(end);
    if(!this.cPos) this.cPos = new THREE.Vector3();
    this.cPos.x = pos.n14;
    this.cPos.y = pos.n24;
    this.cPos.z = pos.n34;
    return this.cPos;
}

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
    if(!this.cPos) this.cPos = new THREE.Vector3();
    this.cPos.x = pos.n14;
    this.cPos.y = pos.n24;
    this.cPos.z = pos.n34;
    return this.cPos;
}


// determine current position in world space FAST
THREE.Object3D.prototype.currentPosFast = function() {
    var pos = this.matrixWorld;
    if(!this.cPos) this.cPos = new THREE.Vector3();
    this.cPos.x = pos.n14;
    this.cPos.y = pos.n24;
    this.cPos.z = pos.n34;
    return this.cPos;
}

THREE.Object3D.prototype.getPosCanvas = function(camera, canvas) {
    if (!this.getEnabled()) return {x:0, y:0, z:-1};
    
    var posTmp = this.currentPosFast();

    camera.matrixWorldInverse.multiplyVector3( posTmp );
    var zTmp = -posTmp.z;
    camera.projectionMatrix.multiplyVector3( posTmp );
    
    pos = {x: (posTmp.x+1) * canvas.domElement.width/2, y: (-posTmp.y+1) * canvas.domElement.height/2, z: zTmp };

    //if node is outside of canvas shift pos to z=-1 
    if (pos.x<0 || pos.x>canvas.domElement.width-50) pos.z = -1.0;
    if (pos.y<0 || pos.y>canvas.domElement.height-20) pos.z = -1.0;

    return pos;
}



DiscGeometry = function ( innerRadius, outerRadius, spread, segments ) {

	THREE.Geometry.call( this );

	var scope = this;

	this.innerRadius = innerRadius || 0;
	this.outerRadius = outerRadius || 100;
	this.spread =  spread || 0;	
	this.segments = segments || 8;

	var temp_uv = [];

	for ( var j = 0; j <= this.segments; ++j ) {

			var v = j / this.segments * 2 * Math.PI;
			var x1 = (this.innerRadius)*Math.cos(v)*Math.cos( this.spread/2 );
			var y1 = (this.innerRadius)*Math.sin(v)*Math.cos( this.spread/2 );
 	  	var x2 = (this.outerRadius)*Math.cos(v);
			var y2 = (this.outerRadius)*Math.sin(v);

			var z1 = (this.innerRadius)*Math.sin( this.spread/2 );
			var z2 = -(this.innerRadius)*Math.sin( this.spread/2 );

			vert( x1, z1, y1 );
			vert( x2, 0, y2 );			
			vert( x1, z2, y1 );
			
	}


	for ( var j = 1; j <= this.segments; ++j ) {

			var a = 3*j;
			var a2 = 3*j + 2;

			var b = 3*j + 1;
			var c = 3*(j - 1) + 1;
			var d = 3*(j - 1);
			var d2 = 3*(j - 1) + 2;			

			f4( a, b, c, d );
//			f4( d2, c, b, a2 );			

//*
      var unit = (1/this.segments);
			this.faceVertexUvs[ 0 ].push( [new THREE.UV(unit*(j), 1 ),
							new THREE.UV( unit*(j), 0 ),
							new THREE.UV( unit*(j-1), 0 ),
							new THREE.UV( unit*(j-1), 1 )
							] );
//*/
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function vert( x, y, z ) {
  		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
	};

	function f4( a, b, c, d ) {
  		scope.faces.push( new THREE.Face4( a, b, c, d ) );
	};

};

DiscGeometry.prototype = new THREE.Geometry();
DiscGeometry.prototype.constructor = DiscGeometry; //THREE.TorusGeometry;

// THREE.ImageUtils.loadTexture('textures/ramp.png')
// disc of planet surface 
Disc = function(params) {
  var color = params.color || colors["Earth"];
  inner = params.innerRadius || 0,
  materialSpecs =  {
              color: rgbToHex(color),
              transparent: true, 
              map: params.map,
              opacity: params.opacity || 1 
            };
  if(Ori.gfxProfile.shading>=Ori.Q.HIGH)
    this.material =  new THREE.MeshBasicMaterial(materialSpecs); //new THREE.MeshMaterial(specs);  
  else 
     this.material =  new THREE.MeshBasicMaterial(materialSpecs);
      
  THREE.Mesh.call(  this, 
//                    new THREE.SphereGeometry(params.radius,20,30),
                    new DiscGeometry(inner, params.radius, 0, 60),  
                    this.material );
//  this.scale.y = 0.01;
//  this.overdraw = true;
  this.doubleSided = true;
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




/*
 * @constructor
 * point cloud
 */
Cloud = function(params) {
    var geo = new THREE.Geometry();
    var x = 0,y = 0,z = 0;
    geo.vertices.push( new THREE.Vertex( new THREE.Vector3( 0.0, 10.0, 0.0 ) ) );
    for (var sliceNum = 0; sliceNum < params.count; sliceNum++) {
       x = (Math.random() - 0.5);
       y = (Math.random() - 0.5);
       z = (Math.random() - 0.5);
       norm = Math.sqrt(x * x + y * y + z * z) / 10.0;
       geo.vertices.push( new THREE.Vertex( new THREE.Vector3( x / norm, y / norm, z / norm ) ) );
    }
//*
    var mat =  new THREE.ParticleBasicMaterial({size: 1.5, sizeAttenuation:false});
/*/
    var mat = new THREE.ParticleBasicMaterial({  size: 0.8,  
        map: THREE.ImageUtils.loadTexture('images/star.png'),  
        blending: THREE.AdditiveBlending, 
  //    depthTest: false, 
        transparent: true  });
//*/

    THREE.ParticleSystem.call( this, geo, mat);
};

Cloud.prototype = new THREE.ParticleSystem;
Cloud.prototype.constructor = Cloud;


function setupCommonGeomerty() {
    geometryBall = new THREE.SphereGeometry( 0.1, 2, 2 );
    equator = new Circle({ angle : 359.9 });
    aLine = new THREE.Geometry();
    aLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 1, 0 ) ) );
    aLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) ) );  
    /* sphere LOD
    * @deprecated
    */
    sphereGeo = [

                    [ new THREE.SphereGeometry( 1, 32, 16 ), 0 ],
                    [ new THREE.SphereGeometry( 1, 16, 8 ), 10 ],
                    [ new THREE.SphereGeometry( 1, 8, 4 ), 20 ]

    ];

    planetGeo = new THREE.SphereGeometry( 1 , 16, 12 );
};  


/*
 * @constructor
 */
Longituder = function() {
    THREE.Object3D.call( this );
    this.pivot = new Node();
    this.anchor = new Node();
    this.addNode(this.pivot);
    this.pivot.addNode(this.anchor);
    this.setInclination(0);
}

Longituder.prototype = new THREE.Object3D;
Longituder.prototype.constructor = Longituder;


Longituder.prototype.setInclination = function(angle) {
  this.inclination = angle;
  this.pivot.rotation.z = this.inclination/PI_SCALE;
};

Longituder.prototype.getInclination  = function() {
  return this.inclination;
};

Longituder.prototype.setApsidalAngle = function(angle) {
    this.apsidalAngle = angle;
    this.anchor.rotation.y = this.apsidalAngle/PI_SCALE;
};

Longituder.prototype.getApsidalAngle = function() {
    return this.apsidalAngle;
};

Longituder.prototype.setApsidalSpeed = function(value) {
      this.apsidalSpeed = value;
      this.apsidalStep = (value != 0) ? value/(365.25*100) : 0.0;
};
      
Longituder.prototype.getApsidalSpeed = function() {
      return this.apsidalSpeed;
};

Longituder.prototype.updateMovement = function(step) { 
      this.setApsidalAngle( this.getApsidalAngle() + (this.apsidalStep * step) );
};



sceneToSyl = function(pos) {
    return Vector.create([pos.x, pos.y, pos.z]);
}


// store key/values of 3D nodes (planet,sun,poles etc.)
//nodePool = {};

// locate a specific node in world space
/*
getNodePos = function(name) {
    var node = nodePool[name];
    if(!node) return {x:0,y:0,z:0};
    return node.currentPos();
}
//*/

