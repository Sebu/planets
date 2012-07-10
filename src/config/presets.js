


var criticalapparatus = {
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


var config = {
  earthTexture : 'images/earthmap2.jpg',
  sunGlowTexture : 'images/sun.png',
  rampTexture : 'images/ramp.png',
  speedFactor : 100.0,
  labelDist : 4.5,
  sphereRadius : 9.0,
  animSpeed : 60,

  // some basic colors
  // just add new
  colors : {
    Earth:  {r: 0.2, g:0.2, b:1.0},
    Planet: {r: 1.0, g:1.0, b:1.0},
    Mars:   {r: 1.0, g:0.5, b:0.5},
	Sun: 	{r:1.0,g:1.0,b:0.0},
	S1:	    {r: 0.3, g: 0.565, b: 0.996}, //{r: 0.3, g: 0.565, b: 0.996},
    S2: 	{r: 1.0, g: 1.0, b: 0.2},	 //{r: 1.0, g: 1.0, b: 0.2},	
	  S3: 	{r: 0.2, g: 1.0, b: 0.2},
	  S4: 	{r: 1.0, g: 0.2, b: 0.2},
	  S5: 	{r:1.0, g: 0.0, b: 1.0},
	  Path: {r: 1.0, g: 1.0, b: 1.0},
	  Hippo:{r: 0.3, g: 0.565, b: 0.996},
	  Hull :{r: 0.3, g: 0.565, b: 0.996}
	}
};



var moonModels = {
 Mendell: { phase: true, Speed1: function(d,z)  {return (d+z); }, Speed2: function(d,z) { return -d; } },
 Schiparelli: { phase: false, Speed1: function(d,z)  {return d; }, Speed2: function(d,z) { return -Math.abs(d-z); } },
 SchFixed: { phase: false, Speed1: function(d,z)  {return -Math.abs(d-z); }, Speed2: function(d,z) { return d; } }
};

var TestPairs = {

  Eudoxus: {
    Moon: {	
      d1: { date: 100, longitude: "115.76", latitude: "4.68"  },
    },
  },
  Ptolemy: {
    Sun: {
//      1: {
      d1: { date: "9.2.139", longitude: "318;50", latitude: "0;0"  },
      d2: { date: "26.9.139", longitude: "180", latitude: "0;0" },
      d3: { date: "22.3.140", longitude: "0", latitude: "0;0" },
      d4: { date: "25.6.140", longitude: "90", latitude: "0;0" }
//    }
    },


      
    Mars: {
//    1: {
      d1: { date: "15.12.130", longitude: "81;0", latitude: "3;35,55" },
      d2: {  date: "21.2.135", longitude: "148;50", latitude: "3;38,39" },
      d3: {  date: "27.5.139", longitude: "242;34", latitude: "-4;16,00" },
      d4: { date: "20.5.383", longitude: "114;50,53", latitude: "0;45,27" }      
//    }
    },

    
    Jupiter: {
//      1: {
      d1: { date: "17.5.133", longitude: "233;11", latitude: "1;15,51" },
      d2: {  date: "21.8.136", longitude: "339;15,32", latitude: "-1;55,51" },
      d3: {  date: "8.10.137", longitude: "14;23", latitude: "-2;04,05" },
      d4: { date: "20.5.383", longitude: "269;32,21", latitude: "0;20,40" }     
//    }
    },
    
    Saturn: {
//      1: {
      d1: { date: "26.3.127", longitude: "181;13", latitude: "3;01,26" },
      d2: {  date: "3.6.133", longitude: "249;40", latitude: "1;11,50" },
      d3: {  date: "8.7.136", longitude: "284;14", latitude: "-0.59" },
      d4: { date: "16.7.153", longitude: "141;10,49", latitude: "1;39,29" }    
//      }
    },

    Venus: {
//      1: {
      d1: { date: "8.3.132", longitude: "31;11", latitude: "3;08,06" },
      d2: { date: "16.12.138", longitude: "216;48,47", latitude: "3;02,01" },
      d3: { date: "20.5.383", longitude: "34;07,21", latitude: "-0;57,54" }       
//      }
    },
    
    Mercury: {
//      1: {
      d1: { date: "4.6.134", longitude: "49;14,43", latitude: "-2;42,08" },
      d2: { date: "3.10.134", longitude: "170;36,24", latitude: "1;27,42" },
      d3: { date: "21.6.253", longitude: "80;31,36", latitude: "1;13,39" },    
      d4: { date: "14.6.283", longitude: "103;06,15", latitude: "-1;56,04" },
      d5: { date: "20.5.383", longitude: "79;14,25", latitude: "-0;25,38" }       
//      }
  },
  
    Moon: {
     3: {
      d1: { date: "6.5.133", longitude: "217;48", latitude: "-0;50,53" },  
      d2: { date: "20.10.134", longitude: "19;42", latitude: "-0;01,38" },
      d3: { date: "6.3.136", longitude: "169;01", latitude: "-0;19,28" },
      d4: { date: "6.4.355", longitude: "103;49,41", latitude: "-2;28,23" }
    }
    }  
  }

};

//var posAngle = 10;


var DATES = {
  PTOLEMY_EPOCH : 1448638,
  PTOLEMY_EPOCH2 : 1448637.91689121,
}


var latitudePresets = {
  Athens: 38,
  Alexandria: 30.97,
  Cnidus: 36.66,
  Heliopolis: 30,
  Cyzicus: 40.23,  
  Equator: 0,
  NorthPole: 90 

};


