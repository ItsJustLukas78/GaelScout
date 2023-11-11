/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: false,
  experimental: {
    webpackBuildWorker: true,
  },
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

    config.externals.push({
      "@tensorflow/tfjs-node": "@tensorflow/tfjs-node",
    });

    return config;
  },
}

module.exports = nextConfig;
