import * as React from 'react';
import Header from './header';
import Footer from './footer';

import '../templates/global.modules.css'

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <section className="container" style={{ "paddingTop": "7rem" }}>
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;