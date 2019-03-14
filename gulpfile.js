var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var ftp = require( 'vinyl-ftp' );
var livereload = require('gulp-livereload');

// Css Task
gulp.task('sass', function () {
  return gulp.src('./css/*.scss') // Get The Source Files
  .pipe(sourcemaps.init()) // To Initialize The Sourcemap ( For Getting The Source (Line) Of Code In The Scss File )
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // Compile Sass Code To Css Code, Compress The Executed Code  & Log Errors
  .pipe(prefix('last 2 versions')) // Add Prefixes (Css3) For 2 Last versions of Browsers
  .pipe(concat('main.css')) // Concat Css Files Into One File
  .pipe(sourcemaps.write('maps')) // Create The Sourcemap In a Folder Named maps ( if we don't write the map in a precise destination it will be created in our file generated which make the size of the file more bigger )
  .pipe(gulp.dest('./build/css')) // Send The Files To The Destination
  .pipe(notify('Css Task Is Done !')) // Show Notification
  .pipe(livereload()) // Reload Page When Save Files
});

// Js Task
gulp.task('js', function () {
  return gulp.src('./js/*.js') // Get The Source Files
  .pipe(concat('main.js')) // Concat Js Files Into One File
  .pipe(uglify()) // Minify Js Files
  .pipe(gulp.dest('./build/js')) // Send The Files To The Destination
  .pipe(notify('JS Task Is Done !')) // Show Notification
  .pipe(livereload()) // Reload Page When Save Files
});

// Compress Files Task
gulp.task('compress', function () {
  return gulp.src('build/**/*.*') // Get All Files With Any Extension (*.*) Located On Any Directory (**) Under Build 
            .pipe(zip('MyCompressedWebsite.zip')) // Create A Zip File Called MyCompressedWebsite
            .pipe(gulp.dest('.')) // Send The File To The Destination At The Same Level As Gulpfile (.)
            .pipe(notify('Compresseion Task Is Done !')) // Show Notification

});

// Upload Files With FTP Task
gulp.task( 'deploy', function () {

  var conn = ftp.create( {
      host:     'mywebsite.tld',
      user:     'me',
      password: 'mypass',
      parallel: 10
  } );

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src( 'build/**/*.*', { base: '.', buffer: false } )
            .pipe( conn.newer( '/public_html' ) ) // only upload newer files (Don't Upload Non Modified Files)
            .pipe( conn.dest( '/public_html' ) ) // Send Files Under The public_html Folder
            .pipe(notify('Files Are Uploaded !')) // Show Notification
});

// Watch Task
gulp.task('watch', function () {
  gulp.watch('css/*.scss', ['sass']); // Watch The Css Task
  gulp.watch('js/*.js', ['js']); // Watch The Js Task
});