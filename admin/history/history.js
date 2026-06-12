// 管理员换班历史页面
const app = getApp();

Page({
  data: {
    selectedRange: 0,
    timeRanges: [
      { label: '近一周', value: 'week' },
      { label: '近一个月', value: 'month' },
      { label: '近三个月', value: 'quarter' },
      { label: '近一年', value: 'year' }
    ],
    historyList: []
  },

  onLoad() {
    this.loadHistory();
  },

  // 加载历史记录
  async loadHistory() {
    try {
      // 张三6月13号的值班信息
      const mockData = [
        {
          id: 1,
          userName: '张三',
          userId: '2025030999',
          phone: '13800138001',
          dutyStartTime: '2026-06-13 08:00:00',
          dutyEndTime: '2026-06-13 12:00:00',
          campus: 'A校区',
          location: '学生服务中心101',
          address: '值班住宿地址',
          operationTime: '2026-06-12 10:30:00'
        }
      ];

      this.setData({ historyList: mockData });
    } catch (error) {
      console.error('加载历史记录失败', error);
    }
  },

  // 时间范围选择
  onRangeChange(e) {
    this.setData({ selectedRange: e.detail.value });
    this.loadHistory();
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

  onBack() {
    wx.navigateBack();
  },

  onClose() {
    wx.navigateBack({ delta: 2 });
  }
});