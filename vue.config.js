module.exports = {
    devServer: {
        port: 11451,
        proxy: {
            //api接口
            '/nga-api': {
                // 接口的域名
                target: "https://bbs.nga.cn/",
                // target: 'http://119.23.252.72:8900',
                // 如果是https接口，需要配置这个参数
                // secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/nga-api': ''
                },
            },
            //上传接口
            '/upload': {
                // 接口的域名
                target: "https://img8.nga.cn/attach.php", // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/upload': ''
                },
            },

        }
    },

}