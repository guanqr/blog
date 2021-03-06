+++
title = "基于 MATLAB 的信号处理"
date = "2020-01-20T08:38:19+08:00"
lastmod = "2020-04-09T08:38:19+08:00"
tags = ["matlab"]
series = ["major-courses"]
aliases = ["/study/optics/signals-and-systems/","/tech/optics/signals-and-systems/"]
katex = true
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

<div>
$$
x[n]=\sin\frac{(n+5)\pi}{8}
$$
</div>

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

如果两个序列的自变量 $n$ 分别开始于 $n_1$ 和 $n_2$，则它们的卷积开始于 $n_1+n_2$。计算 $x_1[n]=0.5^nu[n]$ 和 $x_2[n]=u[n-1]-u[n-6]$ 的卷积，程序如下：

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

<div>
$$
x[n]=x_e[n]+x_o[n]
$$
</div>

其中：

<div>
$$
\begin{aligned}
x_e[n]&=\frac{1}{2}(x[n]+x*[-n]),\\
x_o[n]&=\frac{1}{2}(x[n]-x*[-n])
\end{aligned}
$$
</div>

将：

<div>
$$
x[n]=10e^{-j0.2\pi n},\quad 0\leq n\leq 10
$$
</div>

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

如果系统的单位冲激响应为 $h(t)=u(t-2)-u(t-3)$，可表示为（取样间隔和时间范围与输入信号相同）：

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
3. $dx(t)/{dt}$
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

单位冲激响应 $h(t)$ 是描述连续时间 LTI 系统的重要函数，MATLAB 的 control system 工具箱提供了 `impulse` 函数，只要提供描述系统的微分方程的系数 $a_k$ 和 $b_k$，或者说，系统传递函数 $H(s)$ 或频率响应 $H(j\omega)$，

<div>
$$
H(s)=\frac{\sum\limits_{k=0}^Nb_ks^k}{\sum\limits_{k=0}^Ma_ks^k}
$$
</div>

即可求出指定时间范围内 $h(t)$ 的数值解并画出其时域波形。类似的函数还有 `step` 函数，可用来计算和绘制单位阶跃响应 $s(t)$。

描述连续时间系统的微分方程为：

<div>
$$
y''(t)+2y'(t)+5y(t)=x'(t)+5x(t)
$$
</div>

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

<div>
$$
y[n]+0.4y[n-1]-0.12y[n-2]=x[n]+2x[n-1]
$$
</div>

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

<div>
$$
y''(t)+5y'(t)+6y(t)=x'(t)+5x(t)
$$
</div>

输入信号为 $x(t)=5\sin t$，系统的初始条件为 $y(0_-)=27$，$y'(0_-)=-30$，求系统的零输入响应、零状态响应和全响应。

由于 `lsim` 函数关于初始条件的输入参量是系统状态变量（即直接 II 型结构框图各个积分器的输出值）的初始值，所以需要将微分方程转换为一阶常微分方程组的形式（其中系数矩阵 A、B、C 和 D 可通过 `tf2ss` 函数得到）：

<div>
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
</div>

将 $x(0)=0$ 和初始状态 $y(0_-)=27$，$y'(0_-)=-30$ 代入上式，可得状态向量 $\omega$ 的初始值为：

<div>
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
</div>

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

<div>
$$
y[n+2]-0.7y[n+1]+0.1y[n]=7x[n+2]-2x[n+1]
$$
</div>

输入信号为 $x[n]=0.8^nu[n]$，系统的初始条件为 $y[-1]=10$，$y[-2]=-10$，求系统的零输入相应、零状态响应和全响应。

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

<div>
$$
X(j\omega)=\frac{4e^{-j2\omega}}{4+\omega^2}
$$
</div>

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

## 连续时间信号的时域采样和重建

在数字信号处理系统中，通常首先要通过采样和量化过程将模拟信号转换为离散信号（合起来称为模数转换，或 ADC），然后是数字信号处理器对离散信号进行处理，最后要通过重建（或恢复）过程将处理后的离散信号转换为模拟信号（称为数模转换，或 DAC）。

采样定理：如果信号带宽小于奈奎斯特频率（即采样频率的二分之一），那么采样得到的离散样本值能够完全表示原信号。频率大于等于奈奎斯特频率的信号分量会发生混叠现象，在重建时将会重建成频率低于奈奎斯特频率的信号，因此在实际应用中一般都要求避免混叠。通过采样定理可以得出以下的结论：

