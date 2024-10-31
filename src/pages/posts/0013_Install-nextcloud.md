---
title: 'Nextcloudをインストールしてみる'
summary: 'おうちクラウド（？）を夢見たお話'
description: 'Nextcloudを自宅サーバーでホストし，cloudflare tunnelを用いて外部からもアクセスできるようにする．'
date: '2024-10-23'
slug: '0013-install-nextcloud'
hero_image: '../../images/posts/0013/nextcloud-top.png'
---

## 実現したいこと
- Nextcloudを自宅サーバーでホストする
- 外部からもアクセスできるようにする

## 構築する環境
- Ubuntu 22.04（Proxmox VE 7.4上のLXC）
  - Nextcloud
  - Apache2
  - MariaDB 10.6
  - PHP 8.1
- cloudflare tunnel
  - 超便利なサービスでなぜか無料

## 手順
[公式ドキュメント](https://docs.nextcloud.com/server/30/admin_manual/installation/example_ubuntu.html)を主に参考にした．

### 1. 必要なもののインストール
次のコマンドを実行．
```bash
sudo apt update && sudo apt upgrade
sudo apt install apache2 mariadb-server libapache2-mod-php php-gd php-mysql \
php-curl php-mbstring php-intl php-gmp php-bcmath php-xml php-imagick php-zip
```


### 2. データベースの作成
mysqlにログインして，データベースを作成．
```bash
sudo mysql
```

Nextcloud用のデータベースを作成．
ログイン情報は以下としてコマンドを記述．適宜変更してください．
- データベース名：nextcloud
- ユーザー名：username
- パスワード：password

```sql
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
CREATE DATABASE IF NOT EXISTS nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
GRANT ALL PRIVILEGES ON nextcloud.* TO 'username'@'localhost';
FLUSH PRIVILEGES;

quit;
```


### 3. Nextcloudのダウンロード
次のコマンドを実行．
```bash
wget https://download.nextcloud.com/server/releases/latest.zip
sudo apt install unzip
unzip latest.zip
sudo cp -r nextcloud /var/www
sudo chown -R www-data:www-data /var/www/nextcloud
```

### 4. Apacheの設定
apacheの設定ファイルを編集．
```bash
sudo nano /etc/apache2/sites-available/nextcloud.conf
```

```
Alias /nextcloud "/var/www/nextcloud/"

<Directory /var/www/nextcloud/>
  Require all granted
  AllowOverride All
  Options FollowSymLinks MultiViews

  <IfModule mod_dav.c>
    Dav off
  </IfModule>
</Directory>
```

モジュールの有効化
```bash
sudo a2ensite nextcloud.conf
sudo a2enmod rewrite
sudo a2enmod headers
service apache2 restart
```

phpの設定ファイルを編集．
```bash
sudo vim /etc/php/8.1/apache2/php.ini
```

いい感じのサイズに変更
```
memory_limit = -1  <-メモリ使用量の上限を無制限に
post_max_size = 100M <- POSTデータの最大サイズ
upload_max_filesize = 100M <- アップロードファイルの最大サイズ
```



### 5. Nextcloudの設定
設定ファイルを編集．
```bash
sudo nano /var/www/nextcloud/config/config.php
```
以下の`sub-domain.sample.com`はいい感じに変更してください．
```php
<?php
$CONFIG = array (
  'instanceid' => 'hogehoge',
  'overwrite.cli.url' => 'https://sub-domain.sample.com/nextcloud',
  'htaccess.RewriteBase' => '/nextcloud',
);
```

### 6. SSL化
apacheの設定でSSL化する．Let's Encryptを使ってもよいだろうが，今回はのちにCloudflareのtunnelを使うため，自己証明書で設定する．
```bash
sudo a2enmod ssl
sudo a2ensite default-ssl
sudo service apache2 reload
```

### 6. インストール
```bash
chown -R www-data:www-data /var/www/nextcloud/
```
ブラウザを開いて，webUIの指示に従ってインストール．


### 7. cloudflare tunnelの設定
cloudflareのwebページより設定．出てきたコマンドを実行．

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && \
sudo dpkg -i cloudflared.deb && \
sudo cloudflared service install .................
```

詳しい設定は次のサイトが大変詳しかったので，こちらに譲りたいと思います．  
[Cloudflare Tunnelで自宅のNextcloudにhttps接続する](https://text.yusukesakai.com/entry/20231022/1697901587)  

nextlcoudの設定ファイルを編集．
```bash
sudo nano /var/www/nextcloud/config/config.php
```

```php
'trusted_domains' =>
  array (
    0 => 'hogehoge',
    1 => 'hugahuge',
  ),
```


お疲れ様でした．これで，外部からもアクセスできるようになりました．

## おまけ
### おまけ1. アクセスリンクをいい感じにする
「sample.com/nextcloud」ではなく，「sample.com」でアクセスしたい場合．
`/etc/apache2/sites-enabled/default-ssl.conf`と`sudo vim /etc/apache2/sites-enabled/000-default.conf`の内容を次のように書き換える
```
- DocumentRoot /var/www/html
+ DocumentRoot /var/www/nextcloud
```

`/var/www/nextcloud/config/config.php`を次のように書き換える
```
-   'overwrite.cli.url' => 'https://sample.com/nextcloud',
-   'htaccess.RewriteBase' => '/nextcloud',
+   'overwrite.cli.url' => 'https://sample.com/',
+   'htaccess.RewriteBase' => '/',
```

その後，次のコマンドを実行．
```bash
sudo -u www-data php /var/www/nextcloud/occ maintenance:update:htaccess
sudo systemctl restart apache2
```

### おまけ2. データベースをセキュアにする
まず，rootユーザーでログインして，次のコマンドを実行．（既にパスワード設定済みなら必要ない）
```bash
sudo mysql -u root -p
```
Passwordの部分は自分のパスワードに置き換える．
```sql
use mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY "Password";
```

次に，セキュリティー改善のコマンドを実行．
```bash
mysql_secure_installation
```
いい感じに答えていくと，少しはセキュアになるかな．

## 参考にさせていただいたサイト
- 公式ドキュメント
- [Ubuntu 22.04に Nextcloud をインストールする方法](https://memorandum.cloud/2023/01/23/1858/)
- [Cloudflare Tunnelで自宅のNextcloudにhttps接続する](https://text.yusukesakai.com/entry/20231022/1697901587)  
