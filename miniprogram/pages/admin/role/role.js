// 管理员角色切换页面
const app = getApp();
const { userApi } = require('../../../utils/api');

Page({
  data: {
    currentRole: 'ADMIN'
  },

  onLoad() {
    this.setData({
      currentRole: app.globalData.role
    });
  },

  async switchRole(e) {
    const role = e.currentTarget.dataset.role;
    if (role === this.data.currentRole) {
      return;
    }

    try {
      await userApi.switchRole(role);
      app.switchRole(role);
      this.setData({ currentRole: role });

      wx.showToast({
        title: '角色切换成功',
        icon: 'success'
      });

      setTimeout(() => {
        if (role === 'COUNSELOR') {
          wx.redirectTo({
            url: '/pages/counselor/duty/duty'
          });
        } else if (role === 'COLLEGE') {
          wx.redirectTo({
            url: '/pages/college/duty/duty'
          });
        } else if (role === 'ADMIN') {
          wx.redirectTo({
            url: '/pages/admin/duty/duty'
          });
        }
      }, 1500);
    } catch (error) {
      console.error('切换角色失败', error);
    }
  },

  onBack() {
    wx.navigateBack();
  },

  onClose() {
    wx.navigateBack({ delta: 2 });
  }
});