


Planet = function(params) {
  var emit = params.emit || 0.0;
  dist = params.dist;
  
  this.mesh = new THREE.Mesh(new Sphere( 1, 10, 10 ), new THREE.MeshBasicMaterial( { color: 0xe0e0e0 } ));
	this.mesh.position.z = - dist;
	this.mesh.scale = new THREE.Vector3( params.scale, params.scale, params.scale );
	

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
		this.mesh.position.z = dist;
};


	
Circle = function(params) {
	THREE.Geometry.call( this );
	
		this.setAxisAngle = function(angle) {
		 this.axisAngle = angle%360;
		};
		 
		 this.setAxisAngle(params.axisAngle);
//		 this.linewidth = params.width || 1;

		    var slices = Math.abs(Math.round(this.axisAngle/5));
        var arc = (this.axisAngle / 180.0) * Math.PI;
        var x=0,y=0,z=0;
        for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
            var theta = sliceNum * arc / slices;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

                x = sinTheta;
                y = cosTheta;
                z = 0.0; //sinTheta;
								this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
       
        }

       
	   
};


Circle.prototype = new THREE.Geometry();
Circle.prototype.constructor = Circle;

Spherical = function Spherical(params) {
        
    this._curve = null;
  	color = params.color || { r: 0.5, g: 0.5, b: 0.5};
  	this.visuals = [];
	  
		this.visuals["arc1"] = new THREE.Line(new Circle( params ), new THREE.LineBasicMaterial( { color: 0xe1e0e0 } ));
		this.visuals["arc1"].scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
//    this.addNode( 		  // arc
//   		this._visuals["arc1"] = SceneJS.scale( {x: params.scale, y: -params.scale, z: params.scale },
//	 				this.arcangle21 = new Circle({angle: params.angle})));


//    this.addNode( 		  // arc
//   		this._visuals["arc2"] = SceneJS.scale( {x: -params.scale, y: params.scale, z: params.scale },
//	 				this.arcangle22 = new Circle({angle: params.angle})));

//    this.addNode(

	 				
//	  this._zRotate = SceneJS.rotate({angle: 0.0, z: 1.0},



//   	this._yRotate = SceneJS.rotate({angle: 0.0, y: 1.0},
   	

//				this._anchor = SceneJS.material({
//		      baseColor:      color,
//          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
//          emit: 0.2, specular: 0.0, shine: 1.0 
//          },	
    	
		// equator marker ball
//    this._visuals["markerarc"] = SceneJS.rotate({angle: 90.0, y: 1.0},
//       		SceneJS.scale( {x: -params.scale, y: -params.scale, z: params.scale },
//	 				  new Circle({angle: 90.0}))),

//		this._visuals["markerball"]  = SceneJS.translate( {x: 0.0, y: 0.0, z: params.scale  }, 
//			SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
//				SceneJS.sphere() 
//			)
//		),
	    	  // northpole
//					this._visuals["npole"] = SceneJS.translate( {x: 0.0, y: params.scale, z: 0.0  }, 
//						SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
//							SceneJS.sphere() 
//						)
//					),
	    	  // southhpole
//					this._visuals["spole"] = SceneJS.translate( {x: 0.0, y: -params.scale, z: 0.0  }, 
//						SceneJS.scale( {x: 0.1, y: 0.1, z: 0.1 }, 
//							SceneJS.sphere() 
//						)
//					),
					// equator
//					this._visuals["equator"] = SceneJS.rotate({angle: 90.0, x: 1.0},
//				 		SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
//				 			new Circle({angle: 359})
//				 		)
//				 	)
//			 	)
//			)

//		)
//		);
    		
				// equator marker arc/angle			
//		this._anchor.addNode( 	this._visuals["rotationarc"] = SceneJS.rotate({angle: 90.0, x: 1.0},			
// 				SceneJS.scale( {x: params.scale, y: params.scale, z: params.scale },
//	 				this.arcangle11 = new Circle({width: 2, angle: 0})
//		)));	
		

    this.setAxis(params.axisAngle || 0.0);
    this.setRotateAngle(params.rotateStart || 0.0);
    this.setSpeed(params.speed);
       
        
};

Spherical.prototype.setVisuals = function(vis, state) {
    for(i in vis) {
      this.visuals[vis[i]].setEnabled(state);
    }
				
};

Spherical.prototype.setAxis = function(angle) {
		this.axisAngle = angle;
//		this.arcangle21.setAngle(angle);
//		this.arcangle22.setAngle(angle);
//		this._zRotate.setAngle(this._zAngle);
};

Spherical.prototype.getAxis = function() {
		return this.axisAngle;
};

Spherical.prototype.setSpeed = function(speed) {
		this.speed = speed;
		this.step = (speed!=0) ? (360.0/speed) : 0.0;
};

Spherical.prototype.setArcAngle = function(angle) {
//  this.arcangle11.setAngle(-angle);
};

Spherical.prototype.setRotateAngle = function(angle) {
		this.rotateAngle = angle;
		this.setArcAngle(angle);
//		this._yRotate.setAngle(this._yAngle);
};

Spherical.prototype.update = function(step) {
		this.rotateAngle += this.step*step;
		this.setRotateAngle(this.rotateAngle);
};



THREE.Camera.prototype.setAspect = function(fov, aspect, near, far) {
	this.projectionMatrix = THREE.Matrix4.makePerspective( fov, aspect, near, far );
};

Sunlight = function() {
	return new Object();
}
