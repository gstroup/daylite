module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/daylite_test.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      // qunit.js throws tons of lint problems.
      //files: ['grunt.js', 'js/**/*.js',  'test/**/*.js']
      files: ['grunt.js', 'js/**/*.js', 'test/daylite_casper_test.js', 'test/daylite_test.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },
      globals: {
        exports: true,
        define: true,
        browser: true,
        document: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');

  // A convenient task alias.
  grunt.registerTask('uitest', 'server casper');
  
  grunt.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + ", no args");
    } else {
      grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
    }
  });
  
  grunt.loadTasks('tasks');
};