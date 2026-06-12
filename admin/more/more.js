// 管理员更多功能页面
Page({
  data: {},

  onLoad() {},

  onBack() {
    wx.navigateBack();
  },

  onClose() {
    wx.navigateBack({ delta: 2 });
  },

  goToRole() {
    wx.navigateTo({
      url: '/pages/admin/role/role'
    });
  },

  goToHistory() {
    wx.navigateTo({
      url: '/pages/admin/history/history'
    });
  },

  goToDuty() {
    wx.redirectTo({
      url: '/pages/admin/duty/duty'
    });
  },

  goToAssist() {
    wx.redirectTo({
      url: '/pages/admin/assist/assist'
    });
  }
});