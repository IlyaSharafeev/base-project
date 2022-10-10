import gulp from 'gulp';
import less from 'gulp-less';
import {deleteAsync} from 'del';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';

import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import size from 'gulp-size';

import newer from 'gulp-newer';

import browserSync from 'browser-sync';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

//Пути
const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist'
    },
    styles: {
        src: ['src/styles/**/*.less', 'src/styles/**/*.sass'],
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/*',
        dest: 'dist/img'
    },
}

export function clean() {
    return deleteAsync(['dist/*', '!dist/img'])
}

//Сборка стилей
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        // .pipe(less())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCss({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(size())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
}

//Сборка скриптов
export function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write())
        .pipe(size())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream())
}

//Сжатие картинок
export function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(size())
        .pipe(gulp.dest(paths.images.dest))
}

//Сжатие html
export function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(size())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream())
}

// Наблюдатель изменения стилей
export function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch(paths.html.dest).on('change', browserSync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Серия сборки
export const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch);