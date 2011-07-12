

var Utils = Utils || {};



function mod(a, b)
{
    return a - (b * Math.floor(a / b));
}

Utils.daysToTime = function(days) {
  var fullDays = Math.floor(days);
  var rest = days - fullDays;
  var hours = Math.floor(rest/(1/24));
  var rest = rest - hours*(1/24);
  var minutes = Math.floor( rest/(1/1440) );
  if(hours < 10) hours = "0" + hours;
  if(minutes < 10) minutes = "0" + minutes;
  return "" + fullDays + "d " + hours + "h " + minutes + "m";
  
  

}

Utils.GREGORIAN_SWITCH = 2299160.5;
Utils.GREGORIAN_EPOCH = 1721425.5;
Utils.JULIAN_EPOCH = 1721423.5;






Utils.EgyptNames = ["Toth", "Phaophi", "Athyr", "Choiak", "Tybi", "Mechir", "Phamenoth", "Pharmouthi"            
, "Pachon", "Payni", "Epiphi", "Mesore", "Epagomenal"];  

Utils.dateToStringEgypt = function(date) {
  return "" + date[2] + " " + Utils.EgyptNames[date[1]-1] + "  " + date[0] + "";
}


Utils.dateToString = function(date) {
//  if (date[0]<1) date[0] += 1;
  return "" + date[1] + " / " + date[2] + " / " + date[0] + "";
}

Utils.leapJulian = function(year) {
    return mod(year, 4) == ((year > 0) ? 0 : 3);
}

Utils.leapGregorian = function(year) {
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
}

Utils.jdToEgyptian = function(jd) {
    var z, a, b, year, month, day;

//    jd += 0.5;
    z = Math.floor(jd) - 1448638;

    year = Math.floor(z / 365);
    a = Math.floor(365 * year);
    month = Math.floor((z - a) / 30);
    b = Math.floor(30 * month);
    day = (z - a - b);

    return new Array(year+1, month+1, day+1);
}

Utils.gregorianToJd =function(year, month, day) {
    return (Utils.GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 :
                               (Utils.leapGregorian(year) ? -1 : -2)
           ) +
           day);
}


Utils.jdToMagic = function(jd) {
  if(jd<=Utils.GREGORIAN_SWITCH) return Utils.jdToJulian(jd);
  else return Utils.jdToGregorian(jd);
}

Utils.magicToJd = function(year, month, day) {
  if(year>=1582 && month >=10 && day>4)
    return Utils.gregorianToJd(year, month, day);
  else
    return Utils.julianToJd(year, month, day);
}


Utils.jdToGregorian = function(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - Utils.GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - Utils.gregorianToJd(year, 1, 1);
    leapadj = ((wjd < Utils.gregorianToJd(year, 3, 1)) ? 0
                                                  :
                  (Utils.leapGregorian(year) ? 1 : 2)
              );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - Utils.gregorianToJd(year, month, 1)) + 1;

    return new Array(year, month, day);
}

Utils.jdToJulian = function(td) {
    var z, a, alpha, b, c, d, e, year, month, day;

    td += 0.5;
    z = Math.floor(td);

    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);

    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);

    /*  If year is less than 1, subtract one to convert from
        a zero based date system to the common era system in
        which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

//    if (year < 1) {
//        year--;
//    }

    return new Array(year, month, day);
}

Utils.julianToJd = function(year, month, day) {

    /* Adjust negative common era years to the zero-based notation we use.  */
//    if (year < 1) {
//        year++;
//    }

    /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */
    if (month <= 2) {
        year--;
        month += 12;
    }

    return ((Math.floor((365.25 * (year + 4716))) +
            Math.floor((30.6001 * (month + 1))) +
            day) - 1524.5);
}


Utils.decToSex = function(num, prec) {
  tmp2 = Math.round(num*Math.pow(60,prec))/Math.pow(60,prec);
  tmp = Math.floor(tmp2);
  outstr = tmp.toString() + ";";
  tmp = num - tmp;
  cnt = 0;
  while(tmp > 0 && cnt < prec) {
    console.log(tmp + " " + tmp2);
    tmp = tmp * 60;
    tmp2 = Math.floor(tmp);


    tmp = tmp - tmp2;
    if(cnt++ > 0)
      outstr = outstr + "," + tmp2.toString();
    else
      outstr = outstr + tmp2.toString();
  };
  return outstr;
 
};



