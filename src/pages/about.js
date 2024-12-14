import * as React from 'react';
import Layout from '../components/layout';
import { Seo } from '../components/seo';

import "../templates/about-page.modules.css";

const AboutPage = () => {
  return (
    <Layout>
      <h1 className='mb-3'>About</h1>
      <div className="container">
        <h2 className='mt-2'>about blog</h2>
        <p>
          そこらへんの学生がのんびり書いていくブログです．<br />
          内容の正確性には十分配慮していますが，なにか間違い等あれば，以下のメールアドレスまでご連絡ください．<br />
          また，記事に対するコメントや質問等もお待ちしております．<br />

          メールアドレス：<img src="/images/about/mail.png" height="14px" alt="string" />
        </p>
        {/* <a className='btn btn-primary mb-4' href="https://twitter.com/messages/compose?recipient_id=1617776838893502464">DMの送信はこちら</a> */}
        <h2 className='mt-2'>about me</h2>
        <h3>所属</h3>
        <div className='under-h3'>
          <ul>
            <li>名古屋大学 工学部</li>
            <li><a href="https://naft.space" target="_blank" rel="noopener noreferrer">名古屋大学宇宙開発チームNAFT</a>　ロケット班</li>
            <ul>
              <li>2022年度空力SL</li>
              <li>2023年度PM<br />
                詳しい内容は，実験参加報告ブログをご覧ください！<br />
                ・　<a href="https://naft.space/2023/09/15/nse19th-naft/" target="_blank" rel="noopener noreferrer">「Masterpiece-14 Luminous」の打上げ実験 </a><br />
                ・　<a href="https://naft.space/2024/04/30/ise24th-naft/" target="_blank" rel="noopener noreferrer">「Masterpiece-15 Spinel」の打上げ実験 </a>
              </li>
            </ul>

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
        <div>
          <h4>バックエンド</h4>
          <div className="row justify-content-start mb-2">
            <div className='col-md-auto'>
              <img src="/images/about/logo/python.svg" width="100px" alt="python-logo" />
            </div>
            <div className='col-md'>
              <h5>Python</h5>
              <p className=''>
                ロケットの軌道シュミレータの作成を一部行った経験があります．<br />
                他には，SlackのログをAPIで取ってきてデータベースに保存していくbotを作成したことがあります．<br />
                あとは，多少OpenCV使ったことがあります．
              </p>
            </div>
          </div>
          <div className="row justify-content-start mb-2">
            <div className='col-md-auto'>
              <img src="/images/about/logo/mysql.svg" width="100px" alt="mysql-logo" />
            </div>
            <div className='col-md'>
              <h5>MySQL</h5>
              <p className=''>
                上に書いたSlackのログを保存するbotを作成した際に，データベースとして使用しました．<br />
                基礎的なSQL文は書けます．
              </p>
            </div>
          </div>

          <h4 style={{ "marginTop": "20px" }}>インフラ</h4>
          <div className="row justify-content-start mb-2">
            <div className='col-md-auto'>
              <img src="/images/about/logo/linux.svg" width="100px" alt="linux-logo" />
            </div>
            <div className='col-md'>
              <h5>Linux</h5>
              <p className='mb-0'>
                よく環境構築しています．<br />
                自宅サーバーでは基本的にUbunutu Serverを使用しています．<br />
                家にProxmox VEのクラスタがあります．
              </p>
              <div className="row justify-content-start ms-1" style={{ "float": "left" }}>
                <div className='col-auto p-0'>
                  <img src="/images/about/logo/ubuntu.svg" width="20px" alt="ubuntu-logo" />
                </div>
                <div className='col d-flex align-items-center'>
                  <p>Ubuntu</p>
                </div>
                <div className='col-auto p-0 ms-3'>
                  <img src="/images/about/logo/proxmox.svg" width="20px" alt="proxmox-logo" />
                </div>
                <div className='col d-flex align-items-center'>
                  <p>Proxmox</p>
                </div>
              </div></div>

              <div className="row justify-content-start mb-2">
              <div className='col-md-auto'>
                <img src="/images/about/logo/aws.svg" width="100px" alt="aws-logo" />
              </div>
              <div className='col-md'>
                <h5>Amazon Web Services</h5>
                <p className=''>
                  インターンにおいて，LLMを用いた差―ビアスの検証・構築に使用しています．<br />
                  boto3やpythonのcdkを使用したりしています．
                </p>
              </div>
            </div>

            <div className="row justify-content-start mb-2">
              <div className='col-md-auto'>
                <img src="/images/about/logo/azure.svg" width="100px" alt="azure-logo" />
              </div>
              <div className='col-md'>
                <h5>Microsoft Azure</h5>
                <p className=''>
                  インターンにおいて，RAGの検証に使用しました．<br />
                  Azure AI SearchとAzure OpenAI Serviceを使用しました．
                </p>
              </div>
            </div>

            <div className="row justify-content-start mb-2">
              <div className='col-md-auto'>
                <img src="/images/about/logo/zabbix.svg" width="100px" alt="linux-logo" />
              </div>
              <div className='col-md'>
                <h5>Zabbix</h5>
                <p className=''>
                  自宅サーバーの監視に使用しています．<br />
                  grafanaを使用して，監視結果を可視化しています．
                </p>
              </div>
            </div>

            <div className="row justify-content-start mb-2">
              <div className='col-md-auto'>
                <img src="/images/about/logo/cisco.svg" width="100px" alt="cisco-logo" />
              </div>
              <div className='col-md'>
                <h5>Cisco IOS</h5>
                <p className='mb-0'>
                  家にL3スイッチとAPがあります．<br />
                  基礎的な環境構築とFWアップデート程度ならぎりぎりできます．
                </p>
              </div>
            </div>

            <h4 style={{ "marginTop": "20px" }}>フロントエンド</h4>
            <div className="row justify-content-start mb-2">
              <div className='col-md-auto'>
                <img src="/images/about/logo/react.svg" width="100px" alt="react-logo" />
              </div>
              <div className='col-md'>
                <h5>React</h5>
                <p className='mb-0'>お気持ち程度使えます．本サイトは，フレームワークであるGatsbyを使用して本サイトを作成しています．</p>
                <div className="row justify-content-start ms-1">
                  <div className='col-auto p-0'>
                    <img src="/images/about/logo/gatsby.svg" width="20px" alt="gatsby-logo" />
                  </div>
                  <div className='col d-flex align-items-center'>
                    <p>Gatsby</p>
                  </div>
                </div>
              </div>

              <h4 style={{ "marginTop": "20px" }}>その他</h4>
              <h5>他のプログラミング言語</h5>
              <div>
                <ul>
                  <li>C：講義で扱った程度です．自由課題で，X Window Systemを用いて，疑似的な3Dの描画を行い，お散歩ゲームを作りました．</li>
                  <li>Arduino言語：サークルや趣味で少々触ったぐらいです．4桁7セグメントLEDや温度湿度計で遊びました．他には，環境センサで家の状態を読みzabbixに投げるために触りました．</li>
                  <li>JavaScript：Reactを触ってるときにひぃひぃ言ってます(できない)．他には，Google Apps Scriptを少し触っているぐらいです．</li>
                  <li>PHP：Slackログbotでクライアントがデータを取得する際のAPIを作りました．セキュリティはちんぷんかんぷんです．</li>
                </ul>
              </div>
              <h5>自宅サーバー群</h5>
              <p>
                外部向けにはwebサーバーが立っているぐらいです．<br />
                クラスタを構築したり，LAN内10G環境を整えたり，おうちストレージクラウドを立てたりして遊んでます．<br />
                あとは，上にあるもの以外にも，graylogやnetboxが動いています．
                ルーターやスイッチ，多くのPCが眠っているので，有効活用していきた所存です．<br />
                パソコンオタクを自称しているので，ハードウェアの知識は多少あります．
              </p>
              <h5>電子工作</h5>
              <p>
                基板設計等は出来ませんが，基礎的な配線やICの使用なら出来ます．<br />
                サークルで<s>雑用</s>お手伝いをするので，はんだ付け，リフローは得意です．
              </p>
              <h5>動画編集・写真撮影</h5>
              <p>
                サークルのPV作りました．<br />
                素材・時間が少ない中では頑張ったと自負しています．(素材集め含め実質2,3日で作った．)<br />
                <a href='https://youtu.be/iLtV0igIx6Q?si=YBqp690K1CGPmDpN'>こちら(YouTubeへのリンク)から</a>よかったら見てみてください．<br />
                また，写真を趣味で撮っており，広報やサークルの自団体や他団体のSNSなどに使っていただいたものも多くあります．<br />
                <s style={{ "color": "gray" }}>お金がなく新しい機材が買えません...</s>
              </p>
              <h5>WordPress構築・運用</h5>
              <p>
                かつての自分のブログはWordPressで構築していました．(OS側の不具合かハードウェア障害でお亡くなりになりました．)<br />
                また，サークルのサイトもWordPressで運用しています．<br />
                他に，個人で1件委託を受けてwordpressへの移行を行いました．
              </p>
              <h5>チームマネジメント</h5>
              <p>
                サークルのロケット班の班長をしており，50人程度のプロジェクトのPMをしています．<br />
                PM業としては，進捗管理や指示出し，各所への連絡・調整等を行っています．<br />
                また，PMとは別ですが，企業の方に新たに協賛をいただいた際に連絡や説明などを行ったこともあります．
              </p>


            </div>
            <h3>経歴</h3>
            <div class="container text-left">
              <div class="row align-items-start">
                <div class="col-md-2 fw-medium">
                  2021.4
                </div>
                <div class="col-md-10">
                  名古屋大学工学部電気電子情報工学科　入学<br />
                  名古屋大学宇宙開発チームNAFTに入部
                </div>
              </div>
              <div class="row align-items-start">
                <div class="col-md-2 fw-medium">
                  2022.10 ~
                </div>
                <div class="col-md-10">
                  <a href='https://ocw.nagoya-u.jp/' target="_blank" rel="noopener noreferrer">名大の授業（NUOCW）</a>の開発に参加．主にフロントエンドを担当しつつ，CMS等の整備も担当．
                </div>
                <div class="row align-items-start">
                  <div class="col-md-2 fw-medium">
                    2023.4 ~ 2024.3
                  </div>
                  <div class="col-md-10">
                    名古屋大学宇宙開発チームNAFTにおいて，ロケット班のPMを担当．
                  </div>
                </div>
                <div class="row align-items-start">
                  <div class="col-md-2 fw-medium">
                    2023.9
                  </div>
                  <div class="col-md-10">
                    GMOインターネットグループ株式会社のインフラコースのインターンに参加．<br/>
                    ConoHaのインフラに関わる技術について学ぶ．
                  </div>
                </div>
                <div class="row align-items-start">
                  <div class="col-md-2 fw-medium">
                    2024.9 ~
                  </div>
                  <div class="col-md-10">
                    株式会社エムニにインターンとして参加．LLMを用いたサービスの構築に関わる．
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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