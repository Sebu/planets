

var posAngle = 10;

// some basic colors
// just add new
// TODO: curve0,1,etc.
var colors = {
    Earth:      {r: 0.0, g:0.0, b:1.0},
    Planet:     {r: 1.0, g:1.0, b:1.0},
	Sun: 		{r:1.0,g:1.0,b:0.0},
	S0: 		{r:1.0, g: 0.0, b: 1.0},
	S1:			{r:0.4, g:0.4, b:1.0},
	S2: 		{r: 0.0, g: 1.0, b: 0.0},
	S3: 		{r: 1.0, g: 0.0, b: 0.0},
	S4: 		{r: 0.0, g: 1.0, b: 1.0},
	Path: 	{r: 1.0, g: 1.0, b: 1.0},
	Hippo: 	{r: 0.4, g: 0.4, b: 1.0}
	
};

var planetPresets = { 

Mercury1: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 365, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 110, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, speedmax: 1000, rotateStart: 0 },
  ]},

Mercury2: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 110, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, rotateStart: 0 }
]},

Venus1: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 570, rotateStart: 0 },
    {axisAngle: 45.0, speed: 570, rotateStart: 0 }]},

Venus2: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 570, rotateStart: 0 },
    {axisAngle: 80.0, speed: 570, rotateStart: 0 }] },

Mars1: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 260, rotateStart: 0 },
    {axisAngle: 18.0, speed: 260, rotateStart: 0 }]},

Mars2: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 730, rotateStart: 0 },
    {axisAngle: 18.0, speed: 730, rotateStart: 0 }]},

Mars3: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 760, rotateStart: 0 },
    {axisAngle: 18.0, speed: 760, rotateStart: 0 }]},

Mars4: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 780, rotateStart: 0 },
    {axisAngle: 18.0, speed: 780, rotateStart: 0 }] },

Jupiter: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 4380, speedmax: 5000, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 390, rotateStart: 0 },
    {axisAngle: 18.0, speed: 390, rotateStart: 0 }] },

Saturn: {
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 10940, speedmax: 12000, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 390, rotateStart: 0 },
    {axisAngle: 18.0, speed: 390, rotateStart: 0 }] },

Model5Mercury1: { 
  model: "Model5",
  alpha:110,
  beta:36.6667,
  gamma:55,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 365, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 15.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 15.0, speed: 0, rotateStart: 0 },
  ] },

Model5Mars1: { 
  model: "Model5",
  alpha:780,
  beta:260,
  gamma:390,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 730, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 0, rotateStart: 0 },
  ] },

Model5Mars2: { 
  model: "Model5",
  alpha:780,
  beta:260,
  gamma:390,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 730, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 45.0, speed: 0, rotateStart: 0 },
  ] },

Model5Mars3: { 
  model: "Model5",
  alpha:780,
  beta:390,
  gamma:780,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 730, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 45.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: -45.0, speed: 0, rotateStart: 0 },
  ] },

Model5Venus: { 
  model: "Model5",
  alpha:570,
  beta:95,
  gamma:114,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 365, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 22.5, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 22.5, speed: 0, rotateStart: 0 },
  ] },




YavetzTest: { 
  model: "ModelYavetz",
  betaRotate: 30.0,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 365, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 110, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, speedmax: 1000, rotateStart: 95 },
  ]},



MoonMeton: { 
  model: "ModelMoon",
  label: "Moon",
  metonYear: 19,
  metonSynodicMonths: 235,
  metonDays:6940,
  metonDraconiticMonths: 242,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 0, rotateStart: 0 },
    {axisAngle: 5.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0,   rotateStart: 0 }]},

MoonCallippus: { 
  model: "ModelMoon",
  label: "Moon",  
  metonYear: 76,
  metonSynodicMonths: 940,
  metonDays:27759,
  metonDraconiticMonths: 242,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 0, rotateStart: 0 },
    {axisAngle: 5.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }]},
      
Moon3: {
  model: "ModelMoon",
  label: "Moon",
  metonYear: 8,
  metonSynodicMonths: 99,
  metonDays:2922,
  metonDraconiticMonths: 242, 
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 0, rotateStart: 0 },
    {axisAngle: 5.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }]},
  

    
Sun: { 
  model: "ModelSun",
  label: "Sun",
//  color: colors["Sun"],
  sphere: [
    {axisAngle: 38.0, speed: 30, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 0.5,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }] },

MoonCompare: { 
  model: "ModelMoonCompare",
  metonYear: 19,
  label: "Moon",  
  metonSynodicMonths: 235,
  metonDays:6940,
  metonDraconiticMonths: 242,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 0, rotateStart: 0 },
    {axisAngle: 5.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0,   rotateStart: 0 }]},

SimpleTest: { 
  model: "ModelSimple",
  sphere: [
    {axisAngle: 38.0, speed: 30, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 0.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }
  ] },
HippopedeIntroduction: {
  model: "Model4",
  showStars: false,
  showSun: false,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0, visible: false },
    {axisAngle: 24.0,  speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 110, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, speedmax: 1000, rotateStart: 0 }
  ] }

};


var moonModels = {
 Mendell: { phase: 10, speed1: function(d,z)  {return (d+z); }, speed2: function(d,z) { return -d; } },
 Schiparelli: { speed1: function(d,z)  {return d; }, speed2: function(d,z) { return Math.abs(d-z); } },
 SchFixed: { speed1: function(d,z)  {return Math.abs(d-z); }, speed2: function(d,z) { return d; } }
};


















//var moonModels = {
//    Mendell: { speed1: function(d,z)  {return -(d+z); }, speed2: function(d,z) { return d; } },
//    Schiparelli: { speed1: function(d,z)  {return d; }, speed2: function(d,z) { return -360*(d-z); } },
//    SchFixed: { speed1: function(d,z)  {return -360*(d-z); }, speed2: function(d,z) { return d; } }
//};

//var moonModels = {
//    Mendell: { speed1: function(d,z)  {return (d+z); }, speed2: function(d,z) { return -d; } },
//    Schiparelli: { speed1: function(d,z)  {return d; }, speed2: function(d,z) { return -360*(d-z); } },
//    SchFixed: { speed1: function(d,z)  {return -360*(d-z); }, speed2: function(d,z) { return d; } }
//};

var latitudePresets = {
  Athens: 38,
  Cnidus: 36.66,
  Heliopolis: 30,
  Cyzicus: 40.23,  
  Equator: 0,
  NorthPole: 90 

};


