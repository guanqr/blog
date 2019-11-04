+++
title = "光电学院短学期结束！"
date = "2019-07-29T09:10:03+08:00"
tags = ["ZJU","Optics","Zemax","C51","Microcontroller","PCB","SolidWorks"]
categories = ["study","optics"]
katex = true
toc = true
darkImage = true
+++

随着课程答辩的完成，短学期课程正式结束。我们开始准备跨校区搬迁，从紫金港搬到玉泉。从刚结束数电考试的 7 月 4 日到 7 月 27 日，将近一个月的时间里，我们总共上了两门课程，分别是《光学系统设计》和《电子系统设计》。同信息类的其他专业早已结束课程开始搬迁，我们仍然在骄阳似火中设计着电路，看着一批又一批的外校学生来浙大夏令营。我们拥有全浙大最长的短学期，拥有最不水的短学期。在这里，我对今年短学期课程的成果做个总结。

## 光学系统设计

这门课程相当于《应用光学》课程的后期实践课程，对几何光学、相差、光学设计进行系统性的掌握。在大一的时候，听一个学长说，这门课程「恶竞」严重，一个程序设计，最终能「恶竞」到添加 UI 界面，以至于现在一想起大二的暑假就想吐。当时听到这句话没有什么感触，现在看来，这个学长说的太对了。

这门课程从 7 月 5 日上到 7 月 15 日。具体的教学安排如下。

![short-term-teaching-arrangement.jpg](/images/short-term-teaching-arrangement.jpg "教学安排")

可以看出这门课程主要分为三部分内容：程序设计、光学系统设计、绘制光学图纸。光学图纸不用说，就是画工图，还是用计算机画，设计好光学系统后，导出 SolidWorks 文件，经过简单几个操作就能画好，这一部分没什么难度。难点就在于程序设计和光学系统设计。

在课程开始的第一天，老师要求我们每一组填写一个设计任务书。

![short-term-design-document.jpg](/images/short-term-design-document.jpg "设计任务书")

### 技术指标和参数要求

1. 摄影物镜的技术指标：焦距：f'=50mm，相对孔径 D/f' 不小于 =1/3.5，图像传感器为全画幅 CCD，成像面大小 24mm×36mm。在可见光波段设计（取 d、F、C 三种色光，d 为主波长）。设计时考虑到机械误差因素，像高要预留 0.2mm 的余量。该镜头各面均为球面，不可含有非球面和其他特殊面形。
2. 根据第 1 项技术指标，检索相关资料并进行方案论证，确定初始结构。
3. 软件部分：要求能计算孔径光阑在最前面的或者已知入瞳位置大小的共轴球面系统的 f', l'，l<sub>H</sub>'，l<sub>p</sub>'，y<sub>0</sub>'，y<sub>0.7</sub>'，x<sub>t</sub>'，x<sub>s</sub>'，$\Delta$x<sub>ts</sub>' （9 个数据）以及 F 光和 C 光的近轴像位置（2 个数据）；求出轴上点全孔径、0.7 孔径的 d/F/C 光实际像点位置（6 个数据）和球差（2 个数据）、全孔径、0.7 孔径和 0 孔径的位置色差（3 个数据）；全视场、0.7 视场的 ± 全孔径、±0.7 孔径、0 孔径（主光线）各条光线（具体哪些光线，根据以下要计算的数据决定），求出两个视场两个孔径下的子午彗差（4 个数据）、两个视场 d、F、C 光的实际像高（6 个数据）、绝对畸变和相对畸变（4 个数据）以及倍率色差（2 个数据）。此项工作，要求先用软件求出所需计算的入射光线的初始坐标（L, U），然后进行光线追迹，分别得到各条出射光线的坐标（L', U'），再按照公式计算上述诸光线高度和像差值。本软件要求具有文件存取功能，便于用户使用。并以以上计算的 38 个数据为依据进行自编软件的置信度评价，要求误差在 0.1% 以下的置信度在 91% 以上，误差在 2% 以下的置信度为 100%。
4. 按第3项要求用自编程序计算教材双胶合透镜例题的像差，计算时光阑和第一面重合，以 Zemax 软件核对之。
5. 对选定的初始结构（最多不超过 6 片），用 Zemax 软件进行优化设计，使摄影物镜达到第 6 项和第 7 项的指标，透镜形状满足工艺要求，各透镜玻璃的中心厚度和边缘厚度满足教材上的工艺要求，中心空气间隔不小于 0.1mm，边缘空气间隔不小于 0.15mm，光阑前后边缘空气间隔不小于 0.3mm。
6. 焦距 f'=50mm±0.1mm，F 数误差＜5%，视场按第 1 项要求，边缘视场拦光不超过 30%，0.707 视场以内的其他视场拦光不超过 10%，中心视场不允许拦光。整组调焦，最近摄影距离 1m，CCD 保护玻璃 K9 厚度 0.7mm，保护玻璃到感光面距离 0.5mm。在保护玻璃前有红外截止滤色片，可看成 0.7mm 厚的 K9 平板玻璃，其后面到 CCD 保护玻璃距离为 0.5mm，其前面到镜头最后一面的距离在 40mm 到 45mm。
7. 考察 10m、5m、1m 三个摄影距离时整体调焦后的成像质量，各视场弥散斑越小越好，并在 5m 摄影距离时需达到Ⅰ级照相镜头的 MTF 标准[^1]，具体参数见下表。
8. 最大畸变＜2%。
9. 各面半径应尽可能多地采用浙大光仪厂样板，系统总长越短越好，尽量使用成都光明厂的环保玻璃（H- 开头），少采用高折射率高阿贝数的材料，以降低成本。