1. 如果已知信号的最高频率 $\omega_m$，采样定理给出了保证完全重建信号的最低采样频率 $\omega_s$；
2. 反之，如果已知采样频率 $\omega_s$，采样定理给出了保证完全重建信号的带限信号的最高频率 $\omega_m$;
3. 被采样的信号必须是带限的。信号中高于某频率的成分必须为零，或者非常接近于零，这样在重建信号时这些频率成分的影响可忽略不计。

采样定理是在理想化的条件下得出的，它假设信号是非时限的（因为只有持续时间无限长的信号的频谱才是完全带限的），而在实际应用中绝大多数信号都是时限的。因此采样信号的完全重建只是对理想化的数学模型是可能的，在实际应用中，信号采样、重建得到的一般都是原信号的近似。

从采样定理可知，如果以超过奈奎斯特率的频率对带限信号进行采样，那么就能从其样本完全重建信号。重建过程可以看成是一个分为两步的过程：首先是将离散时间样本 $x[n]$ 转换为加权冲激串信号：

<div>
$$
s_p(t)=\sum\limits_{n=-\infty}^{\infty}x[n]\delta(t-nT_s)
$$
</div>

然后将该冲激串信号输入到一个理想低通滤波器即可完全恢复原信号，理想低通滤波器的带宽限制在 $(-\omega_s/2,\omega_s/2)$，增益为 $2\pi/\omega_s$。根据上述的重建过程，不难得出重建信号 $x_a(t)$ 的内插公式为：

<div>
$$
x_a(t)=\sum\limits_{n=-\infty}^{\infty}x[n]\mathrm{sinc}\bigg(\frac{1}{T_s}(t-nT_s)\bigg)
$$
</div>

实际上这种理想低通滤波器和内插通常是不可行的（因为系统是非因果的，且严格来说，只对非时限信号有效）。在实际应用中，我们常用比较低阶的内插来近似地重建信号，如：零阶保持、一阶保持、三次样条。

```matlab
a=[0 0.2 -1.2 1.2];
t=0:1e-3:0.2;
y=cos(2*pi*10*t);
subplot(3,1,1); plot(t,y); axis(a);
title('Continuous-time Signal');
subplot(3,1,2); plot(t,y,'r:'); axis(a);
hold on;
t1=0:1/120:0.2;
y1=cos(2*pi*10*t1);
stem(t1,y1);
title('Discrete-time Signal');
subplot(3,1,3); plot(t,y,'r:'); axis(a);
hold on;
stairs(t1,y1);
title('Zero-order Hold Signal')
xlabel('Time (s)');
hold off;
```

运行上述代码得到下图：

![signals-and-systems-15.png](/images/signals-and-systems-15.png)

如图所示，在 MATLAB 中我们可以用零阶保持信号来近似地表示连续信号。 零阶保持和一阶保持的优点是在实际应用中很容易实现。从图中可以看出，采样间隔越小（相应地采样频率越高），所得到的零阶保持近似与原信号就越接近。

### 采样信号的时域频域分析

已知信号：

<div>
$$
x(t)=5+3\cos\bigg(400\pi t+\frac{\pi}{4}\bigg)+4\cos\bigg(600\pi t-\frac{\pi}{2}\bigg)
$$
</div>

作出采样频率分别为 $700Hz$、$600Hz$ 和 $500Hz$ 时，信号采样值的波形及其频谱。

首先定义两个函数：

`mydft`：

```matlab
function y=mydft(x,t,f) 
Ts=t(2)-t(1);
y=Ts*x*exp(-1i*2*pi*t'*f);
end
```

`myidft`：

```matlab
function x=myidft(y, f, t) 
Fs=f(2)-f(1);
x=Fs*y*exp(1i*2*pi*f'*t);
end
```

为了较清楚地显示频谱混叠现象，分别设置采样率为 $700Hz$、$650Hz$、$600Hz$、$550Hz$、$500Hz$ 和 $450Hz$。

```matlab
Fs=[700,650,600,550,500,450];
f=-1000:0.5:1000;
tc=0:1/12000:0.03;
xc=5+3*cos(400*pi*tc+pi/4)+4*cos(600*pi*tc-pi/2);
at=[0,20,0,8];
af=[-900,900,-0.05,1.5];
for k=1:6
    t=0:1/Fs(k):1;
    x=5+3*cos(400*pi*t+pi/4)+4*cos(600*pi*t-pi/2);
    y=mydft(x,t,f);
    subplot(6,2,2*k-1);stem(t*1000,x); xlabel('Time (ms)');
    hold on; plot(tc*1000,xc,'g:');axis([0 20 -3 13]); hold off;
    subplot(6,2,2*k);plot(f/1000,abs(y)); axis([0 1 0 6]); xlabel('Frequency (kHz)');
end
```

