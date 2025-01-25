---
title: 'Argo Workflowを試してみる'
summary: 'お試し構築をした際の備忘録'
description: 'k8sクラスタ上にArgo Workflowを構築してみる'
date: '2025-01-26'
slug: '0017-argo-workflow-setup'
hero_image: '../../images/posts/0017/argo-workflow-logo.jpg'
---

検証がてらArgo Workflowを試してみることにしたので，その備忘録を残しておく．

## Argo Workflowとは
いい感じにジョブを管理してくれるツール．
（[公式サイト](https://argoproj.github.io/workflows/)や他のサイトを参照してください...）

## 構築環境
- kubernetes: v1.32
- helm: v3.17.0
- Argo Workflow: v3.6.2

## 構築手順
### 1. helmのリポジトリ追加
```bash
helm repo add argo https://argoproj.github.io/argo-helm
```

### 2. Argo Workflowのインストール
```bash
kubectl create namespace argo
helm install --namespace argo argo-workflow argo/argo-workflows
```

### 3. Argo Workflowのweb UIを他のマシンからアクセスする
本当はロードバランサとかいろいろあるハズだが，とりあえずポートフォワーディングでアクセスする．
```bash
kubectl -n argo port-forward svc/argo-workflow-argo-workflows-server 2746:2746 --address='0.0.0.0'
```
ブラウザで，`http://<ip>:2746`にアクセスする．

ここで，login画面が表示される．

### 4. webUIのlogin用tokenを発行
一行めのコマンドで「argo-workflows-server」のpod名を取得し，二行めでtokenを取得する．
```bash
kubectl get pods -n argo
kubectl exec -it <pod名> -n argo -- argo auth token
（tokenが表示される）
```
表示されたtokenを全てコピーし，login画面中央のテキストボックスへ貼り付けログイン．

### 5. workflowの実行
コマンドでworkflowを実行してみる．
```bash
argo submit -n argo https://raw.githubusercontent.com/argoproj/argo-workflows/master/examples/hello-world.yaml
```

自分の環境では，`argo list`で表示すると以下のエラーが出た
```
Error (exit code 64): workflowtaskresults.argoproj.io is forbidden: User "system:serviceaccount:argo:default" cannot create resource "workflowtaskresults" in API group "argoproj.io" in the namespace "argo"
```

権限まわりのエラーだが，自分の知識ではすぐに解決できなかったので，今回はChatGPT先生の提案方法を実行した．<br/>
一応動作は確認できたが，自己責任で．<br/>
以下の内容のyamlファイルを作成し，`kubectl apply -f <ファイル名>`で適用する．
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: argo-default-clusterrolebinding
subjects:
- kind: ServiceAccount
  name: default
  namespace: argo
roleRef:
  kind: ClusterRole
  name: argo-workflow-argo-workflows-workflow-controller
  apiGroup: rbac.authorization.k8s.io
```

以上，こんな感じで構築できたので，これからいろいろ試してみる．


## 参考にさせていただいたサイト
- [Argo WorkflowをKubernetesにインストールして、ワークフローを作成する](https://zenn.dev/ring_belle/articles/argocd-workflow-getting-started)
- [OKE + Argo Workflows ことはじめ](https://qiita.com/cyberblack28/items/61236ef5a1253fabac28)