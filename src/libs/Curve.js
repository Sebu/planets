
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
    this.geo.verticesNeedUpdate = true;

    // fill new data
    for(var i = 0, len=this.curvePos.length; i < len; i++) {
        this.geo.vertices.push( new THREE.Vector3( this.curvePos[i].x, this.curvePos[i].y, this.curvePos[i].z ) );
        
        // add trail gradient
        if(this.trails) {
            var color = new THREE.Color( 0xFFFFFF );
            color.setHSV( 1.0, 0.0, 0.5 + 0.5 * (i / this.curvePos.length) );
            this.geo.colors.push( color );
        }
    }
    
};


