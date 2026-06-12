// 辅导员值班历史页面
const app = getApp();
const { dutyApi } = require('../../../utils/api');

Page({
  data: {
    selectedTime: '近一年',
    historyList: []
  },

  onLoad() {
    this.loadHistoryList();
  },

  // 获取星期几
  getWeekDay(dateStr) {
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date = new Date(dateStr);
    return weekDays[date.getDay()];
  },

  // 加载历史列表
  async loadHistoryList() {
    try {
      const userInfo = app.globalData.userInfo;
      if (!userInfo) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }

      // 调用后端API获取历史值班数据
      const res = await dutyApi.getHistoryByUserId(userInfo.id);
      if (res.code === 200 && res.data) {
        const historyList = res.data.map(item => ({
          id: item.id,
          dutyDate: item.dutyDate,
          weekDay: this.getWeekDay(item.dutyDate),
          type: '工作日值班',
          startTime: item.dutyDate + ' ' + item.startTime,
          endTime: item.dutyDate + ' ' + item.endTime,
          campus: 'A校区',
          location: item.location || '学生服务中心',
          address: '值班住宿地址',
          userName: item.userName,
          collegeName: item.collegeName
        }));
        this.setData({ historyList });
      } else {
        this.setData({ historyList: [] });
      }
    } catch (error) {
      console.error('加载值班历史失败', error);
      this.setData({ historyList: [] });
    }
  },

  // 显示时间选择器
  showTimePicker() {
    const options = ['近一周', '近一月', '近三月', '近一年'];
    wx.showActionSheet({
      itemList: options,
      success: (res) => {
        this.setData({ selectedTime: options[res.tapIndex] });
        this.loadHistoryList();
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
