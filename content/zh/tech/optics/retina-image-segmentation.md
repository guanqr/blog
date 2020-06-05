+++
title = "OCT 视网膜图像分割"
date = "2020-06-03T09:37:37+08:00"
tags = ["image-processing","matlab"]
series = ["major-courses"]
toc = true
+++

光学相干断层扫描技术（Optical Coherence Tomography，OCT）是一种利用低相干光从散射介质中获取微米级分辨率的二维或三维图像的技术[^1]。本学期的「机器视觉与图像处理」课程的老师是激光生物医学研究所的研究光学成像技术的老师，因此期末作业就是与 OCT 技术相关的内容——OCT 视网膜图像分割。关于该课程的其他三次作业内容，请查看我的另一篇文章：《[数字图像处理基础练习](/tech/optics/digital-image-processing-practice/)》。

## 题目要求

人眼视网膜由多层组织构成，利用给出的 OCT 视网膜断层图，实现如下图所示的图像分割。给出分割处理方法、结果、程序代码，分析讨论分割方法的稳定性。

![retina-image-segmentation-0.jpg](/images/retina-image-segmentation-0.jpg "图 1：示例图像")

其实题目仅仅要求画出 Vitreous, NFL, RPE 三条线，不过我了解到在以往的课程中，同学们都画出了全部 8 条线，所以我也就尝试画出了 8 条线。关于这种图像的分割方法，老师提供了一个参考程序：

{{< github name="pangyuteng / caserel" link="https://github.com/pangyuteng/caserel" description="computer-aided segmentation of retinal layers in OCT images" color="#e16737" language="MATLAB">}}

然而该程序看起来有些复杂，在这么短时间内看懂是很困难的。这个作业毕竟只是个期末作业，自己从零开始写代码也是可以的。

## 问题分析

老师提供了 12 幅需要处理的图像，这些图像可以分为两类，一类是上端较为平滑的，一类是上端凹陷的。这两类图由于差异较大，在部分区域进行分割的时候会有一定的困难。下面我主要详细讲述如何画出 Vitreous, NFL, RPE 三条线，其他线的提取操作与之类似，就不再过多赘述，只讲一讲图像处理中比较困难的地方。

![retina-image-segmentation-1.png](/images/retina-image-segmentation-1.png "图 2：需要处理的 12 幅图像")

### Vitreous 层

通过观察所给的示意图可知，Vitreous 层是断层图中最上面的一层。该层与背景黑色的边界清晰，因此分割该层很容易。可以考虑先试用中值滤波去除背景噪点的干扰，然后使用大津法确定合适的二值化阈值，进行二值化操作。

```matlab
I0 = imread('1.tif');
I1 = medfilt2(I0,[5, 5]); % 中值滤波
thresh = graythresh(I1); % 大津法全局阈值调整
I2 = imbinarize(I1, thresh); % 二值化
```

对三幅图（#1、#2、#11）进行处理，得到的结果如图 3 至图 5 所示，可以看出效果良好。

![retina-image-segmentation-2.png](/images/retina-image-segmentation-2.png "图 3：Vitreous 层二值化（1）")

![retina-image-segmentation-3.png](/images/retina-image-segmentation-3.png "图 4：Vitreous 层二值化（2）")

![retina-image-segmentation-4.png](/images/retina-image-segmentation-4.png "图 5：Vitreous 层二值化（3）")

接着对二值化后的图像进行边缘提取。这里我是使用的是 Canny 算子进行边缘检测。完成后对整幅图逐个像素点从上至下，从左至右进行遍历，提取最上层白点的边缘。具体代码如下。

```matlab
[m, n] = size(I0);

for j = 1:n
    ymin(j) = m;
end

for i = 1:m
    for j = 1:n
        if I3(i, j) == 1
            if i < ymin(j)
                ymin(j) = i;
            elseif i < ymin(j) + 10 && j ~= 2
                if I3(i, j+1) == 1 && I3(i, j-1) == 1
                    I3(i,j) = 0;
                end
            else
                I3(i,j) = 0;
            end
        end
    end
end
```

图 6 和图 7 所示的是对第一幅图（#1）进行边缘检测和提取最上层边缘线条的结果。

