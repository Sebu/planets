describe("An unmodified model", function() {

  var model;
  
  setupCommonGeomerty();
  
  beforeEach(function() {
    model = new ModelBase();
    model.create();
    model.genSpheres({spheres : 4});
  });
    
  it("preverse state", function() {
      console.log(defaultPreset);
      model.loadPreset(defaultPreset);
      excpect(model.getPreset()).toBe(defaultPreset);
  });
});
