+++
title = "单片机基础操作"
date = "2019-06-14T19:12:11+08:00"
tags = ["Microcontroller","ASM"]
categories = ["study","computer"]
series = ["Major-Courses"]
dropCap = true
displayCopyright = true
gitinfo = true
+++

![c51-computer.jpg](/images/c51-computer.jpg)

临近期末考试周，我们专业的选修课《微机原理与接口技术》的实验部分也验收完毕。这门课程总共设置了四个专题实验，对于初学单片机的学生来说，这四个专题实验还算是简单。只要掌握了基本的原理，题目再出什么花样都离不开最基本的框架。

这四个专题实验分别为：

+ I/O 口控制实验
+ 定时器实验
+ 键盘接口实验
+ 1-Wire 与 I<sup>2</sup>C 总线实验

我们使用的是普中科技的单片机实验箱，实验箱基本包含了各种基础模块，比较适合初学者学习使用。在开始实验之前，我的室友就在网上搜集到了普中科技实验箱的教学指导资料。里面包含了单片机各模块的使用程序，可以作为不错的参考资料。

下面总结一下我是怎么做这四个实验的。

## I/O 口控制实验

### 基础型

实验一：实现 8 位逻辑电平显示模块的奇偶位亮灭闪烁显示，闪烁间隔为 1s。

```c
#include <reg52.h>
#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int
void delayms(uint k)
{
	uint i;
	uchar j;
	for(i=k;i>0;i--)
	for(j=110;j>0;j--);
}

void main(){
	char data s,i;
	while(1){
		s=0xaa;
		P2=s;
		delayms(1000);
		for(i=0;i<7;i++){
			s=_cror_(s,1);
			P2=s;
			delayms(1000);
		} 
	}
}
```

实验二：实现 8 位逻辑电平显示模块的 LED 轮流点亮，间隔为 1s。

```c
#include <reg52.h>
#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int
void delayms(uint k)
{
	uint i;
	uchar j;
	for(i=k;i>0;i--)
		for(j=110;j>0;j--);
}

void main(){
	char data s,i;
	while(1){
		s=0x80;
		P2=s;
		delayms(1000);
		for(i=0;i<7;i++){
			s=_cror_(s,1);
			P2=s;
			delayms(1000);
		}
	}
}
```

在以上两题中，将 P2 口接入发光管，发光管的亮灭与 P2 口的输出有关。因此我们可以设定 P2 口输出的初值（这个初值是一个八位二进制数），再利用 `_crol_`（循环左移）或 `_cror_`（循环右移）位移函数将数值进行位移，即可控制灯亮灭的转换。

比如，设定奇偶位亮灭，上述程序设定的初始值为 0xaa，即二进制 10101010，执行 `_crol_`，则在延时后变为 01010101，实现了奇偶位亮灭的变化。

同理，实现灯的轮流点亮，则可设定其中一个初始值为 1，剩余灯为 0，如上述程序，设定的初始值为 0x80，即二进制 10000000，执行 `_crol_`，则灯依次点亮。

在上述程序中用到的延时函数 `delayms(1000)`，近似可实现循环一次延时 1s。

### 设计型

采用按键控制 8 个 LED 全亮、全灭、循环点亮或奇偶位亮灭闪烁显示。

```c
#include <reg52.h>
#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int
	
void delay(uint k);
void key1();
void key2();
void key3();
void key4();
	
sbit k1=P0^0;
sbit k2=P0^1;
sbit k3=P0^2;
sbit k4=P0^3;

void main()
{
	while(1){
		key1();
		key2();
		key3();
		key4();
	}
}

void delay(uint k)
{
	uint i;
	uchar j;
	for(i=k;i>0;i--)
		for(j=55;j>0;j--){
			if(k1==0){
				P2=0x00;
				p=1;
				break;
			}
			else if(k2==0){
				P2=0xff;
				p=1;
				break;
			}
			else if(k3==0){
				key3();
			}
			else if(k4==0){
				key4();
			}
		}
}

void key1()
{
	if(k1==0){
		P2=0x00;
		while(!k1);
	}
}

void key2()
{
	if(k2==0){
		P2=0xff;
		while(!k2);
	}
}

void key3()
{
	if(k3==0){
		char data s,i;
		int p=0,k=0;
		while(1){
			s=0x80;
			P2=s;
			delay(1000);
			for(i=0;i<7;i++){
				if(k1==0){
					P2=0x00;
					p=1;
					break;
				}
				else if(k2==0){
					P2=0xff;
					p=1;
					break;
				}
				s=_cror_(s,1);
				P2=s;
				delay(1000);
			}
			if(p==1) break;
		}
		while(!k3);
	}
}

void key4()
{
	if(k4==0){
		char data s,i;
		int p=0;
		while(1){
			s=0xaa;
			P2=s;
			delay(1000);
			for(i=0;i<7;i++){
				if(k1==0){
					P2=0x00;
					p=1;
					break;
				}
        		else if(k2==0){
					P2=0xff;
					p=1;
					break;
				}
				s=_cror_(s,1);
				P2=s;
				delay(1000);
			}
			if(p==1) break;
		}
		while(!k4);
	}
}
```

