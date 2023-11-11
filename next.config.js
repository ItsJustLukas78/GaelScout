/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.html$/,
      loader: 'html-loader',
    });

    config.externals = {
      "@tensorflow/tfjs-node": "@tensorflow/tfjs-node",
    }

    return config;
  }
}

module.exports = nextConfig;
