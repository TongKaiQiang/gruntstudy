module.exports = function(grunt){
    //显示构建的时间
    require('time-grunt')(grunt);

    //自动加载所有的grunt任务
    require('load-grunt-tasks')(grunt);
    var config = {
        app:'app',
        dist:'build'
    }
    grunt.initConfig({
        config:config,
        //监听文件变化，当文件变化后运行指定的任务
        watch: {
            livereload: {
                options: {
                    livereload: 35729//引入端口号
                },
                files: [
                    '<%= config.app %>/index.html',
                    '<%= config.dist %>/index.html'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,//在本地开一个9000端口
                open: true,//是否自动打开浏览器
                livereload: 35729,//监控文件变化端口 即时刷新
                keepalive: true,//是否挂起浏览器
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'//要想外部访问可以改为0.0.0.0
            },
            livereload: {
                options: {
                    //可以是数组和函数 connect作为形参
                    middleware: function (connect) {
                        return [
                            connect.static(config.dist)//根路径下的路径匹配
                        ];
                    }
                }
            }
        },
        copy:{
            //把不需要压缩的内容复制到build目录中
            main:{
                files:[{
                    expand:true,
                    cwd:'bower_components/',
                    src:"**/*",
                    dest:"build/"
                },{'<%=config.dist%>/index.html':'<%=config.app%>/index.html'},{//把index拷贝到build下面
                    '<%=config.dist%>/favicon.ico':'<%=config.app%>/favicon.ico'//图标
                },{'<%=config.dist%>/images/grunt.png':'<%=config.app%>/images/grunt.png'}]//图片
            }
        },
        clean:{
            main:['build'],//清除build目录，
            tmp:['.tmp']
        },
        useminPrepare:{// 自动生成合并和压缩代码的配置
            html:'<%=config.app%>/index.html',//生成合并文件的配置并保存到目标路径下
            options:{
                dest:'build'
                // concat 合并到的JS和CSS临时文件生成到了.tmp下面 然后走uglify cssmin
                //从临时文件里压缩到了build下面,JS和css就合并压缩好了
            }
        },
        /**
         * md5 作用是让大容量信息在数字签名软件签署私人密钥前被压缩成一种保密的格式（就是把一个任意长度的字节串变换成一定长的16进制数字串）
         * cdn 尽可能避开互联网上有可能影响数据传输速度和稳定性的瓶颈和环节，传输更快，更稳定 ，长缓存 cache-control
         * 入口文件不做缓存 index.html cache-control:no-cache
         * a.js?ts=时间戳/版本号
         * 1. 文件没有变更就不应该变化，会浪费更新。
         * 2. 覆盖同名文件，会出现时间差，出错
         * 3. CDN服务商会忽略查询字符串
         */
        rev:{//进行md5编码
            options:{
                encoding:'utf8',
                algorithm:'md5',
                length:8 // 保留8位
            },
            assets:{
                files:[{
                    src:['build/**/*.{js,css,png}']
                }]
            }
        },
        usemin:{//将index.html中标记合并区块替换掉 这些文件已经已经压缩过并且加上一唯一标识
            html:'build/index.html'
        }
    });

    grunt.registerTask('default',
        ['clean',//发布目录清除 dist
            'copy',//源代码文件拷贝过去
            'useminPrepare',//生成一些配置
            "concat",//对JS文件进行合并 默认生成的generated
            "uglify", //对JS再进行压缩 默认生成的generated
            "cssmin",//对CSS文件进行合并 默认生成的generated
            "rev",//更新版本号版本号，内容不修改则不更新
            "usemin",//修改引用
            'connect:livereload',//在connect上做的二次封装，就是在本地启一个webserver
            'watch'
        ]);
}