
var planetPresets = { 
Mercury1: { sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 365, rotate: 0 }, { angle: 30.0, speed: 110, rotate: 0}] }, 
Mercury2: { sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 365, rotate: 122 }, { angle: 30.0, speed: 570, rotate: 0 }] }, 
Venus1: 	{ sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 365, rotate: 0 }, { angle: 18.0, speed: 570, rotate: 0 }] }, 
Venus2: 	{ sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 365, rotate: 0 }, { angle: 18.0, speed: 570, rotate: 0 }] }, 
Mars1: 		{ sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 730, rotate: 0 }, { angle: 18.0, speed: 260, rotate: 0 }] }, 
Mars2: 		{ sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 730, rotate: 0 }, { angle: 18.0, speed: 730, rotate: 0 }] }, 
Mars3: 		{ sphere: [{angle: 24.0, speed: 0, rotate: 0 }, { angle: 90.0,  speed: 730, rotate: 0 }, { angle: 18.0, speed: 790, rotate: 0 }] }, 
};


var moonPresets = {
Default: {metonYear: 19, metonSynodicMonths: 235, metonDays:6940}, 
Oktaeteris: {metonYear: 8, metonSynodicMonths: 99, metonDays:2922},
Callippan: {metonYear: 76, metonSynodicMonths: 940, metonDays:27759},
};


var moonModels = { 
Mendell: { speed1: function(d,z)  {return -(d+z); }, speed2: function(d,z) { return d; } },
Schiaparelli: { speed1: function(d,z)  {return d; }, speed2: function(d,z) { return -360*(d-z); } },
SchiaparelliFixed: { speed1: function(d,z)  {return -360*(d-z); }, speed2: function(d,z) { return d; } },
};


var sunPresets = { angle: 0, speed: 365};
