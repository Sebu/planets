
/**
 * @constructor
 * 
 */
Curve  = function(params) {
 
    this.trails = (params.trails==undefined) ? true : params.trails;
    this.geo = new THREE.Geometry();
    this.width = params.linewidth*Ori.gfxProfile.resolution || 2;
    this.material = new THREE.LineBasicMaterial( { linewidth: this.width, color: rgbToHex(params.color)  } );     
    this.material.vertexColors = this.trails;

    this.setPoints(params.pos);

    THREE.Line.call(this, this.geo, this.material);
};

Curve.prototype = new THREE.Line;
Curve.prototype.constructor = Curve;


Curve.prototype.setPoints = function(pos) {
    this.curvePos = pos;
    this.gen(pos);
};


Curve.prototype.gen = function(pos) {

    // reset vertices/colors and mark as dirty
    this.geo.vertices = [];
    this.geo.colors = [];
    this.geo.__dirtyVertices = true;

    // fill new data
    for(var i = 0, len=this.curvePos.length; i < len; i++) {
        this.geo.vertices.push( new THREE.Vertex( new THREE.Vector3( this.curvePos[i].x, this.curvePos[i].y, this.curvePos[i].z ) ) );
        
        // add trail gradient
        if(this.trails) {
            var color = new THREE.Color( 0xFFFFFF );
            color.setHSV( 1.0, 0.0, 0.5 + 0.5 * (i / this.curvePos.length) );
            this.geo.colors.push( color );
        }
    }
    
};

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

