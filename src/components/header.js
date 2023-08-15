import * as React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

const Header = () => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );
  return (
    <header>
      <p>{ data.site.siteMetadata.title }</p>
      <nav>
        <ul>
          <li>
            <Link to="/">top</Link>
          </li>
          <li>
            <Link to="/about">about</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;