define(["moment"], function(moment) {

//var daylite = function() {
  var settings, container, selectedDate, 
      dateInCurrentMonth, formFieldId;
  
  function init(options) {
    //window.alert("init called. " + options.container);
    var o;
    settings = {
      dateFormat: "MM/DD/YYYY",
      disableWeekends: false,
      disableDates: null, 
      specialDate: null, 
      minDate: null, 
      maxDate: null,
			swipeEnabled: false,
      language: "en"
    };
    for (o in options) {
      if (options.hasOwnProperty(o)) {
        settings[o] = options[o];
      }
    }
    settings.specialDate = settings.specialDate ? moment(settings.specialDate) : null;
    settings.minDate = settings.minDate ? moment(settings.minDate) : null;
    settings.maxDate = settings.maxDate ? moment(settings.maxDate) : null;
    moment.lang(settings.language);
    container = document.getElementById(settings.container);
  }
  
  //// Handlers
  function incrementMonth(monthsToAdd) {
    if (settings.minDate && monthsToAdd < 0) {
      if (settings.minDate.diff( dateInCurrentMonth.clone().date(1) ) > 0) {
        return false;
      }
    } 
    if (settings.maxDate && monthsToAdd > 0) {
      if (settings.maxDate.diff( dateInCurrentMonth.clone().add("M", monthsToAdd).date(1) ) < 0) {
        return false;
      }
    }
    
    dateInCurrentMonth.add("M", monthsToAdd);
    //console.log("dateInCurrentMonth: " + dateInCurrentMonth);
    updateGrid(dateInCurrentMonth);
  }
  
  function onDateSelected(e) {
    if (e.target.className.indexOf("dl-day-disabled")>0) {
      return false;
    }
    // TODO: trim?? use an attribute instead of innerHTML
    var dayOfMonth = e.target.innerHTML;
    document.getElementById(formFieldId).value = dateInCurrentMonth.date(dayOfMonth).format(settings.dateFormat);
    container.style.display = "none";    
  }
  
  function addHandlers() {
    container.getElementsByClassName('dl-prev')[0].addEventListener("click", function () { incrementMonth(-1); }, false);
    container.getElementsByClassName('dl-next')[0].addEventListener("click", function () { incrementMonth(1); }, false);
    container.getElementsByClassName('dl-grid')[0].addEventListener("click", function (e) { onDateSelected(e);}, false);
  }
  
  //// Html
  function buildHtmlForDay(date, htmlDays) {
    var dayOfMonth = date.date();
    if (settings.disableWeekends && (date.day() === 0 || date.day() === 6)) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";      
    } else if (date.month() !== dateInCurrentMonth.month()) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";
    } else if (settings.minDate && date.diff(settings.minDate, 'days') < 0) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";      
    } else if (settings.maxDate && date.diff(settings.maxDate, 'days') > 0) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";            
    } else if (settings.specialDate && date.diff(settings.specialDate) === 0) {
      return "<div class='dl-day dl-day-special'>" + dayOfMonth + "</div>";
    }
    return "<div class='dl-day'>" + dayOfMonth + "</div>";
    //return "<div class='day'><a href='" + dayOfMonth + "'>" + dayOfMonth + "</a></div>";
    //return "<div class='day' onclick='daylite.onDateSelected(" + dayOfMonth + ");'>" + dayOfMonth + "</div>";
  }
  
  function buildHtmlForWeek(datesInWeek, htmlDays) {
    var i;
    htmlDays.push("<div class='dl-week'>");
    for (i=0; i<datesInWeek.length; i++) {
      htmlDays.push(buildHtmlForDay(datesInWeek[i], htmlDays));
    }
    htmlDays.push("</div>");
  }
  
  function displayHeader(anyDate, htmlDays) {
    // TODO: use images for prev, next, add close
    htmlDays.push("<div class='dl-head'><div class='dl-prev'><<</div>");
    htmlDays.push("<div class='dl-month-name'>" + anyDate.format("MMMM YYYY") + "</div>");
    htmlDays.push("<div class='dl-next'>>></div></div>");
  }
  
  function updateGrid(fieldValue) {
    var daysInAWeek = [],
        htmlDays = [],
        daysInMonth,
        prevMonthDays, nextMonthDays,
        i,j,k, dateI;
    selectedDate = fieldValue ? moment(fieldValue) : moment(new Date());
    dateInCurrentMonth = dateInCurrentMonth || selectedDate;
    daysInMonth = selectedDate.daysInMonth();
    
    container.innerHTML = '';
    displayHeader(selectedDate, htmlDays);
    htmlDays.push("<div class='dl-grid'>");
    
    for (i=1; i<=daysInMonth; i++) {
      // TODO: clean up !!!!!
      //console.log("i=" + i);
      dateI = selectedDate.clone().date(i);
      
      // days from prev month
      if (dateI.date()===1 && dateI.day() > 0) {
        prevMonthDays = dateI.day();
        for (j=prevMonthDays; j>0; j--) {
          //daysInAWeek.push(dateI)
          daysInAWeek.push(dateI.clone().subtract('days', j));
        }
      } 
      
      daysInAWeek.push(dateI);
      
      // days from next month
      if (i===daysInMonth && dateI.day() < 6) {
        nextMonthDays = 6 - dateI.day();
        for (k=1; k<=nextMonthDays; k++) {
          daysInAWeek.push(dateI.clone().add('days', k));
        }
      }
      
      if (dateI.day() === 6) {
        buildHtmlForWeek(daysInAWeek, htmlDays);
        // start a new week row
        daysInAWeek = [];
      }
      
      if (i===daysInMonth) {
        buildHtmlForWeek(daysInAWeek, htmlDays);
      }
         
    }
    
    htmlDays.push("</div>");

    container.innerHTML += htmlDays.join(" ");
      //_.template("<div><%=(x)%></div>", "data");
      
    addHandlers();
  }
  
  function open(fieldId) {
    //window.alert("open called." + document.getElementById(formFieldId).value );
    formFieldId = fieldId;
    updateGrid(document.getElementById(fieldId).value);
    container.style.display = "block";
  }
  
  return {
    init: init,
    open: open,
    onDateSelected: onDateSelected
  };
//}

});