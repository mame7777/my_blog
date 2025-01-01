---
title: 'k8sクラスタ on Proxmoxを建立する'
summary: 'k8sを学ぶにあたって，お砂場の整備をした'
description: 'k8sクラスタをproxmoxのvm上にセットアップした際の備忘録'
date: '2025-01-01'
slug: '0016-k8s-setup-on-proxmox'
hero_image: '../../images/posts/0016/k8s-logo.png'
---

k8sを学ぶにあたって，クラスタを作ってみた．<br/>
知識がなく，躓くことが多かったのでメモ．


## 環境
- マシン: Proxmox VE 8.3.2上のVM
  - CPU: 2core
  - RAM: 4GB
  - ノード数: control-plane 1, worker 2
- OS: Ubuntu 24.04
- kubernetes: v1.32
- CRI: CRI-O (v1.32)
- CNI: Calico


### 環境の選定理由
- Proxmox: VMを立てるのが楽なのに加え，テンプレートを使用することでチェックポイントとして使えるため
- CRI-O: 初めはcontainerdを使って構築していたが，cgroupなどなどの設定を見直しても永遠に安定した環境を作成できず，変更した経緯がある．
- Calico: 今回はCNIの選定理由は特にない．

## 環境構築
vmを作成することをは割愛する．固定IPを設定した環境で実施．<br/>

### 1. vmの設定変更
一応確認事項は[公式ドキュメント](https://kubernetes.io/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#%E5%A7%8B%E3%82%81%E3%82%8B%E5%89%8D%E3%81%AB)に書いてあるが，自分の環境ではスワップ以外は問題なかった
control-plane, workerそれぞれにスワップ無効化の設定を実施．
```bash
sudo swapoff -a
```
また，`/etc/fstab`からスワップの設定を削除する．
```
- /swap.img      none    swap    sw      0       0
+ #/swap.img      none    swap    sw      0       0
```

名前解決ができない場合は各ノードで名前解決ができるように，各ノードで`/etc/hosts`に設定する．
```txt
<IPアドレス0> <ホスト名0>
<IPアドレス1> <ホスト名1>
...
```

もろもろの設定を変更する．[公式ドキュメント](https://kubernetes.io/ja/docs/setup/production-environment/container-runtimes/#ipv4%E3%83%95%E3%82%A9%E3%83%AF%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%92%E6%9C%89%E5%8A%B9%E5%8C%96%E3%81%97-iptables%E3%81%8B%E3%82%89%E3%83%96%E3%83%AA%E3%83%83%E3%82%B8%E3%81%95%E3%82%8C%E3%81%9F%E3%83%88%E3%83%A9%E3%83%95%E3%82%A3%E3%83%83%E3%82%AF%E3%82%92%E8%A6%8B%E3%81%88%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E3%81%99%E3%82%8B)をそのまま引用．
```
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# この構成に必要なカーネルパラメータ、再起動しても値は永続します
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 再起動せずにカーネルパラメータを適用
sudo sysctl --system
```

### 2. コンテナランタイムのインストール
[公式ドキュメント](https://github.com/cri-o/packaging/blob/main/README.md#usage)を引用．

まず環境変数を設定．
```bash
export KUBERNETES_VERSION=v1.32
export CRIO_VERSION=v1.32
```

インストールに必要なパッケージをインストールする．
```bash
apt-get update
apt-get install -y software-properties-common curl
```

リポジトリを追加
```bash
# k8sのリポジトリ
curl -fsSL https://pkgs.k8s.io/core:/stable:/$KUBERNETES_VERSION/deb/Release.key |
    sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/$KUBERNETES_VERSION/deb/ /" |
    sudo tee /etc/apt/sources.list.d/kubernetes.list

# CRI-Oのリポジトリ
curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/deb/Release.key |
    sudo gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/stable:/$CRIO_VERSION/deb/ /" |
    sudo tee /etc/apt/sources.list.d/cri-o.list
```

パッケージのインストール．
```bash
sudo apt-get update
sudo apt-get install -y cri-o kubelet kubeadm kubectl
```

CRI-Oの開始．
```bash
sudo systemctl start crio.service
```

### 3. k8sクラスタの構築
CIDRに関する引数を渡せる．既存のネットワークと被らないようにする．<br/>
後ほど設定値を使うので，覚えておく．
```bash
kubeadm init --pod-network-cidr=172.16.0.0/16
```
「Your Kubernetes control-plane has initialized successfully!」と出れば完了．

上のメッセージに続くように，設定を実施．
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

また，「kubeadm join」から続くコマンドを控えておく．後ほど，クラスタにノードを参加させる際に使用する．

以下のコマンドで，「coredns-*」以外が正常に動いていれば正常．
```bash
kubectl get pods --all-namespaces
```

### 4. CNIのインストール
[公式ドキュメント](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart#install-calico)参照．

ドキュメント該当箇所1のコマンドを実行．
```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.1/manifests/tigera-operator.yaml
```

ドキュメント2の箇所だが，ネットワークの設定を変更して使用する．
```bash
wget https://raw.githubusercontent.com/projectcalico/calico/v3.29.1/manifests/custom-resources.yaml
```

「custom-resources.yaml」に以下の部分を，「kubeadm init」の際に設定したものに変更する．
```yaml
spec:
  calicoNetwork:
    ipPools:
    - name: default-ipv4-ippool
      blockSize: 26
      cidr: # <- ここ
```

適用する．
```bash
kubectl create -f custom-resources.yaml
```

これで，以下のコマンドですべてのpodがrunningになる．
```bash
kubectl get pods --all-namespaces
```

これで，構築終了．<br/>
テストでデプロイして正常に動くことを確認するといいと思われる．


## おまけ
### containerd+flannelの環境構築に失敗した
初めにcontainerd+flannelの環境で構築していたが，自分では解決できなかった．<br/>
cgroupの設定を合わせたり，logを見たりしたが，解決には至らなかった．<br/>
症状としては，vm起動後数分は正常に動くが，途中で「kube-controller-manager」が落ちて「kube-apiserver」が落ちて，他のpodも落ちたり復活したりした後にapiserverが完全に止まった．<br/>
いつかリベンジしたい．

## 参考文献
各公式ドキュメント以外に，以下のサイトを参考にさせていただきました．
- [kubeadmでk8sクラスタを構築CRI-O編](https://qiita.com/murata-tomohide/items/cd408dbed0211fedf5dc)
- [おうちクラウドにkubernetes環境を構築](https://qiita.com/Nats72/items/60a4dbb0ebaad967d88d)
