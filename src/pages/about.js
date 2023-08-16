import * as React from 'react';
import Layout from '../components/layout';
import { Seo } from '../components/seo';

import "../templates/about-page.modules.css";

const AboutPage = () => {
  return (
    <Layout>
      <h1 className='h1 mb-3'>About</h1>
      <div className="container">
        <h2 className='h2 mt-2'>about blog</h2>
        <p>
          そこらへんの学生がのんびり書いていくブログです．<br />
          内容の正確性には十分配慮していますが，なにか間違い等あれば，Twitter(X)のDMまでご連絡ください．
        </p>
        <a className='btn btn-primary mb-4' href="https://twitter.com/messages/compose?recipient_id=1617776838893502464">DMの送信はこちら</a>
        <h2 className='h2 mt-2'>about me</h2>
        <h3>所属</h3>
        <div className='under-h3'>
        <ul>
          <li>名古屋大学 工学部</li>
          <li><a href="https://naft.space">名古屋大学宇宙開発チームNAFT</a>　ロケット班</li>
        </ul>
        </div>
        <h3>趣味</h3>
        <div className='under-h3'>
        <ul>
          <li>睡眠（たいせつ）</li>
          <li>PC使って遊ぶ（プログラミング・ゲーム）</li>
          <li>一眼で写真を撮る</li>
        </ul>
        </div>
        <h3>スキル</h3>
        <div className='under-h3'>
          <h4>フロントエンド</h4>
          
        </div>
      </div>
    
 
    </Layout >
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