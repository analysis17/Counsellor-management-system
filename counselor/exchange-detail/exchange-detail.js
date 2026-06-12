// 换班申请详情页面
const app = getApp();
const { exchangeApi } = require('../../../utils/api');

Page({
  data: {
    applicantInfo: {},
    applyInfo: {
      startTime: '2025-03-08 09:40:00',
      endTime: '2025-03-09 09:40:00',
      campus: 'A校区',
      location: '学生活动中心3层东辅辅导员发展中心',
      address: '值班住宿地址',
      reason: '你好，最近我家里有点急事，可能需要在调整一下工作安排，我实在没办法按时值班。我知道这可能会给你带来一些不便，但你平时工作认真负责，我想问问你能不能帮我代一下这个班？'
    }
  },

  onLoad(options) {
    // 获取申请人信息
    this.loadApplicantInfo();
  },

  // 加载申请人信息
  async loadApplicantInfo() {
    try {
      // 模拟数据
      this.setData({
        applicantInfo: {
          name: '王晓璐',
          username: '2025030840',
          college: 'A学院',
          phone: '13800138000'
        }
      });
    } catch (error) {
      console.error('加载申请人信息失败', error);
    }
  },

  // 拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.applicantInfo.phone || '13800138000'
    });
  },

  // 同意换班
  agreeExchange() {
    wx.showModal({
      title: '确认同意换班',
      content: '确定要同意此次换班申请吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 模拟同意换班
            wx.showToast({
              title: '换班成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } catch (error) {
            console.error('同意换班失败', error);
          }
        }
      }
    });
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
