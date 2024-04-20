---
title: 'graylogの環境構築をしてみる'
summary: 'syslogをよしなにできる環境を'
description: 'syslogをよしなにできる環境を整えるべく，graylogを入れてみることにしました．結果として，エラーで詰みました．'
date: '2024-04-20'
slug: 'graylog'
hero_image: '../../images/0004/graylog-logo.png'
---

## graylogって？
logを良しなにするものらしい．  
インストールは公式ドキュメントを参考にした．  
https://go2docs.graylog.org/5-2/downloading_and_installing_graylog/ubuntu_installation.html  
一応起動するようになったが，なぜかログインで詰んで先に行かなくなってしまった．  
そのため，正しいか非常に微妙だが記録も兼ねて一応公開しておく．

## 構築手順
### 環境
- Ubuntu 20.04
- MongoDB 6.0

### MongoDBをインストール
```
# apt-get update
# apt-get install gnupg curl -y
# curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
# echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
# apt-get update
# sudo apt-get install -y mongodb-org

# wget -qO- 'http://keyserver.ubuntu.com/pks/lookup?op=get&search=0xf5679a222c647c87527c2f8cb00a0bd1e2c63c11' | sudo apt-key add -

# systemctl daemon-reload
# systemctl enable mongod.service
# systemctl restart mongod.service
# systemctl --type=service --state=active | grep mongod
```

### OpenSearchをインストール
```
# curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring
# echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-2.x.list
# apt-get update
# OPENSEARCH_INITIAL_ADMIN_PASSWORD=$(tr -dc A-Z-a-z-0-9_@#%^-_=+ < /dev/urandom  | head -c${1:-32}) apt-get install opensearch
```
ここから設定を変更していく．
```
# vim /etc/opensearch/opensearch.yml
```
次の内容を追記する．
```
cluster.name: graylog
node.name: ${HOSTNAME}
path.data: /var/lib/opensearch
path.logs: /var/log/opensearch
discovery.type: single-node
network.host: 0.0.0.0
action.auto_create_index: false
plugins.security.disabled: true
indices.query.bool.max_clause_count: 32768
```
設定を変更．
```
# vim /etc/opensearch/jvm.options
```
使用できるRAMの半分の量を設定．
```
-Xms1g
-Xmx1g
```
```
# sysctl -w vm.max_map_count=262144
# echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
```
設定を反映し，起動
```
# systemctl daemon-reload
# systemctl enable opensearch.service
# systemctl start opensearch.service
# systemctl status opensearch.service
```

### Elasticsearchをインストール
```
# wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
# echo "deb https://artifacts.elastic.co/packages/oss-7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
# apt update && apt install elasticsearch-oss
```
```
# tee -a /etc/elasticsearch/elasticsearch.yml > /dev/null <<EOT
cluster.name: graylog
action.auto_create_index: false
EOT
```
```
# systemctl daemon-reload
# systemctl enable elasticsearch.service
# systemctl restart elasticsearch.service
# systemctl --type=service --state=active | grep elasticsearch
```

### Graylogのインストール
```
# wget https://packages.graylog2.org/repo/packages/graylog-5.2-repository_latest.deb
# dpkg -i graylog-5.2-repository_latest.deb
# apt-get update && sudo apt-get install graylog-server 
```

### Graylogの設定
`password_secret`の値を次のコマンドで作成し，控える．
```
# < /dev/urandom tr -dc A-Z-a-z-0-9 | head -c${1:-96};echo;
```
`root_password_sha2`の値を次のコマンドで作成し，控える．
```
# echo -n "Enter Password: " && head -1 </dev/stdin | tr -d '\n' | sha256sum | cut -d" " -f1
```

設定ファイルに以上の内容を記載．
``` 
# vim /etc/graylog/server/server.conf
```

接続元のアドレスをコマンドで記載．
```
# sed -i 's/#http_bind_address = 127.0.0.1.*/http_bind_address = 0.0.0.0:9000/g' /etc/graylog/server/server.conf
```

```
# systemctl daemon-reload
# systemctl enable graylog-server.service
# systemctl start graylog-server.service
# systemctl --type=service --state=active | grep graylog
```
## エラー内容
ひとまず動くようになったが，webUIのログインができずに終わってしまった．  
指定どおりの方法でやったはずだか認証が弾かれる．  
また，ログ上ではその裏でgraylogを起動しようとして失敗するのをループしていた．