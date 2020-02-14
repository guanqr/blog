+++
title = "抓取实时数据绘制疫情分布地图"
date = "2020-01-29T19:57:55+08:00"
tags = ["python"]
aliases = ["/study/computer/draw-the-map-of-2019-ncov-epidemic-distribution/"]
toc = false
original = false
author = "天元浪子"
link = "https://blog.csdn.net/xufive/article/details/104093197"
copyright = "原文采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 许可协议，内容结合个人情况有删改。"
+++

最近 2019-nCoV 疫情形势严峻，封路封小区，人们不得不待在家里防止感染病毒。目前网络上有几个平台提供了疫情实时追踪服务，比如「丁香医生」以及「腾讯新闻」。在闲逛某个论坛的时候，我见到一些人在讨论借助这些平台的数据接口进行个人的数据统计。然后就看到了一篇文章，讲述如何利用 Python 绘制这次的疫情地图，方法比较简单也很有趣，反正在家闲着也是闲着，就照着这篇文章试了一试，效果还不错。于是，我就将这篇文章搬运过来了。

## 数据下载

数据源擦偶用腾讯的[疫情实时追踪](https://news.qq.com/zt2020/page/feiyan.htm?from=timeline&isappinstalled=0)。以 Chrome 浏览器为例，查看加载项，可以看到一个应答类型为 `json` 格式的请求包含我们需要的数据。

![draw-the-map-of-2019-ncov-epidemic-distribution-0.png](/images/draw-the-map-of-2019-ncov-epidemic-distribution-0.png)

深入分析，我们就得到了 URL 地址、请求方法、参数、应答格式等信息。查询参数中，`callback` 是回调函数名，我们可以尝试置空，`_` 应该是以毫秒为单位的当前时间戳。有了这些信息，分分钟就可以抓到数据了。我们先在 IDLE 中以交互方式抓一下看看效果：

```python
>>> import time, json, requests
>>> url = 'https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts&callback=&_=%d'%int(time.time()*1000)
>>> data = json.loads(requests.get(url=url).json()['data'])
>>> print(len(data))
359
>>> print(data[0])
{'country': '中国', 'area': '湖北', 'city': '武汉', 'confirm': 1905, 'suspect': 0, 'dead': 104, 'heal': 51}
>>> print(data[-1])
{'country': '中国', 'area': '广东', 'city': '江门', 'confirm': 1, 'suspect': 0, 'dead': 0, 'heal': 0}
```

## 数据处理

以省为单位画疫情图，我们只需要统计同属一个省的所有地市的确诊数据即可。最终的数据抓取代码如下：

```python
import time, json, requests

def catch_distribution():
    """抓取行政区域确诊分布数据"""
    
    data = dict()
    url = 'https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts&callback=&_=%d'%int(time.time()*1000)
    for item in json.loads(requests.get(url=url).json()['data']):
        if item['area'] not in data:
            data.update({item['area']:0})
        data[item['area']] += int(item['confirm'])
    
    return data
```

## 数据可视化

数据可视化可以使用 `malplotlib` 模块，`matplotlib` 有很多扩展工具包（toolkits），比如，画 3D 需要 `mplot3d` 工具包，画地图的话，则需要 `basemap` 工具包，以及处理地图投影的 `pyproj` 模块。另外画海陆分界线、国界线、行政分界线等还需要 `shape` 数据。所需模块请自行安装，`shape` 文件可以从[这里](https://github.com/dongli/china-shapefiles)下载，绘图用到的矢量字库可以从自己的电脑上随意挑选一个（这里我用的是 `SourceHanSerifCN-Regular.otf`）。我的主程序是 `map.py`，`shape` 文件下载下来之后解压到 `china-shapefiles-master`，我是这样保存的：

```cmd
2019nCoV
├─res
│  ├─china-shapefiles-master
│  └─SourceHanSerifCN-Regular.otf
└─map.py
```

以下为全部代码，除了疫情地图，还包括了全国每日肺炎确诊数据的下载和可视化。

```python
# -*- coding: utf-8 -*-

import time
import json
import requests
from datetime import datetime
import numpy as np
import matplotlib
import matplotlib.figure
from matplotlib.font_manager import FontProperties
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
from mpl_toolkits.basemap import Basemap
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

plt.rcParams['font.sans-serif'] = ['FangSong']  # 设置默认字体
plt.rcParams['axes.unicode_minus'] = False  # 解决保存图像时'-'显示为方块的问题

def catch_daily():
    """抓取每日确诊和死亡数据"""

    url = 'https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_cn_day_counts&callback=&_=%d'%int(time.time()*1000)
    data = json.loads(requests.get(url=url).json()['data'])
    data.sort(key=lambda x:x['date'])

    date_list = list() # 日期
    confirm_list = list() # 确诊
    suspect_list = list() # 疑似
    dead_list = list() # 死亡
    heal_list = list() # 治愈
    for item in data:
        month, day = item['date'].split('.')
        date_list.append(datetime.strptime('2020-%s-%s'%(month, day), '%Y-%m-%d'))
        confirm_list.append(int(item['confirm']))
        suspect_list.append(int(item['suspect']))
        dead_list.append(int(item['dead']))
        heal_list.append(int(item['heal']))

    return date_list, confirm_list, suspect_list, dead_list, heal_list

def catch_distribution():
    """抓取行政区域确诊分布数据"""

    data = {'西藏':0}
    url = 'https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts&callback=&_=%d'%int(time.time()*1000)
    for item in json.loads(requests.get(url=url).json()['data']):
        if item['area'] not in data:
            data.update({item['area']:0})
        data[item['area']] += int(item['confirm'])

    return data

def plot_daily():
    """绘制每日确诊和死亡数据"""

    date_list, confirm_list, suspect_list, dead_list, heal_list = catch_daily() # 获取数据

    plt.figure('2019-nCoV 疫情统计图表', facecolor='#f4f4f4', figsize=(10, 8))
    plt.title('2019-nCoV 疫情曲线', fontsize=20)

    plt.plot(date_list, confirm_list, label='确诊')
    plt.plot(date_list, suspect_list, label='疑似')
    plt.plot(date_list, dead_list, label='死亡')
    plt.plot(date_list, heal_list, label='治愈')

    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%m-%d')) # 格式化时间轴标注
    plt.gcf().autofmt_xdate() # 优化标注（自动倾斜）
    plt.grid(linestyle=':') # 显示网格
    plt.legend(loc='best') # 显示图例
    plt.rcParams['savefig.dpi'] = 300 #图片像素
    plt.rcParams['figure.dpi'] = 300 #分辨率
    plt.savefig('2019-nCoV 疫情曲线.png') # 保存为文件
    #plt.show()  

def plot_distribution():
    """绘制行政区域确诊分布数据"""

    data = catch_distribution()

    font = FontProperties(fname='res/SourceHanSerifCN-Regular.otf', size=14) # 自定义字体
    lat_min = 0
    lat_max = 60
    lon_min = 70
    lon_max = 140

    handles = [
            matplotlib.patches.Patch(color='#ffaa85', alpha=1, linewidth=0),
            matplotlib.patches.Patch(color='#ff7b69', alpha=1, linewidth=0),
            matplotlib.patches.Patch(color='#bf2121', alpha=1, linewidth=0),
            matplotlib.patches.Patch(color='#7f1818', alpha=1, linewidth=0),
]
    labels = [ '1-9人', '10-99人', '100-999人', '>1000人']

    fig = matplotlib.figure.Figure()
    fig.set_size_inches(10, 8) # 设置绘图板尺寸
    axes = fig.add_axes((0.1, 0.12, 0.8, 0.8)) # rect = l,b,w,h
    m = Basemap(llcrnrlon=lon_min, urcrnrlon=lon_max, llcrnrlat=lat_min, urcrnrlat=lat_max, resolution='l', ax=axes)
    m.readshapefile('res/china-shapefiles-master/china', 'province', drawbounds=True)
    m.readshapefile('res/china-shapefiles-master/china_nine_dotted_line', 'section', drawbounds=True)
    m.drawcoastlines(color='black') # 洲际线
    m.drawcountries(color='black')  # 国界线
    m.drawparallels(np.arange(lat_min,lat_max,10), labels=[1,0,0,0]) #画经度线
    m.drawmeridians(np.arange(lon_min,lon_max,10), labels=[0,0,0,1]) #画纬度线

    for info, shape in zip(m.province_info, m.province):
        pname = info['OWNER'].strip('\x00')
        fcname = info['FCNAME'].strip('\x00')
        if pname != fcname: # 不绘制海岛
            continue

        for key in data.keys():
            if key in pname:
                if data[key] == 0:
                    color = '#f0f0f0'
                elif data[key] < 10:
                    color = '#ffaa85'
                elif data[key] <100:
                    color = '#ff7b69'
                elif  data[key] < 1000:
                    color = '#bf2121'
                else:
                    color = '#7f1818'
                break

        poly = Polygon(shape, facecolor=color, edgecolor=color)
        axes.add_patch(poly)

    axes.legend(handles, labels, bbox_to_anchor=(0.5, -0.11), loc='lower center', ncol=4, prop=font)
    axes.set_title("2019-nCoV 疫情地图", fontproperties=font)
    FigureCanvasAgg(fig)
    plt.rcParams['savefig.dpi'] = 300 #图片像素
    plt.rcParams['figure.dpi'] = 300 #分辨率
    fig.savefig('2019-nCoV 疫情地图.png')

if __name__ == '__main__':
    plot_daily()
    plot_distribution()
```

疫情曲线:

![draw-the-map-of-2019-ncov-epidemic-distribution-1.png](/images/draw-the-map-of-2019-ncov-epidemic-distribution-1.png "疫情曲线")

疫情地图：

![draw-the-map-of-2019-ncov-epidemic-distribution-2.png](/images/draw-the-map-of-2019-ncov-epidemic-distribution-2.png "圆柱投影疫情地图")

上图为圆柱投影，这也是 `basemap` 默认的投影模式，我们还可以换用其他投影模式，比如兰勃特等角投影，只需要将 `99` 行代码改为：

```python
m = Basemap(projection='lcc', width=5000000, height=5000000, lat_0=36, lon_0=102, resolution='l', ax=axes)
```

兰勃特投影效果如下：

![draw-the-map-of-2019-ncov-epidemic-distribution-3.png](/images/draw-the-map-of-2019-ncov-epidemic-distribution-3.png "兰勃特投影疫情地图")

还可以使用正射投影：

```python
m = Basemap(projection='ortho', lat_0=30, lon_0=105, resolution='l', ax=axes)
```

效果如下：

![draw-the-map-of-2019-ncov-epidemic-distribution-4.png](/images/draw-the-map-of-2019-ncov-epidemic-distribution-4.png "正射投影疫情地图")

注意：以上数据采集时间为 2020 年 1 月 29 日 20 时。此后腾讯在数据源的结构上做了一些改动，数据源链接与对应的结构名都需要做相应的改动，否则运行程序会出现错误。