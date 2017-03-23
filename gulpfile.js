var gulp = require("gulp"),
	less = require("gulp-less"), 						// sass编译模块
	notify = require("gulp-notify"),                    // 通知错误，防止进程结束
	rename = require("gulp-rename"), 					// 重命名模块
	uglify = require("gulp-uglify"), 					// js压缩模块
	plumber = require("gulp-plumber"),					// 防止错误导致gulp退出
	postcss = require("gulp-postcss"),					// 自动添加前缀
	base64 = require("gulp-base64"),					// base64转码
	minifyCss = require("gulp-minify-css"), 			// css压缩模块
	autoprefixer = require("autoprefixer"),				// 前缀
	sourcemaps = require("gulp-sourcemaps"), 			// 映射
	browserSync = require("browser-sync").create();		// 自动刷新

// 编译，压缩less
gulp.task("less", function() {
	return gulp.src(["src/less/*.less", "!src/less/_*.less"])
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message%>")
		}))
		.pipe(less())
		.pipe(base64({
        	extensions: ["png", "jpg", "gif"],
        	maxImageSize: 6 * 1024
        }))
		// .on("error", function(err) { console.log(err); })
		.pipe(postcss([autoprefixer({browsers: ['last 10 version']})]))
		.pipe(gulp.dest("src/css"))
		.pipe(rename({suffix: ".min"}))
		.pipe(minifyCss())
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
});

// 压缩js
gulp.task("uglify", function() {
	return gulp.src("src/js/*.js")
		.pipe(plumber({
			errorHandler: function(error) {
				console.log(error);
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(sourcemaps.write("maps"))
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.stream());
});

// 监听scss和js文件
gulp.task("watch", ["less", "uglify"], function() {
	browserSync.init({
		server: "./"
	});
	gulp.watch("src/less/*.less", ["less"]);
	gulp.watch("src/js/*.js", ["uglify"]);
	gulp.watch("*.html").on('change', browserSync.reload);
});

// 默认情况下执行watch任务
gulp.task("default", ["watch"]);