// 辅导员角色切换页面
const app = getApp();

Page({
  data: {
    currentRole: 'counselor'
  },

  onLoad() {
    const role = app.globalData.currentRole || 'counselor';
    this.setData({ currentRole: role });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 关闭
  onClose() {
    wx.navigateBack({ delta: 2 });
  },

  // 选择角色
  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ currentRole: role });
    app.globalData.currentRole = role;

    wx.showToast({
      title: '角色切换成功',
      icon: 'success'
    });

    // 根据角色跳转到对应页面
    setTimeout(() => {
      if (role === 'counselor') {
        wx.redirectTo({
          url: '/pages/counselor/duty/duty'
        });
      } else if (role === 'college') {
        wx.redirectTo({
          url: '/pages/college/duty/duty'
        });
      } else if (role === 'admin') {
        wx.redirectTo({
          url: '/pages/admin/duty/duty'
        });
      }
    }, 1000);
  }
});