### 探究型

十字路口交通灯模拟实验

实验一：设计程序，使南北方向和东西方向交通灯同时显示红色、绿色、黄色各 1s 后，再分别显示不同的颜色并实现显示色的滚动。

```c
#include <reg52.h>
#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int
void delay(uint k)
{
	uint i;
	uchar j;
	for(i=k;i>0;i--)
		for(j=110;j>0;j--) ;
}

void main(){
	P2=0xdb;
	delay(1000);
	P2=0xb7;
	delay(1000);
	P2=0x6f;
	delay(1000);
	while(1){
		P2=0x7f;
		delay(500);
		P2=0xbf;
		delay(500);
		P2=0xdf;
		delay(500);
		P2=0xef;
		delay(500);
		P2=0xf7;
		delay(500);
		P2=0xfb;
		delay(500);
	}
}
```

实验二：模拟十字路口交通灯。交通信号灯控制逻辑如下：开始东西路口的绿灯亮，南北路口的红灯亮，东西路口方向通车，对应人行道绿灯亮。延时一段时间后（20 秒），东西路口的绿灯，闪烁若干次后（3 秒），东西路口的绿灯熄灭，同时东西路口的黄灯亮，延时一段时间后（2 秒），东西路口的红灯亮，南北路口的绿灯亮，南北路口方向通车，对应人行道绿灯亮。延时一段时间后（20 秒），南北路口的绿灯闪烁若干次后（3 秒），南北路口的绿灯熄灭，同时南北路口的黄灯亮，延时一段时间后（2 秒），再切换到东西路口的绿灯亮，之后重复以上过程。

```c
#include <reg52.h>
#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int

sbit rt1=P0^0; //gre
sbit rt2=P0^1; //red
sbit up1=P2^0; //red
sbit up2=P2^1; //gre
sbit red1=P2^2; 
sbit yel1=P2^3; 
sbit gre1=P2^4; 
sbit red2=P2^5; 
sbit yel2=P2^6;
sbit gre2=P2^7; 
//这里大部分定义并没有用到，只是为了标记每个颜色的灯对应的接口

void delay(uint k)
{
	uint i;
	uchar j;
	for(i=k;i>0;i--)
		for(j=110;j>0;j--) ;
}

void main(){
	int i;
	rt1=0;
	P2=0x7a;
	delay(2000);
	for(i=1;i<=3;i++){
		gre2=1;
		delay(500);
		gre2=0;
		delay(500);
	}
	P2=0xba;
	delay(2000);
	P2=0xcd;
	rt1=1;
	rt2=0;
	delay(2000);
	for(i=1;i<=3;i++){
		gre1=1;
		delay(500);
		gre1=0;
		delay(500);
	}
	P2=0xd5;
	delay(2000);
	rt2=1;
	up2=0;
}
```

课程所使用的单片机实验箱，在接交通灯模块的时候，若直接赋给端口十六进制数，则会与理论端口号输出相反。如：P0.0 对应 D8 口，P0.1 对应 D7 口，以此类推。

## 定时器实验

### 基础型

利用定时器 16 位定时方式实现 1s 定时的程序。

```c
#include"reg52.h"
#include"intrins.h"
typedef unsigned char u8;
typedef unsigned int u16;
sbit led=P0^0; 
u16 i=0;

void main()
{
	TMOD=0x01;	
	TH0=0XFC;
	TL0=0X18;
	ET0=1;
	EA=1;
	TR0=1;
	while(1);
}
void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;
	if(i==1000)
	{
		i=0;
		led=~led;
	}
}
```

晶振频率为 12MHz，则：

| 最长时间间隔(μs) | 实现方法                         |
| --------------- | ------------------------------- |
| ≈10             | 软件编写                         |
| 256             | 定时器工作方式 2（8 位定时方式）  |
| 65536           | 定时器工作方式 1（16 位定时方式） |
| 无限长           | 16 位定时器及软件计数            |

此定时程序可以作为一个模板，下面的几个程序都是以此程序为基础进行拓展的。

### 设计型

结合数码管显示模块，设计程序实现利用定时器设计一分钟倒计时器。

动态数码管电路图如下所示。

![circuit-diagram-of-nixie-tube.jpg](/images/circuit-diagram-of-nixie-tube.jpg "动态数码管电路图")

