

PtolemyMixin = function() {

    //TODO: move to ptolemyBase
    this.ptolemizeSpheres = function() {  
      this.ptolemySphere = new Longituder();  
      this.sphere[1].anchor.remove(this.sphere[2]);
      this.sphere[2].anchor.remove(this.ecliptic);
      this.sphere[1].anchor.addNode(this.ptolemySphere);
      this.ptolemySphere.anchor.addNode(this.sphere[2]);
      this.ptolemySphere.addNode(this.ecliptic);
      this.sphere[4].remove(this.sphere[4].anchor);
      this.sphere[4].ptolemy =  new Node(); 
      this.sphere[4].addNode(this.sphere[4].ptolemy);      
      this.sphere[4].ptolemy.addNode(this.sphere[4].anchor); 
      
    };
}