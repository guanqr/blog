+++
title = "光电子学"
date = "2019-11-07T14:42:32+08:00"
tags = ["Photonics"]
categories = ["study","optics"]
series = ["Major-Courses"]
katex =true
displayCopyright = true
gitinfo = true
toc = true
+++

## 光学谐振腔与高斯光束

### 矩阵光学

![photonics-0.png](/images/photonics-0.png)

将光学系统看成一个暗箱，仅考虑入射平面与出射平面上的光束特点，在光轴与入射光线组成的平面 $yz$ 上，用入射平面上入射光线的位置与方向坐标 $(y_1,\theta_1)$，以及出射平面上经过系统作用后的出射光线的位置与方向坐标 $(y_2,\theta_2)$ 之间的关系来描述该光学系统的行为，在近轴光线的条件下，可以得出：

$$
\begin{aligned}
    y_2&=Ay_1+B\theta_1\\\\
    \theta_2&=Cy_1+D\theta_1 
\end{aligned}
$$

$A$、$B$、$C$、$D$ 是描述该光学系统的参数，上式可以用矩阵表示为：

$$
\begin{bmatrix}
    y_2\\\\
    \theta_2
\end{bmatrix}=
\begin{bmatrix}
    A & B\\\\
    C & D
\end{bmatrix}
\begin{bmatrix}
    y_1\\\\
    \theta_1
\end{bmatrix}
$$

变换矩阵 $M=\begin{bmatrix}A & B\\\\C & D\end{bmatrix}$ 称为..光线传播矩阵..。

#### 光学元件的传播矩阵

规定：光线角度是从 $z$ 轴方向算起，光线指向光轴 $z$ 上方 $\theta$ 为正，指向光轴 $z$ 下方 $\theta$ 为负。

自由空间：

$$
M=\begin{bmatrix}
    1 & d\\\\
    0 & 1
\end{bmatrix}
$$

平面边界折射：

$$
M=\begin{bmatrix}
    1 & 0\\\\
    0 & \frac{n_1}{n_2}
\end{bmatrix}
$$

两种折射率球面界面的折射：

$$
M=\begin{bmatrix}
    1 & 0\\\\
    -\frac{n_2-n_1}{n_2 R} & \frac{n_1}{n_2}
\end{bmatrix}
$$

薄透镜的透射：

$$
M=\begin{bmatrix}
    1 & 0\\\\
    -\frac{1}{f} & 1
\end{bmatrix}
$$

平面反射镜的反射：

$$
M=\begin{bmatrix}
    1 & 0\\\\
    0 & 1
\end{bmatrix}
$$

球面反射镜的反射

$$
M=\begin{bmatrix}
    1 & 0\\\\
    \frac{2}{R} & 1
\end{bmatrix}
$$

#### 光学系统的传播矩阵

一个光学系统由多个光学元件组成，因此光学系统的传播矩阵由各光学元件的矩阵以及元件之间的自由空间矩阵的乘积构成。矩阵乘积的的次序为：入射元件的矩阵在最右，依次左乘相继的元件矩阵。

连续平板结构：

$$
M=\begin{bmatrix}
    1 & d_N/n_N\\\\
    0 & 1
\end{bmatrix}\cdots
\begin{bmatrix}
    1 & d_2/n_2\\\\
    0 & 1
\end{bmatrix}
\begin{bmatrix}
    1 & d_1/n_1\\\\
    0 & 1
\end{bmatrix}=
\begin{bmatrix}
    1 & \sum^{n}\_{i=1}d_i/n_i\\\\
    0 & 1
\end{bmatrix}
$$

传播一定距离后经过薄透镜：

$$
M=\begin{bmatrix}
    1 & 0\\\\
    -1/f & 1
\end{bmatrix}
\begin{bmatrix}
    1 & d\\\\
    0 & 1
\end{bmatrix}=
\begin{bmatrix}
    1 & d\\\\
    -1/f & 1-d/f
\end{bmatrix}
$$

薄透镜成像：

$$
M=\begin{bmatrix}
    1 & d_2\\\\
    0 & 1
\end{bmatrix}
\begin{bmatrix}
    1 & 0\\\\
    -1/f & 1
