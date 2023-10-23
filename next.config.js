/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
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
    domains: ['img.youtube.com', 'res.cloudinary.com','assets.vercel.com',],
  },
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
