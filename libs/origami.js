

PI_SCALE = 180.0/Math.PI;

degToRad = function(deg) {
    return (deg/180)*Math.PI;
}


calcAngle = function(pos1, pos2) {
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}

calcAngleRel = function(node1, node2, center) {
    var pos1 = center.subtract( node1 );
    var pos2 = center.subtract( node2 );
    return	Math.acos(pos1.toUnitVector().dot(pos2.toUnitVector()))*PI_SCALE;
}



var Ori = Ori || {};

/**
 * @constructor
 */
Ori.Canvas = function(params) {
        if(Modernizr.webgl && !params.canvas) {
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

/**
 * @constructor
 */
Ori.Audio = function() {
//  this.data = new Audio("file:///media/daten/music2/%5BThe%20Knoxsville%20Music%5D%20Of%202010/65%20All%20To%20All.mp3"); 
  
  this.data = new Audio("http://www.pacdv.com/sounds/interface_sound_effects/sound37.mp3"); 
  this.data.load();
};

Ori.Audio.prototype.constructor = Ori.Audio;

Ori.Audio.prototype = {
};

Ori.audio = new Ori.Audio();

Ori.loadContent = function(uri) {
  var ext = uri.split('.').pop();
  switch (ext) {
    case "mp3":
      var content = new Audio(uri); 
      content.load();
      break;
  }

  return content;
}

Ori.KEY = { RIGHT:39, UP:38, LEFT:37, DOWN:40, S:83, W:87, A:65, D:68 };

/**
 * @constructor
 */
Ori.Input = function() {
    
    this.keymap = {};
    this.binding = {};
    this.mouse = {x:0, y:0, z:0, wheel: false, b1: false, b2: false};
    window.addEventListener('keydown', this.keyDown, false);
    window.addEventListener('keyup', this.keyUp, false);


};

Ori.Input.prototype.constructor = Ori.Input;


Ori.Input.prototype = {

  trackMouseOn : function(element) {
    element.addEventListener('mousewheel', this.mouseWheel, false);
    element.addEventListener('DOMMouseScroll', this.mouseWheelFox, false);
    element.addEventListener('mousedown', this.mouseDown, false);
    element.addEventListener('mouseup', this.mouseUp, false);
    element.addEventListener('mousemove', this.mouseMove, false);    
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
    Ori.input.drag = {x: e.clientX, y: e.clientY};
  },

  mouseUp : function(e) {
    if(e.button == 0) Ori.input.mouse.b1 = false;
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
    Ori.input.mouse.z = e.detail;
    Ori.input.mouse.wheel = true;
  },

  reset : function() {
    this.mouse.wheel = false;
    this.drag = {x: this.mouse.x , y: this.mouse.y};
  }

};

Ori.input = new Ori.Input();


/**
 * @constructor
 */
Ori.App = function() {
  this.fps = 30;
};

Ori.App.prototype.constructor = Ori.App;

Ori.App.prototype = {

  mainLoop : function() {
    this.update();
    this.draw();
    Ori.input.reset();
  },
  
  run : function() {
      self = this;
      setInterval(function() { self.mainLoop(); }, 33);

//    for(i=0; i< this.components.length; i++) {
//      component = components[i];
//      if(component.enabled) component.update(time);      
//      if(component.enabled && component.drawable) component.draw(time);      
//    }
  }

};
