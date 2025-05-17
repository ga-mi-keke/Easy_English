/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    // ビルド時の型チェックエラーを無視して起動します
    ignoreBuildErrors: true,
  },
   async rewrites() {
    return [
      {
        source: '/session/:path*',
        destination: 'http://localhost:3001/session/:path*',
      },
      {
        source: '/answer',
        destination: 'http://localhost:3001/answer',
      },
    ]
  },
};
