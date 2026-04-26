/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://www.facebook.com https://www.google-analytics.com https://*.google.com https://*.google-analytics.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://www.facebook.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src https://www.facebook.com; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
