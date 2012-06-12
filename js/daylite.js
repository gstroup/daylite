define(["moment"], function(moment) {

  function init(options) {
    var o, 
      settings = {
        dateFormat: "MM/DD/YYYY",
        disableWeekends: false,
        disableDates: null, 
        specialDate: null, 
        minDate: null, 
        maxDate: null,
        swipeEnabled: false,
        language: "en",
        useTwitterBootstrap: true
      };
    for (o in options) {
      if (options.hasOwnProperty(o)) {
        settings[o] = options[o];
      }
    }
    //console.log("init lang: " + settings.language);      
    settings.specialDate = settings.specialDate ? moment(settings.specialDate) : null;
    settings.minDate = settings.minDate ? moment(settings.minDate) : null;
    settings.maxDate = settings.maxDate ? moment(settings.maxDate) : null;
    //moment.lang(settings.language);
    moment.lang("en");
    //console.log("moment lang: " + moment.lang());
    
    return settings;
  }

  function isDisabled (aMoment, disabledDates) {
    var i,
        aDate = aMoment.valueOf(),
        disabledLength = disabledDates ? disabledDates.length : 0;
    for (i=0; i<disabledLength; i++)
      {
        if (aDate === disabledDates[i].valueOf()) {
          return true;
        }
      }
      return false;
  }

  //// Handlers
  function incrementMonth(monthsToAdd, dateInCurrentMonth, container, settings) {
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
    updateGrid(dateInCurrentMonth, container, settings);
  }

  function onDateSelected(e, container, dateInCurrentMonth, settings) {
    var momentSelected, dayOfMonth;
    if (e.target.className.indexOf("dl-day-disabled")>0) {
      return false;
    }
    // TODO: trim?? use a data- attribute instead of innerHTML?  this.replace(/^\s+|\s+$/g, "");
    dayOfMonth = e.target.innerHTML;
    momentSelected = dateInCurrentMonth.date(dayOfMonth);
    if (settings.dateSelectedHandler) {
      settings.dateSelectedHandler(momentSelected.toDate());
    } else {
      document.getElementById(settings.formFieldId).value = momentSelected.format(settings.dateFormat);
      container.style.display = "none"; 
    }
  }

  function addHandlers(container, dateInCurrentMonth, settings) {
    container.getElementsByClassName('dl-prev')[0].addEventListener("click", function () { incrementMonth(-1, dateInCurrentMonth, container, settings); }, false);
    container.getElementsByClassName('dl-next')[0].addEventListener("click", function () { incrementMonth(1, dateInCurrentMonth, container, settings); }, false);
    container.getElementsByClassName('dl-grid')[0].addEventListener("click", function (e) { onDateSelected(e, container, dateInCurrentMonth, settings);}, false);
  }

  //// Html
  function buildHtmlForDay(date, dateInCurrentMonth, settings) {
    var dayOfMonth = date.date();
    if (settings.disableWeekends && (date.day() === 0 || date.day() === 6)) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";      
    } else if (date.month() !== dateInCurrentMonth.month()) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";
    } else if (settings.minDate && date.diff(settings.minDate, 'days') < 0) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";      
    } else if (settings.maxDate && date.diff(settings.maxDate, 'days') > 0) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";            
    } else if (settings.specialDate && date.diff(settings.specialDate, 'days') === 0) {
      return "<div class='dl-day dl-day-special'>" + dayOfMonth + "</div>";
    } 
    else if (isDisabled(date, settings.disableDates)) {
      return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";            
    }
    return "<div class='dl-day'>" + dayOfMonth + "</div>";
  }

  function buildHtmlForWeek(datesInWeek, htmlDays, dateInCurrentMonth, settings) {
    var i;
    htmlDays.push("<div class='dl-week'>");
    for (i=0; i<datesInWeek.length; i++) {
      htmlDays.push(buildHtmlForDay(datesInWeek[i], dateInCurrentMonth, settings));
    }
    htmlDays.push("</div>");
  }

  function displayHeader(anyDate, htmlDays, settings) {
    // TODO: use images for prev, next, add close
    if (settings.useTwitterBootstrap) {
      htmlDays.push("<div class='dl-head'><div class='dl-prev'><i class='icon-chevron-left'></i></div>");      
    } else {
      htmlDays.push("<div class='dl-head'><div class='dl-prev'><<</div>");      
    }
    htmlDays.push("<div class='dl-month-name'>" + anyDate.format("MMMM YYYY") + "</div>");
    if (settings.useTwitterBootstrap) {
      htmlDays.push("<div class='dl-next'><i class='icon-chevron-right'></i></div></div>");
    } else {
      htmlDays.push("<div class='dl-next'>>></div></div>");      
    }
  }

  function updateGrid(fieldValue, container, settings) {
    var daysInAWeek = [],
        htmlDays = [],
        prevMonthDays, nextMonthDays,
        i,j,k, dateI,
        selectedDate = fieldValue ? moment(fieldValue) : moment(new Date()),
        dateInCurrentMonth = dateInCurrentMonth || selectedDate,
        daysInMonth = selectedDate.daysInMonth();
  
    htmlDays.push("<div class='dl-container'>");
    displayHeader(selectedDate, htmlDays, settings);
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
        buildHtmlForWeek(daysInAWeek, htmlDays, dateInCurrentMonth, settings);
        // start a new week row
        daysInAWeek = [];
      }
    
      if (i===daysInMonth) {
        buildHtmlForWeek(daysInAWeek, htmlDays, dateInCurrentMonth, settings);
      }
       
    }
  
    htmlDays.push("</div></div>");

    container.innerHTML = htmlDays.join(" ");
      //_.template("<div><%=(x)%></div>", "data");
    
    addHandlers(container, dateInCurrentMonth, settings);
  }

  function constructor(containerSelector) {
    var newDaylite = {},
        container = document.getElementById(containerSelector);
    
    newDaylite.settings = {};
    newDaylite.init = function(options) {
      newDaylite.settings = init(options);
    };
    newDaylite.open = function(fieldId) {
      updateGrid(document.getElementById(fieldId).value, container, newDaylite.settings);
      container.style.display = "block";      
    };
    
    return newDaylite;
  }

  return constructor;
});