![retina-image-segmentation-5.png](/images/retina-image-segmentation-5.png "图 6：Vitreous 层边缘检测")

![retina-image-segmentation-6.png](/images/retina-image-segmentation-6.png "图 7：Vitreous 层提取最上层边缘")

目前已经将 Vitreous 层的边缘提取出来，只需要对该条线上的每个点进行拟合，形成一条曲线即可，具体代码如下所示。

```matlab
k = 1;
for i = 1:m
    for j = 1:n
        if I3(i,j) == 1
            if i == ymin(j)
                yV(k) = i;
                xV(k) = j;
                k = k + 1;
            end
        end
    end
end

imshow(I0);
hold on;

% 绘制边界
pV = polyfit(xV, yV, 10);
y1V = polyval(pV, xV);
xxV = linspace(1, n, 300);
yyV = spline(xV, y1V, xxV);
V = plot(xxV, yyV, '-', 'LineWidth', 1, 'color', 'b');
legend('Vitreous');
```

对不同的图像（#1、#2、#11）进行处理，得到的结果如下。

![retina-image-segmentation-7.png](/images/retina-image-segmentation-7.png "图 8：Vitreous 层结果（1）")

![retina-image-segmentation-8.png](/images/retina-image-segmentation-8.png "图 9：Vitreous 层结果（2）")

![retina-image-segmentation-9.png](/images/retina-image-segmentation-9.png "图 10：Vitreous 层结果（3）")

### NFL 层

NFL 层的检测有些困难，因为该层上下区域的灰度对比不是很明显，有的图像用肉眼看也十分难以辨别出 NFL 层的位置。由此可见，直接使用和提取 Vitreous 层相同的做法是不可行的。在多次尝试后，我发现在图像处理的第一步使用直方图均衡化的方法，能够很好地突出 NFL 层上下区域的差异。然后再使用大津法，对图像进行二值化操作，便能够较为有效地提取出所需区域。

```matlab
I0 = imread('1.tif');
I1 = histeq(I0); 
thresh = graythresh(I1);
I2 = imbinarize(I1, thresh+0.46);
```

对三幅图（#1、#2、#11）进行处理，效果如下所示。可以看出，上层较为平滑的图像，其 NFL 层和 Vitreous 层之间的区域较宽，能够很好地分辨。但如图 11 和图 12 所示的上层下凹的图像，该区域较薄，不易分辨。

![retina-image-segmentation-10.png](/images/retina-image-segmentation-10.png "图 11：NFL 层二值化（1）")

![retina-image-segmentation-11.png](/images/retina-image-segmentation-11.png "图 12：NFL 层二值化（2）")

![retina-image-segmentation-12.png](/images/retina-image-segmentation-12.png "图 13：NFL 层二值化（3）")

为了提取 NFL 层，需要排除其他层的干扰。这里我同样采用了遍历整幅图的方法，从上至下，首先检测出第一个白点，然后去除白点下方一定距离外区域的所有白点。

```matlab
[m, n] = size(I0);

for j = 1:n
    for i = 1:m
        if I2(i, j) == 1
            for k = i+20:m
                I2(k, j) = 0;
            end
        end
    end
end

% 确定第一个点
for i = 1:m
    if I2(i, j) == 1
        k = i;
    end
end

% 去除下方多余的点
for j = 1:n
    for i = k+140:m
        I2(i, j) = 0;
    end
end
```

如果这种二值化图像z直接采用 Vitreous 层所用的 Canny 算子进行边缘检测，效果肯定很不好，因为该二值化后的图像上的点是杂散分布的，点与点之间距离很大，并未连通。可以考虑使用闭运算将距离较近的点进行连通，其效果如图 14 至图 16 所示。

```matlab
% 闭运算连通
I3 = imclose(I2, ones(3));
```

![retina-image-segmentation-13.png](/images/retina-image-segmentation-13.png "图 14：NFL 层闭运算（1）")

![retina-image-segmentation-14.png](/images/retina-image-segmentation-14.png "图 15：NFL 层闭运算（2）")

![retina-image-segmentation-15.png](/images/retina-image-segmentation-15.png "图 16：NFL 层闭运算（3）")

