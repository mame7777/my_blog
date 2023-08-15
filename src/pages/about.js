import * as React from 'react';
import Layout from '../components/layout';
import { Seo } from '../components/seo';

const AboutPage = () => {
  return (
    <Layout>
      <h1>About Page</h1>
      <p>comming soon...</p>
    </Layout>
	);
};

export default AboutPage;

export const Head = () => {
  return (
    <Seo
      title="Aboutページ"
      description="このブログについて"
    />
  );
};