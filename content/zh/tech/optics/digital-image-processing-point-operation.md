+++
title = "图像的点运算"
date = "2020-02-23T15:36:13+08:00"
tags = ["image-processing","matlab"]
series = ["major-courses"]
katex = true
toc = true
+++

点运算指的是对图像中的每个像素依次进行同样的灰度变换运算。设 $r$ 和 $s$ 分别是输入图像 $f(x,y)$ 和输出图像 $g(x,y)$ 在任一点 $(x,y)$ 的灰度值，则点运算可以使用 $s=T(r)$ 定义。其中，$T$ 为采用的点运算算子，表示了在原始图像和输出图像之间的某种灰度级映射关系。点运算常常用于改变图像的灰度范围及分布，是图像数字化及图像显示时常常需要的工具。

## 灰度直方图

图像的灰度直方图是一个离散函数，表示每一灰度级与该灰度级出现频率的对应关系。

```matlab
I = imread('img.jpg');
subplot(121);
imshow(I); title('Source');
subplot(122);
% 将 0~255 灰度级平均分为 64 个长度为 4 的灰度区间
imhist(I,64); title('Graph'); 
```

运行上述代码，输出图像的灰度直方图如下所示。

![digital-image-processing-0.png](/images/digital-image-processing-0.png "原图与一般直方图")

### 直方图的性质

1. 与位置无关。只包含该图像中某一灰度值的像素出现概率，丢失了其所在位置的信息；
2. 任一幅图像，都能唯一地确定出一幅与它对应的直方图，但不同的图像，可能有相同的直方图；
3. 具有可叠加性。由于直方图是对具有相同灰度值的像素统计得到的，因此，一幅图像的各子区间的直方图之和等于该图像全图的直方图。

### 归一化直方图

在 `imhist` 函数返回值中，`counts` 保存了落入每个区间的像素个数，通过计算 `counts` 与图像中像素总数的商可以得到..归一化直方图..。

绘制有 32 个灰度区间的归一化直方图程序如下。

```matlab
I = imread('img.jpg');
figure;
[M,N] = size(I);
[counts,x] = imhist(I,32);
counts = counts / M / N;
stem(x,counts);
```

输出图像如下。

![digital-image-processing-1.png](/images/digital-image-processing-1.png "归一化直方图")

直方图的峰值位置说明了图像总体上的亮暗。如果图像较亮，则直方图的峰值出现在直方图的较右部分；如果图像较暗，则直方图的峰值出现在直方图的较左部分。如果直方图中只有中间某一小段非零值，说明这张图像的对比度较低；如果直方图的非零值分布很宽且比较均匀，则图像对比度较高。

### 直方图的修正

一幅给定图像的灰度级分布在 $0\leq r\leq 1$ 范围内（归一化），可以对 $0\leq r\leq 1$ 内的任一个 $r$ 值进行 $s=T(r)$ 点运算。$T(r)$ 应该满足：

1. 在 $0\leq r\leq 1$ 内，$T(r)$ 的值单调递增；
2. 对于 $0\leq r\leq 1$，有 $0\leq T(r)\leq 1$。

条件（1）保证了图像的灰度级从黑到白的次序不变，条件（2）保证了映射变换后的像素灰度值在容许的范围内。

### 直方图均衡化

```matlab
I = imread('img2.jpg');
subplot(221);
imshow(I);
subplot(222);
imhist(I);
J=histeq(I,64);
subplot(223);
imshow(J);
subplot(224);
imhist(J);
```

运行上述代码，得到均衡化后的图像。

![digital-image-processing-2.png](/images/digital-image-processing-2.png "直方图均衡化")

均衡化后直方图趋于平坦化，灰度间隔（动态范围）拉大，对比度加强，图像清晰，便于读取、分析和处理。

## 灰度的线性变换

线性灰度变换函数 $f(x)$ 是一个一维线性函数。

<div>
$$
D_B=f(D_A)=f_AD_A+f_B
$$
</div>

式中，参数 $f_A$ 为线性函数的斜率，$f_B$ 为线性函数在 $y$ 轴的截距，$D_A$ 表示输入图像的灰度，$D_B$ 为输出图像的灰度。

+ 当 $f_A>1$ 时，输出图像对比度增大；当 $f_A<1$ 时，输出图像对比度减小；
+ 当 $f_A=1$ 且 $f_B\neq 0$ 时，仅使所有的像素灰度值上移或下移，使整个图像更暗或更亮；如果 $f_A<0$，暗区域将变亮，亮区域将变暗。
+ 特殊情况下，当 $f_A=1$ 且 $f_B=0$ 时，输出图像与输入图像相同；当 $f_A=-1$ 且 $f_B=255$ 时，输出图像灰度正好反转。

