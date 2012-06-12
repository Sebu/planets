

var config = {
  earthTexture : 'images/earthmap1k.jpg',
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
    Mars: {r: 1.0, g:0.5, b:0.5},
	  Sun: 		{r:1.0,g:1.0,b:0.0},
	  S1:			{r: 0.3, g: 0.565, b: 0.996}, //{r: 0.3, g: 0.565, b: 0.996},
    S2: 		{r: 1.0, g: 1.0, b: 0.2},	
	  S3: 		{r: 0.2, g: 1.0, b: 0.2},
	  S4: 		{r: 1.0, g: 0.2, b: 0.2},
	  S5: 		{r:1.0, g: 0.0, b: 1.0},
	  Path: 	{r: 1.0, g: 1.0, b: 1.0},
	  Hippo: 	{r: 0.3, g: 0.565, b: 0.996}
	}
};

var defaultPreset = {
            sunDist: 8,
            color: config.colors["Planet"],
            betaRotate: 90.0,
            label: "Planet",
            showStars: true,
            showHippo: true,
            showPath: true,
            showSun: true,
            sunSpeed: 365.2466666
};

var planetPresets = { 

Eudoxus: {
  Mercury: {
    1: {
//    caption: "Eudoxus Mercury 1",
    model: "Model4",
    ui: "Model4",
//    color: colors['Mars'],
    label: "Mercury",  
    sphere: [
      {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
      {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
      {AxisAngle: 90.0, Speed: 110, RotateStart: 0 },
      {AxisAngle: 30.0, Speed: 110, RotateStart: 0 },
    ]},

    2: {
//      caption: "Eudoxus Mercury 2",
      model: "Model4",
      ui: "Model4",  
      label: "Mercury",    
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 110, RotateStart: 0 },
        {AxisAngle: 30.0, Speed: 110, RotateStart: 0 }
    ]}  
  },
  Venus: {
    1: {
//    caption: "Eudoxus Venus 1",
    model: "Model4",
    ui: "Model4",  
    label: "Venus",    
    sphere: [
      {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
      {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
      {AxisAngle: 90.0, Speed: 570, RotateStart: 0 },
      {AxisAngle: 45.0, Speed: 570, RotateStart: 0 }]},

    2: {
//    caption: "Eudoxus Venus 2",
    model: "Model4",
    ui: "Model4",  
    label: "Venus",    
    sphere: [
      {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
      {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
      {AxisAngle: 90.0, Speed: 570, RotateStart: 0 },
      {AxisAngle: 80.0, Speed: 570, RotateStart: 0 }] }
  },
  
  Mars: {
  1: {
//  caption: "Eudoxus Mars 1",
  model: "Model4",
  ui: "Model4",  
  label: "Mars",
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 260, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 260, RotateStart: 0 }]},

  2: {
//  caption: "Eudoxus Mars 2",
  model: "Model4",
  ui: "Model4",  
  label: "Mars",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 730, RotateStart: 0 }]},

  3: {
//  caption: "Eudoxus Mars 3",
  model: "Model4",
  ui: "Model4",  
  label: "Mars",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 760, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 760, RotateStart: 0 }]},

  4: {
//  caption: "Eudoxus Mars 4",
  model: "Model4",
  ui: "Model4",  
  label: "Mars",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 780, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 780, RotateStart: 0 }] }
  },
  
  Jupiter: {
  1: {
//  caption: "Eudoxus Jupiter",
  model: "Model4",
  ui: "Model4",  
  label: "Jupiter",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 4380, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 390, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 390, RotateStart: 0 }] }
  },

  Saturn: {
  1: {
//  caption: "Eudoxus Saturn",
  model: "Model4",
  ui: "Model4",  
  label: "Saturn",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 10940, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 390, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 390, RotateStart: 0 }] }
  },

  Sun: { 
  caption: "Sun",
  model: "ModelSun",
  ui: "ModelSun",     
  label: "Sun",
  showSun: false,
  sunYears: 99,  
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 369, RotateStart: 0 },
    {AxisAngle: 0.5,  Speed: 0, RotateStart: 0 }] },

  Moon: {
  caption : "Moon",
  model: "ModelMoon",
  ui: "ModelMoon",    
  label: "Moon",
  showSun: true,  
  metonYear: 19,
  metonSynodicMonths: 235,
  metonDays:6940,
  sarosDraconiticMonths: 242,
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]
  },

