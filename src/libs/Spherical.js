
/**
 * the cosmological spheres
 * Tree structure of elements<br>
 *    root<br>
 *      *-> northArc                - upper arc from north pole to equator
 *      *-> southArc                - lower arc from south pole to equator
 *      *-> anchor
 *              *-> equator         - equator circle
 *              *-> disc            - equator disc
 *              *-> centerLine      - line in disc / apsidal visualization
 *              *-> npole           - north pole
 *              *-> spole           - south pole
 *              *-> rotationarc     - progress of rotation arc
 *              *-> markerBall      - ball at end of markerArc
 *              *-> markerArc       - line from progress to markerBall
 *              *
 *              *-> NEXT SPHERICAL
 *                
 * @constructor
 */
Spherical = function(params) {
    THREE.Object3D.call( this );

    this.eulerOrder = "ZYX"; // revert rotate order
    this.visUpdate = true;
    this.moving = true;
    this.inner_id = params.inner_id;
    this.axisAngle = params.axisAngle || 0.0;
    this.rotateAngle = params.rotateStart || 0.0;
    this.rotateStart = params.rotateStart || 0.0;
    this.speed = params.speed || 0.0;
    var trails = (Ori.gfxProfile.shading>=Ori.Q.MEDIUM) ? true : false;
    
    this.gfx = new Object();
    this.gfx.scale = params.scale;
    this.gfx.color = params.color || { r: 0.5, g: 0.5, b: 0.5};

 
    this.anchor = new Node();
    this.addNode(this.anchor);

    this.material = new THREE.LineBasicMaterial( {
        opacity:  (Ori.gfxProfile.alpha) ? 0.5 : 1.0,
        color: rgbToHex(this.gfx.color) });

    this.arcangle21 = new Circle({ angle : this.axisAngle });
    this.gfx.northArc = this.northArc = new THREE.Line(this.arcangle21, this.material ); //Arc
    this.gfx.northArc.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.addNode(this.gfx.northArc);

    this.gfx.southArc = new THREE.Line(this.arcangle21, this.material ); //Arc
    this.gfx.southArc.scale  = new THREE.Vector3( -params.scale, -params.scale, -params.scale );
    this.addNode(this.gfx.southArc);

//    var materialArc = new THREE.LineBasicMaterial( { color: rgbToHex(this.gfx.color) });
    eqMat = new THREE.LineBasicMaterial( {
        opacity: (Ori.gfxProfile.alpha) ? 0.5 : 1.0,
        color: rgbToHex(this.gfx.color) } );

    if(params.vortex) {
      var map = (Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? THREE.ImageUtils.loadTexture(config.rampTexture) : undefined;
      this.gfx.equator = new Disc( {opacity:0.3, 
       map: map,
       radius: 0.85, innerRadius: 1.0, color: this.gfx.color });
    } else {
//     var equator = new Circle({angle:359.9});
     this.gfx.equator =  new THREE.Line(equator, eqMat );      
     this.gfx.equator.rotation.x = Math.PI/2;
    }

    this.gfx.equator.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.anchor.addNode(this.gfx.equator);

    this.markerArc = new Circle({ angle : 90 });
    this.gfx.markerarc = new THREE.Line(this.markerArc, this.material );
    this.gfx.markerarc.scale  = new THREE.Vector3( -params.scale, params.scale, params.scale );
    this.gfx.markerarc.rotation.y = Math.PI/2;
    this.anchor.addNode(this.gfx.markerarc);

    // set materials    
    var materialBall = new THREE.MeshBasicMaterial( { transparent:true, opacity: 1.0, color: rgbToHex(this.gfx.color) } );
    var materialCone = new THREE.MeshBasicMaterial( { opacity: 1.0, color: "0xFFFFFF" } );
   

    this.gfx.markerball =  new THREE.Mesh(geometryBall, materialCone);
//    this.gfx.markerend =  new THREE.Mesh(markerend, materialCone);
    this.gfx.markerball.position.z = params.scale;
//    this.gfx.markerball.position.x = -0.2;
    this.gfx.markerball.rotation.y = -Math.PI/2;
//    this.gfx.markerend.position.z = params.scale;
//    this.gfx.markerend.rotation.y = -Math.PI/2;
      this.anchor.addNode(this.gfx.markerball);
//    this.addNode(this.gfx.markerend);
    
    
//    this.gfx.sphere = new THREE.Mesh(planetGeo, materialBall);
//    this.gfx.sphere.flipSided = true;
//    this.gfx.sphere.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
//    this.addNode(this.gfx.sphere);
    
    this.gfx.npole = new THREE.Mesh(geometryBall, materialBall);
    this.gfx.spole = new THREE.Mesh(geometryBall, materialBall);
    this.gfx.npole.position.y = params.scale;
    this.gfx.spole.position.y = -params.scale;

    this.anchor.addNode(this.gfx.npole);
    this.anchor.addNode(this.gfx.spole);

    
    this.progressArc = new Circle({ angle : 40, trails: trails });
    var progressMat = new THREE.LineBasicMaterial( {
        linewidth:6,
        color: rgbToHex(this.gfx.color),
        vertexColors : trails
        //        opacity: 1.0
                } );
//    progressMat.vertexColors = true;
    this.gfx.rotationarc = new THREE.Line( this.progressArc, progressMat );
    this.gfx.rotationarc.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.gfx.rotationarc.rotation.x = Math.PI/2;

//    if(Ori.gfxProfile.geomerty>=Ori.Q.MEDIUM)
      this.anchor.addNode(this.gfx.rotationarc);

    
    var centerL = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 1} ];
    this.gfx.centerLine = new Curve({trails: false, pos: centerL, color: this.gfx.color }); 
    this.gfx.centerLine.visible = false;
    this.anchor.addNode(this.gfx.centerLine);
    
    this.gfx.disc = new Disc( {opacity: 0.2, radius: 1.0, color: this.gfx.color });
    this.anchor.addNode(this.gfx.disc);
    
    this.setAxisAngle(this.axisAngle);
    this.setRotateAngle(this.rotateAngle);
    this.setSpeed(this.speed);
    this.setOffsetRotateAngle(0.0);
    this.setVisuals(["northArc","southArc","equator","npole","spole","rotationarc","markerball"]);
    

};