```c
#include <reg51.h> 

sbit LS138A = P2^2; 
sbit LS138B = P2^3;	
sbit LS138C = P2^4; 

sbit k1=P2^0;//start
sbit k2=P2^1;//return 60s

unsigned int i;
unsigned int a=6000;
unsigned int LedNumVal=6000;
unsigned char code Disp_Tab[] = {0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0x7f,0x6f,0x40}; 
unsigned int LedOut[10];

void main()
{  
	TMOD=0x01;
	TH0=0XFC;
	TL0=0X18;
	ET0=1;
	EA=0;
	TR0=1;

	while(1){
		EA=1;
		LedOut[0]=Disp_Tab[a%10000/1000];
		LedOut[1]=Disp_Tab[a%1000/100]|0x80;  // 增加小数点，倒计时功能中包含小数
		LedOut[2]=Disp_Tab[a%100/10];
		LedOut[3]=Disp_Tab[a%10];
		if(k1==0){
			LedNumVal=6000;
			break;
		}
	}
	// 这里实现的是只有当按键按下才开始计数，而不是接通电源直接计数
	while(1){	 
		LedOut[0]=Disp_Tab[LedNumVal%10000/1000];
		LedOut[1]=Disp_Tab[LedNumVal%1000/100]|0x80;
		LedOut[2]=Disp_Tab[LedNumVal%100/10];
		LedOut[3]=Disp_Tab[LedNumVal%10];
		if(k2==0){
			EA=1;
			break;
		}
	}  	 
}

void delay(unsigned int i)
{
	char j;
	for(i; i>0; i--)
	for(j=200; j>0; j--);
}

void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;
	if(i%4==0){
		P0 = LedOut[0];
		LS138A=0; LS138B=0; LS138C=0;
	}
	else if(i%4==1){
		P0 = LedOut[1];		
		 LS138A=1; LS138B=0; LS138C=0;
    }
	else if(i%4==2){
		P0 = LedOut[2];		
		LS138A=0; LS138B=1; LS138C=0;
	}
	else if(i%4==3){
		P0 = LedOut[3];		
		LS138A=1; LS138B=1; LS138C=0;
	}
	// 这里与其他同学设计的不同，其他人是直接连接单片机上数码管位码判定的 8 根管脚，需要用到 8 根线，我利用译码器，实现只用 3 根线控制 8 位显示。
	if(i==10&&LedNumVal!=0){
		i=0;
		--LedNumVal;
	}
	if(LedNumVal==0){		
		LedNumVal=0;
	}
}
```

### 探究型

实验一：利用 8051 微控制器的定时器，由某一 I/O 口线输出一周期为 20ms 的 PWM 波，占空比按 10% 的步进从 0%~90% 线性调节。

```c
#include"reg52.h"
#include"intrins.h"
unsigned int i=0;
unsigned int a=0;
sbit led=P0^0; 
void main()
{
	TMOD=0x01;
	TH0=0XFC;
	TL0=0X18;	
	ET0=1;
	EA=1;
	TR0=1;
	while(1);
}
void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;
	if(i>=2*(a%9)){
		led=1;
	}
	if(i==20){
		led=0;
		i=0;
		a++;
	}
}
```

实验二：在上题的基础上，加入按键控制，改变 PWM 波占空比，并通过 ULN2003 模块电路，实现 LED 亮度调节。

ULN2003 模块电路图以及所用到的大功率 LED 如下图所示。

![ULN2003.jpg](/images/ULN2003.jpg "ULN2003 模块电路图")

![high-power-LED.jpg](/images/high-power-LED.jpg "大功率 LED")

```c
#include"reg52.h"
#include"intrins.h"
unsigned int i=0;
int a=0;
unsigned int d;
unsigned int p;
unsigned int LedNumVal;
unsigned char code Disp_Tab[] = {0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0x7f,0x6f,0x40}; 
unsigned int LedOut[10];
sbit led=P0^0; 
sbit k1=P1^0; // +
sbit k2=P1^1; // -
void key1();
void key2();
void delay(unsigned int k)
{
	for(d=k;d>0;d--)
	for(p=110;p>0;p--) ;
}
void main()
{
	TMOD=0x01;
	TH0=0XFC;
	TL0=0X18;	
	ET0=1;
	EA=1;
	TR0=1;
	while(1){
		LedNumVal=a;
		LedOut[3]=Disp_Tab[LedNumVal];
		P2=LedOut[3];
	}
}
void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;
	if(i>=2*a){
		led=1;
	}
	if(i==20){
		led=0;
		i=0;
	}
	key1();
	key2();
}

void key1()
{
	if(k1==0){
		delay(50);
		if(k1==0){
			led=1;
			a--;
			if(a<0){
				a=9;
			}
		while(!k1);
		}
	}
}
void key2()
{
	if(k2==0){
		delay(50);
		if(k2==0){
			led=1;
			a++;
			if(a>9){
				a=0;
			}
			while(!k2);
		}
	}
}
```

## 键盘接口实验

矩阵键盘的结构如下图所示。

![circuit-diagram-of-matrix-keyboard.jpg](/images/circuit-diagram-of-matrix-keyboard.jpg "矩阵键盘电路图")

### 基础型

实验一：数码管静态显示电路，依次显示第 1 个数码管的各段（依次循环显示次序为 a、b、c、d、e、f），每段显示时间为 100ms。

