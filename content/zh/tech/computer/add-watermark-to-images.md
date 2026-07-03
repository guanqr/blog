+++
title = "批量压缩图片并添加水印的方法"
date = "2021-06-19T17:20:03+08:00"
lastmod = "2021-06-19T20:57:45+08:00"
tags = ["image-processing","python"]
+++

从去年年末开始，我陆陆续续收集了很多卡牌，也在网站上展示了部分原创卡。在拍摄卡牌的时候，当然是要尽量呈现出卡牌实物的色彩效果。但将高清的图片放在网上进行展示，存在盗用的风险。这样可能会给卡牌的出品方带来负面影响。所以我就考虑在图片上添加浅色的水印。几百张图，如果一个个分别用 PhotoShop 先压缩图片再添加水印，太麻烦了，直接写个 Python 脚本吧。

## 引入库文件

由于是图片处理类的脚本，引入的库如下所示。

```python
from PIL import Image, ImageDraw, ImageFont
import os
```

## 读取文件列表

首先设置需要读取的图片文件夹地址，以及输出图片的地址。目前只需要用到读取地址，输出地址还用不到。

```python
imgOpen = 'test/old' # 读取地址
imgSave = 'test/new' # 输出地址
```

然后用以下代码实现将文件夹下的所有图片名存放在一个列表中。文件名的后缀被删除。这样方便后续图片输出的时候统一命名。

```python
imgList = os.listdir(imgOpen)

for index in range(len(imgList)):
    imgList[index] = imgList[index][:-4] 
```

按照这样的思路，我们写好处理图片的函数，在主程序中，只需要使用循环 `for index in range(len(imgList))` 依次处理每张图片并输出就可以了。

## 添加水印

这里我要添加的水印样式是成 45 度周期分布在整张图片上的水印。需要先设置添加的字符的字体、字号、透明度，再将字符覆盖到图片上。这里我使用了 Google Fonts 开源的 Berkshire Swash 英文字体。

```python
def add_text_to_image(image, text):
    font = ImageFont.truetype('BerkshireSwash-Regular.ttf', 54)
   
    # 添加背景
    new_img = Image.new('RGBA', (image.size[0] * 3, image.size[1] * 3), (0, 0, 0, 0))
    new_img.paste(image, image.size)
   
    # 添加水印
    font_len = len(text)
    rgba_image = new_img.convert('RGBA')
    text_overlay = Image.new('RGBA', rgba_image.size, (255, 255, 255, 0))
    image_draw = ImageDraw.Draw(text_overlay)
   
    for i in range(0, rgba_image.size[0], font_len*30+100):
        for j in range(0, rgba_image.size[1], 200):
            image_draw.text((i, j), text, font=font, fill=(255, 255, 255, 50))
    text_overlay = text_overlay.rotate(45)
    image_with_text = Image.alpha_composite(rgba_image, text_overlay)
   
    # 裁切图片
    image_with_text = image_with_text.crop((image.size[0], image.size[1], image.size[0] * 2, image.size[1] * 2))
    return image_with_text
```

这一步由于涉及到了透明度的计算，所以在读取 JPG 格式的图片后，输出的图片变成了 PNG 格式。通过对比两个格式的图片可知，添加水印后的 PNG 图片要远大于原始的 JPG 图片。这显然是不理想的。虽然说 PNG 在图片的质量上要比 JPG 格式好很多，但我拍摄的原本就是 JPG 图片，转成 PNG 没什么意义，并且我要将最终的图片放在网站上，如果图片文件太大，加载网页的时候就会很慢。因此，我还需要对输出的 PNG 图片做压缩处理，再次转换成 JPG 图片。

## 图片格式转换

从 PNG 转换到 JPG 当然不仅仅是改个文件名的后缀那么简单。 PNG 图像涉及到了透明度的信息，但 JPG 图像没有。所以我们需要将透明度信息删除。此外，顺便将画质适当降低一些以便压缩图片文件的体积。

```python
def png2jpg(pngPath):
    img = Image.open(pngPath) 
    (w, h) = img.size
    infile = pngPath
    outfile = os.path.splitext(infile)[0] + ".jpg"
    img = Image.open(infile)
    img = img.resize((int(w), int(h)), Image.ANTIALIAS)
    try:
        if len(img.split()) == 4:
            r, g, b, a = img.split()
            img = Image.merge("RGB", (r, g, b))
            img.convert('RGB').save(outfile, quality=70)
            os.remove(pngPath)
        else:
            img.convert('RGB').save(outfile, quality=70)
            os.remove(pngPath)
        return outfile
    except Exception as e:
        print("PNG 转换 JPG 错误", e)
```

## 缩放图片到指定尺寸

原始图片的尺寸比较大，高度超过了 2000 像素，由于屏幕分辨率的限制，通常在网页上呈现的时候不需要太大的尺寸。所以我计划将图片高度压缩至 1600 像素，宽度按照相同比例缩放。

```python
def resizeByHeight(jpgPath, newHeight): 
    img = Image.open(jpgPath) 
    (x, y) = img.size
    ratio = y / newHeight
    x_s = int(x / ratio)
    y_s = newHeight
    out = img.resize((x_s, y_s), Image.ANTIALIAS) 
    out.save(jpgPath)
```

## 主程序

最后，就是主程序的编写。

```python
if __name__ == '__main__':
    for index in range(len(imgList)):
        fileName = imgList[index]
        openAddress = imgOpen + '/' + fileName + '.jpg'
        saveAddress = imgSave + '/' + fileName + '.png'
        resizeByHeight(openAddress, 1600)
        img = Image.open(openAddress)
        im_after = add_text_to_image(img, u'Guan Qirui Collection')
        im_after.save(saveAddress)
        png2jpg(saveAddress)
        print(fileName)
```

最终效果如下图所示。图片使用了燎原三国的关羽人物卡。

![liaoyuan-sanguo-guanyu.jpg](/images/liaoyuan-sanguo-guanyu.jpg)