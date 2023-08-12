> [中文指南](https://github.com/Rabithua/memos_wmp/blob/master/ChineseReadMe.md)
> Note: This is a WeChat mini program. To publish a mini program on WeChat, you need a domain name that has been filed in China. According to recent policies, the mini program itself also requires additional filing, which is quite troublesome!

<h1 align='center'>Maimo</h1>

<p align='center'><a href="https://github.com/usememos/memos">usememos/memos(Base v0.13.1)</a>·WechatMiniProgram.</p>

### Feature 
- [x] 🔍 Read&Search memos（Tags&Tag Suggestions）
- [x] ✍️ Send&Edit memos（Archive, delete, pin）
- [x] 📂 File management
- [x] 🔥 Hotspot map, language switch（Engish&Chinese）, and default memo visibility in the sidebar.
- [x] 🔑 OpenApi
- [x] 🔗 Share through a link or a mini program code.
- [x] 🌓 DarkMode
- [x] 🏷 Through automatic labeling by ChatGPT
- [x] 💫 Automatically bind an account through the WeChat user identifier.
- [x] ⏰ Send scheduled reminders through WeChat official account.

### How to use？
1. Preparation: A domain name that has been registered in China, pointing to a well-built memos web project (note that the version number is 0.13.1). The old version may not work properly due to changes in the API. You can search for a suitable version in the releases, but note that it has fewer features compared to the latest version.
2. Please apply for a WeChat mini program. Choose the category "Tools-Reminder" and in the development management section, fill in the field "Request legal domain name" with the domain name you have set up for "memos".
3. Create a local folder and pull the project. `git clone https://github.com/Rabithua/memos_wmp`
4. Download the [WeChat Mini Program Developer Tools.](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
5. Import the cloned folder into WeChat Mini Program Developer Tool and open it, **Please select the test account or use the appid of your registered WeChat mini program, without using cloud development.**
6. In `app.js`, modify `globalData.url` to your own domain, and change `globalData.ifWechatLogin` to `false`.
7. Once the translation is complete, you will be able to see the welcome interface of Maimai. 🎉
8. Please try entering your username and password to see if you can log in successfully. If you do not see a register button, it is because public registration is not enabled. If you encounter any issues, please submit an issue for feedback.





`Translated by ChatGPT.`