```c
#include"reg52.h"
#include"intrins.h"

unsigned int i=0;
unsigned int a=0;
unsigned char code Disp_Tab[] = {0x88,0x83,0xC6,0xA1,0x86,0x8e}; // 对应字母a、b、c、d、e、f
void main()
{
  TMOD=0x01;	
  TH0=0XFC;
  TL0=0X18;
	
  ET0=1;
  EA=1;
  TR0=1;
  while(1);
}
void time0()interrupt 1
{
  TH0=0XFC;
  TL0=0X18;
  i++;
  if(i<100)
  {
    P0=Disp_Tab[a];
  }
  if(i==1000){
    a++;
    i=0;
  }
  if(a==6) a=0;
}
```

实验二：采用矩阵式键盘，指定 IO 与键盘的连接，设计程序实现对键盘的扫描、按键去抖动等处理。当 Key0－KeyF 键按下时分别对寄存器 B 赋值 0－F，并通过数码管显示。

```c
#include <reg51.h>
	                
#define uchar unsigned char	
#define uint  unsigned int	

uchar  dis_buf; 
uchar  temp;
uchar  key;  
void delay(uint k);    

uchar code LED7Code[] = {~0x3F,~0x06,~0x5B,~0x4F,~0x66,~0x6D,~0x7D,~0x07,~0x7F,~0x6F,~0x77,~0x7C,~0x39,~0x5E,~0x79,~0x71};

void delay(uint k)
{
	uint i;
	uchar j;
	for(i=k;i>0;i--)
	for(j=110;j>0;j--);
}

void keyscan(void)
{ 	
	temp = 0;
	P1=0xF0;     
	delay(50);		
	temp=P1;       
	temp=temp&0xF0;			
	temp=~((temp>>4)|0xF0);	  
	if(temp==1)	  
		key=0; 
	else if(temp==2)  
		key=1;	
	else if(temp==4)   
		key=2;	
	else if(temp==8)  
		key=3;	 
	else
		key = 16;
        
	P1=0x0F;   
	delay(50);	
	temp=P1;          
	temp=temp&0x0F;
	temp=~(temp|0xF0);
	if(temp==1)		
		key=key+0;
	else if(temp==2)	
		key=key+4; 
	else if(temp==4) 
		key=key+8;
	else if(temp==8)  
		key=key+12;
	else
		key = 16;	
	dis_buf = key;	
	dis_buf = dis_buf & 0x0f;
}
void keydown(void)
{  
	P1=0xF0;  
	if(P1!=0xF0) {
		keyscan(); 
	}
}
main()
{
	P0=0xFF; 
	P1=0xFF;   
	delay(50);     
	while(1){ 
		keydown();	
		P0 = LED7Code[dis_buf%16];
	}
}   
```

### 设计型

基于动态显示模块，设计程序实现数码管从右到左滚动显示自己的学号的所有位数（这里由于学号属于个人隐私，选择用其他数字替代）。

```c
#include <reg51.h> 

sbit LS138A = P2^2; 
sbit LS138B = P2^3;	
sbit LS138C = P2^4; 

unsigned int i;
unsigned int a=0;
unsigned char code Disp_Tab[] = {0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0x7f,0x00}; 
//                                0     1    2    3    4    5    6    7    8   9 
unsigned int num[21]={9,9,9,3,1,7,0,0,0,0,0,0,0,9,9,9,9,3,1,7,0}; 
// 在这个数组中写入自己的学号或任何想要显示的数字，格式是在循环到末尾的 10 位数后，重新回到第一位开启新一轮的循环。9 表示什么都不显示。
unsigned int LedOut[10];

void main()
{  
	TMOD=0x01;
	TH0=0XFC;
	TL0=0X18;
	ET0=1;
	EA=1;
	TR0=1;

	while(1){	 
		LedOut[0]=Disp_Tab[num[a]];
		LedOut[1]=Disp_Tab[num[a+1]];
		LedOut[2]=Disp_Tab[num[a+2]];
		LedOut[3]=Disp_Tab[num[a+3]];		
		LedOut[4]=Disp_Tab[num[a+4]];
		LedOut[5]=Disp_Tab[num[a+5]];
		LedOut[6]=Disp_Tab[num[a+6]];
		LedOut[7]=Disp_Tab[num[a+7]];
	}   
}	

void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;
	if(i%8==0){
		P3=LedOut[0];
		LS138A=0; LS138B=0; LS138C=0;
	}
	else if(i%8==1){
		P3=LedOut[1];		
		LS138A=1; LS138B=0; LS138C=0;
	}
	else if(i%8==2){
		P3=LedOut[2];		
		LS138A=0; LS138B=1; LS138C=0;
	}
	else if(i%8==3){
		P3=LedOut[3];		
		LS138A=1; LS138B=1; LS138C=0;
	}
	else if(i%8==4){
		P3=LedOut[4];		
		LS138A=0; LS138B=0; LS138C=1;
	}
	else if(i%8==5){
		P3=LedOut[5];		
		LS138A=1; LS138B=0; LS138C=1;
	}
	else if(i%8==6){
		P3=LedOut[6];		
		LS138A=0; LS138B=1; LS138C=1;
	}
	else if(i%8==7){
		P3=LedOut[7];		
		LS138A=1; LS138B=1; LS138C=1;
	}
	if(i==500){
		a++;
		i=0;
		if(a==14)
			a=0;
	}
}
```

