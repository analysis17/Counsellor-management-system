// API请求工具类
const app = getApp();

/**
 * 封装请求方法
 */
function request(url, method, data) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    wx.request({
      url: app.globalData.baseUrl + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (app.globalData.token || '')
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

/**
 * GET请求
 */
function get(url, data) {
  return request(url, 'GET', data);
}

/**
 * POST请求
 */
function post(url, data) {
  return request(url, 'POST', data);
}

/**
 * PUT请求
 */
function put(url, data) {
  return request(url, 'PUT', data);
}

/**
 * DELETE请求
 */
function del(url, data) {
  return request(url, 'DELETE', data);
}

/**
 * 格式化日期
 */
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 */
function formatTime(time) {
  if (typeof time === 'string') {
    return time.substring(0, 5);
  }
  const d = new Date(time);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateTime) {
  const d = new Date(dateTime);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  formatDate,
  formatTime,
  formatDateTime
};