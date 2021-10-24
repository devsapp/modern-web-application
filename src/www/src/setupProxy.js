const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/~hub',
    createProxyMiddleware({
      target: 'http://serverlesshub.serverlesshub.1740298130743624.cn-hangzhou.fc.devsapp.net',
      changeOrigin: true,
      pathRewrite: {"^/~hub" : ""}, 
    })
  );
};