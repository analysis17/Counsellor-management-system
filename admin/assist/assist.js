// 管理员协助换班页面
const app = getApp();
const { dutyApi } = require('../../../utils/api');

Page({
  data: {
    keyword: '',
    counselorList: [],
    showModalId: null,
    exchangedIds: [] // 记录已换班的ID
  },

  onLoad() {
    this.loadCounselorList();
  },

  // 加载辅导员列表
  async loadCounselorList() {
    try {
      // 删除王晓璐，添加张三的值班信息
      const mockData = [
        {
          id: 3,
          name: '张三',
          username: '2025030999',
          college: 'A学院',
          phone: '13800138001',
          nextDuty: {
            startTime: '2026-06-13 08:00:00',
            endTime: '2026-06-13 12:00:00',
            campus: 'A校区',
            location: '学生服务中心101',
            address: '值班住宿地址',
            status: '未开始'
          }
        }
      ];

      // 搜索过滤
      if (this.data.keyword) {
        const keyword = this.data.keyword.toLowerCase();
        const filtered = mockData.filter(item => 
          item.name.toLowerCase().includes(keyword) || 
          item.username.toLowerCase().includes(keyword)
        );
        this.setData({ counselorList: filtered });
      } else {
        this.setData({ counselorList: mockData });
      }
    } catch (error) {
      console.error('加载辅导员列表失败', error);
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
    this.loadCounselorList();
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

  // 显示换班弹窗并执行换班
  async showExchangeModal(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认换班',
      content: '确定要协助此辅导员换班吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 获取ID为3的值班信息
            const allDuties = await dutyApi.getAll();
            const duty3 = allDuties.data.find(d => d.id === 3);
            const duty6 = allDuties.data.find(d => d.id === 6);
            
            if (duty3 && duty6) {
              // 交换日期
              const tempDate = duty3.dutyDate;
              
              // 更新ID为3的值班日期为ID为6的日期（发送完整数据）
              await dutyApi.update({ 
                id: 3, 
                userId: duty3.userId,
                collegeId: duty3.collegeId,
                dutyDate: duty6.dutyDate,
                startTime: duty3.startTime,
                endTime: duty3.endTime,
                location: duty3.location
              });
              
              // 更新ID为6的值班日期为原来ID为3的日期（发送完整数据）
              await dutyApi.update({ 
                id: 6, 
                userId: duty6.userId,
                collegeId: duty6.collegeId,
                dutyDate: tempDate,
                startTime: duty6.startTime,
                endTime: duty6.endTime,
                location: duty6.location
              });
              
              // 将此辅导员标记为已换班
              const newExchangedIds = [...this.data.exchangedIds, id];
              this.setData({ exchangedIds: newExchangedIds });
              
              wx.showToast({
                title: '换班成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: '换班失败，未找到对应的值班记录',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('换班失败', error);
            wx.showToast({
              title: '换班失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onClose() {
    wx.navigateBack({ delta: 2 });
  },

  goToDuty() {
    wx.redirectTo({
      url: '/pages/admin/duty/duty'
    });
  },

  goToMore() {
    wx.redirectTo({
      url: '/pages/admin/more/more'
    });
  }
});