/** @type {import('next').NextConfig} */

module.exports = {

  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:8000/api/:path*/`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Host', value: 'localhost:8000' },
        ],
      },
    ];
  },
};