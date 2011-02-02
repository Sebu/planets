PModel = function(params) {
	this._updateList = [];
}



var sunYear = 365.0;
var metonYear = 0;
var metonSynodicMonths = 0;
var metonDays = 0; // days per cycle
var metonDraconiticMonths =  0;

function metonZodicalMonths() { return metonYear + metonSynodicMonths; }
function metonDaysPerYear() { return metonDays/metonYear; }
function synodicDaysPerMonth() { return metonDays/metonSynodicMonths; }
function zodicalDaysPerMonth() {return metonDays/metonZodicalMonths(); }
function draconiticDaysPerMonth() {return metonDays/metonDraconiticMonths; }



function resize() {
	canvas = document.getElementById("glCanvas");
	canvas.width = $(window).width();	
	canvas.height = $(window).height();
	camera.setOptics({ type: "perspective", fovy : 45.0, aspect : canvas.width/canvas.height, near : 0.10, far : 500.0});
	renderer._props.props.viewport =  { x : 1, y : 1, width: canvas.width, height: canvas.height };
}

// CONTROLLS
var lastX;
var lastY;
var dragging = false;

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;

}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (dragging) {
        pitch = (event.clientY - lastY) * 0.005;
        yaw = (event.clientX - lastX) * -0.005;
        
        lookAt.rotateY(yaw);
        lookAt.rotateX(pitch);

        lastX = event.clientX;
        lastY = event.clientY;
    }
}

function keyboard(e) {
	switch(e.keyCode) {
		case 119: lookAt.translate(0,0,1.2);  break;
		case 115: lookAt.translate(0,0,-1.2);  break;
		case 97:  lookAt.translate(1.2,0,0);  break;
		case 100: lookAt.translate(-1.2,0,0);  break;		
		default: return false;
	}
}

function mouseWheel(event) {
	lookAt.translate(0.0,0.0,event.wheelDelta/120);
}
function mouseWheel_firefox(event) {
	lookAt.translate(0.0,0.0,event.detail);
}

function addControlListener() {
canvas = document.getElementById("glCanvas");
canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);
canvas.addEventListener('keypress', keyboard, true);
canvas.addEventListener('mousewheel', mouseWheel, true);
canvas.addEventListener('DOMMouseScroll', mouseWheel_firefox, true);
}

