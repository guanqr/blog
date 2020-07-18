+++
title = "通过网页控制 ESP8266 模块 LED"
date = "2020-06-19T14:08:17+08:00"
tags = ["internet-of-things","network"]
series = ["major-courses"]
dropCap = false
+++

## 前言

嵌入式系统课程的期末设计项目是基于 ESP8266 模块的，在上个月月初的时候，我写了一篇《[基于 ESP8266 模块的 MicroPython 入门操作](/tech/computer/esp8266-the-internet-of-things/)》，当时还没对 ESP8266 模块进行深入探索。因为在课程中老师没有讲解过关于 ESP8266 模块的开发，期末设计需要完全依靠我们自己进行摸索，而且悲剧的是，我并没有杜邦线、面包板、传感器等基本元器件，所以仅凭一块小板子进行物联网相关功能的开发有些困难。不过好在期末设计可以从以下几项中任选一项或多项做：

+ 利用模块的 AD 通道，设计对外部信号进行模拟量采集；
+ 利用模块的 IO 口，设计对 1-wire 总线传感器采集数据；
+ 编制一个网页，在网页上对采集到的信号输出显示；
+ 编制一个网页，通过该网页控制 LED 灯的工作状态；
+ 将采集到的信号传送到手机上，建议使用 MQTT 协议；
+ 通过手机控制 LED 灯的状态，建议使用 MQTT 协议；
+ 在云端建立数据模型和服务，对物联数据进行分析；
+ 用其他方式（如 aduino）搭建物联系统和编程。

在使用 WebREPL 终端进行编程或者默认上传 Python 脚本的方式进行编程和程序调试的话，存在一定的弊端。特别是在 WebREPL，最大的缺点是代码不能复制，需要逐行输入。这样一来，如果输入一个很长的循环语句，且存在代码缩进，最终提示执行错误的话，又需要花费很长的时间重新编写。在大一的「电子工程训练」课程中，我接触过 Arduino 的开发，基本的操作还未忘记。因此我就考虑使用 Arduino IDE 编程，编制一个网页，通过该网页控制 LED 灯的工作状态。Arduino IDE 需要使用 C/C++ 语言编程，因此就和 MicroPython 没有什么关系了。

## 正文

### 配置

首先在 Arduino 官网下载编译器。打开编译器后，点击菜单栏中的「文件」菜单，进入「首选项」设置。

![esp8266-11.png](/images/esp8266-11.png)

在附加开发板管理器网址汇总添加有关 ESP8266 的内容：

```
http://arduino.esp8266.com/stable/package_esp8266com_index.json>
```

然后进入「工具」菜单，在「开发板」中选择进入「开发板管理器」，搜索 `esp8266` 并下载安装。

![esp8266-12.png](/images/esp8266-12.png)

接着将开发板接入计算机。因为我是用的是 NodeMCU 开发板，所示在工具菜单中的「开发板」一栏选择的是 NodeMCU1.0(ESP-12E)，「端口」一栏选择开发板接入的端口，我这里是 COM3。

为了验证当前设置是否正确，可以在「文件」菜单的「示例」中找到有关 ESP8266 的例程，比如控制 LED 闪烁的 Blink 程序，编译上传，成功运行则证明设置正确。

![esp8266-13.png](/images/esp8266-13.png)

### 编程

首先编写一个简单的网页。设置两个超链接，一个控制 LED 点亮，链接跳转至 `/gpio/0`，一个控制 LED 熄灭，链接跳转至 `/gpio/1`。再添加一个状态显示区域，显示当前 LED 的亮灭情况，具体的网页画面如下图所示（图中遮盖了个人信息）。

![esp8266-14.png](/images/esp8266-14.png)

在程序中，需要将该网页存放进一个字符串中：