\end{bmatrix}
\begin{bmatrix}
    1 & d_1\\\\
    0 & 1
\end{bmatrix}=
\begin{bmatrix}
    1-d_2/f & d_1+d_2-d_1d_2/f\\\\
    -1/f & 1-d_1/f
\end{bmatrix}
$$

周期型光学系统：

当光波在两个平行平面反射镜构成的..谐振腔..之间来回地反射时，可看其为一个周期系统。

![photonics-1.png](/images/photonics-1.png)

则有：

$$
\begin{bmatrix}
    y_m\\\\
    \theta_m
\end{bmatrix}=
\begin{bmatrix}
    A & B\\\\
    C & D
\end{bmatrix}^m
\begin{bmatrix}
    y_0\\\\
    \theta_0
\end{bmatrix}
$$

由此得出：

$$
\begin{aligned}
    y\_{m+1}&=Ay\_m+B\theta\_m\\\\
    \theta\_{m+1}&=Cy\_m+D\theta\_m
\end{aligned}
$$

那么：

$$
\begin{aligned}
    \theta\_m&=\frac{y\_{m+1}-Ay\_m}{B}\\\\
    \theta\_{m+1}&=\frac{y\_{m+2}-Ay\_{m+1}}{B}
\end{aligned}
$$

可以推出..周期型光学系统中光线位置高度关系..：

$$
\begin{aligned}
    y\_{m+2}=2by\_{m+1}-F^2y\_m
\end{aligned}
$$

其中，$b=\frac{A+D}{2}$，且 $F^2=AD-BC=\det[M]$。

假设该方程的解形式为：

$$
\begin{aligned}
    y\_{m}=y\_0h^m
\end{aligned}
$$

其中，$h$ 为常数，将此解带入原方程中得到：

$$
\begin{aligned}
    h^2-2bh+F^2=0
\end{aligned}
$$

因此 $h$ 的取值为：

$$
\begin{aligned}
    h=b\pm i(F^2-b^2)^{1/2}
\end{aligned}
$$

定义变量：

$$
\begin{aligned}
    \varphi=\cos^{-1}(b/F)
\end{aligned}
$$

可以推出关系：

$$
\begin{aligned}
    b=F\cos\varphi
\end{aligned}\\\\
\begin{aligned}
    (F^2-b^2)^{1/2}=F\sin\varphi
\end{aligned}
$$

所以：

$$
\begin{aligned}
    h=F(\cos\varphi\pm i\sin\varphi)=F\exp(\pm i\varphi)
\end{aligned}\\\\
\begin{aligned}
    y\_m=y\_0F^m\exp(\pm im\varphi)
\end{aligned}
$$

因此方程 $y\_{m+2}=2by\_{m+1}-F^2y\_m$ 的一般解是 $y\_m$ 正负号两个解的线性组合。两个指数函数的组合可以表示成谐波函数，有：

$$
\begin{aligned}
    y\_m=y\_{\max}F^m\sin(m\varphi+\varphi\_0)
\end{aligned}
$$

参数 $F$ 的平方为基本周期单元传递矩阵的值，即 $F=\det^{1/2}[M]$。无论单元系统结构形式如何，周期单元的传递矩阵值 $\det[M]=n\_1/n\_2$，其中 $n\_1$，$n\_2$ 分别是该基础周期单元初始与最后部分的折射率。该系统也可运用到整个叠加系统。对于处在空间中的光学系统，$n\_1=n\_2$，可得 $\det[M]=1$，$F=1$。所以：

$$
\begin{aligned}
    y\_m=y\_{\max}\sin(m\varphi+\varphi\_0)
\end{aligned}
$$

可以看出光线在周期光学系统中的位置轨迹是一个谐波函数或双曲函数。

..稳定解条件..，$\varphi=\cos^{-1}b$ 必为实数，即有 $\frac{|A+D|}{2}\leq 1$。

..周期轨迹条件..，存在整数之比 $q/s=\varphi/(2\pi)$。

### 光学谐振腔基础

#### 平面谐振腔

##### 谐振模式

