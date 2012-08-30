

/**
 constructor of the Topoi Cosmology App
 setup canvas, input, camera, gui, models etc.
 @extends Ori.App
 @constructor
 @param params
 @param params.domRoot dom element to add the canvas to
*/
cosmoApp = function(params) {
        this.domRoot = params.domRoot;
        this.currentScene = null;
        this.models = {};
        this.views = {};
//        this.mouseDrag = { x: 0, y: 0};
        
        // create canvas (WebGL if possible)
        this.canvas = new Ori.Canvas({forceCanvas: 0, clearAlpha: 0, antialias: 1});
        
        this.splashStatus = $('#splash-status');

        // add Canvas DOM Element & or error box
        this.splashStatus.empty();
        if(this.canvas) {
          this.domRoot.append(this.canvas.domElement);
        } else {
          this.splashStatus.append(APP_STRINGS.EN.NO_HTML5);
          return;
        }

        this.splashStatus.empty();
        this.splashStatus.append('setup cameras...');
        this.setupCameras();
        
        this.splashStatus.empty();
        this.splashStatus.append('register input...');        
        this.setupInput();

        // setupPicking  for collision
        this.projector = new THREE.Projector();
        
        this.splashStatus.empty();
        this.splashStatus.append('setup UI...');
        this.setupUI();

        // load default model
        this.loadModel('Eudoxus');
        this.resize();
        
        var openPage = function() {
        
        };
        
        // NO WEBGL error
        if(this.canvas.type === 'canvas') {
//          this.debugBox.show();
            this.splashStatus.empty();
            this.splashStatus.append(APP_STRINGS.EN.NO_WEBGL);
            this.splashStatus.append('<br>');
            $('<div>')
                .addClass('button right')
                .click( function() {
                    that.openBook();
                })
                .text('let\'s go >')
                .attr('value','ok')
                .appendTo(this.splashStatus);
          
        } else {
            this.openBook();                     
        }

        
};
cosmoApp.prototype = new Ori.App;
cosmoApp.prototype.constructor = cosmoApp;


cosmoApp.prototype.openBook = function() {
    $('#splash').hide();
    $('.page, .book').addClass('open');
    this.resize();
};

/**
 * 
 */
