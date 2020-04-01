+++
title = "空间域图像增强"
date = "2020-02-25T10:52:01+08:00"
tags = ["color","grayscale","matlab"]
series = ["major-courses"]
mathjax = true
toc = true
+++

空间域增强基于图像中每一个小范围（邻域）内的像素进行灰度变换运算，某个点变换之后的灰度由该点邻域之内的那些点的灰度值共同决定，因此空间域增强也称为邻域运算或邻域滤波。空间域变换可使用下式描述：

<div>
$$
g(x,y)=T[f(x,y)]
$$
</div>

本文所用的原始图片为 RGB 图像，为了统一图像，所有程序均使用了 `rgb2gray` 将其转换为灰度图像再进行处理。

## 空间域滤波

MATLAB 中与滤波相关的函数主要有 `imfilter` 和 `fspecial`。`imfilter` 完成滤波操作，而 `fspecial` 为使用者创建一些预定义的二维滤波器，直接供 `imfilter` 函数使用。

滤波函数 `imfilter` 原型如下：

```matlab
g = imfilter(f,w,option1,option2,...)
```

其中，`g` 为滤波后输出图像；`f` 是要进行滤波操作的图像；`w` 是滤波操作所使用的的模板，为一个二维数组；`option1,option2,...` 是可选项，具体可以包括以下内容。

1. 边界选项：主要针对边界处理问题。

|      合法值     |                                 含义                                 |
|:---------------:|---------------------------------------------------------------------|
| X（一个具体数字）|              用固定数值 X 填充虚拟边界，默认情况是用 0 填充             |
|   `symmetric`   | 填充虚拟边界的内容是通过对靠近原图像边缘的像素相对于原图像边缘做镜像而得到 |
|   `replicate`   |               填充虚拟边界的内容总是重复与它最近的边缘像素              |
|   `circular`    |         认为原图像模式具有周期性，从而周期性地填充虚拟边界的内容         |

2. 尺寸选项：由于滤波中填充了边界，有必要指定输出图像 `g` 的大小。

| 合法值 |                                    含义                                       |
|:------:|------------------------------------------------------------------------------|
| `same` |                      输出图像 `g` 与输入图像 `f` 尺寸相同                      |
| `full` | 输出图像 `g` 的尺寸为填充虚拟边界后的图像 `f'` 的尺寸，因而大于输入图像 `f` 的尺寸 |

3. 模式选项：指明滤波过程是相关还是卷积。

| 合法值 |      含义      |
|:------:|:-------------:|
| `corr` | 滤波过程为相关 |
| `conv` | 滤波过程为卷积 |

读入图像 `f`，用模板：

<div>
$$
w=\frac{1}{9}\times
\begin{bmatrix}
1&1&1\\
1&1&1\\
1&1&1
\end{bmatrix}
$$
</div>

对 `f` 进行相关滤波，采用重复的边界填充方式，相关代码如下。

```matlab
f = imread('img.jpg');
f = rgb2gray(f);

subplot(1,2,1);
imshow(f);
title('(a) 原图像');

w = [1 1 1; 1 1 1; 1 1 1]/9;
g = imfilter(f,w,'corr','replicate');
subplot(1,2,2);
imshow(g);
title('(b) 滤波后图像');
```

运行结果如下图所示。

![digital-image-processing-8.png](/images/digital-image-processing-8.png "相关滤波前后对比")

可创建预定义的二维滤波器的 `fspecial` 函数常见调用格式如下。

```matlab
h = fspecial(type,parameters)
```

其中，返回值 `h` 为特定的滤波器；参数 `type` 制定了滤波器类型；可选输入 `parameters` 是和所选定的滤波器类型 `type` 相关的配置参数，如尺寸和标准差等；参数 `type` 的一些合法值如下表所示。

|   合法值    |          功能描述       |
|:-----------:|:----------------------:|
|  `average`  |         平均模板        |
|   `disk`    |    圆形邻域的平均模板    |
| `gaussian`  |         高斯模板        |
| `laplacian` |       拉普拉斯模板      |
|    `log`    |     高斯-拉普拉斯模板    |
|  `prewitt`  | Prewitt 水平边缘检测算子 |
|   `sobel`   |  Sobel 水平边缘检测算子  |

