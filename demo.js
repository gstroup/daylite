define(["js/daylite"], function(daylite) {

  //var daylite = require("js/daylite");
  //document.onReadyStateChange = function () {
  //document.addEventListener( "DOMContentLoaded", function(){

    //window.alert("calling daylite init");  

  daylite.init(
    {
      container: "picker",
      dateFormat: "MM/DD/YYYY",
      specialDate: "05/28/2012",
      disableWeekends: true,
      disableDates: [], 
      minDate: new Date(Date.parse("Tue 01 May 2012 00:00:00 EST-0500")), 
      maxDate: new Date (Date.parse("Mon 31 Dec 2012 00:00:00 EST-0500")),
			swipeEnabled: false,
      onSelection: function() {
        // do something
      }
    }
  );
  
  document.getElementById('dateField').addEventListener("click", function () { daylite.open('dateField'); }, false);
  
  
  //});

});