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
[zappix](https://pypi.org/project/zappix/)を使用した．
ドキュメント通り，`pip install zappix`で入れられる．  
.envファイルからZabbixサーバのIPアドレスを読んでいる．  

### サンプルコード？
<div class="gatsby-code-title">
  <span>aiueo</span>
</div>

```python
import datetime, re, serial, io, os
from zappix.sender import Sender
from dotenv import load_dotenv

class ZABBIX:
    def __init__(self, server="127.0.0.1", host="Zabbix server", port=10051):
        self.server = server
        self.host = host
        self.port = port
        self.sender = Sender(server=self.server, port=self.port)
    
    def send(self, key, value):
        self.sender.send_value(self.host, key, value)
        
class UDCO2S:
    def __init__(self, dev="/dev/ttyACM0"):
        self.dev = dev
        self.zabbix = ZABBIX(server=os.environ['ZABBIX_SERVER'], host="CO2_Sensor")

    def start_logging(self):
        regex = re.compile(r'CO2=(?P<co2>\d+),HUM=(?P<hum>\d+\.\d+),TMP=(?P<tmp>-?\d+\.\d+)')
        with serial.Serial(self.dev, 115200, timeout=6) as conn:
            conn.write("STA\r\n".encode())
            print(conn.readline().decode().strip())
            loop_count = 0
            while True:
                line = conn.readline().decode().strip()
                m = regex.match(line)
                if loop_count % 10 == 0:
                    self.zabbix.send("co2", m.group("co2"))
                    self.zabbix.send("hum", m.group("hum"))
                    self.zabbix.send("tmp", m.group("tmp"))
                loop_count += 1
                # print([datetime.datetime.now().strftime("%Y-%m-%d") ,datetime.datetime.now().strftime("%H:%M:%S"), m.group("co2"), m.group("hum"), m.group("tmp")])
            conn.write("STP\r\n")

if __name__ == "__main__":
    load_dotenv()
    UDCO2S(dev="COM3").start_logging()
```
