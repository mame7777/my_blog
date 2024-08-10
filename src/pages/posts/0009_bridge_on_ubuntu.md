---
title: 'Ubuntuでブリッジを作成'
summary: 'マシンを疑似L2スイッチとして運用してみた'
description: 'Ubuntuマシンにブリッジのconfigを入れて，L2な10Gスイッチ(仮)として運用してみました．スピードテストも実施．'
date: '2024-04-30'
slug: '0009-bridge-on-ubuntu'
hero_image: '../../images/posts/0009/bridge.jpg'
---

昔のブログの記事を発掘したので，再アップロード．

## ブリッジとは
流れてきたデータの宛先MACアドレスを参照し，適切な機器へデータを転送する役割をもつもの．<br/>
[詳しくはwikiへ．](https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%AA%E3%83%83%E3%82%B8_%28%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E6%A9%9F%E5%99%A8%29)

## 「Ubuntuで」ブリッジ化するメリット
複数のNICを使用することでハブになる．<br/>
今回は家に転がっていた10GbE*2ポートのNICを2枚用意した．<br/>
このことによって，10GbEな(疑似)L2スイッチをタダで作れる！<br/>

## 構築手順
### 0. 環境を用意
今回使用した環境は以下．
- OS：Ubuntu 20.04.5 LTS
- NIC：X520-T2 Intel Ethernet Converged Network Adapter
  - 10GbE対応RJ45が2ポートあるNIC
  - 今回は2つ用意

### 1. bridge-utilsのインストール
ユーティリティをインストール．
```
$ sudo apt update && sudo apt install -y bridge-utils
```

### 2. NICの名前を確認
ブリッジ化したいネットワークアダプタの名前を確認し，名前を覚える(メモする)．
```
$ ip addr show
```

### 3. configを編集
/etc/netplan/のconfigをテキストエディタにて編集．
今回は，ensp1s0f0，ensp1s0f1，ensp3s0f0，ensp3s0f1を使用．
また，ネームサーバーは指定していない．
```yaml
network:
  ethernets:
    eno1:
      # ブリッジ以外で使用しているアダプタ
    enp1s0f0:
      dhcp4: false
    enp1s0f1:
      dhcp4: false
    enp3s0f0:
      dhcp4: false
    enp3s0f1:
      dhcp4: false
  bridges:
    br0:
      interfaces: [enp1s0f0, enp1s0f1, enp3s0f0, enp3s0f1]
      addresses: [192.168.XXX.XXX/XX]  # ブリッジのIPアドレスを記載
      link-local: []
      nameservers:
        addresses: []  # ネームサーバーを指定するならここにアドレスを記載
      parameters:
        forward-delay: 0
        stp: no
      optional: true
  version: 2
```

### 4. 設定の適用
```
$ sudo netplan apply
```

## 速度を実測してみた
ブリッジを構築した際の速度を測ってみた．<br/>
参考までにどうぞ．

### テスト環境詳細
- ブリッジに使用したマシン
  - CPU：Intel(R) Xeon(R) CPU E3-1220 v3 @ 3.10GHz
  - RAM：16GiB @ 1600 MHz
- 速度計測に使用したマシンたち
  - OS：PROXMOX Virtual Environment 7.3-4
  - NIC：Intel Ethernet Converged Network Adapter X540-T2
  - 計測ソフトウェア：iperf3.9
  - CPUやRAMは記録していないが，10Gbpsを出す上で問題ない性能のものを使用した．

計測には，クライアント側に以下のコマンドを使用．IPアドレスは対向の計測マシンのもの．<br/>
帯域幅に10Gbit/sを指定している．<br/>

```
# iperf3 -c 192.168.XXX.XXX -b 10000M
```

サーバー側はデフォルトの設定で起動．

### テスト結果
NICが十分なPCIeスロットのレーンに刺されていなかった説などあるが，テストしたのが随分前のため要検証．

#### ブリッジ内同一NICで通信した時
```
#  iperf3 -c 192.168.XXX.XXX -b 10000M
Connecting to host 192.168.XXX.XXX, port 5201
[  5] local 192.168.XXX.YYY port 51916 connected to 192.168.XXX.XXX port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  1.04 GBytes  8.91 Gbits/sec   13   2.82 MBytes
[  5]   1.00-2.00   sec  1.04 GBytes  8.93 Gbits/sec    0   2.82 MBytes
[  5]   2.00-3.00   sec  1.04 GBytes  8.91 Gbits/sec    0   2.82 MBytes
[  5]   3.00-4.00   sec  1.04 GBytes  8.91 Gbits/sec    4   2.82 MBytes
[  5]   4.00-5.00   sec  1.04 GBytes  8.91 Gbits/sec    0   2.82 MBytes
[  5]   5.00-6.00   sec  1.04 GBytes  8.92 Gbits/sec    0   2.82 MBytes
[  5]   6.00-7.00   sec  1.04 GBytes  8.91 Gbits/sec    0   2.82 MBytes
[  5]   7.00-8.00   sec  1.04 GBytes  8.89 Gbits/sec    0   2.82 MBytes
[  5]   8.00-9.00   sec  1.04 GBytes  8.90 Gbits/sec    0   2.82 MBytes
[  5]   9.00-10.00  sec  1.04 GBytes  8.93 Gbits/sec    0   2.82 MBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  10.4 GBytes  8.91 Gbits/sec   17             sender
[  5]   0.00-10.04  sec  10.4 GBytes  8.88 Gbits/sec                  receiver

iperf Done.
```

#### ブリッジ内異なるNICで通信した時
```
# iperf3 -c 192.168.XXX.XXX -b 100000M
Connecting to host 192.168.XXX.XXX, port 5201
[  5] local 192.168.XXX.ZZZ port 58254 connected to 192.168.XXX.XXX port 5201
[ ID] Interval           Transfer     Bitrate         Retr  Cwnd
[  5]   0.00-1.00   sec  1.09 GBytes  9.40 Gbits/sec   13   2.26 MBytes
[  5]   1.00-2.00   sec  1.10 GBytes  9.42 Gbits/sec    0   2.26 MBytes
[  5]   2.00-3.00   sec  1.10 GBytes  9.41 Gbits/sec    0   2.26 MBytes
[  5]   3.00-4.00   sec  1.10 GBytes  9.41 Gbits/sec    0   2.26 MBytes
[  5]   4.00-5.00   sec  1.10 GBytes  9.42 Gbits/sec    0   2.26 MBytes
[  5]   5.00-6.00   sec  1.10 GBytes  9.42 Gbits/sec    0   2.26 MBytes
[  5]   6.00-7.00   sec  1.10 GBytes  9.42 Gbits/sec    0   2.26 MBytes
[  5]   7.00-8.00   sec  1.10 GBytes  9.41 Gbits/sec    0   2.26 MBytes
[  5]   8.00-9.00   sec  1.10 GBytes  9.41 Gbits/sec    0   2.26 MBytes
[  5]   9.00-10.00  sec  1.10 GBytes  9.41 Gbits/sec    0   2.26 MBytes
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-10.00  sec  11.0 GBytes  9.41 Gbits/sec   13             sender
[  5]   0.00-10.04  sec  11.0 GBytes  9.37 Gbits/sec                  receiver

iperf Done.
```

## 後日談
このあと数日運用したわけだが，省スペースPCにX520のしかもT2を2枚も運用するのはかなり無理があることが分かった．<br/>
熱的な問題が厳しく安定した通信など夢であり，オーバーヒートでリンクダウンして冷めたあとにリンクアップからのリンクダウンというループであった．<br/>