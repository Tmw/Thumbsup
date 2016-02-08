import gulp   from 'gulp';
import babel  from 'gulp-babel';
import sass   from 'gulp-sass';
import { Server } from 'karma';

// default task builds, copies and transpiles
gulp.task('default', ['build', 'pack-chrome', 'pack-safari', 'style', 'start-karma', 'watch']);

// transpile ES6
gulp.task('build', () => {
  return gulp.src('src/common/main.js')
          .pipe(babel())
          .pipe(gulp.dest('dist/chrome'))
          .pipe(gulp.dest('dist/safari/thumbsup.safariextension'));
});

// copy the Chrome dependencies
gulp.task('pack-chrome', () => {
  return gulp.src('src/chrome/*')
          .pipe(gulp.dest('./dist/chrome'));
});

// copy the Safari dependencies
gulp.task('pack-safari', () => {
  return gulp.src('src/safari/*')
          .pipe(gulp.dest('./dist/safari/thumbsup.safariextension'));
});

// transpile the sass
gulp.task('style', () => {
  return gulp.src('src/common/main.sass')
              .pipe(sass())
              .pipe(gulp.dest('./dist/chrome'))
              .pipe(gulp.dest('./dist/safari/thumbsup.safariextension'));
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
  gulp.watch('src/common/*', ['style', 'build']);
  gulp.watch('src/chrome/*', ['pack-chrome']);
  gulp.watch('src/safari/*', ['pack-safari']);
});