|        | 10 lp/mm |  10 lp/mm  | 30 lp/mm |  30 lp/mm  |
| :----: | :------: | :--------: | :------: | :--------: |
|        |  轴上点  | 0.707 视场 |  轴上点  | 0.707 视场 |
| 全孔径 |   0.6    |    0.3     |   0.3    |    0.15    |
|   F8   |   0.75   |    0.4     |   0.4    |    0.2     |

### 成果展示

#### 程序设计

相差计算方法如下图所示。

![short-term-differ.jpg](/images/short-term-differ.jpg "相差计算")

老师并没有强制要求我们用什么语言，但由于我们只系统地学习过 C，所以我们用 C 语言编写的这个程序，然后使用 Qt 编写图形用户界面。

其实最开始我们并没有考虑添加图形用户界面，但在程序设计的要求中有一项「便于用户使用」，并且别的组已经考虑添加图形用户界面，为了在最后答辩的时候表现得不那么 low，才决定使用 Qt 编写的，而且是一天速成 Qt。

![short-term-graphical-user-interface.jpg](/images/short-term-graphical-user-interface.jpg "图形用户界面")

在这里我不再详细说明图形用户界面的设计过程，主要展示程序的核心计算部分的内容。

主函数部分：

```c
int main(void) {
	char filename[123],k5[123],k6[123];
	double k1,k2,k3,k4;
	int i,k,c,y;
	FILE *fp;
	if((fp=fopen("d:\\temp.txt", "r"))==NULL )     
	{  
		printf("Open file failed!!\n");  
		exit(1);  
	}  
	fscanf(fp,"%s%le%le%le%le",k5,&k1,&k2,&k3,&k4);
	strcpy(filename,k5);
	a=k1;
	m=-k2;
	c=k3;
	xg=k4;
	printf("%s\n",filename);
	k=3;  ka=1; km=1 ; 	
	read_data(filename,k);
	char s[123],q[123],*t,x[26];
	strcpy(s, filename);
	strcpy(q, s);
	t=GetFilename(q);
	strcpy(x,"result.txt");
	replace_string(q,t,x);
	printf("%s\n", s);
	printf("%s\n", q);
	FILE* fp1=fopen(q, "w");
	fprintf(fp1,"f':%le\n",get_f1());
	fprintf(fp1,"D l':%le\n",get_l1(c));
	fprintf(fp1,"C l':%le\n",get_l1_c(filename,k,c));
	fprintf(fp1,"F l':%le\n",get_l1_f(filename,k,c));
	fprintf(fp1,"D L':%le\n",get_ls1(c));
	fprintf(fp1,"C L':%le\n",get_ls1_c(filename,k,c));
	fprintf(fp1,"F L':%le\n",get_ls1_f(filename,k,c));
	ka=0.7;
	fprintf(fp1,"0.7a D L':%le\n",get_ls1(c));
	fprintf(fp1,"0.7a C L':%le\n",get_ls1_c(filename,k,c));
	fprintf(fp1,"0.7a F L':%le\n",get_ls1_f(filename,k,c));
	ka=1; 
	fprintf(fp1,"l_H':%le\n",get_l1(c)-get_f1());
	fprintf(fp1,"l_p':%le\n",get_lp1(c));
	fprintf(fp1,"y_0':%le\n",get_y0(c));
	km=0.7;
	fprintf(fp1,"0.7w y_0':%le\n",get_y0(c));
	km=1;
	fprintf(fp1,"\delta L':%le\n",get_ls1(c)-get_l1(c));
	ka=0.7;
	fprintf(fp1,"0.7a \delta L':%le\n",get_ls1(c)-get_l1(c));
	ka=1; 
	fprintf(fp1,"\delta l_ch':%le\n",get_ls1_f(filename,k,c)-get_ls1_c(filename,k,c));
	ka=0.7; 
	fprintf(fp1,"0.7a \delta l_ch':%le\n",get_ls1_f(filename,k,c)-get_ls1_c(filename,k,c));
	fprintf(fp1,"0a \delta l_ch':%le\n",get_l1_f(filename,k,c)-get_l1_c(filename,k,c));
	fprintf(fp1,"X_t':%le\n",get_xt1(c));
	fprintf(fp1,"X_s':%le\n",get_xs1(c));
	fprintf(fp1,"\Delta X':%le\n",get_xt1(c)-get_xs1(c));
	fprintf(fp1,"D y_p':%le\n",get_yp1(c));
	fprintf(fp1,"C y_p':%le\n",get_yp1_c(filename,k,c));
	fprintf(fp1,"F y_p':%le\n",get_yp1_f(filename,k,c));
	km=0.7;
	fprintf(fp1,"0.7w D y_p':%le\n",get_yp1(c));
	fprintf(fp1,"0.7w C y_p':%le\n",get_yp1_c(filename,k,c));
	fprintf(fp1,"0.7w F y_p':%le\n",get_yp1_f(filename,k,c));
	km=1;
	fprintf(fp1,"\delta y':%le\n",get_yp1(c)-get_y0(c));
	fprintf(fp1,"\delta y'/y_0':%le\n",(get_yp1(c)-get_y0(c))/get_y0(c));
	km=0.7;
	fprintf(fp1,"0.7w \delta y':%le\n",get_yp1(c)-get_y0(c));
	fprintf(fp1,"0.7w \delta y'/y_0':%le\n",(get_yp1(c)-get_y0(c))/get_y0(c));
	km=1;
	fprintf(fp1,"\delta y_ch':%le\n",get_yp1_f(filename,k,c)-get_yp1_c(filename,k,c));
	km=0.7;
	fprintf(fp1,"0.7w \delta y_ch':%le\n",get_yp1_f(filename,k,c)-get_yp1_c(filename,k,c));
	km=1;ka=1;
	fprintf(fp1,"K_t':%le\n",get_Ks(c)); 
	km=0.7;ka=1;
	fprintf(fp1,"0.7w K_t':%le\n",get_Ks(c)); 
	km=1;ka=0.7;
	fprintf(fp1,"0.7a K_t':%le\n",get_Ks(c)); 
	km=0.7;ka=0.7;
	fprintf(fp1,"0.7a 0.7w K_t':%le\n",get_Ks(c)); 	
}
```

