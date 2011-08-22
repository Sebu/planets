/**
 * @constructor
 */
ModelCompareBase = function() {

  this.models = [];


  this.update = function(time) {
    for(var i in this.models) {
      i.update(time);
    }
  }


  this.reset = function() {
    for(var i in this.models) {
      i.reset();
    }
  }

    
};

ModelCompareBase.prototype.constructor = ModelCompareBase;
