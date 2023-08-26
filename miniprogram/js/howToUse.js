 const newMemoContent = `
### 中文指南
默认注册后的语言为英文，可以点击左侧侧滑栏语言切换为中文。
 #Welcom 
欢迎注册玉米地🎉现在你需要了解一下玉米地以及它的使用方法~
玉米地是基于**笔记类**开源web项目[memos](https://github.com/usememos/memos)定制的微信小程序客户端，并且[玉米地](https://github.com/Rabithua/memos_wmp)也是开源的。因此你也可以通过网页使用memo，网址是**https://cornfield.wiki**，以下是使用说明(**当然你也可以点击右上角编辑查看语法，这条memo基本涵盖了所有语法**)：

 - 【新建Memo✨】主页向左滑动可以打开编辑页面，创建新的Memo。

 - 【Memo的三种模式】\`正常/归档/删除\`，Memo卡片右上角第二个是删除按钮，单击归档或者取消归档📦，归档后可以在侧滑栏的**已归档**中找到，长按直接删除🗑。

 - 【置顶Memo📌】卡片右上角第一个是置顶按钮，单击置顶或者取消置顶。

 - 【编辑✒】右上角第三个按钮是编辑，单击可以对Memo卡片进行编辑。

 - 【编辑页面的快捷按钮💡】编辑页面三个快捷按钮分别是 标签、TODO、代码块，快捷语法块，\`虽然目前并不是那么好用\`。

 - 【标签🏷】标签后方有一个空格，这个是话题语法结束的标志，不可或缺。

 - 【TODO📋】中括号内空格渲染出来是待办，空格替换为英文字母小写 \`x\` 渲染出来是已完成。\`另外 TODO 内容编写完毕后最后一条后面也要添加回车\`，因为回车是TODO语法结束的标志。

 - 【代码块🎃】第三个是代码块按钮，语法前后都需要回车来包裹。

#语法示例 

- [ ] 待办事项
- [x] 已完成

这句话包含了一个\`行内代码\`。

 - 这是一个list
 - 还有一件事
 - 还有一件事
 - 还有一件事

**我被加粗了**，*我是斜体*。

\`\`\`
// 这是一个代码块
.todo-text {
  display:initial;
  vertical-align: middle;
}
\`\`\`

The following content is translate by ChatGPT.

### Engilish Guide

#Welcome
Welcome to register for Meimo 🎉 Now you need to learn about Meimo and how to use it~ 
Meimo is a WeChat app client customized based on the open-source web project [memos](https://github.com/usememos/memos) for note-taking, and [Meimo](https://github.com/Rabithua/memos_wmp) is also open-source. Therefore, you can also use Memos through the web page, which is located at **https://cornfield.wiki**. Below is the usage instructions (**of course, you can also click the "Edit" button in the upper right corner to view the syntax; this memo basically covers all the syntax**):
 
- There are **three modes** for a Memo: Normal/Archived/Deleted. The delete button is located on the top right corner of the Memo card. Click once to archive or unarchive 📦, and after archiving, it can be found in the **Archived** section of the sliding menu. Long press to delete directly 🗑.
 
- The first button on the top right corner of the Memo card is the sticky button. Click once to pin or unpin. There is also a hidden feature: long press to share the current Memo.
 
- The third button on the top right corner is the edit button. Click once to edit the Memo card.
 
- Swipe left on the home page to open the editing page and create a new Memo.
 
- There are three shortcut buttons on the editing page: Tags, TODO, and Code block. A shortcut syntax block, though it is not that easy to use currently.
 
- There is a space behind the topic. This is the mark indicating the end of the topic syntax and cannot be omitted.
 
- The spaces inside the brackets render out as TODO items, and replacing them with the lowercase letter 'x' renders them as completed. Also, after the TODO content is written, a newline should be added at the end of the last line, as the newline is the mark indicating the end of the TODO syntax.
 
- The third button is the code block button. Line breaks are required to wrap the syntax before and after a code block.
 
# Syntax Example

- [ ] To-do item
- [x] Completed

This sentence contains an \`inline code\`.

- This is a list
- Another thing
- Another thing
- Another thing

**I am bold**, *I am italic*.

\`\`\`
// This is a code block
.todo-text {
  display:initial;
  vertical-align: middle
}
\`\`\`
`
 export {
   newMemoContent
 }