其功能为读取文件，调用各项函数计算，输出结果到文件。

在计算中，我们将光从光源出射，经过的每一个透镜面的面曲率半径、该面后方的折射率、该面到前方一面的距离、阿贝数、该面的口径大小存放在一个结构体中。

```c
struct GLASS
{
	char name[26];	// 镜片编号 
	double r;	//曲率半径 
	double n;	//后面折射率
	double d;	//到前面距离 
	double Vd; 	//阿贝数
	double s;	//镜片直径
	struct GLASS * next;	//下一镜片             
};
```

为了方便计算，还定义了一些结构体存放主光线、第一近轴光线、第二近轴光线、轴上点边缘光线相关参数。

```c
struct FACE	//储存主光线 
{
	char name[26];	//镜片编号 
	double U; 	//物方孔径角 
	double L;	//物距 
	double U1;	//像方孔径角 
	double L1;
	double n1;
	double I;
	double I1;
	double x;
	double PA;
	double s;
	double s1;
	double t;
	double t1;
	struct FACE * next;	//下一镜片
};

struct FACE1	//储存第二近轴光线 
{
	char name[26];	// 镜片编号 
	double u;	//物方孔径角 
	double l;	//物距 
	double u1;	//像方孔径角 
	double l1;
	double n1;
	struct FACE1 * next;	//下一镜片
};

struct FACE2	//储存第一近轴光线 
{
	char name[26];	// 镜片编号 
	double u;	//物方孔径角 
	double l;	//物距 
	double u1;	//像方孔径角 
	double l1;
	double n1;
	struct FACE2 * next;	//下一镜片
};

struct FACE3	//储存轴上点边缘光线 
{
	char name[26];	// 镜片编号 
	double U;	//物方孔径角 
	double L;	//物距 
	double U1;	//像方孔径角 
	double L1;
	double n1;
	struct FACE3 * next;	//下一镜片
};
```