MoonCompare: { 
  caption: "Moon comparision",
  model: "ModelMoonCompare",
  ui: "ModelMoonCompare",     
  metonYear: 19,
  label: "Moon",
  showSun: true,  
  metonSynodicMonths: 235,
  metonDays:6940,
  sarosDraconiticMonths: 242,
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]},

Simple: { 
  caption: "Basic",
  model: "ModelSimple",
  ui: "ModelSimple",  
  showSun: false,  
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 }
  ] },

    
HippopedeIntroduction: {
  caption: "Hippopede introduction",
  model: "Model4",
  ui: "ModelHippo",
  showStars: false,
  showSun: false,
  showPath: false,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0, ShowSphere: false },
    {AxisAngle: 24.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 110,  RotateStart: 0 },
    {AxisAngle: 30.0, Speed: -110,  RotateStart: 0 }
  ] },
  
  ComareTest: {
    model: "ModelCompareBase",
    ui: "Ptolemy"
  }  
},



Callippus: {
  Mercury: {
  1: { 
//  caption: "Callippus Mercury 1",
  model: "Model5",
  ui: "Model5",
  label: "Mercury",  
  Alpha:110,
  Beta:36.6667,
  Gamma:55,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 15.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 15.0, Speed: 0, RotateStart: 0 },
  ] }
  },

  Mars: {
  1: { 
//  caption: "Callippus Mars 1",
  model: "Model5",
  ui: "Model5",
  label: "Mars",  
  Alpha:780,
  Beta:260,
  Gamma:390,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 0, RotateStart: 0 }
  ] },

  2: { 
//  caption: "Callippus Mars 2",
  model: "Model5",
  ui: "Model5",  
  label: "Mars",  
  Alpha:780,
  Beta:260,
  Gamma:390,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 45.0, Speed: 0, RotateStart: 0 }
  ] },

  3: { 
//  caption: "Callippus Mars 3",
  model: "Model5",
  ui: "Model5",  
  label: "Mars",
  Alpha:780,
  Beta:390,
  Gamma:780,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 730,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 45.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: -45.0, Speed: 0, RotateStart: 0 }
  ] }
  },

  Venus: {
  1: {
//  caption: "Callippus Venus", 
  model: "Model5",
  ui: "Model5",  
  label: "Venus",
  Alpha:570,
  Beta:95,
  Gamma:114,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 365,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 22.5, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 22.5, Speed: 0, RotateStart: 0 }
  ] }
  },
  Sun: { 
  caption: "Sun",
  model: "Model5",
  ui: "Model5",     
  label: "Sun",
  showSun: false,
  sunYears: 99, 
  Alpha:570,
  Beta:95,
  Gamma:114,   
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 369, RotateStart: 0 },
    {AxisAngle: 0.5,  Speed: 0, RotateStart: 0 },
    {AxisAngle: 0.0,  Speed: 0, RotateStart: 0 },
    {AxisAngle: 0.0,  Speed: 0, RotateStart: 0 }
    ] 
  },  
  
  Moon: { 
  caption : "Moon",
  model: "ModelMoon",
  ui: "ModelMoon",     
  label: "Moon",  
  metonYear: 76,
  metonSynodicMonths: 940,
  metonDays:27759,
  sarosDraconiticMonths: 242,
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]}
},



