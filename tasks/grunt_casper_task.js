module.exports = function(grunt) {

  grunt.registerTask('casper', 'run functional tests with casper', function(arg1, arg2) {
    grunt.log.writeln(this.name + ", no args");

    var done = this.async();
    
    grunt.utils.spawn({
      cmd: 'casperjs',
      args: ['test/daylite_casper_test.js']
    },
    function (error, result, code) {
      //grunt.log.writeln('casper done');
      // If the exit code was non-zero and a fallback wasn't specified, the error
      // object is the same as the result object.
      grunt.log.writeln("casper error:" + error);
      // The result object is an object with the properties .stdout, .stderr, and
      // .code (exit code).
      grunt.log.writeln("casper output: \n" + result.stdout);
      // When result is coerced to a string, the value is stdout if the exit code
      // was zero, the fallback if the exit code was non-zero and a fallback was
      // specified, or stderr if the exit code was non-zero and a fallback was
      // not specified.
      //grunt.log.writeln("string result: " + String(result));
      // The numeric exit code.
      grunt.log.writeln("casper exit code: " + code);
      
      done();
    });
    
  });
}