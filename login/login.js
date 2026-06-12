// 登录页面
const app = getApp();
const { userApi } = require('../../utils/api');

Page({
  data: {
    username: '',
    password: '',
    role: 'COUNSELOR'
  },

  // 输入学号
  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  // 输入密码
  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  // 选择角色
  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ role });
  },

  // 登录
  async onLogin() {
    const { username, password, role } = this.data;

    // 验证输入
    if (!username.trim()) {
      wx.showToast({ title: '请输入学号/工号', icon: 'none' });
      return;
    }
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    try {
      // 调用后端登录API
      console.log('开始登录，用户名:', username, '密码:', password);
      const res = await userApi.login({ username, password });
      
      console.log('登录响应类型:', typeof res);
      console.log('登录响应:', JSON.stringify(res));
      
      // 检查响应数据结构
      const hasData = res && res.data && res.data.user && res.data.token;
      console.log('是否有完整数据:', hasData);
      
      if (hasData) {
        const userInfo = res.data.user;
        const token = res.data.token;
        
        // 设置全局用户信息和token
        app.globalData.userInfo = userInfo;
        app.globalData.token = token;
        app.globalData.currentRole = userInfo.role;
        
        wx.hideLoading();
        wx.showToast({ title: '登录成功', icon: 'success' });

        // 根据用户实际角色跳转到对应页面
        setTimeout(() => {
          this.redirectToRolePage(userInfo.role);
        }, 1500);
      } else {
        wx.hideLoading();
        console.log('登录失败：响应数据不完整');
        wx.showToast({ title: '登录失败', icon: 'none' });
      }

    } catch (error) {
      wx.hideLoading();
      console.error('登录异常:', error);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  },

  // 根据角色跳转页面
  redirectToRolePage(role) {
    switch (role) {
      case 'COUNSELOR':
        wx.redirectTo({ url: '/pages/counselor/duty/duty' });
        break;
      case 'COLLEGE':
        wx.redirectTo({ url: '/pages/college/duty/duty' });
        break;
      case 'ADMIN':
        wx.redirectTo({ url: '/pages/admin/duty/duty' });
        break;
      default:
        wx.redirectTo({ url: '/pages/counselor/duty/duty' });
    }
  }
});