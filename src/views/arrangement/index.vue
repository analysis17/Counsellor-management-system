<template>
  <div class="arrangement-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">值班安排表</h1>
    </div>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-select v-model="selectedMonth" class="month-select" placeholder="选择月份">
        <el-option 
          v-for="month in monthOptions" 
          :key="month.value" 
          :label="month.label" 
          :value="month.value"
        />
      </el-select>
      <el-input 
        v-model="searchKeyword" 
        class="search-input" 
        placeholder="请输入辅导员姓名/学号/工号关键词查询"
        @keyup.enter="loadDutyList"
      />
      <el-button @click="loadDutyList" class="search-btn">
        <el-icon><Search /></el-icon>
        查询
      </el-button>
      <div class="action-buttons">
        <el-button type="primary" @click="goToAddPage" class="add-btn">
          <el-icon><Plus /></el-icon>
          新增值班
        </el-button>
        <el-button @click="showImportModal = true" class="import-btn">
          <el-icon><Upload /></el-icon>
          导入值班表
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table :data="dutyList" stripe border style="width: 100%" :pagination="false">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="userId" label="学号/工号" width="120" />
        <el-table-column prop="collegeName" label="所在单位" width="150" />
        <el-table-column prop="campus" label="值班校区" width="100" />
        <el-table-column prop="location" label="值班住宿地址" width="200" />
        <el-table-column prop="dutyDate" label="值班日期" width="120" />
        <el-table-column prop="startTime" label="值班开始时间" width="140" />
        <el-table-column prop="endTime" label="值班结束时间" width="140" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="editDuty(row)" class="edit-btn">编辑</el-button>
            <el-button type="text" size="small" @click="deleteDuty(row)" class="delete-btn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <span class="total-text">共 {{ total }} 条</span>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增值班弹窗 -->
    <el-dialog title="新增值班安排" :visible.sync="showAddModal" width="500px">
      <el-form :model="addForm" label-width="120px" class="add-form">
        <el-form-item label="值班人员" required>
          <el-select v-model="addForm.userId" placeholder="请选择值班人员">
            <el-option 
              v-for="user in userList" 
              :key="user.id" 
              :label="user.name || user.username" 
              :value="user.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所在单位" required>
          <el-select v-model="addForm.collegeId" placeholder="请选择单位">
            <el-option 
              v-for="college in collegeList" 
              :key="college.id" 
              :label="college.name" 
              :value="college.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="值班日期" required>
          <el-date-picker
            v-model="addForm.dutyDate"
            type="date"
            placeholder="选择值班日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-time-picker
            v-model="addForm.startTime"
            placeholder="选择开始时间"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-time-picker
            v-model="addForm.endTime"
            placeholder="选择结束时间"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="值班地点">
          <el-input v-model="addForm.location" placeholder="请输入值班地点" />
        </el-form-item>
        <el-form-item label="值班校区">
          <el-select v-model="addForm.campus" placeholder="请选择校区">
            <el-option label="A校区" value="A校区" />
            <el-option label="B校区" value="B校区" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">提交</el-button>
      </div>
    </el-dialog>

    <!-- 导入值班表弹窗 -->
    <el-dialog title="导入值班表" :visible.sync="showImportModal" width="500px">
      <div class="import-modal">
        <div class="year-selector">
          <span class="year-label">2025年</span>
          <el-button @click="prevYear" class="year-nav-btn">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-button @click="nextYear" class="year-nav-btn">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="month-grid">
          <div 
            class="month-item" 
            v-for="month in importMonths" 
            :key="month.value"
            :class="{ active: month.hasData, selected: selectedMonth === month.value }"
            @click="selectMonth(month)"
          >
            <span class="month-number">{{ month.value }}月</span>
            <span class="month-status">{{ month.hasData ? '有值班' : '无值班' }}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showImportModal = false">取消</el-button>
        <el-button type="primary" @click="submitImport">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Upload, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { dutyApi, userApi, collegeApi } from '@/api'
import dayjs from 'dayjs'

