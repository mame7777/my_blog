import * as React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';
import { Seo } from '../components/seo';

const NotFound = () => {
  return (
    <Layout>
      <h1>404 Not Found</h1>
      <div>
        <p>アクセスしたページは存在しません。</p>
        <Link to="/">ホームに戻る</Link>
      </div>
    </Layout>
  );
};

export default NotFound;

export const Head = () => {
  return (
    <Seo
      title="404 Not Found"
      description="ページが見つかりませんでした。"
    />
  );
};