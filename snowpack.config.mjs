/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  env: {
    APP_NAME: process.env.npm_package_name,
    VERSION: process.env.npm_package_version,
    AUTHOR: process.env.npm_config_init_author_name,
    DESCRIPTION: process.env.npm_package_description,
    HOMEPAGE: process.env.npm_package_homepage,
    REPOSITORY_URL: process.env.npm_package_repository,
    COMMIT_HASH: process.env.GITHUB_SHA || 'development',
    PUBLIC_URL: process.env.PUBLIC_URL || '/'
  },
  alias: {
    '@assets': './src/assets',
    '@components': './src/components',
    '@pages': './src/pages',
    '@models': './src/models',
    '@scripts': './src/scripts',
  },
  mount: {
    public: { url: '/', static: true, resolve: true },
    src: { url: '/static' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    ['@snowpack/plugin-typescript'],
    ['@snowpack/plugin-run-script',
      {
        cmd: 'eslint src --ext .js,.jsx,.ts,.tsx',
        watch: 'esw -w --clear src --ext .js,.jsx,.ts,.tsx'
      },
    ],
    '@snowpack/plugin-postcss',
    ['@snowpack/plugin-optimize',
      {
        preloadCSS: true,
        preloadCSSFileName: (process.env.PUBLIC_URL || '/') + 'style.css'
      }
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    splitting: true,
    treeshake: true,
  },
  packageOptions: {
  },
  devOptions: {
    open: 'none',
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    cacheDirPath: './.cache/snowpack',
    metaUrlPath: 'snowpack', // Fix for github pages
    baseUrl: process.env.PUBLIC_URL || '/'
  },
}
