var Utils = Utils || {};



function mod(a, b)
{
    return a - (b * Math.floor(a / b));
}

Utils.daysFraction = function(days) {
  var fullDays = Math.floor(days),
  rest = days - fullDays,
  hours = Math.floor(rest/(1/24)),
  rest = rest - hours*(1/24),
  minutes = Math.floor( rest/(1/1440) );
  return [hours, minutes];
}

Utils.daysToTime = function(days) {
  var fullDays = Math.floor(days),
  data = Utils.daysFraction(days);

  if(data[0] < 10) data[0] = "0" + data[0];
  if(data[1] < 10) data[1] = "0" + data[1];
  return "" + fullDays + "d " + data[0] + "h " + data[1] + "m";
  
  

}

Utils.GREGORIAN_EPOCH = 1721425.5;
Utils.GREGORIAN_SWITCH = 2299160.5; 
Utils.JULIAN_EPOCH = 1721423.5;


Utils.EgyptNames = ["Toth", "Phaophi", "Athyr", "Choiak", "Tybi", "Mechir", "Phamenoth", "Pharmouthi"            
, "Pachon", "Payni", "Epiphi", "Mesore", "Epagomenal"];  

Utils.dateToStringEgypt = function(date) {
  if(date[3] < 10) date[3] = "0" + date[3];
  if(date[4] < 10) date[4] = "0" + date[4];
  return "" + date[2] + " " + Utils.EgyptNames[date[1]-1] + " " + date[0] + " " + date[3] + ":" + date[4];
}

Utils.jdToEpoch = function(jd) {
  if( jd >= 1771297 ) return "Antoninus";
  else if( jd >= 1763632 ) return "Hadrian";
  else if( jd >= 1710707 ) return "Augustus";  
  else if( jd >= 1603398 ) return "Philippus";
  else if( jd >= 1448638 ) return "Nabonassar";
  else return "N/A";
}

Utils.dateToString = function(date) {
  if(date[3] < 10) date[3] = "0" + date[3];
  if(date[4] < 10) date[4] = "0" + date[4];
  return "" + date[1] + " / " + date[2] + " / " + date[0] + " " + date[3] + ":" + date[4];
}

Utils.leapJulian = function(year) {
    return mod(year, 4) == ((year > 0) ? 0 : 3);
}

Utils.leapGregorian = function(year) {
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
}

Utils.jdToEgyptian = function(jd) {
    var z, a, b, year, month, day, hour, minute;

//    jd += 0.5;
    z = Math.floor(jd) - 1448638;

    year = Math.floor(z / 365);
    a = Math.floor(365 * year);
    month = Math.floor((z - a) / 30);
    b = Math.floor(30 * month);
    day = (z - a - b);

    var data = Utils.daysFraction(jd);
     
    return new Array(year+1, month+1, day+1, data[0], data[0]);
}

Utils.gregorianToJd =function(year, month, day) {
    return (Utils.GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 :
                               (Utils.leapGregorian(year) ? -1 : -2)
           ) +
           day);
}


Utils.jdToMagic = function(jd) {
  if(jd<=Utils.GREGORIAN_SWITCH) return Utils.jdToJulian(jd);
  else return Utils.jdToGregorian(jd);
}

Utils.magicToJd = function(year, month, day) {
  if(year>=1582 && month >=10 && day>4)
    return Utils.gregorianToJd(year, month, day);
  else
    return Utils.julianToJd(year, month, day);
}


Utils.jdToGregorian = function(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj, hour, minute;


    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - Utils.GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - Utils.gregorianToJd(year, 1, 1);
    leapadj = ((wjd < Utils.gregorianToJd(year, 3, 1)) ? 0
                                                  :
                  (Utils.leapGregorian(year) ? 1 : 2)
              );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - Utils.gregorianToJd(year, month, 1)) + 1;

    var data = Utils.daysFraction(jd);
   
    return new Array(year, month, day, data[0], data[1]);
//    return new Array(year, month, day);
}

Utils.jdToJulian = function(td) {
    var z, a, alpha, b, c, d, e, year, month, day, hour, minute;

    td += 0.5;
    z = Math.floor(td);

    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);

    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);

    /*  If year is less than 1, subtract one to convert from
        a zero based date system to the common era system in
        which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

//    if (year < 1) {
//        year--;
//    }
    var data = Utils.daysFraction(td);
   
    return new Array(year, month, day, data[0], data[1]);
}

Utils.julianToJd = function(year, month, day) {

    /* Adjust negative common era years to the zero-based notation we use.  */
//    if (year < 1) {
//        year++;
//    }

    /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */
    if (month <= 2) {
        year--;
        month += 12;
    }

    return ((Math.floor((365.25 * (year + 4716))) +
            Math.floor((30.6001 * (month + 1))) +
            day) - 1524.5);
}


