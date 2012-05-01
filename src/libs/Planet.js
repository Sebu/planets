
/**
 * @constructor
 * provide dist(tance) from center, scale, color, and beta rotation
 */
Planet = function(params) {
    THREE.Object3D.call( this );


    var 
    PI2 = Math.PI * 2,
    program = function ( context ) {
 	    	context.beginPath();
		  	context.arc( 0, 0, 1, 0, PI2, true );
		  	context.closePath();
		  	context.fill();
		}
  	

    this.gfx = new Object();
    
    
    this.gfx.scale = params.scale || 1.0;
    this.gfx.color = params.color || { r: 1.0, g: 1.0, b: 1.0 };  
    this.gfx.glowMap =  params.glowMap;
    this.gfx.map = params.map;
    this.gfx.usePhong = params.phong;

    if(this.gfx.usePhong) 
      this.gfx.material =  new THREE.MeshPhongMaterial( {  
//        color: rgbToHex(this.gfx.color),
        ambient: 0x222222,
        map: this.gfx.map,
      });
    else 
      this.gfx.material =  new THREE.MeshBasicMaterial({ color: rgbToHex(this.gfx.color), map: this.gfx.map });
      

    this.gfx.glowGeo = new THREE.Geometry();
    this.gfx.glowGeo.vertices.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
    
    var map = (this.gfx.glowMap && Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? THREE.ImageUtils.loadTexture(this.gfx.glowMap) : undefined;
    var mat = new THREE.ParticleBasicMaterial({
            size: 2.3,
            map: map,
            blending: THREE.AdditiveBlending,
//            depthTest: false,              
            transparent: true
        });
  


    if (Ori.gfxProfile.geometry>=Ori.Q.MEDIUM)
      this.gfx.mesh = new THREE.Mesh(planetGeo, this.gfx.material);
    else
      this.gfx.mesh = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: rgbToHex(this.gfx.color), program: program } ) );
    this.gfx.mesh.scale.set( this.gfx.scale, this.gfx.scale, this.gfx.scale );
    this.gfx.mesh.cPos = new THREE.Vector3();
    this.gfx.mesh.overdraw = true;
    this.gfx.mesh.rotation.z = Math.PI;
    this.gfx.mesh.rotation.y = Math.PI/2;
    
    
    this.gfx.meshGlow = new THREE.ParticleSystem(this.gfx.glowGeo, mat);
    this.setGlow(params.glow || false);
    
    this.gfx.npole = new Translate({y:-1.0}); 


    // connect visual elements
    this.addNode(this.gfx.mesh);
    this.addNode(this.gfx.meshGlow);
    this.addNode(this.gfx.npole);     
    

    this.reset();
    this.setBeta(params.betaRotate || 0.0);
    this.setDist(params.dist || 0.0);
};


Planet.prototype = new THREE.Object3D();
Planet.prototype.constructor = Planet;


Planet.prototype.getEnabled = function() { return this.gfx.mesh.visible; }
Planet.prototype.setEnabled = function(state) { 
    this.gfx.mesh.visible = state; 
    if(this.gfx.glow) 
        this.gfx.meshGlow.visible = state; 
};

Planet.prototype.getBeta = function() { return this.beta; }
Planet.prototype.setBeta = function(angle) {
    this.beta = angle;
    this.rotation.x = this.beta/PI_SCALE;
};

Planet.prototype.getShade = function() { return this.gfx.shade; }
Planet.prototype.setShade = function(color) {
    this.gfx.shade = color;
    this.gfx.material.color.setHex(rgbToHex(color));
}

Planet.prototype.getDist = function() { return this.dist; }
Planet.prototype.setDist = function(dist) {
    this.dist = dist;
    this.gfx.mesh.position.y = this.dist;
    this.gfx.meshGlow.position.y = this.dist;
};

Planet.prototype.setGlow = function(state) {
  this.gfx.glow = state;
  this.gfx.meshGlow.visible = (Ori.gfxProfile.textures>=Ori.Q.MEDIUM) ? state : false;

};


Planet.prototype.reset = function() {
    this.sunAngle = 0;
    this.latitude = 0;
    this.longitude = 0;
    this.lastLongitude = 0;
    this.longitudeSpeed = 0;
    this.lastPerp = 0;

};