为了方便计算各类相差，定义如下函数。

```c
void read_data(char *filename,int a);
void save(char *temp,double r,double n,double d,double Vd,double s);
GLASS *Search(char *current);	//查找镜片所在链表位置
FACE *Search1(char *current);
FACE1 *Search2(char *current);
FACE2 *Search3(char *current);
void wirte_result();	//将计算结果输出到txt文档
void save1(char *temp); 
void save2(char *temp);
void save3(char *temp);
void save4(char *temp);
void calculat_U1l1(GLASS *si);	//计算像方参数及下一面物方 
void calculat1_U1l1(GLASS *si);	//计算轴上点边缘光线像物参数
void calculat_u1l1(GLASS *si);	//计算第二近轴光线 
void calculat1_u1l1(GLASS *si);	//计算第一近轴光线
void xs_calculat(GLASS *si);
void get_head1(int c);	//得到轴外点实际光线各像物距数据 
void get_head2(int c);	//得到第二近轴光线各像物距数据
void get_head3(int c);	//得到第一近轴光线各像物距数据 
void get_head4(int c);	//得到轴上点实际光线各像物距数据
double get_f1();	//焦距f1 
double get_l1(int c);	//理想像距l’
double get_ls1(int c);	//实际像位置
double get_yp1(int c);	//实际像高
double get_xt1(int c);	//子午场曲计算
double get_xs1(int c);	//弧矢场曲计算
double get_lp1(int c);	//出瞳距计算
double get_y0(int c);	//计算理想像高
double get_Ks(int c);	//计算慧差
double get_yp1_c(char *filename,int a,int c);	//计算C光实际像高
double get_yp1_f(char *filename,int k,int c);	//计算F光实际像高
double get_l1_c(char *filename,int k,int c);	//C光理想像距离
double get_l1_f(char *filename,int k,int c);	//F光理想像距离
double get_ls1_c(char *filename,int k,int c);	//C光实际像距离
double get_ls1_f(char *filename,int k,int c);	//F光实际像距离
char *GetFilename(char *p);
void replace_string(char * source_str,char * targ_str,char *val);
```

这些函数直接套用书上计算相差的公式就 OK 啦。由于程序代码过长，不方便在这里展示，需要的朋友可以在这里下载（暂不提供图形用户界面的代码）：[optical-system.zip](/uploads/optical-system.zip)。

另外，该程序读取的文件内容书写也有一定的格式，与上文所说存放透镜参数的结构体数据顺序一致。

```
a1 62.5 1.51679695 500 64.2124 10
a2 -43.65 1.67270157 4 32.1789 10 
a3 -124.35 1 2.5 0 10
```

那么这个程序计算的结果精准程度如何呢？

下图为使用 Zemax 仿真与使用自编程序各项参数的计算结果，可以看出精确度还是很高的，达到了设计要求。

![short-term-calculation-results.jpg](/images/short-term-calculation-results.jpg "计算结果汇总")

其中位置色差与像散的结算结果误差较大，其他小组的计算结果也出现了这种问题，或许是 Zemax 软件使用的算法与我们不同。

#### 光学系统设计

光学系统设计用到的软件是 Zemax，我是第一次使用这个软件，操作界面很不友好，需要设置很多的参数，我摸索了很长时间才掌握了其基本操作。对于光学系统的初始结构，我找了很多文献资料，最后做出来的结果都不怎么理想。这个设计的评分原则是，所用透镜的个数越少越好，MTF 曲线越高越好，当然，透镜越少，校正像差的效果就越困难，设计的难度更高。有的小组设计的四个透镜组成的系统效果很棒，我们组还是很稳地使用了六个透镜的组合。

下面是我们组设计的光学系统的具体内容。

参数设定：

![short-term-optical-parameter-setting.jpg](/images/short-term-optical-parameter-setting.jpg "光学参数设定")

系统焦距为 50.0794mm。

平面图如下图所示：

![short-term-optical-system-plane-figure.jpg](/images/short-term-optical-system-plane-figure.jpg "光学系统平面图")

拦光情况如下所示：

![short-term-light-fov.jpg](/images/short-term-light-fov.jpg "系统光线视场")

MTF 曲线如下所示：

F=3.5 时：

