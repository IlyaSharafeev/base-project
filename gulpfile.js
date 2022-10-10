import gulp from 'gulp';
import less from 'gulp-less';
import {deleteAsync} from 'del';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';

//Пути
const paths = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

export function clean() {
    return deleteAsync(['dist'])
}

//Сборка стилей
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCss())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

//Сборка скриптов
export function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
}

// Наблюдатель изменения стилей
export function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Серия сборки
export const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);