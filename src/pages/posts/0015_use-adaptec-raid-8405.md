---
title: 'AdaptecのASR-8405を使う'
summary: '少し古めのRAIDカードをよしなに使ってみた'
description: 'AdaptecのRAIDカードASR-8405を使ってみたので，その際に躓いた点をまとめる．'
date: '2024-12-13'
slug: '0015-use-adaptec-raid-8405'
hero_image: '../../images/posts/0015/asr-8405.png'
---

RAIDカードを使う際のことを書いておく．<br/>
少々（？）古めのRAIDカードを今更使い始める方向けの情報である．<br/>
また，windows環境では，割と簡単にソフトウェアの設定ができた気がするので特に書かず，Ubuntu環境での設定を書く．

## 使用環境
- OS: Unbuntu 22.04
- CPU: Intel Xeon (x86_64アーキテクチャ)
- RAIDカード: Adaptec ASR-8405

## 環境構築
### ディスクの設定
起動時にAdaptec RAID Configuration Utilityに入れるタイミングがあるので，そこでRAIDの設定を行う．<br/>
割と分かりやすいUIで，初めてでも問題なく設定できると思うので特に書かない．<br/>
一応後述の方法でCLIから設定できるようだが，未検証．

### ドライバ
Adaptecのサイトにドライバファイルが置いてあるが，Ubuntuは18までしか対応しておらず，現状問題なく使えているので諦めた．

### ユーティリティ
#### ダウンロード
Adaptecのサイトからドライバをダウンロードしてインストールする．<br/>
今回はファイルサーバーでありGUI環境を用意していないので，コマンドラインユーティリティをインストールする．<br/>
[Adaptecのサイト](https://storage.microsemi.com/en-us/downloads/storage_manager/sm/productid=asr-8405&dn=adaptec+raid+8405.php)より，「Adaptec ARCCONF Command Line Utility」を選択．<br/>
「Download Now」から，いい感じにライセンスに同意したあとにダウンロードボタンが表示されるので，そのリンク使用して`wget`でダウンロードする．<br/>
```bash
$ wget [リンク]
```

#### インストール
先ほどダウンロードしたものを解凍し，`cmdline`ディレクトリに移動する．
```bash
$ tar -xvf [ダウンロードしたファイル]
$ cd cmdline
```
 

`deb`ディレクトリにdebファイルが用意されているが，自分の環境では正常にインストールができなかった．<br/>
そこで，`rpm`ディレクトリにあるrpmファイルを使ってインストールする．
```bash
$ cd rmp
# 以下のコマンドで変換用のパッケージをインストール
$ sudo apt install alien dpkg-dev debhelper build-essential 
# rpmファイルをdebファイルに変換
$ sudo alien [rpmファイル] --scripts
# debファイルをインストール
$ sudo dpkg -i [debファイル]
```
インストール時の出力を以下に記しておく．エラーが出ているが，とりあえず使えるので放置．
```bash
$ sudo dpkg -i arcconf_3.07-23981_amd64.deb
Selecting previously unselected package arcconf.
(Reading database ... 125545 files and directories currently installed.)
Preparing to unpack arcconf_3.07-23981_amd64.deb ...

Arcconf
Version 3.07
/var/lib/dpkg/tmp.ci/preinst: line 6: [: install: integer expression expected
Unpacking arcconf (3.07-23981) ...
Setting up arcconf (3.07-23981) ...

Arcconf is located at /usr/Arcconf
/var/lib/dpkg/info/arcconf.postinst: line 12: [: configure: integer expression expected
Upgrade completed successfully.
```

#### つかってみる
詳しい使用方法は，[公式サイト](https://storage.microsemi.com/en-us/support/raid/sas_raid/asr-8405/)から飛べるドキュメントを参考にしてください．<br/>
また，親切に[日本語のマニュアル](https://download.adaptec.com/pdfs/user_guides/ja/cli_v6_50_18570_users_guide_ja.pdf)も用意されているようで，こちらも参考になると思います．（ただ，少し古いような気がする）<br/>
以下は，簡単なコマンドの例．
```bash
# デバイス1の全ての情報を表示
$ sudo arcconf getconfig 1 AL
# デバイスのバージョンを表示
$ sudo arcconf getversion
```


## 参考にさせていただいたサイト
- [ubuntuでrpmパッケージを使う - エイリーの備忘録](https://youmjww.hatenablog.jp/entry/2017/05/16/ubuntu%E3%81%A7rpm%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%82%92%E4%BD%BF%E3%81%86)
  - rmpファイルをdebファイルに変換する方法を参考にさせていただきました．