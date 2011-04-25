/**
 * Created by IntelliJ IDEA.
 * User: seb
 * Date: 12.02.2011
 * Time: 13:53:01
 * some nice shortcuts for jQuery blocks to create a proto site
 */


fixRange = function() {

// test for native support
var test = document.createElement('input');
try {
  test.type = 'range';
  if (test.type == 'range')
    return;
} catch (e) {
  return;
}

// test for required property support
if (!document.mozSetImageElement || !('MozAppearance' in test.style))
  return;

var isMac = navigator.platform == 'MacIntel';
var thumb = {
  radius: isMac ? 9 : 6,
  width: isMac ? 22 : 12,
  height: isMac ? 16 : 20
};
var track = '-moz-linear-gradient(top, transparent ' + (isMac ?
  '6px, #999 6px, #999 7px, #ccc 9px, #bbb 11px, #bbb 12px, transparent 12px' :
  '9px, #999 9px, #bbb 10px, #fff 11px, transparent 11px') +
  ', transparent)';
var styles = {
  'min-width': thumb.width + 'px',
  'min-height': thumb.height + 'px',
  'max-height': thumb.height + 'px',
  padding: 0,
  border: 0,
  'border-radius': 0,
  cursor: 'default',
  'text-indent': '-999999px' // -moz-user-select: none; breaks mouse events
};
var onChange = document.createEvent('HTMLEvents');
onChange.initEvent('change', true, false);

if (document.readyState == 'loading')
  document.addEventListener('DOMContentLoaded', initialize, false);
else
  initialize();

function initialize() {
  // create slider affordance
  var scale = document.body.appendChild(document.createElement('hr'));
  style(scale, {
    '-moz-appearance': isMac ? 'scale-horizontal' : 'scalethumb-horizontal',
    display: 'block',
    visibility: 'visible',
    opacity: 1,
    position: 'fixed',
    top: '-999999px'
  });
  document.mozSetImageElement('__sliderthumb__', scale);
  // create initial sliders
  Array.forEach(document.querySelectorAll('input[type=range]'), transform);
  // create sliders on-the-fly
  document.addEventListener('DOMNodeInserted', onNodeInserted, false);
}

function onNodeInserted(e) {
  check(e.target);
  if (e.target.querySelectorAll)
    Array.forEach(e.target.querySelectorAll('input'), check);
}

function check(input, async) {
  if (input.localName != 'input' || input.type == 'range');
  else if (input.getAttribute('type') == 'range')
    transform(input);
  else if (!async)
    setTimeout(onTheFly, 0, e, true);
}

function transform(slider) {

  var isValueSet, areAttrsSet, isChanged, isClick, prevValue, rawValue, prevX;
  var min, max, step, range, value = slider.value;

  // reimplement value and type properties
  slider.__defineGetter__('value', function() {
    return '' + value;
  });
  slider.__defineSetter__('value', function(val) {
    value = '' + val;
    isValueSet = true;
    draw();
  });
  slider.__defineGetter__('type', function() {
    return 'range';
  });

  // sync properties with attributes
  ['min', 'max', 'step'].forEach(function(prop) {
    if (slider.hasAttribute(prop))
      areAttrsSet = true;
    slider.__defineGetter__(prop, function() {
      return this.hasAttribute(prop) ? this.getAttribute(prop) : '';
    });
    slider.__defineSetter__(prop, function(val) {
      val === null ? this.removeAttribute(prop) : this.setAttribute(prop, val);
    });
  });

  // initialize slider
  slider.readOnly = true;
  style(slider, styles);
  update();

  slider.addEventListener('DOMAttrModified', function(e) {
    // note that value attribute only sets initial value
    if (e.attrName == 'value' && !isValueSet) {
      value = e.newValue;
      draw();
    }
    else if (~['min', 'max', 'step'].indexOf(e.attrName)) {
      update();
      areAttrsSet = true;
    }
  }, false);

  slider.addEventListener('mousedown', onDragStart, false);
  slider.addEventListener('keydown', onKeyDown, false);
  slider.addEventListener('focus', onFocus, false);
  slider.addEventListener('blur', onBlur, false);

  function onDragStart(e) {
    isClick = true;
    setTimeout(function() { isClick = false; }, 0);
    if (e.button || !range)
      return;
    var width = parseFloat(getComputedStyle(this, 0).width);
    var multiplier = (width - thumb.width) / range;
    if (!multiplier)
      return;
    // distance between click and center of thumb
    var dev = e.clientX - this.getBoundingClientRect().left - thumb.width / 2 -
              (value - min) * multiplier;
    // if click was not on thumb, move thumb to click location
    if (Math.abs(dev) > thumb.radius) {
      isChanged = true;
      this.value -= -dev / multiplier;
    }
    rawValue = value;
    prevX = e.clientX;
    this.addEventListener('mousemove', onDrag, false);
    this.addEventListener('mouseup', onDragEnd, false);
  }

  function onDrag(e) {
    var width = parseFloat(getComputedStyle(this, 0).width);
    var multiplier = (width - thumb.width) / range;
    if (!multiplier)
      return;
    rawValue += (e.clientX - prevX) / multiplier;
    prevX = e.clientX;
    isChanged = true;
    this.value = rawValue;
  }

  function onDragEnd() {
    this.removeEventListener('mousemove', onDrag, false);
    this.removeEventListener('mouseup', onDragEnd, false);
  }

  function onKeyDown(e) {
    if (e.keyCode > 36 && e.keyCode < 41) { // 37-40: left, up, right, down
      onFocus.call(this);
      isChanged = true;
      this.value = value + (e.keyCode == 38 || e.keyCode == 39 ? step : -step);
    }
  }

  function onFocus() {
    if (!isClick)
      this.style.boxShadow = !isMac ? '0 0 0 2px #fb0' :
        '0 0 2px 1px -moz-mac-focusring, inset 0 0 1px -moz-mac-focusring';
  }

  function onBlur() {
    this.style.boxShadow = '';
  }

  // determines whether value is valid number in attribute form
  function isAttrNum(value) {
    return !isNaN(value) && +value == parseFloat(value);
  }

  // validates min, max, and step attributes and redraws
  function update() {
    min = isAttrNum(slider.min) ? +slider.min : 0;
    max = isAttrNum(slider.max) ? +slider.max : 100;
    step = isAttrNum(slider.step) ? +slider.step : 1;
    range = max - min;
    draw(true);
  }

  // recalculates value property
  function calc() {
    if (!isValueSet && !areAttrsSet)
      value = slider.getAttribute('value');
    if (!isAttrNum(value))
      value = (min + max) / 2;;
    // snap to step intervals (WebKit sometimes does not - bug?)
    value = Math.round((value - min) / step) * step + min;
    if (value < min)
      value = min;
    else if (value > max)
      value = min + ~~(range / step) * step;
  }

  // renders slider using CSS background ;)
  function draw(attrsModified) {
    calc();
    if (isChanged && value != prevValue)
      slider.dispatchEvent(onChange);
    isChanged = false;
    if (!attrsModified && value == prevValue)
      return;
    prevValue = value;
    var position = range ? (value - min) / range * 100 : 0;
    slider.style.background =
      '-moz-element(#__sliderthumb__) ' + position + '% no-repeat, ' + track;
  }

}

function style(element, styles) {
  for (var prop in styles)
    element.style.setProperty(prop, styles[prop], 'important');
}

};

