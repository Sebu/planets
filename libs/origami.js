
var Ori = Ori || {};


Ori.Canvas = function() {
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

Ori.Canvas.prototype.constructor = Ori.Renderer;


Ori.Effect = function(data) {
  this.data = data;
}


Ori.Audio = function() {
//  this.data = new Audio("file:///media/daten/music2/%5BThe%20Knoxsville%20Music%5D%20Of%202010/65%20All%20To%20All.mp3"); 
  this.data = new Audio("http://www.pacdv.com/sounds/interface_sound_effects/sound37.mp3"); 
};

Ori.Audio.prototype.constructor = Ori.Audio;

Ori.Audio.prototype = {
};

Ori.audio = new Ori.Audio();


 
Ori.Input = function() {
    
    this.KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40 };
    
    this.keymap = {};
    this.mouse = {x:0, y:0, z:0, wheel: false, b1: false, b2: false};
    window.addEventListener('keydown', this.keyDown.bind(this), false);
    window.addEventListener('keyup', this.keyUp.bind(this), false);


};

Ori.Input.prototype.constructor = Ori.Input;


Ori.Input.prototype = {
  trackMouseOn : function(element) {
    element.addEventListener('mousewheel', this.mouseWheel.bind(this), false);
    element.addEventListener('DOMMouseScroll', this.mouseWheelFox.bind(this), false);
    element.addEventListener('mousedown', this.mouseDown.bind(this), false);
    element.addEventListener('mouseup', this.mouseUp.bind(this), false);
    element.addEventListener('mousemove', this.mouseMove.bind(this), false);    
  },
  keyDown : function(e) {
    this.keymap[e.keyCode] = true;
  },

  keyUp : function(e) {
    this.keymap[e.keyCode] = false;
  },

  mouseDown : function(e) {
    if(e.button == 0) this.mouse.b1 = true;
    this.drag = {x: e.clientX, y: e.clientY};
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
    this.drag = {x: this.mouse.x , y: this.mouse.y};
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
