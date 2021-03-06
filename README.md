# fed-e-task-02-01

开发脚手架与自动化构建工作流封装

## 简答题

1. 工程化是通过工具和规范来提升前端开发效率的方式，a. 例如代码规范，可以通过统一的代码检查配置来保证提交到仓库中的代码没有低级错误，并且保证团队中的各成员的代码风格一致。b. 构建过程，通常前端项目的构建过程中有很大一部分是重复的，可以将这部分提取出来，独立成库，这样不需要在每个项目中反复的拷贝构建配置。c. 发布，项目发布通常有一定的流程，如代码检查，部署到服务器等，这些工作在不同项目中通常也是重复的，可以提取出来，提高效率。

2. 脚手架提供了项目生命周期的一整套工具体系，包括项目的目录结构、开发服务器配置、编码规范、发布命令等，从项目启动到发布，脚手架都可以提供便捷的指令来支持。所以脚手架是前端项目的效率提升的基本工具。

## 编程题

1. 脚手架实现

   1. 创建一个项目

   2. 创建一个 yeoman-generator 的项目，包含 `index.js` 和 `generators` 文件夹

   3. 将项目可复用的文件拷贝至 `generator-foo\generators\app\templates` 目录下

   4. 将项目中的配置项提取成参数，使用 `<%= bar %>` 语法替换

   5. 在 `index.js` 中使用 `prompt` 方法询问用户得到变量，将变量注入到模板中并拷贝至指定目录下

脚手架例子

`code\02-01脚手架\generator-antd\README.md`

2) Gulp 自动化构建

`code\02-02Gulp构建\pages-boilerplate\gulp构建说明.md`
