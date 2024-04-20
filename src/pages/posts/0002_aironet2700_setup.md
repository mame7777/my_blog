---
title: 'Aironetのセットアップ'
summary: '初心者がGUIとCUIを使いながらぼちぼち'
description: '初心者がGUIとCUIを使いながらぼちぼち'
date: '2023-10-30'
slug: 'aironet2700-setup'
hero_image: '../../images/0002/aironet.jpg'
---

## はじめに
我が家に来てしばらく放置されていたCisco Aironet 2700iを使い始めることにした．  
自立型であるAutunomous AP IOS Softwareを入れた．  
Versionは15.3.3-JPOである．  
ファームウェアのアップデートは[こちらのサイト](https://maeda577.github.io/2021/07/31/2600i.html)が詳しく，この通りに実行したため省略．  

## Configを作っていく
### GUIによる設定
まずは，大枠をGUIで設定していく．
[こちらのサイト](https://zazameta.net/archives/4279)が詳しく，この通りに実行したため省略．  
そのため，詳しい部分を省略.  
ただ，一箇所，IOSのバグ？でGUIによる設定ができなかったため，CUIを使用した．  
設定できなかったのは以下の箇所．  
- [Guest Mode/Infrastructure SSID Settings]の項目
- [Encryption Manager]内の[Encryption Modes]の項目

### CUIによる設定
以下の部分追加した．
```
dot11 ssid <SSID>
  authentication key-management wpa version 2
  guest-mode
exit

interface Dot11Radio 0
  encryption vlan 10 mode ciphers aes-ccm
  ssid <SSID>
  no shutdown
exit

interface Dot11Radio 1
  encryption vlan 10 mode ciphers aes-ccm
  ssid <SSID>
  no shutdown
exit
```