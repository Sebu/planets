


PI_SCALE = 180.0/Math.PI;

/*
degToRad = function(deg) {
    return deg/PI_SCALE;
}

RadToDeg = function(rad) {
    return rad*PI_SCALE;
}
*/

calcAngle = function(pos1, pos2) {
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

calcAngleRel = function(node1, node2, center) {
    var pos1 = center.subtract( node1 ),
    pos2 = center.subtract( node2 );
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

rgbToHex = function(color) {
	 return ~~ ( color.r * 255 ) << 16 ^ ~~ ( color.g * 255 ) << 8 ^ ~~ ( color.b * 255 );
}

rgbToCSS = function(color) {
  var rgb = "rgb(" + Math.round(color.r * 255) + "," + Math.round(color.g * 255) + "," + Math.round(color.b * 255) + ")";
  return rgb;
};

// extend THREE.Object3D 
Node = THREE.Object3D;
THREE.Object3D.prototype.addNode = function(node) { this.addChild(node); };
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
/*
THREE.Object3D.prototype.currentPos = function() {
    var pos = this.currentMatrixWorld();
    if(!this.cPos) this.cPos = new THREE.Vector3();
    this.cPos.x = pos.n14;
    this.cPos.y = pos.n24;
    this.cPos.z = pos.n34;
    return {x:, y: ,z:;
}
//*/

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



THREE.DiscGeometry = function ( innerRadius, outerRadius, spread, segments ) {

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

THREE.DiscGeometry.prototype = new THREE.Geometry();
THREE.DiscGeometry.prototype.constructor = THREE.TorusGeometry;

// THREE.ImageUtils.loadTexture('textures/ramp.png')
// disc of planet surface 
Disc = function(params) {
  var color = params.color || colors["Earth"];
  inner = params.innerRadius || 0,
  specs =  {
              color: rgbToHex(color),
              transparent: true, 
              map: params.map,
              opacity: params.opacity || 1 
            };
  if(Ori.gfxProfile.shading>=Ori.Q.HIGH)
    this.material =  new THREE.MeshLambertMaterial(specs);  
  else 
     this.material =  new THREE.MeshBasicMaterial(specs);
      
  THREE.Mesh.call(  this, 
//                    new THREE.SphereGeometry(params.radius,20,30),
                    new THREE.DiscGeometry(inner, params.radius, 0, 60),  
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

/* sphere LOD
* @deprecated
*/
sphereGeo = [

                [ new THREE.SphereGeometry( 1, 32, 16 ), 0 ],
                [ new THREE.SphereGeometry( 1, 16, 8 ), 10 ],
                [ new THREE.SphereGeometry( 1, 8, 4 ), 20 ]

];

planetGeo = new THREE.SphereGeometry( 1 , 16, 12 );


/*
 * @constructor
 * provide dist(tance) from center, scale, color, and beta rotation
 */
Planet = function(params) {
    THREE.Object3D.call( this );

    //var emit = params.emit || 0.0;
    this.dist = params.dist || 0.0;
    this.beta = params.betaRotate || 0.0;

    
    this.gfx = new Object();
    this.gfx.scale = params.scale || 1.0;
    this.gfx.color = params.color || { r: 1.0, g: 1.0, b: 1.0 };  
    this.gfx.glow = params.glow || false;
    this.gfx.glowMap = params.glowMap;
    this.gfx.map = params.map;

    this.addNode( this.npole = new Translate({y:-1.0}) ); 
    this.reset();

    Ori.registerGfx(this);
    if(params.phong) 
      this.material =  new THREE.MeshPhongMaterial( {  
//        color: rgbToHex(this.gfx.color),
        ambient: 0x222222,
        map: this.gfx.map,
      });
    else 
      this.material =  new THREE.MeshBasicMaterial({ color: rgbToHex(this.gfx.color), map: this.gfx.map });



    var geo = new THREE.Geometry();
    var x = 0,y = 0,z = 0;
    geo.vertices.push( new THREE.Vertex( new THREE.Vector3( 0.0, 0.0, 0.0 ) ) );
    
    var map = (this.gfx.glowMap && Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? THREE.ImageUtils.loadTexture(this.gfx.glowMap) : undefined;
    var mat = new THREE.ParticleBasicMaterial({
            size: 2.3,
            map: map,
            blending: THREE.AdditiveBlending,
//            depthTest: false,              
            transparent: true
        });
    this.meshGlow = new THREE.ParticleSystem(geo, mat);

      this.setGlow(this.gfx.glow);
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
var PI2 = Math.PI * 2;
    				var program = function ( context ) {

					context.beginPath();
					context.arc( 0, 0, 1, 0, PI2, true );
					context.closePath();
					context.fill();

				}

    if (Ori.gfxProfile.geometry>=Ori.Q.MEDIUM)
      this.mesh = new THREE.Mesh(planetGeo, this.material);
    else
      this.mesh = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: rgbToHex(this.gfx.color), program: program } ) );
      
      
    this.mesh.scale.set( this.gfx.scale, this.gfx.scale, this.gfx.scale );
    this.mesh.cPos = new THREE.Vector3();
    this.mesh.overdraw = true;
    this.setDist(this.dist);
    this.mesh.rotation.z = Math.PI;
    this.mesh.rotation.y = Math.PI/2;
    this.addNode(this.mesh);
    this.addNode(this.meshGlow);

    //collision
    this.mesh.sc = new THREE.SphereCollider(this.mesh.cPos, this.gfx.scale);
    this.mesh.sc.mesh = this.mesh;
    THREE.Collisions.colliders.push(this.mesh.sc);

    this.rotation.x = this.beta/PI_SCALE;

    nodePool[params.inner_id] = this.mesh;

};

Planet.prototype = new THREE.Object3D;
Planet.prototype.constructor = Planet;

Planet.prototype.setEnabled = function(state) { this.mesh.visible = state; if(this.gfx.glow) this.meshGlow.visible = state; }
Planet.prototype.getEnabled = function() { return this.mesh.visible; }

Planet.prototype.getBeta = function() { return this.beta; }
Planet.prototype.setBeta = function(angle) {
    this.beta = angle;
    this.rotation.x = this.beta/PI_SCALE;
};

Planet.prototype.getShade = function() { return this.gfx.shade; }
Planet.prototype.setShade = function(color) {
    this.gfx.shade = this.color;
    this.material.color.setHex(rgbToHex(color));
}

Planet.prototype.getDist = function() { return this.dist; }
Planet.prototype.setDist = function(dist) {
    this.dist = dist;
    this.mesh.position.y = this.dist;
    this.meshGlow.position.y = this.dist;
};

Planet.prototype.setGlow = function(state) {
  this.gfx.glow = state;
  this.meshGlow.visible = (Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? state : false;

};

Planet.prototype.setQuality = function(profile) {
//  if(profile.textures) console.log("textures");
}

Planet.prototype.reset = function() {
    this.sunAngle = 0;
    this.latitude = 0;
    this.longitude = 0;
    this.lastLongitude = 0;
    this.longitudeSpeed = 0;
    this.lastPerp = 0;

};


/*
 * @constructor
 * 
 */
Curve  = function(params) {

    this.trails = (params.trails==undefined) ? true : params.trails;

    this.setPos = function(pos) {
        this.gen(pos);
    };

    this.gen = function(pos) {
        this.curvePos = pos;
        this.geo.vertices = [];
        this.geo.colors = [];
        for (var i = 0, len=this.curvePos.length; i < len; i++) {
            this.geo.vertices.push( new THREE.Vertex( new THREE.Vector3( this.curvePos[i].x, this.curvePos[i].y, this.curvePos[i].z ) ) );
            if(this.trails) {
              var color = new THREE.Color( 0xFFFFFF );
              color.setHSV( 1.0, 0.0, 0.5 + 0.5 * (i / this.curvePos.length) );
              this.geo.colors.push( color );
            }
        }
        this.geo.__dirtyVertices = true;
    };

    this.geo = new THREE.Geometry();
    this.setPos(params.pos);

    var width = params.linewidth*Ori.gfxProfile.resolution || 2;
    var material = new THREE.LineBasicMaterial( { linewidth: width, color: rgbToHex(params.color)  } );     
    if(this.trails) material.vertexColors = true;

    THREE.Line.call(this, this.geo, material);
};

Curve.prototype = new THREE.Line;
Curve.prototype.constructor = Curve;


/*
 * @constructor
 */
Circle = function(params) {
    THREE.Geometry.call( this );

    this.trails = (params.trails==undefined) ? false : params.trails;
    
    this.setAngle(params.angle);
    this.setBeta(params.betaRotate || 90);

};

Circle.prototype = new THREE.Geometry;
Circle.prototype.constructor = Circle;

Circle.prototype.gen = function() {
    var slices = Ori.gfxProfile.circleRes,
    arc =  this.angle / PI_SCALE,
    beta = this.beta  / PI_SCALE,
    theta = 0,
    sinTheta = 0,    
    cosTheta = 0,
    cosPhi = Math.cos(beta),
    sinPhi = Math.sin(beta),
    x = 0,y = 0,z = cosPhi,
    sliceNum = 0;

    this.vertices = [];
    this.colors = [];
    
    for (sliceNum = 0; sliceNum <= slices; sliceNum++) {
        theta = sliceNum * arc / slices;
        sinTheta = Math.sin(theta);
        cosTheta = Math.cos(theta);

        x = sinTheta * sinPhi;
        y = cosTheta * sinPhi;

        this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
//        this.vertices.push( new THREE.Vertex( new THREE.Vector3( x*1.01, y*1.01, z ) ) );        
        if(this.trails) {
              var color = new THREE.Color( 0xFFFFFF );
              color.setHSV( 0.5, 0.0, 1.0 - 0.8 * (sliceNum / slices) );
              this.colors.push( color );
        }

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
        map: THREE.ImageUtils.loadTexture('textures/star.png'),  
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
};  

//var markerend = new THREE.CylinderGeometry( 10, 0.1, 0.1, 0.01);
//var cone = new THREE.CylinderGeometry( 10, 0.0001, 0.15, 0.4);
//THREE.LatheGeometry([new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 1, 0 )]);

var aLine = new THREE.Geometry();
aLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 1, 0 ) ) );
aLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) ) );
    


/*
 * @constructor
 * 
 */
Longituder = function() {
    THREE.Object3D.call( this );
    this.anchor = new THREE.Object3D();
    this.pivot = new THREE.Object3D();
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


    

Sunlight = function() {
    return new THREE.PointLight( 0xFFFFFF, 1, 0 );
}


sceneToSyl = function(pos) {
    return Vector.create([pos.x, pos.y, pos.z]);
}


// store key/values of 3D nodes (planet,sun,poles etc.)
nodePool = {};

// locate a specific node in world space
getNodePos = function(name) {
    var node = nodePool[name];
    if(!node) return {x:0,y:0,z:0};
    return node.currentPos();
}


