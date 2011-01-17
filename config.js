
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
  moon:true,
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
  moon:true,
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
  moon:true,
  sphere: [
    {angle: 24.0, speed: 0, rotate: 0 },
    {angle: 5.0,  speed: 0, rotate: 0 },
    {angle: 0.0, speed: 0, rotate: 0 }]},  
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
