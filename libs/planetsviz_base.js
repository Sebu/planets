

// UI HELPERS
addSlider = function(cls, id, text) {
	 return "<div class='"+cls+"' id='"+ id +"'><div>" + text + "</div><input type='range' class='slider' onchange='$(\"#" +id+" > input\").attr(\"value\",value);'/> <input type='text' class='range' onchange='$(\"#" + id + " > input\").attr(\"value\",value);'/></div>"
}

// BASIS MODEL
// TODO: make more flexible

PModel = function(params) {
									
	this.spheres = params.spheres;
	this.time = 21;
	this.sunYear = 365.0;
	this.metonYear = 0;
	this.metonSynodicMonths = 0;
	this.metonDays = 0; // days per cycle
	this.metonDraconiticMonths =  0;
	
	this.metonZodicalMonths = function() { return this.metonYear + this.metonSynodicMonths; }
	this.metonDaysPerYear = function() { return this.metonDays/this.metonYear; }
	this.synodicDaysPerMonth = function() { return this.metonDays/this.metonSynodicMonths; }
	this.zodicalDaysPerMonth = function() {return this.metonDays/this.metonZodicalMonths(); }
	this.draconiticDaysPerMonth = function() {return this.metonDays/this.metonDraconiticMonths; }

	// CONTROLLS
	this.lastX = 0;
	this.lastY = 0;
	this.dragging = false;

	// TODO: move to model
	this.currentPlanet = {};
	this.currentPos = "free";
	this.currentLookAt = "earth";
	this.speed = 0.1;

	this.posAngle=0.0;
	this.beta=0;
	this.showPath = true;
	this.showHippo = true;	
	this.curves = {};
											
	// SETUP
	// base structure
	// planet system
	this.system = [];
	this.systemSun = [];

	this.scene = SceneJS.scene({ canvasId: "glCanvas" }); 
	this.renderer = SceneJS.renderer({  id: "renderer" , clear: { depth : true, color : true },  clearColor: { r: 0.2, g : 0.2, b : 0.2 }, pointSize: 4 });
	var lookAt = this.lookAt = SceneJS.lookAt({ eye : { x: 0.0, y: 0.0, z: -30 }, look : { x:0.0, y:0.0, z: -24 }, up: { x:0.0, y: 1.0, z: 0.0 } });
	var camera = this.camera = new Camera();
	this.light = Sunlight();

	this.camera.addNode(this.light);
	this.lookAt.addNode(this.camera);
	this.renderer.addNode(this.lookAt);
	this.scene.addNode(this.renderer);


	this.camera.addNode( SceneJS.material({              
												baseColor:  { r: 0.5, g: 0.5, b: 1.0 },
												specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
    										emit: 0.0, specular: 0.0, shine: 3.0},
    										this.earthPlane = SceneJS.cube({xSize: 6.0,  ySize: 0.01, zSize: 6.0})
    									 )
    								 );
							
	this.earthPlane.setEnabled(false);							

	this.camera.addNode(this.earth = new Planet({beta:180.0, dist: 0.0, scale: 0.4, emit:0.0, color: colors["Earth"], id: "earth"}));

	this.camera.addNode(this._anchor = SceneJS.material({
		      baseColor:      { r: 0.0, g: 0.0, b: 0.0 },
          specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
          emit: 1.0, specular: 0.0, shine: 1.0 
          }));
							
	this.camera.addNode(	this.system[0] = new Spherical({scale: 9, angle: 0.0, speed: 0.0, color: colors["S0"]}) );
//	,
//						    		this.system[1] =	new Spherical({ scale: 9, angle: 0.0, speed: 0.0, color: colors["S1"] },
//								  		this.system[2] = new Spherical({ scale: 9, angle: 0.0, speed: 0.0, color: colors["S2"] },
//								  		  this.system[3] = new Spherical({ scale: 9, angle: 0.0, speed: 0.0, color: colors["S3"] },
//		              		    this.planet = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: "planet",  color:colors["Planet"] })
//		              		  )
//						 		  		)
//										)	
//									)
//								);


	i=1;
	this.updateList = [];
	this.updateList[0] = this.system[0];
	for(;i<=params.spheres;i++) {
		tmp = this.system[i]  = new Spherical({scale: 9, angle: 0.0, speed: 0.0, color: colors["S"+i+""]});
		this.system[i-1]._anchor2.addNode( tmp );
		this.updateList[i] = tmp;
	}							
	this.system[i-1]._anchor2.addNode(this.planet = new Planet({ dist: 9.0, emit: 0.5, scale: 0.2, inner_id: "planet",  color:colors["Planet"] }) );
	
//  this.updateList[i] = 

	this.system[1].addNode( this.stars = new SceneJS.cloud({count:100, scale:20.0}) );


	this.system[0]._anchor.addNode(  this.systemSun[0] = new Spherical({ scale: 9, angle: 24.0, speed: 365.0, color: {r:0.2, g:0.2, b:1.0}},
																this.systemSun[1] = new Spherical({ scale: 9, angle: 0.5, speed: 0.0 },
		             								  this.sun = new Planet({  beta: 90.0, emit: 0.5, scale: 0.3, dist: 9.0, inner_id: "sun", color:colors["Sun"] } )
			            							)
			            						)
														);
														
		this.updateList[i] =  this.systemSun[0];
		this.updateList[i+1] =  this.systemSun[1];


	this.resize = function() {
		canvas = document.getElementById("glCanvas");
		canvas.width = $(window).width();	
		canvas.height = $(window).height();
		model.camera.setOptics({ type: "perspective", fovy : 45.0, aspect : canvas.width/canvas.height, near : 0.10, far : 500.0});
		this.renderer._props.props.viewport =  { x : 1, y : 1, width: canvas.width, height: canvas.height };
	}


	this.update = function() {
		this.render();
	}


	this.removeCurve = function(node) {
		if(this.curves[node]) 
	 		this.curves[node].destroy();
	}
		
	this.addCurve = function(node, anchor, curvePos, color) {
 		this.curves[node] = new Curve({pos: curvePos});	
  	anchor.setBaseColor(color);
		anchor.addNode(this.curves[node]);	
	}

	this.render = function() {

			this.time++;
			if(this.time>20) {
				this.time = 0;
				this.removeCurve(0);
				this.removeCurve(1);
				if(this.showPath) {
					if (this.spheres==1) {
						this.addCurve(0, this._anchor, this.calcCurve(-1,"planet"), colors["Path"]);				
					}
					else {
						this.addCurve(0, this.system[0]._anchor, this.calcCurve(0,"planet"), colors["Path"]);
					}
				}
				if(this.showHippo) 	this.addCurve(1, this.system[1]._anchor, this.calcCurve(1,"planet"), colors["Hippo"]);
			}
		
			for(i in model.updateList) {
					model.updateList[i].update(this.speed);
			}
		
			if(this.currentPos!="free") {
				if(this.currentLookAt!="free")
					lookAt.setTarget(getNodePos(this.currentLookAt));		
			} else {
				if(this.currentLookAt!="free")
					this.lookAt.rotateTarget(getNodePos(this.currentLookAt));
			}



			//TODO: on model change -> events?
			sunPos = getNodePos("sun");
			this.light.setPos(sunPos);
			if(model.currentPlanet.type!="sun" && 
				distance(sunPos,getNodePos("planet")) < 2.0) 
				this.planet.setShade({r: 0.2, g: 0.2, b:0.2});
			else 
				this.planet.setShade(model.currentPlanet.color);

			this.scene.render(); 
				
	}
	
	this.changeView = function(node) {
		if(node=="free") pos = { x: 0.0, y: 0.0, z: -25 };
		else pos = getNodePos(node);
	
		this.earth.setEnabled(true);
		this.planet.setEnabled(true);
		this.earthPlane.setEnabled(false);

		
		if(node=="earth") {
			this.earthPlane.setEnabled(true);
			this.earth.setEnabled(false);
			pos.y = 0.5; 
			pos.z = 0.5;

		  this.lookAt.dir = $V([0,0,1]);
		  this.lookAt.up = $V([0,1,0]);
		  this.lookAt.right = $V([1,0,0]);
		  this.lookAt.update();

		}

	//  if(node=="earth") earth.setEnabled(false);
		if(node=="planet") {
			this.planet.setEnabled(false);
		}
	
		this.lookAt.setEye(pos);
		this.lookAt.update();
	} 

	this.setCurrentMoonModel = function(node) {
		var currentModel = moonModels[node];
		this.moonSpeed1 = currentModel.speed1;
		this.moonSpeed2 = currentModel.speed2;
		$(".moon > input").change();
	}

	this.reset =function () {
		if(this.system.length==0) return;
		for(var i=0; i<this.system.length; i++) {
						this.system[i].setRotate(model.currentPlanet.sphere[i].rotate);
		}
		
		this.systemSun[0].setRotate(0);
		this.systemSun[1].setRotate(0);	
	
	}

	this.visMode = function(sys, state) {
		if(sys=="stars") {
			this.stars.setEnabled(state.checked);
			return;
		} 

		this.system[sys].setVisuals(["equator","npole","spole","rotationarc","markerarc","arc1","arc2","markerball"], state.checked);
	}


	this.calcCurve =function(start,node) {
		curvePos = [];
		oldAngle = [];
		oldRotate = [];
		step = 0;

		// save axis
		for(var i=0; i<=start; i++) {
			oldAngle[i] = this.system[i].getAngle();
		  oldRotate[i] = this.system[i]._yAngle;
			this.system[i].setAngle(0.0);
			this.system[i].setRotate(0.0);
		}

		for(var i=start+1; i<this.system.length; i++) {
			oldRotate[i] = this.system[i]._yAngle;
	//    system[i].update(-32.0);
		  step += Math.abs(this.system[i]._step);
		}
	
		for(var j=0; j<80; j++) {
			for(var i=start+1; i<this.system.length; i++) {
				this.system[i].update(15.0/step);
			}
			pos = getNodePos(node);
			curvePos.push(pos);
		}
		// restore axis
		for(var i=0; i<=start;i++)
			this.system[i].setAngle(oldAngle[i]);
	 
		// restore rotation
		for(var i=0; i<this.system.length; i++)
			this.system[i].setRotate(oldRotate[i]);

 
		return curvePos;
	}





	this.mouseDown = function (event) {
		  this.lastX = event.clientX;
		  this.lastY = event.clientY;
		  this.dragging = true;
	}

	this.mouseUp = function() {
		  this.dragging = false;

	}

	/* On a mouse drag, we'll re-render the scene, passing in
	 * incremented angles in each time.
	 */
  this.pitch =0;
	this.mouseMove = function(event) {
		  if (this.dragging) {
		      this.pitch += pitch = (event.clientY - this.lastY) * 0.005;
		      yaw = (event.clientX - this.lastX) * -0.005;
		      
		      if(this.currentPos=="earth") {
			      model.lookAt.rotateY(yaw);
			    } else {
			      model.lookAt.rotateUp(yaw);
			    }
			    
          console.log();
          if(this.pitch<1) pitch =0;
  		      model.lookAt.rotateRight(pitch);

		      this.lastX = event.clientX;
		      this.lastY = event.clientY;
		  }
	}

	this.keyboard = function(e) {
		switch(e.keyCode) {
			case 119: model.lookAt.translate(0,0,0.2);  break;
			case 115: model.lookAt.translate(0,0,-0.2);  break;
			case 97:  model.lookAt.translate(0.2,0,0);  break;
			case 100: model.lookAt.translate(-0.2,0,0);  break;		
			default: return false;
		}
	}

	this.mouseWheel = function(event) {
		model.lookAt.translate(0.0,0.0,event.wheelDelta/120);
	}
	this.mouseWheel_firefox = function(event) {
		model.lookAt.translate(0.0,0.0,event.detail);
	}

}

