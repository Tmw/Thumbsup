import gulp   from 'gulp';
import babel  from 'gulp-babel';
import sass   from 'gulp-sass';
import { Server } from 'karma';

// default task builds, copies and transpiles
gulp.task('default', ['build', 'copy-manifest', 'style', 'start-karma', 'watch']);

// transpile ES6
gulp.task('build', () => {
  return gulp.src('src/main.js')
          .pipe(babel())
          .pipe(gulp.dest('dist'));
});

// copy the chrome manifest file
gulp.task('copy-manifest', () => {
  return gulp.src('src/manifest.json')
          .pipe(gulp.dest('./dist'));
});

// transpile the sass
gulp.task('style', () => {
  return gulp.src('src/main.sass')
              .pipe(sass())
              .pipe(gulp.dest('./dist'));
});

// start the karma test server
gulp.task('start-karma', (done) => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
  }, done).start();
});

// kickoff the watcherss for tasks defined above
gulp.task('watch', () => {
  gulp.watch('src/main.sass',     ['style']);
  gulp.watch('src/main.js',       ['build']);
  gulp.watch('src/manifest.json', ['copy-manifest']);
});