```matlab
I = imread('img.jpg');

I = im2double(I);
[M,N] = size(I);

figure(1);
subplot(1,2,1);
imshow(I);
title('原图像');

subplot(1,2,2);
[H,x] = imhist(I,64);
stem(x,(H/M/N),'.');
title('原图像');

% 增加对比度
Fa = 2; Fb = -55;
O = Fa.*I+Fb/255;

figure(3);
subplot(2,2,1);
imshow(O);
title('Fa = 2 Fb = -55 增加对比度');

figure(4);
subplot(2,2,1);
[H,x] = imhist(O,64);
stem(x,(H/M/N),'.');
title('Fa =2 Fb = -55 增加对比度');

% 减小对比度
Fa = 0.5; Fb = -55;
O = Fa.*I+Fb/255;

figure(3);
subplot(2,2,2);
imshow(O);
title('Fa = 0.5 Fb = -55 减小对比度');

figure(4);
subplot(2,2,2);
[H,x] = imhist(O,64);
stem(x,(H/M/N),'.');
title('Fa = 0.5 Fb = -55 减小对比度');

% 线性增加亮度
Fa = 1; Fb = 55;
O = Fa.*I+Fb/255;

figure(3);
subplot(2,2,3);
imshow(O);
title('Fa = 1 Fb = 55 线性平移增加亮度');

figure(4);
subplot(2,2,3);
[H,x] = imhist(O,64);
stem(x,(H/M/N),'.');
title('Fa = 1 Fb = 55 线性平移增加亮度');

% 反相显示
Fa = -1; Fb = 255;
O =Fa.*I+Fb/255;

figure(3);
subplot(2,2,4);
imshow(O);
title('Fa = -1 Fb = 255 反相显示');

figure(4);
subplot(2,2,4);
[H,x] = imhist(O,64);
stem(x,(H/M/N),'.');
title('Fa = -1 Fb = 255 反相显示');
```

运行上述代码得到以下结果。

![digital-image-processing-3.png](/images/digital-image-processing-3.png "原图像及其直方图")

![digital-image-processing-4.png](/images/digital-image-processing-4.png "线性变换后的图像")

![digital-image-processing-5.png](/images/digital-image-processing-5.png "线性变换后图像的直方图")

## 灰度对数变换

对数变换的一般表达式为：

<div>
$$
t=c \log(1+s)
$$
</div>

其中，$c$ 为尺度比例常数，$s$ 为源灰度值，$t$ 为变换后的目标灰度值。下面的程序比较了对傅里叶频谱图像进行对数变换前后的效果，图略。

```matlab
I = imread('img.jpg');
F = fft2(im2double(I));
F = fftshift(F);
F = abs(F);
T = log(F+1);

subplot(1,2,1);
imshow(F,[]);
title('未经变换的频谱');

subplot(1,2,2);
imshow(T,[]);
title('经过对数变换的频谱');
```

## 伽马变换

伽马变换的一般表达式为：

<div>
$$
y=(x+esp)^\gamma
$$
</div>

其中，$x$ 与 $y$ 的取值范围均为 $[0,1]$，$esp$ 为补偿系数，$\gamma$ 为伽马系数。

+ $\gamma >1$ 时，图像的高灰度区域对比度得到增强；
+ $\gamma <1$ 时，图像的低灰度区域对比度得到增强；
+ $\gamma =1$ 时，不改变原图像。

```matlab
I = imread('img.jpg');

subplot(3,2,1);
imshow(imadjust(I,[],[],0.75));
title('Gamma 0.75');

subplot(3,2,2);
imhist(imadjust(I,[],[],0.75));
title('Gamma 0.75');

subplot(3,2,3);
imshow(imadjust(I,[],[],1));
title('Gamma 1');

subplot(3,2,4);
imhist(imadjust(I,[],[],1));
title('Gamma 1');

subplot(3,2,5);
imshow(imadjust(I,[],[],1.5));
title('Gamma 1.5');

subplot(3,2,6);
imhist(imadjust(I,[],[],1.5));
title('Gamma 1.5');
```

运行以上代码，输出图像如下。

![digital-image-processing-6.png](/images/digital-image-processing-6.png "伽马变换效果对比")

## 灰度阈值变换

灰度阈值变换的函数表达式如下：

<div>
$$
f(x)=
\begin{cases}
0& x< T\\
1& x\geq T
\end{cases}
$$
</div>

其中，$T$ 为指定的阈值。具体代码及图像处理结果如下。

```matlab
I = imread('img.jpg');
thresh = graythresh(I);
bw1 = im2bw(I,thresh);
bw2 = im2bw(I,130/255);
subplot(1,3,1); imshow(I); title('原图像');
subplot(1,3,2); imshow(bw1); title('自动选择阈值');
subplot(1,3,3); imshow(bw2); title('阈值 130');
```

![digital-image-processing-7.png](/images/digital-image-processing-7.png "灰度阈值变换")