![short-term-light-mtf-f35.jpg](/images/short-term-light-mtf-f35.jpg "MTF 曲线")

F=8 时：

![short-term-light-mtf-f8.jpg](/images/short-term-light-mtf-f8.jpg "MTF 曲线")

最大畸变达到 1.8446%，各项参数均达到设计要求。

![short-term-field-curvature.jpg](/images/short-term-field-curvature.jpg "场曲/畸变")

![short-term-distortion.jpg](/images/short-term-distortion.jpg "畸变")

在光学图纸的绘制，我们总共绘制了九张图纸，六片透镜的、两个双胶合透镜的、一个整体系统的。这里展示一下系统的图纸，其他的不一一展示了。在绘制光学图纸的时候，需要注意生产要求的标注。

![short-term-optical-drawing.jpg](/images/short-term-optical-drawing.jpg "光学图纸")

### 课程感想

这门课程总结一下一个字就能概括，那就是「肝」。前面程序设计部分，只要各项相差的算法能熟练掌握，基本不成问题。但在设计光学系统的时候，为了设计出达标的光学系统，我从早上六点多起来，开始调整参数，在屏幕前一坐就是一天，中间就吃了一点面包。在课程期间我还得了肠胃炎，感觉「生不如死」。这门课程的工作量巨大，在有限的时间内，要求你实现无限的可能。虽然说有竞争就很可能出现奇迹，但真的很累很累。和这门课程相比，后面这门《电子系统设计》简直就是养老课程。

## 电子系统设计

这门课程是《微机原理与接口技术》课程的后续实践课程，对 PCB 板的绘制，单片机的编程进行系统学习与综合实践，趣味十足，在《光学系统设计》课程中，每天需要「肝」到凌晨，但这门课，下课后基本没有什么任务。这门课程也比较重要，对大三暑期的光电设计竞赛打下基础（我现在并没有想好明年暑假是参加光电设计竞赛还是去实习）。

这门课程从 7 月 17 日上到 7 月 27 日，主要分为三部分内容：电路原理图与 PCB 板的绘制、电路焊接与调试、微机程序设计。在以前的课程中，还有印刷电路板这一项，将你设计好的 PCB 板制作出来。但是由于我们使用的电路比以往要复杂很多，学校提供的仪器精度不够，所以就取消了。

在微机程序设计部分，今年有两组套件可以选择，一是无弦琴、二是出租车计价器。我选的是无弦琴，因为出租车计价器里有一些模块，在我上《微机原理与接口技术》这门课程的时候给我留下了一些阴影，让我觉得出租车计价器的程序编写起来一定很坑，当然，无弦琴和音乐有关，这也是我喜欢的部分。

### 设计要求

+ PCB 板：
  + 线宽：信号线 ≥0.254ｍｍ、电源线 ≥0.508ｍm、地线通过辅铜连接。
  + 过孔直径 ≥0.381ｍｍ。
  + 安全间距 ≥0.254ｍｍ。
  + 采用双面板，双层布线。
+ 弹奏功能：7 个激光对管实现中高低 21 个音符的实时弹奏，在 LCD 上显示乐谱。
+ 录音功能：录制所弹奏的音符，包括每个音符持续时间及相邻音符的间隔时间。录制完后可回放及在 LCD 上显示乐谱。
+ 娱乐功能：设计一款音乐游戏。例如：看谱学习弹奏，对所弹乐谱和标准乐谱比较及评价。

### 成果展示

先来看看我的无弦琴外观图。

![short-term-no-stringed-qin.jpg](/images/short-term-no-stringed-qin.jpg "无弦琴")

#### 电路原理图与 PCB 设计

这门课使用到了 Altium Designer 这一款软件，通过这个软件绘制电路原理图和 PCB 板。我们在这门课程中只是接触到了这款软件的「皮毛」部分，其实还有很多需要课外下功夫学习的地方。

我绘制的电路原理图：

![short-term-schematic-0.jpg](/images/short-term-schematic-0.jpg "电路原理图 1")

![short-term-schematic-1.jpg](/images/short-term-schematic-1.jpg "电路原理图 2")

分为电源模块、LCD模块、喇叭模块、蜂鸣器模块、LED显示模块、激光接收管IS0103模块、按键模块、激光发射管模块。

无弦琴的芯片采用 STC15F2K60S2，有三个定时器：定时器 0、定时器 1 和定时器 2，有两个硬件串口（UART1 和 UART2），有 SPI（只可用作主模式,从模式不可用），有 3 路 PCA/PWM/CCP（可用作 DAC），有 8 通道 10 位精度的 A/D。

