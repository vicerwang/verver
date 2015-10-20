# Verver
一个基于[connect](https://github.com/senchalabs/connect)的简单前端开发服务器，实现了解析Velocity模版，模拟Ajax请求，转发请求以及自动刷新页面等功能。

## 安装
```
npm install verver -g
```

## 目录结构
只能支持以下特定目录结构：

```
root
│
├── css
│   └── index.css
├── js
│   ├── index.js
│   └── lib
│       └── jquery.js
├── mock                       // 放置mock数据
│   ├── ajax                   // 放置ajax请求的mock数据
│   │   └── getFeature.json.js
│   └── velocity
│       ├── commonmock
│       │   └── common.js      // 放置common的mock数据，编译时会被合并到页面对应的mock数据中
│       └── index.html.js      // 放置Velocity模版对应的mock数据
├── template                   // 放置Velocity模版
│   └── index.html
└── verver.js                  // verver配置文件
```

## 查看demo

```
npm install verver
cd verver
npm test
open http://localhost:3001/
```

## 使用
```
verver
```
命令行参数

```
  Usage: verver [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -p, --port <int>   server listen port
    -r, --root <path>  server root directory
```

## 配置文件
以下为内置默认配置，如想自定义配置，请添加verver.js，并放置于server根目录。

```javascript
module.exports = {
    port: 3000,            //server监听端口号
    livereload: true,      //是否监听文件改动，自动刷新页面，依赖chrome livereload插件
    livereloadPort: 35729, //livereload server监听端口号
    rewrite: null,         //转发请求的对象，key为转发后url，value为实际url
    jsonp: 'jsoncallback'  //模拟跨域访问ajax请求的回调函数名
}
```
