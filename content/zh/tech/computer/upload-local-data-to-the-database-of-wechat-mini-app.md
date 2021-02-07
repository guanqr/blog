+++
title = "将本地数据上传至小程序云开发数据库"
date = "2020-07-09T13:28:43+08:00"
lastmod = "2020-07-10T13:28:43+08:00"
tags = ["design-contest","mini-app","python","wechat"]
displayExpiredTip = true
+++

在[前文](/tech/computer/insert-echart-into-wechat-mini-app/)中我提到，在本次光电竞赛中我设计了一款小程序，需要借助树莓派，利用传感器采集数据并上传至小程序的云开发数据库，再通过小程序读取数据库中的数据，绘制温度变化曲线。获取数据并绘制曲线的功能已经在前文实现，现在需要做的就是，如何将本地的数据上传至云开发数据库。

要想实现数据的传输，最重要的一点就是获取到微信公众平台的 access_token。而要想得到 access_token，就需要提供小程序的 AppID 和 AppSecret，这两者都可以在微信公众平台中获取到。

这里我们可以定义一个函数来获取 access_token：

```python
def access_token():
    """
    获取 access_token
    """
    APPID = '' # 小程序ID
    APPSECRET = '' # 小程序秘钥
    WECHAT_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APPID + '&secret=' + APPSECRET
    response = requests.get(WECHAT_URL)
    result = response.json()
    return result["access_token"] # 将返回值解析获取 access_token
```

正常情况下，返回的 JSON 数据包内容为：

```json
{"access_token":"ACCESS_TOKEN","expires_in":7200}
```

至此，我们就得到了 access_token。接下来就要上传数据。我想要上传的数据为：

```python
openId = 'o2XBq5FtxdiSDfJRpxfVi74QhQSQ'
tempName = 'GuanQirui'
tempTemp = '36.5'
tempLct = '杭州'
tempDate = '2020-07-12'
```

`openId` 为微信用户的唯一标识，这段字符串表示该段数据是属于「我」这个用户的。在小程序中，我们上传数据后可以发现，每一组数据都有自己的 `openId`，因此每个用户只能访问到属于自己 `openId` 的数据。所以说，如果不上传 `openId`，尽管这段数据存放在数据库中，你也无法通过小程序访问。`tempName` 到 `tempData` 这几个数据就是自己定义的数据，分别表示姓名、温度、地点、日期。

数据上传的格式应该和在小程序中使用 JavaScript 编写的上传函数相同。在小程序中的代码为：

```javascript
const db = wx.cloud.database()
db.collection('temp').add ({
    data: {
        name: this.data.name,
        temperature: this.data.temperature,
        location: this.data.location,
        date: this.data.date
    },
    success: res => {
        this.setData ({
            counterId: res._id,
            count: 1
        })
    },
})
```
其中，`temp` 是数据库中存放这组数据的集合名称。从这段代码可以看出，数据上传的关键是 `db.collection().add` 这部分函数。

另外，上传数据的接口为：

```
https://api.weixin.qq.com/tcb/databaseadd?access_token=ACCESS_TOKEN
```

我们再定义一个函数对数据进行上传：

```python
def databaseAdd(access_token):
    """
    新建记录并对内容进行定义
    """
    url = 'https://api.weixin.qq.com/tcb/databaseadd?access_token=' + access_token
    
    query = 'db.collection("temp").add({data:{_openid:"'+ openId +'",name:"'+ tempName +'",temperature:"'+ tempTemp +'",location: "'+ tempLct +'",date:"'+ tempDate +'"}})'
    
    data = {
        "env": "toolbox-01",
        "query": query
    }
    
    response = requests.post(url, data=json.dumps(data))
    result = response.json()
    print(result)
```

其中，`data` 中的 `env` 是数据库的名称。我们执行以上的函数，即可在小程序云开发的后台查看到新添加的数据。

对云开发数据库中的数据进行获取的方法类似。比如现在有一个名为 `user` 的数据集合，数据中包含了用户的姓名 `name` 和位置 `location`，我们想要获取到有关 Tony 用户的所有数据。同样定义一个函数：

```python
def databaseQuery(access_token):
    """
    检索数据库，获取 tempName 用户数据
    """
    url = 'https://api.weixin.qq.com/tcb/databasequery?access_token=' + access_token
    
    #query = 'db.collection("user").limit(100).get()'
    query = 'db.collection("user").where({"name":"' + tempName + '"}).get()'
    
    data = {
        "env": "toolbox-01",
        "query": query
    }
    
    response = requests.post(url, data=json.dumps(data))
    length = len(response.json()['data'])
    user = response.json()['data'][length - 1]
    user_dict = ast.literal_eval(user)
    openId = user_dict.get('_openid')
    location = user_dict.get('location')
    
    print(openId)
    print(location)
```

其中， `tempName = Tony`，函数打印出了有关 Tony 的最新数据中对应的 `_openid` 和 `location` 信息。

因为我想要实现的功能仅为本地数据的上传，数据的修改和删除操作均在小程序端执行，所以就没有编写有关修改和删除的函数。感兴趣的读者可以自行查阅网上相关资料自行编写。