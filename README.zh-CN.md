<!-- <p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
	<a href="https://github.com/vuejs/vue">
		<img src="https://img.shields.io/badge/vue-2.5.10-brightgreen.svg" alt="vue">
	</a>
	<a href="https://github.com/ElemeFE/element">
		<img src="https://img.shields.io/badge/element--ui-2.0.8-brightgreen.svg" alt="element-ui">
	</a>
	<a href="https://travis-ci.org/PanJiaChen/vue-element-admin" rel="nofollow">
		<img src="https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master" alt="Build Status">
	</a>
	<a href="https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE">
		<img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
	</a>
	<a href="https://github.com/PanJiaChen/vue-element-admin/releases">
		<img src="https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg" alt="GitHub release">
	</a>
</p> -->

## 简介

- [测试地址](http://admin.sqydt.easysq.cn)
- [正式环境地址](http://admin.darongshutech.com)
- [接口文档](http://doc.darongshutech.com/index.php?s=/3&page_id=771)
- [禅道地址](http://log.darongshutech.com/zentao/user-login-L3plbnRhby9teS5odG1s.html)

**注意：该项目使用 element-ui@2.0.0+ 版本，所以最低兼容 vue@2.5.0+，基于 PanJiaChen 的 vue-element-admin 为模板**

## 前序准备

你的本地环境需要安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。我们的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) and [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都使用[Mock.js](https://github.com/nuysoft/Mock)模拟,接口测试数据[data](http://api.sqydt.easysq.cn)，提前了解和学习这些知识会对使用本项目有很大的帮助。 **该项目不支持低版本浏览器(如 ie8 一下)，有需求请自行添加 babel-polyfill [详情](https://github.com/PanJiaChen/vue-element-admin/wiki#babel-polyfill)**

 <p align="center">
  <img width="900" src="https://img.sqydt.darongshutech.com/FrS0SjmBUn2k2b4Dmo2g9UipEvfC">
</p>

## 功能

```
- 登录/注销
- 首页
- 资讯
- 资讯素材库
- 账号管理
- 服务设置
- 问题与反馈
- 服务
- 关联公众号
- 单位信息
- 个人中心
- 地理位置
- 活动报名
- 投票评选
- 随手拍
- 问卷调查
- 401/404错误页面
- 多环境发布
- 动态侧边栏（支持多级路由，支持动态路由添加与本地存储路由添加）
- 支持微信公众号发布资讯与本地资讯发布
- 图片/视频 上传组件
- 动态面包屑
- 集成百度地图与国标地图转换
- 富文本编辑器（ueditor/tinymce4.7）
- Screenfull全屏
- 列表拖拽
- Svg Sprite 图标
- 本地mock数据
- Echarts 图表(包含折线图/地图/扇形图)
- 复制功能
- 动态table example
- 拖拽table example
- 内联编辑table （地理位置）
- SplitPane
- Dropzone
- Sticky
- Markdown2html
```

# 项目结构

```
本项目基于 vue-cli2.0 进行项目架构
## 项目目录结构：
- build
- config
- node_modules
- dist
- src
- static
## build
-- webpack 相关配置，支持sass/less.
## config
-- index 中设置有跨域代理
-- 其余是生产环境与正式环境
## dist
-- 打包生成文件
## node_modules
-- 安装依赖包
## src
-- 主体文件
assets 存放 icon/图片
components 存放公共组件
fetch  请求封装、公共验证、以及公共的方法
icons 存放svg
mock  mock数据
utils 公共工具
router 路由
styles  公共样式
views  视图部分
```

# 安装依赖

npm install (yarn install)

# 建议不要用 cnpm 安装 会有各种诡异的 bug 可以通过如下操作解决 npm 下载速度慢的问题

npm install --registry=https://registry.npm.taobao.org

# 启动服务

npm run dev (yarn run dev)

````
浏览器访问 http://localhost:8080

## 发布

```bash
# 构建测试环境
npm run build:sit

# 构建生成环境
npm run build:prod
````

## 其它

```bash
# --report to build with bundle size analytics
npm run build:prod --report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```

- [使用文档](https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/deploy)

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2018-present Roy_zhang
