// 管理员值班情况页面
const app = getApp();
const { dutyApi } = require('../../../utils/api');

Page({
  data: {
    currentDate: '2026-06-12',
    displayDate: '',
    campusName: 'A校区',
    dutyList: []
  },

  onLoad() {
    this.updateDisplayDate();
    this.loadDutyList();
  },

  // 更新显示日期
  updateDisplayDate() {
    const date = new Date(this.data.currentDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.setData({
      displayDate: `${year}年${month}月${day}日`
    });
  },

  // 前一天
  prevDay() {
    const date = new Date(this.data.currentDate);
    date.setDate(date.getDate() - 1);
    const dateStr = this.formatDate(date);
    this.setData({ currentDate: dateStr });
    this.updateDisplayDate();
    this.loadDutyList();
  },

  // 后一天
  nextDay() {
    const date = new Date(this.data.currentDate);
    date.setDate(date.getDate() + 1);
    const dateStr = this.formatDate(date);
    this.setData({ currentDate: dateStr });
    this.updateDisplayDate();
    this.loadDutyList();
  },

  // 加载值班列表（按日期查询并过滤当前学院）
  async loadDutyList() {
    try {
      const userInfo = app.globalData.userInfo;
      if (!userInfo) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }

      const collegeId = userInfo.collegeId || 1;
      const dateStr = this.data.currentDate;

      // 按日期获取值班列表
      const res = await dutyApi.getByDate(dateStr);
      
      // 过滤当前学院并格式化
      const dutyList = (res.data || [])
        .filter(item => item.collegeId == collegeId)
        .map(item => ({
          id: item.id,
          userId: item.userId,
          userName: item.userName || '未知',
          phone: item.phone,
          startTime: item.startTime,
          endTime: item.endTime,
          campus: item.location && item.location.includes('A校区') ? 'A校区' : 'B校区',
          location: item.location,
          address: '值班住宿地址'
        }));

      this.setData({ dutyList });
    } catch (error) {
      console.error('加载值班列表失败', error);
      this.setData({ dutyList: [] });
    }
  },

  // 格式化日期为 yyyy-MM-dd
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 拨打电话
  callPhone(e) {
    const phone = e.currentTarget.dataset.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      });
    }
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 关闭
  onClose() {
    wx.navigateBack({ delta: 2 });
  },

  // 跳转到协助换班页面
  goToAssist() {
    wx.navigateTo({
      url: '/pages/admin/assist/assist'
    });
  },

  // 跳转到更多功能页面
  goToMore() {
    wx.navigateTo({
      url: '/pages/admin/more/more'
    });
  }
});