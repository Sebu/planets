

/**
 * 
 * @constructor
 * @returns instance of ModelBase :)
 */
BaseView = function() {
    this.setupInfos();
};

BaseView.prototype = {
    
    constructor: BaseView,
    
    setupInfos : function() {
        this.info = { 
            // default
            days : document.getElementById("days"),
            sunAngle : document.getElementById("sunAngle"),            
            longitude : document.getElementById("longitude"),
            longitudeSpeed : document.getElementById("longitudeSpeed"),
            latitude : document.getElementById("latitude"),

            // compare
            days2 : document.getElementById("days2"),
            sunAngle2 : document.getElementById("sunAngle2"),            
            longitude2 : document.getElementById("longitude2"),
            longitudeSpeed2 : document.getElementById("longitudeSpeed2"),
            latitude2 : document.getElementById("latitude2"),
            
            // moon
            metonZodicalMonths : document.getElementById("metonZodicalMonths"),
            metonDaysPerYear : document.getElementById("metonDaysPerYear"),
            synodicDaysPerMonth : document.getElementById("synodicDaysPerMonth"),
            zodicalDaysPerMonth : document.getElementById("zodicalDaysPerMonth"),
            draconiticDaysPerMonth : document.getElementById("draconiticDaysPerMonth"),           
            
            // sun
            meanLongitude : document.getElementById("meanLongitude"),            
            equationOfTime : document.getElementById("equationOfTime"),            
            sunDaysPerYear : document.getElementById("sunDaysPerYear"),
            
            // ptolemy
            apsidalLongitude : document.getElementById("apsidalLongitude"),
            epicycleLongitude : document.getElementById("epicycleLongitude"),
            deferentLongitude : document.getElementById("deferentLongitude"),
            gregorianDate : document.getElementById("gregorianDate"),
            julianDate : document.getElementById("julianDate"),
            egyptianDate : document.getElementById("egyptianDate"),
            egyptianEpoch : document.getElementById("egyptianEpoch")
          };      
    
    },
    setupSliders : function(model) {
    },
    
    update : function(model) {
    },
    
    cleanUp : function() {}
    
}
