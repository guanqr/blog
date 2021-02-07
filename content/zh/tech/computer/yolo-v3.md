+++
title = "YOLO v3 目标检测"
date = "2020-05-02T13:11:09+08:00"
lastmod = "2020-05-03T13:11:09+08:00"
tags = ["linux","machine-learning"]
dropCap = false
displayExpiredTip = true
+++

![yologo.png](/images/yologo.png)

## 下载与测试

YOLO (You Only Look Once) 基于深度学习框架——darknet 的目标检测开源项目。本次操作的全部过程均在 Linux 系统（Ubuntu）中完成。因为在 Windows 系统下，YOLO 源码编译的环境配置十分繁琐，容易出现问题。首先直接从 GitHub 上下载 darknet 源码：

```sh
git clone https://github.com/pjreddie/darknet.git darknet
```

![yolo-0.png](/images/yolo-0.png "darknet 源码仓库")

然后进入 `darknet` 文件夹中，打开 `Makefile` 文件。文件中最上方的三行，默认值为 `0`，如果你想要使用 GPU 进行运算，并开启 CUDA 加速和 OpenCV 的话，将其改为 `1` 即可。这里因为我仅做一个测试，数据运算量并不大所以没有开启 GPU 运算。

```make
GPU=1
CUDNN=1
OPENCV=1
```

![yolo-1.png](/images/yolo-1.png "Makefile 文件内容")

