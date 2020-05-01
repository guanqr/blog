+++
title = "基于 ESP8266 模块的 MicroPython 入门操作"
date = "2020-05-01T14:34:04+08:00"
tags = ["network","python"]
dropCap = false
+++

![esp8266-0.jpg](/images/esp8266-0.jpg "ESP8266 模块")

前些日子老师给每位同学邮寄了一个 ESP8266 模块，要求根据春学期学习的嵌入式系统课程进行一些小型实验。本次实验提前准备的文件和相关软件有：

+ esp8266-20180511-v1.9.4.bin
+ Flash Download Tools
+ MicroPython File Uploader
+ uPyLoader
+ WebREPL

## 烧写 MicroPython 固件

首先将 ESP8266 模块接入计算机，使用 Flash Download Tools 烧写 ESP8266 固件，这里需要注意软件中的一些参数设定和通信端口的选择。

![esp8266-1.png](/images/esp8266-1.png "选择使用 ESP8266 烧写工具")

![esp8266-2.png](/images/esp8266-2.png "注意参数设定和通信端口的选择")

![esp8266-3.png](/images/esp8266-3.png "烧写完成")

接着运行 MicroPython File Uploader， 选择正确的端口，点击「Open」，出现下图表示烧写成功。

![esp8266-4.png](/images/esp8266-4.png "烧写成功")

然后运行 uPyLoader，操作界面左侧列表为本地文件，右侧列表为实验模块上的文件。操作界面中上部显示的是 WiFi 连接，我们需要进行串口连接，点击刷新按钮，就可以显示选择串口连接的选项。然后点击「Connect」，窗口左上角显示已连接的状态，表示可以进行文件传送。在这一步操作中，如果点击刷新按钮，仍未显示串口连接的选项，可能是因为此前运行 MicroPython File Uploader 结束后未关闭软件，需要关闭后再操作。连接成功后如果弹出报错窗口，无法进行文件传输，可以尝试点击 「File」中的「Init transfer files」进行传输的初始化。

![esp8266-5.png](/images/esp8266-5.png "使用 uPyLoader 连接 ESP8266 模块")

## 配置无线网络连接

ESP8266 模块既可以作为服务器（AP），也可以作为客户端（STA）使用。以手机作为热点，模块工作在客户端模式下，计算机无线网卡和模块同时连接手机热点后，处于同一网段中，就可以方便地通过 WebREPL 进行无线连接，进而进行文件收发和程序调试。

将下面的程序保存为 `main.py` 文件，利用 uPyLoader 上传到模块，然后使用 MicroPython File Uploader 启动运行程序，即可进行手机热点连接。

```python
import network

sta_if = network.WLAN(network.STA_IF)
if not sta_if.isconnected():
    print('connecting to network...')
    sta_if.active(True)
    sta_if.connect('<ap_name>', '<password>') # 手机热点的 SID 和密码
    while not sta_if.isconnected():
        pass
print('network config:', sta_if.ifconfig())
```

![esp8266-6.png](/images/esp8266-6.png "显示网络连接的 IP 地址")

## 使用 WebREPL 远程连接

WebREPL 客户端功能很强大，通过网页的方式读取 ESP8266 的文件系统，可以上传文件或者下载开发板
中已存在的文件，可以输入指令并实时查看开发板的输出状态。WebREPL 在固件中默认是不启动的，在使用之前，需要先将服务打开。在 MicroPython File Uploader 输入命令：

```python
import webrepl_setup
```

得到如下界面，输入 `E` 确认在 boot 中开启 WebREPL，然后设置 4-6 位的密码，根据提示重启系统。

![esp8266-7.png](/images/esp8266-7.png "配置 WebREPL")

然后输入下面两行代码：

```python
import webrepl
webrepl.start()
```
就能够开启 WebREPL 了。如果想要配置自动开启服务，则将上述代码添加至 `.py` 文件，开机启动即可。

![esp8266-8.png](/images/esp8266-8.png "成功开启 WebREPL")

这里我出现了一个比较坑的问题，如果我关机后再次连接启动，WebREPL 服务并不会自动启动，目前该问题还未解决。

下面使用 WebREPL 客户端连接 ESP8266。打开客户端中的 `webrepl.html`（或者进入 <http://micropython.org/webrepl/>），修改 IP 地址为你的 ESP8266 IP 地址，根据控制台输出可知，我的 IP 地址为 <ws://192.168.43.119:8266>，点击连接，输入密码，连接成功。

![esp8266-9.png](/images/esp8266-9.png "登录 WebREPL 客户端")

## 实验操作

### LED 闪烁

在 WebREPL 客户端输入下面的代码：

```python
from machine import Pin
import time
def blink(led):
    L1 = Pin(led, Pin.OUT)
    L1.value(1)
        while True:
            L1.value(L1.value()^1)
            time.sleep(1)
blink(2)
```

可以看到 D2 的 LED 灯不断闪烁：

![esp8266-10.gif](/images/esp8266-10.gif "LED 灯闪烁")

以上程序执行 `Ctrl + C` 中断后，程序停在解释执行断点位置，为了不影响程序后台执行，可以使用 Time 定时器中断，修改程序如下：

```python
from machine import Pin, Timer
tim = Timer(-1)
L1 = Pin(2, Pin.OUT)
tim.init(period = 2000, mode=Timer.PERIODIC, callback=lambda t:L1.value(L1.value()^1))
```