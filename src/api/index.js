import request from '@/utils/request'

// 用户相关接口
export const userApi = {
  login: (data) => request.post('/auth/login', data),
  getCurrentUser: () => request.get('/auth/current'),
  list: () => request.get('/user/list'),
  getUserList: () => request.get('/user/list'),
  getCounselors: () => request.get('/user/counselors'),
  add: (data) => request.post('/user/add', data),
  addUser: (data) => request.post('/user/add', data),
  update: (data) => request.put('/user/update', data),
  updateUser: (data) => request.put('/user/update', data),
  delete: (id) => request.delete(`/user/${id}`)
}

// 值班安排相关接口
export const dutyApi = {
  getByUserId: (userId) => request.get(`/duty/user/${userId}`),
  getByCollegeId: (collegeId) => request.get(`/duty/college/${collegeId}`),
  getByDate: (date) => request.get(`/duty/date/${date}`),
  getAll: () => request.get('/duty/all'),
  add: (data) => request.post('/duty/add', data),
  update: (data) => request.put('/duty/update', data),
  delete: (id) => request.delete(`/duty/${id}`),
  batchImport: (data) => request.post('/duty/import', data)
}

// 学院相关接口
export const collegeApi = {
  list: () => request.get('/college/list'),
  getList: () => request.get('/college/list')
}