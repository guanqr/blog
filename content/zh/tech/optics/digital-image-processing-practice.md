+++
title = "数字图像处理基础练习"
date = "2020-04-01T15:33:24+08:00"
tags = ["image","matlab"]
series = ["major-courses"]
katex = true
dropCap = false
+++

## 空间域图像处理

以下为两幅相位相差 $180^{\circ}$ 的干涉图，其中第一幅相位为 $I_1=a+b\cos(\varphi)$，第二幅相位为 $I_2=a+b\cos(\varphi+\pi)$。确定中心低反射圆环（光纤）的中心坐标。

![digital-image-processing-practice-0.png](/images/digital-image-processing-practice-0.png "第一幅干涉图")

![digital-image-processing-practice-1.png](/images/digital-image-processing-practice-1.png "第二幅干涉图")

因为两幅图的干涉条纹相位相差 $180^{\circ}$，所以可以考虑将两幅图相加，从理论上讲，这样可以基本消除干涉条纹。

```matlab
a = imread('1.bmp');
b = imread('2.bmp');
pic1 = imlincomb(0.5,a,0.5,b);
imshow(pic1);
title('加法运算');
```

![digital-image-processing-practice-2.png](/images/digital-image-processing-practice-2.png "图像相加")

可以看出干涉条纹基本消除。目前存在的问题是，还有部分条纹并没有完全消除，且圆环的颜色与背景的颜色相近。为了确定圆环的边界，需要先对图像进行二值化处理。

```matlab
pic2 = imbinarize(pic1,0.29);
imshow(pic2);
title('二值化');
```
![digital-image-processing-practice-3.png](/images/digital-image-processing-practice-3.png "二值化处理")

经二值化处理后，可以明显分辨出圆的位置。且消除了上一幅图干涉条纹的影响。接下来进行边缘检测，这里使用的是 `edge` 函数和 Sobel 算子。因为在二值化后的图像中，圆的周围仍有部分杂散的黑色区域，会影响图像的识别结果，所以要对圆的所在区域进行截取。这里图像截取确定的坐标范围是 $x\in[280,460]$，$y\in[180,320]$。

```matlab
pic3 = edge(pic2,'sobel',0.2);
x1 = 280;
x2 = 460;
y1 = 180;
y2 = 320;
imshow(pic3(y1:y2,x1:x2));
title('Sobel 算子边缘检测');
```

![digital-image-processing-practice-4.png](/images/digital-image-processing-practice-4.png "Sobel 算子边缘检测")

![digital-image-processing-practice-5.png](/images/digital-image-processing-practice-5.png "截取后的图像")

圆心位置确定的方法很简单，因为经过二值化处理和边缘检测后，只剩下圆的轮廓，轮廓为白色，表示为 $1$。只要找到一个点，该点到 $1$ 的距离为定值即可。

```matlab
pic4 = pic3(y1:y2,x1:x2);
[y,x] = find(pic4==1);
center_x = min(x)+(max(x)-min(x))/2;
center_y = min(y)+(max(y)-min(y))/2;
imshow(pic3);
hold on;
x0 = x1+center_x;
y0 = y1+center_y;
plot(x0,y0,'*r');
s = sprintf('(%.1f,%.1f)',x0,y0);
text(x0,y0,s,'Color','red');
title('标注中心坐标');
```

![digital-image-processing-practice-6.png](/images/digital-image-processing-practice-6.png "标注坐标")

## 频率域图像处理

给定图像如下所示，消除图像中的周期性干扰。

![digital-image-processing-practice-7.png](/images/digital-image-processing-practice-7.png "带有周期性干扰的图像")

首先绘制原图像的频域图，观察噪声分布，具体代码和频域图像如下所示。

```matlab
I = imread('1.bmp');
I2 = rgb2gray(I);
s = fftshift(fft2(I2));
I3 = log(abs(s));
imshow(I3,[]);
```

![digital-image-processing-practice-8.png](/images/digital-image-processing-practice-8.png "原图的频域图像")

频域图像的高频部分有周期分布的噪声，考虑使用理想低通滤波器消除高频噪声干扰。

```matlab
[a,b] = size(s);
a0 = round(a/2);
b0 = round(b/2);
d = 16;
for i = 1:a
    for j = 1:b
        distance = sqrt((i-a0)^2+(j-b0)^2);
        if distance <= d
            h = 1;
        else
            h = 0;
        end
        s(i,j) = h.*s(i,j);
    end
end
s = uint8(real(ifft2(ifftshift(s))));
imshow(s)
```

![digital-image-processing-practice-9.png](/images/digital-image-processing-practice-9.png "经理想低通滤波器处理后的图像")

由上图可以看出，经理想低通滤波器处理后，原图的周期噪声基本消除，但原图左上方的阴影等细节部分也有所丢失。滤波后的频域图像如下图所示。

![digital-image-processing-practice-10.png](/images/digital-image-processing-practice-10.png "滤波后的频域图像")

{{< notice notice-note >}}
本文内容源自浙江大学光电学院本科课程《机器视觉与图像处理》的课堂练习，图像处理的软件为 MATLAB，图像处理的方法只是个人的尝试，并非标准方法，因此仅供参考。
{{< /notice >}}