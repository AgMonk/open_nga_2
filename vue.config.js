const proxy = 'https://images.weserv.nl/?url='
// const proxy = 'https://'


module.exports = {
    devServer: {
        port: 11451,
        proxy: {
            //api接口
            '/nga-api': {
                // 接口的域名
                // target: "https://bbs.nga.cn/",
                target: "http://localhost:11452/",
                // target: 'http://119.23.252.72:8900',
                // 如果是https接口，需要配置这个参数
                // secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    // '^/nga-api': ''
                },
            },
            //上传接口
            '/upload': {
                // 接口的域名
                // target: "https://img8.nga.cn/attach.php", // 接口的域名
                target: "http://localhost:11452/upload",
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/upload': ''
                },
            },
            //官方表情
            '/emote': {
                // 接口的域名
                // target: `${proxy}img4.nga.178.com/ngabbs/post/smile/`,
                target: "http://localhost:11452/emote/",
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/emote': ''
                },
            },
            '/items': {
                // 接口的域名
                // target: `${proxy}img4.nga.178.com/ngabbs/post/smile/`,
                target: "http://localhost:11452/items/",
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/items': ''
                },
            },
            //附件
            '/attachments': {
                // 接口的域名
                // target: `${proxy}img.nga.178.com/attachments/`,
                target: "http://localhost:11452/attachments/",
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/attachments': ''
                },
            },
            //版面图标
            '/icon/f': {
                // 接口的域名
                // target: `${proxy}img4.nga.178.com/proxy/cache_attach/ficon/`,
                target: "http://localhost:11452/icon/f/",
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/icon/f': ''
                },
            },
            //头像
            '/178/avatars': {
                // 接口的域名
                // target: `${proxy}pic1.178.com/avatars/`,
                target: "http://localhost:11452/178/avatars/",
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/178/avatars': ''
                },
            },
            '/avatars': {
                // 接口的域名
                // target: `${proxy}img.nga.178.com/avatars/`,
                target: "http://localhost:11452/avatars/",
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/avatars': ''
                },
            },
            //代理
            '/proxy': {
                // 接口的域名
                target: proxy,
                // 接口的域名
                // 如果是https接口，需要配置这个参数
                secure: false,
                // 如果接口跨域，需要进行这个参数配置，为true的话，请求的header将会设置为匹配目标服务器的规则（Access-Control-Allow-Origin）
                changeOrigin: true,
                pathRewrite: {
                    //本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
                    '^/proxy': ''
                },
            },

        }
    },
    configureWebpack: config => {
        // 为生产环境修改配置...
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production';
            // 打包文件大小配置
            config.performance = {
                maxEntrypointSize: 10000000,
                maxAssetSize: 30000000
            }
        }
    },
}