var Ori = Ori || {
    version : "1.0"
};

Ori.supportsWebGL = function() {
    try { 
      return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
    } catch( e ) { return false; }
};

Ori.supportsCanvas = function() {
    return !!document.createElement('canvas').getContext;
};


Ori.Q = { NONE : 0, LOW : 1, MEDIUM : 2, HIGH : 3 };

Ori.GfxProfiles = {
  undefined: {
    resolution : 1.0,
    particles : Ori.Q.NONE,
    textures : Ori.Q.LOW,
    geometry : Ori.Q.LOW,
    alpha : Ori.Q.NONE,
    shading : Ori.Q.LOW
    },   
  canvas: {
    resolution : 1.0,
    particles : Ori.Q.NONE,
    textures : Ori.Q.MEDIUM,
    geometry : Ori.Q.LOW,
    alpha : Ori.Q.NONE,
    shading : Ori.Q.LOW
    },
  webgl: {
    resolution : 1.0,
    particles : Ori.Q.HIGH,
    textures : Ori.Q.MEDIUM,
    geometry : Ori.Q.HIGH,
    alpha : Ori.Q.HIGH,
    shading : Ori.Q.HIGH
    }    
};

Ori.gfxProfile = Ori.GfxProfiles.undefined;
/**
 * @constructor
 */
Ori.Canvas = function(params) {
        if(Ori.supportsWebGL() && !params.forceCanvas) {
            this.graphics = new THREE.WebGLRenderer(params);
            this.graphics.type = "webgl";
        }
        else if(Ori.supportsCanvas()) {
          this.graphics = new THREE.CanvasRenderer(params);
          this.graphics.type = "canvas";
        }
//        this.graphics.autoClear = false;
        this.graphics.sortObjects = false;

        Ori.gfxProfile = Ori.GfxProfiles[this.graphics.type];
       
        return this.graphics;
}

Ori.Canvas.prototype.constructor = Ori.Renderer;



Ori.CANVAS_ERROR = "bla";


Ori.gfxStore = [];

Ori.registerGfx = function(node) {
  Ori.gfxStore.push(node);
  node.setQuality(Ori.gfxProfile);
}

Ori.loadContent = function(uri) {
  var ext = uri.split('.').pop();
  switch (ext) {
    case "mp3":
      var content = new Audio(uri); 
      //content.load();
      break;
  }

  return content;
}

Ori.KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40, S:83, W:87, A:65, D:68, SCROLL: 145 };


/**
 * @constructor
 */
Ori.Timer = function() {
  this.time = 0;
  this.maxStep = 0.1;
  this.lastTime = 0;
   
};

Ori.Timer.prototype.constructor = Ori.Timer;

Ori.Timer.prototype.tick = function() {
  var currentTime = Date.now();
  var deltaTmp = (currentTime - this.lastTime) / 1000;
  this.lastTime = currentTime;

  var delta = Math.min(deltaTmp, this.maxStep);
  this.time += delta;
  return delta;
};



/**
 * @constructor
 */
Ori.Input = function() {
    
    this.keymap = {};
    this.binding = {};
    this.mouse = {x:0, y:0, z:0, wheel: false, b1: false, b2: false, b3: false};



};

Ori.Input.prototype.constructor = Ori.Input;


Ori.Input.prototype = {

  trackKeysOn : function(element) {
    element.addEventListener('keydown', this.keyDown, false);
    element.addEventListener('keyup', this.keyUp, false);
  },
  trackMouseOn : function(element) {
    element.addEventListener('mousewheel', this.mouseWheel, false);
    element.addEventListener('DOMMouseScroll', this.mouseWheelFox, false);
    element.addEventListener('mousedown', this.mouseDown, false);
    element.addEventListener('mouseup', this.mouseUp, false);
    element.addEventListener('mousemove', this.mouseMove, false);    
  },
  
  trackTouchOn : function(element) {
    document.addEventListener("touchstart", this.handleTouch, true);
    document.addEventListener("touchmove", this.handleTouch, true);
    document.addEventListener("touchend", this.handleTouch, true);
    document.addEventListener("touchcancel", this.handleTouch, true);   
  },
  
  keyDown : function(e) {
    Ori.input.keymap[e.keyCode] = true;
  },

  keyUp : function(e) {
    Ori.input.keymap[e.keyCode] = false;
  },
  
  register : function(key, word) {
    this.binding[word] = key;
  },
  
  isDown : function(key) {
    return this.keymap[ this.binding[key] ];
  },

  mouseDown : function(e) {
    if(e.button == 0) Ori.input.mouse.b1 = true;
    if(e.button == 1) Ori.input.mouse.b2 = true;    
//    if(e.button == 2) Ori.input.mouse.b3 = true;    
    Ori.input.drag = {x: e.clientX, y: e.clientY};
    
  },

  mouseUp : function(e) {
    if(e.button == 0) Ori.input.mouse.b1 = false;
    if(e.button == 1) Ori.input.mouse.b2 = false;    
//    if(e.button == 2) Ori.input.mouse.b3 = false;     
  },

  mouseMove : function(e) {
    Ori.input.mouse.x = e.clientX;
    Ori.input.mouse.y = e.clientY;
  },

  mouseWheel : function(e) {
    Ori.input.mouse.z = e.wheelDelta/120;
    Ori.input.mouse.wheel = true;
  },

  mouseWheelFox : function(e) {
    Ori.input.mouse.z = -e.detail;
    Ori.input.mouse.wheel = true;
  },

  reset : function() {
    this.mouse.wheel = false;
    this.drag = {x: this.mouse.x , y: this.mouse.y};
  },
  handleTouch : function(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

             //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }

};

Ori.input = new Ori.Input();


/**
 * @constructor
 */
Ori.App = function() {
  this.targetFps = 10;
  this.targetTime = 1.0/this.targetFps;
  this.elapsedTime = 0;
  this.timer = new Ori.Timer();
};

Ori.App.prototype.constructor = Ori.App;




Ori.App.prototype = {

  loop : function() {
    var time = this.timer.tick();
    this.elapsedTime += time;
//    if(this.elapsedTime >= this.targetTime) {
      this.runningSlow = false;
      if(time >= this.targetTime) {
        this.runningSlow = true;
      }
      this.update(time);
      if(!this.runningSlow)
       this.draw(time);

//      this.elapsedTime = 0;
//    }
    Ori.input.reset();
  },
  
 
  run : function() {
      var self = this;
      (function requestLoop() {
        self.loop();
        requestAnimFrame(requestLoop);
      })();   
  }

};

Storage.prototype.setJson = function(key, value)
{
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getJson = function(key)
{  
  try {
    return JSON.parse(this.getItem(key));
  } catch(e) {
    return this.getItem(key);
  }
};

//window.onerror = function() {
//};

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
