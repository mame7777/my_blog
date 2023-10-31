import { graphql } from 'gatsby';
import * as React from 'react';
import Layout from '../../components/layout';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';
import { Seo } from '../../components/seo';

import "../../templates/blog-post.modules.css";

export default function BlogPostTemplate({ data: { markdownRemark } }) {
  const { frontmatter, html } = markdownRemark;
  const image = getImage(frontmatter.hero_image);
  return (
    <Layout>
      <h1 className='h1'>{frontmatter.title}</h1>
      <div>投稿日：{frontmatter.date}</div>
      <div class="text-center">
        <GatsbyImage image={image} alt="Hero Image" style={{"max-width": "500px"}}/>
      </div>
      <div className="post-body blog-post" dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
}

export const query = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;

export const Head = ({ data: { markdownRemark } }) => {
  const { frontmatter } = markdownRemark;
  return <Seo title={frontmatter.title} description={frontmatter.description}/>;
};