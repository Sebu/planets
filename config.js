

var posAngle = 10;

var colors = {
	Earth:  {r: 0.9, g:0.9, b:18.5},
  Planet: {r: 1.0, g:1.0, b:1.0},
	Sun: 		{r:1.0,g:1.0,b:0.0},
	S0: 		{r:0.7, g: 0.7, b: 0.5},
	S1:			{r:0.4, g:0.4, b:1.0},
	S2: 		{r: 0.0, g: 1.0, b: 0.0},
	S3: 		{r: 1.0, g: 0.0, b: 0.0},
	Path: 	{r: 1.0, g: 1.0, b: 1.0},
	Hippo: 	{r: 0.4, g: 0.4, b: 1.0},
	
};

var planetPresets = { 

Mercury1: { 
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, speedmax: 1000, rotate: 0 },
    {angle: 90.0,  speed: 365, speedmax: 1000, rotate: 0 },
    {angle: 30.0, speed: 110, speedmax: 1000, rotate: 0 },]}, 

Mercury2: { 
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 365, rotate: 0 },
    {angle: 30.0, speed: 570, rotate: 0 }] }, 

Venus1: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 365, rotate: 0 },
    {angle: 18.0, speed: 570, rotate: 0 }]},
 
Venus2: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 365, rotate: 0 },
    {angle: 18.0, speed: 570, rotate: 0 }] }, 

Mars1: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 730, rotate: 0 },
    {angle: 18.0, speed: 260, rotate: 0 }]},
 
Mars2: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 730, rotate: 0 },
    {angle: 18.0, speed: 730, rotate: 0 }]},
 
Mars3: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 730, rotate: 0 },
    {angle: 18.0, speed: 760, rotate: 0 }]},

Mars4: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 730, rotate: 0 },
    {angle: 18.0, speed: 780, rotate: 0 }] },

Jupiter: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 4380, rotate: 0 },
    {angle: 18.0, speed: 390, rotate: 0 }] },

Saturn: {
  sunDist: 8,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 90.0,  speed: 10940, rotate: 0 },
    {angle: 18.0, speed: 390, rotate: 0 }] },

Moon1: { 
  sunDist: 8,
  metonYear: 19,
  metonSynodicMonths: 235,
  metonDays:6940,
  metonDraconiticMonths: 242,
  type:"moon",
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 5.0,  speed: 0, rotate: 0 },
    {angle: 0.0, speed: 0,   rotate: 0 }]},
  
Moon2: {
  sunDist: 8,
  metonYear: 8,
  metonSynodicMonths: 99,
  metonDays:2922,
  metonDraconiticMonths: 242, 
  type:"moon",
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 5.0,  speed: 0, rotate: 0 },
    {angle: 0.0, speed: 0, rotate: 0 }]},
  
Moon3: { 
  sunDist: 8,
  metonYear: 76,
  metonSynodicMonths: 940,
  metonDays:27759,
  metonDraconiticMonths: 242,
  type:"moon",
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 5.0,  speed: 0, rotate: 0 },
    {angle: 0.0, speed: 0, rotate: 0 }]},  
    
Sun: { 
  type:"sun",
  color: {r:1.0,g:1.0,b:0.0},
  sphere: [
    {angle: 24.0, speed: 6, rotate: 0 },
    {angle: 0.5,  speed: 365.0, rotate: 0 },
    {angle: 0.0, speed: 0, rotate: 0 }] }, 

};



var moonModels = { 
Mendell: { speed1: function(d,z)  {return -(d+z); }, speed2: function(d,z) { return d; } },
Schiparelli: { speed1: function(d,z)  {return d; }, speed2: function(d,z) { return -360*(d-z); } },
SchFixed: { speed1: function(d,z)  {return -360*(d-z); }, speed2: function(d,z) { return d; } },
};

var planetModels = { 
Schiparelli: { speed: function(s)  {return -s; }, offset: 0.0, },
Yavetz: { speed: function(s)  {return -s/2; }, offset: 90.0 },
};

var sunPresets = { angle: 0, speed: 365};

