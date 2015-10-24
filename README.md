# Verver
一个基于[browser-sync](https://github.com/BrowserSync/browser-sync)的简单前端开发服务器，实现了解析Velocity模版，模拟Ajax请求，转发请求，自动刷新页面，编译less以及压缩css/js等功能。

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
│   ├── index.css
│   ├── index.less
│   └── index.min.css
├── js
│   ├── index.js
│   ├── index.min.js
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
### 命令行参数

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
    port: 3000,
    livereload: true,
    watchExtension: [ '.html', '.css', '.js' ],
    rewrite: null,
    jsonp: 'jsoncallback',
    serverOpts: null,
    less: {},
    cleanCSS: {},
    uglifyJS: {}
}
```

### 选项
<table>
	<tr>
		<th>选项</th>
		<th>类型</th>
		<th>默认值</th>
		<th>说明</th>
	</tr>
	<tr>
		<td>port</td>
		<td>number</td>
		<td>3000</td>
		<td>server监听的端口号</td>
	</tr>
	<tr>
		<td>livereload</td>
		<td>boolean</td>
		<td>true</td>
		<td>是否监听文件改动自动刷新页面</td>
	</tr>
	<tr>
		<td>watchExtension</td>
		<td>array</td>
		<td>[ '.html', '.css', '.js' ]</td>
		<td>监听文件改动自动刷新页面的文件后缀名，该选项只有在livereload设置为true时才会起作用</td>
	</tr>
	<tr>
		<td>rewrite</td>
		<td>object</td>
		<td>null</td>
		<td>转发url的对象，key值为转发的url，value为实际的url</td>
	</tr>
	<tr>
		<td>jsonp</td>
		<td>string</td>
		<td>"jsoncallback"</td>
		<td>模拟跨域访问ajax请求的回调函数名</td>
	</tr>
	<tr>
		<td>serverOpts</td>
		<td>object</td>
		<td>null</td>
		<td>browser-sync server属性的配置</td>
	</tr>
	<tr>
		<td>less</td>
		<td>object/boolean</td>
		<td>{}</td>
		<td>是否编译less，设置为false不编译，设置为对象则编译，会在文件当前目录下生成同名的css文件，参数对应<a href="https://github.com/less/less.js" style="text-decoration:none;">less</a>模块调用render方法传递的option</td>
	</tr>
	<tr>
		<td>cleanCSS</td>
		<td>object/boolean</td>
		<td>{}</td>
		<td>是否压缩css，设置为false不压缩，设置为对象则压缩，会在文件当前目录下生成同名的min.css文件，参数对应<a href="https://github.com/jakubpawlowicz/clean-css" style="text-decoration:none;">clean-css</a>模块创建CleanCSS对象传递的option</td>
	</tr>
	<tr>
		<td>uglifyJS</td>
		<td>object/boolean</td>
		<td>{}</td>
		<td>是否压缩js，设置为false不压缩，设置为对象则压缩，会在文件当前目录下生成同名的min.js文件，参数对应<a href="https://github.com/mishoo/UglifyJS2" style="text-decoration:none;">UglifyJS2</a>模块调用minify方法传递的option</td>
	</tr>
</table>

