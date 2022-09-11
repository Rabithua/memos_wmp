<h1 align='center'>麦默</h1>

<p align='center'><a href="https://github.com/usememos/memos">usememos/memos</a>的微信小程序版</p>

> 麦默只是 memos 的一个 api 调用器，所以想要使用这个小程序，你需要先搭建一个 memos ，具体搭建教程参考[碎片化知识卡片管理工具——Memos](https://blog.laoda.de/archives/docker-install-memos)，另外微信小程序对request域名有较[苛刻的限制](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)，具体可以百度了解一下，应该会有奇奇怪怪的办法能够曲线救国（合法域名代理访问，需要处理跨域问题，并且依然需要一个合法的域名来代理请求👶），喜欢折腾的可以自己摸索一下，不然就老实备案。
> 
> 发现了绕过域名限制的另一个办法，通过云函数发起请求，感兴趣的可以百度`微信小程序云函数request`👈

### 预览 测试账号：test@mail.com 密码：rabithua

![微信图片_20220901133041](https://user-images.githubusercontent.com/34543831/189478411-a4aecce7-942d-4f03-8ad5-498f0f928511.png)

### 目前功能有：

- [x] 浏览 memos，支持解析部分 memos 语法，使用的是修改版的原 memos 解析方法
- [x] 发送 memo，目前仅支持纯文本的 memo，不过个人感觉已经足够了😂
- [x] 编辑 memo，归档整理，删除 memo
- [x] 切换用户 openId
- [x] 内容缓存到手机，没有网络的环境也可以查看，后续可能考虑推出一个单机版？
- [x] 置顶与取消置顶
- [x] 分类顺序展示
- [x] 注册及登录
- [x] 搜索功能，但搜索的内容仅可读
- [x] 编辑器快捷按钮


## 开始搭建

好了，现在假装你已经有了一个合法的域名搭建好了 memos 并且开启了 https ~

1. 申请一个微信小程序，类目选择 `工具-备忘录`，`开发-开发管理-服务器域名-request合法域名` 填写你搭建 memos 的域名。
2. 本地创建一个文件夹，拉取项目
```cmd
git clone https://github.com/Rabithua/memos_wmp
```
3. 下载微信小程序[开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
4. 导入当前文件夹，选择测试号或者使用你注册好的微信小程序的 appid ，~~不使用云开发~~，勾选使用云开发，从`315ded7`开始，加入了云函数以使用更加安全的方式创建用户，如果仅自用，可以使用`315ded7`之前的版本，或者自己动手修改。
5. 顶部`云开发`，进入开通云环境，有免费版，也可以按量计费。
6. 右键`cloudfunctions`文件夹，同步云函数，点击`creatuser`函数文件夹，上传云端安装依赖，等待完成。
7. 同步成功之后打开`云开发-云函数`，找到`creatuser`函数，`版本与配置-配置-高级配置-环境变量`添加环境变量key`hostId`，value填写你的memo host账号的openId，确定。
8. 在 `app.js` 中修改 `this.globalData.url` 为你自己的域名。
9. 不出意外的话编译完毕你就可以看到麦默的欢迎界面了🎉
10. 尝试输入用户名和密码，看创建新用户是否成功，遇到问题请提交 issue 反馈给我，谢谢。

### 获取hostId

网页端管理员账号登陆后，`setting` - `Open Api` ，其中 `openid=` 后面字段便是 openId
