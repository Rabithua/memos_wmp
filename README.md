<h1 align='center'>麦默（共享云环境版本分支）</h1>

<p align='center'><a href="https://github.com/usememos/memos">usememos/memos</a>的微信小程序版，使用微信云函数绕过域名限制，实现多站点登录版本。</p>

> 麦默只是 memos 的一个 api 调用器，如果你想拥有自己的memo站点，具体搭建教程参考[碎片化知识卡片管理工具——Memos](https://blog.laoda.de/archives/docker-install-memos)。
> 因为微信云开发最近调整了价格，有了低消（19.9），所以就有个这个云环境共享版本分支。

### 预览 测试账号：test@mail.com 密码：rabithua

![Group 7808](https://user-images.githubusercontent.com/34543831/189886720-4d80fd7c-0da9-4a9c-b6b7-1f5062b3c8b0.png)

### 目前功能有：

- [x] 浏览 memos，支持解析部分 memos 语法，使用的是修改版的原 memos 解析方法
- [x] 发送 memo，目前仅支持纯文本的 memo，不过个人感觉已经足够了😂
- [x] 编辑 memo，归档整理，删除 memo
- [x] 切换用户
- [x] 内容缓存到手机，没有网络的环境也可以查看，后续可能考虑推出一个单机版？
- [x] 置顶与取消置顶
- [x] 分类顺序展示
- [x] 注册及登录
- [x] 搜索功能，但搜索的内容仅可读
- [x] 编辑器快捷按钮
- [x] 多站点切换


## 开始搭建

好了，现在假装你已经有了一个合法的域名搭建好了 memos 并且开启了 https ~

1. 申请一个微信小程序，类目选择 `工具-备忘录`，`开发-开发管理-服务器域名-request合法域名` 填写你搭建 memos 的域名。
2. 本地创建一个文件夹，拉取项目
```cmd
git clone https://github.com/Rabithua/memos_wmp
```
3. 下载微信小程序[开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
4. 导入当前文件夹，选择测试号或者使用你注册好的微信小程序的 appid ，不使用云开发。
5. 顶部`云开发`，~~进入开通云环境，有免费版，也可以按量计费~~ 选择你共享的云环境，并修改`app.js`中`cloud_rp`变量。
6. 在被共享的小程序中，将`cloudfunctions`文件夹中的云函数复制进去，同步云函数，点击`creatuser`函数文件夹，上传云端安装依赖，等待完成。
7. 同步成功之后打开`云开发-云函数`，找到`creatuser`函数，`版本与配置-配置-高级配置-环境变量`添加环境变量key`hostId`，value填写你的memo host账号的openId，同时修改函数超时时间为 `20s` ，确定。
8. 在 `app.js` 中修改 `this.globalData.url` 为你自己的域名。
9. 不出意外的话编译完毕你就可以看到麦默的欢迎界面了🎉
10. 尝试输入用户名和密码，看创建新用户是否成功，遇到问题请提交 issue 反馈给我，谢谢。

### 获取hostId

网页端管理员账号登陆后，`setting` - `Open Api` ，其中 `openid=` 后面字段便是 openId
