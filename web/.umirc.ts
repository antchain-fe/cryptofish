import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  // publicPath for gh-pages
  antd: {
    dark: true,
  },
  history: {
    type: 'hash',
  },
});
