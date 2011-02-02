Camera = SceneJS.Camera;



Spherical  = SceneJS.createNodeType("spherical");
Planet  = SceneJS.createNodeType("planet");
Globe  = SceneJS.createNodeType("globe");
Circle  = SceneJS.createNodeType("circle", "geometry");
Curve  = SceneJS.createNodeType("curve", "geometry");
Cloud  = SceneJS.createNodeType("cloud", "geometry");


function distance(from,to) {
	  dx = from.x - to.x;
    dy = from.y - to.y;
	  dz = from.z - to.z;
  	return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

SceneJS.LookAt.prototype.rotateTarget = function(target) {

	dx = target.x - this._lookX;
  dy = target.y - this._lookY;
	dz = target.z - this._lookZ;
	dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
	
	this._eyeX += dx;
	this._eyeY += dy;
	this._eyeZ += dz;
	this.translate(0.0,0.0,-dist);

	this.setLook({x: this._eyeX + this.dir.x, y: this._eyeY + this.dir.y, z: this._eyeZ + this.dir.z});
//  this.setUp(this.up);
  this.update();
  
	this._setDirty(); 
}

SceneJS.LookAt.prototype.setTarget = function(target) {

	dx = this.dir.x = target.x - this._eyeX;
  dy = this.dir.y = target.y - this._eyeY;
  dz = this.dir.z = target.z - this._eyeZ;
	dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
	
	// TODO: normalize 
	this.dir.x /= dist;
  this.dir.y /= dist;
	this.dir.z /= dist;
	
	this.setLook({x: this._eyeX + this.dir.x, y: this._eyeY + this.dir.y, z: this._eyeZ + this.dir.z});
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
	m = Matrix.Rotation(angle,axis);
	this.right = m.multiply(this.right);
	this.dir = m.multiply(this.dir);
	this.up = m.multiply(this.up);
	this.update();
}

SceneJS.LookAt.prototype.rotateX = function(angle) {
	m = Matrix.Rotation(angle,this.right);
	this.dir = m.multiply(this.dir);
	this.up = m.multiply(this.up);
	this.update();
}

SceneJS.LookAt.prototype.rotateY = function(angle) {
	m = Matrix.Rotation(angle,this.up);
	this.right = m.multiply(this.right);
	this.dir = m.multiply(this.dir);
	this.update();
}

SceneJS.LookAt.prototype.update = function() {
  this.setLook({x: this._eyeX + this.dir.elements[0], y: this._eyeY + this.dir.elements[1], z: this._eyeZ + this.dir.elements[2]});
  this.setUp({x: this.up.elements[0], y: this.up.elements[1], z: this.up.elements[2]});
	this._setDirty();  
}

SceneJS.LookAt.prototype.translate = function(x,y,z) {
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




getNodePos = function(node) {
  query = new SceneJS.utils.query.QueryNodePos({ canvasWidth : 1, canvasHeight : 1	});
	query.execute({ nodeId: node });
	return query.getResults().worldPos;
}


// TODO: calc max points and max motion estimation
function calcCurve(start,node,color) {
	curvePos = [];
	oldAxis = [];
  oldRotate = [];
  step = 0;
  // save axis
	for(var i=0; i<=start; i++) {
		oldAxis[i] = system[i].getAxis();
    oldRotate[i] = system[i]._yAngle;
		system[i].setAxis(0.0);
		system[i].setRotate(0.0);
	}

  for(var i=start+1; i<system.length; i++) {
  	oldRotate[i] = system[i]._yAngle;
    system[i].update(-32.0);
//    step += 100;// / Math.abs(system[i]._speed);
  }
	
	for(var j=0; j<200; j++) {
		for(var i=start+1; i<system.length; i++) {
			system[i].update(1.0);
		}
		pos = getNodePos(node);
		curvePos.push(pos);
	}
  // restore axis
	for(var i=0; i<=start;i++)
		system[i].setAxis(oldAxis[i]);
 
  // restore rotation
  for(var i=0; i<system.length; i++)
		system[i].setRotate(oldRotate[i]);


 	system[start]._curve = new Curve({pos: curvePos});	
  system[start]._anchor.setBaseColor(color);
	system[start]._anchor.addNode(system[start]._curve);	
}


Sunlight = function() {
	return new SceneJS.Light({
          mode: "point",
          pos: { x: 0.0, y: 0.0, z: 0.0 }, // Position
          color: { r: 1.0, g: 1.0, b: 1.0 },
          diffuse: true,   // Contribute to diffuse lighting
          specular: true,  // Contribute to specular lighting
        })
}
