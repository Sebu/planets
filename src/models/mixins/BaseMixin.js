BaseMixin = function() {
    

    this.setAxisAngle1 = function(angle) {
        this.sphere[1].setAxisAngle(90 - angle);
    }
    
        // TODO: hacky all over
    this.setSpeed1 = function(speed) {
          if (this.sphere[1].getSpeed()==0 && speed == 1) {
            this.setAnimSpeed(this.getAnimSpeed()*config.speedFactor);
          } else if(this.sphere[1].getSpeed()!=0 && speed == 0) {
            this.setAnimSpeed(this.getAnimSpeed()/config.speedFactor);
          }
          this.sphere[1].setSpeed(-speed);

          //TODO: move DOM change to callback?          
          $("#AnimSpeed > input").attr("value",Number(this.getAnimSpeed()));

    }
    /**
    * @function
    * @returns speed of sphere 1 
    */
    this.getSpeed1 = function() { return -this.sphere[1].getSpeed() };
}