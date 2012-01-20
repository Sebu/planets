MoonMixin = function() {
    this.metonYear = 0;
    this.setMetonYear = function(val) {
        this.metonYear = Number(val);
        this.updateMoon();
    }
    this.getMetonYear = function() {
        return this.metonYear;
    }

    this.metonSynodicMonths = 0;
    this.setMetonSynodicMonths = function(val) {
        this.metonSynodicMonths = Number(val);
        this.updateMoon();
    }
    this.getMetonSynodicMonths = function() {
        return this.metonSynodicMonths;
        this.updateMoon();
    }

    this.metonDays = 0; // days per cycle
    this.setMetonDays = function(val) {
        this.metonDays = Number(val);
        this.updateMoon();
    }
    this.getMetonDays = function() {
        return this.metonDays;
    }

    this.sarosDraconiticMonths = 0;
    this.setSarosDraconiticMonths = function(val) {
        this.sarosDraconiticMonths = Number(val);
        this.updateMoon();
    }
    this.getSarosDraconiticMonths = function() {
        return this.sarosDraconiticMonths;
    }

    this.sarosSynodicMonths = 0;
    this.setSarosSynodicMonths = function(val) {
        this.sarosSynodicMonths = Number(val);
        this.updateMoon();
    }
    this.getSarosSynodicMonths = function() {
        return this.sarosSynodicMonths;
    }

    this.getMetonZodicalMonths = function() {
        return this.getMetonYear() + this.getMetonSynodicMonths();
    }
    this.getMetonDaysPerYear = function() {
        return this.getMetonDays() / this.getMetonYear();
    }
    this.getSynodicDaysPerMonth = function() {
        return this.getMetonDays() / this.getMetonSynodicMonths();
    }
    this.getZodicalDaysPerMonth = function() {
        return this.getMetonDays() / this.getMetonZodicalMonths();
    }

    this.getDraconiticDaysPerMonth = function() {
        return this.getSynodicDaysPerMonth()*(this.getSarosSynodicMonths() / this.getSarosDraconiticMonths());
    }
}