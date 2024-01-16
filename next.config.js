/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  i18n: {
    locales: ['ko-KR'],
    defaultLocale: 'ko-KR',
  },
  // experimental: {
  //   serverActions: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  // images: { domains: ['img.youtube.com'], },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
    domains: ['img.youtube.com', 'res.cloudinary.com', 'assets.vercel.com',],
  },

  //to fs resolve
  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },

  // for webpack4
  // webpack: (config, { isServer }) => {
  //   // Fixes npm packages that depend on `fs` module
  //   if (!isServer) {
  //     config.node = {
  //       fs: 'empty'
  //     }
  //   }

  //   return config
  // },
  // images: {
  //       formats: ['image/avif', 'image/webp'],
  //       remotePatterns: [
  //           {
  //               protocol: 'https',
  //               hostname: 'assets.vercel.com',
  //               port: '',
  //               pathname: '/image/upload/**',
  //           },
  //       ],
  //   },

};

module.exports = nextConfig;
