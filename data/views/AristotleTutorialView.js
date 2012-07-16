

AristotleTutorialView = function() {
};
AristotleTutorialView.prototype = new AristotleView;
AristotleTutorialView.prototype.constructor = AristotleTutorialView;


AristotleTutorialView.prototype.state1 = function(model) {

  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false } 
          ]
  });

}

AristotleTutorialView.prototype.state2 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 3, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 5, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 3, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -3, RotateStart: 0, ShowSphere: true },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false } 
          ]  
  });
;
}

AristotleTutorialView.prototype.state3 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 24.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 90.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false } 
          ]  
  });

}

AristotleTutorialView.prototype.state4 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 24.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: false },
            { ShowSphere: false } 
          ]  
  });

}

AristotleTutorialView.prototype.state5 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: false },
            { ShowSphere: false } 
          ]  
  });

}

AristotleTutorialView.prototype.state6 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: false } 
          ]  
  });

}

AristotleTutorialView.prototype.state7 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 1, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { Speed: 0, ShowSphere: true } 
          ]  
  });

}

AristotleTutorialView.prototype.state8 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 1, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { ShowSphere: true },
            { Speed: 1, ShowSphere: true } 
          ]  
  });

}
