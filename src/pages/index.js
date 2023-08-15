import * as React from "react"
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <h1>This is blog of mame77.</h1>
      <p>mame77のブログへようこそ!</p>
      <p>旧ブログシステムが故障したため，新規構築中です！</p>

      {data.allMarkdownRemark.edges.map((edge) => (
        <div key={edge.node.id}>
          <h2>
            <Link to={`/posts/${edge.node.frontmatter.slug}`}>
              {edge.node.frontmatter.title}
            </Link>
          </h2>
          <p>{edge.node.frontmatter.date}</p>
          {/* <div dangerouslySetInnerHTML={{ __html: edge.node.html }} /> */}
        </div>
      ))}
    </Layout>
  );
}

export const query = graphql`
query {
  allMarkdownRemark {
    edges {
      node {
        id
        html
        timeToRead
        frontmatter {
          title
          date
          slug
        }
      }
    }
  }
}
`;
export default IndexPage;