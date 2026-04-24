/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://saleh-cnc-vp15.vercel.app',
  generateRobotsTxt: true,
  exclude: [
    '/admin', 
    '/admin/*', 
    '/cart', 
    '/checkout', 
    '/wishlist', 
    '/login',
    '/icon.svg',
    '/apple-icon.png'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin', '/cart', '/checkout', '/wishlist', '/login'],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom logic to set priorities
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (['/products', '/laser-wood-products', '/wood-cnc-designs'].includes(path)) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path === '/cnc-files-download') {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
};