一频率为 $\nu$ 的平面波电场表达式为 $u(r,t)=\mathscr{R}[U(r)\exp(i2\pi\nu t)]$，波矢大小为 $k=2\pi\nu/c$。形成谐振驻波时，即在 $z=0$ 与 $z=d$ 处，有 $U(r)=0$，驻波场为：

$$
\begin{aligned}
    u(r)=A\sin(kz)
\end{aligned}
$$

$A$ 为常数，若要满足上述条件，则必有 $kd=q\pi$。因此：

$$
\begin{aligned}
    k\_q=\frac{q\pi}{d}
\end{aligned}
$$

一个平面谐振腔中任意场为该腔中各种频率波（模式）的叠加，因此上式可表达为模式与频率之间的关系，这些模式是一些等间距离散频率值，即：

$$
\begin{aligned}
    \nu\_q=q\frac{c}{2d}
\end{aligned}
$$

频率之间等间隔，间隔为：

$$
\begin{aligned}
    \nu\_F=\frac{c}{2d}
\end{aligned}
$$

这就是..相邻谐振模式的频率间隔..。光速 $c$ 是指光波在腔内介质中的速度，如果腔内折射率为 $n$，则 $c=c\_0/n$。

一般谐振腔的谐振条件是：光波在谐振腔中走一个来回能够完整重现，所以相位 $\varphi=q2\pi$。

##### 模式密度

在一维谐振腔情况下，模式密度指单位腔长度、单位频率内的模式数。由于平面腔中模式间隔为 $\nu\_F=C/(2d)$，则单位频率的模式数为 $1/\nu\_F=2d/c$。单位腔长、单位频率的模数为 $2/c$，两种正交偏振，模数为 $4/c$，所以一维腔的模密度为：

$$
\begin{aligned}
    M(\nu)=4/c
\end{aligned}
$$

##### 损耗与谐振谱宽度

![photonics-2.png](/images/photonics-2.png)

平面腔的周期相位变化为 $\varphi=2kd=4\pi\nu d/c$。但当腔内有损耗时，光波的幅值在衰减，设一个来回光场幅值变化比为 $\gamma$，则一个来回后的光场为 $U\_1=hU\_0=\gamma e^{-i\varphi}U\_0$，腔内总场为全部叠加：

$$
\begin{aligned}
    U=U\_0(1+h+h^2+\cdots)=U\_0/(1-h)
\end{aligned}
$$

光强为：

$$
\begin{aligned}
    I=|U^2|=I\_0/[(1/\gamma)^2+4\gamma\sin^2(\varphi/2)]
\end{aligned}
$$

可以整理为：

$$
\begin{aligned}
    I=\frac{I\_{\max}}{1+(2\mathscr{F}/\pi)^2\sin^2(\varphi/2)}
\end{aligned}
$$

其中，$I\_{\max}=\frac{I\_0}{(1-\gamma)^2}$，$I\_0=|U_0|^2$ 为初始波强度，且：

$$
\begin{aligned}
    \mathscr{F}=\frac{\pi\gamma^{1/2}}{1-\gamma}
\end{aligned}
$$

称为谐振腔的..细度..。谐振峰的半高全宽（FWHM）为 $\Delta\varphi=2\pi/\mathscr{F}$，对应的频率带宽为：

$$
\begin{aligned}
    \delta\nu=(c/4\pi d)\Delta\varphi=\nu\_F/\mathscr{F}
\end{aligned}
$$

![photonics-3.png](/images/photonics-3.png)

##### 谐振腔的损耗源

假设腔镜的反射率为 $R\_1=r\_1^2$ 和 $R\_2=r\_2^2$，则一个完整来回光波的两次反射损耗与两个反射镜间媒介的吸收散射损耗综合起来，可以表示为：

$$
\begin{aligned}
    r^2=R\_1R\_2\exp(-2\alpha\_s d)
\end{aligned}
$$

可以写成：

$$
\begin{aligned}
    r^2=\exp(-2\alpha\_r d)
\end{aligned}
$$

其中，$\alpha\_r$ 是..总有效分布损耗系数..，系统损耗系数为：

$$
\begin{aligned}
    \alpha\_r=\alpha\_s+\frac{1}{2d}\ln\frac{1}{R\_1R\_2}
