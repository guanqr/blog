+++
title = "使用 Python 分析我国的人口数据"
date = "2020-02-06T21:15:39+08:00"
tags = ["python"]
dropCap = false
toc = true
original = false
author = "裸睡的猪"
link = "https://mp.weixin.qq.com/s/zG_99NFbGzaWK_7ytd5-cw"
copyright = "文章转载自「裸睡的猪」微信公众号，内容结合个人情况有删改。"
+++

## 背景

2020 年 1 月 17 日，国家统计局发布了 [2019 年国民经济报告](http://www.stats.gov.cn/tjsj/zxfb/202001/t20200117_1723383.html)，报告中指出：年末中国大陆总人口（包括 31 个省、自治区、直辖市和中国人民解放军现役军人，不包括香港、澳门特别行政区和台湾省以及海外华侨人数）140005 万人。也就是说 2019 年底我国人口突破了 14 亿。

根据 2010 年 5 月 12 日国务院第 111 次常务会议通过的《全国人口普查条例》第一章第八条规定：人口普查每 10 年进行一次，尾数逢 0 的年份为普查年度，标准时点为普查年度的 11 月 1 日零时。也就是说 2020 年 11 月将进行第七次人口普查，新中国成立后前六次人口普查分别为：1953、1964、1982、1990、2000、2010 年。

《中华人民共和国人口与计划生育法修正案（草案）》明确规定，「全面两孩」政策 2016 年元旦开始即可实施。全面实施一对夫妇可生育两个孩子政策，是中国生育政策的一次历史性调整，实行了 36 年的独生子女政策全面终止。

## 分析目标

新中国成立 70 周年，经历了许许多多的风风雨雨，政策、经济、文化也有很多的变化，人口也随之变化。人口变化对社会经济发展带来巨大而深远的影响，所以我们要从多角度来分析我国人口变化：

1. 人口总数
2. 人口男女比例
3. 人口城镇化
4. 人口增长率
5. 人口年龄结构

## 爬取数据

关于我国人口的数据来源，可以从「[国家数据](http://data.stats.gov.cn/)」网站中获取。这是一个由国家统计局提供的网站，里面有很多国家公开的数据信息。

![chinese-population-analysis-0.png](/images/chinese-population-analysis-0.png)

### 请求单页数据

在国家数据网站中，有从新中国成立到 2018 年的人口相关数据。

![chinese-population-analysis-1.png](/images/chinese-population-analysis-1.png)

在人口数据中，有三项是我们需要的数据：**总人口**、**增长率**、**年龄结构**。按 `F12` 查看请求的链接（Request URL），然后复制链接，使用 `requests` 请求数据。

![chinese-population-analysis-2.png](/images/chinese-population-analysis-2.png)

只使用一个简单的 `get`c请求，就把数据获取了，而且返回的直接是 `json` 数据。

```python
import requests

def spider_population():
    """
    爬取人口数据
    """
    url = 'http://data.stats.gov.cn/easyquery.htm?m=QueryData&dbcode=hgnd&rowcode=zb&colcode=sj&wds=%5B%5D&dfwds=%5B%7B%22wdcode%22%3A%22zb%22%2C%22valuecode%22%3A%22A0301%22%7D%5D&k1=1581041147395&h=1'
    response = requests.get(url)
    print(response.json())

if __name__ == '__main__':
    spider_population()
```

### 分页数据

我们此次的目的是抓取从新中国至今的所有人口数据，而页面中最多可以获取近 20 年的数据，所以我们需要分析网页请求中关于分页的参数。

![chinese-population-analysis-3.png](/images/chinese-population-analysis-3.png)

分析请求参数主要有两个参数：`zb`、`sj`，分别表示**指标**和**时间**。

![chinese-population-analysis-4.png](/images/chinese-population-analysis-4.png)

`A0301` 表示总人口，`A0302` 表示增长率，`A0303` 表示年龄结构。

![chinese-population-analysis-5.png](/images/chinese-population-analysis-5.png)

参数 `sj=LAST0`，表示近 10 年，于是猜想：`sj=LAST70` 是否可以获取 70 年的数据呢？

```python
import requests

def spider_population():
    """
    爬取人口数据
    """
    # 请求参数 sj（时间），zb（指标）
    # 总人口
    dfwds = '[{"wdcode": "sj", "valuecode": "LAST70"}, {"wdcode":"zb","valuecode":"A0301"}]'
    url = 'http://data.stats.gov.cn/easyquery.htm?m=QueryData&dbcode=hgnd&rowcode=sj&colcode=zb&wds=[]&dfwds={}'
    response = requests.get(url.format(dfwds))
    print(response.json())

if __name__ == '__main__':
    spider_population()
```

运行上述代码，查看结果，确实请求到了从 1949 年到 2018 年的数据。

![chinese-population-analysis-6.png](/images/chinese-population-analysis-6.png)

然后我们再将 `zb` 参数更换，获取到所有的数据。

```python
import requests

def spider_population():
    """
    爬取人口数据
    """
    # 请求参数 sj（时间），zb（指标）
    # 总人口
    dfwds1 = '[{"wdcode": "sj", "valuecode": "LAST70"}, {"wdcode":"zb","valuecode":"A0301"}]'
    # 增长率
    dfwds2 = '[{"wdcode": "sj", "valuecode": "LAST70"}, {"wdcode":"zb","valuecode":"A0302"}]'
    # 人口结构
    dfwds3 = '[{"wdcode": "sj", "valuecode": "LAST70"}, {"wdcode":"zb","valuecode":"A0303"}]'
    url = 'http://data.stats.gov.cn/easyquery.htm?m=QueryData&dbcode=hgnd&rowcode=sj&colcode=zb&wds=[]&dfwds={}'

    response1 = requests.get(url.format(dfwds1))
    get_population_info(population_dict, response1.json())

    response2 = requests.get(url.format(dfwds2))
    get_population_info(population_dict, response2.json())

    response3 = requests.get(url.format(dfwds3))
    get_population_info(population_dict, response3.json())
```

### 保存数据

获取到数据之后，我们先将数据清洗，提取出我们需要的数据，然后整理保存到 Excel 中，数据处理方面使用 `pandas`。

```python
import pandas as pd

def get_population_info(population_dict, json_obj):
    """
    提取人口数量信息
    """
    datanodes = json_obj['returndata']['datanodes']
    for node in datanodes:
        # 获取年份
        year = node['code'][-4:]
        # 数据数值
        data = node['data']['data']
        if year in population_dict.keys():
            population_dict[year].append(data)
        else:
            population_dict[year] = [int(year), data]
    return population_dict


def save_excel(population_dict):
    """
    人口数据生成excel文件
    :param population_dict: 人口数据
    :return:
    """
    # .T 是行列转换
    df = pd.DataFrame(population_dict).T[::-1]
    df.columns = ['年份', '年末总人口(万人)', '男性人口(万人)', '女性人口(万人)', '城镇人口(万人)', '乡村人口(万人)', '人口出生率(‰)', '人口死亡率(‰)',
                  '人口自然增长率(‰)', '年末总人口(万人)', '0-14岁人口(万人)', '15-64岁人口(万人)', '65岁及以上人口(万人)', '总抚养比(%)',
                  '少儿抚养比(%)', '老年抚养比(%)']
    writer = pd.ExcelWriter(POPULATION_EXCEL_PATH)
    # columns 参数用于指定生成的 excel 中列的顺序
    df.to_excel(excel_writer=writer, index=False, encoding='utf-8', sheet_name='中国70年人口数据')
    writer.save()
    writer.close()
```

查看保存的 Excel 文件数据。

![chinese-population-analysis-7.png](/images/chinese-population-analysis-7.png)

### 2019 年数据

目前数据唯一的不完整就是没有 2019 年的数据，因为 2019 年刚刚完结所以数据还没有登记到网站上，我们只能自己算出来然后补齐。

根据 2020 年 1 月 17 日，国家统计局发布的「2019 年国民经济报告」中关于人口的数据得出了 2019 年的相关数据。

```python
    # 将所有数据放这里，年份为 key，值为各个指标值组成的 list
    # 因为 2019 年数据还没有列入到年度数据表里，所以根据统计局 2019 年经济报告中给出的人口数据计算得出
    # 数据顺序为历年数据
    population_dict = {
        '2019': [2019, 140005, 71527, 68478, 84843, 55162, 10.48, 7.14, 3.34, 140005, 25061, 97341, 17603, 43.82942439,
                 25.74557483, 18.08384956]}
```

## 数据分析

数据保存完毕后我们就可以开始数据分析步骤了，一般在我们数据分析之前我们需要有个思路：要分析什么？从哪些角度分析？选择何种可视化图形？得出了什么结论？

### 人口总数

首先我们提取 Excel 中的「年末总人口」这一列的数据进行分析。

```python
import numpy as np
import pandas as pd
import pyecharts.options as opts
from pyecharts.charts import Line, Bar, Page, Pie
from pyecharts.commons.utils import JsCode

# 人口数量 Excel 文件保存路径
POPULATION_EXCEL_PATH = 'population.xlsx'

# 读取标准数据
DF_STANDARD = pd.read_excel(POPULATION_EXCEL_PATH)
# 自定义 pyecharts 图形背景颜色 js
background_color_js = (
    "new echarts.graphic.LinearGradient(0, 0, 0, 1, "
    "[{offset: 0, color: '#c86589'}, {offset: 1, color: '#06a7ff'}], false)"
)
# 自定义 pyecharts 图像区域颜色 js
area_color_js = (
    "new echarts.graphic.LinearGradient(0, 0, 0, 1, "
    "[{offset: 0, color: '#eb64fb'}, {offset: 1, color: '#3fbbff0d'}], false)"
)


def analysis_total():
    """
    分析总人口
    """
    # 1、分析总人口，画人口曲线图
    # 1.1 处理数据
    x_data = DF_STANDARD['年份']
    # 将人口单位转换为亿
    y_data = DF_STANDARD['年末总人口(万人)'].map(lambda x: "%.2f" % (x / 10000))
    # 1.2 自定义曲线图
    line = (
        Line(init_opts=opts.InitOpts(bg_color=JsCode(background_color_js)))
            .add_xaxis(xaxis_data=x_data)
            .add_yaxis(
            series_name="总人口",
            y_axis=y_data,
            is_smooth=True,
            is_symbol_show=True,
            symbol="circle",
            symbol_size=5,
            linestyle_opts=opts.LineStyleOpts(color="#fff"),
            label_opts=opts.LabelOpts(is_show=False, position="top", color="white"),
            itemstyle_opts=opts.ItemStyleOpts(
                color="red", border_color="#fff", border_width=1
            ),
            tooltip_opts=opts.TooltipOpts(is_show=False),
            areastyle_opts=opts.AreaStyleOpts(color=JsCode(area_color_js), opacity=1),
            # 标出 4 个关键点的数据
            markpoint_opts=opts.MarkPointOpts(
                data=[opts.MarkPointItem(name="新中国成立（1949年）", coord=[0, y_data[0]], value=y_data[0]),
                      opts.MarkPointItem(name="计划生育（1980年）", coord=[31, y_data[31]], value=y_data[31]),
                      opts.MarkPointItem(name="放开二胎（2016年）", coord=[67, y_data[67]], value=y_data[67]),
                      opts.MarkPointItem(name="2019年", coord=[70, y_data[70]], value=y_data[70])
                      ]
            ),
            # markline_opts 可以画直线
            # markline_opts=opts.MarkLineOpts(
            #     data=[[opts.MarkLineItem(coord=[39, y_data[39]]),
            #            opts.MarkLineItem(coord=[19, y_data[19]])],
            #           [opts.MarkLineItem(coord=[70, y_data[70]]),
            #            opts.MarkLineItem(coord=[39, y_data[39]])]],
            #     linestyle_opts=opts.LineStyleOpts(color="red")
            # ),
        )
            .set_global_opts(
            title_opts=opts.TitleOpts(
                title="新中国70年人口变化(亿人)",
                pos_bottom="5%",
                pos_left="center",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=16),
            ),
            # x 轴相关选项设置
            xaxis_opts=opts.AxisOpts(
                type_="category",
                boundary_gap=False,
                axislabel_opts=opts.LabelOpts(margin=30, color="#ffffff63"),
                axisline_opts=opts.AxisLineOpts(is_show=False),
                axistick_opts=opts.AxisTickOpts(
                    is_show=True,
                    length=25,
                    linestyle_opts=opts.LineStyleOpts(color="#ffffff1f"),
                ),
                splitline_opts=opts.SplitLineOpts(
                    is_show=False, linestyle_opts=opts.LineStyleOpts(color="#ffffff1f")
                ),
            ),
            # y 轴相关选项设置
            yaxis_opts=opts.AxisOpts(
                type_="value",
                position="left",
                axislabel_opts=opts.LabelOpts(margin=20, color="#ffffff63"),
                axisline_opts=opts.AxisLineOpts(
                    linestyle_opts=opts.LineStyleOpts(width=0, color="#ffffff1f")
                ),
                axistick_opts=opts.AxisTickOpts(
                    is_show=True,
                    length=15,
                    linestyle_opts=opts.LineStyleOpts(color="#ffffff1f"),
                ),
                splitline_opts=opts.SplitLineOpts(
                    is_show=False, linestyle_opts=opts.LineStyleOpts(color="#ffffff1f")
                ),
            ),
            # 图例配置项相关设置
            legend_opts=opts.LegendOpts(is_show=False),
        )
    )
    # 2、分析计划生育执行前后增长人口
    # 2.1 数据处理
    total_1949 = DF_STANDARD[DF_STANDARD['年份'] == 1949]['年末总人口(万人)'].values
    total_1979 = DF_STANDARD[DF_STANDARD['年份'] == 1979]['年末总人口(万人)'].values
    total_2010 = DF_STANDARD[DF_STANDARD['年份'] == 2010]['年末总人口(万人)'].values
    increase_1949_1979 = '%.2f' % (int(total_1979 - total_1949) / 10000)
    increase_1979_2010 = '%.2f' % (int(total_2010 - total_1979) / 10000)
    # 2.2 画柱状图
    bar = (
        Bar(init_opts=opts.InitOpts(bg_color=JsCode(background_color_js)))
            .add_xaxis([''])
            .add_yaxis("前31年：1949-1979", [increase_1949_1979], color=JsCode(area_color_js),
                       label_opts=opts.LabelOpts(color='white', font_size=16))
            .add_yaxis("后31年：1980-2010", [increase_1979_2010], color=JsCode(area_color_js),
                       label_opts=opts.LabelOpts(color='white', font_size=16))
            .set_global_opts(
            title_opts=opts.TitleOpts(
                title="计划生育执行前31年（1949-1979）与后31年（1980-2010）增加人口总数比较（亿人）",
                pos_bottom="5%",
                pos_left="center",
                title_textstyle_opts=opts.TextStyleOpts(color="#fff", font_size=16)
            ),
            xaxis_opts=opts.AxisOpts(
                # 隐藏 x 轴的坐标线
                axisline_opts=opts.AxisLineOpts(is_show=False),
            ),
            yaxis_opts=opts.AxisOpts(
                # y 轴坐标数值
                axislabel_opts=opts.LabelOpts(margin=20, color="#ffffff63"),
                # y 轴轴线
                axisline_opts=opts.AxisLineOpts(
                    linestyle_opts=opts.LineStyleOpts(width=0, color="#ffffff1f")
                ),
                # y 轴刻度横线
                axistick_opts=opts.AxisTickOpts(
                    is_show=True,
                    length=15,
                    linestyle_opts=opts.LineStyleOpts(color="#ffffff1f"),
                ),
            ),
            legend_opts=opts.LegendOpts(is_show=False)
        )
    )
    # 3、渲染图像，将多个图像显示在一个 HTML 中
    # DraggablePageLayout 表示可拖拽
    page = Page(layout=Page.DraggablePageLayout)
    page.add(line)
    page.add(bar)
    page.render('population_total.html')
```

运行代码，生成 `population_total.html` 文件，打开即可查看统计图。在图中标注了四个点：

1. 1949 年：新中国成立，总人口 **5.42 亿**
2. 1980 年：计划生育正式开始，总人口 **9.87 亿**
3. 2016 年：全面放开二胎，总人口 **13.83 亿**
4. 2019 年：总人口 **14 亿**

![chinese-population-analysis-8.png](/images/chinese-population-analysis-8.png)

通过观察总人口曲线图得知：

1. 人口总体在增加，但增长曲线慢慢放缓，据社科院预测：中国人口将在 2029 年达到峰值 14.42 亿，往后逐步下降；
2. 新中国成立至今（2020 年）唯一出现人口减少的是 1960 和 1961 年，这两年是我国的自然灾害年；
3. 根据总人口数，分析执行计划生育前 31 年与后 31 年增长的人口可知，计划生育确实控制了人口的增长。

![chinese-population-analysis-9.png](/images/chinese-population-analysis-9.png)

放开二胎后并未迎来生育高峰期，联合国相关机构发布的《世界人口展望》2017 修订版给出了类似的预期。它倾向于认定中国人口已经开始了倒 V 型反转，在人口到达高峰后，2050 年将会保持 13 亿多，然后就会加速下滑。

### 人口男女比例

从以下 4 个角度来分析我国男女比例的关系：

1. 2019年男女比
2. 男性占总人口比例
3. 男女人口数曲线
4. 男女人口数差值

```python
def analysis_sex():
    """
    分析男女比
    """
    # 年份
    x_data_year = DF_STANDARD['年份']
    # 1、2019 年男女比饼图
    sex_2019 = DF_STANDARD[DF_STANDARD['年份'] == 2019][['男性人口(万人)', '女性人口(万人)']]
    pie = (
        Pie()
            .add("", [list(z) for z in zip(['男', '女'], np.ravel(sex_2019.values))])
            .set_global_opts(title_opts=opts.TitleOpts(title="2019中国男女比", pos_bottom="bottom", pos_left="center"))
            .set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {d}%"))
    )
    # 2、历年男性占总人数比曲线
    # （男性数/总数）x 100 ，然后保留两位小数
    man_percent = (DF_STANDARD['男性人口(万人)'] / DF_STANDARD['年末总人口(万人)']).map(lambda x: "%.2f" % (x * 100))
    line1 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis(
            series_name="男性占总人口比",
            y_axis=man_percent.values,
            # 标出关键点的数据
            markpoint_opts=opts.MarkPointOpts(data=[opts.MarkPointItem(type_="min"), opts.MarkPointItem(type_="max")]),
            # 画出平均线
            markline_opts=opts.MarkLineOpts(data=[opts.MarkLineItem(type_="average")])
        )
            .set_global_opts(
            title_opts=opts.TitleOpts(title="中国70年(1949-2019)男性占总人数比", pos_left="center", pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
            # y 轴显示百分比，并设置最小值和最大值
            yaxis_opts=opts.AxisOpts(type_="value", max_=52, min_=50,
                                     axislabel_opts=opts.LabelOpts(formatter='{value} %')),
            legend_opts=opts.LegendOpts(is_show=False),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )

    # 3、男女折线图
    # 历年男性人口数
    y_data_man = DF_STANDARD['男性人口(万人)']
    # 历年女性人口数
    y_data_woman = DF_STANDARD['女性人口(万人)']
    line2 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis("女性", y_data_woman)
            .add_yaxis("男性", y_data_man)
            .set_global_opts(
            title_opts=opts.TitleOpts(title="中国70年(1949-2019)男女人口数(万人)", pos_left="center", pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )
    # 4、男女人口差异图
    # 两列相减，获得新列
    y_data_man_woman = DF_STANDARD['男性人口(万人)'] - DF_STANDARD['女性人口(万人)']
    line3 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis(
            series_name="男女差值",
            y_axis=y_data_man_woman.values,
            # 标出关键点的数据
            markpoint_opts=opts.MarkPointOpts(data=[opts.MarkPointItem(type_="min"), opts.MarkPointItem(type_="max"),
                                                    opts.MarkPointItem(type_="average")]),
            markline_opts=opts.MarkLineOpts(data=[opts.MarkLineItem(type_="average")])
        )
            .set_global_opts(
            title_opts=opts.TitleOpts(title="中国70年(1949-2019)男女差值（万人）", pos_left="center", pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
            legend_opts=opts.LegendOpts(is_show=False),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )

    # 5、渲染图像，将多个图像显示在一个 HTML 中
    page = Page(layout=Page.DraggablePageLayout)
    page.add(pie)
    page.add(line1)
    page.add(line2)
    page.add(line3)
    page.render('population_sex.html')
```

![chinese-population-analysis-10.png](/images/chinese-population-analysis-10.png)

根据上面 4 幅图我们可以得出一些结论：

1. 新中国成立以来男性人口一直比女性人口多，可能与我国重男轻女思想有一定关系；
2. 男性占比最高是在新中国成立之初为 51.96%，最低是在 1996 年为 50.82%。下图是[快易数据](https://www.kylc.com/stats/global/yearly_overview/g_population_male_perc.html)提供的中国、印度、日本、英国、美国 五国的男性占比图，从图中可以清晰看出中国与印度的男女比一直处于失衡状态；
   ![chinese-population-analysis-11.png](/images/chinese-population-analysis-11.png)
3. 2000 年我国男女人口差值最大为 4131 万人，最小差值是在 1965 年为 1718 万人；
4. 2006 年以来我国男女比例失衡状况逐年缓解。

### 人口城镇化

人口城镇化是指农村人口转变为城镇人口、农业人口转变为非农业人口的过程，它是社会生产力发展到一定阶段的产物。城镇化是一个综合指标，可以用来衡量当地经济发展情况、基础设施和人民生活水平。同时，城镇化的进程也是房地产市场在需求层面的重要支撑力量。

根据美国地理学家诺瑟姆对世界各国城市化的研究，世界城市化分为三个阶段：

1. 初期（人口城镇化在 30% 以下）：农村人口占优势，工农业生产力水平较低，工业提供就业机会少，农业剩余劳动力得不到释放；
2. 中期（人口城镇化 30% - 70%）：工业基础比较雄厚，经济实力明显增强，农村劳动生产率提高，剩余劳动力转向工业，城市人口比重快速突破 50%，而后上升到 70%；
3. 后期（人口城镇化 70% - 90%）：农村人口向城镇人口的转化趋于停止，农村人口占比稳定在 10% 左右，城市人口可以达到 90% 左右，趋于饱和，这个过程的城市化不再是人口从农村流向城市，而是城市人口在产业之间的结构性转移，主要是从第二产业向第三产业转移。

对我国人口城镇化数据进行分析：

```python
def analysis_urbanization():
    """
    分析我国人口城镇化
    """
    # 年份
    x_data_year = DF_STANDARD['年份']
    # 2019 年我国人口城镇化
    urbanization_2019 = DF_STANDARD[DF_STANDARD['年份'] == 2019][['城镇人口(万人)', '乡村人口(万人)']]
    pie = (
        Pie()
            .add("", [list(z) for z in zip(['城镇人口', '乡村人口'], np.ravel(urbanization_2019.values))])
            .set_global_opts(title_opts=opts.TitleOpts(title="2019中国城镇化比例", pos_bottom="bottom", pos_left="center", ),
                             legend_opts=opts.LegendOpts(is_show=False))
            .set_series_opts(label_opts=opts.LabelOpts(formatter="{b}: {d}%"))

    )
    # 2、城镇化比例曲线
    y_data_city = DF_STANDARD['城镇人口(万人)'] / 10000
    y_data_countryside = DF_STANDARD['乡村人口(万人)'] / 10000
    line1 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis("城镇人口", y_data_city)
            .add_yaxis(series_name="乡村人口", y_axis=y_data_countryside,
                       # 标记线
                       markline_opts=opts.MarkLineOpts(
                           # 去除标记线的箭头
                           symbol='none',
                           label_opts=opts.LabelOpts(font_size=16),
                           data=[[opts.MarkLineItem(coord=[46, 0]),
                                  opts.MarkLineItem(name='1995', coord=[46, y_data_countryside[46]])],
                                 [opts.MarkLineItem(coord=[61, 0]),
                                  opts.MarkLineItem(name='2010', coord=[61, y_data_countryside[61]])]],
                           # opacity不透明度 0 - 1
                           linestyle_opts=opts.LineStyleOpts(color="red", opacity=0.3)
                       ),
                       # 标出关键点的数据
                       markpoint_opts=opts.MarkPointOpts(
                           data=[opts.MarkPointItem(name="1995年", coord=[46, y_data_countryside[46]],
                                                    value="%.2f" % (y_data_countryside[46])),
                                 opts.MarkPointItem(name="2010年", coord=[61, y_data_countryside[61]],
                                                    value="%.2f" % (y_data_countryside[61]))]
                       )
                       )
            .set_global_opts(
            title_opts=opts.TitleOpts(title="中国70年(1949-2019)城乡人口曲线（亿人）", pos_left="center", pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category")
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )

    # 3、城镇化曲线
    y_data_urbanization = (DF_STANDARD['城镇人口(万人)'] / DF_STANDARD['年末总人口(万人)']).map(lambda x: "%.2f" % (x * 100))
    line2 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis(
            series_name="中国人口城镇化比例曲线",
            y_axis=y_data_urbanization.values,
            markline_opts=opts.MarkLineOpts(symbol='none', data=[opts.MarkLineItem(y=30), opts.MarkLineItem(y=70)])
        )
            .set_global_opts(
            title_opts=opts.TitleOpts(title="中国(1949-2019)人口城镇化比例曲线", pos_left="center", pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
            # y 轴显示百分比，并设置最小值和最大值
            yaxis_opts=opts.AxisOpts(type_="value", max_=100, min_=10,
                                     axislabel_opts=opts.LabelOpts(formatter='{value} %')),
            legend_opts=opts.LegendOpts(is_show=False),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )

    # 4、渲染图像，将多个图像显示在一个 HTML 中
    page = Page(layout=Page.DraggablePageLayout)
    page.add(pie)
    page.add(line1)
    page.add(line2)
    page.render('population_urbanization.html')
```

![chinese-population-analysis-12.png](/images/chinese-population-analysis-12.png)

由上图分析可知：

1. 2019 年我国人口城镇化达到 60.6%，处于人口城镇化的中期；
2. 1995 年我国乡村人口达到峰值：8.59 亿；
3. 1996 年我国城镇化步伐加快，同年城镇化超过 30%，进入城镇化的中期；
4. 2010 年我国城市人口与乡村人口持平约为 6.7 亿，城镇化为 50%。

联合国对中国人口城镇化进程进行了预测：我国城镇化初期是 1949 年 - 1995 年，中期是 1996 年 - 2032 年，后期是 2033 年以后。

### 人口增长率

分析人口增长率数据：

```python
def analysis_growth():
    """
    分析人口增长率
    """
    # 1、三条曲线
    x_data_year = DF_STANDARD['年份']
    y_data_birth = DF_STANDARD['人口出生率(‰)']
    y_data_death = DF_STANDARD['人口死亡率(‰)']
    y_data_growth = DF_STANDARD['人口自然增长率(‰)']
    line1 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis("人口出生率", y_data_birth)
            .add_yaxis("人口死亡率", y_data_death)
            .add_yaxis("人口自然增长率", y_data_growth)
            .set_global_opts(
            # y 轴显示百分比，并设置最小值和最大值
            yaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(formatter='{value} ‰')),
            title_opts=opts.TitleOpts(title="中国70年(1949-2019)出生率、死亡率及增长率变化", subtitle="1949-2019年，单位：‰",
                                      pos_left="center",
                                      pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )
    # 2、渲染图像，将两个图像显示在一个 HTML 中
    page = Page(layout=Page.DraggablePageLayout)
    page.add(line1)
    page.render('analysis_growth.html')
```

![chinese-population-analysis-13.png](/images/chinese-population-analysis-13.png)

由上图得知：

1. 在自然灾害三年（1959、1960、1961）我国人口死亡率陡增，出生率也下降，人口出现新中国成立以来第一次负增长；
2. 在自然灾害过后的两年（1962、1963）迎来我国最大的一波生育潮，我们通过[中国 2010 年人口普查资料](http://www.stats.gov.cn/tjsj/pcsj/rkpc/6rp/indexch.htm)的数据也可以验证这个结论；
   ![chinese-population-analysis-14.png](/images/chinese-population-analysis-14.png)
3. 自然灾害三年过后我国的死亡率一直趋于稳定，维持在 6‰ - 7‰ 左右；
4. 我国出生率整体一直在下降，在计划生育之前出生率就在下降；
5. 在 2016 年我国全面放开二胎之后的三年（2017 - 2019），出生率并没有出现好转，反而持续走低。

目前的育龄妇女基本都是 85 - 90 后，受计划生育（1980 年）影响，育龄妇女人数比以前少了，生孩子的数量自然就比以前少了，这一情况会持续下去。出生率降低，死亡率增加，人口增长就慢慢放缓，社科院预测在 2029 年左右我国人口达到峰值（14.42 亿）之后慢慢减少。

### 人口年龄结构

人口年龄结构是衡量老龄化与人口红利的指标。

老龄化指老年人口相对增多，在总人口中所占比例不断上升的过程，国际上通常看法是，当一个国家或地区 60 岁以上老年人口占人口总数的 10%，或 65 岁以上老年人口占人口总数的 7%，即意味着这个国家或地区的人口处于老龄化社会。

老龄化是每个国家每个社会都会经历的阶段，目前来讲发达国家的老龄化问题比发展中国家更严重，据快易数据提供的一份 世界各国老龄化排名来看，中国只排到了 65 名，第一名是日本，而前几名基本都是欧洲国家。

![chinese-population-analysis-15.png](/images/chinese-population-analysis-15.png)

人口红利是指一个国家的劳动年龄人口占总人口比重较大，抚养率比较低，为经济发展创造了有利的人口条件，整个国家的经济呈高储蓄、高投资和高增长的局面。简单来说就是，劳动力人口数大于非劳动力人口，劳动人口比例较高，保证了经济增长中的劳动力需求，劳动力资源丰富和成本优势已经使中国成为世界工厂和世界经济增长的引擎。

分析我国人口年龄结构：

```python
def analysis_age():
    """
    分析年龄结构
    """
    new_df = DF_STANDARD[DF_STANDARD['0-14岁人口(万人)'] != 0][['年份', '0-14岁人口(万人)', '15-64岁人口(万人)', '65岁及以上人口(万人)']]
    x_data_year = new_df['年份']
    y_data_age_14 = new_df['0-14岁人口(万人)']
    y_data_age_15_64 = new_df['15-64岁人口(万人)']
    y_data_age_65 = new_df['65岁及以上人口(万人)']
    line1 = (
        Line()
            .add_xaxis(x_data_year)
            .add_yaxis("0-14岁人口", y_data_age_14)
            .add_yaxis("15-64", y_data_age_15_64)
            .add_yaxis("65岁及以上人口", y_data_age_65)
            .set_global_opts(
            # y 轴显示百分比，并设置最小值和最大值
            yaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(formatter='{value}万')),
            title_opts=opts.TitleOpts(title="中国人口年龄结构变化图（万人）",
                                      pos_left="center",
                                      pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )
    # 2、1982 年龄结构与 2019 年龄结构
    age_1982 = DF_STANDARD[DF_STANDARD['年份'] == 1982][['0-14岁人口(万人)', '15-64岁人口(万人)', '65岁及以上人口(万人)']]
    age_2019 = DF_STANDARD[DF_STANDARD['年份'] == 2019][['0-14岁人口(万人)', '15-64岁人口(万人)', '65岁及以上人口(万人)']]

    pie = (
        Pie()
            .add(
            "1982",
            [list(z) for z in zip(['0-14', '15-64', '65'], np.ravel(age_1982.values))],
            center=["20%", "50%"],
            radius=[60, 80],
        )
            .add(
            "2019",
            [list(z) for z in zip(['0-14', '15-64', '65'], np.ravel(age_2019.values))],
            center=["55%", "50%"],
            radius=[60, 80],
        )
            .set_series_opts(label_opts=opts.LabelOpts(position="top", formatter="{b}: {d}%"))
            .set_global_opts(
            title_opts=opts.TitleOpts(title="中国1982、2019年年龄结构对比图", pos_left="center",
                                      pos_top="bottom"),
            legend_opts=opts.LegendOpts(
                type_="scroll", pos_top="20%", pos_left="80%", orient="vertical"
            ),
        )
    )
    # 3、抚养比曲线
    new_df = DF_STANDARD[DF_STANDARD['总抚养比(%)'] != 0][['年份', '总抚养比(%)', '少儿抚养比(%)', '老年抚养比(%)']]
    x_data_year2 = new_df['年份']
    y_data_all = new_df['总抚养比(%)']
    y_data_new = new_df['少儿抚养比(%)']
    y_data_old = new_df['老年抚养比(%)']
    line2 = (
        Line()
            .add_xaxis(x_data_year2)
            .add_yaxis(series_name="总抚养比", y_axis=y_data_all, markpoint_opts=opts.MarkPointOpts(
            data=[opts.MarkPointItem(name="1995年", coord=[22, y_data_all.values[22]],
                                     value="%.2f" % (y_data_all.values[22]))
                  ]
        ))
            .add_yaxis("少儿抚养比", y_data_new)
            .add_yaxis("老年抚养比", y_data_old)
            .set_global_opts(
            # y 轴显示百分比，并设置最小值和最大值
            yaxis_opts=opts.AxisOpts(axislabel_opts=opts.LabelOpts(formatter='{value}%')),
            title_opts=opts.TitleOpts(title="中国抚养比变化曲线图",
                                      pos_left="center",
                                      pos_top="bottom"),
            xaxis_opts=opts.AxisOpts(type_="category"),
        )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
    )
    # 4、渲染图像，将两个图像显示在一个 HTML 中
    page = Page(layout=Page.DraggablePageLayout)
    page.add(line1)
    page.add(line2)
    page.add(pie)
    page.render('analysis_age.html')

if __name__ == '__main__':
    # analysis_total()
    # analysis_sex()
    # analysis_urbanization()
    # analysis_growth()
    analysis_age()
```
![chinese-population-analysis-16.png](/images/chinese-population-analysis-16.png)

从上面 3 幅图分析我们可得：
1. 1982 年我国 0 - 14 岁少儿占比 33.59%，而 2019 年减至 17.9%，比例减至近半；
2. 2019 年我国 65 岁以上人口占比为 12.57%，已经进入老龄化社会。世界有 92 个国家进入老龄化，中国排在第 65 位；
3. 2010 年我国总抚养比达到最低为 34.2%，意味着每 3 个劳动力需要养一个老人或小孩；
4. 人口红利在 2010 年达到顶峰，之后在慢慢降低。

2019 年我国老年人口为 1.76 亿，中国的老龄化即将进入快速老龄化阶段，目前我国多个省的养老金告急，我国养老金体系改革迫在眉睫。

## 参考

文章：

1. [中国生育报告：2019 |  泽平宏观](https://mp.weixin.qq.com/s/SmNxflkaYgBewwmjoqOfJw)
2. [「一胎化」35 年，Python 可视化初探中国人口变化 | 技术小能手](https://yq.aliyun.com/articles/668824)
3. [《人口与劳动绿皮书：中国人口与劳动问题报告 No.19》发布会召开 | 社科文献](https://www.ssap.com.cn/c/2019-01-03/1074956.shtml)

数据：

1. [快易数据](https://www.kylc.com/stats)
2. [National data 国家数据](http://data.stats.gov.cn/easyquery.htm?cn=C01)
3. [2019 年国民经济运行总体平稳，发展主要预期目标较好实现 | 国家统计局](http://www.stats.gov.cn/tjsj/zxfb/202001/t20200117_1723383.html)

源码：

1. [china_population | pig6](https://github.com/pig6/china_population)