### 探究型

实验一：结合动态数码管显示模块，设计程序实现 24 小时实时时钟功能。

```c
#include <reg51.h> 

sbit LS138A = P2^2; 
sbit LS138B = P2^3;	
sbit LS138C = P2^4; 

unsigned int i;
unsigned int sec=00;
unsigned int min=00;
unsigned int hou=00;
unsigned char code Disp_Tab[] = {0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0x7f,0x6f,0x40}; 
unsigned int LedOut[10];
unsigned char  temp;  
unsigned char key=0; 
void delay(unsigned int k);  
void keyscan(void);
void keydown(void);

void main()
{  
	TMOD=0x01;
	TH0=0XFC;
	TL0=0X18;
	ET0=1;
	EA=1;
	TR0=1;

	while(1){	 
		keydown();		
		LedOut[0]=Disp_Tab[hou%100/10];
		LedOut[1]=Disp_Tab[hou%10];
		LedOut[3]=Disp_Tab[min%100/10];
		LedOut[4]=Disp_Tab[min%10];
		//LedOut[4]=Disp_Tab[sec%10000/1000];
		//LedOut[5]=Disp_Tab[sec%1000/100]|0x80;
		LedOut[6]=Disp_Tab[sec%100/10];
		LedOut[7]=Disp_Tab[sec%10];
	}   
}	

void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;

	if(i%8==0){
		P3=LedOut[0];
		LS138A=0; LS138B=0; LS138C=0;
	}
	else if(i%8==1){
		P3=LedOut[1];		
		LS138A=1; LS138B=0; LS138C=0;
	}
	else if(i%8==2){
		P3=LedOut[2];		
		LS138A=0; LS138B=1; LS138C=0;
	}
	else if(i%8==3){
		P3 = LedOut[3];		
		LS138A=1; LS138B=1; LS138C=0;
	}
	else if(i%8==4){
		P3=LedOut[4];		
		LS138A=0; LS138B=0; LS138C=1;
	}
	else if(i%8==5){
		P3=LedOut[5];		
		LS138A=1; LS138B=0; LS138C=1;
	}
	else if(i%8==6){
		P3=LedOut[6];		
		LS138A=0; LS138B=1; LS138C=1;
	}
	else if(i%8==7){
		P3=LedOut[7];		
		LS138A=1; LS138B=1; LS138C=1;
	}
	 
	if(i==1000){
		i=0;
		sec++;
		if(sec==60){
			sec=0;
			min++;
		}
		if(min==60){
			min=0;
			hou++;
		}
		if(hou==24){
			hou=0;
		}
	}
}

void delay(unsigned int k)
{
	unsigned int m;
	unsigned char n;
	for(m=k;m>0;m--)
	for(n=110;n>0;n--);
}
void keyscan(void)
{ 
	temp=0;
	P1=0xF0;     
	delay(50);		
	temp=P1;       
	temp=temp&0xF0;			
	temp=~((temp>>4)|0xF0);	  
	if(temp==1)	  
		key=0; 
	else if(temp==2)  
		key=1;	
	else if(temp==4)   
		key=2;	
	else if(temp==8)  
		key=3;	 
	else
		key = 16;
        
	P1=0x0F;   
	delay(50);	
	temp=P1;          
	temp=temp&0x0F;
	temp=~(temp|0xF0);
	if(temp==1)		
		key=key+0;
	else if(temp==2)	
		key=key+4; 
	else if(temp==4) 
		key=key+8;
	else if(temp==8)  
		key=key+12;
	else
		key = 16;
	if(key==0){
		sec++;
		if(sec==60)
			sec=0;
	}
	else if(key==1){
		min++;
		if(min==60) min=0;
	}
	else if(key==2){
		hou++;
		if(hou==24) hou=0;
	}
}

void keydown(void)
{  
	P1=0xF0;  
	if(P1!=0xF0) {
		keyscan(); 
	}
}
```

在这个程序中我添加了通过矩阵键盘调节时间的功能，但目前仍存在 BUG，键盘判定过程有一些问题待解决。由于添加这个功能只是为了应付一下老师的要求，没有太多闲暇时间 DEBUG，将矩阵键盘程序忽略即可。

实验二：基于动态扫描显示电路，设计程序实现滚动显示 8 位数码管的边缘各段（1# 和 8# 应显示向外的 4 段，其余 6 个将显示上方的 a 段和下方的 d 段），显示出滚动运行的大方框。