接着就可以提取 NFL 层的曲线。因为图 15 和图 16 中，仍有较多的点并未连通，因此决定不采用 Canny 算子边缘检测。如果直接由下至上遍历图像，提取第一次出现的白点，那么由于部分图像下方的杂散点太多，会影响边界的确认。因此依然考虑从上至下遍历，在同一个纵行，如果出现的第一个像素点是白点，贴紧该点的下方像素点依然是白点的话，那么就将该点去除，保留下方的点。如果该点为白点，其下方的点为黑色，那么该点下方的所有点都改为黑色。

```matlab
% 提取底部轮廓
for j = 1:n
    for i = 1:m
        if I3(i, j) == 1 && I3(i+1, j) == 1
            I3(i, j) = 0;
        elseif I3(i, j) == 1 && I3(i+1, j) == 0 % 去除底部多余杂点
            for k = i+1:m
                I3(k, j) = 0;
            end
        end
    end
end
```

其效果如下所示。效果还算可以，能够辨别出该条线的区域在哪里。

![retina-image-segmentation-16.png](/images/retina-image-segmentation-16.png "图 17：NFL 层边缘提取（1）")

![retina-image-segmentation-17.png](/images/retina-image-segmentation-17.png "图 18：NFL 层边缘提取（2）")

![retina-image-segmentation-18.png](/images/retina-image-segmentation-18.png "图 19：NFL 层边缘提取（3）")

最后就是将该边缘进行函数拟合，然后绘制出来。

```matlab
I4 = I3;
for j = 1:n
    ymax(j) = 1;
end
for i = 1:m
    for j = 1:n
        if I4(i,j) == 1
            if i > ymax(j)
                ymax(j) = i;
            end
        end
    end
end

k = 1;
for i = 1:m
    for j = 1:n
        if I4(i,j) == 1
            if i == ymax(j)
                yN(k) = i;
                xN(k) = j;
                k = k+1;
            end
        end
    end
end

imshow(I0);
hold on;

pN = polyfit(xN, yN, 8);
y1N = polyval(pN, xN);
xxN = linspace(1, n);
yyN = spline(xN, y1N, xxN);
N = plot(xxN, yyN, '-', 'LineWidth', 1, 'color', 'g');
legend('NFL');
```

![retina-image-segmentation-19.png](/images/retina-image-segmentation-19.png "图 20：NFL 层结果（1）")

![retina-image-segmentation-20.png](/images/retina-image-segmentation-20.png "图 21：NFL 层结果（2）")

![retina-image-segmentation-21.png](/images/retina-image-segmentation-21.png "图 22：NFL 层结果（3）")

由于图像的边界模糊，提取出来的边缘并不太连续，周围有很多杂散点，因此拟合出来的曲线在部分图中稍微有些偏离。不过曲线主体大部分是与 NFL 层吻合的。

### RPE 层

RPE 层的分辨较 NFL 层容易很多，但是因为其与下方区域的边界灰度值较高，因此不太好确定具体的边界。直接进行二值化操作，图像的下方会出现很多杂散点。因此我先使用了伽马变换提高图像的灰度值，便于区分。然后使用上述同样的方法进行二值化操作，具体代码和处理后的图像如下。

```matlab
I0 = imread('1.tif');
I1 = medfilt2(I0,[5, 5]);
I1 = imadjust(I1,[],[],1.5); % 伽马变换
thresh = graythresh(I1);
I2 = imbinarize(I1, thresh+0.17);
```

![retina-image-segmentation-22.png](/images/retina-image-segmentation-22.png "图 23：RPE 层二值化（1）")

![retina-image-segmentation-23.png](/images/retina-image-segmentation-23.png "图 24：RPE 层二值化（2）")

![retina-image-segmentation-24.png](/images/retina-image-segmentation-24.png "图 25：RPE 层二值化（3）")

然后考虑提取最下方边缘的曲线。由于是最下方的曲线，因此可以使用由下至上的遍历方法。保留同一列第一次出现的白点。但因为下方仍存在部分杂散点，曲线存在间断，拟合曲线的时候会在间断处发生明显的偏移，所以我使用了膨胀操作，然后保留连通的最大区域，再一次进行遍历，保留同一列第一次出现的白点，即为下边界。具体代码如下所示。

