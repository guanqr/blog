+++
title = "使用 MATLAB 和 Dcraw 处理 RAW 图像文件"
date = "2020-04-08T19:52:40+08:00"
tags = ["color","image","matlab","white-balance"]
toc = false
katex = true
+++

本学期正在学习有关数字图像处理的课程，今天课堂讨论的时候，忽然回忆起去年的一门实验课的内容——分析相机成像的像质。我在那时写了一篇相关内容的[总结](/tech/optics/preliminary-image-quality-evaluation/)，其中提到了一位学长所写的使用最为原始的方法对相机的 RAW 原始图像文件进行处理的[文章](https://ridiqulous.com/process-raw-data-using-matlab-and-dcraw/)，直到现在我才对其中的原理有了一定系统性的了解。于是，按照那篇文章的教程，我使用 MATLAB 和 Dcraw 对 RAW 文件进行了处理。

## 前言

数码相机的 RAW 文件存储的是相机拍摄的最为原始的、未被处理的数据。相比于经过压缩的 JPEG 文件，RAW 文件记录了更多的场景信息，保留了更宽广的色域以及动态范围，也留下了更为自由的后期处理空间。不同厂商的相机一般都拥有自己的 RAW 格式，比如常见的 CR2、NEF、ARW、DNG 等。[^1]

一般来说，处理 RAW 文件的软件有 Camera Raw、LightRoom 等，这些都是通过简单的图形界面对图像的颜色、曝光度、白平衡等进行直观的操作。对于摄影、媒体、艺术领域，这些软件已经足够强大，但是在图像处理、计算机视觉等研究领域，我们需要的是把照片中的信息转换为能够通过数字来定量表示的形式，或者通过一些公式、算法直接对图像（或图像的某一部分）进行处理，再或者对两张图片之间的差别进行量化表示，这时候 LightRoom 这些软件就显得有些无能为力了。

使用 MATLAB 对 RAW 文件进行处理并从中提取出我们想要的图像信息，这是一种最彻底、最根本的获取相机传感器原始信息的方法，并且这些信息都是以数字的形式记录下来，可以很方便地在此基础上进行图像的存储、传输或者进一步操作。

## Dcraw 预处理

由于各家相机厂商对 RAW 文件采取了不同的封装方式，MATLAB 并不能一一识别这些文件格式，因此我们需要先利用 Dcraw 将不同扩展名的文件转换为 MATLAB 能够读取的图片格式——tiff。Dcraw 是一种 RAW 文件解析方案，它能够识别市面上大部分的相机型号，并将相应的 RAW 文件导出为 tiff 或 PGM/PPM/PAM 格式文件。事实上 Dcraw 本身就可以算作一种 RAW 文件的处理程序，它拥有白平衡设置、伽马校正、色彩空间转换、去马赛克、亮度调节等一系列功能，并且提供了 C 源代码[^2]，让用户可以在任何操作系统上对其进行编译。这里我们仅仅把它作为 Raw 文件到 tiff 的一种媒介，而不对图像做任何的处理——把所有的操作都留到 MATLAB 里。

我们要把可执行文件 dcraw.exe 放在 `C:\windows` 路径下，这样可以直接从运行（`Win` + `R`）中执行。在运行中输入 cmd 进入命令行窗口，这时已经可以直接调用 Dcraw，或者输入 `dcraw` 查看相关的一些命令。

![raw-process-0.png](/images/raw-process-0.png)

由于我们不准备用 Dcraw 对 RAW 文件做任何处理，只需要输入：

```sh
dcraw -4 -T -D -v pathfilename
```

其中 `pathfilename` 为 RAW 图像文件的路径。这里的 `-T` 表示将图像以 tiff 格式导出，`-D` 表示不对图像做任何的彩色插值和亮度调节，`-v` 表示在 Dcraw 处理结束后在屏幕上显示相关信息，而 `-4` 等价于 `-6 -W -g 1 1`，即表示导出的图像为 16 位（而不是常见的 JPEG 的 8 位 ）、不进行任何白平衡校正、不进行任何伽马校正。在一些需要获取拍照时白平衡设置的场合也可以使用 `-6 -w -g 1 1 -T -D` 这样的参数组合，但这里我们使用 `-4 -T -D` 就好。各参数的意义在官方文档页面中有详细的说明。

由于目前身边没有相机，我使用了去年实验课中用 Canon EOS 1100D 在 TL84 光源下拍摄的一幅 24 色色卡图。运行：

```sh
dcraw -4 -T -D -v image.CR2
```

得到了 tiff 格式的图像如下图所示。这里可以看出得到的 tiff 图像是灰度图像，只记录了光强度的信息，不包含任何颜色信息。由于各个像素上记录的光强度是一个标量，这幅图像相当于一个 $m\times n$ 的矩阵，其中 $m$ 和 $n$ 分别为 CMOS 纵向和横向的像素数。

![raw-process-1.png](/images/raw-process-1.png)

我使用 FastStone Image Viewer 软件能够直接浏览 RAW 文件和 tiff 文件，对于 RAW 文件来说，虽然我们在图像查看器中能够看到图像，但软件中展示的图像只是嵌入在 RAW 文件中的经过一系列转码的缩略图而并非 RAW 本身。为了避免各种图像浏览软件不同的解码方式对预览图像造成的影响，下面都使用 MATLAB 中的 `imshow` 函数来浏览图像。

我们先在 MATLAB 中读取该图像，再进行后面的处理：

```matlab
raw = double(imread('image.tiff'));
```

## 线性处理

出于节省数据存储空间的目的，一些厂商的 RAW 文件并不完全与像素点上的照度呈线性关系，而是会在编码上做一些处理，比如非线性压缩等。不过这里我们不需要担心这个问题，因为之前在 Dcraw 中使用 `-4` 参数时就已经解决了这个问题。我们只要确保各个像素的数值是分布在 14-bit（虽然 Dcraw 中的 `-4` 参数将图像设为 16 位，但其最大值仍然为 $2^{14}-1=16383$）能够储存的范围之间即可，一般为 $0\sim 16383$，并将超出这个区间的数值给拉回区间中。再将这些数值归一化至 $0\sim 1$ 区间中。

```matlab
black = 2047;
saturation = 13584;
lin_bayer = (raw-black)/(saturation-black); % 归一化至 [0,1]
lin_bayer = max(0,min(lin_bayer,1)); % 确保没有大于 1 或小于 0 的数据
```

这里的 `black` 和 `saturation` 两个参数的数值需要对 RAW 文件通过 `dcraw -v -T` 命令查看，因为不同的厂家和不同的相机型号该数值都可能不同。

![raw-process-2.png](/images/raw-process-2.png)

这一步我们得到的图像如下图所示。

![raw-process-3.png](/images/raw-process-3.png)

## 白平衡校正

这一步的操作是对 RGB 三通道乘上不同的增益系数，以补偿因为三种滤波片具有不同光谱灵敏度带来的影响。如果不考虑图像亮度，将 R 通道乘以2并保持 G 通道不变，或者将 G 通道乘以 0.5 并保持 R 通道不变，这两种方式对画面颜色变化的影响是等效的。因此我们通常将 G 通道的增益系数固定为1，仅仅考虑 R 和 B 的系数。关于这两个系数具体数值应该取多少，则取决于相机的型号以及拍摄时使用的白平衡参数。在相机的白平衡设置里选择不同场景，就是在调整这两个增益系数。如果想还原为拍摄时使用的白平衡设置，可以在 Dcraw 中使用 `-w -v` 参数，这时屏幕上会显示出当时所使用的 R、B 通道的增益系数。

![raw-process-4.png](/images/raw-process-4.png)

上图中的 2.639648 和 1.319336 分别表示拍摄这张图像时所使用的 R 通道和 B 通道的增益。这里要注意的是，一旦使用了 `-w` 参数，Dcraw 就会自动完成彩色插值的工作，这样得到的 tiff 图像就不再是原始灰度图像了。因此我们仅仅是使用 `-w` 来查看增益系数。得到了 R、B 通道的增益后，我们需要将相应的像素值乘上这个系数。不同相机具有不同的拜耳滤镜排列方式，因此需要根据实际情况进行增益系数的乘法。这里我使用的是相机拍摄时的白平衡参数，即 `r_multiplier = 2.639648` 和 `b_multiplier = 1.319336`。

```matlab
wb_multipliers = [2.639648, 1, 1.319336]; % for particular condition, from dcraw;
mask = wbmask(size(lin_bayer,1),size(lin_bayer,2),wb_multipliers,'rggb');
balanced_bayer = lin_bayer .* mask;
```

上面代码中的 `wbmask` 函数是根据实际拜耳滤镜的排列生成对应的掩板：

```matlab
function colormask = wbmask(m,n,wbmults,align)
% COLORMASK = wbmask(M,N,WBMULTS,ALIGN)
% Makes a white-balance multiplicative mask for an image of size m-by-n
% with RGB while balance multipliers WBMULTS = [R_scale G_scale B_scale].
% ALIGN is string indicating Bayer arrangement: 'rggb','gbrg','grbg','bggr'
colormask = wbmults(2) * ones(m,n); % Initialize to all green values;
switch align
    case 'rggb'
        colormask(1:2:end,1:2:end) = wbmults(1);
        colormask(2:2:end,2:2:end) = wbmults(3);
    case 'bggr'
        colormask(2:2:end,2:2:end) = wbmults(1);
        colormask(1:2:end,1:2:end) = wbmults(3);
    case 'grbg'
        colormask(1:2:end,2:2:end) = wbmults(1);
        colormask(2:2:end,1:2:end) = wbmults(3);
    case 'gbrg'
        colormask(2:2:end,1:2:end) = wbmults(1);
        colormask(1:2:end,2:2:end) = wbmults(3);
    end
end
```

完成白平衡调整后的图像如下：

![raw-process-5.png](/images/raw-process-5.png)

## 色彩差值

色彩差值又称去马赛克，经过色彩插值之后原来的灰度图像就成为了一幅三通道的彩色图像。空间插值有非常多的方法，这里为了方便我们使用 MATLAB 内置的 `demosaic` 函数，它能够直接把单通道的灰度图像转换为三通道的彩色图像。由于 `demosaic` 函数的输入必须为 uint8 或 uint16 类型，我们需要把原来的 double 型先转换为 uint16 型。注意这里的 `'rggb'` 应该根据相机的具体情况而调整。

```matlab
temp = uint16(balanced_bayer/max(balanced_bayer(:)) * (2^16-1));
lin_rgb = double(demosaic(temp,'rggb'))/(2^16-1);
```

完成这一步之后我们就得到了最原始的彩色信息。一些应用中所需要的就是这幅图像的数据，可以使用 `imwrite` 函数将其保存在硬盘中。后续的色彩空间转换、Gamma 校正等步骤视情况决定是否需要执行。色彩插值后得到的图像如下：

![raw-process-6.png](/images/raw-process-6.png)

## 色彩空间转换

同样一幅图像文件分别在两台显示器上显示，其各个像素的 RGB 值肯定是一样的，但是人眼看上去往往都存在细微的颜色偏差，这就是因为 RGB 色彩空间是设备相关的，而任何两台显示器的 RGB 色彩空间一般都不会完全相同。为了使一幅图片在各种显示设备上有尽量一致的视觉效果，我们就需要一个设备无关的色彩空间作为传递媒介。目前在电子设备中用的最多的设备无关的色彩空间（有时也称绝对色彩空间）就是 sRGB 和 AdobeRGB。如果在 Dcraw 中使用了色彩插值，则自动包含了一个色彩空间变换的过程。Dcraw 先将相机相关的 RGB 空间转换至 XYZ 空间，然后再从 XYZ 转换到 sRGB 作为输出。在 MATLAB 中我们将这两个步骤合二为一。对于大部分相机，我们可以得到从 XYZ 空间到相机相关空间的变换关系，即已知 *XYZ-to-Camera*。而作为两种绝对色彩空间，*sRGB-to-XYZ* 也是固定的。根据矩阵运算法则，我们可以得到从相机相关空间到 sRGB 空间的变换关系：

<div>
$$
A_{sRGB\leftarrow Camera}=(A_{Camera\leftarrow XYZ}\cdot A_{XYZ\leftarrow sRGB})^{-1}
$$
</div>

不同相机的 *Camera* 不同，因此我们必须获得适合自己相机的 $A_{Camera\leftarrow XYZ}$。在 Dcraw 的 C 文件中收集了市面上大多数相机的 ，可以在 dcraw.c 中的 `adobe_coeff` 函数下找到。`adobe_coeff` 函数下的数字是 $A_{Camera\leftarrow XYZ}$ 中各元素乘以 10000 后逐行排列的数值。

![raw-process-7.png](/images/raw-process-7.png)

我使用的 Canon EOS 1100D 有：

```c
{ "Canon EOS 1100D", 0, 0x3510,
{ 6444,-904,-893,-4563,12308,2535,-903,2016,6728 } }
```

在原文中，作者说也可以使用 [Adobe DNG Converter](https://supportdownloads.adobe.com/detail.jsp?ftpID=6881) 软件来查看相机的 $A_{Camera\leftarrow XYZ}$，但我并没有找到安装路径下的 meta_info.ColorMatrix2 文件……

我们得到的数值对应了矩阵中逐列排列的各元素。以 Canon EOS 1100D 为例，有：

<div>
$$
A_{Camera\leftarrow XYZ}=\frac{1}{10000}
\begin{bmatrix}
6444&-904&-893\\
-4563&12308&2535\\
-903&2016&6728
\end{bmatrix}
$$
</div>

而 *sRGB-to-XYZ* 可以在国际照明委员会（CIE）公布的标准中查到，有：

<div>
$$
A_{XYZ\leftarrow sRGB}=
\begin{bmatrix}
0.4124564&0.3575761&0.1804375\\
0.2126729&0.7151522&0.0721750\\
0.0193339&0.1191920&0.9503041
\end{bmatrix}
$$
</div>

得到了这两个矩阵，自然也就能够算出 $A_{sRGB\leftarrow Camera}$。在色彩空间转换过程中必须考虑这样一个问题：由于白色（客观意义上的白色）在相机的 RGB 空间和 sRGB 空间中都是用 $[1,1,1]^{T}$ 来表示，而我们上述白平衡调整的目的就是要确保图像中白色的部分在任何空间中都呈现出白色。因此以下关系必须成立：

<div>
$$
\begin{bmatrix}
1\\
1\\
1
\end{bmatrix}_{Camera}
=
\Bigg[A_{Camera\leftarrow sRGB}\Bigg]
\begin{bmatrix}
1\\
1\\
1
\end{bmatrix}_{sRGB}
$$
</div>

根据线性代数的知识，要满足上式，矩阵 $A_{Camera\leftarrow sRGB}$ 的每一行元素之和必须为 1，因此在 MATLAB 中我们必须再加上一个步骤，将 $A_{Camera\leftarrow sRGB}$ 各行归一化为 1。色彩空间变换的代码如下。注意矩阵 `XYZ2Cam` 请根据自己使用的相机型号进行修改。

```matlab
sRGB2XYZ = [0.4124564 0.3575761 0.1804375;0.2126729 0.7151522 0.0721750;0.0193339 0.1191920 0.9503041];
% sRGB2XYZ is an unchanged standard
XYZ2Cam = [6444,-904,-893;-4563,12308,2535;-903,2016,6728]/10000;
% Here XYZ2Cam is only for Canon EOS 1100D, can be found in adobe_coeff in dcraw.c
sRGB2Cam = XYZ2Cam * sRGB2XYZ;
sRGB2Cam = sRGB2Cam./ repmat(sum(sRGB2Cam,2),1,3); % normalize each rows of sRGB2Cam to 1
Cam2sRGB =  (sRGB2Cam)^-1;
lin_srgb = apply_cmatrix(lin_rgb, Cam2sRGB);
lin_srgb = max(0,min(lin_srgb,1)); % Always keep image clipped b/w 0-1
```

其中 `apply_cmatrix` 函数就是把我们得到的 $A_{sRGB\leftarrow Camera}$ 应用到原图像的各个通道上：

```matlab
function corrected = apply_cmatrix(im,cmatrix)
% Applies CMATRIX to RGB input IM. Finds the appropriate weighting of the
% old color planes to form the new color planes, equivalent to but much
% more efficient than applying a matrix transformation to each pixel.
if size(im,3) ~=3
    error('Apply cmatrix to RGB image only.');
end
r = cmatrix(1,1) * im(:,:,1)+cmatrix(1,2) * im(:,:,2)+cmatrix(1,3) * im(:,:,3);
g = cmatrix(2,1) * im(:,:,1)+cmatrix(2,2) * im(:,:,2)+cmatrix(2,3) * im(:,:,3);
b = cmatrix(3,1) * im(:,:,1)+cmatrix(3,2) * im(:,:,2)+cmatrix(3,3) * im(:,:,3);
corrected = cat(3,r,g,b);
```

经过色彩空间变换后的图像如下，可以看出相比变换之前的图像，各个彩色色块饱和度明显增加。

![raw-process-8.png](/images/raw-process-8.png)

## 亮度校正与伽马校正

对于大部分处于研究目的的图像处理流程，这一步不建议执行。在这一步之前，我们得到的图像仍然是与拍摄场景呈线性的，而线性数据往往才是对分析图像有帮助的。但是为了得到更好的显示效果，亮度与 Gamma 校正通常是必不可少的。根据经验，一张图像的平均亮度是像素最大值的四分之一时我们认为它是亮度合适的。因此我们调整全局亮度使其符合这一假设：

```matlab
grayim = rgb2gray(lin_srgb); % Consider only gray channel
grayscale = 0.25/mean(grayim(:));
bright_srgb = min(1,lin_srgb * grayscale); % Always keep image value less than 1
```

亮度校正后的图像如下所示：

![raw-process-9.png](/images/raw-process-9.png)

接下来是 Gamma 校正。Gamma 曲线是图像、信号处理领域使用最为广泛的非线性处理，我们最常见的就是 Photoshop 中的「曲线」功能，如果将曲线拉成 $y=x^{\gamma}$ 的形状，就相当于对图像做了一次 Gamma 校正。在 sRGB 的官方文档中使用的是 $\gamma=1/2.4$，并在函数值较小的部分应用了小范围的线性函数。但是现在大多数平台（Windows，Mac）都使用了 $\gamma=1/2.2$ 的曲线，因此这里我们也使用 2.2 作为参数，并且不考虑局部的线性化。如果需要精确的 sRGB 标准的校正函数，可以查看其官方文档。

```matlab
nl_srgb = bright_srgb.^(1/2.2);
```

经过 Gamma 校正后的图像如下。由于使用的 Gamma 曲线是一条凸函数，相当于把图像暗部的细节展宽，因此得到的图像要比校正前更亮。

![raw-process-10.png](/images/raw-process-10.png)

至此一套通用的 RAW 文件处理流程就完成了，接下来可以根据需要再进行一系列的处理过程。

下面是我在网络上下载的一幅由 Sony 相机拍摄的 RAW 文件的处理流程。

![raw-process-11.png](/images/raw-process-11.png "直接读取的 tiff 文件")

![raw-process-12.png](/images/raw-process-12.png "线性处理后的图像")

![raw-process-13.png](/images/raw-process-13.png "白平衡调整后的图像")

![raw-process-14.png](/images/raw-process-14.png "色彩插值后的图像")

![raw-process-15.png](/images/raw-process-15.png "转换至 sRGB 空间后的图像")

![raw-process-16.png](/images/raw-process-16.png "经过亮度校正后的图像")

![raw-process-17.png](/images/raw-process-17.png "经过 Gamma 校正后的图像")

[^1]: 参考：[维基百科 | RAW](https://zh.wikipedia.org/zh/RAW)
[^2]: 这里附上 Dcraw 的 [C 源代码](/uploads/dcraw.zip)，为了避免因缺少部分函数库而无法编译，压缩包里也包含了 Windows 系统下的可执行文件。