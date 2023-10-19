> [中文指南](https://github.com/Rabithua/memos_wmp/blob/forusememos/ChineseReadMe.md)

> Note: This is a WeChat mini program. To publish a mini program on WeChat, you need a domain name that has been filed in China. According to recent policies, the mini program itself also requires additional filing, which is quite troublesome!

> [Using donut to convert WeChat Mini Program to an IOS app or Android app.](https://github.com/Rabithua/memos_wmp#using-donut-to-convert-wechat-mini-program-to-an-app)

<h1 align='center'>Maimo</h1>

<p align='center'><a href="https://github.com/usememos/memos">usememos/memos(version > v0.15.1)</a>·WechatMiniProgram.</p>

![Group 7952](https://github.com/Rabithua/memos_wmp/assets/34543831/e28aa6ba-09a3-4261-bcfa-e46faafc6793)

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

### How to use？[bilibili](https://www.bilibili.com/video/BV1Hp4y1w7oi/)
1. Preparation: A domain name that has been registered in China, pointing to a well-built memos web project (note that the version number is after 0.13.1). The old version may not work properly due to changes in the API. You can search for a suitable version in the releases, but note that it has fewer features compared to the latest version.
2. Please apply for a WeChat mini program. Choose the category "Tools-Reminder" and in the development management section, fill in the field "Request legal domain name" with the domain name you have set up for "memos".
3. Create a local folder and pull the project. `git clone https://github.com/Rabithua/memos_wmp`
4. Download the [WeChat Mini Program Developer Tools.](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
5. Import the cloned folder into WeChat Mini Program Developer Tool and open it, **Please select the test account or use the appid of your registered WeChat mini program, without using cloud development.**
6. In `app.js`, modify `globalData.url` to your own domain, and change `globalData.ifWechatLogin` to `false`.
7. Once the translation is complete, you will be able to see the welcome interface of Maimo. 🎉
8. Please try entering your username and password to see if you can log in successfully. If you do not see a register button, it is because public registration is not enabled. If you encounter any issues, please submit an issue for feedback.

### Using [donut](https://dev.weixin.qq.com/) to convert WeChat Mini Program to an app.

> You may need to install the [testing version of WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html). And you need to enable donut for your mini program.

![Group 7949](https://github.com/Rabithua/memos_wmp/assets/34543831/a74e9685-cc82-49e5-a46e-49151111cb45)

### Have a look

![Group 7952](https://github.com/Rabithua/memos_wmp/assets/34543831/b98badab-f9a9-4939-9484-8c226faab645)
![Group 7950](https://github.com/Rabithua/memos_wmp/assets/34543831/3179a51e-2cfd-40b0-a0b1-b2b125527419)
![Group 7951](https://github.com/Rabithua/memos_wmp/assets/34543831/4e4aa938-6fe3-4c20-9578-e0620b5aa7ba)


`Translated by ChatGPT.`