LCD 液晶显示模块是 128×64 点阵的汉字图形型液晶显示模块。

![short-term-lcd.jpg](/images/short-term-lcd.jpg "LCD 液晶显示器")

PCB 图：

![short-term-pcb-part1-0.jpg](/images/short-term-pcb-part1-0.jpg "主控制板正面")

![short-term-pcb-part1-1.jpg](/images/short-term-pcb-part1-1.jpg "主控制板背面")

![short-term-pcb-part2-0.jpg](/images/short-term-pcb-part2-0.jpg "激光发射板正面")

![short-term-pcb-part2-1.jpg](/images/short-term-pcb-part2-1.jpg "激光发射板正面")

在设计中遇到的问题：

1. 添加元器件库：绘制原理图需要添加不同的元器件，有一些元器件在软件自带的库中包含，但还有一些特殊的元器件需要自己绘制并添加到库中。老师给我们提供了部分元器件的库，但仍有几个元件需要自己绘制。我绘制了三个元件图，并添加在库中。分别为 DLED、NCP1117-3.3、SN74HC21。
2. 放置元器件并添加电气连接：在这里每一个元器件管脚的 Designator，需要注意标号的顺序一定要正确，否则会在后面绘制PCB板的时候出现问题。在管脚处还需要添加网络标签，建立不同元器件之间的电气连接。最初绘制的时候，对每一个元器件的管脚处并没有添加网络标签，只是进行了文字的注释。这样会导致在编译检查错误的时候，本应相连的两个元器件之间并没有任何连接。
3. 元器件封装：封装的时候，有几个元件没有现成的封装库，需要自己设计，我自行设计了 RM065、IS0103 等元件的封装。这里需要通过查找资料获得元器件的尺寸等相关参数进行设计。在这里要注意焊盘的大小。
4. 布线：首先使用软件自动布线的功能，可以显著地减小工作量，但是自动布线有一些地方不够美观。因此我决定先进行手动布线，在基本布线完成后，固定已有布线，进行自动布线。一方面充分发挥了自动布线的功能，另一方面经过手动调整之后整体的布线更加美观、合理。

![short-term-dled-npc1117-sn74hc21.jpg](/images/short-term-dled-npc1117-sn74hc21.jpg "绘制的元件")

![short-term-designator.jpg](/images/short-term-designator.jpg "Designator")

![short-term-package.jpg](/images/short-term-package.jpg "封装设计")

#### 电路焊接

其实在大一、大二的一些课程中已经练习了很多次焊接了，焊接中最难的部分就是贴片元件的焊接。上一次焊接贴片还是在大一的电子工程训练中，到现在隔了很长时间没有练习，有一些生疏。焊接的时候很难控制贴片元件的方向和位置，导致焊接速度很慢，焊点的美观程度也有待提高。我最终采用的焊接方法是，先对其中一个焊盘上锡，接着拿镊子夹持元件到安装位置，右手持烙铁靠近以镀锡的焊盘并熔化焊锡，将一个引脚焊好，固定完一个脚之后再焊接另一个脚。

在焊接 LED 的时候，套件自带的两个蓝光 LED 在焊接过程中外壳被镊子意外夹碎，因此更换了两个红光 LED。为了实现无弦琴的正常工作，必须保证所有的激光发射器和激光接收管精准对齐。最开始焊接时，我们将所有激光接收管都拔高，使得其高度与激光发射器相同，但是在实际使用时发现很难将所有激光对管同时对准，或者对准之后很容易受到干扰。最终决定重新焊接到底部，并将激光发射器所在的 PCB 板垫高，从而更容易实现激光对管的对准。

在老师发的无弦琴套件中，高低音选择模块的电路有一些问题，因此没有焊接该模块，直接采用矩阵键盘控制高低音选择。

![short-term-weld-0.jpg](/images/short-term-weld-0.jpg "电路焊接背面")

![short-term-weld-1.jpg](/images/short-term-weld-1.jpg "电路焊接正面")

#### 程序设计

整体结构：

![short-term-program-function-structure.jpg](/images/short-term-program-function-structure.jpg "程序功能结构")

程序功能流程图由于篇幅所限，不再展示。

在老师所给的示例程序中，控制音调的部分，发音不太准确，而且将乐谱转换为数组存放在程序中较为繁琐。我在网上搜索到一个更好的控制发音的方法。定义一个二维数组控制发音，能够实现4个8度的 48 个音调的发音。包括七个音符与升降调的发音。并且在输入乐谱的时候，只需要输入音符与发音长短即可。

