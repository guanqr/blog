+++
title = "Win10 和 Python 3.7 环境下安装 TensorFlow"
date = "2020-03-07T00:03:29+08:00"
tags = ["python","tensorflow"]
+++

![tensorflow-logo.svg](/images/tensorflow-logo.svg)

近些年机器学习（Machine Learning）是一个比较热门的领域。TensorFlow 是一个端到端开源机器学习平台。它拥有一个包含各种工具、库和社区资源的全面灵活生态系统，可以让研究人员推动机器学习领域的先进技术的发展，并让开发者轻松地构建和部署由机器学习提供支持的应用。这学期的专业课程涉及了「光电检测」与「机器视觉」两个领域，今年年初光电学院公布的第八届全国大学生光电设计竞赛题目涉及到了「图像识别」的内容，这都与机器学习息息相关。作为一个非计算机专业的小白，网上的一些教程对安装 TensorFlow 的过程描述的不是很详细，所以在安装的时候遇到了种种困难。这篇文章即是对安装 TensorFlow 的过程总结。我使用的计算机为 ThinkPad T470p，所带的显卡为 NVIDIA GeForce 940MX，系统为 Windows 10。

## 安装 Anaconda

Anaconda 是一个开源的 Python 发行版本，请前往[官网](https://www.anaconda.com/distribution/#download-section)挑选 Windows 系统 Python 3.7 版本进行下载。

![download-anaconda.png](/images/download-anaconda.png)

安装的时候请选择合适的安装路径。为了方便，可以勾选「Add Anaconda to my PATH environment variable」的选项。不过据说容易出现错误，且卸载很麻烦，所以这里请自己考虑是否勾选。如果不勾选的话，安装完成后需要自行将 Anaconda 添加到系统环境变量中。

![add-anaconda-to-path.png](/images/add-anaconda-to-path.png)

## 安装 CUDA

你的计算机显卡必须是 NVIDIA 显卡才可以选择安装 CUDA，否则请跳过以下步骤直接安装 TensorFlow。在[官网](https://developer.nvidia.com/cuda-toolkit-archive)挑选你要安装的 CUDA 版本。这里因为我安装的时间较早，安装的是 CUDA 10.0 版本，最新的 TensorFlow 2.1 对应的 CUDA 是 10.1 版本。但是要注意，不一定最新版本的最好，因为很有可能 TensorFlow 的版本并没有与最新版本的 CUDA 相对应。

运行安装包的时候需要注意，需要选择「自定义」安装，在选择「自定义安装选项」的时候，建议只勾选安装 CUDA，Driver components 等组件你的计算机系统中应该原本就有，而且很有可能已有的版本与其要安装的版本不一致，要安装的版本比你已有的版本高，可以选择安装，如果比已有版本低，安装的话会出现错误。另外，CUDA 选项中的 Visual Studio Integration 也可选择不安装，因为我们并没有用到 Visual Studio。

![install-cuda.png](/images/install-cuda.png)

## 安装 cuDNN

进入[官网](https://developer.nvidia.com/cudnn)，cuDNN 的下载必须要登录账户填写问卷，如果你没有 NVIDIA 账户请注册，登录账户并填写问卷后，选择和 CUDA 相对应的 cuDNN 版本下载即可。下载完成后，将压缩文件解压出来，重命名该文件夹为 `cudnn`，将其放置在 CUDA 安装目录下，即 `~/NVIDIA GPU Computing Toolkit/CUDA/v10.0/cudnn`。

![download-cudnn.png](/images/download-cudnn.png)

## 添加环境变量

右键「这台电脑」，点击「属性」，进入「高级系统设置」中的「环境变量」，在「系统变量」中的 `path` 变量中添加四个变量：

1. D:\NVIDIA GPU Computing Toolkit\CUDA\v10.0\bin
2. D:\NVIDIA GPU Computing Toolkit\CUDA\v10.0\libnvvp
3. D:\NVIDIA GPU Computing Toolkit\CUDA\v10.0\extras\CUPTI\libx64
4. D:\NVIDIA GPU Computing Toolkit\CUDA\v10.0\cudnn\bin

注意，这里添加的是你的 CUDA 所在目录中的部分文件夹，请检查是否存在该文件夹目录以及版本号是否正确。我的 CUDA 版本为 10.0 且安装在了 D 盘，请根据自己的实际情况进行修改。添加完成后，建议按照以上的顺序将这四个环境变量排序至最顶层。

![add-cuda-path.png](/images/add-cuda-path.png)

## 安装 TensorFlow

按照[官方](https://www.tensorflow.org/install)的方法，可以直接在终端使用 pip 安装：

```sh
# Requires the latest pip
$ pip install --upgrade pip

# Current stable release for CPU and GPU
$ pip install tensorflow
```

不过这里会出现两个问题：一是网络问题，在国内使用该命令安装经常会出现网络错误而中断安装；二是版本问题，这样安装的 TensorFlow 版本并不可控，所以安装的版本不一定适用于你的计算机环境。如果安装了与计算机环境不一致的版本，运行的时候就会报错。

对于第一个问题，可以考虑换一个国内的镜像源进行下载，对于第二个问题，我认为最好的解决方法就是挑选对应版本的安装包，将安装包下载到本地，再在本地进行安装。

首先进入[下载网站](https://pypi.org/project/tensorflow/#files)，选择 Python 3.7、Window 版本的安装包进行下载。注意版本号要和 CUDA 相对应。TensorFlow 2.0.0 对应 CUDA 10.0，TensorFlow 2.1.0 对应 CUDA 10.1。

![download-tensorflow.png](/images/download-tensorflow.png)

然后在安装包所在目录打开终端，运行：

```sh
$ pip install filename
```

其中，`filename` 为安装包的名字。

安装完成后，在终端打开 Python，可以输入下列代码，检查 TensorFlow 的版本，如果运行顺利则安装成功。

```python
>>> import tensorflow as tf
>>> tf.__version__

'2.0.0'
```

如果在运行代码的时候出现报错，提示缺失某些 `dll` 文件，可能是因为安装的 CUDA 版本和 TensorFlow 版本不对应。可以进入 [DLL-FILES](https://www.dll-files.com/)，查找缺失的文件，下载并放置在 `~/NVIDIA GPU Computing Toolkit/CUDA/v10.0/bin` 文件夹下。如果在该网站并没有找到缺失的文件，在 `bin` 文件夹下会有同名不同版本号的同一文件，修改该文件名与报错中出现的文件名一致即可，注意备份修改前的文件。如果依然会报错，那可能就需要寻找对应版本的 CUDA 和 TensorFlow 重新安装了。