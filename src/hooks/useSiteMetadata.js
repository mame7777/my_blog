import { graphql, useStaticQuery } from 'gatsby';

export const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          ogpImage
          siteUrl
          lang
        }
      }
    }
  `);

  return data.site.siteMetadata;
};