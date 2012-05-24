var casper = require('casper').create({
    verbose: true,
    faultTolerant: false,
    onError: function(self, m) {
      this.capture('error.png');
      // these lines aren't needed. phantom will log the same msg.
      //console.log("FATAL: " + m);
      //self.exit();
    }
});

// This causes problems:    
//var casper2 = Object.create(casper);

//Trying to add extensions to the casper.test object:
// (included here just for demonstration)
casper.test.assertNotVisible = function(selector) {
  casper.test.assertNot(casper.visible(selector), "expected " + selector + " to not be visible");
  // this client side util stuff didn't work for me here...
  //return !__utils__.visible(selector);
}

casper.waitAndClick = function(selector) {
  this.waitForSelector(selector, function() {
    this.click(selector);
  });  
}

// doesn't seem to work
casper.on('timeout', function() {
  this.capture('timeout.png');
});

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
    // TODO: figure out the xpath selectors...
    //this.click({type: "xpath", path: "//*[text()='14']"});
    //this.test.assertExists({type: "xpath", path: "//*[text()='14']"}, 'YAY for xpath');
    
    //HIDEOUS
    this.click('.dl-grid .dl-week:nth-child(3) .dl-day:nth-child(4)');
  });

  this.waitWhileVisible('.dl-grid', function() {
    this.test.assertEvalEquals(function() {
      return document.querySelector('#dateField').value;
    }, "05/16/2012", "date selected in picker is reflected in original field");
    this.test.assertNotVisible('.dl-grid');
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
    this.test.assertNotVisible('.dl-grid');
    this.test.assertTextExists('May 2012', 'May is displayed');
    this.test.assertEvalEquals(function() {
      return document.querySelector('#dateField').value;
    }, "5/2/2012", "date in original field does not change");
  });
});

function assertNextMonth(displayMonth) {
  casper.then(function() {
    casper.waitAndClick('.dl-next');
  });
  casper.then(function() {
    casper.test.assertTextExists(displayMonth, displayMonth + ' is displayed');
  })  
}

casper.thenOpen('http://localhost:8000/daylite.html').then( function() {
  casper.test.comment('test we can only navigate to a valid month');
  this.waitAndClick('#dateField');
  this.waitAndClick('.dl-prev');
  casper.then(function() {
    this.test.assertTextExists('May 2012', 'May is displayed');
  });
  assertNextMonth('June 2012');
  assertNextMonth('July 2012');
  assertNextMonth('August 2012');
  casper.repeat(2, function() {
    assertNextMonth('August 2012');
  });
  casper.then(function() {
    this.click('.dl-grid .dl-week:nth-child(2) .dl-day:nth-child(3)');
  });    
});

casper.run(function() {
  this.test.renderResults(true);
  this.test.done();
  this.exit();
});


