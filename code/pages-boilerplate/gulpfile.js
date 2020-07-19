const { src, dest, parallel, series, watch, task } = require("gulp");
const path = require("path");
const del = require("del");
const browserSync = require("browser-sync");
const loadPlugins = require("gulp-load-plugins");

const plugins = loadPlugins();
const bs = browserSync.create();

const distDir = "dist";
const tempDir = "temp";
const styleSrc = ["src/assets/styles/*.scss"];
const jsSrc = ["src/assets/scripts/*.js"];
const htmlSrc = ["src/*.html"];
const imgSrc = ["src/assets/images/**"];
const fontSrc = ["src/assets/fonts/**"];
const extraSrc = ["public/**"];
const tempHtml = ["temp/*.html"];

const clean = () => {
  return del([distDir, tempDir]);
};

/**
 * Clean the `dist` & `temp` files.
 */
task("clean", clean);

// compile styles
const style = () => {
  return src(styleSrc /* , { base: "src" } */)
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest(tempDir));
};

// compile scripts
const script = () => {
  return src(jsSrc)
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest(tempDir));
};

// compile html
const page = () => {
  return src(htmlSrc)
    .pipe(plugins.swig({ defaults: { cache: false } }))
    .pipe(dest(tempDir)));
};

// minify image
const image = () => {
  return src(imgSrc).pipe(plugins.imagemin()).pipe(dest(distDir));
};

// minify fonts
const font = () => {
  return src(fontSrc).pipe(plugins.imagemin()).pipe(dest(distDir));
};

// copy others
const extra = () => {
  return src(extraSrc).pipe(dest(distDir));
};

const checkPort = (port) => {
  port = +port;
  return port <= 65535 && port >= 0;
};

// serve
const serve = (port, open) => () => {
  const args = process.argv.slice(3);
  if (checkPort(port)) {
    port = +port;
  } else {
    const portIdx = args.indexOf("--port");
    let port = +args[portIdx + 1];
    port = checkPort(port) ? port : 5210;
  }
  if (open === undefined) {
    open = args.includes("--open");
  } else {
    open = !!open;
  }

  bs.init({
    notify: false,
    port,
    open,
    // files: 'dist/**',
    server: {
      baseDir: [tempDir, "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });

  watch(styleSrc, series(style, bs.reload));
  watch(jsSrc, series(script, bs.reload));
  watch(htmlSrc, series(page, bs.reload));
  watch([...imgSrc, ...fontSrc, ...extraSrc], bs.reload);
};

/**
 * serve --port 5210 --open
 * Runs the app in development mode with a automated server.
 * */
task("serve", serve());

// handle html
const useref = (isProd) => () => {
  return src(tempHtml, { base: tempDir })
    .pipe(plugins.useref({ searchPath: [tempDir, "."] }))
    .pipe(plugins.if(isProd && /\.js$/, plugins.uglify()))
    .pipe(plugins.if(isProd && /\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        isProd && /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest(distDir));
};

const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = (done) => {
  const args = process.argv;
  const isProd = args.includes("--production") || args.includes("--prod");
  return series(
    clean,
    parallel(series(compile, useref(isProd)), image, font, extra)
  )(done);
};

/**
 * build --production
 * Production mode flag, Default: `false`
 * to the `dist` folder
 * minify source in production mode for the best performance
 * `prod`: Alias to `production`
 * */
task("build", build);

const start = () => {
  const args = process.argv.slice(3);
  const portIdx = args.indexOf("--port");
  let port = +args[portIdx + 1];
  port = checkPort(port) ? port : 5210;
  const open = args.includes("--open");
  return series(compile, serve(port, open))();
};

/**
 * start
 * Running projects in production mode.
 * `open`: Open browser on start, Default: `false`
 *  `port`: Specify server port, Default: `2080`
 */
task("start", start);

// lint styles
plugins.sass.compiler = require("node-sass");
const lintStyles = () => {
  return src(styleSrc).pipe(
    plugins.stylelint({
      reporters: [{ formatter: "string", console: true }],
    })
  );
};

// lint js
const lintScripts = () => {
  const eslint = plugins.eslint;
  return src(jsSrc).pipe(eslint()).pipe(eslint.format());
  // .pipe(eslint.failAfterError());
};

/**
 * Compile the styles & scripts & pages file.
 */
task("compile", compile);

/**
 * Lint the styles & scripts files.
 */
task("lint", parallel(lintStyles, lintScripts));

const deploy = () => {
  return src(path.join(distDir, "**")).pipe(
    plugins.ghPages({
      branch: "gh-pages",
    })
  );
};

/**
 * deploy
 * Deploy the `dist` folder to [GitHub Pages](https://pages.github.com).
 * `branch`: The name of the branch you'll be pushing to, Default: `'gh-pages'`
 */
task("deploy", series(build, deploy));
