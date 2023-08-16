import * as React from 'react';
import Header from './header';
import Footer from './footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../templates/gloabal.modules.css'

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <section className="container">
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;