```c
unsigned char code T[49][2]={{0,0},
//0低 
{0xF8,0x8B},{0xF8,0xF2},{0xF9,0x5B},{0xF9,0xB7},{0xFA,0x14},{0xFA,0x66},{0xFA,0xB9},{0xFB,0x03},{0xFB,0x4A},{0xFB,0x8F},{0xFB,0xCF},{0xFC,0x0B},
//12中 
{0xFC,0x43},{0xFC,0x78},{0xFC,0xAB},{0xFC,0xDB},{0xFD,0x08},{0xFD,0x33},{0xFD,0x5B},{0xFD,0x81},{0xFD,0xA5},{0xFD,0xC7},{0xFD,0xE7},{0xFE,0x05},
//24高 
{0xFE,0x21},{0xFE,0x3C},{0xFE,0x55},{0xFE,0x6D},{0xFE,0x84},{0xFE,0x99},{0xFE,0xAD},{0xFE,0xC0},{0xFE,0x02},{0xFE,0xE3},{0xFE,0xF3},{0xFF,0x02},
//36再高 
{0xFF,0x10},{0xFF,0x1D},{0xFF,0x2A},{0xFF,0x36},{0xFF,0x42},{0xFF,0x4C},{0xFF,0x56},{0xFF,0x60},{0xFF,0x69},{0xFF,0x71},{0xFF,0x79},{0xFF,0x81}
//     1(1)     1#(2)        2(3)       2#(4)       3(5)       4(6)         4#(7)       5(8)       5#(9)         6(10)      6#(11)       7(12) 
};
unsigned char code music1[][2]={      
{0,4},
{10,12},{17,4},{15,4},{17,4},{13,4},{12,4},{10,8},{10,8},{10,8},{10,8},{17,8},{17,4},{10,4},{13,4},{15,4},{17,4},{15,4},
{15,8},{15,8},{15,8},{15,8},{17,4},{17,4},{17,4},{10,4},{13,8},{13,4},{15,4},{17,4},{17,4},{17,4},{10,4},{13,8},{13,8},{12,4},{12,4},{12,4},{10,4},{8,4},{10,4},{5,4},{8,4},
{10,8},{10,8},{10,8},{10,8},{13,8},{13,8},{13,12},{12,4},{10,4},{10,2},{13,2},{10,4},{8,4},{5,8},{5,8},{17,4},{17,8},{10,4},{13,4},{15,4},{17,4},{15,4},
{15,8},{15,8},{15,8},{15,8},{17,4},{17,4},{17,4},{10,4},{13,8},{13,4},{15,4},{17,4},{17,4},{17,4},{10,4},{13,8},{13,8},{12,4},{12,4},{12,4},{10,4},{8,4},{10,4},{5,4},{8,4},
{10,8},{10,8},{10,8},{10,8},
{0xFF,0xFF}
};//歌曲1
```

最初为了使前后两个相同音符发声时有间断，在音乐播放函数中增加了下面的代码：

```c
else if(m==music[i+1][0]) 
{
    TR0=1;
    delay(n);
    TR0=0;
    pause();
    i++;
}
```

但在录音中，由于录音无法准确控制音的长短，存放在数组中的时候，同一个音很可能存放在好几个数中，所以播放录音的时候会出现停顿，最后考虑将这一代码删去。

最初设想增加一个函数，单独显示乐谱，但由于在音乐播放时无法同时启用另一个函数实时显示乐谱并实现翻页，最后将显示乐谱的功能增加到了音乐播放函数中。

```c
switch (num)
{
	case 1: Disp(p,j,2,"1"); break;
	case 2: Disp(p,j,2,"2"); break;
	case 3: Disp(p,j,2,"3"); break;
	case 4: Disp(p,j,2,"4"); break;
	case 5: Disp(p,j,2,"5"); break;
	case 6: Disp(p,j,2,"6"); break;
	case 7: Disp(p,j,2,"7"); break;
}
```

程序基本要求为能弹奏高中低部的音，由于电路板中高低音选择模块没有添加进去，为了控制高低音，需要控制矩阵键盘的输入状态。因此我们采用，基本发声为中音部 12 个音（包括升降音），定义一变量 `tune`，当某一按键按下，事件为高音，`tune=1`，则发出的声音此声音 `+12tune`。当某一按键按下，事件为低音，`tune=-1`，则发出的声音此声音 `-12tune`。