然后执行 `make` 命令编译源码。编译完成后，我们从作者的[网站](https://pjreddie.com/darknet/yolo/)上下载一个训练好的模型进行测试，这里有两个模型，一个名为 `yolov3.weights`，另一个名为 `yolov3-tiny.weights`，后者是一个轻量化的模型。因为我考虑后续可能会在树莓派上进行测试，所以这里我是用的是 `yolov3-tiny.weights`。

![yolo-2.png](/images/yolo-2.png "作者网站上的训练数据")

将下载好的模型放在 `darknet` 文件夹下即可。我们可以在 `data` 文件夹下找到一些可以测试的图片，比如说 `dog.jpg`，执行命令：

```sh
./darknet detect cfg/yolov3-tiny.cfg yolov3-tiny.weights data/dog.jpg
```

在这一条命令中，`cfg/yolov3-tiny.cfg` 为模型训练的相关配置文件，如果你是用的是 yolov3.weights 模型，直接替换为 `cfg/yolov3.cfg`即可；同样，命令中的 `yolov3-tiny.weights` 即为下载的模型；命令的最后一句 `data/dog.jpg` 为测试的图片。

执行命令后，我们可以在终端查看到图像检测的过程和结果。

![yolo-3.png](/images/yolo-3.png "图像目标检测")

![yolo-4.jpg](/images/yolo-4.jpg "检测结果")

## 制作数据集

因为课程项目的需要，我制作的是一个简单的垃圾分类数据集。首先我们将搜集到的图片放在同一个文件夹下，文件夹命名为 `JPEGImages`，将图片编号，重新命名为 `000000.jpg`、`000001.jpg`……这里我提供一个 Python 程序，直接运行即可给图片自动编号：

```python
import os
path = r"JPEGImages"
filelist = os.listdir(path)  # 该文件夹下所有的文件（包括文件夹）
count = 0
for file in filelist:
    print(file)
for file in filelist:   # 遍历所有文件
    Olddir = os.path.join(path, file)   # 原来的文件路径
    if os.path.isdir(Olddir):   # 如果是文件夹则跳过
        continue
    filename = os.path.splitext(file)[0]   # 文件名
    filetype = '.jpg'   # 文件扩展名
    Newdir = os.path.join(path, str(count).zfill(6)+filetype)  # 用字符串函数 zfill 以 0补全所需位数
    os.rename(Olddir, Newdir) # 重命名
    count += 1
```

下面进行图片的标注工作。我是用的标注工具是 LabelImg，其 GItHub 仓库地址为：<https://github.com/tzutalin/labelImg>。作者只提供了 Windows 端的可执行文件，在 Linux 端需要自己编译。软件的编译用到了 Python 3 与 Qt 5。依次执行以下命令安装 LabelImg：

```sh
sudo apt-get install pyqt5-dev-tools
pip install lxml
git clone https://github.com/tzutalin/labelImg.git
cd labelImg
make all
```

然后在 `labelImg` 文件夹下执行 `python labelImg.py` 即可运行软件。

在运行软件之前，可以先打开文件夹下的 `\data\predefined_classes.txt` 文件，该文件中的内容是标注所用到的标签。比如我在标注垃圾的时候，会标注 `glass`、`metal`、`paper`、`plastic` 四类，那么在该文件中依次填写名称即可。

```
glass
metal
paper
plastic
```

下面我们需要新建一个文件夹，命名为 `VOC + 年份`，比如 `VOC2007`，然后将之前编号序号的图片集文件夹复制进来。另外再新建两个文件夹，分别命名为 `Annotations` 和 `ImageSets`。前者存放我们标注好的文件，后者存放的是之后编译源码的时候用到的一些文件，在 `ImageSets` 文件夹下再建一个名为 `Main` 的文件夹。

![yolo-5.png](/images/yolo-5.png "文件详情")

然后我们运行 LabelImg，软件的左侧一栏，点击「改变存放目录」，修改存放地址为 `Annotations` 文件夹，接着点击「打开目录」，打开 `JPEGImages` 文件夹即可进行标注。标注后生成的文件类型为 `xml` 文件，记录了图片的所在位置和标注的横纵坐标。

![yolo-6.png](/images/yolo-6.png "标注图片")

图片标注完成后，在 `VOC2007` 文件夹下创建一个 Python 程序脚本，其代码如下：

```python
import os
import random

trainval_percent = 0.1
train_percent = 0.9
xmlfilepath = 'Annotations'
txtsavepath = 'ImageSets\Main'
total_xml = os.listdir(xmlfilepath)

num = len(total_xml)
list = range(num)
tv = int(num * trainval_percent)
tr = int(tv * train_percent)
trainval = random.sample(list, tv)
train = random.sample(trainval, tr)

ftrainval = open('ImageSets/Main/trainval.txt', 'w')
ftest = open('ImageSets/Main/test.txt', 'w')
ftrain = open('ImageSets/Main/train.txt', 'w')
fval = open('ImageSets/Main/val.txt', 'w')

for i in list:
    name = total_xml[i][:-4] + '\n'
    if i in trainval:
        ftrainval.write(name)
        if i in train:
            ftest.write(name)
        else:
            fval.write(name)
    else:
        ftrain.write(name)

ftrainval.close()
ftrain.close()
fval.close()
ftest.close()
```

运行该脚本，在 `ImageSets` 文件夹下会生成四个文件：`train.txt`，`val.txt`，`test.txt` 和 `trainval.txt`。

## 源码修改

回到 `darkent` 文件夹，在该文件夹下新建一个名为 `VOCdevkit` 的文件夹，将之前制作的数据集 `VOC2007` 文件夹复制进来。

我们需要将数据集中的标注文件转换为 YOLO 格式的标注文件，下载作者提供的 Python 脚本至 `darknet` 文件夹：

```sh
wget https://pjreddie.com/media/files/voc_label.py
```

打开该 Python 脚本，修改其中的 `sets` 和 `classes`：

```python
sets=[('2007', 'train'), ('2007', 'val'), ('2007', 'test')]
classes = ["glass","metal","paper","plastic"]
```

其中，`classes` 为图片的全部种类。

运行该脚本，`darknet` 文件夹下会生成三个文件：`2007_train.txt`，`2007_val.txt`，`2007_test.txt`，`VOCdevkit`下的 `VOC2007` 也会多生成一个 `labels` 文件夹。然后再执行下面的命令生成最终训练用到的 `train.txt` 文件：

```sh
cat 2007_train.txt 2007_val.txt  > train.txt
```

下面需要对 darknet 的源码进行一些修改。打开 `cfg/voc.data` 文件，修改为：

```
classes= 4
train  = /home/guanqirui/darknet/train.txt
valid  = /home/guanqirui/darknet/2007_test.txt
names = data/voc.names
backup = backup
```

其中 `classes` 为图像的种类，`train` 和 `valid` 修改为相应的文件路径。

然后修改 `data/voc.names` 和 `coco.names`，内容都修改为图片的种类名称，与之前的 `predefined_classes.txt` 文件内容一样。接着修改 `cfg/yolov3-voc.cfg`，搜索文件中的关键词 `yolo`，总共可以找到三处：

```toml
[convolutional]
size=1
stride=1
pad=1
filters=27
activation=linear

[yolo]
mask = 6,7,8
anchors = 10,13,  16,30,  33,23,  30,61,  62,45,  59,119,  116,90,  156,198,  373,326
classes=4
num=9
jitter=.3
ignore_thresh = .5
truth_thresh = 1
random=1
```

每一处都要修改两个地方：`filters` 和 `classes`。`classes` 为图片的种类，`filters` 的数值等于 `3*(5+classes)`。

在该文件的开头，有：

```
[net]
# Testing
 batch=1
 subdivisions=1
# Training
# batch=64
# subdivisions=16
```

在训练的时候，将 `# Training` 下的 ` batch` 和 `subdivisions` 取消注释，将 `# Testing` 下的对应值注释掉。反之，在预测图片的时候，`# Testing` 下的对应值要取消注释。

## 训练模型

我们需要下载作者提供的预训练模型至 `darknet` 文件夹：

```sh
wget https://pjreddie.com/media/files/darknet53.conv.74
```

执行下面的代码开始训练：

```sh
./darknet detector train cfg/voc.data cfg/yolov3-voc.cfg darknet53.conv.74
```

## 参考

+ [标注工具 LabelImg 在 Ubuntu 系统的安装和使用 | W_Tortoise](https://blog.csdn.net/learning_tortosie/article/details/80947301)
+ [超详细教程：YOLO_V3（yolov3）训练自己的数据 | idotc](https://blog.csdn.net/qq_21578849/article/details/84980298)