Utils.toDec = function(number) {
  if(number.toString().indexOf(";")==-1)
    return number;
  else 
    return Utils.baseToDec(number,60);
}

Utils.sexagesimal = function(number) {
  if(number.toString().indexOf(";")==-1)
    return Utils.decToBase(number,60);
  else 
    return Utils.baseToDec(number,60);
}

Utils.baseToDec = function(number, base) {
        console.log(number);
        if (base < 2 || base > 64) {
            return "#base should be between 2 and 64#";
        }

        number = number.toString().split(';');
        var result = Number(number[0]);
 

        var negative = '';
        if (result < 0) {
            negative = '-';
        }
        result = Math.abs(result);

        var fraction = number[1].split(',');
        
        if (fraction) {
          for(var i=0;i<fraction.length;i++) {
            console.log(result);
            result += Number(fraction[i]/base)/(Math.pow(60,i));
          }
        }
        return negative + result;
    };
   
Utils.decToBase = function(number, base) {

        if (base < 2 || base > 64) {
            return "#base should be between 2 and 64#";
        }

        var negative = '';
        if (number < 0) {
            negative = '-';
        }

        number = number.toString().split('.');
        var integer = Math.abs(number[0]);
        var fraction = number[1];
        var result = '';

        result = integer + ";";
//        do {
//            result = String(integer % base) + ";" + result;
//            integer = parseInt(integer / base, 10);
//        } while (integer > 0);

        if (fraction) {
            var decimalPlaces = fraction.toString().length;
            fraction = parseFloat('.' + fraction);

            var x = 0;
            do {
                x++;
                var res = (fraction * base).toString().split('.');
                result +=  res[0] + ",";

                if (res[1]) {
                    fraction = parseFloat('.' + res[1]);
                }
                else {
                    break;
                }
            } while (x < decimalPlaces);
        }
        return negative + result;
    };



Utils.frac = function(num) {

  var d = 0.0;
  var tmp = num.toString();
  var idx = tmp.indexOf(".");

  if (idx >= 0) d = Number("0" + tmp.substring(idx,tmp.length));
  
  var numerators = [0, 1];
  var denominators = [1, 0];

  var maxNumerator =  Utils.getMaxNumerator(d);
  var d2 = d;
  var calcD, prevCalcD = NaN;
  for (var i = 2; i < 1000; i++)  {
    var L2 = Math.floor(d2);
    numerators[i] = L2 * numerators[i-1] + numerators[i-2];
    denominators[i] = L2 * denominators[i-1] + denominators[i-2];
    var string = tmp.substring(0, idx) + " " + numerators[i-1] + "/" + denominators[i-1]+ "";
    if (Math.abs(numerators[i]) > maxNumerator) return string;
    calcD = numerators[i] / denominators[i];
    if (calcD == prevCalcD) return string;
    if (calcD == d) return string;

    prevCalcD = calcD;

    d2 = 1/(d2-L2);
  }
}

Utils.getMaxNumerator = function(f)
{
   var f2 = null;
   var ixe = f.toString().indexOf("E");
   if (ixe==-1) ixe = f.toString().indexOf("e");
   if (ixe == -1) f2 = f.toString();
   else f2 = f.toString().substring(0, ixe);

   var digits = null;
   var ix = f2.toString().indexOf(".");
   if (ix==-1) digits = f2;
   else if (ix==0) digits = f2.substring(1, f2.length);
   else if (ix < f2.length) digits = f2.substring(0, ix) + f2.substring(ix + 1, f2.length);

   var L = digits;

   var numDigits = L.toString().length;
   var L2 = f;
   var numIntDigits = L2.toString().length;
   if (L2 == 0) numIntDigits = 0;
   var numDigitsPastDecimal = numDigits - numIntDigits;

   for (var i=numDigitsPastDecimal; i>0 && L%2==0; i--) L/=2;
   for (var i=numDigitsPastDecimal; i>0 && L%5==0; i--) L/=5;

   return L;
}




PI_SCALE = 180.0/Math.PI;

degToRad = function(deg) {
    return deg/PI_SCALE;
}

RadToDeg = function(rad) {
    return rad*PI_SCALE;
}

