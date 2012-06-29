define(["javascripts/lib/moment/moment"], function(moment) {

  function Daylite(containerSelector) {
    var newDaylite = {},
        container = document.getElementById(containerSelector),
        selectedDate,
        oldMonthHtml, // store in memory, so we don't have to parse the dom
        settings = {};
           
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
    function incrementMonth(monthsToAdd, dateInCurrentMonth) {
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
      updateGrid(dateInCurrentMonth, monthsToAdd);
    }

    function onDateSelected(e, dateInCurrentMonth) {
      var momentSelected, dayOfMonth;
      // use e.target.classList.contains() ??
      if (e.target.className.indexOf("dl-day")<0 ||
          e.target.className.indexOf("dl-day-disabled")>0) {
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
      selectedDate = momentSelected;
      oldMonthHtml = null;
    }

    function handleSwipes(dateInCurrentMonth) {
      var swipe, swipeLeft, startX;

      container.ontouchend = function(e) {
        //swipe left
        if( swipeLeft && swipe ) { 
          incrementMonth(-1, dateInCurrentMonth);
          e.stopPropagation();
        //swipe right
        } else if(swipe) {
          incrementMonth(1, dateInCurrentMonth);
          e.stopPropagation();          
        }       
      };

      container.ontouchmove = function(e){
        if( Math.abs(e.touches[0].pageX - startX) > 100 ) { 
          if( (e.touches[0].pageX - startX) > 5 ) { 
            swipeLeft = true;
          } else {
            swipeLeft = false;
          }
          swipe = true;
        }
      };

      container.ontouchstart = function(e) {
        startX = e.touches[0].pageX;
        swipe = false;
      };
    }

    function addHandlers(dateInCurrentMonth) {
      // TODO: make sure that querySelector is well supported by mobile browsers.
      container.querySelector('.dl-month .dl-prev').addEventListener("click", function () { incrementMonth(-1, dateInCurrentMonth); }, false);
      container.querySelector('.dl-month .dl-next').addEventListener("click", function () { incrementMonth(1, dateInCurrentMonth); }, false);
      container.querySelector('.dl-month .dl-grid').addEventListener("click", function (e) { onDateSelected(e, dateInCurrentMonth);}, false);
      if (settings.animate) {
        // TODO: handle transition for other browsers.
        container.querySelector('.dl-months').addEventListener("webkitTransitionEnd", function() {
          //console.log("transition end handler called");
          // hide the old month so we don't see the edge of it hanging around.
          container.querySelector('.dl-month-old').style.visibility = "hidden";
        });
      }
      if (settings.swipeEnabled) {
        handleSwipes(dateInCurrentMonth);
      }
    }

    //// Html
    function buildHtmlForDay(date, dateInCurrentMonth) {
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
      } else if (isDisabled(date, settings.disableDates)) {
        return "<div class='dl-day dl-day-disabled'>" + dayOfMonth + "</div>";            
      } else if (selectedDate.valueOf() === date.valueOf()) {
        return "<div class='dl-day dl-day-selected'>" + dayOfMonth + "</div>";
      }
      return "<div class='dl-day'>" + dayOfMonth + "</div>";
    }

    function buildHtmlForWeek(datesInWeek, htmlDays, dateInCurrentMonth) {
      var i;
      htmlDays.push("<div class='dl-week'>");
      for (i=0; i<datesInWeek.length; i++) {
        htmlDays.push(buildHtmlForDay(datesInWeek[i], dateInCurrentMonth));
      }
      htmlDays.push("</div>");
    }

    function displayHeader(anyDate, htmlDays) {
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

    function updateGrid(dateInCurrentMonth, monthsToAdd) {
      var daysInAWeek = [],
          htmlDays = [],
          prevMonthDays, nextMonthDays,
          i,j,k, dateI,
          daysInMonth, 
          newMonthHtml,
          dlMonthsStyle; 
    
      selectedDate = selectedDate || moment(new Date());
      dateInCurrentMonth = dateInCurrentMonth || selectedDate.clone();
      daysInMonth = dateInCurrentMonth.daysInMonth();     
  
      htmlDays.push("<div class='dl-month'>");
      displayHeader(dateInCurrentMonth, htmlDays);
      htmlDays.push("<div class='dl-grid'>");
  
      for (i=1; i<=daysInMonth; i++) {
        // TODO: clean up
        //console.log("i=" + i);
        dateI = dateInCurrentMonth.clone().date(i);
    
        // days from prev month
        if (dateI.date()===1 && dateI.day() > 0) {
          prevMonthDays = dateI.day();
          for (j=prevMonthDays; j>0; j--) {
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
          buildHtmlForWeek(daysInAWeek, htmlDays, dateInCurrentMonth);
          // start a new week row
          daysInAWeek = [];
        }
    
        if (i===daysInMonth) {
          buildHtmlForWeek(daysInAWeek, htmlDays, dateInCurrentMonth);
        }
       
      }  
      htmlDays.push("</div></div>");  // dl-month, dl-grid
      newMonthHtml = htmlDays.join(" ");

      if (settings.animate) {
        if (monthsToAdd < 0) {
          htmlDays.push(oldMonthHtml);
          htmlDays.unshift("<div class='dl-container'><div class='dl-months dl-left'>");          
        } else {
          htmlDays.unshift(oldMonthHtml);      
          htmlDays.unshift("<div class='dl-container'><div class='dl-months'>");              
        }
      } else {
        htmlDays.unshift("<div class='dl-container'><div class='dl-months'>");
      }
      htmlDays.push("</div></div>");        

      container.innerHTML = htmlDays.join(" ");
      oldMonthHtml = newMonthHtml.replace("dl-month'", "dl-month-old'");
      
      if (settings.animate) {
        // seems like the mobile browser needs a tick to repaint, before we can do the transition
        setTimeout(function() {          
        
          dlMonthsStyle = container.querySelector('.dl-months').style;
          // dlContainerStyle.webkitTransitionDuration = dlContainerStyle.MozTransitionDuration = dlContainerStyle.msTransitionDuration = dlContainerStyle.OTransitionDuration = dlContainerStyle.transitionDuration = '1000ms';
          dlMonthsStyle.webkitTransition = dlMonthsStyle.MozTransitionDuration = "all 400ms ease-in";

          // translate to given index position
          // style.MozTransform = style.webkitTransform = 'translate3d(' + -(index * this.width) + 'px,0,0)';
          //         style.msTransform = style.OTransform = 'translateX(' + -(index * this.width) + 'px)';
          dlMonthsStyle.MozTransform = dlMonthsStyle.webkitTransform = 'translate(' + -(monthsToAdd * 48) + '%,0)';
        }, 3);
      }
      
      addHandlers(dateInCurrentMonth);
    }

    newDaylite.init = function(options) {
      settings = init(options);
    };
    newDaylite.open = function(fieldId) {
      var fieldValue = document.getElementById(fieldId).value;
      if (fieldValue) {
        selectedDate = moment(fieldValue);
      } else if (!selectedDate) {
        selectedDate = moment(new Date()).sod();
      }
      updateGrid(null);
      container.style.display = "block";      
    };
    newDaylite.onDateSelected = onDateSelected;
    
    return newDaylite;
  }

  return Daylite;
});
