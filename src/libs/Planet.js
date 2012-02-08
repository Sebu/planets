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
    this.gfx.glow =  params.glow || false;
    this.gfx.glowMap =  params.glowMap;
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


    this.rotation.x = this.beta/PI_SCALE;

    //nodePool[params.inner_id] = this.mesh;

};

Planet.prototype = new THREE.Object3D;
Planet.prototype.constructor = Planet;


Planet.prototype.setupGfx = function() {
  
};

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
