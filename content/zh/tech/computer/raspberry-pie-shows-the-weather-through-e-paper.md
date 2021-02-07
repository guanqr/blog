+++
title = "树莓派利用水墨屏显示实时天气状况"
date = "2020-07-08T18:17:53+08:00"
lastmod = "2020-07-09T18:17:53+08:00"
tags = ["design-contest","python","raspberry-pi"]
dropCap = false
displayExpiredTip = true
+++

![raspberry-pie-and-e-paper.jpg](/images/raspberry-pie-and-e-paper.jpg)

## 前言

一直想给自己的树莓派配一个屏幕，不是用于显示系统桌面，而是用于设计一些可以显示信息的程序。普通的屏幕不够有特色，不够新颖，因此我购买了微雪的一款 2.7 英寸三色水墨屏。这一款水墨屏和树莓派差不多大小，可以直接固定在树莓派上。

微雪在官方的树莓派例程中提供了写好的绘图、字符显示、图像显示的函数，我们直接使用这些函数即可，下面是官方例程的代码仓库：

{{< github name="waveshare / e-Paper" link="https://github.com/waveshare/e-Paper" description="Jetson Nano、Raspberry Pi、Arduino、STM32 例程" color="#555555" language="C" >}}

三色水墨屏可以显示黑、白、红三种颜色，我选择购买三色正是因为三色比双色能够传达更多的信息。不过通过测试，我发现如果要显示三种颜色的话，屏幕刷新率要比显示双色慢得多，所以在程序开发的时候，我选择了双色显示。

## 获取天气信息