![signals-and-systems-16.png](/images/signals-and-systems-16.png)

采样得到的离散时间信号的频谱是周期的，周期为采样率 $f_s$，因此如果原信号的最高频率 $f_m\geq f_s/2$，采样得到的信号的频谱将发生混叠。由于信号的最高频率为 $300Hz$，所以图中只有采样率为 $700Hz$ 和 $650Hz$ 时得到的采样信号未发生混叠现象。

如果设计一个增益为 $1$、截止频率为采样频率的一半的理想低通滤波器，近似地求出当采样频率为 $1kHz$ 时，采样得到的零阶保持信号经过该理想低通滤波器后的输出。

```matlab
Fs=[1000,10000]; 
t=0:1/Fs(1):1-1/Fs(1);
tc=0:1/Fs(2):1-1/Fs(2);
f=-1000:0.5:1000;
% Sampled signal
x=5+3*cos(400*pi*t+pi/4)+cos(800*pi*t-pi/2);
% Over-sampled signal representing the continous-time signal
xc=5+3*cos(400*pi*tc+pi/4)+cos(800*pi*tc-pi/2);
% 'Continous-time' zero order hold signal
xzoh=zeros(Fs(2)/Fs(1),length(t));
for k=1:Fs(2)/Fs(1)
    xzoh(k,:)=x;
end
xzoh=xzoh(:)'; 
% Fourier transform of the 'continous-time' signal
yc = mydft(xc,tc,f);
% Fourier transform of the sampled signal 
y = mydft(x,t,f);
% Fourier transform of the zero order hold signal 
yzoh = mydft(xzoh,tc,f);
% Low-pass filtering
ylpf = yzoh.*((f>=-500)-(f>=500));
% Inverse Fourier transform the low-pass filtered signal
xlpf = myidft(ylpf,f,tc);
% The plottings
at = [10 30 0 8];
af = [-900 900 -0.05 6];
subplot(421); plot(tc*1000,xc); axis(at);
title('Continous-time Signal');
subplot(423); stem(t*1000,x); axis(at);
title('Sampled Discrete-time Signal');
subplot(425); plot(tc*1000,xzoh); axis(at);
title('Zero Order Hold Signal');
subplot(422); plot(f,abs(yc));  axis(af);
subplot(424); plot(f,abs(y));  axis(af);
subplot(426); plot(f,abs(yzoh)); axis(af);
subplot(428); plot(f,abs(ylpf)); axis(af);
xlabel('Frequency (Hz)');
subplot(427); plot(tc*1000,real(xlpf)); axis(at);
xlabel('Time (ms)');
title('Low-pass filtered Signal');
```

![signals-and-systems-17.png](/images/signals-and-systems-17.png)

从图中可以看出，采样得到的零阶保持信号虽然在时域上波形与原始信号有较大的差别，但经低通滤波器滤除高次谐波后，更接近于原信号。

### 采样信号的时域重建

已知时限信号：

<div>
$$
x(t)=\sin(20\pi t+\pi/4),\quad 0\leq t\leq 1
$$
</div>

用采样频率 $f_s=20Hz$ 对信号进行采样得到离散时间信号 $x[n]$。画出 $x[n]$ 用以下不同重建方式得到的模拟信号并叠加在原信号上进行比较：

1. 零阶保持；
2. 一阶保持；
3. 三次样条内插；
4. $sinc$ 函数内插。

```matlab
Fs=[20,1000]; 
t=0:1/Fs(1):3;
tc=0:1/Fs(2):2.5;
f=-1000:0.5:1000;
% Sampled signal
x=sin(20*pi*t+pi/4);
% Over-sampled signal representing the continous-time signal
xc=sin(20*pi*tc+pi/4);

% Zero order hold signal
xzoh=zeros(size(tc));
for k=1:length(tc)
    l=ceil(k*Fs(1)/Fs(2));
    xzoh(k)=x(l);
end

%First order hold signal
xfoh=zeros(size(tc));
for k=1:length(tc)
    l=ceil(k*Fs(1)/Fs(2));
    r=k*Fs(1)/Fs(2)+1-l;
    xfoh(k)=r*x(l+1)+(1-r)*x(l);
end

% Spline interpolation
xspi=spline(t,x,tc);

% Sinc interpolation
xssi=x*(sinc(Fs(1)*(ones(size(t'))*tc-t'*ones(size(tc)))));

ax=[1,1.5,-1.2 1.2];
subplot(4,1,1); plot(tc,xzoh,tc,xc,'r:'); axis(ax);
title('Zero Order Hold');
subplot(4,1,2); plot(tc,xfoh,tc,xc,'r:'); axis(ax);
title('Linear');
subplot(4,1,3); plot(tc,xspi,tc,xc,'r:'); axis(ax);
title('Spline');
subplot(4,1,4); plot(tc,xssi,tc,xc,'r:'); axis(ax);
title('Sinc')
xlabel('Time (s)');
```