calcAngle = function(pos1, pos2) {
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

calcAngleRel = function(node1, node2, center) {
    var pos1 = center.subtract( node1 );
    var pos2 = center.subtract( node2 );
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
THREE.Object3D.prototype.currentPos = function() {
    var pos = this.currentMatrixWorld();
    return {x: pos.n14, y: pos.n24, z: pos.n34};
}

THREE.Object3D.prototype.getPosCanvas = function(camera, canvas) {
    var posTmp = this.currentPos();

    camera.matrixWorldInverse.multiplyVector3( posTmp );
    var zTmp = -posTmp.z;
    camera.projectionMatrix.multiplyVector3( posTmp );
    
    pos = {x: (posTmp.x+1) * canvas.domElement.width/2, y: (-posTmp.y+1) * canvas.domElement.height/2, z: zTmp };

    //if node is outside of canvas shift pos to z=-1 
    if (pos.x<0 || pos.x>canvas.domElement.width-50) pos.z = -1.0;
    if (pos.y<0 || pos.y>canvas.domElement.height-20) pos.z = -1.0;

    return pos;
}



// extend THREE.Camera with:
// aspect ratio setter
THREE.Camera.prototype.setAspect = function(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
};
// FOV getter & setter
THREE.Camera.prototype.getFov = function() { return this.fov; };
THREE.Camera.prototype.setFov = function(fov) {
	  this.fov = fov;
	  this.updateProjectionMatrix();
};

// rotation around lookAt
THREE.Camera.prototype.rotateTarget = function(target) {


    var dx = target.x - this.position.x;
    var dy = target.y - this.position.y;
    var dz = target.z - this.position.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    this.position.x = target.x + this.dir.elements[0] * -dist;
    this.position.y = target.y + this.dir.elements[1] * -dist;
    this.position.z = target.z + this.dir.elements[2] * -dist;
    
    this.updateNew();
}

// lookAt
THREE.Camera.prototype.setTarget = function(target) {

    
    this.dir.elements[0] = target.x - this.position.x;
    this.dir.elements[1] = target.y - this.position.y;
    this.dir.elements[2] = target.z - this.position.Z;

    // TODO: fix degenerate :D
    this.dir = this.dir.toUnitVector();
    this.upVec = this.upVec.toUnitVector();
    this.right = this.upVec.cross(this.dir);

    this.updateNew();
}

THREE.Camera.prototype.setEye = function(pos) {
    this.position.set(pos.x, pos.y, pos.z);
};

// addition of up/right/dir vector
THREE.Camera.prototype.init = function(params) {

    this.right = Vector.create([1, 0, 0]);
    this.upVec = Vector.create([0, 1, 0]);
    this.dir = Vector.create(  [0, 0, 1]);
    this.setEye(params.eye);

    this.useTarget = false;
    this.updateNew();

};


THREE.Camera.prototype.updateMatrix = function() {
    this.matrix.set(
            -this.right.elements[0], this.upVec.elements[0], -this.dir.elements[0], this.position.x,
            -this.right.elements[1], this.upVec.elements[1], -this.dir.elements[1], this.position.y,
            -this.right.elements[2], this.upVec.elements[2], -this.dir.elements[2], this.position.z,
            0, 0, 0, 1);

   this.matrixWorldNeedsUpdate = true;
}

THREE.Camera.prototype.updateNew = function() {
//    this._lookX  = this.position.x + this.dir.elements[0];
//    this._lookY = this.position.y + this.dir.elements[1];
//    this._lookZ = this.position.z + this.dir.elements[2];
    this.update();
}

THREE.Camera.prototype.translateNew = function(x, y, z) {
    this.position.x += this.dir.elements[0] * z;
    this.position.y += this.dir.elements[1] * z;
    this.position.z += this.dir.elements[2] * z;
    this.position.x += this.right.elements[0] * x;
    this.position.y += this.right.elements[1] * x;
    this.position.z += this.right.elements[2] * x;
    this.updateNew();
}

THREE.Camera.prototype.rotate = function(angle, axis) {
    var m = Matrix.Rotation(angle, axis);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.up);
    this.updateNew();
}


THREE.Camera.prototype.rotateX = function(angle) {
    var m = Matrix.Rotation(angle, $V([1,0,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}

THREE.Camera.prototype.rotateY = function(angle) {
    var m = Matrix.Rotation(angle, $V([0,1,0]));
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}


THREE.Camera.prototype.rotateRight = function(angle) {
    var m = Matrix.Rotation(angle, this.right);
    this.dir = m.multiply(this.dir);
    this.upVec = m.multiply(this.upVec);
    this.updateNew();
}

THREE.Camera.prototype.rotateUp = function(angle) {
    var m = Matrix.Rotation(angle, this.upVec);
    this.right = m.multiply(this.right);
    this.dir = m.multiply(this.dir);
    this.updateNew();
}





// disc of planet surface 
Disc = function(params) {
  var color = params.color || colors["Earth"];
  THREE.Mesh.call(  this, 
                    new THREE.SphereGeometry(params.radius,20,30), 
                    new THREE.MeshLambertMaterial({color: rgbToHex(color), shading: THREE.FlatShading}) );
  this.scale.y = 0.01;
  this.overdraw = true;
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

planetGeo = new THREE.SphereGeometry( 1 , 10, 6 );


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
    this.gfx.glowMap = 'textures/sun.png';
    this.gfx.map = params.map;

    this.addNode( this.npole = new Translate({y:-1.0}) ); 
    this.reset();

    Ori.registerGfx(this);
// color: rgbToHex(this.color),
//   map: THREE.ImageUtils.loadTexture('textures/earthmap1k.jpg'),
    this.material =  new THREE.MeshLambertMaterial( {  
        color: rgbToHex(this.gfx.color),
        map: this.gfx.map,
        shading: THREE.FlatShading });



    var geo = new THREE.Geometry();
    var x = 0,y = 0,z = 0;
    geo.vertices.push( new THREE.Vertex( new THREE.Vector3( 0.0, 0.0, 0.0 ) ) );
    
    var mat = new THREE.ParticleBasicMaterial({
            size: 2.3,
            map: THREE.ImageUtils.loadTexture(this.gfx.glowMap),
            blending: THREE.AdditiveBlending,
            depthTest: false,              
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
    
    
    this.mesh = new THREE.Mesh(planetGeo, this.material);
    this.mesh.scale.set( this.gfx.scale, this.gfx.scale, this.gfx.scale );
    this.mesh.overdraw = true;
    this.setDist(this.dist);
    this.mesh.rotation.z = Math.PI;
    this.addNode(this.mesh);
    this.addNode(this.meshGlow);

    this.rotation.x = degToRad(this.beta);

    nodePool[params.inner_id] = this.mesh;

};

Planet.prototype = new THREE.Object3D;
Planet.prototype.constructor = Planet;

Planet.prototype.setEnabled = function(state) { this.mesh.visible = state; if(this.glow) this.meshGlow.visible = state; }
Planet.prototype.getEnabled = function() { return this.mesh.visible; }

Planet.prototype.setBeta = function(angle) {
    this.beta = angle;
    this.rotation.x = degToRad(this.beta);
};

Planet.prototype.setShade = function(color) {
    this.material.color.setHex(rgbToHex(color));
}

Planet.prototype.setDist = function(dist) {
    this.dist = dist;
    this.mesh.position.y = this.dist;
    this.meshGlow.position.y = this.dist;
};

Planet.prototype.setGlow = function(state) {
  this.gfx.glow = state;
  this.meshGlow.visible = false;
};

Planet.prototype.setQuality = function(profile) {
  if(profile.textures) console.log("textures");
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
        for (var i = 0; i < this.curvePos.length; i++) {
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

    var width = params.linewidth || 2;
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

    this.trails = true;//(params.trails==undefined) ? false : params.trails;
    
    this.setAngle(params.angle);
    this.setBeta(params.betaRotate || 90);

};

Circle.prototype = new THREE.Geometry;
Circle.prototype.constructor = Circle;

Circle.prototype.gen = function() {
    this.vertices = [];
    this.colors = [];

    var slices = 50;//Math.abs(Math.round(this.angle/5));
    var arc = (this.angle / 180.0) * Math.PI;
    var beta = (this.beta / 180) * Math.PI;
    var cosPhi = Math.cos(beta);
    var sinPhi = Math.sin(beta);
    var x = 0,y = 0,z = cosPhi;
    for (var sliceNum = 0; sliceNum <= slices; sliceNum++) {
        var theta = sliceNum * arc / slices;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        x = sinTheta * sinPhi;
        y = cosTheta * sinPhi;

        this.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
        if(this.trails) {
              var color = new THREE.Color( 0xFFFFFF );
              color.setHSV( 0.5, 0.0, 1.0 - 0.7 * (sliceNum / slices) );
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

    var mat =  new THREE.ParticleBasicMaterial({size: 2.5, sizeAttenuation:false});
/*
    var mat = new THREE.ParticleBasicMaterial({  size: 1.0,  
        map: THREE.ImageUtils.loadTexture('textures/star.png'),  
        blending: THREE.AdditiveBlending, 
  //    depthTest: false, 
        transparent: true  });
//*/

    THREE.ParticleSystem.call( this, geo, mat);
};

Cloud.prototype = new THREE.ParticleSystem;
Cloud.prototype.constructor = Cloud;



var geometryBall = new THREE.SphereGeometry( 0.1, 10, 10 );
var equator = new Circle({ angle : 359.9 });

var markerend = new THREE.CylinderGeometry( 10, 0.1, 0.1, 0.01);
var cone = new THREE.CylinderGeometry( 10, 0.0001, 0.15, 0.4);
//THREE.LatheGeometry([new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 1, 0 )]);

var aLine = new THREE.Geometry();
aLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 1, 0 ) ) );
aLine.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) ) );
    
/*
 * @constructor
 * the cosmological spheres
 */
Spherical = function Spherical(params) {
    THREE.Object3D.call( this );
    
    this.offsetRotateAngle = 0.0;
    this.visUpdate = true;

    this.inner_id = params.inner_id;

    this.moving = true;
    this.scaleFactor = params.scale;
    
    this.gfx = new Object();
    this.gfx.color = params.color || { r: 0.5, g: 0.5, b: 0.5};
//    color = rgbToHex(color);
    this.visuals = [];

    this.axisAngle = params.axisAngle || 0.0;
    this.rotateAngle = params.rotateStart || 0.0;
    this.rotateStart = params.rotateStart || 0.0;
    this.speed = params.speed || 0.0;

    this.pivot = new Node();
    this.addNode(this.pivot);
    
    this.anchor = new Node();
    this.pivot.addNode(this.anchor);

    this.material = new THREE.LineBasicMaterial( { opacity: 0.8, color: rgbToHex(this.gfx.color) } );
    this.materialArc =  new THREE.LineBasicMaterial( { opacity: 0.5,  color: rgbToHex(this.gfx.color) } );

    this.arcangle21 = new Circle({ angle : this.axisAngle });
    this.visuals.arc1 = this.arc1 = new THREE.Line(this.arcangle21, this.materialArc );
    this.visuals.arc1.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.addNode(this.visuals.arc1);

    this.visuals.arc2 = new THREE.Line(this.arcangle21, this.materialArc );
    this.visuals.arc2.scale  = new THREE.Vector3( -params.scale, -params.scale, -params.scale );
    this.addNode(this.visuals.arc2);

//    var materialArc = new THREE.LineBasicMaterial( { color: rgbToHex(this.gfx.color) });
    this.visuals.equator = new THREE.Line(equator, this.material );
    this.visuals.equator.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.visuals.equator.rotation.x = Math.PI/2;
    this.anchor.addNode(this.visuals.equator);

    this.markerArc = new Circle({ angle : 90 });
    this.visuals.markerarc = new THREE.Line(this.markerArc, this.material );
    this.visuals.markerarc.scale  = new THREE.Vector3( -params.scale, params.scale, params.scale );
    this.visuals.markerarc.rotation.y = Math.PI/2;
    this.anchor.addNode(this.visuals.markerarc);

    //var geometryBall = new THREE.Sphere( 0.1, 10, 10 );
    geometryBall.overdraw = true;
    
    var materialBall = new THREE.MeshBasicMaterial( { opacity: 0.5, color: rgbToHex(this.gfx.color) } );
   
    var materialCone = new THREE.MeshBasicMaterial( { opacity: 0.5, color: "0xFFFFFF" } );
//    THREE.ColorUtils.adjustHSV(materialCone.color, 0, 0.0, -0.2);
    
    
    this.visuals.markerball =  new THREE.Mesh(cone, materialCone);
    this.visuals.markerend =  new THREE.Mesh(markerend, materialCone);
    this.visuals.markerball.position.z = params.scale;
//    this.visuals.markerball.position.x = -0.2;
    this.visuals.markerball.rotation.y = -Math.PI/2;  
    this.visuals.markerend.position.z = params.scale;
    this.visuals.markerend.rotation.y = -Math.PI/2; 
    
    this.visuals.npole = new THREE.Mesh(geometryBall, materialBall);
    this.visuals.spole = new THREE.Mesh(geometryBall, materialBall);
    this.visuals.npole.position.y = params.scale;
    this.visuals.spole.position.y = -params.scale;
    this.anchor.addNode(this.visuals.markerball);
    this.addNode(this.visuals.markerend);

    this.anchor.addNode(this.visuals.npole);
    this.anchor.addNode(this.visuals.spole);
//    nodePool[this.inner_id] = this.visuals.markerball;
//    nodePool[this.inner_id+"npole"] = this.visuals.npole;
//    nodePool[this.inner_id+"spole"] = this.visuals.spole;

    this.progressArc = new Circle({ angle : 40 });
    var progressMat = new THREE.LineBasicMaterial( { linewidth:6, color: rgbToHex(this.gfx.color),
                opacity: 0.9
                } );
    progressMat.vertexColors = true;
    this.visuals.rotationarc = new THREE.Line( this.progressArc, progressMat );
    this.visuals.rotationarc.scale  = new THREE.Vector3( params.scale, params.scale, params.scale );
    this.visuals.rotationarc.rotation.x = Math.PI/2;
    this.anchor.addNode(this.visuals.rotationarc);


    
    this.setAxisAngle(this.axisAngle);
    this.setRotateAngle(this.rotateAngle);
    this.setSpeed(this.speed);
//    this.setOffsetRotateAngle(45);

};

Spherical.prototype = new THREE.Object3D;
Spherical.prototype.constructor = Spherical;


Spherical.prototype.setMoving = function(state) {
  return this.moving = state;
}


Spherical.prototype.getMoving = function() {
  return this.moving;
}

Spherical.prototype.getPlane = function() {

//    var plane = Plane.create(Vector.Zero(3), posSyl(this.inner_id+"npole").toUnitVector());
    var center = sceneToSyl(this.anchor.currentPos());
    var polePos = sceneToSyl(this.visuals.npole.currentPos());
    var upVec = center.subtract(polePos);
    var plane = Plane.create(center, upVec.toUnitVector());
    return plane;
}

Spherical.prototype.setVisuals = function(vis, state) {
    for (var i in vis) {
        this.visuals[vis[i]].setEnabled(state);
    }

};
Spherical.prototype.setAxisAngle = function(angle) {
    this.axisAngle = angle;
    this.rotation.z = degToRad(this.axisAngle);
    this.arcangle21.setAngle(angle);

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

Spherical.prototype.setScale = function(value) {
  this.scaleFactor = value;
  this.visuals.arc1.scale  = new THREE.Vector3( value, value, value );
  this.visuals.arc2.scale  = new THREE.Vector3( -value, -value, -value );
  this.visuals.equator.scale  = new THREE.Vector3( value, value, value );
  this.visuals.markerarc.scale  = new THREE.Vector3( -value, value, value );
  this.visuals.markerball.position.z = value;
  this.visuals.markerend.position.z = value;
  this.visuals.npole.position.y = value;
  this.visuals.spole.position.y = -value;
  this.visuals.rotationarc.scale  = new THREE.Vector3( value, value, value);

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
};

Spherical.prototype.getStep = function() {
    return this.step;
};


Spherical.prototype.setArcBeta = function(angle) {
    this.markerArc.setAngle(180-angle);
    this.progressArc.setBeta(angle);
};

Spherical.prototype.setArcAngle = function(angle) {

    
    if(angle > 0) {
     this.visuals.markerball.scale.z = 1.0;  
//     this.visuals.markerball.position.x = -0.2;
    }
    else {
     this.visuals.markerball.scale.z = -1.0;  
//     this.visuals.markerball.position.x = 0.2;
     }
    
    // update progress angle
    if(this.visuals.rotationarc.getEnabled()) this.progressArc.setAngle(-angle);
};

Spherical.prototype.setRotateAngle = function(angle) {
    this.rotateAngle = angle;
    if(this.visUpdate) this.setArcAngle(angle);
    this.anchor.rotation.y = degToRad(this.rotateAngle);
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
    this.pivot.rotation.y = degToRad(this.offsetRotateAngle);
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
      console.log(this.offsetRotateStep);
      this.setOffsetRotateAngle( this.getOffsetRotateAngle() + (this.offsetRotateStep * step) );
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


