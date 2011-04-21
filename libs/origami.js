
var Ori = Ori || {};


Ori.Renderer = function() {
        if(Modernizr.webgl) {
            this.graphics = new THREE.WebGLRenderer({antialias: true});
            this.graphics.type = "webgl";
        }
        else if(Modernizr.canvas) {
          this.graphics = new THREE.CanvasRenderer({antialias: true});
          this.graphics.type = "canvas";
        }
        this.graphics.autoClear = false;
        this.graphics.sortObjects = false;

        return this.graphics;
}

Ori.Renderer.prototype.constructor = Ori.Renderer;

Ori.Input = function() {
    
    this.KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40 };
    
    this.keymap = {};
    this.mouse = {x:0, y:0, z:0, wheel: false, b1: false, b2: false};
    window.addEventListener('keydown', this.keyDown.bind(this), false);
    window.addEventListener('keyup', this.keyUp.bind(this), false);
    window.addEventListener('mousewheel', this.mouseWheel.bind(this), false);
    window.addEventListener('DOMMouseScroll', this.mouseWheelFox.bind(this), false);
    window.addEventListener('mousedown', this.mouseDown.bind(this), false);
    window.addEventListener('mouseup', this.mouseUp.bind(this), false);
    window.addEventListener('mousemove', this.mouseMove.bind(this), false);

};

Ori.Input.prototype.constructor = Ori.Input;

Ori.Input.prototype = {
  keyDown : function(e) {
    this.keymap[e.keyCode] = true;
  },

  keyUp : function(e) {
    this.keymap[e.keyCode] = false;
  },

  mouseDown : function(e) {
    if(e.button == 0) this.mouse.b1 = true;
  },

  mouseUp : function(e) {
    if(e.button == 0) this.mouse.b1 = false;
  },

  mouseMove : function(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  },

  mouseWheel : function(e) {
    this.mouse.z = e.wheelDelta/120;
    this.mouse.wheel = true;
  },

  mouseWheelFox : function(e) {
    this.mouse.z = e.detail;
    this.mouse.wheel = true;
  },

  update : function() {
    this.mouse.wheel = false;
  }

};

Ori.input = new Ori.Input();



Ori.App = function() {
  this.components = [];
};

Ori.App.prototype.constructor = Ori.App;

Ori.App.prototype = {

  init : function() {},


  run : function() {
    time = 0;
    this.update(time);
    this.draw(time);

//    for(i=0; i< this.components.length; i++) {
//      component = components[i];
//      if(component.enabled) component.update(time);      
//      if(component.enabled && component.drawable) component.draw(time);      
//    }
  }

};
