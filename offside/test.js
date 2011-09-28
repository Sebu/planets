


// see libs/origami.js for Ori namespace
myApp = function(params) {
    Ori.App.call(this);
    this.init(params);
};
myApp.prototype = new Ori.App;
myApp.prototype.constructor = myApp;


myApp.prototype.init = function(params) {

        this.scenes = [];
        // create models
        models = {}; //new Object;
        
        for (var m in TestPairs) {
          this.currentModel = planetPresets[m];
        
          for(var n in TestPairs[m]) {
            
            for(var j in TestPairs[m][n]) { break; }
            
            var tests = TestPairs[m][n],
            ul = $("#mainBox").append("<table>" + n + "</table>"),
            i;
            
            this.loadPreset(planetPresets[m][n]);

            for(i in tests) { 

              model.setDate(tests[i].date);
              model.addDays(0.5);
              var longReal = Math.abs( model.planet.longitude-180 ),
              longRef =  Math.abs( Number(Utils.toDec( tests[i].longitude )) - 180 ),
              latReal = model.planet.latitude,
              latRef = Number( Utils.toDec(tests[i].latitude) ),
              colorLong = "#FFF",
              colorLat = "#FFF";
                 
              if ( Math.abs(longReal - longRef) > 0.4) colorLong="#F44";        
              if ( Math.abs(latReal - latRef) >= 0.16) colorLat="#F44";      
                          
              ul.append("<tr><td style='color:" + colorLong + ";'>" + (longReal - longRef).toFixed(2)  + 
                       "</td><td style='color:" + colorLat + ";'>"  + ( latReal - latRef).toFixed(2)  + 
  //                     "</td><td>"  + latRef.toFixed(2) +
                       "</td></tr>");                     
              
            }
          }
        }

    };



// update loop
myApp.prototype.update = function(time) {

//        model.update(time);
    };


myApp.prototype.draw = function(time) {
    };

myApp.prototype.newScene = function() {
        var scene = new THREE.Scene();
//        this.scenes.push(scene);
        return scene;
    };

//TODO: shorten like eval(name + "()");
myApp.prototype.getModel = function(name) {
  var mod = models[name];
  if(!mod) {
    models[name] = new window[name]({renderer: this});
    mod = models[name];
  };
  return mod;
};


//TODO: move to ui specific stuff
// change planet model and create the UI ELEMENTS + add to DOM
myApp.prototype.loadPreset = function(planet) {

        // switch model
//        this.currentPreset = preset;
        model = this.getModel(planet.model);
        model.loadPreset(planet);



    };
    



// setup site
// TODO: maybe move to index.html
app = new myApp({domRoot: $("#mainBox")});
window.onresize = function(e) { app.resize(e) };
app.run();


