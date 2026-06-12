// API接口定义
const { get, post, put, del } = require('./request');

// 用户相关接口
const userApi = {
  login: (data) => post('/auth/login', data),
  getCurrentUser: () => get('/auth/current'),
  switchRole: (role) => post('/auth/switch-role?role=' + role),
  getUserList: () => get('/user/list'),
  getCounselors: () => get('/user/counselors'),
  addUser: (data) => post('/user/add', data),
  updateUser: (data) => put('/user/update', data),
  deleteUser: (id) => del('/user/' + id)
};

// 值班安排相关接口
const dutyApi = {
  getByUserId: (userId) => get('/duty/user/' + userId),
  getHistoryByUserId: (userId) => get('/duty/history/' + userId),
  getByCollegeId: (collegeId) => get('/duty/college/' + collegeId),
  getByDate: (date) => get('/duty/date/' + date),
  getAll: () => get('/duty/all'),
  add: (data) => post('/duty/add', data),
  update: (data) => put('/duty/update', data),
  delete: (id) => del('/duty/' + id),
  batchImport: (data) => post('/duty/import', data),
  search: (keyword, userId) => get('/duty/search', { keyword, userId })
};

// 换班申请相关接口
const exchangeApi = {
  getPending: (userId) => get('/exchange/pending/' + userId),
  getAccepted: () => get('/exchange/accepted'),
  apply: (data) => post('/exchange/apply', data),
  accept: (id) => post('/exchange/accept/' + id),
  reject: (id) => post('/exchange/reject/' + id),
  approve: (id) => post('/exchange/approve/' + id),
  getHistory: (userId) => get('/exchange/history/' + userId)
};

// 学院相关接口
const collegeApi = {
  getList: () => get('/college/list')
};

module.exports = {
  userApi,
  dutyApi,
  exchangeApi,
  collegeApi
};