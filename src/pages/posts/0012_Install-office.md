---
title: 'Microsoft365 Officeのインストールのカスタマイズ'
summary: 'Microsoft365 Office のソフトウェアをインストールする際に，インストールしたいソフトウェアのみをインストールする．'
description: 'Microsoft365 Office のソフトウェアをインストールする際に，インストールしたいソフトウェアのみをインストールする方法．Office展開ツールと，Officeカスタマイズツールを用いて実施します．'
date: '2024-08-20'
slug: '0012-install-office'
hero_image: '../../images/posts/0012/setting.png'
---

## 実現したいこと
Microsoft365のOfficeソフトウェアのインストールにおいて，自分がインストールしたいソフトウェアのみ選択的にインストールしたい．<br/>
windowsプリインストールアプリなどから誘導される方法では，自分が使わないアプリなども含めて一式インストールしないといけない．

## 手順
### 1. インストール実行ファイルの入手
Microsoftが公開しているOffice展開ツールを用いて，インストール用の実行ファイルを入手します．<br/>
Office展開ツールの入手リンク：[https://www.microsoft.com/en-us/download/details.aspx?id=49117](https://www.microsoft.com/en-us/download/details.aspx?id=49117)

実行後，規約に同意すると展開するフォルダを聞かれるので，適当な場所にフォルダを作って選択し実行．<br/>
すると，フォルダ内に，`setup.exe`とxmlファイルが作成されます．<br/>
今回は，`setup.exe`のみ用います．

### 2. 構成ファイルの作成
どんなソフトをどのような設定でインストールするかを構成ファイルを用いて指定できます．<br/>
そして，その構成ファイルを簡単に作るツールがMicrosoftよりOfficeカスタマイズツールとして公開されています．<br/>
カスタマイズツールの各項目を選び，エクスポートすることで構成ファイルを作成できます．<br/>
Officeカスタマイズツールのリンク：[https://config.office.com/deploymentsettings](https://config.office.com/deploymentsettings)

ちなみに，公式ドキュメントは[こちら](https://learn.microsoft.com/ja-jp/microsoft-365-apps/admin-center/overview-office-customization-tool)

が，少し項目が多く，詳細にカスタマイズしたい際には有難いのですが，サクッとインストールしたい際には不向きです．(そもそも，サクッとインストールする時用に作られているものではないので仕方ないですね)<br/>
ということで，以下にテンプレートとして自分が使用した内容を記述しておきます．よければご使用ください．<br/>
いい感じにテキストエディタで以下の内容を記述し保存，ファイル名を`config.xml`に変更してください．

これらによって作成したxmlファイルを，1.で作成した`setup.exe`と同じフォルダに配置する．

```
<Configuration>
  <Add OfficeClientEdition="64" Channel="Current">
    <Product ID="O365ProPlusRetail">
      <Language ID="ja-jp" />
      <ExcludeApp ID="Access" />
      <ExcludeApp ID="Groove" />
      <ExcludeApp ID="Lync" />
      <ExcludeApp ID="Publisher" />
      <ExcludeApp ID="Bing" />
    </Product>
    <Product ID="ProofingTools">
      <Language ID="en-us" />
      <Language ID="ja-jp" />
    </Product>
  </Add>
  <Updates Enabled="TRUE" />
  <RemoveMSI />
  <AppSettings>
    <User Key="software\microsoft\office\16.0\excel\options" Name="defaultformat" Value="51" Type="REG_DWORD" App="excel16" Id="L_SaveExcelfilesas" />
    <User Key="software\microsoft\office\16.0\powerpoint\options" Name="defaultformat" Value="27" Type="REG_DWORD" App="ppt16" Id="L_SavePowerPointfilesas" />
    <User Key="software\microsoft\office\16.0\word\options" Name="defaultformat" Value="" Type="REG_SZ" App="word16" Id="L_SaveWordfilesas" />
  </AppSettings>
</Configuration>
```
これをベースに，カスタマイズすると早いかもしれません．<br/>
一応，設定内容も記述しておきます．いい感じに変更してください．<br/>


| 設定項目 | 設定箇所 | 設定内容 |
| -- | -- | -- |
|インストールする製品群 | &lt;Product ID="O365ProPlusRetail"　Channel="Current"> |  最新のMicrosoft365(x64アーキテクチャ) |
| インストール<b>しない</b>製品 | &lt;ExcludeApp ID="hoge hoge" /> | Access<br/>Groove<br/>Lync<br/>Publisher<br/>Bing|
| インストール<b>する</b>製品<br/>（ExcludeAppに指定していないものがインストールされます．）<br/>※参考のため記載 | - | Onedrive Desktop<br/>Outlook<br/>Word<br/>Excel<br/>PowerPoint<br/>OneNote<br/>Teams |
| 主言語 | &lt;Product ID="O365ProPlusRetail">内の<br/>&lt;Language ID="ja-jp" /> |  日本語 |
| 校正ツールの言語 | &lt;Product ID="ProofingTools">内の<br/><Language ID="" /> | 日本語<br/>英語（米国） |
| アップデート | &lt;Updates Enabled="TRUE" /> | Office CDN<br/>（ローカルに更新プロフラムを置く場合以外はこれでいいと思います．） |
| 既存のOffice | &lt;RemoveMSI /> | MSI版を削除 |
| 既存のファイル形式<br/>(windowsの既存のファイル形式の設定？) | &lt;AppSettings>内 | Word, Excel, PowerPointをユーザーの規定値として設定 |

### 3. インストール実行
2.で作成したxmlファイル名を以下では`config.xml`とします．適宜読み替えてください．<br/>

コマンドプロンプトで，1.で作成したファイルと同じディレクトリに移動する．（一応記載しておくと，`cd (ディレクトリへのパス)`を用います）<br/>

次に，必要ファイルのダウンロードを行います．以下のコマンドを実行．<br/>
`setup.exe /download config.xml`<br/>

そして，インストールを行います．以下のコマンドを実行．<br/>
`setup.exe /configure config.xml`<br/>

以上で終了です．お疲れさまでした！