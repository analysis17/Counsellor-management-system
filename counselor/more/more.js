// 辅导员更多功能页面
const app = getApp();

Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    this.setData({ userInfo: app.globalData.userInfo || {} });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 关闭
  onClose() {
    wx.navigateBack({ delta: 2 });
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出登录？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userInfo = null;
          wx.removeStorageSync('token');
          wx.redirectTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  // 跳转到角色切换页面
  goToRole() {
    wx.navigateTo({
      url: '/pages/counselor/role/role'
    });
  },

  // 跳转到值班历史页面
  goToHistory() {
    wx.navigateTo({
      url: '/pages/counselor/history/history'
    });
  },

  // 跳转到设置页面
  goToSettings() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none'
    });
  },

  // 跳转到关于页面
  goToAbout() {
    wx.showToast({
      title: '版本 1.0.0',
      icon: 'none'
    });
  },

  // 跳转到值班安排页面
  goToDuty() {
    wx.redirectTo({
      url: '/pages/counselor/duty/duty'
    });
  },

  // 跳转到换班申请页面
  goToExchange() {
    wx.redirectTo({
      url: '/pages/counselor/exchange/exchange'
    });
  },

  // 跳转到更多功能页面
  goToMore() {
    // 当前页面
  }
});
