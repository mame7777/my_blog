import * as React from 'react';
import { Link } from 'gatsby';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';

const PostCard = ({ post }) => (
  <div className="card mb-3 mt-3">
    <div className="row g-0">
      <div className="col-md-4 align-self-center">
        <GatsbyImage image={getImage(post.frontmatter.hero_image)} style={{ maxHeight: "200px" }} className="img-fluid rounded-start" alt="Post card image"/>
      </div>
      <div className="col-md-8 d-flex flex-column">
        <div className="card-body">
          <div key={post.id}>
            <h2 className="card-title" style={{ paddingLeft: "0.3em" }}>
              <Link to={`/posts/${post.frontmatter.slug}`} className="stretched-link">
                {post.frontmatter.title}
              </Link>
            </h2>
            <p className="card-text">{post.frontmatter.summary}</p>
          </div>
        </div>
        <div className="card-footer">
          更新日：{post.frontmatter.date}
        </div>
      </div>
    </div>
  </div>
);

export default PostCard;