// const withImages = require('next-images')
// module.exports = withImages()
module.exports = {
  // webpack: (config) => {
  //   // config.experiments = { topLevelAwait: true }
  //   return config
  // },
  experimental: {
    largePageDataBytes: 512 * 100000,
  },
  reactStrictMode: true,
  env: {
    // @see https://github.com/facebookexperimental/Recoil/issues/2135#issuecomment-1362197710
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
  },
  // images: {
  //   domains: ['uniplatform.ru, dev.uniplatform.ru, localhost'],
  // },
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
