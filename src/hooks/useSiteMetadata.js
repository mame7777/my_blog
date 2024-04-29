import { graphql, useStaticQuery } from 'gatsby';

export const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          logoImage
          lang
        }
      }
    }
  `);

  return data.site.siteMetadata;
};