```matlab
I3 = edge(I2, 'canny'); 

% 边界特征提取
[m, n] = size(I0);

for j = 1:n
    ymin(j) = 1;
end

for i = m:-1:1
    for j = 1:n
        if I3(i, j) == 1
            if i > ymin(j)
                ymin(j) = i;
            else
                I3(i,j)=0;
            end
        end
    end
end

%区域膨胀，连通边缘
B1 = [0 0 0
      1 1 1
      0 0 0];
for i = 1:6
    I3 = imdilate(I3, B1);
end
B2 = [0 1 0
      1 1 1
      0 1 0];
for i = 1:4
    I3 = imdilate(I3, B2);
end

imLabel = bwlabel(I3); % 对各连通域进行标记
stats = regionprops(imLabel, 'Area'); % 求各连通域的大小
area = cat(1, stats.Area);
index = find(area == max(area)); % 求最大连通域的索引
I3 = ismember(imLabel, index); % 获取最大连通域图像

% 提取下边界特征
for j = 1:n
    ymin(j) = 1;
end

for i = m:-1:1
    for j = 1:n
        if I3(i, j) == 1
            if i > ymin(j)
                ymin(j) = i;
            else
                I3(i,j)=0;
            end
        end
    end
end
```

通过上述操作处理后的图像如下所示。因为进行了膨胀操作，在图像边缘部分，有些杂散点也与 RPE 层曲线连通，因此在一些图像的边缘部分，曲线并不太理想。不过进行膨胀操作，能够有效地避免了曲线的间断。

![retina-image-segmentation-25.png](/images/retina-image-segmentation-25.png "图 26：RPE 层边缘提取（1）")

![retina-image-segmentation-26.png](/images/retina-image-segmentation-26.png "图 27：RPE 层边缘提取（2）")

![retina-image-segmentation-27.png](/images/retina-image-segmentation-27.png "图 28：RPE 层边缘提取（3）")

最后同样是通过提取的边缘数据进行曲线拟合与绘制。

```matlab
k = 1;
for i = 1:m
    for j = n:-1:1
        if I3(i,j) == 1
            if i == ymin(j)
                yV(k) = i;
                xV(k) = j;
                k = k + 1;
            end
        end
    end
end

imshow(I0);
hold on;

%绘制边界
pV = polyfit(xV, yV, 10);
y1V = polyval(pV, xV);
xxV = linspace(1, n, 300);
yyV = spline(xV, y1V, xxV)-4;
V = plot(xxV, yyV, '-', 'LineWidth', 1, 'color', 'm');
legend('RPE');
```

![retina-image-segmentation-28.png](/images/retina-image-segmentation-28.png "图 29：RPE 层结果（1）")

![retina-image-segmentation-29.png](/images/retina-image-segmentation-29.png "图 30：RPE 层结果（2）")

![retina-image-segmentation-30.png](/images/retina-image-segmentation-30.png "图 31：RPE 层结果（3）")

### 其他层

对于其余的 5 条曲线的识别与绘制，方法与前三种类似。先确定合适的阈值做二值化处理，根据不同的阈值，二值化后保留的图像有所不同。然后根据所需要的结构对其余部分进行去除，接着进行遍历操作，上层的曲线就从上至下遍历，下层的曲线就从下至上遍历。最后根据保留的点进行曲线拟合与绘制即可。由于操作方法类似，这里就不再赘述，只对部分特殊情况进行分析。

在图像处理中，比较特殊的是提取 GCL 层。对于平滑的图像操作和提取其他曲线一样，能够直接得到想要保留的结构，但对于下凹的图像来说，进行二值化处理后，会得到如图 32 所示的图像。还需要对图 33 中红线圈出的区域进行去除。

```matlab
I0 = imread('1.tif');
[m, n] = size(I0);
I1 = medfilt2(I0, [5, 5]);
thresh = graythresh(I1);
I2 = imbinarize(I1, thresh+0.08);

I3 = imclose(I2, ones(5));

for j = 1:n
    for i = 1:m
        if I3(i, j) == 1
            for k = i+100:m
                I3(k, j) = 0;
            end
        end
    end
end
```

