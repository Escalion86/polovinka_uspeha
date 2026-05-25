const packageJson = require('./package.json')

const buildId =
  process.env.NEXT_PUBLIC_BUILD_ID ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GIT_COMMIT_SHA ||
  `${packageJson.version}-${Date.now()}`

// const __dirname = new URL('.', import.meta.url).pathname

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

module.exports =
  //withBundleAnalyzer()
  {
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
    env: {
      NEXT_PUBLIC_APP_VERSION: packageJson.version,
      NEXT_PUBLIC_BUILD_ID: buildId,
    },
    generateBuildId: async () => buildId,
    experimental: {
      largePageDataBytes: 512 * 100000,
      optimizePackageImports: ['flowbite-react'],
    },
    reactStrictMode: true,
    async redirects() {
      return [
        {
          source: '/event/:id',
          destination: '/krsk/event/:id',
          permanent: false,
        },
      ]
    },
    images: {
      // domains: ['localhost', 'cloud.escalion.ru', 't.me'],
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
          hostname: 'cloud.escalion.ru',
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
  }
