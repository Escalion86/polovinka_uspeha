const path = require('path')

// const __dirname = new URL('.', import.meta.url).pathname

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = //withBundleAnalyzer(
  withPWA({
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './'),
      }
      return config
    },
    // swcMinify: false,
    experimental: {
      largePageDataBytes: 512 * 100000,
    },
    reactStrictMode: true,
    env: {
      // @see https://github.com/facebookexperimental/Recoil/issues/2135#issuecomment-1362197710
      RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
    },
    images: {
      // domains: ['localhost', 'escalioncloud.ru', 't.me'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3000',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
        },
        {
          protocol: 'https',
          hostname: 'escalioncloud.ru',
          port: '',
        },
        {
          protocol: 'https',
          hostname: 't.me',
          port: '',
        },
      ],
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
  })
//)