![retina-image-segmentation-31.png](/images/retina-image-segmentation-31.png "图 32：GCL 层二值化")

![retina-image-segmentation-32.png](/images/retina-image-segmentation-32.png "图 33：GCL 层待去除的部分")

为此，我们需要对下凹的图像进行单独的处理，这就需要先检测出哪一幅图是下凹的。这里我使用的方法是，在边缘处由上至下遍历，找到第一个白点，作为最小值，在图像中间位置由上至下遍历，找到第一个白点，作为最大值，二者之差如果大于一定的数值，就表明上层下凹的程度大，是下凹图像。这样，就能分别对平滑图像和下凹图像分别处理。为了去除红线圈出区域的白点，因为线条的变化是不规则的，使用循环语句很容易将需要保留的白点去除，所以我对图像划分为五个区域分别去除。

```matlab
% 判断是否下凹
for i = 1:m
    if I3(i, 50) == 1
        imin = i;
        break;
    end
end

for i = 1:m
    if I3(i, 150) == 1
        imax = i;
        break;
    end
end

if imax - imin > 60
    % 去除凹形多余白色区域
    for j = 1:n
        for k = imin+120:m
            I3(k, j) = 0;
        end
    end
    I3 = medfilt2(I3, [2, 2]);
    % 左 1
    for i = m:-1:1
        if I3(i, 80) == 1
            del = i;
            break;
        end
    end
    for j = 1:80
        for k = del-30:del
            I3(k, j) = 0;
        end
    end
    % 左 2
    for i = m:-1:1
        if I3(i, 120) == 1
            del = i;
            break;
        end
    end
    for j = 80:140
        for k = del-15:del+20
            I3(k, j) = 0;
        end
    end
    % 右 1
    for i = m:-1:1
        if I3(i, 160) == 1
            del = i;
            break;
        end
    end
    for j = 180:220
        for k = del-8:del+20
            I3(k, j) = 0;
        end
    end
    % 右 2
    for i = m:-1:1
        if I3(i, 240) == 1
            del = i;
            break;
        end
    end
    for j = 220:260
        for k = del-20:del+20
            I3(k, j) = 0;
        end
    end
    % 右 3
    for j = 260:300
        for k = del-30:del+20
            I3(k, j) = 0;
        end
    end
else
    imLabel = bwlabel(I3);
    stats = regionprops(imLabel, 'Area');
    area = cat(1, stats.Area);
    index = find(area == max(area));
    I3 = ismember(imLabel, index);
    % 针对第 10 幅图需要单独删除多余区域
    for j = 1:n
        for i = 1:m
            if I3(i, j) == 1
                for k = i+70:m
                    I3(k, j) = 0;
                end
            end
        end
    end
end
```


## 结果讨论

对三幅图（#1、#2、#11）进行处理，程序运行效果如下图所示。从图中可以看出，整体效果良好。如果是边缘较为平滑的图像，标注的结果精确度较高。然而如果是下凹较为明显以及图像灰度有间断的图像，其标注的结果在边缘部分和下凹的中心区域的偏差较大，部分曲线出现波动，也会发生交错的现象。对于以上问题，由于个人能力有限，目前还没有能够完美解决的方法。

![retina-image-segmentation-33.png](/images/retina-image-segmentation-33.png "图 34：最终结果（1）")

![retina-image-segmentation-34.png](/images/retina-image-segmentation-34.png "图 35：最终结果（2）")

![retina-image-segmentation-35.png](/images/retina-image-segmentation-35.png "图 36：最终结果（3）")

本文中所用的程序代码已经整理放在了 GitHub 仓库中，仅供个人参考。

{{< github name="Retina-Image-Segmentation" link="https://github.com/guanqr/Retina-Image-Segmentation" description="Image segmentation of retinal analysis with optical coherence tomography. OCT 视网膜断层图的图像分割程序。" color="#e16737" language="MATLAB">}}

[^1]: 参考：[Optical coherence tomography | Wikipedia](https://en.wikipedia.org/wiki/Optical_coherence_tomography)