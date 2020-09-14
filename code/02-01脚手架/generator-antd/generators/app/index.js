const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ])
    .then(answers => {
      this.answers = answers
    })
  }

  writing () {
    // 把每一个文件都通过模板转换到目标路径

    const templates = [
      '.gitignore',
      'package.json',
      'README.md',
      'craco.config.js',
      'public/favicon.ico',
      'public/index.html',
      'src/App.js',
      'src/App.less',
      'src/App.test.js',
      'src/index.css',
      'src/index.js',
      'src/logo.svg',
      'src/serviceWorker.js',
      'src/setupTests.js',
      'public/favicon.ico',
      'public/index.html',
      'public/logo192.png',
      'public/logo512.png',
      'public/manifest.json',
      'public/robots.txt'
    ]

    templates.forEach(item => {
      // item => 每个文件路径
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}