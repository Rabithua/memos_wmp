export const chinese = {
  language: 'zh',
  common: {
    notSupport: '还未支持',
    loading: '加载中…',
    refreshing: '刷新中…',
    wrong: '未知错误!',
    changeLanguage: '语言',
    languageList: ['中文', 'English'],
    memoCard: {
      d: '天前',
      h: '小时前',
      m: '分钟前',
      now: '刚刚发布'
    }
  },
  welcom: {
    headTitle: '欢迎来到麦默👋',
    secondTitle: '把脑袋里的小碎片收集起来✨',
    dsc: '麦默是 Github 开源项目 usememos/memos 的小程序版本，同样的，麦默 Rabithua/memos_wmp 也是开源的！',
    username: '用户名',
    usernamePlaceholder: 'XXX@XX.com',
    password: '密码',
    passwordPlaceholder: 'password',
    button: '登录/注册',
    webview: '打开网页版',
    signUpSuc: '注册成功!',
    usernameErr: '用户名错误',
    passwordCheckErr: '密码长度需大于六位',
    passwordErr: '密码错误',
    signInSuc: '登录成功',
    signUpTip: {
      title: '提示',
      confirmText: '确定',
      cancelText: '取消',
      content: '账户不存在，直接注册?',
    },
    shareMsg: {
      title: '麦默',
    }
  },
  home: {
    state: {
      online: '在线',
      offline: '离线'
    },
    edit: '编辑中…',
    newMemoPlaceholder: '记录有趣的想法~',
    editErr: '内容不能为空',
    editChanged: '已更改',
    send: '发送',
    noMemos: '一条 Memo 也没有发现~',
    reachBottom: '到底了~',
    pinned: '已置顶',
    unpinned: '已取消置顶',
    rowStatusChange: '归档状态已更改',
    visibilityChange: '可见性已更改',
    archived: '已归档',
    deleted: '已删除',
    DeleteMemoModal: {
      title: '提示',
      confirmText: '删除',
      cancelText: '取消',
      content: '删除当前 Memo ?',
    },
    goWelcomModal: {
      title: '提示',
      confirmText: '切换',
      cancelText: '取消',
      content: '切换账号?',
    },
    sideBar: {
      memos: '记录',
      tags: '标签',
      mon: '周一',
      sun: '周日',
      memoVisibility: 'Memo 可见性',
      locale: '语言',
      openWebview: '网页版 →',
      date_1: '注册于 ',
      date_2: '天前。',
      heatTipMemo: '条记录'
    },
    Tips: {
      p_close: '(长按不再显示)',
      title_1: '操作改版',
      p_1: '新建 Memos ，现在通过侧滑手势触发👇',
      p_4:'Search 页面可以长按 Tag 删除（删除后会出现在 Tag 建议中）🤸‍♂️',
      title_2: '功能更新',
      p_2: 'Search 页面新增 Tag 建议，支持从建议创建 Tag✨',
      p_3: '新建或编辑 memo 时自动缓存，妈妈再也不会担心我写了一半的小作文丢失了✌',
    }
  },
  search: {
    inputPlaceHolder: '根据内容搜索…',
    cantEmpty: '搜索内容不能为空',
    nothing: '这里什么也没有 🕸',
    searchResultPlaceholder: '采菊东篱下，悠然现南山',
    tagDeleteModal: {
      title: '提示',
      confirmText: '删除',
      cancelText: '取消',
      content: '删除标签?',
    },
    tagTitle:'标签',
    tagSuggestionTitle:'标签建议'
  },
  edit: {
    pageTitle_add: '记录新的想法',
    pageTitle_edit: '编辑Memo',
    placeHolder: '请输入...',
    send: '发送',
    previewRender: '语法渲染预览',
    rendering: '渲染中...'
  }
}

export const english = {
  language: 'en',
  common: {
    notSupport: 'Not support',
    loading: 'Loading...',
    refreshing: 'Refreshing...',
    wrong: 'something wrong!',
    changeLanguage: 'Language',
    languageList: ['中文', 'English'],
    memoCard: {
      d: ' days ago',
      h: ' hours ago',
      m: ' minutes ago',
      now: 'Now'
    }
  },
  welcom: {
    headTitle: 'Welcom Maimo👋',
    secondTitle: 'Collect the small pieces in your head.✨',
    dsc: 'Maimo is a WechatMiniProgram version of Github\'s open source project usememos/memos. Similarly, Maimo Rabithua/memos_wmp is also open source!',
    username: 'Username',
    usernamePlaceholder: 'XXX@XX.com',
    password: 'Password',
    passwordPlaceholder: 'password',
    button: 'SIGN IN/UP',
    webview: 'Open webview',
    signUpSuc: 'Sign up success!',
    usernameErr: 'Username error',
    passwordCheckErr: 'password length shoud > 6',
    passwordErr: 'password wrong',
    signInSuc: 'Sign In success',
    signUpTip: {
      title: 'Tips',
      confirmText: 'OK',
      cancelText: 'Cancel',
      content: 'The account does not exist. Register directly?',
    },
    shareMsg: {
      title: 'Memo',
    }
  },
  home: {
    state: {
      online: 'Online',
      offline: 'Offline'
    },
    edit: 'Editing...',
    newMemoPlaceholder: 'Record something interesting~',
    editErr: 'Content cannot be empty.',
    editChanged: 'Changed',
    send: 'Send',
    noMemos: 'There is no memos~',
    reachBottom: 'That\'s all',
    pinned: 'Pinned',
    unpinned: 'Unpinned',
    rowStatusChange: 'RowStatus Changed',
    visibilityChange: 'Visibility Changed',
    archived: 'Archived',
    deleted: 'Deleted',
    DeleteMemoModal: {
      title: 'Tips',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      content: 'Delete Memo?',
    },
    goWelcomModal: {
      title: 'Tips',
      confirmText: 'Switch',
      cancelText: 'Cancel',
      content: 'Switch accounts?',
    },
    sideBar: {
      memos: 'Memos',
      tags: 'Tags',
      mon: 'Mon',
      sun: 'Sun',
      memoVisibility: 'MemoVisibility',
      locale: 'Language',
      openWebview: 'Open Webview →',
      date_1: 'Registered for ',
      date_2: 'Days.',
      heatTipMemo: 'Memos'
    },
    Tips: {
      p_close:'(Long press no longer display)',
      title_1: 'Operation revision',
      p_1: 'New Memos are now triggered by side swipe gestures👇',
      p_4:'On the Search page, you can long press to delete the Tag (it will appear in the Tag suggestion after deletion)🤸‍♂️',
      title_2: 'Feature update',
      p_2: 'Added Tag suggestions on the Search page, which supports creating Tags from suggestions✨',
      p_3:'Automatic caching when creating or editing a memo, my mother will never worry about losing my half-written essay✌'
    }
  },
  search: {
    inputPlaceHolder: 'Search by content...',
    cantEmpty: 'Cannot be empty.',
    nothing: 'There is nothing 🕸',
    searchResultPlaceholder: 'All rivers run into sea.',
    tagDeleteModal: {
      title: 'Tips',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      content: 'Delete Tag?',
    },
    tagTitle:'Tags',
    tagSuggestionTitle:'Tags suggestion'
  },
  edit: {
    pageTitle_add: 'New Memo',
    pageTitle_edit: 'Edit Memo',
    placeHolder: 'Here input...',
    send: 'Send',
    previewRender: 'Render preview',
    rendering: 'Rendering...'
  }
}