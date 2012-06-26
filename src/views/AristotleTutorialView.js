

AristotleTutorialView = function() {
};
AristotleTutorialView.prototype = new AristotleView;
AristotleTutorialView.prototype.constructor = AristotleTutorialView;


AristotleTutorialView.prototype.switch1 = function(model) {
  model.setSpeed1(1);
  model.setSpeed2(4380);
  model.setSpeed3(390);
  model.setShowSphere1(true);
  model.setShowSphere2(true);
  model.setShowSphere3(true);
  model.setShowSphere4(true);
  model.setShowSphere5(false);
  model.setShowSphere8(false);
//  model.setSpeed4(-390);
}

AristotleTutorialView.prototype.switch2 = function(model) {
  model.setSpeed1(0);
  model.setSpeed2(5);
  model.setSpeed3(3);
  model.setShowSphere1(true);
  model.setShowSphere2(true);
  model.setShowSphere3(true);
  model.setShowSphere4(true);
  model.setShowSphere5(false);
  model.setShowSphere8(false);
}

AristotleTutorialView.prototype.switch3 = function(model) {
  model.setSpeed1(0);
  model.setSpeed2(0);
  model.setSpeed3(0);
  model.setSpeed4(200);
  model.setShowSphere1(true);
  model.setShowSphere2(true);
  model.setShowSphere3(true);
  model.setShowSphere4(true);
  model.setShowSphere5(true);
  model.setShowSphere8(false);
}
