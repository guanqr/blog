+++
title = "OceanColor 遥感数据产品的获取"
date = "2020-03-11T09:17:34+08:00"
tags = ["ocean","remote-sensing"]
displayExpiredTip = true
+++

[^1]![oceancolor-0.jpg](/images/oceancolor-0.jpg "Ocean Color Feature: Copper River Wind")

美国国家航空航天局（NASA）的 OceanColor 网站平台提供了多种设备对全球海洋特性探测的不同等级的数据产品，比如使用 MODIS-Aqua 获取的水体固有光学特性数据。本文介绍的是如何简单地获取 OceanColor 网站的水色数据。

> NASA's Ocean Biology Processing Group (OBPG) supports the collection, processing, calibration, validation, archive and distribution of ocean-related products from a number of missions which are supported within the framework and facilities of the NASA Ocean Data Processing System (ODPS) which has been successfully supporting operational, satellite-based remote-sensing missions since 1996. The group's capabilities continue to evolve and expand to meet the demands and challenges of future missions.

## 数据获取

以 MODIS-Aqua 的水体固有光学特性——后向散射系数（*b<sub>b</sub>*）产品为例。我们需要获取到 2019 年 3 月份 443nm 波段的 *b<sub>b</sub>*(443) 数据产品。

### 信息查询

首先进入 [OceanColor 官网](https://oceancolor.gsfc.nasa.gov/)，点击菜单中的「DOCS」，进入「Products」中的「Algorithm Descriptions」。

![oceancolor-1.png](/images/oceancolor-1.png "查找数据来源")

在当前页面中找到有关水体固有光学特性的产品数据（Inherent Optical Properties from GIOP Algorithm），点击进入。

![oceancolor-2.png](/images/oceancolor-2.png "查找固有光学特性的产品数据")

在该页面中有详细的 $b_b$ 数据来源与算法说明，在页面的末尾也提供了相关研究的参考文献。

![oceancolor-3.png](/images/oceancolor-3.png "查找水体后向散射系数算法说明")

### 数据下载

首先进入「DATA」中的「Direct Data Access」，这里是数据存放的目录。

![oceancolor-4.png](/images/oceancolor-4.png "进入数据存放目录")

然后依次点击 「 MODIS-Aqua」->「Mapped」->「Monthly」->「4km」，进入 4km 深度范围的测量数据目录。

![oceancolor-5.png](/images/oceancolor-5.png "进入水体后向散射系数数据产品目录")

这里我们就能获取到从 2002 年至今的全部 *b<sub>b</sub>*(443) 数据。找到我们想要的 3 月数据，点击即可下载。这里我们不难看出数据产品编号的规律。产品名称并没有标注月份，编号的开头 `A` 后面标注的是数据获取的年份与天数。我们获取的数据开头是 `A20190602019090`，也就表明该数据是 2019 年第 60 天至 2019 年第 90 天的数据。

![oceancolor-6.png](/images/oceancolor-6.png "查找 2019 年 3 月数据")

{{< notice notice-note >}}
注意：目前网站数据的下载可能需要注册用户，直接进行注册即可。
{{< /notice >}}

我去年在学院的某研究项目中摸鱼的时候用到了这些数据产品，写了一些 MATLAB 脚本对该数据进行处理，目前已经将脚本整理打包放在了 GitHub 仓库中，如有需要可以参考。

{{< github name="Organic-Carbon-Estimating" link="https://github.com/guanqr/Organic-Carbon-Estimating" description="A program used in estimating organic carbon stocks in oceans. 计算指定海域的有机碳存量，包括颗粒有机碳与溶解有机碳，数据依赖于 NASA 中分辨率成像光谱仪 MODIS 遥感产品。" color="#e16737" language="MATLAB">}}

[^1]: 图源：[NASA Ocean Color](https://oceancolor.gsfc.nasa.gov/)