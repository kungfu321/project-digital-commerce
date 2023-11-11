/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*.cloudinary.com',
      },
    ],
  }
}

module.exports = nextConfig