```c++
String s = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<!DOCTYPE HTML>\r\n<html>\r\n<p style='color:#666; font-size:40px; text-align:center;'>状态：";
s += "<head><meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"" /></head>";
s += (val)?"LED 已关闭</p>":"LED 已开启</p>";
s += "<p style='font-size:40px; text-align:center;'><a style='color:#666;' href='/gpio/0'>开启 LED</a></p><p style='font-size:40px; text-align:center;'><a style='color:#666;' href='/gpio/1'>关闭 LED</a></p><p style='color:#666; font-size:40px; text-align:center;'><NAME> <ID> 嵌入式系统与应用课程设计</p></html>\n";
```

程序的运行步骤是，先连接手机提供的热点，通过 ID 和密码进行连接，得到一个固定的 IP 地址。我们需要用这个 IP 地址来访问设计的网页。完整的程序如下所示，经编译测试，功能运行良好。

```c++
#include <ESP8266WiFi.h>

const char* ssid = "<SSID>"; // 替换为自己的热点 ID
const char* password = "<PASSWORD>"; // 替换为自己的热点密码
 
// Create an instance of the server
// specify the port to listen on as an argument
WiFiServer server(80);
 
void setup() {
    Serial.begin(9600);
    delay(10);

    // prepare GPIO2
    pinMode(2, OUTPUT);
    digitalWrite(2, 0);
 
    // Connect to WiFi network
    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);
    struct ip_info info;
        IP4_ADDR(&info.ip,192,168,43,119); //替换为自己的热点 IP
        IP4_ADDR(&info.gw,192,168,43,1); //替换为自己的热点网关 IP
        IP4_ADDR(&info.netmask,255,255,255,0);
        wifi_station_dhcpc_stop();
        wifi_set_ip_info(STATION_IF,&info); //设置 sta 模式的 IP
 
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");

    // Start the server
    server.begin();
    Serial.println("Server started @ ");

    // Print the IP address & instructions
    Serial.println(WiFi.localIP());
    Serial.println("To control GPIO, open your web browser.");
    Serial.println("To set GPIO 0 high, type:");
    Serial.print(WiFi.localIP());
    Serial.println("/gpio/1");
    Serial.println("To set GPIO 0 low, type:");
    Serial.print(WiFi.localIP());
    Serial.println("/gpio/0");
    Serial.println("To toggle GPIO 0, type:");
    Serial.print(WiFi.localIP());
    Serial.println("/gpio/0");
}

void loop() {
    // Check if a client has connected
    WiFiClient client = server.available();
    if (!client) {
        delay(100);
        return;
    }

    // Read the first line of the request
    String req = client.readStringUntil('\r');
    Serial.println(req);
    client.flush();

    // Match the request
    int val;
    if (req.indexOf("/gpio/0") != -1)
        val = 0;
    else if (req.indexOf("/gpio/1") != -1)
        val = 1;
    else if (req.indexOf("/gpio/4") != -1)
        val = (!digitalRead(0)); // <<<<< Edit: insert /gpio/3 lines after this line.
    else {
        Serial.println("invalid request");
        client.print("HTTP/1.1 404\r\n");
        client.stop();
        return;
    }

    // Set GPIO2 according to the request
    digitalWrite(2, val);
    client.flush();

    // Prepare the response
    String s = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<!DOCTYPE HTML>\r\n<html>\r\n<p style='color:#666; font-size:40px; text-align:center;'>状态：";
    s+="<head><meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"" /></head>";
    s += (val)?"LED 已关闭</p>":"LED 已开启</p>";
    s += "<p style='font-size:40px; text-align:center;'><a style='color:#666;' href='/gpio/0'>开启 LED</a></p><p style='font-size:40px; text-align:center;'><a style='color:#666;' href='/gpio/1'>关闭 LED</a></p><p style='color:#666; font-size:40px; text-align:center;'>GuanQirui 嵌入式系统与应用课程设计</p></html>\n";

    // Send the response to the client
    client.print(s);
    delay(1);  
    Serial.println("Client disonnected");

    // The client will actually be disconnected 
    // when the function returns and 'client' object is detroyed
} 
```