var UI = {

    label : function(pos,text) {
        if(pos.z<0) return;
        $("body").append("<div id='"+text+"'; class='label' style='top:"+pos.y+"px;left:"+ pos.x+ "px;'>" +  text + "</div>");
    },


    optionsFromHash : function(selector, hash) {
        for (i in hash)
            $(selector).append("<option value='" + i + "'>" + i + "</option>");
    },

    box : function(params) {
        var id = params.id;
        var text = params.text || params.id;
        return $("<div class='caption' id='cap" +id+ "'" +
                "onclick='$(\".triangle\", this).toggle(); $(this).next().toggle(300);'>" +
                "<span class='triangle'><img src='textures/open.png'></span>" +
                "<span class='triangle' style='display:none' ><img src='textures/closed.png'></span>" +
                text + "</div><div id='" + id + "'></div>");
    },

    input : function(params) {
        var model = params.model;
        var id = params.id;
        var text = params.text || params.id;
        var min = params.min || 0;
        var max = params.max || 100;
        var step = params.step || 1;
        var value = params.value || window[model]["get"+id]();
        var change = params.change || model+ ".set"+id+"(Number(value)); $(\"#" + id + " > input\").attr(\"value\",Number(value));"

        ele =  $("<div id='" + id + "'>" +
            "<div>" + text + "</div>" +

            "<input type='text' min="+min+" max="+max+" step="+step+" value='" +value+ "' class='range' onchange='"+change+"'/>" +
            "</div>");
        return ele;
    },

    slider : function(params) {
        var model = params.model;
        var id = params.id;
        var tooltip = params.tip || "";
        var text = params.text || params.id;
        var min = params.min || 0;
        var max = params.max || 100;
        var step = params.step || 1;
        var value = params.value ||  model["get"+id]();
        var change = params.change || function()  { model["set"+id](Number(this.value)); $("#" + id + " > input").attr("value",Number(this.value)); };

        ele =  $("<div title='" + tooltip + "' id='" + id + "'>" +
            "<div>" + text + "</div>" +
            "<input type='range' min="+min+" max="+max+" step="+step+"  value='"+ value +"' class='slider'/>" +
            "<input type='text' min="+min+" max="+max+" step="+step+" value='" + value + "' class='range'/>" +
            "</div>");
        $("input",ele).bind("change",change);
        return ele;
    },

    checkbox : function(params) {
        var model = params.model;
        var id = params.id;
        var text = params.text || params.id;
        var change = params.change || function()  { model["set"+id](this.checked); };
        
        ele = $("<input type=checkbox name='visMode' checked='true'>"+ text + "</input>").bind("click", change);
                
        return ele;
    }
}



