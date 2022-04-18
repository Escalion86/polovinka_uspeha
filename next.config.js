// const withImages = require('next-images')
// module.exports = withImages()
module.exports = {
  // webpack: (config) => {
  //   // config.experiments = { topLevelAwait: true }
  //   return config
  // },
  reactStrictMode: true,
  images: {
    domains: ['uniplatform.ru, dev.uniplatform.ru, localhost'],
  },
  // webpack(config, options) {
  //   config.module.rules.push({
  //     loader: '@svgr/webpack',
  //     issuer: /\.[jt]sx?$/,
  //     options: {
  //       prettier: false,
  //       svgo: true,
  //       svgoConfig: {
  //         plugins: [
  //           {
  //             name: 'preset-default',
  //             params: {
  //               override: {
  //                 removeViewBox: false,
  //               },
  //             },
  //           },
  //         ],
  //       },
  //       titleProp: true,
  //     },
  //     test: /\.svg$/,
  //   })

  //   return config
  // },
}
