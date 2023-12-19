/** @type {import('next').NextConfig} */

const path = require("path");

module.exports = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:8000/api/:path*/`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Host", value: "localhost:8000" }],
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "app")],
  },
};
