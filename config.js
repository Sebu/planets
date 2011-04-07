

var posAngle = 10;

// some basic colors
// just add new
// TODO: curve0,1,etc.
var colors = {
    Earth:      {r: 0.9, g:0.9, b:18.5},
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
  sunDist: 8,
  model: "ModelYavetz",
  betaRotate: 30.0,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 365, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 110, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, speedmax: 1000, rotateStart: 95 },
  ]},

SimpleTest: { 
  model: "ModelSimple",
  sphere: [
    {axisAngle: 38.0, speed: 30, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 0.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }
  ] },
HippoTest: {
  model: "ModelHippo",
  sphere: [
    {axisAngle: 38.0, speed: 30, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 0.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }
  ] },

MoonCompare: { 
  sunDist: 8,
  model: "ModelMoonCompare",
  metonYear: 19,
  metonSynodicMonths: 235,
  metonDays:6940,
  metonDraconiticMonths: 242,
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 0, rotateStart: 0 },
    {axisAngle: 5.0,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0,   rotateStart: 0 }]},


Mercury1: { 
  sunDist: 8,
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0,  speed: 365, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 90.0, speed: 110, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, speedmax: 1000, rotateStart: 0 },
  ]},

Mercury2: { 
  sunDist: 8,
  model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 110, rotateStart: 0 },
    {axisAngle: 30.0, speed: 110, rotateStart: 0 }
]},

Venus1: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 570, rotateStart: 0 },
    {axisAngle: 45.0, speed: 570, rotateStart: 0 }]},
 
Venus2: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 570, rotateStart: 0 },
    {axisAngle: 80.0, speed: 570, rotateStart: 0 }] },

Mars1: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 260, rotateStart: 0 },
    {axisAngle: 18.0, speed: 260, rotateStart: 0 }]},
 
Mars2: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 730, rotateStart: 0 },
    {axisAngle: 18.0, speed: 730, rotateStart: 0 }]},
 
Mars3: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 760, rotateStart: 0 },
    {axisAngle: 18.0, speed: 760, rotateStart: 0 }]},

Mars4: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 730, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 780, rotateStart: 0 },
    {axisAngle: 18.0, speed: 780, rotateStart: 0 }] },

Jupiter: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 4380, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 390, rotateStart: 0 },
    {axisAngle: 18.0, speed: 390, rotateStart: 0 }] },

Saturn: {
  sunDist: 8,
    model: "Model4",
  sphere: [
    {axisAngle: 38.0, speed: 0, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 10940, rotateStart: 0 },
    {axisAngle: 90.0,  speed: 390, rotateStart: 0 },
    {axisAngle: 18.0, speed: 390, rotateStart: 0 }] },

MoonMeton: { 
  sunDist: 8,
  model: "ModelMoon",
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
  sunDist: 8,
  model: "ModelMoon",
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
  sunDist: 8,
  model: "ModelMoon",
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
  color: {r:1.0,g:1.0,b:0.0},
  sphere: [
    {axisAngle: 38.0, speed: 30, speedmax: 1000, rotateStart: 0 },
    {axisAngle: 24.0, speed: 365, rotateStart: 0 },
    {axisAngle: 0.5,  speed: 0, rotateStart: 0 },
    {axisAngle: 0.0, speed: 0, rotateStart: 0 }] }

};



var moonModels = { 
Mendell: { speed1: function(d,z)  {return -(d+z); }, speed2: function(d,z) { return d; } },
Schiparelli: { speed1: function(d,z)  {return d; }, speed2: function(d,z) { return -360*(d-z); } },
SchFixed: { speed1: function(d,z)  {return -360*(d-z); }, speed2: function(d,z) { return d; } }
};

var latitudePresets = {
  Athens: 38,
  Canidos: 36.66,
  Heliopolis: 30,
  Cyzicus: 40.23,  
  Equator: 0,
  NorthPole: 90 

};