export default {
  name: 'ArrangementPage',
  components: {
    Search,
    Plus,
    Upload,
    ArrowLeft,
    ArrowRight
  },
  setup() {
    const router = useRouter()
    
    // 查询条件
    const selectedMonth = ref(dayjs().format('YYYY-MM'))
    const searchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    const total = ref(0)
    
    // 数据列表
    const dutyList = ref([])
    const userList = ref([])
    const collegeList = ref([])
    
    // 弹窗状态
    const showAddModal = ref(false)
    const showImportModal = ref(false)
    
    // 表单数据
    const addForm = ref({
      userId: '',
      collegeId: '',
      dutyDate: '',
      startTime: '',
      endTime: '',
      location: '',
      campus: 'A校区'
    })

    // 月份选项
    const monthOptions = computed(() => {
      const options = []
      const now = dayjs()
      for (let i = -11; i <= 11; i++) {
        const date = now.add(i, 'month')
        options.push({
          label: date.format('YYYY年MM月'),
          value: date.format('YYYY-MM')
        })
      }
      return options
    })

    // 导入月份列表
    const importMonths = computed(() => {
      const months = []
      for (let i = 1; i <= 6; i++) {
        months.push({
          value: i,
          hasData: i === 2 || i === 5 // 模拟有数据的月份
        })
      }
      return months
    })

    const loadDutyList = async () => {
      try {
        const res = await dutyApi.getAll()
        let data = res.data || []
        
        // 月份筛选
        if (selectedMonth.value) {
          data = data.filter(d => d.dutyDate?.startsWith(selectedMonth.value.substring(0, 7)))
        }
        
        // 关键词搜索
        if (searchKeyword.value) {
          const keyword = searchKeyword.value.toLowerCase()
          data = data.filter(d => 
            (d.userName?.toLowerCase().includes(keyword)) ||
            (d.username?.toLowerCase().includes(keyword))
          )
        }
        
        total.value = data.length
        dutyList.value = data.slice(
          (currentPage.value - 1) * pageSize.value,
          currentPage.value * pageSize.value
        )
      } catch (error) {
        console.error('加载值班列表失败', error)
      }
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      loadDutyList()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      loadDutyList()
    }

    const editDuty = (row) => {
      router.push(`/arrangement/add?id=${row.id}`)
    }

    const deleteDuty = async (row) => {
      try {
        await ElMessageBox.confirm('确认删除此值班安排？', '提示', {
          type: 'warning'
        })
        await dutyApi.delete(row.id)
        ElMessage.success('删除成功')
        loadDutyList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败', error)
        }
      }
    }

    const loadUserList = async () => {
      try {
        const res = await userApi.list()
        userList.value = res.data || []
      } catch (error) {
        console.error('加载用户列表失败', error)
      }
    }

    const loadCollegeList = async () => {
      try {
        const res = await collegeApi.list()
        collegeList.value = res.data || []
      } catch (error) {
        console.error('加载学院列表失败', error)
      }
    }

    const goToAddPage = () => {
      router.push('/arrangement/add')
    }

    const submitAdd = async () => {
      if (!addForm.value.userId || !addForm.value.collegeId || !addForm.value.dutyDate) {
        ElMessage.warning('请填写必填项')
        return
      }
      
      try {
        await dutyApi.add({
          userId: addForm.value.userId,
          collegeId: addForm.value.collegeId,
          dutyDate: addForm.value.dutyDate,
          startTime: addForm.value.startTime || '08:00:00',
          endTime: addForm.value.endTime || '12:00:00',
          location: addForm.value.location || '学生服务中心101',
          remark: ''
        })
        ElMessage.success('新增成功')
        showAddModal.value = false
        addForm.value = {
          userId: '',
          collegeId: '',
          dutyDate: '',
          startTime: '',
          endTime: '',
          location: '',
          campus: 'A校区'
        }
        loadDutyList()
      } catch (error) {
        ElMessage.error('新增失败')
      }
    }

    const selectMonth = (month) => {
      selectedMonth.value = `2025-${String(month.value).padStart(2, '0')}`
    }

    const submitImport = () => {
      ElMessage.success('导入成功')
      showImportModal.value = false
      loadDutyList()
    }

    const prevYear = () => {
      ElMessage.info('上一年')
    }

    const nextYear = () => {
      ElMessage.info('下一年')
    }

    onMounted(() => {
      loadDutyList()
      loadUserList()
      loadCollegeList()
    })

    return {
      selectedMonth,
      searchKeyword,
      currentPage,
      pageSize,
      total,
      dutyList,
      userList,
      collegeList,
      showAddModal,
      showImportModal,
      addForm,
      monthOptions,
      importMonths,
      loadDutyList,
      handleSizeChange,
      handleCurrentChange,
      editDuty,
      deleteDuty,
      goToAddPage,
      submitAdd,
      selectMonth,
      submitImport,
      prevYear,
      nextYear
    }
  }
}
</script>

<style scoped>
.arrangement-page {
  min-height: 100%;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.action-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.month-select {
  width: 160px;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.search-btn {
  padding: 8px 20px;
}

.action-buttons {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.add-btn, .import-btn {
  padding: 8px 20px;
}

.add-btn {
  background-color: #B81F24;
  border-color: #B81F24;
}

.add-btn:hover {
  background-color: #8B0000;
  border-color: #8B0000;
}

.table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.el-table {
  font-size: 13px;
}

.edit-btn {
  color: #409EFF;
}

.delete-btn {
  color: #F56C6C;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.total-text {
  font-size: 14px;
  color: #666;
}

.add-form {
  padding: 20px 0;
}

.import-modal {
  padding: 20px 0;
}

.year-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.year-label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.year-nav-btn {
  padding: 4px 12px;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.month-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.month-item:hover {
  background-color: #e8e8e8;
}

.month-item.active {
  background-color: #fff;
  border: 2px solid #B81F24;
}

.month-item.selected {
  background-color: #B81F24;
  color: #fff;
}

.month-number {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.month-status {
  font-size: 12px;
  color: #999;
}

.month-item.selected .month-status {
  color: rgba(255, 255, 255, 0.8);
}
</style>
