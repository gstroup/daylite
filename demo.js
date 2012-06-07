define(["js/daylite"], function (daylite) {

  //var daylite = require("js/daylite");
  //document.onReadyStateChange = function () {
  //document.addEventListener( "DOMContentLoaded", function(){

    //window.alert("calling daylite init");  
  //var calendar, calendar2
  
  daylite.init(
    {
      container: "picker",
      dateFormat: "MM/DD/YYYY",
      specialDate: new Date(2012, 4, 25), 
      disableWeekends: true,
      disableDates: [new Date(2012, 4, 28), new Date(2012, 6, 4)], 
      minDate: new Date(2012, 4, 8),
      maxDate: new Date(2012, 7, 15),
      swipeEnabled: false,
      language: "en",
      useTwitterBootstrap: true
    }
  );
  
  // daylite2.init(
  //   {
  //     container: "secondPicker",
  //     dateFormat: "MM/DD/YYYY",
  //     specialDate: new Date(2012, 4, 25), 
  //     disableWeekends: true,
  //     disableDates: [new Date(2012, 4, 28), new Date(2012, 6, 4)], 
  //     minDate: new Date(2012, 4, 8),
  //     maxDate: new Date(2012, 7, 15),
  //     swipeEnabled: false,
  //     language: "fr",
  //     useTwitterBootstrap: true
  //     // dateSelectedHandler: function(jsDate) {
  //     //   window.alert("Date was selected: " + jsDate);
  //     //   document.getElementById("picker").style.display = "none";
  //     // }
  //   }
  // );
  
  document.getElementById('dateField').addEventListener("click", function () { daylite.open('dateField'); }, false);
  
  // document.getElementById('secondDateField').addEventListener("click", function () { daylite2.open('secondDateField'); }, false);  
  
  //});

});