Yavetz: {
  Test: {
//    caption: "Yavetz",
    model: "ModelYavetz",
    ui: "ModelYavetz",  
    betaRotate: 30.0,
    sphere: [
      {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
      {AxisAngle: 24.0,  Speed: 365,  RotateStart: 0 },
      {AxisAngle: 90.0, Speed: 110,  RotateStart: 0 },
      {AxisAngle: 30.0, Speed: 110,  RotateStart: 95 },
    ]}
},



/*
      
Moon3: {
  model: "ModelMoon",
  ui: "ModelMoon",   
  label: "Moon",
  metonYear: 8,
  metonSynodicMonths: 99,
  metonDays:2922,
  sarosDraconiticMonths: 242, 
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]},
*/

    




Aristotle: {
  caption: "Aristotle",
  model: "ModelAristotle",
  ui: "ModelAristotle",  
  showSun: false,
  showStars: false,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0},
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 580, RotateStart: 0 },
    {AxisAngle: 45.0, Speed: -580, RotateStart: 0 }
  ]},

Ptolemy: {
  caption: "Ptolemy Almagest", 


          
  Mars: {
    caption: "Mars",
    model: "ModelPtolemySuperior",
    ui: "ModelPtolemy",
    label: "Mars",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 1,  
    baseRadius: "0.0",  
    derefentRadius: "60;0",
    epicycleRadius: "39;30",
    apsidalAngle: "106;40",
    equant: "6;0",
   inclination: "1",
    deviation: "2;15",
    lambdaAN: "90;0",
  //  mean
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: 0.0, Step: "0;31,26,36,53,51,33",  RotateStart: "3;32" },
  //    {AxisAngle: 0.0, Step: "0", RotateStart: "0" }    
      {AxisAngle: 0.0, Step: "0;27,41,40,19,20,58", RotateStart: "327;13" }
    ] 
  },

  
  Jupiter: { 
    caption: "Jupiter",
    model: "ModelPtolemySuperior",
    ui: "ModelPtolemy",
    label: "Jupiter",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 1,
    baseRadius: "0.0",    
    derefentRadius: "60;0",
    epicycleRadius: "11;30",
    apsidalAngle: "152;09",
    equant: "2;45",
    inclination: "1;30",
    deviation: "2;30",
    lambdaAN: "71",
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: 0.0, Step: "0;04,59,14,26,46,31",  RotateStart: "184;41"},
      {AxisAngle: 0.0, Step: "0;54,09,02,46,26,00", RotateStart: "146;04" }
    ] 
  },
  
  Saturn: {
    caption: "Saturn",
    model: "ModelPtolemySuperior",
    ui: "ModelPtolemy",
    label: "Saturn",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 1,  
    baseRadius: "0.0",    
    derefentRadius: "60;0",
    epicycleRadius: "6;30",
    apsidalAngle: "224;10",
    equant: "3;25",
    inclination: "2;30",
    deviation: "4;30",
    lambdaAN: "138",
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },   
      {AxisAngle: 0.0, Step: "0;02,00,33,31,28,51",  RotateStart: "296;43"},
      {AxisAngle: 0.0, Step: "0;57,07,43,41,43,40", RotateStart: "34;02" }
    ]
  },

  Mercury: {
    caption: "Mercury",
    model: "ModelPtolemyInferior",
    ui: "ModelPtolemy",
    label: "Mercury",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 1,  
    baseRadius: "3;0",    
    derefentRadius: "60;0",
    epicycleRadius: "22;30",
    apsidalAngle: "181;10",
    equant: "6;0",
    inclination: "-0.75",
    deviation: "6;15",
    km:  "-7;00",
    lambdaAN: "93",  
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },   
      {AxisAngle: 0.0, Step: "0;59,08,17,13,12,31",  RotateStart: "330;45"},
  //    {AxisAngle: 0.0, Step: "0", RotateStart: "0" }
      {AxisAngle: 0.0, Step: "3;06,24,06,59,35,50", RotateStart: "21;55" }
    ]
  },

