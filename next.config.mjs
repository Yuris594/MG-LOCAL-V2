/** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      unoptimized: true,
    },
    
    //output: 'export',
    trailingSlash: true,

    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://172.20.20.3:8001/:path*',
        },
      ]
    },

  }

  export default nextConfig;



   
