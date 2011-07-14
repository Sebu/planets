

var posAngle = 10;


var DATES = {
  PTOLEMY_EPOCH : 1448637.91689121,
}

// some basic colors
// just add new
// TODO: curve0,1,etc.
var colors = {
    Earth:      {r: 0.2, g:0.2, b:1.0},
//  Earth:     {r: 0.96, g: 201/255, b: 204/255},
  Planet:     {r: 1.0, g:1.0, b:1.0},
	Sun: 		{r:1.0,g:1.0,b:0.0},
	S1: 		{r:1.0, g: 0.0, b: 1.0},
	S2:			{r:0.4, g:0.4, b:1.0},
	S3: 		{r: 0.0, g: 1.0, b: 0.0},
	S4: 		{r: 1.0, g: 0.0, b: 0.0},
  S5: 		{r: 1.0, g: 1.0, b: 0.0},
//  S6: 		{r: 0.0, g: 1.0, b: 0.0},
//	S7:			{r:0.4, g:0.4, b:1.0},
//	S8:			{r:1.0, g: 0.0, b: 1.0},
	Path: 	{r: 1.0, g: 1.0, b: 1.0},
	Hippo: 	{r: 0.4, g: 0.4, b: 1.0}
	
};

var planetPresets = { 

Mercury1: {
  model: "Model4",
  ui: "Model4",
  label: "Mercury",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 110, RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 110, RotateStart: 0 },
  ]},

Mercury2: {
  model: "Model4",
  ui: "Model4",  
  label: "Mercury",    
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 110, RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 110, RotateStart: 0 }
]},

Venus1: {
  model: "Model4",
  ui: "Model4",  
  label: "Venus",    
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 570, RotateStart: 0 },
    {AxisAngle: 45.0, Speed: 570, RotateStart: 0 }]},

Venus2: {
  model: "Model4",
  ui: "Model4",  
  label: "Venus",    
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 570, RotateStart: 0 },
    {AxisAngle: 80.0, Speed: 570, RotateStart: 0 }] },

Mars1: {
  model: "Model4",
  ui: "Model4",  
  label: "Mars",
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 260, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 260, RotateStart: 0 }]},

Mars2: {
  model: "Model4",
  ui: "Model4",  
  label: "Mars",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 730, RotateStart: 0 }]},

Mars3: {
  model: "Model4",
  ui: "Model4",  
  label: "Mars",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 760, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 760, RotateStart: 0 }]},

Mars4: {
  model: "Model4",
  ui: "Model4",  
  label: "Mars",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 780, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 780, RotateStart: 0 }] },

Jupiter: {
  model: "Model4",
  ui: "Model4",  
  label: "Jupiter",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 4380, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 390, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 390, RotateStart: 0 }] },

Saturn: {
  model: "Model4",
  ui: "Model4",  
  label: "Saturn",  
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 10940, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 390, RotateStart: 0 },
    {AxisAngle: 18.0, Speed: 390, RotateStart: 0 }] },

Model5Mercury1: { 
  model: "Model5",
  ui: "Model5",
  label: "Mercury",  
  alpha:110,
  beta:36.6667,
  gamma:55,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 15.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 15.0, Speed: 0, RotateStart: 0 },
  ] },

Model5Mars1: { 
  model: "Model5",
  ui: "Model5",
  label: "Mars",  
  alpha:780,
  beta:260,
  gamma:390,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 0, RotateStart: 0 },
  ] },

Model5Mars2: { 
  model: "Model5",
  ui: "Model5",  
  label: "Mars",  
  alpha:780,
  beta:260,
  gamma:390,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 730, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 45.0, Speed: 0, RotateStart: 0 },
  ] },

Model5Mars3: { 
  model: "Model5",
  ui: "Model5",  
  label: "Mars",
  alpha:780,
  beta:390,
  gamma:780,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 730,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 45.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: -45.0, Speed: 0, RotateStart: 0 },
  ] },

Model5Venus: { 
  model: "Model5",
  ui: "Model5",  
  label: "Venus",
  alpha:570,
  beta:95,
  gamma:114,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 365,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 22.5, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 22.5, Speed: 0, RotateStart: 0 },
  ] },




YavetzTest: { 
  model: "ModelYavetz",
  ui: "ModelYavetz",  
  betaRotate: 30.0,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 365,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 110,  RotateStart: 0 },
    {AxisAngle: 30.0, Speed: 110,  RotateStart: 95 },
  ]},



MoonMeton: { 
  model: "ModelMoon",
  ui: "ModelMoon",    
  label: "Moon",
  metonYear: 19,
  metonSynodicMonths: 235,
  metonDays:6940,
  sarosDraconiticMonths: 242,
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 },
    {AxisAngle: 0.0, Speed: 0,   RotateStart: 0 }]},

MoonCallippus: { 
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
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 },
    {AxisAngle: 0.0, Speed: 0, RotateStart: 0 }]},
      
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
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 },
    {AxisAngle: 0.0, Speed: 0, RotateStart: 0 }]},
  

    
