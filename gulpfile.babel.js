"use strict";

import { src, dest, watch, parallel, series } from "gulp";
import gulpif from "gulp-if";
import browsersync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import babel from "gulp-babel";
import browserify from "browserify";
import watchify from "watchify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import uglify from "gulp-uglify";
import sass from "gulp-sass";
import mincss from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import imagemin from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import imageminZopfli from "imagemin-zopfli";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminGiflossy from "imagemin-giflossy";
import imageminSvgo from "imagemin-svgo";
import replace from "gulp-replace";
import rigger from "gulp-rigger";
import plumber from "gulp-plumber";
import debug from "gulp-debug";
import clean from "gulp-clean";
import yargs from "yargs";

const argv = yargs.argv;
const production = !!argv.production;

const paths = {
    src: {
        html: [
            "./app/index.html",
        ],
        styles: "./app/src/sass/*.scss",
        parts: "./app/src/sass/parts/*.scss",
        scripts: "./app/src/js/**/*.js",
        font: "./app/src/font/**",
        images: [
            "./app/src/img/**/*.{jpg,jpeg,png,gif,svg}"
        ]
    },
    build: {
        clean: ["./dist/*", "./dist/.*"],
        general: "./dist/",
        styles: "./dist/css/",
        font: "./dist/font",
        scripts: "./dist/js/",
        images: "./dist/img/"
    }
};

export const server = () => {
    browsersync.init({
        server: paths.build.general,
        port: 9000,
        tunnel: true,
        notify: false,
        open: false
    });
};

export const watchCode = () => {
    watch(paths.src.html, html);
    watch(paths.src.styles, styles);
    watch(paths.src.parts, styles);
    watch(paths.src.scripts, scripts);
    watch(paths.src.images, images);
};

export const cleanFiles = () => src(paths.build.clean, {read: false})
    .pipe(clean())
    .pipe(debug({
        "title": "Cleaning..."
    }));

export const html = () => src(paths.src.html)
    .pipe(rigger())
    .pipe(gulpif(production, replace("main.css", "main.min.css")))
    .pipe(gulpif(production, replace("main.js", "main.min.js")))
    .pipe(dest(paths.build.general))
    .pipe(debug({
        "title": "HTML files"
    }))
    .on("end", browsersync.reload);

export const styles = () => src(paths.src.styles)
    .pipe(plumber())
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(sass())
    .pipe(gulpif(production, autoprefixer({
        browsers: ["last 12 versions", "> 1%", "ie 8", "ie 7"]
    })))
    .pipe(gulpif(!production, browsersync.stream()))
    .pipe(gulpif(production, mincss({
        compatibility: "ie8", level: {
            1: {
                specialComments: 0,
                removeEmpty: true,
                removeWhitespace: true
            },
            2: {
                mergeMedia: true,
                removeEmpty: true,
                removeDuplicateFontRules: true,
                removeDuplicateMediaBlocks: true,
                removeDuplicateRules: true,
                removeUnusedAtRules: false
            }
        }
    })))
    .pipe(gulpif(production, rename({
        suffix: ".min"
    })))
    .pipe(plumber.stop())
    .pipe(gulpif(!production, sourcemaps.write("./maps/")))
    .pipe(dest(paths.build.styles))
    .pipe(debug({
        "title": "CSS files"
    }))
    .on("end", () => production ? browsersync.reload : null);

export const scripts = () => {
    let bundler = browserify({
        entries: "./app/src/js/main.js",
        cache: { },
        packageCache: { },
        fullPaths: true,
        debug: true
    }).transform("babelify", {presets: ["@babel/preset-env"]});

    const bundle = () => {
        return bundler
            .bundle()
            .on('error', function () {})
            .pipe(source("main.js"))
            .pipe(buffer())
            .pipe(gulpif(!production, sourcemaps.init()))
            .pipe(babel())
            .pipe(gulpif(production, uglify()))
            .pipe(gulpif(production, rename({
                suffix: ".min"
            })))
            .pipe(gulpif(!production, sourcemaps.write("./maps/")))
            .pipe(dest(paths.build.scripts))
            .pipe(debug({
                "title": "JS files"
            }))
            .on("end", browsersync.reload);
    };

    if(global.isWatching) {
        bundler = watchify(bundler);
        bundler.on('update', bundle);
    }

    return bundle();
};

export const fonts = () => src(paths.src.font)
    .pipe(dest(paths.build.font));

export const images = () => src(paths.src.images)
    .pipe(gulpif(production, imagemin([
        imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3,
            lossy: 2
        }),
        imageminPngquant({
            speed: 5,
            quality: 75
        }),
        imageminZopfli({
            more: true
        }),
        imageminMozjpeg({
            progressive: true,
            quality: 70
        }),
        imageminSvgo({
            plugins: [{
                removeViewBox: true,
                removeComments: true,
                removeEmptyAttrs: true,
                removeEmptyText: true,
                removeUnusedNS:true,
                cleanupIDs: true,
                collapseGroups: true
            }]
        })
    ])))
    .pipe(dest(paths.build.images))
    .pipe(debug({
        "title": "Images"
    }))
    .on("end", browsersync.reload);

export const development = series(cleanFiles, parallel(html, styles, scripts, fonts, images),
    parallel(watchCode, server));

export const prod = series(cleanFiles, html, styles, scripts, fonts, images);

export default development;