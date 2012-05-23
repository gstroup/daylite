define(["js/daylite"], function(daylite) {

  //var daylite = require("js/daylite");
  //document.onReadyStateChange = function () {
  //document.addEventListener( "DOMContentLoaded", function(){

    //window.alert("calling daylite init");  

  daylite.init(
    {
      container: "picker",
      dateFormat: "MM/DD/YYYY",
      specialDate: new Date(2012, 4, 28), //"05/28/2012",
      disableWeekends: true,
      disableDates: [], 
      minDate: new Date(2012, 4, 8),
      maxDate: new Date(2012, 7, 15),
      swipeEnabled: false,
      language: "en",
      onSelection: function() {
        // do something
      }
    }
  );
  
  document.getElementById('dateField').addEventListener("click", function () { daylite.open('dateField'); }, false);
  
  
  //});

});