Sun: { 
  model: "ModelSun",
  ui: "ModelSun",     
  label: "Sun",
  showSun: false,
  sunYears: 99,  
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 369, RotateStart: 0 },
    {AxisAngle: 0.5,  Speed: 0, RotateStart: 0 }] },

MoonCompare: { 
  model: "ModelMoonCompare",
  ui: "ModelMoonCompare",     
  metonYear: 19,
  label: "Moon",  
  metonSynodicMonths: 235,
  metonDays:6940,
  sarosDraconiticMonths: 242,
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]},

SimpleTest: { 
  model: "ModelSimple",
  ui: "ModelSimple",  
  showSun: false,  
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365, RotateStart: 0 }
  ] },
  
HippopedeIntroduction: {
  model: "ModelHippo",
  ui: "ModelHippo",
  showStars: false,
  showSun: false,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0, ShowSphere: false },
    {AxisAngle: 24.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 110,  RotateStart: 0 },
    {AxisAngle: 30.0, Speed: -110,  RotateStart: 0 }
  ] },

Aristotle: {
  model: "ModelAristotle",
  ui: "ModelAristotle",  
  showSun: false,
  showStars: false,
  sphere: [
    {AxisAngle: 38.0, Speed: 0, RotateStart: 0},
    {AxisAngle: 24.0,  Speed: 365, RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 580, RotateStart: 0 },
    {AxisAngle: 45.0, Speed: -580, RotateStart: 0 }
  ]},


PtolemySun: { 
  model: "ModelPtolemySun",
  ui: "ModelPtolemySun",
  label: "Sun", 
  showSun: false,
  showStars: false,
  showHippo: false,
  derefentRadius: 60.0,
  epicycleRadius: 0,
  apsidalAngle: 56.5,
  equant: 2.5,
  sphere: [
    {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 365.2466666,  RotateStart: 274.25 },
    {AxisAngle: 0.0, Speed: 0, RotateStart: 0 }
  ] },
    
PtolemyMars: { 
  model: "ModelPtolemy",
  ui: "ModelPtolemy",
  label: "Mars",
  showStars: false,
  showHippo: false,
  sunDist: 1.7,
  derefentRadius: 60.0,
  epicycleRadius: 39.5,
  apsidalAngle: 106.66666666666667,
  equant: 6.0,
//  mean
  sphere: [
    {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 686.944621,  RotateStart: -114},
    {AxisAngle: 0.0, Speed: 779.937297, RotateStart: 327.21666666666664 }
  ] },

PtolemyMarsT: { 
  model: "ModelPtolemy",
  ui: "ModelPtolemy",
  label: "Mars",
  showStars: false,
  showHippo: false,
  sunDist: 1.7,
  derefentRadius: 60.0,
  epicycleRadius: 39.5,
  apsidalAngle: 106.66666666666667,
  equant: 6.0,
//  mean
  sphere: [
    {AxisAngle: 0.0, Speed: 0.0, RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 686.944621,  RotateStart: -103.16666666666667},
    {AxisAngle: 0.0, Speed: 779.937297, RotateStart: 315  }
  ] },


PtolemySaturn: { 
  model: "ModelPtolemy",
  ui: "ModelPtolemy",
  label: "Saturn",
  showStars: false,
  showHippo: false,
  sunDist: 1.7,
  derefentRadius: 60.0,
  epicycleRadius: 6.5,
  apsidalAngle: 224.1666666,
  equant: 3.416666666666,
  sphere: [
    {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 10749.946,  RotateStart: 296.71666666666664},
    {AxisAngle: 0.0, Speed: 378.092982, RotateStart: 34.033333333 }
  ] }
};

var TestPairs = {

  PtolemyMars: {
    d1: { date: [15, 10, 130], longitude: "81;0" },
    d2: {  date: [21, 2, 135], longitude: "148;50" },
    d3: {  date: [27, 5, 139], longitude: "242;34" }
  },

  PtolemySaturn: {
    d1: { date: [26, 3, 127], longitude: "181;13" },
    d2: {  date: [3, 6, 133], longitude: "249;40" },
    d3: {  date: [8, 7, 136], longitude: "284;14" }
  }

};

var moonModels = {
 Mendell: { phase: true, Speed1: function(d,z)  {return (d+z); }, Speed2: function(d,z) { return -d; } },
 Schiparelli: { phase: false, Speed1: function(d,z)  {return d; }, Speed2: function(d,z) { return -Math.abs(d-z); } },
 SchFixed: { phase: false, Speed1: function(d,z)  {return -Math.abs(d-z); }, Speed2: function(d,z) { return d; } }
};



var latitudePresets = {
  Athens: 38,
  Alexandria: 30.97,
  Cnidus: 36.66,
  Heliopolis: 30,
  Cyzicus: 40.23,  
  Equator: 0,
  NorthPole: 90 

};


