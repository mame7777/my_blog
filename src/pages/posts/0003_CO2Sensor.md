---
title: 'CO2センサの値をzabbixに送る'
description: '言語：python'
date: '2023-10-31'
slug: 'co2sensor-to-zabbix'
hero_image: '../../images/0003/sensor.jpg'
---

## 使ったマイコン・センサ
マイコンはM5 Stack atom Lite，センサはIODATAのUD-CO2Sという使った．  
1万円ぐらいするセンサを積みながらも2,3千円程度で投げ売りされ，シリアル通信で値を取得できることから多くの先駆者がいるセンサ．  
温度と湿度も値が取れるが，あくまで補正用といった感じらしい．

## コードの流れ
### CO2センサから値を取得する
以下のコードをほぼほぼ拝借した．
参考：[udco2s.py](https://gist.github.com/oquno/d07f6dbf8cc760f2534d9914efe79801)  


### Zabbixに送る
以下のサイトが詳しいので，そちらを参考にした．  
参考：[ESP32 で Zabbix にデータを送ってみる](https://qiita.com/nanbuwks/items/296f25b71148f7a28ab6)  

### サンプルコード？
```
#include <M5StickC.h>
#include <WiFi.h>
#include <M5_ENV.h>
#include <ESP32ZabbixSender.h>

#define SERVERADDR XXX, XXX, XXX,  XXX 
#define ZABBIXPORT 10051
#define ZABBIXHOST "M5-env-sensor"

M5StickC m5c;
SHT3X sht30;
QMP6988 qmp6988;

float tmp      = 0.0;
float hum      = 0.0;
float pressure = 0.0;

ESP32ZabbixSender zabbixSender;

void setup() {
  m5c.begin(false, true, false);  // 初期化する
  Wire.begin(26, 32);  // Initialize pin 26,32.
  qmp6988.init();
  Serial.println("Connecting to WiFi");
  WiFi.begin();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  zabbixSender.Init(IPAddress(SERVERADDR), ZABBIXPORT, ZABBIXHOST); // Init zabbix server information
}

void loop() {
  pressure = qmp6988.calcPressure();
  if (sht30.get() == 0) {  // Obtain the data of shT30.
          tmp = sht30.cTemp;   // Store the temperature obtained from shT30.
          hum = sht30.humidity;  // Store the humidity obtained from the SHT30.
      } else {
          tmp = 0, hum = 0;
      }
  Serial.printf(
      "Temp: %2.1f  \r\nHumi: %2.0f%%  \r\nPressure:%2.0fPa\r\n---\n", tmp,
      hum, pressure);

  zabbixSender.ClearItem(); // Clear item list
  zabbixSender.AddItem("temperature", tmp);
  zabbixSender.AddItem("humidity", hum);
  zabbixSender.AddItem("pressure", pressure/100);
  zabbixSender.Send();
  delay(30000);
}
```
