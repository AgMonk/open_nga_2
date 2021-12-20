# open_nga_2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 功能列表

### todo 
 - 导航栏：
   - 社区
     - 收藏版面列表(版面图标?)
     - 版面搜索
   - 我的
     - 用户中心
     - 收藏主题
     - 配置
       - 导入cookie
       - 选择界面色调
     - 使用提示
 
 - 路由：
   - 主题列表
     - 需要适配的情况：
       - 是否按发布时间排序（开关）
       - 版面主题
       - 合集主题
       - 搜索（标题和标题正文）
       - 搜索精华区
       - 子版面列表：版面、合集
       - 指定用户的主题、回复
       - 收藏主题
   - 回复列表
     - 需要适配的情况
       - 贴条
       - 热评
     - 显示审核情况
     - 检查缺少楼层增加提示
 - 面包屑导航
   1. 版面：下拉选择最近浏览过的版面和收藏版面
   2. 合集：下拉选择最近浏览过的合集
   3. 主题：下拉选择最近浏览过的当前版面主题
   