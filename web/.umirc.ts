import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  // publicPath for gh-pages
  publicPath: process.env.NODE_ENV === 'production' ? '/cryptofish/' : '/',
});
