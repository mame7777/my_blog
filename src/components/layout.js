import * as React from 'react';
import Header from './header';
import Footer from './footer';

import '../templates/gloabal.modules.css'

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <section className="container" style={{ "paddingTop": "6rem" }}>
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;