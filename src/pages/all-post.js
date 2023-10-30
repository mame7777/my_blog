import * as React from "react"
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <h1>投稿一覧</h1>
      <p>今までの投稿一覧（日付順）</p>
      {data.allMarkdownRemark.edges.map((edge) => (
        <div className="card mb-1">
          <div className="card-body">
            <div key={edge.node.id}>
              <h2 className="card-title">
                <Link to={`/posts/${edge.node.frontmatter.slug}`} class="stretched-link">
                  {edge.node.frontmatter.title}
                </Link>
              </h2>
              <p className="card-text">{edge.node.frontmatter.description}</p>
              {/* <div dangerouslySetInnerHTML={{ __html: edge.node.html }} /> */}
            </div>
          </div>
          <div class="card-footer">
            更新日：{edge.node.frontmatter.date}
          </div>
        </div>
      ))}
    </Layout>
  );
}

export const query = graphql`
query {
  allMarkdownRemark (
    sort: {frontmatter: {date: DESC}}
  )
  {
    edges {
      node {
        id
        html
        timeToRead
        frontmatter {
          title
          date
          slug
          description
        }
      }
    }
  }
}
`;
export default IndexPage;