Utils.decToSex = function(num, prec) {
  var tmp2 = Math.round(num*Math.pow(60,prec))/Math.pow(60,prec),
  tmp = Math.floor(tmp2),
  outstr = tmp.toString() + ";";
  tmp = num - tmp;
  cnt = 0;
  while(tmp > 0 && cnt < prec) {
    tmp = tmp * 60;
    tmp2 = Math.floor(tmp);


    tmp = tmp - tmp2;
    if(cnt++ > 0)
      outstr = outstr + "," + tmp2.toString();
    else
      outstr = outstr + tmp2.toString();
  };
  return outstr;
 
};



Utils.toDec = function(number) {
  if(number.toString().indexOf(";")==-1)
    return Number(number);
  else 
    return Number( Utils.baseToDec(number,60) );
}

Utils.toSexa = function(number) {
  val = Utils.decToBase(number.toString(),60).split(",");
  return val[0] + "," + val[1];
}

Utils.sexagesimal = function(number) {
  if(number.toString().indexOf(";")==-1)
    return Utils.decToBase(number,60);
  else 
    return Utils.baseToDec(number,60);
}

Utils.baseToDec = function(number, base) {
        if (base < 2 || base > 64) {
            return "#base should be between 2 and 64#";
        }

        number = number.toString().split(';');
        var result = Number(number[0]);
 

        var negative = '';
        if (number[0][0] == "-") {
            negative = '-';
        }
        result = Math.abs(result);

        var fraction = number[1].split(',');
        
        if (fraction) {
          for(var i=0;i<fraction.length;i++) {
            result += Number(fraction[i]/base)/(Math.pow(60,i));
          }
        }
        return negative + result;
    };
   
Utils.decToBase = function(number, base) {

        if (base < 2 || base > 64) {
            return "#base should be between 2 and 64#";
        }

        var negative = '';
        if (number < 0) {
            negative = '-';
        }

        number = number.toString().split('.');
        var integer = Math.abs(number[0]);
        var fraction = number[1];
        var result = '';

        result = integer + ";";
//        do {
//            result = String(integer % base) + ";" + result;
//            integer = parseInt(integer / base, 10);
//        } while (integer > 0);

        if (fraction) {
            var decimalPlaces = fraction.toString().length;
            fraction = parseFloat('.' + fraction);

            var x = 0;
            do {
                x++;
                var res = (fraction * base).toString().split('.');
                if(res[0] < 10) res[0] = "0" + res[0];

                result +=  res[0] + ",";
                

                if (res[1]) {
                    fraction = parseFloat('.' + res[1]);
                }
                else {
                    break;
                }
            } while (x < decimalPlaces);
        }
        return negative + result;
    };



Utils.frac = function(num) {

  var d = 0.0;
  var tmp = num.toString();
  var idx = tmp.indexOf(".");

  if (idx >= 0) d = Number("0" + tmp.substring(idx,tmp.length));
  
  var numerators = [0, 1];
  var denominators = [1, 0];

  var maxNumerator =  Utils.getMaxNumerator(d);
  var d2 = d;
  var calcD, prevCalcD = NaN;
  for (var i = 2; i < 1000; i++)  {
    var L2 = Math.floor(d2);
    numerators[i] = L2 * numerators[i-1] + numerators[i-2];
    denominators[i] = L2 * denominators[i-1] + denominators[i-2];
    var string = tmp.substring(0, idx) + " " + numerators[i-1] + "/" + denominators[i-1]+ "";
    if (Math.abs(numerators[i]) > maxNumerator) return string;
    calcD = numerators[i] / denominators[i];
    if (calcD == prevCalcD) return string;
    if (calcD == d) return string;

    prevCalcD = calcD;

    d2 = 1/(d2-L2);
  }
}

Utils.getMaxNumerator = function(f)
{
   var f2 = null;
   var ixe = f.toString().indexOf("E");
   if (ixe==-1) ixe = f.toString().indexOf("e");
   if (ixe == -1) f2 = f.toString();
   else f2 = f.toString().substring(0, ixe);

   var digits = null;
   var ix = f2.toString().indexOf(".");
   if (ix==-1) digits = f2;
   else if (ix==0) digits = f2.substring(1, f2.length);
   else if (ix < f2.length) digits = f2.substring(0, ix) + f2.substring(ix + 1, f2.length);

   var L = digits;

   var numDigits = L.toString().length;
   var L2 = f;
   var numIntDigits = L2.toString().length;
   if (L2 == 0) numIntDigits = 0;
   var numDigitsPastDecimal = numDigits - numIntDigits;

   for (var i=numDigitsPastDecimal; i>0 && L%2==0; i--) L/=2;
   for (var i=numDigitsPastDecimal; i>0 && L%5==0; i--) L/=5;

   return L;
}




