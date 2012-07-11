

AristotleTutorialView = function() {
};
AristotleTutorialView.prototype = new AristotleView;
AristotleTutorialView.prototype.constructor = AristotleTutorialView;


AristotleTutorialView.prototype.state1 = function(model) {

  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 1, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 45.0, Speed: -390, RotateStart: 0, ShowSphere: true }
          ]
  });

}

AristotleTutorialView.prototype.state2 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 3, RotateStart: 0 },
            {AxisAngle: 24.0, Speed: 5, RotateStart: 0 },
            {AxisAngle: 90.0, Speed: 3, RotateStart: 0 },
            {AxisAngle: 45.0, Speed: -3, RotateStart: 0 }
          ]
  });
;
}

AristotleTutorialView.prototype.state3 = function(model) {
  model.setPreset({
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 45.0, Speed: 200, RotateStart: 0 }
          ]
  });

}
