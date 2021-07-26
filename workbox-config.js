module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{png,yml,html,json,jpg,js,css}'
  ],
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ],
  swDest: 'build/service-worker.js'
}
