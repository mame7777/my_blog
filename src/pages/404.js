import * as React from 'react';
import { Link } from 'gatsby';
import Layout from '../components/layout';

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