
var criticalApparatus = {
"Met1073b2" : [["Ross Jaeger Christ Al<sup>c</sup>", "τις"] , ["codd.",  "τίς"]],
"Met1073b4a" :[["Ross Jaeger codd.", "φορῶν"] , ["Al<sup>c</sup>",  "σφαιρῶν"]],
"Met1073b4b" :[["Ross Jaeger", "οἰκειοτάτης"] , ["γρ. J",  "οἰκειότητος"]],
"Met1073b4c" : [["Ross Jaeger, Al<sup>c</sup>, Them., Bonitz", "φιλοσοφίᾳ"] , ["codd. Γ",  "φιλοσοφίας"]],
"Met1073b14" :[["Ross Jaeger", "τῶν ζητούντων"] , ["bis E",  "τῶν ζητούντων"]],
"Met1073b16" :[["Ross Jaeger", "δὲ"] , ["om. J<sup>1</sup>", "&nbsp;&nbsp;"]],
"Met1073b26a" :[["Ross Jaeger", "εἶναι"] , ["om. Them.",  "&nbsp;&nbsp;"]],
"Met1073b26b" :[["Ross Jaeger", "ταύτῃ"] , ["recc.",  "ταύτην"]],
"Met1073b26c" :[["Ross Jaeger", "τὸν"] , ["A<sup>b</sup>",  "τὸ"]],
"Met1073b31" :[["Ross Jaeger", "τοὺς δὲ"] , ["E",  "τοῦ δὲ"]],
"Met1073b32" :[["Ross Jaeger", "θέσιν"] , ["Al.<sup>c</sup>",  "τάξιν"]],
"Met1073b33" :[["Ross Jaeger", "[τοῦτ' ἔστι τῶν ἀπο-"] , ["om. E",  "&nbsp;&nbsp;"], ["Al<sup>c</sup> apud Ross", "τοῦτ' ἔστι τῶν δια-"] ,["Al<sup>p</sup>", "τάξιν τοῦτ' ἔστι τῶν ἀπο-"], ["alt. cod.",  "τοῦτ' ἔστι τῶν ἀπο-"]],
"Met1073b34" :[["Ross Jaeger", "στημάτων τὴν τάξιν],"] , ["om. E",  "&nbsp;&nbsp;"] , ["Al<sup>c</sup> apud Ross",  "στημάτων"] , ["Al<sup>p</sup>", "στημάτων"], ["alt. cod.",  "στημάτων τὴν τάξιν,"]],
"Met1073b35a" :[["Ross Jaeger", "ἐκείνῳ"] , ["Α<sup>b</sup>",  "ἐκεῖνο"]],
"Met1073b35b" :[["Ross Jaeger", "ἡλίῳ καὶ τῇ"] , ["recc.",  "ἡλίου καὶ τῷ "]],
"Met1073b36a" :[["Ross", "ἡσελήνῃ"] , ["recc.",  "σελήνης"]],
"Met1073b36b" :[["Ross Jaeger", "ἔτι προσθετέας"] , ["in marg. J",  "&nbsp;&nbsp;"]],
"Met1073b37" :[["Ross Jaeger", "μέλλει"] , ["E<sup>2</sup> corr Simpl.",  "μέλλοι"]],
"Met1074a1" :[["Ross Jaeger", "πᾶσαι"] , ["om. J<sup>1</sup>",  "&nbsp;&nbsp;"]],
"Met1074a3" :[["Ross Jaeger", "ἀποκαθιστάσας"] , ["J A<sup>b</sup>",  "ἀποκαθιστώσας"]],
"Met1074a6" :[["Ross Jaeger", "ἐπεὶ οὖν"] , ["Al<sup>c</sup>",  "ὥστε"]],
"Met1074a8" :[["Ross Jaeger", "τὸ κατωτάτω τεταγμένον"] , ["Al<sup>c</sup>",  "τὸ κάτω"]],
"Met1074a10" :[["Ross Jaeger Π A<sup>b</sup> in man. before erasure", "δὴ"] , ["A<sup>b</sup> over erasure",  "δὲ"]],
"Met1074a11" :[["Ross Jaeger A<sup>c</sup>", "τε"] , ["Simpl om.",  "&nbsp;&nbsp;"]],
"Met1074a12" :[["Ross Jaeger", "δὲ τῇ"] , ["Α<sup>b1</sup>",  "δὲ τῆς"]],
"Met1074a13" :[["Ross Jaeger", "ἑπτά"] , ["error according to Sosigenes per Al.",  "ἐννέα"]],
"Met1074a14" : [["Ross  Jaeger codd. Γ Al<sup>c</sup>" , "σφαιρῶν"] , ["Simpl.<sup>c</sup> Them<sup>c</sup> ci Krische (Jaeg.)",  "φορῶν"]],
"Met1074a16" :[["Ross Jaeger", "[καὶ τὰς αἰσθητὰς]"] , ["Al<sup>c</sup> Goebel",  "&nbsp;&nbsp;"] , ["codd.",  "καὶ τὰς αἰσθητὰς"]]
}


var APP_STRINGS = {
  EN : {
  // select box
  CUSTOM : "Customized",
  CUSTOM_NEW : 'Please enter a name for the new preset.',
  
  //box caption texts
  MOON_CYCLE_TEXT : "Moon year month day cycle",
  ROTATION_START_CAPTION : "Rotation Start (degrees)",
  
  //labels
  NORTH_POLE : "North pole",
  SOUTH_POLE : "South pole",
  VERNAL : "Vernal Equinox",  
  PLANET : "Planet",
  SUN : "Sun",    
  MOON : "Moon",    
  
  //tooltips
  VIS_TIP : "change view point and parameters and toogle visibility of spheres and more",
  ANGLE_TIP : "tooltip test",

  // error texts
  NO_HTML5: "<div>Your browser does not seem to understand <a href='http://en.wikipedia.org/wiki/HTML5'>HTML5</a>. The following experience requires a browser with either <a href='http://en.wikipedia.org/wiki/Canvas_element'>Canvas</a> or <a href='http://en.wikipedia.org/wiki/Webgl'>WebGL</a> support.</div><br><div>Such support can be found in <a href='http://www.google.com/chrome'>Google Chrome 3.0+</a>, <a href='http://www.mozilla.org/de/firefox/'>Firefox 3.0+</a>, <a href='http://www.apple.com/safari/'>Safari 3.0+</a>, <a href='http://windows.microsoft.com/de-DE/internet-explorer/products/ie/home'>Internet Explorer 9.0+</a> or <a href='http://www.opera.com/'>Opera 10.0+</a>.</div>",
  NO_WEBGL: "<div><a href='http://en.wikipedia.org/wiki/Webgl'>WebGL</a> is not enabled or supported by your browser or graphics card. A guide to enable it in Google Chrome, Firefox, and Safari can be found <a href='http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>here</a>.</div><br><div>The Following experience will be limited.</div>"
  }
};


