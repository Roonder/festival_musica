const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes;
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

//JS
const terser = require('gulp-terser-js');

function css(done) {
    src('src/scss/**/*.scss') // Identificar el .SCSS a compilar
    .pipe( sourcemaps.init() ) // Incia el Sourcemaps (herramienta que mejora la localizacion de los elementos luego de minificar el css)
    .pipe( plumber())    
    .pipe( sass() ) // Compilar
    .pipe( postcss([autoprefixer(), cssnano()])) // Mejora y comprime el codigo al final
    .pipe( sourcemaps.write('.') ) // Esccribe la informacion en la misma carpeta del css
    .pipe( dest('build/css') )    // Almacenar
done();
}

function imagenes(done) {
    
    const opciones = {
        optimizationLevel: 3
    };
    
    src('src/img/**/*.{png,jpg}')
        .pipe( cache(imagemin(opciones)) )
        .pipe( dest('build/img'))


    done()
};

function versionWebp(done){

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )

    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe( sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

        done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.versionWebp = versionWebp;
exports.imagenes = imagenes;
exports.dev = parallel(imagenes, versionWebp, dev, javascript);