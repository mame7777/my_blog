import * as React from "react"
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <h1>mame77のブログへようこそ!</h1>
      <p>旧ブログシステムが故障したため，新規構築中です！</p>

      <h2 className="mt-5">新規投稿</h2>
      {data.allMarkdownRemark.edges.map((edge) => (
        <div className="card mb-1">
          <div className="card-body">
            <div key={edge.node.id}>
              <h2 className="card-title">
                <Link to={`/posts/${edge.node.frontmatter.slug}`} class="stretched-link">
                  {edge.node.frontmatter.title}
                </Link>
              </h2>
              <p className="card-text">{edge.node.frontmatter.summary}</p>
              {/* <div dangerouslySetInnerHTML={{ __html: edge.node.html }} /> */}
            </div>
          </div>
          <div class="card-footer">
            更新日：{edge.node.frontmatter.date}
          </div>
        </div>
      ))}
      <div className="text-center">
        <Link to="/all-post" className="btn btn-primary">もっと見る</Link>
      </div>
    </Layout>
  );
}

export const query = graphql`
query {
  allMarkdownRemark (
    sort: {frontmatter: {date: DESC}}
    limit: 3
  )
  {
    edges {
      node {
        id
        html
        timeToRead
        frontmatter {
          title
          summary
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