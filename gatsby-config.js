/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteUrl: 'https://mame77.com',
    title: '気ままな備忘録',
    description:'のんびり気ままに書いていく備忘録です．',
    author: 'mame77',
    category: ['blog', 'server', 'network', 'photo'],
    user: { name: 'mame77' },
    lang: 'ja',
    logoImage: 'https://mame77.com/images/mame77-logo.png',
    ogpImage: 'https://mame77.com/images/mame77-logo-ogp.png',
  },
  /* Your site config here */
  plugins: [
    {
      // Google Tag Manager
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-T9N3N8S",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700, 
              /* showCaptions: true, */
            },
          },
          `gatsby-plugin-catch-links`,
          `gatsby-remark-prismjs-title`,
          `gatsby-remark-prismjs`,          
        ],
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
            }
          }
        }`
        ,
        resolvePages: ({
          allSitePage: { nodes: allPages },
        }) => {
          return allPages.map(page => {
            return { ...page }
          })
        }
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: 'https://mame77.com',
        sitemap: 'https://mame77.com/sitemap-index.xml',
        policy: [{ userAgent: '*', disallow: ['/*?'] }]
      }
    },
  ],
};