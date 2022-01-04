module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["prismjs", {
      "languages": ["javascript", "css", "markup", 'lua', 'php', 'c', 'xml', 'python', 'java'], // 这是语言类型
      "plugins": ["line-numbers", 'copy-to-clipboard'], // 使用了行号还可以添加其他插件，具体看官网
      "theme": "okaidia", // 主题
      "css": true
    }]
  ]
}
