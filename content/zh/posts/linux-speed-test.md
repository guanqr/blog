+++
title = "使用 Linux 服务器检测脚本工具测试性能"
date = "2019-04-14T16:05:26+08:00"
tags = ["Linux"]
categories = ["study","computer"]
displayCopyright = true
gitinfo = true
+++

## Superbench.sh

这个脚本可以实现服务器的配置信息，在线率，以及 IO 硬盘读写和服务器的国内节点下载测速。

```
wget -qO- git.io/superbench.sh | bash
```

## ZBench-CN.sh

可以测试国内、国外随机节点的下载速度，其他基本与上述方法一致。

```
wget -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/ZBench/master/ZBench-CN.sh && bash ZBench-CN.sh
```

## Bench.sh

```
yum -y install wget && wget -qO- bench.sh | bash
```

## Unixbench.sh

UnixBench 跑分测试可以作为参考，但是不能作为唯一测试工具。因为有些时候确实分数低，但是实际性能是可以的。

```
wget --no-check-certificate https://github.com/teddysun/across/raw/master/unixbench.sh
chmod +x unixbench.sh
./unixbench.sh
```

## Ping 速度对比

1. <http://ping.chinaz.com/>
2. <http://www.webkaka.com/Ping.aspx>

Ping 工具可以检测到较多国内和国外节点的 Ping 速度，在一定程度上 Ping 速度也是比较重要的，可以看到服务器的丢包情况，以及速度。

## 路由追踪测试

可以看到服务器 IP 节点的走向

1. <http://www.webkaka.com/Tracert.aspx>
2. <https://www.ipip.net/traceroute.php>

## 回程线路测试随机节点

可以测试国内随机节点中的回程参数。

```
wget https://raw.githubusercontent.com/helloxz/mping/master/mping.sh
bash mping.sh
```

## 点对点测速下载

用 speedtest-cli 工具进行定向节点进行下载速度的测试。

```
wget https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py
mv speedtest.py /usr/local/bin/speedtest-cli
chmod +x /usr/local/bin/speedtest-cli
speedtest-cli --server=4870 --share
```

