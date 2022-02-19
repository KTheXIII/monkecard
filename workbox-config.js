module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{png,yml,html,json,jpg,js,css}'
  ],
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ],
  swDest: 'build/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /\.(css|woff2|ttf|woff)$/,
      handler: 'CacheFirst',
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|yml|yaml|json)$/,
      handler: 'CacheFirst',
    }
  ]
}
