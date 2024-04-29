import * as React from "react"
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby';
import { Seo } from '../components/seo';

import PostCard from '../components/postCard'

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <h1>mame77のブログへようこそ!</h1>

      <h2 className="mt-5">新規投稿</h2>
      {data.allMarkdownRemark.edges.map((edge) => (
        <PostCard post={edge.node}/>
      ))}
      <div className="text-center">
        <Link to="/all-post" className="btn btn-primary">もっと見る</Link>
      </div>
      <h2>お知らせ</h2>
      <p>旧ブログシステムが故障したため，新規構築中です！</p>
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
          hero_image {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  }
}
`;
export default IndexPage;

export const Head = () => {
  return (
    <Seo
      title="mame77のブログへようこそ!"
      description="mame77のブログ「きままな備忘録」のトップページです．のんび～り書き足していってます．"
    />
  );
};