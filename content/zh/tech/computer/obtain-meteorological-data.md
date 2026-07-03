+++
title = "爬取指定城市的气象数据"
date = "2020-05-19T20:02:07+08:00"
lastmod = "2020-05-20T20:02:07+08:00"
tags = ["data-processing","python"]
displayExpiredTip = true
+++

上周六，北京外国语大学的一个朋友找我帮忙改一改她的 Python 程序。她搬运了这篇文章的代码，老师要求的是收集 2016 年至 2020 年北京市的气象数据，包括时间、天气、温度、湿度、风力、风级、降水量、体感温度和云量数据，但按照这篇文章中的代码，输出到 `.csv` 文件中的数据只有四项：时间、温度、湿度和降水量，并且时间并没有加上年份。

由于我最近写的最多的就是 MATLAB，没怎么系统性地写过 Python 代码，更不用说什么爬虫程序了。不过既然已经有了代码，在此基础上改一改还是不成问题的。

先附上她给我的代码：

```python
import requests
import pandas as pd
from  bs4 import BeautifulSoup
from collections import defaultdict
from dateutil.relativedelta import relativedelta
from datetime import datetime
import numpy as np

class weather_data:
    def __init__(self, city, start_year, end_year, start_month = 1, end_month = 12):
        """
        :param city: 需爬取的城市全拼
        :param start_year: 爬取开始年份
        :param end_year: 爬取结束年份
        :param start_month: 爬取开始月份
        :param end_month: 爬取结束月份
        """
        self.city = city
        self.start_time = datetime.strptime(f"{start_year}-{start_month}", '%Y-%m')
        self.end_time = datetime.strptime(f"{end_year}-{end_month}", '%Y-%m')

    def _get_original_html(self):
        """
        网页爬取
        """
        url = f"https://tianqi.911cha.com/{self.city}/{self.start_time.year}-{self.start_time.month}.html"
        print(url)
        header = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"} # 填写自己浏览器内容
        response = requests.get(url, headers = header)
        return response.content.decode("utf-8")

    def _parse_data(self):
        # 一次解析一个月
        soup = BeautifulSoup(self.html, "html.parser")
        data = defaultdict(dict)
        for n, tr in enumerate(soup.find_all("tr")):
            if n == 0:
                continue

            if n%2!=0:
                date = tr.find("a").get_text()
                # 创建日期字典
                # [时间，图片，天气，温度，湿度，风力，风级，降水量，体感温度，云量]
                data[date]["Day"] = {str(self.start_time.year)+'-' + key:con.get_text() for key, con in zip(['time', 'image', 'weather', 'temperature', 'humidity', 'wind_force', 'wind_scale', 'precipitation', 'sendible_temperature', 'cloud_amount'], tr.find_all("td"))}

            else:
                data[date]["Night"] = {key: con.get_text() for key, con in zip(
                    ['time', 'image', 'weather', 'temperature', 'humidity', 'wind_force', 'wind_scale','precipitation', 'sendible_temperature', 'cloud_amount'], tr.find_all("td"))}
        return data

    def main(self):

        data = []
        while self.start_time <= self.end_time:
            self.html = self._get_original_html()
            data.append(self._parse_data())
            self.start_time += relativedelta(months = 1)

        return data

result = []
if __name__ == "__main__":
    T = weather_data(city = "beijing", start_year = 2016, end_year = 2020, start_month = 1, end_month = 5)
    with open('weather_dict.txt', 'w', encoding = 'UTF-8') as f:
        for line in T.main():
            result.append(line)
            f.writelines(str(line))
key_list = [] 
key2_list = []
val_list = []
val3_list = []
val5_list = []
for data in result:
    key_value = list( data.keys() )
    key_list.append(key_value)
    val_value = list( data.values() )
    val_list.append(val_value)
    
for i in key_list:
    key2_list = key2_list + i

# 下面全是对val值进行操作
for val2 in val_list:
    for val3 in val2:
        val3_value = list(val3.values())
        val3_list.append(val3_value)
        
for nu in range( len(val3_list) ):
    for val4 in val3_list[nu]:
        val5 = list(val4.values())
        val6 = ['0' if i == '-' else i for i in val5]   # 把降雨的-改成0，工作需要         
        val5_list.append(val6)

data_key = pd.DataFrame(key2_list) # 日期
data_val = pd.DataFrame(val5_list) # 气象信息，可以根据自己需要对这个变量进行修改

# 去除符号
temp = data_val[3].str.strip('℃') 
humd = data_val[4].str.strip('%')
rain = data_val[7].str.strip('mm')

weather = pd.DataFrame([temp,humd,rain]).T

# 保留奇数行，删除偶数行
day = weather[weather.index%2 == 0].reset_index(drop = True) # 白天数据
# 保留偶数行，删除奇数行
night = weather[weather.index%2 == 1].reset_index(drop = True) # 晚上数据

fin = pd.concat([data_key, night, day],axis = 1)
fin.to_csv('beijing_weather.csv', encoding="utf_8_sig")
```

我将这个程序完整看了一遍后就找到了问题所在。很明显，数据爬取不全的问题出现在了第 104 行那里：

```python
weather = pd.DataFrame([temp,humd,rain]).T
```

只输出了三个量，把其他的量也去除单位后加上就好了：

```python
temp = data_val[3].str.strip('℃') 
humd = data_val[4].str.strip('%')
wind_scal = data_val[6].str.strip('级')
prec = data_val[7].str.strip('mm')
send_temp = data_val[8].str.strip('℃')
clou_amou = data_val[9].str.strip('%')

weather = pd.DataFrame([temp,humd,wind_scal,prec,send_temp,clou_amou]).T
```

至于时间数据不显示年份这一问题，因为获取到的数据本身就没有年份信息，自己加上就可以了。为了省事，我采用的办法是重写一个数组存储时间，时间的格式是 `xxxx年xx月xx日`，然后将原数据中存放时间的数组替换成这个新的数组。观察原程序，注意到时间存放在了 `key2_list` 中，因此进行如下操作进行替换：

```python
# 修改日期，添加年份
locale.setlocale(locale.LC_CTYPE, 'chinese')
datestart = '2016年1月1日'
dateend = '2020年5月29日'
datestart = datetime.datetime.strptime(datestart, '%Y年%m月%d日')
dateend = datetime.datetime.strptime(dateend, '%Y年%m月%d日')
date_list = []
date_list.append(datestart.strftime('%Y年%m月%d日'))

while datestart < dateend:
    # 日期叠加一天
    datestart += datetime.timedelta(days =+ 1)
    # 日期转字符串存入列表
    date_list.append(datestart.strftime('%Y年%m月%d日'))

# 删除原网站中缺少的日期
del date_list[533]
del date_list[562]

key2_list = date_list
```

这一部分程序额外引入 `local` 库（`import locale`），并且将原来的 `from datetime import datetime` 改为 `import datetime`，代码中的 `datetime.strptime` 都要改为 `datetime.datetime.strptime`。