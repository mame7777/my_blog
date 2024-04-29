import * as React from 'react';
import { Link } from 'gatsby';
import { getImage, GatsbyImage } from 'gatsby-plugin-image';

const PostCard = ({ post }) => (
  <div className="card mb-3 mt-3">
    <div class="row g-0">
      <div class="col-md-4 align-self-center">
        <GatsbyImage image={getImage(post.frontmatter.hero_image)} style={{ maxHeight: "200px" }} class="img-fluid rounded-start" />
      </div>
      <div class="col-md-8 d-flex flex-column">
        <div className="card-body">
          <div key={post.id}>
            <h2 className="card-title" style={{ paddingLeft: "0.3em" }}>
              <Link to={`/posts/${post.frontmatter.slug}`} class="stretched-link">
                {post.frontmatter.title}
              </Link>
            </h2>
            <p className="card-text">{post.frontmatter.summary}</p>
          </div>
        </div>
        <div class="card-footer">
          更新日：{post.frontmatter.date}
        </div>
      </div>
    </div>
  </div>
);

export default PostCard;