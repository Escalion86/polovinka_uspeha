const path = require('path')

// const __dirname = new URL('.', import.meta.url).pathname

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
const withFlowbiteReact = require('flowbite-react/plugin/nextjs')

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disableDevLogs: true,
  disable: process.env.MODE === 'dev',
})

module.exports = withFlowbiteReact(
  //withBundleAnalyzer()
  withPWA({
    // webpack: (config) => {
    //   config.resolve.alias = {
    //     ...config.resolve.alias,
    //     '@components': path.join(__dirname, 'components'),
    //     '@helpers': path.join(__dirname, 'helpers'),
    //     '@pages': path.join(__dirname, 'pages'),
    //     '@models': path.join(__dirname, 'models'),
    //     '@utils': path.join(__dirname, 'utils'),
    //     '@server': path.join(__dirname, 'server'),
    //     '@state': path.join(__dirname, 'state'),
    //     '@schemas': path.join(__dirname, 'schemas'),
    //     '@layouts': path.join(__dirname, 'layouts'),
    //     '@blocks': path.join(__dirname, 'blocks'),
    //     '@svg': path.join(__dirname, 'svg'),
    //   }
    //   return config
    // },
    // swcMinify: false,
    transpilePackages: ['jotai-devtools'],
    experimental: {
      largePageDataBytes: 512 * 100000,
    },
    reactStrictMode: true,
    // env: {
    //   // @see https://github.com/facebookexperimental/Recoil/issues/2135#issuecomment-1362197710
    //   RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
    // },
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
)
