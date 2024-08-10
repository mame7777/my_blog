---
title: 'ZabbixでGPUの状態を読んでみる'
summary: 'templateファイルがあったので，それを読んでちょこっとconfigを弄る'
description: 'ZabbixでnVidia製GPUの状態を読みたいなと思ったので，やってみた，意外と簡単にできましたとさ．'
date: '2024-04-28'
slug: '0007-zabbix-nvidia-gpu'
hero_image: '../../images/posts/0007/Zabbix-logo.png'
---

## はじめに
Zabbixを用いて，nvidia製GPUの使用状況などを読みたいなあと思ったので，やってみました．<br/>

## 導入
今回は，Zabbix6.0へ導入していきます．
### 1. テンプレートのダウンロード
偉大な先人によるテンプレートが既にあるので，そちらをダウンロードする．<br/>
[リンクはこちら．](https://github.com/zabbix/community-templates/blob/main/Server_Hardware/Other/template_nvidia-smi_integration/6.0/template_nvidia-smi_integration.yaml)<br/>

### 2. 監視対象での設定
既にnvidia-smiのコマンドが実行できる環境という想定で進めます．<br/>
テキストエディタで，`/etc/zabbix/zabbix_agent2.conf`を開き，次の内容を追記する．<br/>
```
UserParameter=gpu.temp,nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits -i 0
UserParameter=gpu.memtotal,nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits -i 0
UserParameter=gpu.used,nvidia-smi --query-gpu=memory.used --format=csv,noheader,nounits -i 0
UserParameter=gpu.free,nvidia-smi --query-gpu=memory.free --format=csv,noheader,nounits -i 0
UserParameter=gpu.fanspeed,nvidia-smi --query-gpu=fan.speed --format=csv,noheader,nounits -i 0
UserParameter=gpu.utilisation,nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits -i 0
UserParameter=gpu.power,nvidia-smi --query-gpu=power.draw --format=csv,noheader,nounits -i 0
```
追記後，`sudo systemctl restart zabbix-agent2.service`を実行する．

### 3. Zabbix serverでの設定
webUIで設定>テンプレートより，右上の「インポート」を選択し，先ほどダウンロードしたファイルを選択．<br/>
次に，設定>ホストより監視したいホストを選択し（なかったら右上の「ホストの作成」を選択する），テンプレートの欄に「NVidia Sensors」と検索し出てきたものを追加し設定を反映する．<br/>
以上で，設定が反映され，各種数値が見れたりグラフが見れるはずだ．

