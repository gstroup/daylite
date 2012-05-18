var casper = require('casper').create({
    verbose: true,
    faultTolerant: false,
    onError: function(self, m) {
      console.log("FATAL: " + m);
      self.exit();
    }
});

// This causes problems:    
//var casper2 = Object.create(casper);

// Trying to add extensions to the casper.test object:
//  (included here just for demonstration)
// casper.test.assertNotVisible = function(selector) {
//   // TODO: Fix this!  not working now.
//   casper.echo('visible? ' + casper.visible(selector));
//   casper.test.assertNot(casper.visible(selector), "expected " + selector + " to not be visible");
//   // this client side util stuff didn't work for me here...
//   //return !__utils__.visible(selector);
// }

//using the simple web server started by grunt
casper.start('http://localhost:8000/daylite.html').then( function() {
  casper.test.comment('test calendar grid is not visible at first');
  //this.capture('tmp.png');
  
  //this.test.assertNotVisible('.dl-grid');
  casper.test.assertNot( casper.exists('.dl-grid'), 'calendar grid does not exist');
});

casper.thenOpen('http://localhost:8000/daylite.html').then( function() {
  casper.test.comment("test date selected is set back to the original form");
  //this.debugHTML();
  this.waitForSelector('#dateField', function() {
    this.click('#dateField');
  });
  this.waitForSelector('.dl-grid', function() {
    // simple screen capture:
    //this.capture('tmp.png');   
    this.click('.dl-grid div:nth-child(6)');
  });

  this.waitWhileVisible('.dl-grid', function() {
    this.test.assertEvalEquals(function() {
      return document.querySelector('#dateField').value;
    }, "05/04/2012", "date selected in picker is reflected in original field");
  });  
  //this.debugPage();
});

casper.thenOpen('http://localhost:8000/daylite.html').then( function() {
  casper.test.comment('test we can not select an invalid date');
  casper.capture('tmp.png');
  
  this.waitForSelector('#dateField', function() {
    this.click('#dateField');
  });
  this.waitForSelector('.dl-grid', function() {
    // simple screen capture:
    //this.capture('tmp.png');   
    this.click('.dl-grid div:nth-child(2)');

  });
  casper.then( function() {
    casper.capture('tmp.png');
    //this.test.assertNotVisible('.dl-grid');
    this.test.assertTextExists('May', 'May is displayed');
    this.test.assertEvalEquals(function() {
      return document.querySelector('#dateField').value;
    }, "5/2/2012", "date in original field does not change");
  });
  
});

casper.run(function() {
  this.test.renderResults(true);
  this.test.done();
  this.exit();
});


