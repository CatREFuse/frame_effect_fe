module.exports = {
    devServer: {
        // 自动打开浏览器
        open: true,
        // 修改端口号
        port: 8878
    },
    publicPath: './'  // 打包时是用相对路径，防止打包后主页为空白
}