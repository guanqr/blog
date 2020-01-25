+++
title = "Linux 安装 Denyhosts 与修改服务器端口"
date = "2019-04-05T16:13:00+08:00"
tags = ["linux","security"]
toc = true
+++

![denyhosts.png](/images/denyhosts.png)

此前用 WordPress 做网站的时候，租了一个 Vultr 服务器，通过 Xshell 远程登录终端后，系统发出警告，提示在此次成功登录前有 xxxx 次登录失败的记录，并且发现是某一个固定的 IP 地址在不断的尝试登陆。在网上找了许多有关这种问题的解决方法，基本都是通过利用 hosts.deny 文件屏蔽此 IP 地址即可。除此之外，为了安全起见，最好在租好新的服务器后修改默认端口。

Denyhosts 是一个以 Python2.3 编写的程序，它主要根据系统日志文件 `/var/log/secure` 文件分析，当发现同一 IP 在进行多次 SSH 密码尝试时就会记录 IP 到 `/etc/hosts.deny` 文件，从而达到自动屏蔽该 IP 的目的。下面总结一下 Denyhosts 的安装方法[^1]。

## 检查安装环境

首先判断系统安装的 sshd 是否支持 tcp_wrappers（默认都支持），如果有输出：`libwrap.so.0 => /lib64/libwrap.so.0` 则为支持，命令如下

```
ldd /usr/sbin/sshd |grep libwrap.so.0
```

其次判断是否有 Python（CentOS 默认都有）,只要系统 Python 版本不小于 2.3 版本即可。

```
python -V
```

## 安装 Denyhosts

### 下载

下载 DenyHosts-2.6.tar.gz 并上传到服务器，可以从[这里](http://denyhosts.sourceforge.net/)下载。

### 安装

解压文件：

```
tar -zxvf DenyHosts-2.6.tar.gz
```

开始安装：

```
cd DenyHosts-2.6
python setup.py install
```

注：程序脚本自动安装在 `/usr/share/denyhosts/` 目录下；库文件安装在 `/usr/lib/python2.6/site-packages/DenyHosts/` 目录下；denyhosts.py 默认安装在 `/usr/bin/` 目录下。

### 设置启动脚本

```
cd /usr/share/denyhosts/
cp daemon-control-dist daemon-control
chown root daemon-control
chmod 700 daemon-control
```

将 denyhosts.cfg-dist 中不是以 `#` 开头的行，写入 denyhosts.cfg 文件

```
grep -v "^#" denyhosts.cfg-dist > denyhosts.cfg
```

编辑 denyhosts.cfg

```
vi denyhosts.cfg
```

具体配置项可参考以下的配置

```
############ THESE SETTINGS ARE REQUIRED ############
            ##分析源文件
            SECURE_LOG = /var/log/secure
            ##禁止sshd登陆的IP存放文件
            HOSTS_DENY = /etc/hosts.deny
            
            ##过多久后清除已经禁止的IP
            PURGE_DENY =  1d
            
            
            ##监控的服务名
            BLOCK_SERVICE  = sshd
            
            ##表示允许无效用户登录失败的次数
            DENY_THRESHOLD_INVALID = 3
            
            ##表示允许普通用户登录失败的次数
            DENY_THRESHOLD_VALID = 3
            
            ##表示允许root用户登录失败的次数
            DENY_THRESHOLD_ROOT = 3
            
            
            DENY_THRESHOLD_RESTRICTED = 1
            
            
            WORK_DIR = /usr/share/denyhosts/data
            
            SUSPICIOUS_LOGIN_REPORT_ALLOWED_HOSTS=YES
            
            ##是否做域名反解
            HOSTNAME_LOOKUP=NO
            
            
            LOCK_FILE = /var/lock/subsys/denyhosts
```

### 添加到系统服务

将 Denyhosts 添加到系统服务并自动启动

修改自启动文件：

```
vi /etc/rc.local
```

在末尾添加以下行：

```
/usr/share/denyhosts/daemon-control start
```

添加至系统服务：
   
```
ln -s /usr/share/denyhosts/daemon-control /etc/init.d/denyhosts
chkconfig --add denyhosts
chkconfig --level 345 denyhosts on
```

### 启动 Denyhosts

```
service denyhosts start
```

### 查看 Denyhosts 是否运行成功

```
service denyhosts status
```

显示：DenyHosts is running with pid = XXXX，即运行成功

至此，Denyhosts 也就配置完成了；此外将 sshd 的默认端口修改掉，再结合 Denyhosts 可以防止大部分 sshd 的暴力破解了。

## 修改 sshd 默认端口

### 编辑配置文件

```
vi /etc/ssh/sshd_config
```

默认端口是 `22`，并且已经被注释掉了

### 修改端口号

在 `#Port 22` 这里将 `#` 删除，修改 `22` 为其他数字，如 `1234`。第一次设置最好先保留 `22` 端口，即将 `#` 删除，在 `Port 22` 下添加一行 `Port 1234`，等完全设置  好后再将其注释掉。

```
Port 22
Port 1234
```

### 在防火墙上放开端口

首先添加端口到防火墙：

```
firewall-cmd --zone=public --add-port=1234/tcp --permanent
```

`permanent` 是保存配置，不然下次重启以后这次修改无效

然后重启防火墙：

```
firewall-cmd --reload
```

查看添加端口是否成功，如果添加成功则会显示 `yes`，否则 `no`：

```
firewall-cmd --zone=public --query-port=1234/tcp
```

### 检查端口是否已经开放

```
iptables -nL --line-number
```

### 重启 sshd 服务

如果断开此终端了重连需要修改端口

```
systemctl restart sshd.service
```

[^1]: 参考：[Linux 防止 sshd 被爆破（安装 Denyhosts）| 一葉知秋](https://www.cnblogs.com/rwxwsblog/p/4590608.html)