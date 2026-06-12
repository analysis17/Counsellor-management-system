App({
  globalData: {
    userInfo: null,
    token: null,
    role: 'COUNSELOR',
    baseUrl: 'http://localhost:8080/api'
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (token && userInfo) {
      this.globalData.token = token;
      this.globalData.userInfo = userInfo;
      this.globalData.role = userInfo.role || 'COUNSELOR';
    }
  },

  // 检查登录状态
  checkLogin() {
    return new Promise((resolve, reject) => {
      const token = this.globalData.token;
      if (token) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  },

  // 设置用户信息
  setUserInfo(userInfo, token) {
    this.globalData.userInfo = userInfo;
    this.globalData.token = token;
    this.globalData.role = userInfo.role || 'COUNSELOR';
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('token', token);
  },

  // 清除用户信息
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    this.globalData.role = 'COUNSELOR';
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
  },

  // 切换角色
  switchRole(role) {
    this.globalData.role = role;
    if (this.globalData.userInfo) {
      this.globalData.userInfo.role = role;
      wx.setStorageSync('userInfo', this.globalData.userInfo);
    }
  }
});