cosmoApp.prototype.setupUI = function() {
        // setupDebug
        // DEBUG und stats.js
        that = this;

/*
        this.debugBox = $("<div class='container' id='debugContainer'>\
                     </div>").appendTo(this.domRoot);        
        this.stats = new Stats();
        Ori.input.register(Ori.KEY.SCROLL, 'DEBUG');
        this.debugBox.append( this.stats.domElement );
*/        

        // setupLabels
       
        //TODO: move labels to html code (style / rename etc.)
        
        equinoxLabel = new UI.Label({text: APP_STRINGS.EN.VERNAL});
        npoleLabel = new UI.Label({text: APP_STRINGS.EN.NORTH_POLE });
        spoleLabel = new UI.Label({text: APP_STRINGS.EN.SOUTH_POLE});
        northLabel = new UI.Label({text: 'North'});
        southLabel = new UI.Label({text: 'South'});
        eastLabel = new UI.Label({text: 'East'});
        westLabel = new UI.Label({text: 'West'});
        sunLabel = new UI.Label({text: APP_STRINGS.EN.SUN });
        planetLabel = new UI.Label({text: APP_STRINGS.EN.PLANET });
        
       
        this.modelSelect = $('#model-select').selectBox();
        this.planetSelect = $('#planet-select').selectBox();
        this.presetSelect = $('#preset-select').selectBox(); 
        

        this.modelSelect.change(function modelSelectChange(value) { 
            that.loadModel(this.options[this.selectedIndex].value);
        });  
        
        this.planetSelect.change(function planetSelectChange() { 
            that.loadPlanet(this.options[this.selectedIndex].value);
        }); 
        
        this.presetSelect.change(function presetSelectChange() {
            that.loadPreset(this.options[this.selectedIndex].value);
        }); 

        $('#moon-select').click(function moonSelectClick() {
            that.model.setCurrentMoonModel(this.options[this.selectedIndex].value);
            that.model.reset(); 
        });  
        
        UI.optionsFromHash('#moon-select', moonModels);
          
        $('#add-preset').click(function addPresetClick() { that.addPreset(); } );  
        $('#remove-preset').click(function removePresetClick() { that.removePreset(); } ); 


//        document.getElementById('left-page').onresize = function(e) { that.resize(e) };
 
 
        $('#info-button').click(function infoButtonClick() { 
            $(this).hide();
            $('#fullscreen-button').show();
            $('#left-page, #right-page, #canvas-main').removeClass('fullscreen');            
            $('#left-page').width( window.innerWidth/2 );            
            that.resize();
        });
               
        $('#fullscreen-button').click(function fullscreenButtonClick() { 
            $(this).hide();
            $('#info-button').show();   
            $('#left-page, #right-page, #canvas-main').addClass('fullscreen');
            $('#left-page').width( window.innerWidth - $('#content').width() );
            that.resize();
        });
        
              
        this.loadCustomPresets();
        
        $('#ui-container h3').collapsible(); //.tooltip();
        $('#info-container h3').collapsible();
        $('#ui-container, #info-container').show();

        
        $('#camera-select')
            //.selectBox()
            .change(function camera_select_change() {
                that.setCamera(this.value); 
                that.resize();
            }); 

        
        $('#latitude-select').change(function latitudeSelectChange() { 
            $('#AxisAngle1 > input')
                .attr('value', this.value)
                .change(); 
        }); 


        $('#reset-button').click(function resetButtonClick() { 
            that.model.reset();
        });
        
        $('#pause-button').click(function pauseButtonClick() { 
            that.model.toggleRunning(); 
            if(that.model.getRunning()) { 
                $('#pause-button').text('pause');
            } else { 
                $('#pause-button').text('play');
            }
        }); 

        $('#screenshot-button').click(function screenshotButtonClick() {
            that.canvas.render(that.currentScene, that.model.getCamera());
            downloadDataURI({
                filename: 'screenshot.jpeg', 
                data: that.canvas.domElement.toDataURL('image/jpeg')
            });
        //    window.open(app.canvas.domElement.toDataURL('image/jpeg'));
        }); 
        
        $('#date-input').bind('keyup', function dateInputReturn(e) { 
            if(e.keyCode == 13) 
                that.setDate(this.value); 
        });

        $('#sidebar-button').click(function sidebarButtonClick() { 
             $('#right-page').toggleClass('sidebared');
             $('#content-scroll').toggleClass('hide');
             $('#ui-container').toggleClass('hide');

        });


                
        $('#rotate-reset').click(function rotateResetClick() {
           var 
           cam = that.model.getCamera();
           cam.setZ(-18);
           cam.reset();
           cam.rotateY(Math.PI + 0.1);
           cam.rotateTarget({x: 0, y: 0, z: 0});
        });
        
        $('#rotate-left').click(function rotateLeftClick() {
           tween = new TWEEN.Tween( { rot : 0.05 } )
            .to( { rot: 0.0 }, 200 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onUpdate( function () {
                that.model.getCamera().mouseY(this.rot);
            } )
            .start();
            //that.model.getCamera().mouseY(0.1);
        });

        $('#rotate-right').click(function rotate_right_click() {
           tween = new TWEEN.Tween( { rot : 0.05 } )
            .to( { rot: 0.0 }, 200 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onUpdate( function () {
                that.model.getCamera().mouseY(-this.rot);
            } )
            .start();        
            //that.model.getCamera().mouseY(-0.10);
        });
        
        $('#rotate-up').click(function rotate_up_click() {
           tween = new TWEEN.Tween( { rot : 0.05 } )
            .to( { rot: 0.0 }, 200 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onUpdate( function () {
                that.model.getCamera().mouseX(-this.rot);
            } )
            .start();        
        });
        
        $('#rotate-down').click(function rotate_down_click() {
           tween = new TWEEN.Tween( { rot : 0.05 } )
            .to( { rot: 0.0 }, 200 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onUpdate( function () {
                that.model.getCamera().mouseX(this.rot);
            } )
            .start();        
        });        
                
        $('#zoom-plus').click(function zoom_plus_click() { 
           tween = new TWEEN.Tween( { rot : that.getZ() } )
            .to( { rot: that.getZ()+2 }, 100 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onUpdate( function () {
//                that.model.getCamera().mouseY(this.rot);
                that.setZ(this.rot);
                $('#zoom-slider').slider('value',that.getZ());
            } )
            .start();          
            //that.setZ(that.getZ()+1);
            
        });
        
        $('#zoom-minus').click(function zoom_minus_click() { 
           tween = new TWEEN.Tween( { rot : that.getZ() } )
            .to( { rot: that.getZ()-2 }, 100 )
            .easing( TWEEN.Easing.Quadratic.InOut )
            .onUpdate( function () {
//                that.model.getCamera().mouseY(this.rot);
                that.setZ(this.rot);
                $('#zoom-slider').slider('value',that.getZ());
            } )
            .start();          
           // that.setZ(that.getZ()-1);
           // $('#zoom-slider').slider('value',that.getZ());
        });
                
        this.zoomSlider = $('#zoom-slider').slider({
                orientation: 'vertical',
//                range: 'min',
                animate: 'fast',
                min: -60,
                max: 0,
                value: -17,
                step:1,
                slide: function zoom_slider_slide(event, ui) { that.setZ(ui.value); }
         });

        this.canvas.domElement.addEventListener('mousewheel', function mouseWheel(e) {
            that.model.getCamera().mouseWheel(0.0, 0.0, e.wheelDelta/120);
            //this.zoomSlider.slider('value',that.getZ());            
        });
        this.canvas.domElement.addEventListener('DOMMouseScroll', function mouseWheelFirefox(e) {
            that.model.getCamera().mouseWheel(0.0, 0.0, -e.detail);
            //this.zoomSlider.slider('value',that.getZ());            
        });        
        
        var 
        mouse = {
            x: 0,
            y: 0,
            button: false
        };
        
        this.canvas.domElement.addEventListener('mousedown', function mouseDown(e) {
            mouse.button = (e.button == 0);                   
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        this.canvas.domElement.addEventListener('mouseup', function mouseUp(e) {
            mouse.button = !(e.button == 0);                    
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        this.canvas.domElement.addEventListener('mousemove', function mouseMove(e) {
            if(mouse.button) {
                var 
                yaw = (e.clientX - mouse.x) * - 0.005,
                pitch = (e.clientY - mouse.y) * 0.005;
                that.model.getCamera().mouseY(yaw);
                that.model.getCamera().mouseX(pitch);
                mouse.x = e.clientX;
                mouse.y = e.clientY;            
            }
  
        });
                
  
        $('#camera, #view, #playback').hide();
}
/**
  setup input (mouse and keyboard)
  @function
  TODO: move to view
*/
cosmoApp.prototype.setupInput = function() {

        // track inputs
        Ori.input.trackMouseOn(this.canvas.domElement);
//        Ori.input.trackKeysOn(window);
//        Ori.input.register(Ori.KEY.DOWN, 'DOWN');
//        Ori.input.register(Ori.KEY.UP, 'UP');
}

/**
  setup Cameras ()
  @function
*/
cosmoApp.prototype.setupCameras = function() {
  // setup camera
  // TODO : shorten
  
  var cameraParams = { 
    fov: 70,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far : 10000
  };
  
  this.cameras = { 
    Trackball: { 
      caption: 'Global',
      instance: new THREE.BallCamera(cameraParams)
    },
    FPS: { 
      caption: 'Local',
      instance: new THREE.FPSCamera(cameraParams)
    },
    TrackballIso: { 
      caption: 'Isometric',
      instance: new THREE.BallCamera(cameraParams)
    }
  };
  this.cameras['Trackball'].instance.setEye({x: 0, y: 0, z: -18});
  this.cameras['FPS'].instance.setEye({x: 0, y: 0.5, z: 0});
  this.cameras['TrackballIso'].instance.setEye({x: 0, y: 0, z: -21});
  var ortho = 70;
  this.cameras['TrackballIso'].instance.projectionMatrix.makeOrthographic( 
      window.innerWidth / - ortho,
      window.innerWidth / ortho,
      window.innerHeight / ortho,
      window.innerHeight / - ortho,
      -10,
      1000
   );	
}

cosmoApp.prototype.setDate = function(date) {
    this.model.setDate(date);
}

cosmoApp.prototype.loadModel = function(value) {
  this.modelSelect.selectBox('setText', value);
  //.setText(value);
  //$('#model-select option[value=''+value+'']').attr('selected',true);
  
  $('#remove-preset').toggle( value === 'custom' );
    
  this.currentModel = planetPresets[value];
  
  if(this.currentModel.model) {
    this.currentPlanet = planetPresets;
    //this.planetSelect.hide();
    //this.presetSelect.hide();   
    this.planetSelect.selectBox('setText', '');
    this.presetSelect.selectBox('setText', '');   
    this.loadPreset(value);
    return;
  }
  
  UI.optionsFromHash('#planet-select', this.currentModel);
  //this.planetSelect.show();
  for(var i in this.currentModel) {
    if(i === 'caption') continue;
    this.loadPlanet(i);
    break;
  }
    
};

cosmoApp.prototype.loadPlanet = function(value) {
  //$('#planet-select option[value=''+value+'']').attr('selected',true);
  this.planetSelect.selectBox('setText', value);

  this.currentPlanet = this.currentModel[value];

  if(this.currentPlanet.model) {
    this.currentPlanet = this.currentModel;
    //this.presetSelect.hide();
    this.presetSelect.selectBox('setText', '');
    this.loadPreset(value);
    return;
  }

  UI.optionsFromHash('#preset-select', this.currentPlanet);

  //this.presetSelect.show();
  for(var i in this.currentPlanet) {
    if(i=='caption') continue;    
    this.loadPreset(i);
    this.presetSelect.selectBox('setText', i);
    break;
  }    
};

/** 
 * change planet model and create the UI ELEMENTS + add to DOM 
 * @param preset the preset to load
 */
cosmoApp.prototype.loadPreset = function(preset) {
     
  // switch model
  this.currentPreset = preset;
  var planet = this.currentPlanet[preset];
  this.setPreset(planet);  
};

cosmoApp.prototype.setModel = function(model) {
    this.model = model;
    this.setCurrentScene(this.model.root);
};

cosmoApp.prototype.setPreset = function(preset) {
  // unload view
  if(this.model)
      this.view.cleanUp();
  
      
  // switch model
  this.setModel( this.getModelById(preset.model) );
  $('#left-page > *').hide();
  if(this.model)
    $('#canvas-main').show();
  

  this.model.setPreset(preset.params);

  // load text
  this.updateText(preset.text); // || (preset + '.html') );
        
  // load view
  this.view = this.getViewByName(preset.view);
  this.setCamera('Trackball');
  this.view.setPreset(this.model, preset.viewParams);
  this.updateUI();
  // change view?

}

cosmoApp.prototype.updateText = function(uri) {
    $('#text-right').empty();
    $('#text-right').load(config.textPath + uri);
    //, function() {
    //    $('.selectBox').selectReading();  
    //});
};

/**
 * @function
 * @returns the vault of custom presets from browser localStorage
 */
cosmoApp.prototype.getVault = function() {
  // be able to update the format
  if(!localStorage['version']) {
     localStorage['version'] = 1;
     localStorage['presetCount'] = 0;
     localStorage.setJson('customPresets', { custom: {} });
  }
  var vault = localStorage.getJson('customPresets');
  return vault;
};

/** 
 * add vault/custom data to UI presets list 
 * @function
 */
cosmoApp.prototype.loadCustomPresets = function() {
  var vault = this.getVault();
  vault.custom.caption = APP_STRINGS.EN.CUSTOM;
  if(localStorage['presetCount'] && localStorage['presetCount']>0) $.extend(true, planetPresets, vault);
  UI.optionsFromHash('#model-select', planetPresets);
};


/** 
 * add a new custom preset to the vault 
 * @function
 */
cosmoApp.prototype.addPreset = function() {
    var vault = this.getVault();

    var text = prompt(APP_STRINGS.EN.CUSTOM_NEW, this.model.name + '1');
    if( text && 
        (!vault.custom[text] || confirm('Preset "' + text + '" already exists. Overwrite?'))) {
        
      var store = this.model.getPreset();
      store.caption = text;
      store.view = this.getView().name;
      if( !vault.custom[text] ) 
          localStorage['presetCount'] = Number(localStorage['presetCount']) + 1;      
          
      vault.custom[text] = store;
      localStorage.setJson('customPresets', vault);

      this.loadCustomPresets();
      this.loadModel('custom'); 
      this.loadPlanet(text);
    }
};


/** 
 * remove a custom preset from the vault 
 * @function
 */
cosmoApp.prototype.removePreset = function() {
  var text = this.currentPreset;
  if(!planetPresets.custom[text]) { 
    alert('Preset "' + text + '" is locked.'); return;
  }
  
  if(confirm('Delete preset "' + text + '"?')) {
    var vault = this.getVault();
    delete planetPresets.custom;
    delete vault.custom[text];
    localStorage['presetCount'] = Number(localStorage['presetCount']) - 1;
    localStorage.setJson('customPresets', vault);
  
    this.loadCustomPresets();
    if(Number(localStorage['presetCount'])>0)   
      this.loadModel('custom'); 
    else {
      this.loadModel('Eudoxus');   
    }
  }
};



/**
 * set the current render root scene
 * @param scene the scene from the model to set
 */
cosmoApp.prototype.setCurrentScene = function(scene) {
//        if(this.currentScene) {
//            this.currentScene.remove( this.model.getCamera() );
//        }
        var
        cam = this.model.getCamera();        
        this.currentScene = scene;
        this.model.setCamera(cam);
//        this.currentScene.add( this.model.getCamera() );
};

/**
 * update the planet info box
 */
cosmoApp.prototype.updateInfoBox = function() {
        this.view.updateInfos(this.model);
        this.view.updateOther(this.model, this.model.getCamera(), this.canvas);
}

/** 
*  update loop
*  @override 
*/
cosmoApp.prototype.update = function(time) {

       
//        if(Ori.input.isDown('DEBUG')) debugBox.toggle();

/*
        // zoom with middle button or wheel      
        if (Ori.input.mouse.b2) {
           var 
           y = Ori.input.mouse.y,
           pitch = (y - Ori.input.drag.y) * time;
           
           this.model.getCamera().mouseWheel(0.0, 0.0, -pitch);
           Ori.input.drag.y = y;
        }
        if (Ori.input.mouse.wheel) {
         this.model.getCamera().mouseWheel(0.0, 0.0, Ori.input.mouse.z);
         this.zoomSlider.slider('value',that.getZ());
         //$('#Z > input').attr('value',Number( this.model.getCamera().getZ() ));
        }
*/
        // rotate with left button
/*        
        if (Ori.input.mouse.b1) {
            var x = Ori.input.mouse.x;
            var y = Ori.input.mouse.y;
            var pitch = (y - Ori.input.drag.y) * 0.2 * time;
            var yaw = (x - Ori.input.drag.x) * -0.2 * time;
            this.model.getCamera().mouseY(yaw);
            this.model.getCamera().mouseX(pitch);
            Ori.input.drag.x = x;
            Ori.input.drag.y = y;
        }
*/        
        // update model, info, labels
        this.model.update(time);
        TWEEN.update();
        
        //this.handlePicking(time);

       
        
};

/**
* check for collision/picking of pickable objects
* NOT USED YET
*/
cosmoApp.prototype.handlePicking = function(time) {
    
/* 
        this.model.getCamera().update();
        var x = ( Ori.input.mouse.x / window.innerWidth ) * 2 - 1;
	      var y = -( Ori.input.mouse.y / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3( x, y, 0.5 );

        model.earth.mesh.currentPosFast();
        model.sun.mesh.currentPosFast();        
        model.planet.mesh.currentPosFast();

        vector = this.projector.unprojectVector( vector, this.model.getCamera() );
//        model.dline[0] = this.model.getCamera().position;     
//        model.dline[1] = vector.clone();
//        model.dlineLine.setPos(model.dline);
        var ray = new THREE.Ray( this.model.getCamera().position, vector.subSelf( this.model.getCamera().position ).normalize() );
        var cs = ray.intersectScene(model.root)[0];
        if(cs) { cs.object.material.color.setHex( 0xaa0000 ); }
//*/ 
};


/**
 * sets the current camera select from this.cameras (trackball, isometric trackball, FPS)
 * @param cam the label of the camera to set 
 */
cosmoApp.prototype.setCamera = function(cam) {

  if(!this.model) return;

  this.model.setCamera( this.cameras[cam].instance );
  switch(cam) {
    case 'Trackball':
    case 'TrackballIso':
      this.model.earth.setEnabled(true);
      this.model.earthPlane.setEnabled(false);       
      break;
    case 'FPS':
      this.model.earth.setEnabled(false);
      this.model.earthPlane.setEnabled(true);          
  };
  
}

/** update the moving labels (north etc.)  */
cosmoApp.prototype.updateLabels = function() {
  //OPT: merge dom updates
  northLabel.setPosition( this.model.north.getPosCanvas(this.model.getCamera(), this.canvas) );
  southLabel.setPosition( this.model.south.getPosCanvas(this.model.getCamera(), this.canvas) );
  eastLabel.setPosition( this.model.east.getPosCanvas(this.model.getCamera(), this.canvas) );
  westLabel.setPosition( this.model.west.getPosCanvas(this.model.getCamera(), this.canvas) );
  equinoxLabel.setPosition( this.model.sphere[1].gfx.markerball.getPosCanvas(this.model.getCamera(), this.canvas) );
  npoleLabel.setPosition( this.model.sphere[1].gfx.npole.getPosCanvas(this.model.getCamera(), this.canvas) );
  spoleLabel.setPosition( this.model.sphere[1].gfx.spole.getPosCanvas(this.model.getCamera(), this.canvas) );
  sunLabel.setPosition( this.model.sun.gfx.mesh.getPosCanvas(this.model.getCamera(), this.canvas) ); 
  planetLabel.setPosition( this.model.planet.gfx.mesh.getPosCanvas(this.model.getCamera(), this.canvas) );
};



cosmoApp.prototype.draw = function(time) {
  this.canvas.render(this.currentScene, this.model.getCamera() );
  this.updateInfoBox();
  this.updateLabels(); 
//  this.stats.update();
};

/** on resize adjust camera aspect and canvas size */
cosmoApp.prototype.resize = function() {
  var 
  width = this.domRoot.innerWidth(),
  height = this.domRoot.innerHeight(),
  factor = Ori.gfxProfile.resolution;
  this.canvas.setSize(width*factor, height*factor);
  if(this.model) 
    this.model.getCamera().setAspect(width / height);
};


/**
 * @param name of the model to get 
 * @returns a model instance from cache or generates one (sort of a factory)
 */
cosmoApp.prototype.getModelById = function(name) {
  // fetch existing model
  var mod = this.models[name];
  // or create new
  if(!mod) {
    this.models[name] = new window[name]({renderer: this});
    mod = this.models[name];
  };
  return mod;
};


/**
 * @param name of the view/ui to get 
 * @returns a view instance from cache or generates one (sort of a factory)
 */
cosmoApp.prototype.getViewByName = function(name) {
  // fetch existing model
  var view = this.views[name];
  // or create new
  if(!view) {
    this.views[name] = new window[name]();
    view = this.views[name];
  };
  
  this.view = view;
  return view;
};

cosmoApp.prototype.getView = function() {
    return this.view;
};

cosmoApp.prototype.setFov = function(val) {
  this.model.getCamera().setFov(val);
};


cosmoApp.prototype.getFov = function() {
  return  this.model.getCamera().getFov();
};

cosmoApp.prototype.setZ = function(val) {
  this.model.getCamera().setZ(val);
};


cosmoApp.prototype.getZ = function() {
  if(!this.model.getCamera()) return 0;
  return  this.model.getCamera().getZ();
};

/**
 * build up ui from current model state
 * TODO: move to ui specific stuff or split up a little
 */
cosmoApp.prototype.updateUI = function() {
  
       
       /**
       * move to view
       */
       // default camera
       this.setCamera('Trackball');

       //this.model.getCamera().reset();


        $('#date-input').hide();
        $('#moon-select').hide();  
        $('#info-container tr').hide();


        this.view.setupInfos();
        
        // clear old ui elements
        $('#parameters').empty();
        
        

       

        $('#view-sliders').empty();
        UI.slider({
            model: this.model,
            id: 'AxisAngle1',
            max: 360,
            step:0.01,
            text: 'view latitude',
            tooltip: 'change latitude'
        }).appendTo('#view-sliders');
        
        UI.slider({
            model: this,
            id: 'Fov',
            max: 160,
            step:1,
            text: 'field of view',
            tooltip: 'set field of view'
        }).appendTo('#view-sliders');


        $('#visSpheres').empty();
        
        for (i in this.model.sphere) {
            if(this.model['setShowSphere' + i]) 
                UI.checkbox({
                   model: this.model,
                   id:'ShowSphere' + i,
                   text:'S' + ( Number(i) ),
                   color:  rgbToCSS( this.model.sphere[i].gfx.color ) 
                }).appendTo('#visSpheres');
        }
        
        $('#visOther').empty();
                
        if(this.model.setShowStars) 
            UI.checkbox({
                model: this.model,
                id:'ShowStars',
                text:'stars'
            }).appendTo('#visOther');
            

        if(this.model.setShowSun) 
            UI.checkbox({
                model: this.model,
                id:'ShowSun',
                text:'sun',
                tooltip: 'toggle sun visibilty',
                color: rgbToCSS(config.colors['Sun'])
            }).appendTo('#visOther');
            
        if(this.model.setShowPath) 
            UI.checkbox({
                model: this.model,
                id:'ShowPath',
                text:'path',
                color: rgbToCSS(config.colors['Path'])
            }).appendTo('#visOther');
            
        if(this.model.setShowHippo) 
            UI.checkbox({model: this.model,
                id:'ShowHippo',
                text:'hippopede',
                tooltip: 'toggle hippopede visibilty',
                color:  rgbToCSS(config.colors['Hippo']) 
            }).appendTo('#visOther');
            



        $('#anim-speed').empty().inputSlider({ 
            object: this.model,
            property: 'AnimSpeed',
            min: -1000,
            max: 20000, 
            step: 0.1,
            text: 'Animation Speed',
            tooltip: 'duration of a year in seconds'
        });


        this.view.setupSliders(this.model, this.model.getCamera());

/*
        var 
        tween = new TWEEN.Tween( { z : -60 } )
            .to( { z : -18 }, 2000 )
            .easing( TWEEN.Easing.Elastic.InOut )
            .onUpdate( function () {
                console.log(this.y);
                that.setZ(this.z);
            } )
            .start();
*/            

        // initial update of sliders/state
        this.model.toggleRunning();
//        $('#view-header, #caprotateStart').click(); // #pauseButton
//        $('#camera, #view, #playback').hide(); // #pauseButton
        this.model.toggleRunning();


        $('#parameters input').change();
//        $('#moon input, #angle  input, #speed input').change();
        $('#AxisAngle1 input').change();
        



    };
    



// setup site
// TODO: maybe move to index.html
app = new cosmoApp({domRoot: $('#canvas-main')});
if(app) {
  window.onresize = function(e) { app.resize(e) };
  app.run();
}


