/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://saleh-cnc.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/login'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin', '/login'],
      },
    ],
  },
};
