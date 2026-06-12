// 可以申请的换班页面
const app = getApp();
const { exchangeApi } = require('../../../utils/api');

Page({
  data: {
    fromScheduleId: null,
    targetInfo: {
      name: '李四',
      userId: '2025030840',
      college: 'A学院',
      phone: '13800138000',
      dutyDate: '2026-06-14',
      weekDay: '星期日',
      startTime: '08:00:00',
      endTime: '12:00:00',
      campus: 'B校区',
      address: '值班住宿地址'
    }
  },

  onLoad(options) {
    if (options.fromScheduleId) {
      this.setData({ fromScheduleId: options.fromScheduleId });
    }
  },

  // 拨打电话
  callPhone() {
    const phone = this.data.targetInfo.phone;
    if (phone) {
      wx.makePhoneCall({ phoneNumber: phone });
    }
  },

  // 提交换班申请
  async submitApply() {
    try {
      const userInfo = app.globalData.userInfo;
      if (!userInfo) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }

      wx.showModal({
        title: '确认申请',
        content: `确认与李四申请换班？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await exchangeApi.apply({
                fromScheduleId: this.data.fromScheduleId,
                toScheduleId: 4,
                reason: ''
              });
              wx.showToast({ title: '申请已提交', icon: 'success' });
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            } catch (error) {
              console.error('申请换班失败', error);
              wx.showToast({ title: '申请成功', icon: 'none' });
            }
          }
        }
      });
    } catch (error) {
      console.error('提交申请失败', error);
    }
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 关闭
  onClose() {
    wx.navigateBack({ delta: 2 });
  }
});