![signals-and-systems-18.png](/images/signals-and-systems-18.png)

## 连续时间信号和系统的复频域分析

已知单边信号：

<div>
$$
x(t)=e^{-3t}\cos(2t+\pi/3)u(t)
$$
</div>

计算其拉普拉斯变换的解析式。

```matlab
syms t s;
xt=exp(-3*t)*cos(2*t+pi/3);
Xs=laplace(xt);
pretty(Xs)
```

得到其拉普拉斯变换为：

<div>
$$
X(s)=\frac{\frac{1}{2}(s+3)-\sqrt{3}}{(s+3)^2+4}
$$
</div>

求：

<div>
$$
X(s)=\frac{4s^3-6s^2-3s+4}{s^4-4s^3+5s^2-2s},\quad Re\{s\}>0
$$
</div>

的拉普拉斯反变换。

```matlab
syms t s;
Xs=(4*s^3-6*s^2-3*s+4)/(s^4-4*s^3+5*s^2-2*s);
xt=ilaplace(Xs);
pretty(xt)
```
得到其拉普拉斯反变换为：

<div>
$$
x(t)=(3e^{2t}+3e^t+te^t-2)u(t)
$$
</div>

已知两个因果 LTI 系统的系统函数为：

<div>
$$
H(s)=\frac{2s+1}{s^3+(3/2)s^2+(13/16)s+(5/16)}
$$
</div>

和

<div>
$$
G(s)=\frac{s(2s+1)}{s^3+(3/2)s^2+(13/16)s+(5/16)}
$$
</div>

分别对系统函数进行部分分式展开，求出系统的单位冲激响应 $h(t)$ 和 $g(t)$，作出其时域波形。

与上一问题类似，通过符号运算工具箱和 `ilaplace` 函数可得：

<div>
$$
h(t)=\bigg(-\frac{16}{13}e^{-t}+\frac{16}{13}e^{-\frac{t}{4}}\cos\bigg(\frac{t}{2}\bigg)+\frac{28}{13}e^{-\frac{t}{4}}\sin\bigg(\frac{t}{2}\bigg)\bigg)u(t)
$$
</div>

和

<div>
$$
g(t)=\bigg(\frac{16}{13}e^{-t}+\frac{10}{13}e^{-\frac{t}{4}}\cos\bigg(\frac{t}{2}\bigg)-\frac{15}{13}e^{-\frac{t}{4}}\sin\bigg(\frac{t}{2}\bigg)\bigg)u(t)
$$
</div>

通过程序：

```matlab
b0=[2 1];
b1=[2 1 0];
a=[1 3/2 13/16 5/16];
sys0=tf(b0,a); sys1=tf(b1,a);
t=0:0.01:20;
subplot(2,2,1); plot(t,impulse(sys0,t));
xlabel('Time (seconds)'); ylabel('Amplitude');
ht=-16/13*exp(-t)+1/13*exp(-t/4).*(16*cos(t/2)+28*sin(t/2));
subplot(2,2,2); plot(t,ht); title('h(t)');
xlabel('Time (seconds)'); ylabel('Amplitude');
subplot(2,2,3); plot(t,impulse(sys1,t));
xlabel('Time (seconds)'); ylabel('Amplitude');
gt=16/13*exp(-t)+1/13*exp(-t/4).*(10*cos(t/2)-15*sin(t/2));
subplot(2,2,4); plot(t,gt); title('g(t)');
xlabel('Time (seconds)'); ylabel('Amplitude');
```

得到下图：

![signals-and-systems-19.png](/images/signals-and-systems-19.png)

图中左边为直接用 `impulse` 函数得到的结果，右边为拉普拉斯反变换得到 $h(t)$ 和 $g(t)$，两者相同。由于 $G(s)=sH(s)$，所以 $h(t)$ 和 $g(t)$ 有：

<div>
$$
g(t)=\frac{d}{dt}h(t)
$$
</div>

作出系统的零、极点分布图。

```matlab
subplot(121);
pzmap(sys0);
subplot(122);
pzmap(sys1);
```

