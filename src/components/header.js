import * as React from 'react';
// import { Link, useStaticQuery, graphql } from 'gatsby';
import { Link } from 'gatsby';

const Header = () => {
  // const data = useStaticQuery(
  //   graphql`
  //     query {
  //       site {
  //         siteMetadata {
  //           title
  //         }
  //       }
  //     }
  //   `
  // );

  return (
    <header>
      <div>
        <nav className="navbar navbar-expand-lg fixed-top" style={{ backgroundColor: "#F8F7F1", boxShadow: "0px 6px 10px -3px rgba(0,0,0,0.25)" }}>
          {/* <div className="d-flex flex-row"> */}
            <div className="container-fluid">
              <div className='justify-content-center'>
                <a className="navbar-brand" href="/">
                  <img src='/images/mame77-logo.png' height={"70px"} alt="logo of mame77's blog" className="d-inline-block align-text-top" />
                </a>
              </div>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse ms-5" id="navbarSupportedContent">
                <ul className="navbar-nav mb-2 mb-lg-0" >
                  <li className="nav-item fs-6" style={{marginRight: "20px", borderBottom: "2px solid gray"}}>
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                  </li>
                  <li className="nav-item fs-6" style={{marginRight: "20px" , borderBottom: "2px solid gray"}}>
                    <Link className="nav-link active" to="/about">About</Link>
                  </li>
                  <li className="nav-item fs-6" style={{marginRight: "20px" , borderBottom: "2px solid gray"}}>
                    <Link className="nav-link active" to="/all-post">Posts</Link>
                  </li>
                </ul>
              </div>
            </div>
          {/* </div> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;