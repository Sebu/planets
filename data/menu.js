

var defaultPreset = {
    viewParams: {
        sunDist: 8,
        color: config.colors["Planet"],
        label: "Planet",
        showStars: false,
        showHippo: true,
        showPath: true,
        showSun: true
    },
    params: {
        betaRotate: 90.0,
        sunSpeed: 365.2466666
    }
};

var planetPresets = { 

Eudoxus: {
  Mercury: {
    1: {
        model: "Model4",
        view: "Model4View",
        text: "Eudoxus.html?v=2",
        viewParams: {
            label: "Mercury"
        },
        params: {
            sphere: [
              {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
              {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
              {AxisAngle: 90.0, Speed: 110, RotateStart: 0 },
              {AxisAngle: 30.0, Speed: 110, RotateStart: 0 }
            ]
        },
    },

    2: {
      model: "Model4",
      view: "Model4View",  
      viewParams: {
            label: "Mercury",    
      },    
      params: {  
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 110, RotateStart: 0 },
        {AxisAngle: 30.0, Speed: 110, RotateStart: 0 }
    ]}}  
  },
  Venus: {
    1: {
//    caption: "Eudoxus Venus 1",
    model: "Model4",
    view: "Model4View",  
    viewParams: {
        label: "Venus",
    },
    params: {    
        sphere: [
          {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
          {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
          {AxisAngle: 90.0, Speed: 570, RotateStart: 0 },
          {AxisAngle: 45.0, Speed: 570, RotateStart: 0 }]}},

    2: {
//    caption: "Eudoxus Venus 2",
    model: "Model4",
    view: "Model4View", 
    viewParams: { 
        label: "Venus", 
    },
    params: {
        sphere: [
          {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
          {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
          {AxisAngle: 90.0, Speed: 570, RotateStart: 0 },
          {AxisAngle: 80.0, Speed: 570, RotateStart: 0 }] }}
  },
  
  Mars: {
  1: {
//  caption: "Eudoxus Mars 1",
  model: "Model4",
  view: "Model4View",  
  viewParams: {  
    label: "Mars",
  },
  params: {
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 260, RotateStart: 0 },
        {AxisAngle: 18.0, Speed: 260, RotateStart: 0 }]}},

  2: {
//  caption: "Eudoxus Mars 2",
  model: "Model4",
  view: "Model4View",  
  viewParams: {  
    label: "Mars",
  },
  params: { 
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 730, RotateStart: 0 },
        {AxisAngle: 18.0, Speed: 730, RotateStart: 0 }]}},

  3: {
//  caption: "Eudoxus Mars 3",
  model: "Model4",
  view: "Model4View",  
  label: "Mars",  
  params: {  
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 760, RotateStart: 0 },
        {AxisAngle: 18.0, Speed: 760, RotateStart: 0 }]}},

  4: {
//  caption: "Eudoxus Mars 4",
  model: "Model4",
  view: "Model4View", 
  viewParams: {   
    label: "Mars",
  },
  params: {   
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 780, RotateStart: 0 },
        {AxisAngle: 18.0, Speed: 780, RotateStart: 0 }] }}
  },
  
  Jupiter: {
  1: {
//  caption: "Eudoxus Jupiter",
  model: "Model4",
  view: "Model4View", 
  viewParams: {   
    label: "Jupiter",
  },
  params: {
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 4380, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 390, RotateStart: 0 },
        {AxisAngle: 18.0, Speed: 390, RotateStart: 0 }] }}
  },

  Saturn: {
  1: {
//  caption: "Eudoxus Saturn",
  model: "Model4",
  view: "Model4View", 
  viewParams: {   
    label: "Saturn", 
  },
  params: { 
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 10940, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 390, RotateStart: 0 },
        {AxisAngle: 18.0, Speed: 390, RotateStart: 0 }] }}
  },

  Sun: { 
      caption: "Sun",
      model: "ModelSun",
      view: "SunView",
      viewParams: {     
          label: "Sun",
          showSun: false,
      },      
      params: {  
          sunYears: 99,  
          sphere: [
            {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
            {AxisAngle: 24.0, Speed: 369, RotateStart: 0 },
            {AxisAngle: 0.5,  Speed: 0, RotateStart: 0 }]
      }
  },

  Moon: {

      model: "ModelMoon",
      view: "MoonView",    
      viewParams: {
          label: "Moon",
          showSun: true, 
      },      
      params: { 
          metonYear: 19,
          metonSynodicMonths: 235,
          metonDays:6940,
          sarosDraconiticMonths: 242,
          sarosSynodicMonths: 223,
          sphere: [
            {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
            {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]
      }
  },

MoonCompare: { 
      caption: "Moon comparision",
      model: "ModelMoonCompare",
      view: "MoonCompareView",     
      
      viewParams: {
          label: "Moon",
          showSun: true,  
      },    
      params: {
          metonYear: 19,
          metonSynodicMonths: 235,
          metonDays:6940,
          sarosDraconiticMonths: 242,
          sarosSynodicMonths: 223,
          sphere: [
            {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
            {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]}
  },  
  
  
Simple: { 
  caption: "Basic",
  model: "ModelSimple",
  view: "SimpleView",  
  viewParams: {
    showSun: false,  
  },
  params: {
      sphere: [
        {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 365, RotateStart: 0 }
      ] 
  }
},

    
HippopedeIntroduction: {
  caption: "Hippopede introduction",
  model: "Model4",
  view: "HippoView",
  viewParams: {
      showStars: false,
      showSun: false,
      showPath: false,
  },
  params: {  
      sphere: [
        {AxisAngle: 38.0, Speed: 0,  RotateStart: 0, ShowSphere: false },
        {AxisAngle: 24.0, Speed: 0,  RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 110,  RotateStart: 0 },
        {AxisAngle: 30.0, Speed: -110,  RotateStart: 0 }
      ] }}
  
 
},



Callippus: {
  Mercury: {
      1: { 
          model: "Model5",
          view: "Model5View",
          viewParams: {
              label: "Mercury",  
          },
          params: {  
              Alpha: 110,
              Beta: 36.6667,
              Gamma: 55,
              sphere: [
                {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
                {AxisAngle: 24.0, Speed: 365, RotateStart: 0 },
                {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
                {AxisAngle: 15.0, Speed: 0, RotateStart: 0 },
                {AxisAngle: 15.0, Speed: 0, RotateStart: 0 },
              ]
          }
      }
  },

  Mars: {
  1: { 
//  caption: "Callippus Mars 1",
  model: "Model5",
  view: "Model5View",
  viewParams: {
      label: "Mars",  
  },
  params: {  
      Alpha:780,
      Beta:260,
      Gamma:390,
      sphere: [
        {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 24.0, Speed: 730, RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 30.0, Speed: 0, RotateStart: 0 },
        {AxisAngle: 30.0, Speed: 0, RotateStart: 0 }
      ] }},

  2: { 
      model: "Model5",
      view: "Model5View", 
      viewParams: { 
          label: "Mars",  
      },
      params: {   
          Alpha:780,
          Beta:260,
          Gamma:390,
          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 24.0,  Speed: 730, RotateStart: 0 },
            {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 90.0, Speed: 0, RotateStart: 0 },
            {AxisAngle: 45.0, Speed: 0, RotateStart: 0 }
         ] 
      }
  },

  3: { 
//  caption: "Callippus Mars 3",
  model: "Model5",
  view: "Model5View",  
  
  viewParams: {
      label: "Mars",
  },
  params: {   
      Alpha:780,
      Beta:390,
      Gamma:780,
      sphere: [
        {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
        {AxisAngle: 24.0,  Speed: 730,  RotateStart: 0 },
        {AxisAngle: 90.0, Speed: 0,  RotateStart: 0 },
        {AxisAngle: 45.0, Speed: 0,  RotateStart: 0 },
        {AxisAngle: -45.0, Speed: 0, RotateStart: 0 }
      ] }}
  },

  Venus: {
  1: {
//  caption: "Callippus Venus", 
  model: "Model5",
  view: "Model5View",  
  
  viewParams: {
      label: "Venus",
  },
  params: {   
  Alpha:570,
  Beta:95,
  Gamma:114,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0,  Speed: 365,  RotateStart: 0 },
    {AxisAngle: 90.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 22.5, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 22.5, Speed: 0, RotateStart: 0 }
  ] }}
  },
  Sun: { 
      caption: "Sun",
      model: "Model5",
      view: "Model5View",  
      
      viewParams: {   
          label: "Sun",
          showSun: false,
      },
      params: {   
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
      }
  },  
  
  Moon: { 
  caption : "Moon",
  model: "ModelMoon",
  view: "MoonView",  
  viewParams: {   
      label: "Moon",  
  },
  params: {   
  metonYear: 76,
  metonSynodicMonths: 940,
  metonDays:27759,
  sarosDraconiticMonths: 242,
  sarosSynodicMonths: 223,
  sphere: [
    {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
    {AxisAngle: 24.0, Speed: 0, RotateStart: 0 },
    {AxisAngle: 5.0,  Speed: 0, RotateStart: 0 }]}}
},



Yavetz: {
    model: "ModelYavetz",
    view: "YavetzView", 

    params: {      
        betaRotate: 30.0,
        sphere: [
          {AxisAngle: 38.0, Speed: 0,  RotateStart: 0 },
          {AxisAngle: 24.0,  Speed: 365,  RotateStart: 0 },
          {AxisAngle: 90.0, Speed: 110,  RotateStart: 0 },
          {AxisAngle: 30.0, Speed: 110,  RotateStart: 95 },
        ]
    }
},




Aristotle: {

  Introduction: {
        view: "AristotleView",
        text: "AristotleIntro.html?v=2",
        viewParams: {
            showSun: false,
            showStars: false
        },  
        model: "AristotleModel",
        params: {

          sphere: [
            {AxisAngle: 38.0, Speed: 0, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 365, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 90.0, Speed: 580, RotateStart: 0, ShowSphere: false },
            {AxisAngle: 45.0, Speed: -580, RotateStart: 0, ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: true } 
          ]
      }
  },
  
  Tutorial: {
      text: "AristotleTutorial.html?v=3",
      model: "AristotleModel",
      view: "AristotleTutorialView",  
      viewParams : {
          label: "Jupiter"
      },
      params : {
      
          sphere: [
            {AxisAngle: 38.0, Speed: 1, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 24.0, Speed: 4380, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 90.0, Speed: 390, RotateStart: 0, ShowSphere: true },
            {AxisAngle: 18.0, Speed: -390, RotateStart: 0, ShowSphere: true },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false },
            { ShowSphere: false } 
            ]
      }
  }

},  

Ptolemy: {
  caption: "Ptolemy Almagest", 


          
  Mars: {
    caption: "Mars",
    model: "ModelPtolemySuperior",
    view: "PtolemyView",
    
    viewParams: {
        label: "Mars",
        showStars: false,
        showHippo: false,
        showSun: false,  
        sunDist: 1.7
    },
    params: {     
        centuryStep: 1,  
        baseRadius: "0.0",  
        derefentRadius: "60;0",
        epicycleRadius: "39;30",
        apsidalAngle: "106;40",
        equant: "6;0",
        inclination: "1",
        deviation: "2;15",
        lambdaAN: "90;0",
        sphere: [
          {AxisAngle: 0.0, Speed: 0.0,  RotateStart: 0 },
          {AxisAngle: "23;51,20", Speed: 0.0,  RotateStart: 0 },
          {AxisAngle: 0.0, Step: "0;31,26,36,53,51,33",  RotateStart: "3;32" },
          {AxisAngle: 0.0, Step: "0;27,41,40,19,20,58", RotateStart: "327;13" }
        ] 
    }
  },

  
  Jupiter: { 
    caption: "Jupiter",
    model: "ModelPtolemySuperior",
    view: "PtolemyView",
    
    viewParams: {
        label: "Jupiter",
        showStars: false,
        showHippo: false,
        showSun: false,  
        sunDist: 1.7
    },    
    params: {     
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
    }
  },
  
  Saturn: {
    caption: "Saturn",
    model: "ModelPtolemySuperior",
    view: "PtolemyView",
    
    viewParams: {
        label: "Saturn",
        showStars: false,
        showHippo: false,
        showSun: false,  
        sunDist: 1.7
    },    
    params: {     
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
    }
  },

  Mercury: {
    caption: "Mercury",
    model: "ModelPtolemyInferior",
    view: "PtolemyView",
    
    viewParams: {
        label: "Mercury",
        showStars: false,
        showHippo: false,
        showSun: false,  
        sunDist: 1.7
    },
    params: {     
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
          {AxisAngle: 0.0, Step: "3;06,24,06,59,35,50", RotateStart: "21;55" }
        ]
    }
  },

//*/
  Venus: {
    caption: "Venus",
    model: "ModelPtolemyVenus",
    view: "PtolemyView",
    
    viewParams: {
        label: "Venus",
        showStars: false,
        showHippo: false,
        showSun: false,  
        sunDist: 1.7
    },
    params: {     
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
    }
  },
  Sun: {
    caption: "Sun",
    model: "ModelPtolemySun",
    view: "PtolemySunView",
    
    viewParams: {
        label: "Sun", 
        showSun: false,
        showStars: false,
        showHippo: false
    },
    params: {     
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
    }
  }, 
  Moon: {
    1: { 
        caption: "1a",
        model: "ModelPtolemyMoon1a",
        view: "PtolemyView",
        viewParams: {
            label: "Moon",
            showSun: false,  
            showStars: false,
            showHippo: false,
            showSun: false,  
            sunDist: 1.7
        },
        params: {     
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
            ] 
        }
    },

    2: { 
        caption: "1b",
        model: "ModelPtolemyMoon1b",
        view: "PtolemyView",
        viewParams: {
            label: "Moon",
            showSun: false,  
            showStars: false,
            showHippo: false,
            showSun: false,  
            sunDist: 1.7
        },
        params: {  
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
            ]
        } 
    },
    
    3: {
       caption: "1a+b",
        model: "ModelCompareBase",
        view: "PtolemyView"
    },  

    4: { 
        caption: "2",
        model: "ModelPtolemyMoon2",
        view: "PtolemyView",
        viewParams: {
            label: "Moon",
            showStars: false,
            showHippo: false,
            showSun: false,  
            sunDist: 1.7
        },
        params: {  
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
            ]
        }
    },

    5: { 
        caption: "3",
        model: "ModelPtolemyMoon2",
        view: "PtolemyView",
        
        viewParams: {
            label: "Moon",
            showStars: false,
            showHippo: false,
            showSun: false,  
            sunDist: 1.7
        },        
        params: {  
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
            ] 
        } 
    }, 
  }
}

};

