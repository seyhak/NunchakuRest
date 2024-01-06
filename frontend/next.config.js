/** @type {import('next').NextConfig} */
const BACKEND_PATH = "https://stunning-surge-409813.lm.r.appspot.com/api/:path*/"
const LOCAL_BACKEND_PATH = "http://127.0.0.1:8000/api/:path*/"
const HOST = "https://stunning-surge-409813.lm.r.appspot.com"
const LOCAL_HOST = "localhost:8000"
const path = require("path")

// output: "export",
module.exports = {
  reactStrictMode: false,
  // assetPrefix: "/static/",
  // requires nodejs
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_TARGET !== "gcp" ? BACKEND_PATH : LOCAL_BACKEND_PATH
        // destination: BACKEND_PATH
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Host", value: process.env.NEXT_TARGET === "gcp" ? HOST : LOCAL_HOST }],
      },
    ]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "app")],
  },
}
