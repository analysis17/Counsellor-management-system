// 辅导员值班安排页面
const app = getApp();
const { dutyApi } = require('../../../utils/api');

Page({
  data: {
    dutyList: []
  },

  onLoad() {
    this.loadDutyList();
  },

  onShow() {
    this.loadDutyList();
  },

  // 获取星期几
  getWeekDay(dateStr) {
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date = new Date(dateStr);
    return weekDays[date.getDay()];
  },

  // 判断值班状态
  getDutyStatus(startTime, endTime, dutyDate) {
    const now = new Date();
    const start = new Date(dutyDate + ' ' + startTime);
    const end = new Date(dutyDate + ' ' + endTime);
    
    if (now >= start && now <= end) {
      return 'onDuty';
    } else if (now < start) {
      return 'pending';
    } else {
      return 'ended';
    }
  },

  // 加载值班列表
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

      const res = await dutyApi.getByUserId(userInfo.id);
      const dutyList = res.data.map(item => ({
        ...item,
        weekDay: this.getWeekDay(item.dutyDate),
        type: '工作日值班',
        campus: item.location && item.location.includes('A校区') ? 'A校区' : 'B校区',
        address: '值班住宿地址',
        status: this.getDutyStatus(item.startTime, item.endTime, item.dutyDate)
      }));

      this.setData({ dutyList });
    } catch (error) {
      console.error('加载值班列表失败', error);
      // 网络错误时显示空列表
      this.setData({ dutyList: [] });
    }
  },

  // 申请换班
  applyExchange(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/counselor/apply-exchange/apply-exchange?fromScheduleId=' + item.id
    });
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 关闭
  onClose() {
    wx.navigateBack({ delta: 2 });
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
