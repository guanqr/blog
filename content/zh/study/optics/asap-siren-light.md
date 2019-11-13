+++
title = "ASAP 例程 Siren Light 分析"
date = 2019-11-06T23:43:17+08:00
tags = ["Optics","ASAP","Modelling"]
categories = ["study","optics"]
series = ["Major-Courses"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

![asap-siren-light-0.png](/images/asap-siren-light-0.png)

警示灯常用于维护道路安全，用于救护车、警车、消防车等，能够在大角度的范围内引起人体视觉系统的注意。为了适应道路复杂多变的情况，警示灯使用红色光源，并采用反射式绕轴旋转的结构，用「晃」的视觉效果使警示范围的人眼警觉性提高。该 Siren Light 例程对警示灯的主体结构进行了建模仿真，并对出射光的光强分布进行了分析。

## 具体结构

例程所给出的警示灯结构较为简单，灯罩为一个圆柱和一个半球的组合，光线可以完全透射，在灯罩的上方有一个曲面，该曲面为反光材质，可以将从光源上方发出的光反射到下方，灯罩的下方有一个倾角为 45 度的反光斜面，该斜面可随转轴转动，将上方的光线反射出灯罩，形成具有一定发散角的光束。经过这一光学系统，可将一近似点光源的光束转换成可控方向的、具有一定角度的光束。

## 代码详解

该例程的代码主要分为三部分内容，参数定义、模型构建和光线分析。这里对该例程的代码按以上分类进行研究与解读。

### 参数定义

```
EPS=0.05    !! 定义epsilon变量数值
NRAYS=100000    !! 设定光线数
NPIXELS=45  !! 设定光线接收分辨率
LGT_MIR_DST=1   !! 灯顶反射镜与底部转镜之间的距离
LGT_SHD_HGT=20  !! 灯罩的内部总高度
LGT_SHD_WID=5   !! 灯罩的内部总宽度
LGT_SHD_THK=0.25    !! 灯罩的厚度
MOTOR_HGT=4 !! 底部电机的高度
MOTOR_AXLE_WID=1    !! 底部转轴宽度
FILA_OFFSET=(LGT_SHD_WID/4.0)   !! 灯丝（光源）距反射镜原点的距离
FILA_HGT=0.5    !! 灯丝高度
FILA_THK=0.025  !! 灯丝厚度
FILA_RAD=0.2    !! 灯丝的转弯半径
```

### 模型构建

首先是定义波长和材料的折射率，以及光线吸收面、透射面和反射面。

```
SYSTEM NEW
UNITS  INCHES

WAVELENGTHS      400       500       600       700   NANOMETERS
MEDIA
                1.3       1.35      1.4       1.45   'SHADE_MAT'
COATING PROPERTIES
             0.0 0.0   0.0 0.0   0.0 0.0   0.0 0.0  'ABSORB'
             0.0 1.0   0.0 1.0   0.0 1.0   0.0 1.0  'TRANSMIT'
             1.0 0.0   1.0 0.0   1.0 0.0   1.0 0.0  'REFLECT'
```

然后开始构建模型，这里先构建的是灯罩部分，根据设定的参数数值，灯罩高度和宽度，构建内外两层灯罩。顶部圆弧曲率直径与设定的灯罩宽度相
等，表面为光学透射面。

```
EDGE
  ROUNDED  Y  0  (LGT_SHD_HGT)  (LGT_SHD_WID)  (LGT_SHD_WID)  32  0  90
    SWEEP  AXIS  360  0  0  1  0  0  0
OBJECT; .1  'LIGHT.SHADE.INTERIOR'
  INTERFACE COATING  "TRANSMIT"  "AIR"  "SHADE_MAT"
  FACETS 1 8
  REDEFINE COLOR 20

EDGE
  ROUNDED  Y  0  (LGT_SHD_HGT+LGT_SHD_THK)  (LGT_SHD_WID+LGT_SHD_THK)  (LGT_SHD_WID+LGT_SHD_THK)  32  0  90
    SWEEP  AXIS  360  0  0  1  0  0  0
OBJECT; .1  'LIGHT.SHADE.EXTERIOR'
  INTERFACE COATING  "TRANSMIT"  "SHADE_MAT"  "AIR"
  FACETS 1 8
  REDEFINE COLOR 20
```

![asap-siren-light-1.png](/images/asap-siren-light-1.png "构建灯罩")

构建灯顶的弧形反射面。使用 `REVOLUTION` 和 `LOCAL` 指令确定弧形的弯曲程度，其参数变量根据构建的灯罩宽度进行限定。并设定曲面为反射面。

```
SURFACE
  REVOLUTION  Z  0  0  0  1  (1/LGT_SHD_WID)  0,
                  0  0  0  0  0
    LOCAL  -(LGT_SHD_WID-EPS)  (LGT_SHD_WID-EPS)  -(LGT_SHD_WID-EPS)  (LGT_SHD_WID-EPS)  -(LGT_SHD_WID-3*EPS)  (EPS)  Z  0
    SHIFT  Z  (LGT_SHD_HGT-3*EPS)
OBJECT; .1  'LIGHT.REFLECTOR'
  INTERFACE COATING  "REFLECT"  "AIR"  "AIR"
  FACETS 8 3
  REDEFINE COLOR 1
``` 

![asap-siren-light-2.png](/images/asap-siren-light-2.png "构建弧形反射面")

构建底部反射面 X-Z 面构建四十五度的斜面，斜面宽度等于灯罩内宽度 `2*(LGT_SHD_WID)`。

```
SURFACE
  PLANE NORMAL  1  0  1  0  0  0
    LOCAL  -(LGT_SHD_WID-EPS)  (LGT_SHD_WID-EPS)  -(LGT_SHD_WID-EPS)  (LGT_SHD_WID-EPS)  -(LGT_SHD_WID)  (LGT_SHD_WID)  Z  0
    SHIFT  Z  (LGT_SHD_HGT-2*LGT_SHD_WID-LGT_MIR_DST)
OBJECT; .1  'LIGHT.ROTATING_MIRROR'
  INTERFACE COATING  "REFLECT"  "AIR"  "AIR"
  FACETS 8 3
  REDEFINE COLOR 1
```

![asap-siren-light-3.png](/images/asap-siren-light-3.png "构建底部反射面")

构建圆柱形底座，首先建一个管状物。半径为 `(LGT_SHD_WID-EPS)`，高度为 `(MOTOR_HGT)`，该面为吸收面。然后构建圆柱形底座的顶面，同样为吸收光线面。

```
SURFACE
  TUBE  Z  0  (LGT_SHD_WID-EPS)  (LGT_SHD_WID-EPS)  (MOTOR_HGT)  (LGT_SHD_WID-EPS)  (LGT_SHD_WID-EPS)  0  0
OBJECT; .1  'LIGHT.MOTOR.SIDE'
  INTERFACE COATING  "ABSORB"  "AIR"  "AIR"
  FACETS 8 3
  REDEFINE COLOR 1

SURFACE
  PLANE  Z  (MOTOR_HGT)  ELLIPSE (LGT_SHD_WID-EPS) (LGT_SHD_WID-EPS) 0 0 0
OBJECT; .1  'LIGHT.MOTOR.TOP'
  INTERFACE COATING  "ABSORB"  "AIR"  "AIR"
  FACETS 8 3
  REDEFINE COLOR 1
```

![asap-siren-light-4.png](/images/asap-siren-light-4.png "构建底座")

构建控制底部反光板的转轴，先建一个管，再建一个与底部反光板相同的斜面切除管。该面为光线吸收面。

```
SURFACE
  TUBE  Z  (MOTOR_HGT)  (MOTOR_AXLE_WID)  (MOTOR_AXLE_WID)  (LGT_SHD_HGT)  (MOTOR_AXLE_WID)  (MOTOR_AXLE_WID)  0  0
SURFACE
  PLANE NORMAL  1  0  1  0  0  0
    SHIFT  Z  (LGT_SHD_HGT-2*LGT_SHD_WID-LGT_MIR_DST)
OBJECT; .2  'LIGHT.MOTOR.AXLE'
  BOUNDS  -.1
  INTERFACE COATING  "ABSORB"  "AIR"  "AIR"
  FACETS 8 3
  REDEFINE COLOR 1
```

![asap-siren-light-5.png](/images/asap-siren-light-5.png "构建转轴")

构建光线探测面，为一矩形平面，该面与 Z 轴垂直。

```
SURFACE
  PLANE  X  (3*LGT_SHD_WID)  RECTANGLE (2*LGT_SHD_WID) (2*LGT_SHD_WID) 0 0 0
    SHIFT  Z  (LGT_SHD_HGT-2*LGT_SHD_WID-LGT_MIR_DST)
OBJECT; .1  'DETECTOR'
  INTERFACE COATING  "ABSORB"  "AIR"  "AIR"
  FACETS 1 1
  REDEFINE COLOR 8
```

![asap-siren-light-6.png](/images/asap-siren-light-6.png "构建探测面")

最后定义光源，位置和光线数量。

```
RESET             !! - clear out any existing sources or rays
WAVELENGTH  630   !! - assign wavelength for source (roughly red)
EMITTING HELIX  Z  0  (FILA_HGT)  5  (FILA_RAD)  (FILA_THK)  (NRAYS)
  SHIFT  Z  (LGT_SHD_HGT-FILA_OFFSET-0.5*FILA_HGT)
```

![asap-siren-light-7.png](/images/asap-siren-light-7.png "构建光源")

### 光线分析

对出射的光线进行光强分布等一系列分析。

```
WINDOW Z X
CONSIDER EXCEPT DETECTOR
PLOT FACETS OVERLAY !! 画出警示灯栅格图
SPOTS POSITION EVERY (NRAYS/1000) OVERLAY !! 用光线的一部分画出灯丝
CONSIDER ALL
MISSED ARROW (0.5*LGT_SHD_HGT)  !! 设置未到探测器的光线的延长距离
ARROW 1.5
TRACE PLOT (NRAYS/70)
CONSIDER ONLY DETECTOR  !! 只考虑探测器上的光线
WINDOW Z -Y !! 改变窗口坐标，适应探测器的方向
PIXELS (NPIXELS)  !! 控制接下来光强分布计算的图窗大小
SPOTS POSITION ATTRIBUTE 0
DISPLAY
  PICTURE !! 显示栅格图
  PLOT3D  !! 显示光强分布的 3D 图
  CONTOUR 7 !! 做 7 条等光强线
  WRITE OUTPUT.DIS
  RETURN
$VIEW
&VIEW OUTPUT.DIS
```

## 测试结果

根据上述 ASAP 例程进行构建，运行代码，可以得到警示灯的模型样图以及光强分布的特性分析。

![asap-siren-light-8.png](/images/asap-siren-light-8.png "3D 视图")

程序输出的光强分布图如下图所示，由中心到边缘，光线强度逐渐增加再逐渐减小。

![asap-siren-light-9.png](/images/asap-siren-light-9.png "光强分布图")

![asap-siren-light-10.png](/images/asap-siren-light-10.png "光强分布 3D 视图")

![asap-siren-light-11.png](/images/asap-siren-light-11.png "等光强线图")

## 谈谈这门课

最后，我想谈谈我对这一门课的感受。

在选课阶段开始之前，就听学长说过推荐选这一门课，因为课程作业量很少，作业当堂写完当堂检查，不会留课下作业。选课的时候，学院开设了两门建模课，这两门课并没有显示在默认的第一栏本学期推荐修读课程选课中，而是要在选课网站中的专业课程中才能找到，这也导致很多人并没有看到这门课程。说到建模，我相信大多数同专业的同学就会联想到两个暑假被光学建模支配的恐惧，不过这门课确实很简单，每一步操作课件上都有提示，只要按照课件的步骤来做，基本不会出问题。并且因为选这门课的人数比较少，有什么问题，老师也会一一解答。如果非要说这门课有什么缺点的话，那可能就是上课的时间有点长，要一整个下午。ASAP 软件的使用很简单，这也是光学器件建模中经常使用到的软件，多学一些技能，也对自身的专业素质提升有帮助。