## 图像平滑

图像平滑是一种可以减少和抑制图像噪声的使用数字图像处理技术。在空间域中一般采用邻域平均来达到平滑目的。

### 平均模板

一般来说，图像具有局部连续性质，即相邻像素的数值相近，而噪声的存在使得噪声点处产生灰度跳跃，但一般可以合理地假设偶尔出现的噪声影响并没有改变图像局部连续的性质。通过平滑滤波，原局部图像中的噪声点灰度值得到了有效修正。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);
I = imnoise(I,'salt & pepper');

subplot(2,2,1);
imshow(I);
title('(a) 原噪声图像');

h = fspecial('average',3); % 3*3 平均模板
I3 = imfilter(I,h,'corr','replicate'); % 相关滤波，重复填充边界
subplot(2,2,2);
imshow(I3);
title('(b) 经3×3的平均模板滤波');

h = fspecial('average',5); % 5*5 平均模板
I5 = imfilter(I,h,'corr','replicate');
subplot(2,2,3);
imshow(I5);
title('(c) 经5×5的平均模板滤波');

h = fspecial('average',7); % 7*7 平均模板
I7 = imfilter(I,h,'corr','replicate');
subplot(2,2,4);
imshow(I7);
title('(d) 经7×7的平均模板滤波');
```

效果如下图所示，随着模板的增大，滤波过程在平滑掉更多的噪声的同时，使得图像变得越来越模糊。

![digital-image-processing-9.png](/images/digital-image-processing-9.png "不同大小的平均模板的平滑效果")

### 高斯平滑

平均平滑对于邻域内的像素一视同仁，为了减少平滑处理中的模糊，得到更自然的平滑效果，需要适当加大模板中心点的权重，随着距离中心点的距离增大，权重迅速减小，从而可以确保中心点看起来更接近于与它距离更近的点，基于这样的考虑得到的模板即为高斯模板。

常用的 3×3 高斯模板如下。

<div>
$$
w=\frac{1}{16}\times
\begin{bmatrix}
1&2&1\\
2&4&2\\
1&2&1
\end{bmatrix}
$$
</div>

采用高斯函数中不同的 $\sigma$ 实现高斯平滑的代码如下。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);
I = imnoise(I,'salt & pepper');

subplot(3,2,1);
imshow(I);
title('(a) 原噪声图像');

h3_5 = fspecial('gaussian',3,0.5); % sigma=0.5 的 3×3 高斯模板
I3_5 = imfilter(I,h3_5); % 高斯平滑
subplot(3,2,2);
imshow(I3_5);
title('(b) 经3×3，\sigma=0.5的高斯模板滤波');

h3_8 = fspecial('gaussian',3,0.8); % sigma=0.8 的 3×3 高斯模板
I3_8 = imfilter(I,h3_8);
subplot(3,2,3);
imshow(I3_8);
title('(c) 经3×3，\sigma=0.8的高斯模板滤波');

h3_18 = fspecial('gaussian',3,1.8); % sigma=1.8 的 3×3 高斯模板
I3_18 = imfilter(I,h3_18);
subplot(3,2,4);
imshow(I3_18);
title('(d) 经3×3，\sigma=1.8的高斯模板滤波');

h5_8 = fspecial('gaussian',5,0.8);
I5_8 = imfilter(I,h5_8);
subplot(3,2,5);
imshow(I5_8);
title('(e) 经5×5，\sigma=0.8的高斯模板滤波');

h7_12 = fspecial('gaussian',7,1.2);
I7_12 = imfilter(I,h7_12);
subplot(3,2,6);
imshow(I7_12);
title('(f) 经7×7，\sigma=1.2的高斯模板滤波');
```

得到结果如下。随着模板的增大，原图中的噪声得到更好的抑制。

![digital-image-processing-10.png](/images/digital-image-processing-10.png "不同大小的高斯模板的平滑效果")

## 中值滤波

下面的程序展示了对于一幅受椒盐噪声污染的图像，平均平滑、高斯平滑和中值滤波的处理效果。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);
J = imnoise(I,'salt & pepper');

subplot(2,2,1);
imshow(J);
title('(a) 原图像');

