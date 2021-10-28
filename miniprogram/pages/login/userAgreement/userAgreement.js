Page({
  data: {
    userClause: [
      {
        title: '小程序所有权；对使用条款的同意',
        content: '本使用条款和条件(“使用条款”)适用于本应用，使用本应用，即表示你同意本使用条款；如果你不同意，请勿使用本应用。<br>小程序开发者（下文统称为“我”）有权随时自行决定更改、修改、添加或删除本使用条款的部分内容。你有责任定期检查本使用条款，以了解是否发生了更改。如果你在更改发布后继续使用本网站，即表示你接受并同意这些更改。只要你遵守本使用条款，本人即授予你个人、非排他性、不可转让、有限的权利进入和使用本应用。',
        open: true,
        animation: ''
      },{
        title: '内容',
        content: '本应用上包含的所有文字、图片、用户界面、可视化界面、照片、和计算机代码 (统称“内容”)，包括但不限于此类内容的设计、结构、选择、搭配、表达、外观、风格以及排列形式，均由本人所有、控制或授权。',
        open: true,
        animation: ''
      }
    ],
    privacyClause: [
      {
        title: '什么是你的个人数据',
        content: '我坚信并尊重基本隐私权，并认为这些基本权利不应因你生活的国家和地区而有所不同。这正是我将任何与已识别或可识别的个人相关的数据或已与本应用或可与之关联的数据视为“个人数据”(无论相关个人所居何处) 的原因。这意味着可通过其直接识别你身份的数据 (如你的姓名) 即为个人数据，同时，不能通过其直接识别你的身份但可通过合理推断间接识别你的身份的数据 (如你的设备的序列号) 也是个人数据。就本隐私政策而言，汇总数据被视为非个人数据。',
        open: true,
        animation: ''
      },{
        title: '对个人数据的使用',
        content: '本应用会出于以下目的使用个人数据：为服务提供支持、与你沟通、实施安全以及遵守法律。我也可能在经你同意的情况下将个人数据用于其他用途。<br>本应用仅在有合法的法律依据的情况下才使用你的个人数据。',
        open: true,
        animation: ''
      },{
        title: '从你那里收集的个人数据',
        content: '我相信能够为你提供优秀的产品和良好的隐私。这意味着我将努力只收集需要的个人数据。收集的个人数据取决于你与本应用的互动方式。我可能会收集各种信息，包括：<br><b>账号信息：</b>你的微信和相关账号详细信息，包括微信头像已经昵称。<br><b>设备信息：</b>可用于识别你的设备的数据 (如操作系统类型等)。<br><b>位置信息：</b>精确位置和大致位置 (仅用于显示天气功能) 。<br><b>使用数据：</b>有关你在产品上的活动和产品使用的数据，例如服务内的小程序启动数据，包括浏览历史记录、产品交互、崩溃数据、性能和其他诊断数据以及其他使用数据',
        open: true,
        animation: ''
      },{
        title: '你在本应用的隐私权',
        content: '我尊重你获知、访问、更正、传输、限制处理和删除你的个人数据的能力。本应用不会出售，监控，扫描你的数据，也不会使用你的个人数据',
        open: true,
        animation: ''
      },{
        title: '对个人数据的保护',
        content: '相信良好的隐私基于高度的安全性。我使用管理性、技术性和物理性保护措施来保护你的个人数据，同时将个人数据的性质、数据的处理以及面临的威胁纳入考虑。我一直在持续改进这些保护措施，以确保你的个人数据始终安全。',
        open: true,
        animation: ''
      }
    ],
  },
  openItem (e) {
    const index = e.currentTarget.dataset.index;
    const listName = e.currentTarget.dataset.listName;
    const targetItem = listName + '[' + index + '].open';
    const value = this.data[listName][index].open
    this.setData({
      [targetItem]: !value
    })
  },
  onShareAppMessage() {
    return {
      title: '看看我们的小日子',
      path: '/pages/index/index',
      imageUrl: '../../../images/shareApp.png'
    }
  },
})