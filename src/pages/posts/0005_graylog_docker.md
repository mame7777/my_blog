---
title: 'Docker上でgraylogの環境構築をしてみる'
summary: 'glaylog環境構築リベンジ'
description: 'glaylog環境構築リベンジをDocker上で行います．'
date: '2024-04-21'
slug: 'graylog-docker'
hero_image: '../../images/0005/graylog-logo.png'
---

## 前回を受けて
Ubuntu上にそのまま構築することを試みて，ドキュメント通りにやったがうまくいかなかった．  
そのため，今回はDockerを使用してみる．  

## 構築方法
### 構築するベースの環境
- Ubunut : 20.04（Proxmox上のLXC）
- Docker : version 26.0.2
- Docker Compose : version v2.6.1

### 構築を目指す環境
- Graylog : 5.0.6
- Mongo DB : 5.0
- ElasticSerch : 7.10.2

### 構築手順
[Qiitaの記事](https://qiita.com/khat/items/70ea8c848067ff243798)を大いに参考にさせていただいた．  
次の内容でdocker-compose.ymlを作成する．  
参考記事から，コンテナが常時起動しているように一部改変している．  
また，elasticsearchの部分の`"ES_JAVA_OPTS=-Xms1g -Xmx1g"`に関して，公式ドキュメントのUbuntu上での構築と同様にいくなら使用可能なメモリの半分のサイズを指定するといいかもしれない．

```yml
version: '3'

services:
  mongodb:
    image: "mongo:5.0"
    volumes:
      - "mongodb_data:/data/db"
    restart: "always"

  elasticsearch:
    image: "docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2"
    environment:
      - "http.host=0.0.0.0"
      - "transport.host=localhost"
      - "network.host=0.0.0.0"
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ulimits:
      memlock:
        hard: -1
        soft: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - "xsearch_data:/usr/share/elasticsearch/data"
    restart: "always"

  graylog:
    image: "${GRAYLOG_IMAGE:-graylog/graylog:5.0}"
    depends_on:
      elasticsearch:
        condition: "service_started"
      mongodb:
        condition: "service_started"
    entrypoint: /usr/bin/tini -- wait-for-it elasticsearch:9200 --  /docker-entrypoint.sh
    environment:
      GRAYLOG_NODE_ID_FILE: "/usr/share/graylog/data/config/node-id"
      GRAYLOG_PASSWORD_SECRET: somepasswordpepper
      GRAYLOG_ROOT_PASSWORD_SHA2: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      GRAYLOG_HTTP_BIND_ADDRESS: "0.0.0.0:9000"
      GRAYLOG_HTTP_EXTERNAL_URI: "http://localhost:9000/"
      GRAYLOG_ELASTICSEARCH_HOSTS: "http://elasticsearch:9200"
      GRAYLOG_MONGODB_URI: "mongodb://mongodb:27017/graylog"
    ports:
    - "514:1514/udp"     # Syslog
    - "514:1514/tcp"     # Syslog
    - "5044:5044/tcp"   # Beats
    - "5555:5555/tcp"   # RAW TCP
    - "5555:5555/udp"   # RAW TCP
    - "9000:9000/tcp"   # Server API
    - "12201:12201/tcp" # GELF TCP
    - "12201:12201/udp" # GELF UDP
    #- "10000:10000/tcp" # Custom TCP port
    #- "10000:10000/udp" # Custom UDP port
    - "13301:13301/tcp" # Forwarder data
    - "13302:13302/tcp" # Forwarder config
    volumes:
      - "graylog_data:/usr/share/graylog/data/data"
      - "graylog_journal:/usr/share/graylog/data/journal"
    restart: "always"

volumes:
  mongodb_data:
  xsearch_data:
  graylog_data:
  graylog_journal:
```
そのあと，上のファイルがある場所で，`docker compose up`する．  

### Proxmox上で起こる？エラー
上記の内容で行うと，次のようなエラーが出てコンテナが作成できない．  
```
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error setting rlimits for ready process: error setting rlimit type 8: operation not permitted: unknown
```
[githubでのissue](https://github.com/wazuh/wazuh-docker/issues/903)をもとに，docker-compose.ymlにおいて次のようにコメントアウトする．
```yml
   # ulimits:
   #   memlock:
   #     soft: -1
   #     hard: -1
   #   nofile:
   #     soft: 65536
   #     hard: 65536
```
これで動くはず．

### 設定
デフォルトの設定だと，ユーザー名パスワードともにadminで入れる．  
ネットに繋がらないからマニュアル出せないよ！的なことを言われるけど，設定は普通にできる．  
TCP/UDPの受信は，dockerの設定でポートが514から1514に転送されている．  
自分の場合は，これでYAMAHA RTX1210からsyslogの転送に成功した．  


## やり残したこと
- タイムゾーンを環境変数`TZ`で設定しようとしたが反映されなかった
- graylogの新しいバージョン（5.2？）が出ているらしいので，そちらも気になる