天气信息我使用的是「[心知天气](https://www.seniverse.com/)」的 API 接口。对于 API 接口的使用，在[官方文档](https://docs.seniverse.com/api/start/start.html)中有详细的说明。当然，我使用的是免费版的服务，因此获取到的信息只有天气和温度：

> 获取指定城市的天气实况。付费用户可获取全部数据，免费用户只返回天气现象文字、代码和气温 3 项数据。注：中国城市暂不支持云量和露点温度。

首先在「心知天气」的控制台中获取到你申请的应用的私钥，即为下面代码 `key` 的值，代码中 `location` 是你想要获取信息的城市拼音，这里我选择的是杭州。

```python
import requests

location = "hangzhou"
key = "YOUR_KEY"
url = "https://api.seniverse.com/v3/weather/now.json?key=" + key + "&location=" + location + "&language=zh-Hans&unit=c"

weaData = requests.get(url)
```

然后我们通过 `weaData.json()` 即可获取到返回的信息：

```python
{
    'results':
    [{
        'location':
        {
            'id': 'WTMKQ069CCJ7',
            'name': '杭州',
            'country': 'CN',
            'path': '杭州,杭州,浙江,中国',
            'timezone': 'Asia/Shanghai',
            'timezone_offset': '+08:00'
        },
        'now':
        {
            'text': '小雨',
            'code': '13',
            'temperature': '27'
        },
        'last_update': '2020-07-09T19:24:00+08:00'
    }]
}
```

我想要的是城市名字、天气、温度这三个信息，因此有：

```python
cityName = weaData.json()['results'][0]['location']['name'] # city
cityWea = weaData.json()['results'][0]['now']['text'] # weather
cityTemp = weaData.json()['results'][0]['now']['temperature'] + '°C' # temp
```

至此，我们已经获取到了指定城市的天气信息。

## 文字显示

文字显示功能，由于微雪官方的例程已经提供了很方便的函数，直接使用这些函数即可。这里我没有使用绘图的函数，只是用了显示文本的函数，即 `draw.text()` 函数。

```python
import sys
import os
picdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'pic')
libdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)

import logging
from waveshare_epd import epd2in7
import time
from PIL import Image,ImageDraw,ImageFont
import traceback

epd = epd2in7.EPD()
epd.init()
epd.Clear(0xFF)

font36 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 36)
font84 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 84)

Himage = Image.new('1', (epd.height, epd.width), 255)
draw = ImageDraw.Draw(Himage)

draw.text((10, 10), cityName, font = font36, fill = 0)
draw.text((90, 10), cityWea, font = font36, fill = 0)
draw.text((10, 50), cityTemp, font = font84, fill = 0)

epd.display(epd.getbuffer(Himage))
```

此外，为了显示获取天气信息的时间，我还添加了一行信息：

```python
from datetime import datetime

font16 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 16)

dayTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
draw.text((10, 150), u'更新时间：', font = font16, fill = 0)
draw.text((100, 150), dayTime, font = font16, fill = 0)
```

## 按键控制

我购买的水墨屏模块上还有四个按键，因此我想，可以通过按键切换城市，从而能够显示不同城市的天气信息。通过观察，我发现四个按键对应 BCM 编码的引脚号为 5、6、13、19。

![raspberry-pie-pins.png](/images/raspberry-pie-pins.png "树莓派引脚对照表")

因此有：

```python
import RPi.GPIO

button1 = 5
button2 = 6
button3 = 13
button4 = 19

RPi.GPIO.setmode(RPi.GPIO.BCM)
RPi.GPIO.setup(button1, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
RPi.GPIO.setup(button2, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
RPi.GPIO.setup(button3, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
RPi.GPIO.setup(button4, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
```

实现切换城市，可以考虑将不同城市的名称存放在一个数组中，通过按键选择数组中指定位的数据。这里我以杭州、北京
天津、上海四个城市为例：

```python
Lct = ['hangzhou','beijing','tianjin','shanghai']
lct = Lct[0]
c = 0

if RPi.GPIO.input(button1) == 0:
    time.sleep(0.1)
    if RPi.GPIO.input(button1) == 0:
        c = c - 1
        if c < 0:
            c = 3
        lct = Lct[c]
if RPi.GPIO.input(button2) == 0:
    time.sleep(0.1)
    if RPi.GPIO.input(button2) == 0:
        c = c + 1
        if c >= 4:
            c = 0
        lct = Lct[c]
```

这里间隔 0.1s 重复确认一次按键是否按下，是为了防抖动，经过测试，我发现如果不增加防抖动，那么按下按钮一次会返回多次信息。

当然，为了让程序能够在任意时刻切换城市，我们需要设定一个循环。综合上述分析，下面给出我的完整程序。

```python
#!/usr/bin/python
# -*- coding:utf-8 -*-

import sys
import os
picdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'pic')
libdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)

import logging
from waveshare_epd import epd2in7
import time
from PIL import Image,ImageDraw,ImageFont
import traceback

# custom
from datetime import datetime
import requests
import RPi.GPIO

button1 = 5
button2 = 6
button3 = 13
button4 = 19

RPi.GPIO.setmode(RPi.GPIO.BCM)
RPi.GPIO.setup(button1, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
RPi.GPIO.setup(button2, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
RPi.GPIO.setup(button3, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)
RPi.GPIO.setup(button4, RPi.GPIO.IN, pull_up_down=RPi.GPIO.PUD_UP)

epd = epd2in7.EPD()
    
epd.init()
epd.Clear(0xFF)
    
font24 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 24)
font16 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 16)
font36 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 36)
font84 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 84)

# Location
Lct = ['hangzhou','beijing','tianjin','shanghai']
lct = Lct[0]
c = 0

def refreshWeather():
    Himage = Image.new('1', (epd.height, epd.width), 255)  # 255: clear the frame
    draw = ImageDraw.Draw(Himage)
    
    key = "YOUR_KEY"
    url = "https://api.seniverse.com/v3/weather/now.json?key=" + key + "&location=" + lct + "&language=zh-Hans&unit=c"
    
    weaData = requests.get(url)
    cityName = weaData.json()['results'][0]['location']['name'] # city
    cityWea = weaData.json()['results'][0]['now']['text'] # weather
    cityTemp = weaData.json()['results'][0]['now']['temperature'] + '°C' # temp
    
    draw.text((10, 10), cityName, font = font36, fill = 0)
    draw.text((90, 10), cityWea, font = font36, fill = 0)
    draw.text((10, 50), cityTemp, font = font84, fill = 0)
    
    # show the refresh date
    dayTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    draw.text((10, 150), u'更新时间：', font = font16, fill = 0)
    draw.text((100, 150), dayTime, font = font16, fill = 0)
    
    epd.display(epd.getbuffer(Himage))

try:
    refreshWeather()
    while True:
        if RPi.GPIO.input(button1) == 0:
            time.sleep(0.1)
            if RPi.GPIO.input(button1) == 0:
                c = c - 1
                if c < 0:
                    c = 3
                lct = Lct[c]
                refreshWeather()
        if RPi.GPIO.input(button2) == 0:
            time.sleep(0.1)
            if RPi.GPIO.input(button2) == 0:
                c = c + 1
                if c >= 4:
                    c = 0
                lct = Lct[c]
                refreshWeather()
        if RPi.GPIO.input(button3) == 0:
            epd.Clear(0xFF)
        if RPi.GPIO.input(button4) == 0:
            time.sleep(0.1)
            if RPi.GPIO.input(button4) == 0:
                epd2in7.epdconfig.module_exit()
                exit()
    
except IOError as e:
    logging.info(e)
    
except KeyboardInterrupt:    
    logging.info("ctrl + c:")
    epd2in7.epdconfig.module_exit()
    exit()
```