```c
#include <reg51.h> 

sbit LS138A = P2^2; 
sbit LS138B = P2^3;	
sbit LS138C = P2^4; 

unsigned int i;
unsigned int a=0;
unsigned char code Disp_Tab[] = {0x39, 0x09, 0x0f, 0x01,  0x08,  0x38, 0x19, 0x29, 0x31, 0x0e,  0x0d,  0x0b, 0x07}; 

unsigned int code num[160]={5,1,1,1,1,1,1,2,
                            6,1,1,1,1,1,1,2,
                            7,1,1,1,1,1,1,2,
                            8,1,1,1,1,1,1,2,
                            0,3,1,1,1,1,1,2,
                            0,1,3,1,1,1,1,2,
                            0,1,1,3,1,1,1,2,
                            0,1,1,1,3,1,1,2,
                            0,1,1,1,1,3,1,2,
                            0,1,1,1,1,1,3,2,
                            0,1,1,1,1,1,1,12,
                            0,1,1,1,1,1,1,11,
                            0,1,1,1,1,1,1,10,
                            0,1,1,1,1,1,1,9,
                            0,1,1,1,1,1,4,2,
                            0,1,1,1,1,4,1,2,
                            0,1,1,1,4,1,1,2,
                            0,1,1,4,1,1,1,2,
                            0,1,4,1,1,1,1,2,
                            0,4,1,1,1,1,1,2};

unsigned int LedOut[10];

void main()
{  
	TMOD=0x01;
	TH0=0XFC;
	TL0=0X18;
	ET0=1;
	EA=1;
	TR0=1;

	while(1){	 
		LedOut[0]=Disp_Tab[num[a]];
		LedOut[1]=Disp_Tab[num[a+1]];
		LedOut[2]=Disp_Tab[num[a+2]];
		LedOut[3]=Disp_Tab[num[a+3]];		
		LedOut[4]=Disp_Tab[num[a+4]];
		LedOut[5]=Disp_Tab[num[a+5]];
		LedOut[6]=Disp_Tab[num[a+6]];
		LedOut[7]=Disp_Tab[num[a+7]];
	}   
}	


void time0()interrupt 1
{
	TH0=0XFC;
	TL0=0X18;
	i++;

	if(i%8==0){
		P3=LedOut[0];
		LS138A=0; LS138B=0; LS138C=0;
	}
	else if(i%8==1){
		P3=LedOut[1];		
		LS138A=1; LS138B=0; LS138C=0;
	}
	else if(i%8==2){
		P3=LedOut[2];		
		LS138A=0; LS138B=1; LS138C=0;
	}
	else if(i%8==3){
		P3 = LedOut[3];		
		LS138A=1; LS138B=1; LS138C=0;
	}
	else if(i%8==4){
		P3=LedOut[4];		
		LS138A=0; LS138B=0; LS138C=1;
	}
	else if(i%8==5){
		P3=LedOut[5];		
		LS138A=1; LS138B=0; LS138C=1;
	}
	else if(i%8==6){
		P3=LedOut[6];		
		LS138A=0; LS138B=1; LS138C=1;
	}
	else if(i%8==7){
		P3=LedOut[7];		
		LS138A=1; LS138B=1; LS138C=1;
	}
	if(i==500){
		a=a+8;
		i=0;
		if(a==160)
			a=0;
	}
}
```

此程序本人采用了较为无脑的穷举方法，将灯亮的所有情况穷举出来实现循环。

## 1-Wire 与 I<sup>2</sup>C 总线实验

回顾《微机原理与接口技术》课程的四个实验，最坑的实验就是这个实验。在课堂中，这一部分知识是以「翻转课堂」的形式进行教学的，说白了就是同学上台讲课。结果一堂课下来，基本没有听明白台上的同学在说些什么。无奈只好自学。

这一部分的程序基础型与探究型实验是我写的，设计型实验是我借鉴室友的。本来我自己写出了一个程序，但执行结果是错的。但是从理论分析并没有什么错误，就这样，我被这个设计型实验困扰了很长时间……

### 基础型

通过 1-Wire 总线读取 DS18B20 的温度，并通过串口上传至 PC 机。

DS18B20 原理图：

![DS18B20.jpg](/images/DS18B20.jpg "DS18B20")