w = [1 2 1;
    2 4 2;
    1 2 1]/16;
J1 = imfilter(J,w,'corr','replicate');
subplot(2,2,2);
imshow(J1);
title('(b) 3×3高斯平滑效果');

w = [1 1 1;
    1 1 1;
    1 1 1]/9;
J2 = imfilter(J,w,'corr','replicate');
subplot(2,2,3);
imshow(J2);
title('(c) 3×3平均平滑效果');

J3 = medfilt2(J,[3,3]);
subplot(2,2,4);
imshow(J3);
title('(d) 3×3中值滤波效果');
```

![digital-image-processing-11.png](/images/digital-image-processing-11.png "几种滤波器对椒盐噪声污染图像的性能比较")

从图中可以看出，对于椒盐噪声污染的图像，中值滤波要远远优于线性平滑滤波。

## 图像锐化

图像锐化主要用于增强图像的灰度跳变部分，与图像平滑对灰度跳变的抑制正好相反。

### 梯度算子

对于连续的二维函数 $f(x,y)$，其在点 $(x,y)$ 处的梯度是下面的二维列向量：

<div>
$$
\nabla f=\begin{bmatrix}
G_x\\
G_y
\end{bmatrix}=\begin{bmatrix}
\frac{\partial f}{\partial x}\\
\frac{\partial f}{\partial y}
\end{bmatrix}
$$
</div>

梯度的幅值作为变化率大小的度量，其值为:

<div>
$$
|\nabla f(x,y)|=\sqrt{(\frac{\partial f}{\partial x})^2+(\frac{\partial f}{\partial y})^2}
$$
</div>

对于二维离散函数 $f(i,j)$，可以用有限差分作为梯度幅值的一个近似：

<div>
$$
|\nabla f(i,j)|=\sqrt{[f(i+1,j)-f(i,j)]^2+[f(i,j+1)-f(i,j)]^2}
$$
</div>

可近似为 Robert 交叉梯度：

<div>
$$
|\nabla f(i,j)|=|f(i+1,j+1)-f(i,j)|+|f(i,j+1)-f(i+1,j)|
$$
</div>

#### Robert 交叉梯度

Robert 交叉梯度对应模板为：

<div>
$$
w1=\begin{bmatrix}
-1&0\\
0&1
\end{bmatrix},\quad
w2=\begin{bmatrix}
0&-1\\
1&0
\end{bmatrix}
$$
</div>

程序实现如下。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);

subplot(2,2,1);
imshow(I);
title('(a) 原图像');

I = double(I);
w1 = [-1 0; 0 1];
w2 = [0 -1; 1 0];
G1 = imfilter(I,w1,'corr','replicate');
G2 = imfilter(I,w2,'corr','replicate');
G = abs(G1)+abs(G2);

subplot(2,2,2);
imshow(G,[]);
title('(b) Robert交叉梯度图像');

subplot(2,2,3);
imshow(abs(G1),[]);
title('(c) w1滤波后取绝对值并重新标定');

subplot(2,2,4);
imshow(abs(G2),[]);
title('(d) w2滤波后取绝对值并重新标定');
```

![digital-image-processing-12.png](/images/digital-image-processing-12.png "Robert 交叉梯度锐化")

由于 `G1` 和 `G2` 中都可能有负值，所以将其取绝对值。图 c 中接近 45° 边缘较明显，图 d 中凸显出接近 -45° 方向的边缘。

#### Sobel 梯度

Sobel 模板为：

<div>
$$
w1=\begin{bmatrix}
-1&-2&-1\\
0&0&0\\
1&2&1
\end{bmatrix},\quad
w2=\begin{bmatrix}
-1&0&1\\
-2&0&2\\
-1&0&1
\end{bmatrix}
$$
</div>

下面的程序计算量图像的竖直和水平梯度，它们的和可以作为完整的 Sobel 梯度。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);

w1 = fspecial('sobel');
w2 = w1';
G1 = imfilter(I,w1);
G2 = imfilter(I,w2);
G = abs(G1)+abs(G2);

subplot(1,3,1);
imshow(G1,[]);
title('(a) w1滤波后取绝对值并重新标定');

