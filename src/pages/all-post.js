import * as React from "react"
import Layout from '../components/layout';
import { graphql } from 'gatsby';
import { Seo } from '../components/seo';

import PostCard from '../components/postCard'

const AllPostPage = ({ data }) => {
  return (
    <Layout>
      <h1>投稿一覧</h1>
      <p>今までの投稿一覧（日付順）</p>
      {data.allMarkdownRemark.edges.map((edge) => (
        <PostCard post={edge.node} key={edge.node.id}/>
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
          summary
          date
          slug
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
export default AllPostPage;

export const Head = () => {
  return (
    <Seo
      title="投稿一覧ページ"
      description="このブログに投稿された記事一覧です．"
    />
  );
};