```c
#include<reg51.h>
#define uchar unsigned char
#define uint unsigned int
sbit dq=P3^7;
uint PuZh;
uchar sb[10]={'0','1','2','3','4','5','6','7','8','9'}; // 至于为什么把这个数组名字定义为 sb，还有下面的 ssb，可能是当时的心情有些烦躁吧
void UsartConfiguration();
void Delay10ms(uint c);

void sdelay(uint i)
{
	while(i--);
}
void DS18B20_Reset()
{
	uchar x=0;
	dq=1;
	sdelay(8);
	dq=0;
	sdelay(80);
	dq=1;
	sdelay(14);
	sdelay(20);
}

void DS18B20_Write_Byte(uchar dat)
{
	uchar i=0;
	for(i=8;i>0;i--){
		dq=0;
		dq=dat&0x01;
		sdelay(5);
		dq=1;
		dat>>=1;
	}
}
uchar DS18B20_Read_Byte()
{
	uchar i=0,dat=0;
	for(i=8;i>0;i--){
		dq=0;
		dat>>=1;
		dq=1;
		if(dq)
			dat|=0x80;
		sdelay(4);
	}
	return(dat);
}
uint GET_Temperature()
{
	uchar a=0,b=0;
	uint t=0;
	float tt=0;
	DS18B20_Reset();
	DS18B20_Write_Byte(0xcc);
	DS18B20_Write_Byte(0x44);
	DS18B20_Reset();
	DS18B20_Write_Byte(0xcc);
	DS18B20_Write_Byte(0xbe);
	a=DS18B20_Read_Byte();
	b=DS18B20_Read_Byte();
	t=b;
	t<<=8;
	t=t|a;
	tt=t*0.0625;
	t=tt*10+0.5;
	return(t);
}
void main()
{
	uchar i;
	uint x;
	uint y,z;
	uchar ssb[5];
	UsartConfiguration();
	while(1){
		PuZh=GET_Temperature();
		x=PuZh/100;
		y=PuZh%100%10;
		z=PuZh%100/10;
		ssb[0]=sb[x];
		ssb[1]=sb[y];
		ssb[2]='.';
		ssb[3]=sb[z];
		ssb[4]=' ';
		for(i=0;i<5;i++){
			SBUF=ssb[i];
			while(!TI);
			TI=0;
		}
		Delay10ms(50);
	}
}

void UsartConfiguration()
{
	SCON=0X50;
	TMOD=0X20;
	PCON=0X80;
	TH1=0XF3;
	TL1=0XF3;
	TR1=1;
}
void Delay10ms(unsigned int c)
{
	unsigned char a,b;
	for(;c>0;c--){
		for(b=38;b>0;b--){
			for(a=130;a>0;a--);
		}
	}
}
```

### 设计型

通过 I<sup>2</sup>C 总线读取 PCF8591 的 ADC 采集值，实现环境亮度值（光敏电阻）的检测，并将亮度值上传至 PC 机。

PCF8591 原理图：

![PCF8591.jpg](/images/PCF8591.jpg "PCF8591")

这个程序足足坑了我半天的时间，无奈之下用室友在网上花 2 元钱购买的资料蒙混过关。

此程序主要包含三个文件：`i2c.h`，`i2c.c`，`main.c`。

`i2c.h`：

```c
// i2c.h
#ifndef __I2C_H_
#define __I2C_H_

#include <reg51.h>

sbit SCL=P2^1;
sbit SDA=P2^0;

unsigned char I2C_ReadByte();
void I2C_SendByte( unsigned char dat);
void I2C_Stop();
void I2C_Start();

#endif
```

`i2c.c`：

```c
// i2c.c
#include "i2c.h"
#include <intrins.h>

#define uchar unsigned char
#define uint unsigned int
#define somenop() _nop_(),_nop_(),_nop_(),_nop_(),_nop_(),_nop_()

void I2C_Start()     
{
	SCL=1;
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SDA=1;
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SDA=0;
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SCL=0;
	_nop_();_nop_();_nop_();_nop_();_nop_();
}

void I2C_Stop()      
{ 
	SDA=0;
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SCL=1;
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SDA=1;
	_nop_();_nop_();_nop_();_nop_();_nop_();
}

void I2C_SendByte(unsigned char dat)   
{
	uchar i,j,b=0;
	for(i=0;i<8;i++){    
		SCL=0;  
		_nop_();_nop_();_nop_();_nop_();_nop_();
		SDA=(bit)(dat&0x80);     
		dat<<=1;        
		SCL=1;          
		_nop_();_nop_();_nop_();_nop_();_nop_();
	}
	SCL=0;
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SDA=1;     
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SCL=1;
	_nop_();
	while((SDA==1)&&(j<250))
		j++;  
	SCL=0;
	_nop_();   
}

unsigned char I2C_ReadByte()     
{
	uchar i,dat=0;
	SCL=0;         
	_nop_();_nop_();_nop_();_nop_();_nop_();
	SDA=1;      
	_nop_();
	for(i=0;i<8;i++){
		SCL=1;
		_nop_();_nop_();_nop_();_nop_();_nop_();
		dat<<=1;
		if(SDA==1)
			dat=dat|0x01;
		_nop_();_nop_();_nop_();_nop_();_nop_();
		SCL=0; // 下降沿时读取数据
		_nop_();_nop_();_nop_();_nop_();_nop_();
	}
	return dat;
}
```

`main.c`：