```c
if (OPT_CHECK!=0xff)
{
	switch(key_tune)
	{
		case 41:Disp(2,5,6,"high  ");tune=1;break;
		case 42:Disp(2,5,6,"low   ");tune=-1;break;
		default:Disp(2,5,6,"middle");tune=0;break;
	}	
}
if(!(OPT_CHECK&0x01))
{
	Disp(2,0,8,"音调：1");
	m=13+12*tune,n=2;			 
}
```

在录音功能中，除了上述声音间断的问题，还有的问题是，开启录音后会立即录音，录音完成后，如果激光发射管与接收管没有对齐，会一直发出声音。我们定义了一个空数组存放录音。

```c
unsigned char idata music6[][2]={
{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},
{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},
{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},{0,4},
{0xFF,0xFF}}; // 录音
```

但由于数组长度固定，如果只是播放所录的音，并且录的声音过短的话，数组后面会空下很多空的数，那么在乐谱显示中会一直显示 0。最终我们的解决方法是，开启录音后，判断音符是否为 0，如果不是 0 才开启录音，因此数组存放的第一个音不会是 0，即空音。在录音结束后，在最后一个音后插入终端 `{0xFF,0xFF}`，这样就不会显示后面的空音 0。

为了显示我们想要的图像，需要将图像的像素调整到 128*64，这也是显示屏的像素。然后使用取模的软件，将图像转换为数组存放，存放的数据为 16 进制，转化为 2 进制为 8 位，因此长度为 16。我们使用的 LCD 显示屏是由两块屏拼接而成，显示图像的函数定义为上下两块屏同时刷新显示。因此高度 64 需要拆成 2 个 32。

```c
uchar clong,hight;
hight=32;
clong=16;
Ini_Lcd();//液晶初始化子程序
WRGDRAM(0x80,clong,hight,gImage_1); // 开机图片
```

在编写程序的过程中，我们发现有一些特定的汉字无法显示，会出现乱码。比如我们有一个娱乐功能是数独游戏，「数独」这两个字就无法显示。最终我们采用显示英文的方法避开了这个问题。

程序的完整代码可以在这里下载：[wu-xian-qin.zip](/uploads/wu-xian-qin.zip)。

功能展示：

![short-term-no-stringed-qin-function-0.jpg](/images/short-term-no-stringed-qin-function-0.jpg)

![short-term-no-stringed-qin-function-1.jpg](/images/short-term-no-stringed-qin-function-1.jpg)

### 课程建议

这门课程用一句话总结：收获颇多，趣味十足。看到美妙的乐曲从自己制作的无弦琴中演奏出来，内心充满喜悦。但我还想提一些建议。

1. 在答辩过程中，有同学提到，课程内容时长设计不太合理，说前面的 Altium Designer 软件的使用应该缩减时间，要花更多的时间在程序设计上。这一点我并不认可。我觉得 AD 软件的使用是基础操作的训练，在软件的学习中，肯定有一些同学还没有掌握软件的基础操作。因此我觉得，可以在原有教学时长不变的情况下，在 AD 软件使用部分增加一些内容，加深印象。

2. 关于课程开设的时间，我们都希望能在不那么热的时候上课。因为大二学生要从紫金港搬到玉泉，如果将课程改到开学前进行，那只能将该课程改到玉泉上，这也是一件很麻烦的事。所以我想，可以考虑在晚上进行课程，比如一天的开课时间为 8:30-11:30，18:30-21:30，避开下午上课。但这样的话需要老师更辛苦一些。

3. 关于套件的原理，在答辩中，可以看到大多数同学并没有深入了解无弦琴的工作原理，对于老师的一些问题并没有思考过。所以我觉得可以考虑增加部分套件电路原理的学习。在我们组答辩的时候，老师问我们用没用到万用变示波器之类的仪器检测焊接并调试，我们没有使用。我觉得，可以在以后的课程中，对套件中的一些元件，不硬性规定参数，举个例子，比如发射管模块的电阻，不规定电阻的阻值，让同学们自己摸索出适合的阻值进行焊接，这样设计出的电路就更加灵活。在这期间可能会焊接错误的阻值，这样的话无弦琴的工作状态肯定就不理想，这样的话，学生们就一定需要调试电路，对无弦琴工作原理的理解就加深了。

4. 由于我们上课所用的教室不经常用，设备也会出现一些问题，比如我们上课时投影仪的颜色就出现了问题，这对于课程教学有一定的影响。希望能经常检查设备的工作状况。

[^1]: 低频的 MTF 一般应高于高频的 MTF，如有降低，则降低处比高频最高的 MTF 值低 20% 以内。 