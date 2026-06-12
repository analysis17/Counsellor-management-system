// 辅导员换班申请页面
const app = getApp();
const { exchangeApi } = require('../../../utils/api');

Page({
  data: {
    counselorList: [],
    mockRequest: null
  },

  onLoad() {
    this.loadExchangeRequests();
  },

  onShow() {
    this.loadExchangeRequests();
  },

  // 加载换班申请列表（其他人向我发起的申请）
  async loadExchangeRequests() {
    try {
      const userInfo = app.globalData.userInfo;
      if (!userInfo) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }

      // 如果是counselor2，前端添加张三的换班申请
      if (userInfo.id == 6) {
        this.setData({
          mockRequest: {
            id: 999,
            applicantName: '张三',
            applicantId: '2025030999',
            college: 'A学院',
            dutyDate: '2026-06-13',
            weekDay: '星期六',
            startTime: '08:00:00',
            endTime: '12:00:00',
            campus: 'B校区',
            location: '学生服务中心101',
            status: 'pending'
          }
        });
      }

      // 调用后端API获取待处理的换班申请
      const res = await exchangeApi.getPending(userInfo.id);
      if (res.code === 200 && res.data) {
        this.setData({ counselorList: res.data });
      } else {
        this.setData({ counselorList: [] });
      }
    } catch (error) {
      console.error('加载换班申请失败', error);
      this.setData({ counselorList: [] });
    }
  },

  // 同意换班
  agreeExchange() {
    const mockRequest = this.data.mockRequest;
    if (mockRequest && mockRequest.status === 'pending') {
      mockRequest.status = 'agreed';
      this.setData({ mockRequest });
      wx.showToast({ title: '已同意换班', icon: 'success' });
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
    wx.redirectTo({
      url: '/pages/counselor/more/more'
    });
  }
});