```c
// main.c
#include <reg51.h>			
#include <intrins.h>
#include <i2c.h>

#define uint unsigned int
#define uchar unsigned char

#define  WRITEADDR 0x90    
#define  READADDR  0x91    

void Pcf8591SendByte(uchar channel)	
{   
	I2C_Start();    
	I2C_SendByte(WRITEADDR);        
	I2C_SendByte(0x40|channel);     
	I2C_Stop();
}

uchar Pcf8591ReadByte()		
{
	uchar num;
	I2C_Start();
	I2C_SendByte(READADDR);      
	num=I2C_ReadByte();          
	I2C_Stop();                  
	return num;
}

void UsartInit()        
{
	SCON=0X50;
	TMOD=0X20;
	PCON=0X80;
	TH1=0XF3;
	TL1=0XF3;
	TR1=1;
}

void delay1s(void)   
{
	unsigned char a,b,c;
	for(c=167;c>0;c--)
		for(b=171;b>0;b--)
			for(a=16;a>0;a--);
				_nop_();  
}

void main()
{
	uint adNum,i,value;
	uchar PuZh[4]; 
	UsartInit();	
	while(1){		 	
		Pcf8591SendByte(0);      
		adNum=Pcf8591ReadByte();   
		value=adNum;
		value=100-value*100/255;
		PuZh[0]=32;
		PuZh[1]=value/10+48;
		PuZh[2]=value%10+48;
		PuZh[3]=32;
		for(i=0;i<4;i++){
			SBUF=PuZh[i];
			while(!TI);
			TI=0;
		}
		delay1s();
	}
}
```

### 探究型

通过 I<sup>2</sup>C 总线设置 PCF8591 的 DA，实现 LED 亮度的控制，设定值通过串口向 MCU 发送。

这个程序我采用的是中断的方式，将 LED 的亮度等级设定为十级。

```c
#include<reg51.h>
#include<intrins.h>
#define uchar unsigned char
#define uint unsigned int

sbit sda=P2^0;
sbit scl=P2^1;

uchar receiveData;

void UsartConfiguration();
void delay()  //5us
{;;}

void delay1(uint z)//1ms
{
	uint x,y;
	for(x=z;x>0;x--)
		for(y=120;y>0;y--);        
}

void start()
{
	scl=1;
	_nop_();
	sda=1;
	delay();
	sda=0;
	delay();
	scl=0;
	_nop_();
}
void stop()
{
	scl=1;
	_nop_();
	sda=0;
	delay();
	sda=1;
	delay();
}
void respons()
{
	scl=1;
	_nop_();
	sda=0;
	delay();
	scl=0;
	_nop_();
}
void norespons()
{
	scl=1;
	_nop_();
	sda=1;
	delay();
}
void init()
{
	scl=1;
	_nop_();
	sda=1;
	_nop_();
}
void write_byte(uchar dat)
{
	uchar i,temp;
	temp=dat;
	for(i=0;i<8;i++){
		scl=0;
		_nop_();
		if((temp&0x80)==0x80)
			sda=1; 
		else
			sda=0; 
		scl=1;
		_nop_();
		temp<<=1;
	}
	scl=0;
	_nop_();
}
uchar read_byte()
{
	uchar dat,i;
	sda=1;
	_nop_();
	scl=0;
	_nop_();
	for(i=0;i<8;i++){
		scl=1;
		_nop_();
		if(sda)
			dat|=0x01;
		if(i<7)
			dat<<=1;
		scl=0;
		_nop_();        
	}
	return dat;
}
void DAC_write(uchar dat)
{
	start();
	write_byte(0x90);
	respons();
	write_byte(0x40);
	respons();
	write_byte(dat);
	respons();
	stop();
}
uchar ADC_read(uchar com)
{
	uchar dat;
	dat=com;
	start();
	write_byte(0x90);
	respons();
	write_byte(com);
	respons();
	start();
	write_byte(0x91);
	respons();
	dat=read_byte();
	norespons();
	stop();
	return dat;
}
void main()
{
	uchar ss=0,ad_value;
	uint aa;
	init();
	UsartConfiguration();
	while(1){
		if(receiveData=='0') aa=0;
		else if(receiveData=='1') aa=100;
		else if(receiveData=='2') aa=110;
		else if(receiveData=='3') aa=120;
		else if(receiveData=='4') aa=130;
		else if(receiveData=='5') aa=140;
		else if(receiveData=='6') aa=150;
		else if(receiveData=='7') aa=160;
		else if(receiveData=='8') aa=170;
		else if(receiveData=='9') aa=180;	
		ad_value=ADC_read(0x42);
		DAC_write(aa);
		delay1(20);	
	}
}
void UsartConfiguration()
{
	SCON=0X50;
	TMOD=0X20;
	PCON=0X80;
	TH1=0XF3;
	TL1=0XF3;
	ES=1;
	EA=1;
	TR1=1;
}
void Usart() interrupt 4
{
	receiveData=SBUF;
	RI=0;
	SBUF=receiveData;
	while(!TI);
	TI=0;
}
```