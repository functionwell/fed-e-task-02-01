## FIS

特点：高度集成

```javascript
npm i -d fis3
```

默认任务：release

release 默认只转换资源路径，可配置

编译和压缩

fis-conf.js

```javascript
fis.match("**/*.js", {
  parser: fis.plugin("babel-6.x"),
  optimizer: fis.plugin("uglify-js"),
});
```

```
// 查看所有配置
fis3 inspect

```
