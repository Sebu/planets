
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
 *              *-> NEXT SPHERICAL or PLANET
 *                
 * @constructor
 */
Spherical = function(params) {
    THREE.Object3D.call( this );

    this.eulerOrder = "ZYX"; // revert rotate order
    this.visUpdate = true;

    this.inner_id = params.inner_id;
    this.anchor = new Node();
    this.gfx = new Object();
    
    
    this.gfx.trails = (Ori.gfxProfile.shading>=Ori.Q.MEDIUM) ? true : false;
    this.gfx.color = params.color || { r: 0.5, g: 0.5, b: 0.5};
    this.gfx.vortex = params.vortex;
    
    // set materials   
    this.gfx.materialBall = new THREE.MeshBasicMaterial( { transparent:true, opacity: 1.0, color: rgbToHex(this.gfx.color) } );
    this.gfx.materialCone = new THREE.MeshBasicMaterial( { opacity: 1.0, color: "0xFFFFFF" } );
    this.gfx.poleMaterial = new THREE.LineBasicMaterial({
        opacity:  (Ori.gfxProfile.alpha) ? 0.5 : 1.0,
       linewidth: 2,
        color: rgbToHex(this.gfx.color) });
    this.gfx.progressMat = new THREE.LineBasicMaterial( {
        linewidth:6,
        color: rgbToHex(this.gfx.color),
        vertexColors : this.gfx.trails });


    //CREATE GFX ELEMETS
            
    this.gfx.poleCircle = new Circle({ angle : this.axisAngle });
    this.gfx.northArc  = new THREE.Line(this.gfx.poleCircle, this.gfx.poleMaterial );
    this.gfx.southArc = new THREE.Line(this.gfx.poleCircle, this.gfx.poleMaterial ); 


    if(this.gfx.vortex) {
        this.gfx.rampMap = (Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? THREE.ImageUtils.loadTexture(config.rampTexture) : undefined;
        this.gfx.equator = new Disc( {opacity:0.3, 
            map: this.gfx.rampMap,
            radius: 0.85, innerRadius: 1.0, color: this.gfx.color });
    } else {
        this.gfx.equator =  new THREE.Line(equator, this.gfx.poleMaterial );      
        this.gfx.equator.rotation.x = Math.PI/2;
    }
    var centerL = [ {x: 0,y: 0,z: 0}, {x: 0, y: 0,z: 1} ];
    this.gfx.centerLine = new Curve({trails: false, pos: centerL, color: this.gfx.color }); 
    this.gfx.centerLine.visible = false;
    
    this.gfx.disc = new Disc( {opacity: 0.2, radius: 1.0, color: this.gfx.color });
        

    this.gfx.npole = new THREE.Mesh(geometryBall, this.gfx.materialBall);
    this.gfx.spole = new THREE.Mesh(geometryBall, this.gfx.materialBall);


    this.gfx.progressArc = new Circle({ angle : 40, trails: this.gfx.trails });
    this.gfx.rotationarc = new THREE.Line( this.gfx.progressArc, this.gfx.progressMat);
    this.gfx.rotationarc.rotation.x = Math.PI/2;
    
    this.gfx.markerArc = new Circle({ angle : 90 });
    this.gfx.markerarc = new THREE.Line(this.gfx.markerArc, this.gfx.poleMaterial );
    this.gfx.markerarc.rotation.y = Math.PI/2;

    this.gfx.markerball =  new THREE.Mesh(geometryBall, this.gfx.materialCone);
    this.gfx.markerball.rotation.y = -Math.PI/2;
    
    


    // connect all nodes
    this.addNode(this.gfx.northArc);
    this.addNode(this.gfx.southArc);
    this.addNode(this.anchor);
        this.anchor.addNode(this.gfx.equator);    
        this.anchor.addNode(this.gfx.centerLine);
        this.anchor.addNode(this.gfx.disc);
        this.anchor.addNode(this.gfx.npole);
        this.anchor.addNode(this.gfx.spole);      
        this.anchor.addNode(this.gfx.rotationarc);
        this.anchor.addNode(this.gfx.markerarc);
        this.anchor.addNode(this.gfx.markerball);    
    
    
    this.setVisuals(["northArc","southArc","equator","npole","spole","rotationarc","markerball"]);

    this.setScale(params.scale);
    this.setMoving(true);
    this.setAxisAngle(params.axisAngle || 0.0);
    this.setRotateStart(params.rotateStart || 0.0);    
    this.setRotateAngle(params.rotateStart || 0.0);
    this.setSpeed(params.speed || 0.0);
    this.setOffsetRotateAngle(0.0);
    
    

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
  this.moving = state;
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


Spherical.prototype.reset = function() {
  this.setRotateAngle(this.getRotateStart());
};

Spherical.prototype.setAxisAngle = function(angle) {
    this.axisAngle = angle;
    this.rotation.z = this.axisAngle/PI_SCALE;
    this.gfx.poleCircle.setAngle(angle);

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
    this.speed = 360.0 / this.step;
};

Spherical.prototype.getStep = function() {
    return this.step;
};


Spherical.prototype.setArcBeta = function(angle) {
    this.gfx.markerArc.setAngle(180-angle);
    this.gfx.progressArc.setBeta(angle);
};

Spherical.prototype.setRotateAngle = function(angle) {
    this.rotateAngle = angle;
    this.anchor.rotation.y = this.rotateAngle/PI_SCALE;

    if( this.visUpdate && this.gfx.rotationarc.getEnabled() ) 
        this.gfx.progressArc.setAngle(-this.rotateAngle);
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


Spherical.prototype.setScale = function(value) {
  this.gfx.scale = value;
  this.gfx.equator.scale  = new THREE.Vector3( value, value, value );
  this.gfx.disc.scale = new THREE.Vector3( value, 0, value );
  this.gfx.centerLine.scale = new THREE.Vector3( value, value, value );
  this.gfx.northArc.scale  = new THREE.Vector3( value, value, value );
  this.gfx.southArc.scale  = new THREE.Vector3( -value, -value, -value );
  this.gfx.npole.position.y = value;
  this.gfx.spole.position.y = -value;
  this.gfx.rotationarc.scale  = new THREE.Vector3( value, value, value);
  this.gfx.markerarc.scale  = new THREE.Vector3( -value, value, value );
  this.gfx.markerball.position.z = value;
};

