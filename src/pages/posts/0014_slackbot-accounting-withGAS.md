---
title: 'SlackBot+GASで簡素な会計管理'
summary: '個人間で数百円とか貸し借りときにカンタンに記録したいよねっていう'
description: '個人間での貸し借りをカンタンに記録したいと思いbotを作成した．SlackbotとGoogle Apps Scriptを使って，Slack上での入力をGoogle Spreadsheetに記録する．'
date: '2024-11-07'
slug: '0014-slackbot-accounting-with-gas'
hero_image: '../../images/posts/0014/slack-post.png'
---

かんたんなbotを作ったので，その紹介．

## 実現したいこと
- Slack上でかんたんに会計情報を記録する
- 会計情報をGoogle Spreadsheetに記録する

## 使用するもの
- SlackAPI
- Google Apps Script
- Google Spreadsheet

## 使用方法
※実装方法は使用方法のあとに記載している．
### 会計情報の記録
Slack上で`/add`コマンドを使って会計情報を記録する．  
`/add [貸している人] [借りている人] [金額]`
それぞれのパラメータ間はスペースで区切る．  
金額は，半角数字で入れること．負数の小数には対応している．  

### 会計情報の表示
Slack上で`/list`コマンドを使って会計情報を表示する．  
`/list`コマンドを実行すると，`SPREAD_SHEET_SHEET_NAME_SUM`で指定したシートのA2:B3の情報が表示される．  
※表示される範囲の変更方法はページ末尾の「おまけ」に記載している．

## 実装方法
### 1. Google Spreadsheetの作成
会計情報を記録するためのGoogle Spreadsheetを作成する．
以下のようなシートを作成する．
- 会計情報を記録するシート（下の順番に1行目に記載）
  - 登録日時
  - 貸している人
  - 借りている人
  - 金額
- 集計した情報を記録するシート
- ユーザー情報を記録するシート
  - A列に利用するユーザー名を順に記載
  - ここで指定したユーザー名のみ会計情報を記録するコマンドで利用可能

### 2. Google Apps Scriptを作成
#### コードの作成
Slackからのリクエストを受け取るためのGoogle Apps Scriptを作成する．  
Google Apps Scriptのエディタを開き，新しいスクリプトを作成する．  
（新しいスクリプトの作成方法は他のページを参照してください．）<br/>
  
以下ページにあるコードをコピペする．  
Github: [mame7777 / slackbot_accounting_with_GAS](https://github.com/mame7777/slackbot_accounting_with_GAS/blob/main/main.gs)

####  GAS内の環境変数の設定
GASの「プロジェクトの設定」より，「スクリプトプロパティ」を設定する．<br/>
| プロパティ名 | 値 |
| --- | --- |
| BOT_AUTH_TOKEN | SlackAPIのOAuth Access Token<br/>以降の手順で取得 |
| SLACK_VERIFICATION_TOKEN | SlackAPIのVerification Token<br/>以降の手順で取得 |
| CHANNEL_NAME | 会計情報を記録するチャンネル名<br/>Slackのアプリから取得 |
| SPREAD_SHEET_ID | 会計情報を記録するGoogle SpreadsheetのID<br/>1.で作成したシートのリンクから入手可能<br/>`https: //docs.google.com/spreadsheets/d/<SheetのID>/edit` |
| SPREAD_SHEET_SHEET_NAME_MONEY | 会計情報を記録するGoogle Spreadsheetのシート名<br/>1.で作成済み |
| SPREAD_SHEET_SHEET_NAME_SUM | 集計した情報を記録するGoogle Spreadsheetのシート名<br/>1.で作成済み |
| SPREAD_SHEET_SHEET_NAME_USER | ユーザー情報を記録するGoogle Spreadsheetのシート名<br/>1.で作成済み |

### 3. SlackAPIの設定
#### アプリの作成
[SlackAPIのページ](https://api.slack.com/apps)より，新しくアプリを作成する．<br/>
「Create New App」より「From scratch」を選択．<br/>
よしなに「App Name」を入力し，使いたいワークスペースを「Pick a workspace to develop your app in」にて選択．<br/>

#### 各種トークンの取得
取得したら，2.で設定したプロパティに設定する．
- OAuth Access Token
  - 「OAuth & Permissions」より「Install to Workspace」をクリックし，アプリをワークスペースにインストール．
  - 「OAuth Tokens for Your Workspace」に「Bot User OAuth Access Token」が表示されるので，コピーする．
  - GASのプロパティ「BOT_AUTH_TOKEN」に設定する．
- Verification Token
  - 「Basic Information」より「App Credentials」にある「Verification Token」をコピーする．
  - GASのプロパティ「SLACK_VERIFICATION_TOKEN」に設定する．

#### Botの権限設定
「OAuth & Permissions」の「Bot Token Scopes」より，以下の権限を設定する．
- chat:write
- commands

#### Slackの設定
Slackのアプリから，会計情報を記録するチャンネル名を取得する．
- チャンネル名を取得し，GASのプロパティ「CHANNEL_NAME」に設定する．
また，該当のチャンネルにアプリを追加する．  
チャンネルの情報を開いたあと，「インテグレーション」をクリックし，「アプリを追加」をクリックする．（Windows用アプリ）

### 4. GASのデプロイ
GASのプロパティの設定を全て行ったことを確認し，GASをデプロイする．  
GASの「デプロイ」>「新しいデプロイ」より「ウェブアプリ」を選択しデプロイ．  
デプロイ後に表示されるURLをコピーし控える．

### 5. Slackの設定
コマンドの設定を行う．
「Slash Commands」より「Create New Command」をクリック．  
以下のように設定する．
- Command: `/add`
- Request URL: 4.でコピーしたURL
- Short Description: 会計情報を記録する
- Usage Hint: [貸している人] [借りている人] [金額]

また，もう一つコマンドを作成する．
- Command: `/list`
- Request URL: 4.でコピーしたURL
- Short Description: 会計情報を表示する

以上でbotの設定は完了．

これで，Slack上で`/add`コマンドを使って会計情報を記録できるようになる．  
また，`/list`コマンドで記録した会計情報を表示できる．

## おまけ
### 集計した情報を記録するシートの設定
A2に`=CONCATENATE(userList!A1, "が借りている")`，B2に`=SUMIF(editByBot!C2:C999, userList!A1, editByBot!D2:D999)`を記載する．
これにより，ユーザーごとの借りている金額を集計できる．  
ユーザー数に合わせて行を追加すること．

### listコマンドの内容修正
現状では，`/list`コマンドは`SPREAD_SHEET_SHEET_NAME_SUM`で指定したシートのA2:B3の情報を表示するようになっている．  
必要に応じて変更すること．  
`showData()`関数内の`sheet.getRange("A2:B3").getValues()`を変更することで表示する範囲を変更できる．

### Slackのエラーについて
たまに，`/add はエラー「operation_timeout」により失敗しました`と表示されることがある．  
これは，Slackへのレスポンスタイムが3秒を超えた場合に表示されるエラーである．  
非同期に処理するのはGASだと割と複雑らしいので，現状は放置している．  
とりあえず，addコマンド後にbotから応答があれば正常に記録されている．
