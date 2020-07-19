# gulp 构建说明

根据 README.md 的说明，需要 lint, compile, serve, build, start, deploy, clean, 7 个任务，有些任务可以传参

## lint

分为 `lintStyle` 和 `lintScript` 两个子任务，并行运行

## clean

使用 `del` 清除 `build` 和 `temp` 2 个目录下的所有文件

## compile

`compile` 任务分为 `script`, `style`, `html`, `font`, `image`, `extra` 6 个子任务，`script`, `style`, `html` 需要二次处理，先编译至 `temp` 目录，然后通过 `useref` 子任务编译至 `build` 目录

## build

`build` 任务为按顺序执行 clean，compile，useref，以及 font, image, 其他文件的压缩拷贝

`useref` 接受 `isProd` 参数来处理是否是生产环境构建，非生产环境构建时不进行压缩

## serve

`serve` 任务包含启动开发服务器和监听源文件变化后运行对应类型的 compile 任务 2 部分

可以传入 `--open` 和 `--port` 参数

## start

`start` 任务为 compile 任务和 serve 任务的顺序执行

## deploy

deploy 任务执行生产环境的 build 任务，再将 build 结果上传至 GitHub Pages