\end{aligned}
$$

损耗系数可表示为其他几个部分之和的形式：

$$
\begin{aligned}
    \alpha\_r=\alpha\_s+\alpha\_{m1}+\alpha\_{m2}
\end{aligned}
$$

其中，$\alpha\_{m1}=\frac{1}{2d}\ln\frac{1}{R\_1}$，$\alpha\_{m2}=\frac{1}{2d}\ln\frac{1}{R\_2}$ 分别表示两个腔镜上的损耗。

细度 $\mathscr{F}$ 参数与腔的损耗相关，因此可得：

$$
\begin{aligned}
    \mathscr{F}=\frac{\pi\exp(-\alpha\_rd/2)}{1-\exp(-\alpha_rd)}
\end{aligned}
$$

细度与总损耗系数之间的关系为：..细度随着损耗的增加而减小..。如果 $\alpha\_rd\ll 1$，则 $\exp(-\alpha\_r d)\approx1-\alpha\_r d$，则细度可简化为：

$$
\begin{aligned}
    \mathscr{F}=\frac{\pi}{\alpha\_r d}
\end{aligned}
$$

##### 光子寿命

谐振峰值带宽与谐振损耗的关系可以看成是时间-频率不确定性效应的放大。

$$
\begin{aligned}
    \delta\nu\approx\frac{c/(2d)}{\pi(\alpha\_r d)}=\frac{c\alpha\_r}{2\pi}
\end{aligned}
$$

谐振腔损耗越大，谐振峰带宽越宽。定义衰减时间：

$$
\begin{aligned}
    \tau\_p=1/(c\alpha\_r)
\end{aligned}
$$

为谐振腔的寿命或光子寿命，单位为秒，则有：

$$
\begin{aligned}
    \tau\_p=1/(2\pi\delta\nu)
\end{aligned}
$$

谐振线的 FWHM 的光谱宽度为：

$$
\begin{aligned}
    \tau\_p=1/(2\pi\tau\_p)
\end{aligned}
$$

##### 品质因子 $Q$

大品质因子的系统对应低的谐振损耗。对于光学谐振腔，$Q$ 因子可以用腔内储能以 $c\alpha\_r$ 速度来确定，即每个周期损耗率为 $c\alpha\_r/\nu\_0$，因此 $Q=\frac{2\pi}{c\alpha\_r/\nu\_0}$。因为 $\delta\nu=c\alpha\_r/(2\pi)$，所以光学谐振腔的 $Q$ 因子为：

$$
\begin{aligned}
    Q=\nu\_0/\delta\nu
\end{aligned}
$$

利用 $\tau\_p=1/(c\alpha\_r)$ 得：

$$
\begin{aligned}
    Q=2\pi\nu\_0\tau\_p
\end{aligned}
$$

该因子也与谐振腔光谱细度相关：

$$
\begin{aligned}
    Q=\nu\_0\mathscr{F}/\nu\_F
\end{aligned}
$$

#### 二维、三维谐振腔与模密度

##### 二维平面谐振腔

![photonics-4.png](/images/photonics-4.png)

波矢为 $k=(k\_y,k\_z)$，其中，$k\_y=\frac{q\_y\pi}{d}$，$k\_z=\frac{q\_z\pi}{d}$。

有：

$$
\begin{aligned}
    k^2=k\_y^2+k\_z^2=\big(\frac{2\pi\nu}{c}\big)^2
\end{aligned}
$$

因此在二维谐振腔中每个波矢占据的面积为 $\big(\frac{\pi}{d}\big)^2$，那么波矢 $k$ 从 $0$ 到 $k$ 之间的模式数为：

$$
\begin{aligned}
    N\_\nu=\frac{\pi(\frac{2\pi\nu}{c})^2/4}{(\pi/d)^2}\times 2=\frac{2\pi\nu^2d^2}{c^2}
\end{aligned}
$$

二维谐振腔模密度为：

$$
\begin{aligned}
    M(\nu)=\frac{1}{A}\frac{dN\_nu}{d\nu}=\frac{4\pi\nu}{c^2}
\end{aligned}
$$

其中，$A$ 为腔的截面积。

