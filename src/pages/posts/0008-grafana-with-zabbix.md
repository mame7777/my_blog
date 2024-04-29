---
title: 'zabbixとGrafanaを連携させる'
summary: 'かっこよく可視化していく'
description: 'zabbixで取得したデータをGrafanaで可視化していくために，環境構築を行います．'
date: '2024-04-29'
slug: '0008-grafana-with-zabbix'
hero_image: '../../images/0008/grafana-logo.png'
---

昔のブログの記事を発掘したので，再アップロード．

## やること
zabbixで入手したデータを，Grafanaを使ってみやすくする．

## 環境
- Proxmox上のLXCコンテナ
- コンテナのOS : Ubuntu 22.04
- 前提 : zabbixの構築が完了していること
  - zabbix環境の構築は下の記事を参考にしてください。（準備中）

## Grafanaのセットアップ
### 1. インストール
[公式ドキュメント](https://grafana.com/docs/grafana/latest/setup-grafana/installation/debian/)どおりにインストールする．
```
sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
sudo wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key
echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install grafana-enterprise
sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl status grafana-server
sudo systemctl enable grafana-server.service
```
公式サイトに以下の記述があったので今回はEnterpriseの方を選択した．
<div style="margin-left: 1em; padding-left: 0.5em; border-left: 3px solid gray;">
<p>
Note: Grafana Enterprise is the recommended and default edition. It is available for free and includes all the features of the OSS edition. You can also upgrade to the full Enterprise feature set, which has support for Enterprise plugins.
</p>
</div>

これでサーバーが起動して接続できるはず．<br/>
「http://<IPアドレス>:3000」をブラウザで開いてアクセス…できませんでした。

### 2. ファイアフォールの設定
どうやらproxmoxのコンテナに設定されているファイアウォールが悪さをしているようなので，設定を変更．<br/>
今回は，webUIから設定をしていく．<br/>
proxmoxのwebUIを開いてコンテナを選択し，ファイアウォールの部分を選択．<br/>
「追加」を選択し，以下の設定を加える．
|項目名|設定値|
|--|--|
|送信方向|in|
|有効|チェックマーク|
|動作|ACCEPT|
|プロトコル|tcp|
|送り主|<Grafanaのダッシュボードにアクセス許可させたいIP>|
|Dest.port|3000|

<br/>
これで初期ログイン画面にアクセスできる．

### 3. 初期設定
ログイン画面で，ユーザー名とパスワードに「admin」と入力．
画面の指示に従って，パスワードを変更する．


### 4. Zabbixとの連携
#### 4-1. プラグインの導入
画面左下の設定マークからConfigurationのページにとび，Pluginsのタブに移動・
検索窓にzabbixと入れ出てきたプラグインをinstallし，enable．

#### 4-2. zabbixにてユーザーの追加
abbixのwebインターフェイスから，「管理 > ユーザー」を選択し，ユーザーの追加をクリック．<br/>
ユーザー名・パスワードを入力し，グループはフロントエンドへのアクセスをしない「No access to the frontend」を選択．ここは適当なので，適宜行ってください．<br/>
権限のタブからロールを選択．これも適当にuser roleと<strike>した．</strike>設定したらデータが取得できなかったため，特権administratorから適宜権限を削った．<br/>
<span style="font-size:75%; color:gray;">（この原因を突き止めるのにかなり手間取った）</span>

#### 4-3. データソースの追加
「Configuration > Data sources」から「Add date source」をクリック．<br/>
下の方までスクロールすると，othersのカテゴリにzabbixがあるのでクリック．<br/>
<br/>
以下の内容を入力．

|項目名|設定値|
|--|--|
|Name|<適当な名前>|
|URL|http://<zabbixサーバーのIP>/zabbix/api_jsonrpc.php|
|Username|<4-2でzabbixで設定したユーザー名>|
|Password|<4-2でzabbixで設定したパスワード>|


設定後に，「Seve & test」をクリックし，エラーが出なければ完了．

#### 4-4. データが取得できることの確認
プラグインの設定の部分からテンプレートをインポートし，ダッシュボードの項目でインポートしたテンプレートを選択．<br/>
ホストなどを選んでデータが取得できていることを確認する．<br/>
<br/>
**以上で基本的なセットアップが完了．**