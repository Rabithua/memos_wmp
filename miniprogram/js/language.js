export const chinese = {
  language: 'zh',
  common: {
    notSupport: '还未支持',
    loading: '加载中…',
    refreshing: '刷新中…',
    usernameNo: '邮箱被占用',
    wrong: '未知错误!',
    changeLanguage: '语言',
    languageList: ['中文', 'English'],
    thatIsAll: '就这么多了',
    memoCard: {
      d: '天前',
      h: '小时前',
      m: '分钟前',
      now: '刚刚发布'
    }
  },
  archived: {
    pageTitle: '已归档Memos🌒',
    nothing: '这是一片无人的荒原🪐'
  },
  resource: {
    pageTitle: '资源库 📂',
    nothing: '这是一片无人的荒原🪐',
    upload: '上传',
    load_1: '已加载',
    load_2: '个～',
    confirm: '确认',
    choosed_1: '已选择',
    choosed_2: '个',
    deleted: '已删除',
    deleteModal: {
      title: '警告',
      content_1: '当前资源已被',
      content_2: '个MEMO引用，删除会导致MEMO文件丢失！',
      cancel: '取消',
      confirm: '删除'
    }
  },
  explore: {
    pageTitle: '探索✨',
    nothing: '这是一片无人的荒原🪐'
  },
  memo: {
    share: "分享",
    unSee: "Memo不可见",
    visibility_1: '可见性为：',
    visibility_2: '（仅自己可见）',
    getting: '拉取数据'
  },
  welcom: {
    webVersion: '线上版本：',
    headTitle: '欢迎来到麦默',
    secondTitle: '把脑袋里的小碎片收集起来✨',
    dsc: '麦默是 Github 开源项目 usememos/memos 的小程序版本，同样的，麦默 Rabithua/memos_wmp 也是开源的！',
    username: '用户名',
    usernamePlaceholder: 'username',
    password: '密码',
    passwordAgain: '确认密码',
    passwordPlaceholder: 'password',
    btnLog: '登录',
    btnReg: '注册',
    explore: '探索 ✨',
    signUpSuc: '注册成功!',
    usernameErr: '用户名错误',
    passwordCheckErr: '密码长度需大于六位',
    loginCreErr: '登陆凭证错误',
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
    thatIsAll: '已全部加载~',
    edit: '编辑中…',
    newMemoPlaceholder: '记录有趣的想法~',
    editErr: '内容不能为空',
    editChanged: '已更改',
    send: '发送',
    noMemos: '采菊东篱下，悠然现南山',
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
      openResource: '资源库📁 →',
      openWebview: '探索✨ →',
      goarchived: '已归档🌒 →',
      goOthers: '更多小玩具💫 →',
      date_1: '注册于 ',
      date_2: '天前。',
      heatTipMemo: '条记录'
    },
    Tips: {
      p_close: '(长按不再显示)',
      title_1: '操作改版',
      p_1: '新建 Memos ，现在通过侧滑手势触发👇',
      p_4: 'Search 页面可以长按 Tag 删除（删除后会出现在 Tag 建议中）🤸‍♂️',
      title_2: '功能更新',
      p_2: 'Search 页面新增 Tag 建议，支持从建议创建 Tag✨',
      p_3: '新建或编辑 memo 时自动缓存，妈妈再也不会担心我写了一半的小作文丢失了✌',
      p_5: 'Search 页面memo卡片完整操作支持🎉',
      p_6: '归档页面，资源库页面可以上传图片或视频了🧩',
      p_7: '可以通过左侧的侧滑栏中的热点图直接跳转到搜索页面，检索对应日期的Memo🔎',
      p_8: '以及数不清的细节，懒得写了☺️'
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
    tagTitle: '标签',
    tagSuggestionTitle: '标签建议'
  },
  edit: {
    pageTitle_add: '记录新的想法',
    pageTitle_edit: '编辑Memo',
    placeHolder: '让回忆有迹可循...',
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
    usernameNo: 'userName is occupied',
    refreshing: 'Refreshing...',
    wrong: 'something wrong!',
    changeLanguage: 'Language',
    languageList: ['中文', 'English'],
    thatIsAll: 'That\'s all',
    memoCard: {
      d: ' days ago',
      h: ' hours ago',
      m: ' minutes ago',
      now: 'Now'
    }
  },
  archived: {
    pageTitle: 'Archived Memos🌒',
    nothing: "There's nothing here 🪐"
  },
  resource: {
    pageTitle: 'Resource📂',
    nothing: "There's nothing here 🪐",
    upload: 'Upload',
    load_1: 'Loaded ',
    load_2: ' files~',
    confirm: 'Confirm',
    choosed_1: 'Selected ',
    choosed_2: '',
    deleted: 'Deleted!',
    deleteModal: {
      title: 'Warning',
      content_1: 'The current resource has been referenced by ',
      content_2: ' MEMOs. Deleting it will cause the loss of the MEMO files!',
      cancel: 'Cancel',
      confirm: 'Delete'
    }
  },
  explore: {
    pageTitle: 'Explore✨',
    nothing: "There's nothing here 🪐"
  },
  memo: {
    share: "Share",
    unSee: "Memo is hidden",
    visibility_1: 'Visibility: ',
    visibility_2: '(Only visible to yourself)',
    getting: 'Getting'
  },
  welcom: {
    webVersion: 'WebVersion:',
    headTitle: 'Welcom Maimo',
    secondTitle: 'Collect the small pieces in your head.✨',
    dsc: 'Maimo is a WechatMiniProgram version of Github\'s open source project usememos/memos. Similarly, Maimo Rabithua/memos_wmp is also open source!',
    username: 'Username',
    usernamePlaceholder: 'username',
    password: 'Password',
    passwordAgain: 'password again',
    passwordPlaceholder: 'password',
    btnLog: 'logIn',
    btnReg: 'signUp',
    explore: 'Explore ✨',
    signUpSuc: 'Sign up success!',
    usernameErr: 'Username error',
    passwordCheckErr: 'password length shoud > 6',
    loginCreErr: 'Incorrect login credentials',
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
    thatIsAll: "That's all",
    edit: 'Editing...',
    newMemoPlaceholder: 'Record something interesting~',
    editErr: 'Content cannot be empty.',
    editChanged: 'Changed',
    send: 'Send',
    noMemos: 'No memo was found. Try swiping sideways to open and send a new one~',
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
      openResource: 'Resource📁 →',
      openWebview: 'Explore✨ →',
      goarchived: 'Archived🌒 →',
      goOthers: 'More interesting💫 →',
      date_1: 'Registered for ',
      date_2: 'Days.',
      heatTipMemo: 'Memos'
    },
    Tips: {
      p_close: '(Long press no longer display)',
      title_1: 'Operation revision',
      p_1: 'New Memos are now triggered by side swipe gestures👇',
      p_4: 'On the Search page, you can long press to delete the Tag (it will appear in the Tag suggestion after deletion)🤸‍♂️',
      title_2: 'Feature update',
      p_2: 'Added Tag suggestions on the Search page, which supports creating Tags from suggestions✨',
      p_3: 'Automatic caching when creating or editing a memo, my mother will never worry about losing my half-written essay✌',
      p_5: 'Search page memo card complete operation support🎉',
      p_6: 'Archived page and Resources page can now upload pictures or videos 🧩',
      p_7: 'You can directly jump to the search page through the hotspot image in the left sliding menu to search for the corresponding date\'s Memo 🔎',
      p_8: 'And countless details that I\'m too lazy to write about ☺️'
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
    tagTitle: 'Tags',
    tagSuggestionTitle: 'Tags suggestion'
  },
  edit: {
    pageTitle_add: 'New Memo',
    pageTitle_edit: 'Edit Memo',
    placeHolder: 'Record a good day...',
    send: 'Send',
    previewRender: 'Render preview',
    rendering: 'Rendering...'
  }
}