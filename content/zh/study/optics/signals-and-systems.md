+++
title = "信号与系统：MATLAB 信号处理"
date = "2020-01-20T08:38:19+08:00"
tags = ["matlab"]
katex = true
dropCap = true
displayCopyright = true
gitinfo = true
toc = true
+++

光电专业的《信号与系统》课程是选修课程，要求掌握的内容不如隔壁信电深入。但我认为这是一门很有必要学习的课程，因为在这门课程中你会学习信号的三大变换：[傅里叶变换](https://en.wikipedia.org/wiki/Fourier_transform)、[拉普拉斯变换](https://en.wikipedia.org/wiki/Laplace_transform)、[Z 变换](https://en.wikipedia.org/wiki/Z-transform)，这些对于光学领域的图像和信号处理有所帮助。除此之外，这门课程还设有八次 MATLAB 操作实验，对于很多第一次使用 MATLAB 进行信号处理的人来说，这可以算是一个入门课程，虽然对于 MATLAB 的使用，老师并没有讲什么东西，还是要靠自学。在本文中，我将对在该门课程中涉及到的一些 MATLAB 信号处理方法进行汇总，希望对入门级别的人有所帮助。

## 信号的时域运算和卷积

信号是随时间（或其他自变量）变化的物理量，在数学上表示为时间 $t$（或其他自变量）的函数。广义地讲，信号可分为模拟信号和离散信号。模拟信号的自变量和信号都是连续的，通常用 $x(t)$ 表示，而离散信号的自变量和信号都是离散的，通
常用 $x[n]$ 表示（其中 $n$ 为整数值并在时间上表示一些离散时刻）。由于计算机给出的数值的位数都是有限的，所以严格来说计算机是不能处理连续的模拟信号的。同样对于 MATLAB，除非是使用符号运算工具箱（Symbolic toolbox），也是不能进行模拟信号的运算的。不过，如果我们用足够小的时间间隔对 $x(t)$ 进行抽样，而且保证抽样值有足够的精度，那么模拟信号就可以用抽样得到的离散信号来近似地表示。

对于连续时间信号，信号的基本运算包括信号的相加和相乘、微分和积分、以及时域变换（平移、反褶和尺度变换）等。对于离散时间序列，信号的基本运算包括相加和相乘、差分和累加、以及时域变换等。由于离散时间序列在时间上的离散性（只在整数时间上有定义），其尺度变换的过程为抽取或内插零。

### 信号运算的 MATLAB 实现

#### 离散时间序列的运算

为了实现不同自变量取值范围和顺序的信号的运算，我们不妨定义以下的函数：

```matlab
function [F,K]=ZeroPadSignal(F1,K1,K2)
% ZeroPadSignal Zero padding a signal.
% [F,K]=ZeroPadSignal(F1,K1,K2)
% F=ZeroPadSignal(F1,K1,K2)
% sorts the elements of K1 in ascending order, rearranges
% F1 accordingly, zero pads F1 to a range defined in K2,
% and returns signal F with sorted index K.
if length(F1)~=length(K1)
    error('Length of F1 and K1 must agree.');
end
[KT I]=sort(K1);
K=sort(K2);
if (KT(1)<K(1)||KT(length(KT))>K(length(K)))
    error('Range of K2 must not less than that of K1.')
end
Id=zeros(1,length(KT));
for J=1:length(KT)
    Id(J)=find(K==KT(J));
end
F=zeros(1，length(K));
F(Id)=F1(I);
end
```

该函数可对信号序列进行排序，并且可以将序列扩展为指定的自变量取值范围。比如，以下程序产生一个信号：

$$
x[n]=\sin\frac{(n+5)\pi}{8}
$$

自变量范围 $n=[-5,3]$，将其分解为偶函数和奇函数，输出结果如下图所示。

```matlab
ax=[-6 6 -0.1 1.1];
nl=-6:6;
n=-5:3; x=sin(pi/8*(n+5));
x1=ZeroPadSignal(x,n,nl);
subplot(2,2,1); stem(nl,x1); axis(ax); title('x[n]');
n=-n;
x2=ZeroPadSignal(x,n,nl);
subplot(2,2,2); stem(nl,x2); axis(ax); title('x[-n]');
x3=(x1+x2)./2;
subplot(2,2,3); stem(nl,x3); axis(ax); title('(x[n]+x[-n])/2');
x4=(x1-x2)./2;
ax(3:4)=[-0.5 0.5];
subplot(2,2,4); stem(nl,x4); axis(ax); title('(x[n]-x[-n])/2');
```

![signals-and-systems-0.png](/images/signals-and-systems-0.png "信号的奇偶分解")

#### 离散时间序列的差分和累加

在 MATLAB 中差分可用 `diff` 函数实现，累加可用 `cumsum` 函数实现，或将采样值向量逐项相加即可。

```matlab
nl=-5:7;
n=-3:4; x=[1 2 3 4 4 4 2 1];
x1=ZeroPadSignal(x,n,nl);
ndiff=-4:7; xdiff=diff(x1);
x2=ZeroPadSignal(xdiff,ndiff,nl);
sum=0;
x3=zeros(1,length(nl));
for J=1:length(nl)
sum=sum+x1(J);
x3(J)=sum;
end
subplot(3,1,1); stem(nl,x1); title('$x[n]$','interpreter','latex');
subplot(3,1,2); stem(nl,x2); title('$x_1[n]=x[n]-x[n-1]$','interpreter','latex');
subplot(3,1,3); stem(nl,x3);
title('$x_2[n]=\sum\limits_{k=-\infty}^n{x[k]}$','interpreter','latex');
```

![signals-and-systems-1.png](/images/signals-and-systems-1.png "离散时间信号的差分和累加")

#### 离散时间序列的卷积和

如果两个序列的自变量 $n$ 分别开始于 $n_1$ 和 $n_2$，则它们的卷积开始于 $n_1+n_2$。计算 $x_1[n]=0.5^nu[n]$ 和 $x_2[n]=u[n-1]-u[n_6]$ 的卷积，程序如下：

```matlab
n1=0:10; x1=0.5.^n1;
n2=1:5; x2=ones(1,5);
x=conv(x1,x2);
n0=n1(1)+n2(1);
n=n0:(n0+length(x)-1);
nl=-1:max(n);
x1p=ZeroPadSignal(x1,n1,nl);
x2p=ZeroPadSignal(x2,n2,nl);
xp=ZeroPadSignal(x,n,nl);
subplot(3,1,1); stem(nl,x1p); title('x_1[n]');
subplot(3,1,2); stem(nl,x2p); title('x_2[n]');
subplot(3,1,3); stem(nl,xp); title('x[n]=x_1[n]*x_2[n]');
```

![signals-and-systems-2.png](/images/signals-and-systems-2.png "离散时间信号的卷积和")

#### 复数值序列分解

任何复数值序列 $x[n]$ 都能分解为共轭对称分量 $x_e[n]$ 和共轭反对称分量 $x_o[n]$ 的叠加，即：

$$
x[n]=x_e[n]+x_o[n]
$$

其中：

$$
\begin{aligned}
x_e[n]=\frac{1}{2}(x[n]+x*[-n]),\\
x_o[n]=\frac{1}{2}(x[n]-x*[-n])
\end{aligned}
$$

将：

$$
x[n]=10e^{-j0.2\pi n},\quad 0\leq n\leq 10
$$

分解为共轭对称分量和共轭反对称分量。

定义函数：

```matlab
function [xt,nt]=MyFlip(x,n)
% [xt,nt]=MyFlip(x,n)
% flips input signal [x,n], and returns flipped signal [xt,nt].
n1=-n;
[xt,nt]=ZeroPadSignal(x,n1,n1);
end
```

然后运行以下程序：

```matlab
n=0:10; x=10*exp(-1j*0.2*pi*n);
np=-10:10;
[xf,nf]=MyFlip(x,n);
[x,n]=ZeroPadSignal(x,n,np);
[xf,nf]=ZeroPadSignal(xf,nf,np);
xe=0.5*(x+conj(xf));
xo=0.5*(x-conj(xf));
subplot(3,2,1), stem(np,real(x),'filled');
title('Real Part of x[n]');
subplot(3,2,2), stem(np,imag(x),'filled');
title('Imaginary Part of x[n]');
subplot(3,2,3), stem(np,real(xe),'filled');
title('Real Part of x_e[n]');
subplot(3,2,4), stem(np,imag(xe),'filled');
title('Imaginary Part of x_e[n]');
subplot(3,2,5), stem(np,real(xo),'filled');
title('Real Part of x_o[n]');
subplot(3,2,6), stem(np,imag(xo),'filled');
title('Imaginary Part of x_o[n]');
```

![signals-and-systems-3.png](/images/signals-and-systems-3.png "复数值序列分解")

### 连续时间信号的运算

MATLAB 采用用抽样值 $x(kT_s)$ 构成的离散时间序列来近似地表示连续信号，因此连续时间信号的表示和运算和离散时间信号序列并没有本质的区别。在进行信号相加、相乘等运算时，需要各个信号的 $T_s$ 是相同的；如果 $T_s$ 足够小，信号的微分、积分以及卷积可用差分、累加和卷积和近似。

比如，某 LTI 系统的输入信号为 $x(t)=e^{(-t-1)}u(t+1)$，可以通过定义两个长度相同的行向量来表示：

```matlab
Ts=1.e-3;
t=-1.5:Ts:6;
x=exp(-t-1).^(t>=-1);
```

如果系统的单位冲激响应为 $h(t)=u(t−2)−u(t−3)，可表示为（取样间隔和时间范围与输入信号相同）：

```matlab
h=(t>=2)-(t>=3);
```

可以求得系统的输出为：

```matlab
y=conv(x,h)*Ts;
t0=t(1)+t(1);
ty=t0+(0:length(y)-1)*Ts;
```

其中 `t0` 是卷积的起始时刻，`ty` 是对应的时间向量。

已知 $x(t)$ 的波形如下图所示：

![signals-and-systems-4.png](/images/signals-and-systems-4.png)

作出以下信号的波形：

1. $x(2-t)$
2. $x(t/2-1)u(-t+4)$
3. $\frac{dx(t)}{dt}$
4. $\int_{-\infty}^t x(\tau)d\tau$
5. $x(t)$ 与信号 $t(u(t)-u(t-1))$ 的卷积

```matlab
Ts=1.e-2;
t=-3:Ts:3;
x=(0.5*t+1).*((t>=-2)-(t>=0))+((t>=-0)-(t>=1))+(-t+2).*((t>=1)-(t>=2));
ta=-t+2;
tb=2*(t+1); xb=x.*(tb<=4);
tc=t; tc(1)=[]; xc=diff(x)/Ts;
xd=cumsum(x)*Ts;
xe=conv(x,t.*((t>=0)-(t>=1)))*Ts;
te=t(1)+t(1)+(0:length(xe)-1)*Ts;
subplot(2,3,1); plot(t,x); axis([min(t) max(t) -0.1 1.1]);
xlabel('t'); title('$x(t)$','interpreter','latex');
subplot(2,3,2); plot(ta,x); axis([min(ta) max(ta) -0.1 1.1]);
xlabel('t'); title('$x(2-t)$','interpreter','latex');
subplot(2,3,3); plot(tb,xb); axis([min(tb) max(tb) -0.1 1.1]);
xlabel('t'); title('$x(t/2-1)u(-t+4)$','interpreter','latex');
subplot(2,3,4); plot(tc,xc); axis([min(tc) max(tc) -1.5 1]);
xlabel('t'); title('$\frac{dx(t)}{dt}$','interpreter','latex');
subplot(2,3,5); plot(t,xd); axis([min(t) max(t) -0.2 3]);
xlabel('t'); title('$\int_{-\infty}^t x(\tau)d\tau$','interpreter','latex');
subplot(2,3,6); plot(te,xe); axis([-3 4 -0.1 0.7]);
xlabel('t'); title('$x(t)*(t({u(t)-u({t-1})}))$','interpreter','latex');
```

![signals-and-systems-5.png](/images/signals-and-systems-5.png)

## 线性时不变系统的时域分析

通常我们从某一时刻（$t=0$）时刻开始分析某 LTI 系统，系统的响应可表示为零输入响应和零状态响应两部分之和。零输入响应是指系统初始时刻之后的输入为零、仅由系统的初始状态引起的系统的输出，零状态响应是指系统的初始状态为零、仅由系统初始时刻之后的输入引起的系统的输出。系统响应的时域解析解法的过程是先求出微分方程（或差分方程）的齐次解，再根据输入信号的形式确定方程的特解，然后根据初始条件确定解的系数，最后得到系统的响应。

### 连续时间 LTI 系统

单位冲激响应 $h(t)$ 是描述连续时间 LTI 系统的重要函数，MATLAB 的 control system 工具箱提供了 `impulse` 函数，只要提供描述系统的微分方程的系数 $a_k$ 和 $b_k$，或者说，系统传递函数 $H(s)$ 或频率响应 $H(jω)$，

$$
H(s)=\frac{\sum\limits_{k=0}^Nb_ks^k}{\sum\limits_{k=0}^Ma_ks^k}
$$

即可求出指定时间范围内 $h(t)$ 的数值解并画出其时域波形。类似的函数还有 `step` 函数，可用来计算和绘制单位阶跃响应 $s(t)$。

描述连续时间系统的微分方程为：

$$
y''(t)+2y'(t)+5y(t)=x'(t)+5x(t)
$$

计算系统的单位冲激响应和单位阶跃响应。

```matlab
a=[1 2 5];
b=[1 5];
sys=tf(b,a);
t=0:0.01:10;
subplot(2,1,1); impulse(sys,t);
subplot(2,1,2); step(sys,t);
```

![signals-and-systems-6.png](/images/signals-and-systems-6.png "连续时间系统的单位冲激响应和单位阶跃响应")

### 离散时间 LTI 系统

MATLAB 的 signal processing 工具箱中提供了求解离散时间系统（通常称为数字滤波器）单位脉冲响应的函数 `impz` 和单位阶跃响应的函数 `stepz` 。

已知描述离散时间系统的差分方程为：

$$
y[n]+0.4y[n-1]-0.12y[n-2]=x[n]+2x[n-1]
$$

计算系统的单位冲激响应和单位阶跃响应。

```matlab
a=[1 0.4 -0.12];
b=[1 2];
N=15;
subplot(2,1,1); impz(b,a,N);
subplot(2,1,2); stepz(b,a,N);
```

![signals-and-systems-7.png](/images/signals-and-systems-7.png "离散时间系统的单位冲激响应和单位阶跃响应")

### 用 `lsim` 函数求解系统全响应

MATLAB 的 control system 工具箱提供的 `lsim` 函数可以仿真连续时间和离散时间 LTI 系统任意输入信号时的时域响应。

已知系统的微分方程为：

$$
y''(t)+5y'(t)+6y(t)=x'(t)+5x(t)
$$

输入信号为 $x(t)=5\sin t$，系统的初始条件为 $y(0_-)=27$，$y'(0_-)=-30$，求系统的零输入响应、零状态响应和全响应。

由于 `lsim` 函数关于初始条件的输入参量是系统状态变量（即直接 II 型结构框图各个积分器的输出值）的初始值，所以需要将微分方程转换为一阶常微分方程组的形式（其中系数矩阵 A、B、C 和 D 可通过 `tf2ss` 函数得到）：

$$
\begin{aligned}
\begin{bmatrix}
\omega_1'(t)\\
\omega_2'(t)
\end{bmatrix}&=
\begin{bmatrix}
-5&-6\\
1&0
\end{bmatrix}
\begin{bmatrix}
\omega_1(t)\\
\omega_2(t)
\end{bmatrix}+
\begin{bmatrix}
1\\
0
\end{bmatrix}x(t)\\
y(t)&=
\begin{bmatrix}
1&5
\end{bmatrix}
\begin{bmatrix}
\omega_1(t)\\
\omega_2(t)
\end{bmatrix}
\end{aligned}
$$

将 $x(0)=0$ 和初始状态 $y(0_-)=27$，$y'(0_-)=-30$ 代入上式，可得状态向量 $\omega$ 的初始值为：

$$
\begin{bmatrix}
\omega_1(0_-)\\
\omega_2(0_-)
\end{bmatrix}=
\begin{bmatrix}
2\\
5
\end{bmatrix}
$$

程序如下：

```matlab
a=[1 5 6];
b=[1 5];
[A,B,C,D]=tf2ss(b,a);
sys=ss(A,B,C,D);
X0=[2,5];
t=0:0.01:10;
f=5*sin(t);
yzi=lsim(sys,zeros(1,length(t)),t,X0);
yzs=lsim(sys,f,t);
y=lsim(sys,f,t,X0);
plot(t,yzi,'r:',t,yzs,'g--',t,y);
xlabel('Time (seconds)'); ylabel('Amplitude');
legend('Zero Input Response','Zero State Response','Total Response');
```

![signals-and-systems-8.png](/images/signals-and-systems-8.png)

`lsim` 函数也可以求解离散时间系统的响应，已知系统的前向差分方程为：

$$
y[n+2]−0.7y[n+1]+0.1y[n]=7x[n+2]−2x[n+1]
$$

输入信号为 $x[n]=0.8^nu[n]$，系统的初始条件为 $y[−1]=10$，$y[−2]=−10$，求系统的零输入相应、零状态响应和全响应。

```matlab
a=[1 -0.7 0.1];
b=[7 -2 0];
[A,B,C,D]=tf2ss(b,a);
sys=ss(A,B,C,D,-1);
X0=[10 30];
k=0:15;
f=(0.8).^k;
yzi=lsim(sys,zeros(size(k)),k,X0);
yzs=lsim(sys,f,k);
y=lsim(sys,f,k,X0);
subplot(3,1,1); stem(k,yzi); title('Zero Input Response');
subplot(3,1,2); stem(k,yzs); title('Zero State Response');
subplot(3,1,3); stem(k,y); title('Total Response');
```

![signals-and-systems-9.png](/images/signals-and-systems-9.png)

## 傅立叶变换和 LTI 系统的频域分析

傅里叶变换在众多领域都有着广泛的应用。在信号和系统中，通过傅里叶变换可将时域上的信号转换为频域上的频谱密度函数，还可将时域上的卷积运算转化为频域上较为简单的乘积运算。值得一提的是，离散形式的傅里叶变换（Discrete Fourier Transfer，简称 DFT）可通过快速傅里叶变换算法（Fast Fourier Transfer，简称 FFT）用计算机快速地实现。以 FFT 为基础的频域方法是现代数字信号和图像处理、通信、控制等众多领域的最基本的技术手段之一。

### 矩形脉冲的傅里叶变换

求矩形脉冲 $x(t)=u(t+1/2)-u(t-1/2)$ 的傅里叶变换。

```matlab
Fs=1000; % Sampling frequency
T=1/Fs; % Sample time
L=50001; % Length of signal
t=(-(L-1)/2:(L-1)/2)*T; % Time vector
x=+(t>=-0.5&t<0.5); % Signal - rectangular pulse
NFFT=2^nextpow2(L); % Next power of 2 from length of y
time=cputime;
y=fft(x,NFFT)*T; % FFT
y=fftshift(y); % Shift the spectrum
cputime-time % Display the time used by the FFT operation
f=((0:NFFT-1)/NFFT-0.5)*Fs; % The corresponding frequency vector
subplot(2,1,1); plot(t,x);
xlabel('Time (s)'); ylabel('Amplitude');
axis([-1.5 1.5 -0.1 1.1]);
subplot(2,1,2); plot(f,abs(y));
xlabel('Frequency (Hz)'); ylabel('Amplitude');
axis([-5.5 5.5 0 1.1]);
```

![signals-and-systems-10.png](/images/signals-and-systems-10.png "矩形脉冲信号及其傅里叶变换")

### 连续时间信号的傅里叶逆变换

求连续时间信号傅里叶变换的逆变换。已知信号 $x(t)$ 的傅里叶变换为：

$$
X(j\omega)=\frac{4e^{-j2\omega}}{4+\omega^2}
$$

作出信号的时域波形和相应的频谱图。

```matlab
Fs=100;
T=1/Fs;
L=10000;
NFFT=2^nextpow2(L);
f=((0:NFFT-1)/NFFT*2*pi-pi)*Fs;
t=(0:NFFT-1)*T;
y=4*exp(-1j*2.*f)./(4+f.*f);
x=ifft(fftshift(y),NFFT)*Fs;
x=fftshift(x);
t=t-NFFT*T/2;
subplot(3,1,1); plot(t,real(x));
xlabel('Time (s)'); ylabel('Amplitude');
axis([-1 5 0 1.1]);
subplot(3,1,2); plot(f,abs(y));
xlabel('Frequency (rad/s)'); ylabel('Amplitude');
axis([-5.5 5.5 0 1.1]);
subplot(3,1,3); plot(f,angle(y)*180/pi);
xlabel('Frequency(rad/s)'); ylabel('Phase (degrees)');
axis([-5.5 5.5 -180 180]);
```

![signals-and-systems-11.png](/images/signals-and-systems-11.png)

### 加随机噪声的傅里叶变换

连续时间信号：

$$
x(t)=0.5\sin(100\pi t)+\cos(150\pi t)+0.7\sin(200\pi t+\pi/3)
$$

使用快速傅里叶变换方法求出信号的傅里叶变换，并在信号上加上方差为 $5$ 的随机噪声，如：

```matlab
xn=x+sqrt(5)*randn(size(x));
```

作出信号及其频谱。

```matlab
Ts=0.2e-3; N=2^13; 
t=(0:N-1)*Ts;
x=0.5*sin(100*pi*t)+cos(150*pi*t)+0.7*sin(200*pi*t);
sn=sqrt(5)*randn(size(x));
xn=x+sn;
w=linspace(-1,(N-1)/N,N)*pi/Ts;
y=fftshift(fft(x,N))*Ts;
yn=fftshift(fft(xn,N))*Ts;
subplot(2,2,1); plot(t,x); 
axis([0,0.1,-10,10]); xlabel('Time (s)');
subplot(2,2,2); plot(w/2/pi,abs(y));
axis([0,150,0,1]); xlabel('Frequency (Hz)');
subplot(2,2,3); plot(t,xn);
axis([0,0.1,-10,10]); xlabel('Time (s)');
subplot(2,2,4); plot(w/2/pi,abs(yn));
axis([0,150,0,1]); xlabel('Frequency (Hz)');
```

![signals-and-systems-12.png](/images/signals-and-systems-12.png)

###  RC 串联电路滤波器

RC 串联电路是最简单的一阶低通滤波器（输出为电容两端的电压）和一阶高通滤波器（输出为电阻两端的电压）。取 $R=51\Omega$、$C=22\mu F$ 值，作出低通和高通滤波器的幅频特性和相频特性图；用快速傅里叶变换方法分别求出低通和高通滤波器的单位阶跃响应，即 RC 串联电路接通直流电源后电容和电阻两端电压的瞬态变化。

首先根据时间常数 $\tau=RC$ 确定了较为合适的时间区间、样本个数和采样时间间隔，然后给出电路的频率响应:

```matlab
C=22e-6; R=51;
tau=R*C;
Tf=tau*25;
N=2^13;
Ts=Tf/N;
t=(0:N-1)*Ts;
w=((0:N-1)/N-0.5)*2*pi/Ts;
H1=freqs([0 1],[tau 1],w);
H2=freqs([tau 0],[tau 1],w);
```

作出低通和高通滤波器的幅频和相频曲线：

```matlab
subplot(2,2,1); plot(w,abs(H1)); axis([0 max(w) 0 1]);
set(gca,'xscale','log','yscale','log'); grid on;
xlabel('Frequency (rad/s)'); ylabel('Amplitude');
subplot(2,2,3); plot(w,angle(H1)*180/pi); axis([0 max(w) -90 0]);
set(gca,'xscale','log'); grid on; 
xlabel('Frequency (rad/s)'); ylabel('Phase (degrees)');
subplot(2,2,2); plot(w,abs(H2)); axis([0 max(w) 0 1]);
set(gca,'xscale','log','yscale','log'); grid on;
xlabel('Frequency (rad/s)'); ylabel('Amplitude');
subplot(2,2,4); plot(w,angle(H2)*180/pi);  axis([0 max(w) 0 90]);
set(gca,'xscale','log'); grid on;
xlabel('Frequency (rad/s)'); ylabel('Phase (degrees)');
```

![signals-and-systems-13.png](/images/signals-and-systems-13.png)

再计算输入信号的傅里叶变换，经过频域的相乘及傅里叶反变换即得到时域上的响应。为计算方便起见不妨取输入信号为一个矩形窗函数，窗口宽度为计算的时间区间的一半，得到的结果的前半部分即为单位阶跃响应，后半部分为 RC 电路的放电曲线：

```matlab
x=(t<Tf/2);
X=fft(x)*Ts;
Y1=H1.*ifftshift(X);
Y2=H2.*ifftshift(X);
y1=ifft(fftshift(Y1))/Ts;
y2=ifft(fftshift(Y2))/Ts;
plot(t*1000,real(y1),t*1000,real(y2),'g',t*1000,x,':r');
axis([0 Tf*1000 -1.1 1.1]);
xlabel('Time (millisecond)'); ylabel('Amplitude')
legend('u_c','u_r','u_{in}')
```

![signals-and-systems-14.png](/images/signals-and-systems-14.png)