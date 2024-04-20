---
title: 'M5Stack atomでのI2Cデバイスの読み取りエラー'
summary: 'i2cRead returned Error 263'
description: '「i2cRead returned Error 263」が発生した際のロラブルシュートを軽く書きました．'
date: '2023-10-29'
slug: 'm5stack-i2c-error'
hero_image: '../../images/0001/error_output.png'
---

## エラー内容
M5Stack atom liteで環境センサであるENV.IIIの値を読み取ろうとしたときに発生したエラー．  
以下にエラー文を示す．
```
[E][Wire.cpp:513] requestFrom(): i2cRead returned Error 263
```
開発環境は，VSCodeでplatformioを用いていた．  
  
## 解決方法
[こちら](https://scrapbox.io/atombabies/Espressif32%E3%81%AE%E6%96%B0%E3%81%97%E3%81%84%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%81%A7%E5%8B%95%E3%81%8B%E3%81%AA%E3%81%84%E5%95%8F%E9%A1%8C)を参考にさせていただいた．  
platform.iniファイル内記述の，`platform = espressif32`を以下のように変更する．  
`platform = espressif32@2.0.0`  
これで，とりあえずエラー解消して値を取得できるようになった．