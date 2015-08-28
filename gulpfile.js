var gulp = require("gulp");
var less = require('gulp-less');
var path = require('path');
var webserver = require('gulp-webserver');
var notify = require('gulp-notify');
 
gulp.task('less', function () {
  return gulp.src('./app/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./app/css'))
    .pipe(notify({message : 'less task complete'}))
});

//开发任务
gulp.task('dev',['less'],function(){
	gulp.watch('app/less/*.less',['less']);
	gulp.watch('app/*.html',['less']);

	gulp.src('app')
		.pipe(webserver({
			host : '0.0.0.0',
			port : '8060',
			livereload : {
				enable : true
			},
			open : true
		}))
		.pipe(notify({message : 'dev task complete'}));
})