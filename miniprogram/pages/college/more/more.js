// 学院更多功能页面
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
      url: '/pages/college/role/role'
    });
  },

  goToDuty() {
    wx.redirectTo({
      url: '/pages/college/duty/duty'
    });
  }
});