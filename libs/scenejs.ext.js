Camera = SceneJS.Camera;



Spherical  = SceneJS.createNodeType("spherical");
Planet  = SceneJS.createNodeType("planet");
Globe  = SceneJS.createNodeType("globe");
Circle  = SceneJS.createNodeType("circle", "geometry");
Curve  = SceneJS.createNodeType("curve", "geometry");


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

		this._yaw = 0.0;
		this._pitch = 0.0;		
		this._roll = 0.0;		
		this.up = params.up;
		this.right = {x: 1.0, y:0.0, z:0.0};
		this.dir = {x: 0.0, y:0.0, z:1.0};
		
    this.setEye(params.eye);
    this.setUp(params.up);

    this.setLook(params.look);

};

SceneJS.LookAt.prototype.update = function() {
  sinPitch = Math.sin(this._pitch);
  cosPitch = Math.cos(this._pitch);
  sinYaw   = Math.sin(this._yaw); 
  cosYaw   = Math.cos(this._yaw);
  sinRoll  = Math.sin(this._roll);
  cosRoll  = Math.cos(this._roll);
  
  this.right.x = cosYaw*cosRoll + sinYaw*sinPitch*sinRoll;
  this.right.y = sinRoll*cosPitch;
  this.right.z = cosYaw*sinPitch*sinRoll - sinYaw*cosRoll;

  this.up.x = sinYaw*sinPitch*cosRoll - cosYaw*sinRoll;
  this.up.y = cosRoll*cosPitch;
  this.up.z = sinRoll*sinYaw + cosRoll*cosYaw*sinPitch;

  this.dir.x = cosPitch*sinYaw;
  this.dir.y = -sinPitch;
  this.dir.z = cosPitch*cosYaw;  
  
  this.setLook({x: this._eyeX + this.dir.x, y: this._eyeY + this.dir.y, z: this._eyeZ + this.dir.z});
  this.setUp(this.up);
	this._setDirty();  
}

SceneJS.LookAt.prototype.translate = function(x,y,z) {
	this._eyeX += this.dir.x * z;
	this._eyeY += this.dir.y * z;
	this._eyeZ += this.dir.z * z;
	this._eyeX += this.right.x * x;
	this._eyeY += this.right.y * x;
	this._eyeZ += this.right.z * x;
	this._lookX = this._eyeX + this.dir.x;
	this._lookY = this._eyeY + this.dir.y;
	this._lookZ = this._eyeZ + this.dir.z;
	this._setDirty();
}


SceneJS.LookAt.prototype.rotate = function(x,y,z) {
	this._pitch += x;
	this._yaw  += y;
	this._roll += z;
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
