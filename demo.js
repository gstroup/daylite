define(["js/daylite"], function (daylite) {

  //var daylite = require("js/daylite");
  //document.onReadyStateChange = function () {
  //document.addEventListener( "DOMContentLoaded", function(){

    //window.alert("calling daylite init");  
  var calendar, calendar2;
  
  calendar = daylite("picker");
  calendar.init(
    {
      //container: "picker",
      dateFormat: "MM/DD/YYYY",
      specialDate: new Date(2012, 4, 25), 
      disableWeekends: true,
      disableDates: [new Date(2012, 4, 28), new Date(2012, 6, 4)], 
      minDate: new Date(2012, 4, 8),
      maxDate: new Date(2012, 7, 15),
      swipeEnabled: false,
      //language: "en",
      useTwitterBootstrap: true,
      formFieldId: "dateField"
    }
  );
  
  calendar2 = daylite("secondPicker");
  calendar2.init(
    {
      //container: "secondPicker",
      dateFormat: "MM/DD/YYYY",
      specialDate: new Date(2012, 4, 25), 
      disableWeekends: false,
      disableDates: [new Date(2012, 4, 28), new Date(2012, 6, 4)], 
      minDate: new Date(2012, 3, 8),
      maxDate: new Date(2012, 8, 15),
      swipeEnabled: false,
      //language: "fr",
      useTwitterBootstrap: true,
      formFieldId: "secondDateField",
      dateSelectedHandler: function(jsDate) {
        window.alert("Date was selected: " + jsDate);
        document.getElementById("secondPicker").style.display = "none";
      }
    }
  );
  
  document.getElementById('dateField').addEventListener("click", function () { calendar.open('dateField'); }, false);
  
  document.getElementById('secondDateField').addEventListener("click", function () { calendar2.open('secondDateField'); }, false);  
  
  //});

});