Spherical.prototype = new THREE.Object3D();
Spherical.prototype.constructor = Spherical;

Spherical.prototype.DEFAULT_VISUALS = ["disc","northArc","southArc","equator","npole","spole","rotationarc","markerball","markerarc"];

// set visible elements
Spherical.prototype.setVisuals = function(vis) {
  this.setGfx(this.DEFAULT_VISUALS, false); // reset all elements to invisible
  this.gfx.visuals = vis;
  this.setShow(this.getShow()); // only show the new selection
}

Spherical.prototype.setGfx = function(vis, state) {
    for (var i in vis) {
        this.gfx[vis[i]].setEnabled(state);
    }
};

Spherical.prototype.setShow = function(state) {
  this.visible = state;
  this.setGfx(this.gfx.visuals, state);
}
Spherical.prototype.getShow = function() {
  return this.visible;
}

Spherical.prototype.setMoving = function(state) {
  return this.moving = state;
}


Spherical.prototype.getMoving = function() {
  return this.moving;
}

Spherical.prototype.getPlane = function() {

    var center = sceneToSyl(this.anchor.currentPos()),
    polePos = sceneToSyl(this.gfx.npole.currentPos()),
    upVec = center.subtract(polePos),
    plane = Plane.create(center, upVec.toUnitVector());
    return plane;
}




Spherical.prototype.setAxisAngle = function(angle) {
    this.axisAngle = angle;
    this.rotation.z = this.axisAngle/PI_SCALE;
    this.arcangle21.setAngle(angle);

};

Spherical.prototype.getAxisAngle = function() {
    return this.axisAngle;
};

Spherical.prototype.reset = function() {
  this.setRotateAngle(this.getRotateStart());
};

Spherical.prototype.setRotateStart = function(val) {
    this.rotateStart = val;
};

Spherical.prototype.getRotateStart = function() {
    return this.rotateStart;
};

Spherical.prototype.setScale = function(value) {
  this.gfx.scale = value;
  this.gfx.equator.scale  = new THREE.Vector3( value, value, value );
  this.gfx.disc.scale = new THREE.Vector3( value, 0, value );
  this.gfx.centerLine.scale = new THREE.Vector3( value, value, value );
  this.gfx.northArc.scale  = new THREE.Vector3( value, value, value );
  this.gfx.southArc.scale  = new THREE.Vector3( -value, -value, -value );
  this.gfx.npole.position.y = value;
  this.gfx.spole.position.y = -value;
//  this.gfx.sphere.scale = new THREE.Vector3( value, value, value );
  this.gfx.rotationarc.scale  = new THREE.Vector3( value, value, value);
  this.gfx.markerarc.scale  = new THREE.Vector3( -value, value, value );
  this.gfx.markerball.position.z = value;
//  this.gfx.markerend.position.z = value;

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
    this.speed = 360.0 / this.step;
};

Spherical.prototype.getStep = function() {
    return this.step;
};


Spherical.prototype.setArcBeta = function(angle) {
    this.markerArc.setAngle(180-angle);
    this.progressArc.setBeta(angle);
};

Spherical.prototype.updateArcAngle = function() {

/*    
    if(angle > 0) {
     this.gfx.markerball.scale.z = 1.0;
//     this.gfx.markerball.position.x = -0.2;
    }
    else {
     this.gfx.markerball.scale.z = -1.0;
//     this.gfx.markerball.position.x = 0.2;
     }
*/    
    // update progress angle
//    if(this.gfx.equator.getEnabled()) this.equator.setAngle(360-angle);
    if(this.visUpdate && this.gfx.rotationarc.getEnabled()) this.progressArc.setAngle(-this.rotateAngle);
};

Spherical.prototype.setRotateAngle = function(angle) {
    this.rotateAngle = angle;
    this.anchor.rotation.y = this.rotateAngle/PI_SCALE;
    this.updateArcAngle();
};

Spherical.prototype.getRotateAngle = function() {
    return this.rotateAngle;
};

Spherical.prototype.updateMovement = function(step) {
    this.rotateAngle += this.step * step;
    if(this.moving) this.setRotateAngle(this.rotateAngle);
};

Spherical.prototype.setOffsetRotateAngle = function(angle) {
    this.offsetRotateAngle = angle;
    this.rotation.y = this.offsetRotateAngle/PI_SCALE;
};

Spherical.prototype.getOffsetRotateAngle = function() {
    return this.offsetRotateAngle;
};

Spherical.prototype.setOffsetRotateSpeed = function(value) {
      this.offsetRotateSpeed = value;
      this.offsetRotateStep = (value != 0) ? value/(365.25*100) : 0.0;
};
      
Spherical.prototype.getOffsetRotateSpeed = function() {
      return this.offsetRotateSpeed;
};

Spherical.prototype.updateOffsetRotateMovement = function(step) { 
      this.setOffsetRotateAngle( this.getOffsetRotateAngle() + (this.offsetRotateStep * step) );
};