##### 三维平面谐振腔

![photonics-5.png](/images/photonics-5.png)

与二维平面谐振腔同理，$k=(k\_x,k\_y,k\_z)$，$k^2=k\_x^2+k\_y^2+k\_z^2=\big(\frac{2\pi\nu}{c}\big)^2$，波矢 $k$ 从 $0$ 到 $k$ 之间的模式数为 $[(2\pi\nu/c)^3/3\pi^2]d^3=[8\pi\nu^3/(3c^3)]d^3$。

二维谐振腔模密度为：

$$
\begin{aligned}
    M(\nu)=\frac{8\pi\nu^2}{c^3}
\end{aligned}
$$

#### 球面谐振腔

![photonics-6.png](/images/photonics-6.png)

球面谐振腔由两个半径为 $R\_1$ 和 $R\_2$，相距为 $d$ 的球面镜组成的谐振腔。定义：凸面镜 $R<0$，凹面镜 $R>0$。

其来回传播的矩阵为：

$$
\begin{bmatrix}
    A & B\\\\
    C & D
\end{bmatrix}=
\begin{bmatrix}
    1 & 0\\\\
    2/R\_1 & 1
\end{bmatrix}
\begin{bmatrix}
    1 & d\\\\
    0 & 1
\end{bmatrix}
\begin{bmatrix}
    1 & 0\\\\
    2/R\_2 & 1
\end{bmatrix}
\begin{bmatrix}
    1 & d\\\\
    0 & 1
\end{bmatrix}
$$

稳定腔的条件为：

$$
\begin{aligned}
    0\leq(1+d/R\_1)(1+d/R\_2)\leq 1
\end{aligned}
$$

### 高斯光束

#### 高斯光束简述

假设一个近轴、沿 $z$ 方向传播的波，其函数形式为：

$$
\begin{aligned}
    U(r)=A(r)\exp(-ikz)
\end{aligned}
$$

该函数式为..旁轴波函数式..。其波矢大小为 $k=2\pi/\lambda$。为使其满足赫姆霍兹方程 $(\nabla^2+k^2)U(r)=0$，$A(r)$ 需满足一定条件。设 $A(r)$ 随 $z$ 变化极慢，$\Delta A\ll A$，即 $\partial A/\partial z\ll A/\lambda=Ak/(2\pi)$，有：

$$
\begin{aligned}
    \frac{\partial A}{\partial z}\ll kA
\end{aligned}
$$

设 $\partial A/\partial z$ 在 $\lambda$ 距离内变化极慢，有 $\partial^2A/\partial z^2\ll k\partial A/\partial z$，则：

$$
\begin{aligned}
    \frac{\partial^2 A}{\partial z^2}\ll k^2A
\end{aligned}
$$

赫姆霍兹方程可改写为：

$$
\begin{aligned}
    \nabla\_T^2A-i2k\frac{\partial A}{\partial z}=0
\end{aligned}
$$

其一个简单解为：

$$
\begin{aligned}
    A(r)=\frac{A\_1}{z}\exp(-ik\frac{\rho^2}{2z}),\quad \rho^2=x^2+y^2
\end{aligned}
$$

以 $z-\xi$ 代替 $z$，$\xi=-iz\_0$，上式则为高斯光束的复数包络，此时：

$$
\begin{aligned}
    A(r)=\frac{A\_1}{q(z)}\exp[-ik\frac{\rho^2}{2q(z)}],\quad q(z)=z+iz\_0
\end{aligned}
$$

定义参数 $R(z)$ 和 $W(z)$，有：

$$
\begin{aligned}
    \frac{1}{q(z)}=\frac{1}{R(z)}-i\frac{\lambda}{\pi W^2(z)}
\end{aligned}
$$

$R(z)$ 为光束波前的曲率半径，$W(z)$ 为高斯光束的宽度。有：

$$
\begin{aligned}
    A(r)=\frac{A\_1}{z+iz\_0}\exp\Big\lbrace\frac{-ik\rho^2}{2}\Big[\frac{1}{R(z)}-\frac{i\lambda}{\pi W^2(z)}\Big]\Big\rbrace
\end{aligned}
$$