//*/
  Venus: {
    caption: "Venus",
    model: "ModelPtolemyVenus",
    ui: "ModelPtolemy",
    label: "Venus",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 1,    
    baseRadius: "0",    
    derefentRadius: "60;0",
    epicycleRadius: "43;10",
    apsidalAngle: "46;10",
    equant: "1;15",
    inclination: "0;10",
    deviation: "2;30",
    km:  "3;30",
    lambdaAN: "90",    
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },    
      {AxisAngle: 0.0, Step: "0;59,08,17,13,12,31", RotateStart: "330;45"},
      {AxisAngle: 0.0, Step: "0;36,59,25,53,11,28", RotateStart: "71;07" }
    ]
  },
  Sun: {
    caption: "Sun",
    model: "ModelPtolemySun",
    ui: "ModelPtolemySun",
    label: "Sun", 
    showSun: false,
    showStars: false,
    showHippo: false,
    centuryStep: 0,  
    baseRadius: "0.0",    
    derefentRadius: "60;0",
    epicycleRadius: 0,
    apsidalAngle: 56.5,
    equant: "2;30",
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },    
      {AxisAngle: 0.0, Speed: 365.2466666,  RotateStart: 274.25 },
      {AxisAngle: 0.0, Speed: 0, RotateStart: 0 }
    ] 
  }, 
  Moon: {
    "1a": { 
    caption: "1a",
    model: "ModelPtolemyMoon1a",
    ui: "ModelPtolemy",
    label: "Moon",
    showSun: false,  
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 0,  
    baseRadius: "6;20",
    derefentRadius: "60;00",
    epicycleRadius: "0",
    apsidalAngle: "0",
    equant: "0",
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Step: "13;10,34,58,33,30,30",  RotateStart: "41;27" },
      {AxisAngle: 0.0, Step: "13;03,53,56,17,51,59", RotateStart:  "268;49" },
      {AxisAngle: 0.0, Step: "0", RotateStart: "0" }
    ] },

    "1b": { 
    caption: "1b",
    model: "ModelPtolemyMoon1b",
    ui: "ModelPtolemy",
    label: "Moon",
    showSun: false,  
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 0,  
    baseRadius: "0",
    derefentRadius: "60;00",
    epicycleRadius: "6;20",
    apsidalAngle: "0",
    equant: "0",
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Step: "0", RotateStart: "0" },
      {AxisAngle: 0.0, Step: "13;10,34,58,33,30,30",  RotateStart: "41;27" },
      {AxisAngle: 0.0, Step: "13;03,53,56,17,51,59", RotateStart:  "268;49" }
    ] },

    2: { 
    caption: "2",
    model: "ModelPtolemyMoon2",
    ui: "ModelPtolemy",
    label: "Moon",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    centuryStep: 0,  
    baseRadius: "12;30",
    derefentRadius: "60;00",
    epicycleRadius: "6;20",
    apsidalAngle: "0",
    equant: "0",
    inclination: "5",
    lambdaAN: "354;15", 
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Step: "13;10,34,58,33,30,30",  RotateStart: "41;27" },
      {AxisAngle: 0.0, Step: "12;11,26,41,20,17,59", RotateStart:  "70;37" },
      {AxisAngle: 0.0, Step: "13;03,53,56,17,51,59", RotateStart: "268;49" }
    ] },

    3: { 
    caption: "3",
    model: "ModelPtolemyMoon2",
    ui: "ModelPtolemy",
    label: "Moon",
    showStars: false,
    showHippo: false,
    showSun: false,  
    sunDist: 1.7,
    accurateMoon: true,
    centuryStep: 0,  
    baseRadius: "12;29",
    derefentRadius: "60;00",
    epicycleRadius: "6;20",
    apsidalAngle: "0",
    equant: "0",
    inclination: "5",
    lambdaAN: "336;0", 
    sphere: [
      {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
      {AxisAngle: "23;51,20", Step: "13;10,34,58,33,30,30",  RotateStart: "41;27" },
      {AxisAngle: 0.0, Step: "12;11,26,41,20,17,59", RotateStart:  "70;37" },
      {AxisAngle: 0.0, Step: "13;03,53,56,17,51,59", RotateStart: "268;49" }
    ] },  
  }
}


};

var uiBindings = {
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


