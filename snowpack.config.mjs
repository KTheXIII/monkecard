/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/static' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    ['@snowpack/plugin-sass', { compilerOptions: { style: 'compressed' } }],
    ['@snowpack/plugin-typescript'],
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'eslint src --ext .js,.jsx,.ts,.tsx',
        watch: 'esw -w --clear src --ext .js,.jsx,.ts,.tsx'
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    minify: true,
    splitting: true,
    treeshake: true
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    open: 'none'
  },
  buildOptions: {
    cacheDirPath: './.cache/snowpack',
    metaUrlPath: 'snowpack', // Fix for github pages
    baseUrl: process.env.PUBLIC_URL || '/'
  },
}