subplot(1,3,2);
imshow(G2,[]);
title('(b) w2滤波后取绝对值并重新标定');

subplot(1,3,3);
imshow(G,[]);
title('(c) Sobel梯度图像');
```

![digital-image-processing-13.png](/images/digital-image-processing-13.png "Sobel 梯度锐化")

### 拉普拉斯算子

二维函数 $f(x,y)$ 的二阶微分定义为：

<div>
$$
\nabla^2 f(x,y)=\frac{\partial^2 f}{\partial x^2}+\frac{\partial^2 f}{\partial y^2}
$$
</div>

用于图像锐化的拉普拉斯算子为：

<div>
$$
\nabla^2 f=[f(i+1,j)+f(i-1,j)+f(i,j+1),f(i,j-1)]-4f(i,j)
$$
</div>

滤波模板有三种：

<div>
$$
\begin{aligned}
w1&=\begin{bmatrix}
0&-1&0\\
-1&4&-1\\
0&-1&0
\end{bmatrix},\\
w2&=\begin{bmatrix}
-1&-1&-1\\
-1&8&-1\\
-1&-1&-1
\end{bmatrix},\\
w3&=\begin{bmatrix}
1&4&1\\
4&-20&4\\
1&4&1
\end{bmatrix}
\end{aligned}
$$
</div>

分别使用上述三种拉普拉斯模板的滤波程序如下。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);

subplot(2,2,1);
imshow(I);
title('(a) 原图像');

I = double(I);
w1 = [0 -1 0; -1 4 -1; 0 -1 0];
L1 = imfilter(I,w1,'corr','replicate');
subplot(2,2,2);
imshow(abs(L1),[]);
title('(b) w1模板拉普拉斯锐化');

w2 = [-1 -1 -1; -1 8 -1;-1 -1 -1];
L2 = imfilter(I,w2,'corr','replicate');
subplot(2,2,3);
imshow(abs(L2),[]);
title('(c) w2模板拉普拉斯锐化');

w3 = [1 4 1; 4 -20 4; 1 4 1];
L3 = imfilter(I,w3,'corr','replicate');
subplot(2,2,4);
imshow(abs(L3),[]);
title('(d) w3模板拉普拉斯锐化');
```

![digital-image-processing-14.png](/images/digital-image-processing-14.png "拉普拉斯锐化")

### 高斯-拉普拉斯算子

为了在取得更好的锐化效果的同时把噪声干扰降到最低，可以先对带有噪声的原始图像进行平滑滤波，再进行锐化增强边缘和细节。将高斯平滑算子同拉普拉斯锐化结合起来，得到高斯-拉普拉斯算子（Laplacian of a Gaussian，LoG）如下：

<div>
$$
\nabla^2 h(r)=-\frac{r^2-\sigma^2}{\sigma^4}\exp(-\frac{r^2}{2\sigma^2})
$$
</div>

下面对一幅图分别使用拉普拉斯算子和高斯-拉普拉斯算子进行锐化。

```matlab
I = imread('img.jpg');
I = rgb2gray(I);

subplot(2,2,1);
imshow(I,[]);
title('(a) 原图像');

Id = double(I);
h_lap = [-1 -1 -1; -1 8 -1; -1 -1 -1];
I_lap = imfilter(Id,h_lap,'corr','replicate'); % Laplacian 锐化
subplot(2,2,2);
imshow(uint8(abs(I_lap)),[]); % 取绝对值并将 255 以上的响应截断
title('(b) Laplacian锐化图像');

h_log = fspecial('log',5,0.5); % 大小为 5，sigma=0.5 的 LoG 算子
I_log = imfilter(Id,h_log,'corr','replicate');
subplot(2,2,3);
imshow(uint8(abs(I_log)),[]);
title('(c) LoG锐化图像，\sigma=0.5');

h_log = fspecial('log',5,2); % 大小为 5，sigma=2 的 LoG 算子
I_log = imfilter(Id,h_log,'corr','replicate');
subplot(2,2,4);
imshow(uint8(abs(I_log)),[]);
title('(d) LoG锐化图像，\sigma=2');
```

![digital-image-processing-15.png](/images/digital-image-processing-15.png "Laplacian 与 LoG 算子滤波效果比较")