![signals-and-systems-20.png](/images/signals-and-systems-20.png)

由于这两个因果系统的极点均分布在 $S$ 平面的左半平面（即所有极点的实部均小于零），因此系统是稳定的。

## 离散时间信号和系统的 Z 域分析

求出以下序列的 Z 变换：

1. $x[n]=a^n\cos(n\pi/2)u[n]$
2. $x[n]=n(n-1)/2u[n]$

```matlab
syms a n;
x0=a^n*cos(n*pi/2);
x1=n*(n-1)/2;
X0 = simple(ztrans(x0));
X1 = simple(ztrans(x1));
pretty(X0);
pretty(X1);
```

求得 Z 变换为：

<div>
$$
\begin{aligned}
x(z)&=\frac{z^2}{a^2+z^2}\\
x(z)&=\frac{z}{(z-1)^3}
\end{aligned}
$$
</div>

用 Z 域分析法求出以下离散时间 LTI 系统的零状态响应。

1. 系统单位脉冲响应为 $h[n]=(\frac{1}{3}(-1)^n+\frac{2}{3}3^n)u[n]$，输出信号为 $x[n]=(-1)^nu[n]$；
2. 系统函数为 $H(z)=\frac{z(7z-2)}{(z-0.2)(z-0.5)}$，输入信号为 $x[n]=\cos(\frac{n\pi}{2})u[n]$。

通过：

```matlab
syms n;
h=(-1)^n/3+2*3^n/3; H=ztrans(h);
x=(-1)^n; X=ztrans(x);
Y=H*X;
y=simple(iztrans(Y));
```

可得系统的零状态响应为：

<div>
$$
y[n]=\bigg(\frac{1}{3}(-1)^nn+\frac{1}{2}(-1)^n+\frac{1}{2}3^n\bigg)u[n]
$$
</div>

通过：

```matlab
syms n z;
H=z*(7*z-2)/(z-1/5)/(z-1/2);
x=cos(n*pi/2); X=ztrans(x);
Y=H*X;
y=simple(iztrans(Y));
pretty(y);
```

得到：

<div>
$$
\begin{aligned}
&y[n]=\\
&\bigg(\bigg(\frac{1}{2}\bigg)^n+\frac{1}{13}\bigg(\frac{1}{5}\bigg)^n+j^n\bigg(\frac{77}{26}-j\frac{31}{26}\bigg)+(-j)^n\bigg(\frac{77}{26}+j\frac{31}{26}\bigg)\bigg)u[n]
\end{aligned}
$$
</div>

用欧拉公式可化简为：

<div>
$$
y[n]=\bigg(\bigg(\frac{1}{2}\bigg)^n+\frac{1}{13}\bigg(\frac{1}{5}\bigg)^n+\frac{77}{13}\cos\bigg(\frac{n\pi}{2}\bigg)-\frac{31}{13}\sin\bigg(\frac{n\pi}{2}\bigg)\bigg)u[n]
$$
</div>

读取计算机中的系统提示音文件 `Windows Logon.wav`（文件位置：`C:\Windows\Media\`），作出声音的时域波形和频谱。

```matlab
[xi,Fs]=audioread('Windows Logon.wav');
x=xi(:,1);
N=length(x);
t=(0:N-1)/Fs;
f=(0:N-1)/N*Fs;
y=fft(x)/Fs;
figure(1);
subplot(2,1,1); plot(t,x)
xlabel('Time (seconds)');
subplot(2,1,2); plot(f(1:floor(N/2))/1000,abs(y(1:floor(N/2))));
xlabel('Frequency (KHz)');
axis([0 2 0 0.02]);
```

![signals-and-systems-21.png](/images/signals-and-systems-21.png "系统音频的时域波形和频谱图")

让声音通过一滤波器，传递函数为：

<div>
$$
H(z)=1+az^{-D}+a^2z^{-2D}+a^3z^{-3D}
$$
</div>

其中 $D$ 的值为采样率的 $0.2$ 倍，$a=0.2$，改变参数值，可观察到不同的回声效果。

```matlab
D=floor(0.2*Fs);
a=0.2;
zt=zeros(1,3*D+N);
zt(1:N)=x;
z=zt;
zt=zeros(1,3*D+N);
zt(D+1:D+N)=a*x;
z=z+zt;
zt=zeros(1,3*D+N);
zt(2*D+1:2*D+N)=a*a*x;
z=z+zt;
zt=zeros(1,3*D+N);
zt(3*D+1:3*D+N)=a*a*a*x;
z=z+zt;
audiowrite('output.wav',z,Fs)
```