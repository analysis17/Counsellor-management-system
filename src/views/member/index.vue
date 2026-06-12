<template>
  <div class="member-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">值班成员</h1>
    </div>
    
    <!-- 操作栏 -->
    <div class="action-bar">
      <el-select v-model="collegeFilter" class="filter-select" placeholder="请选择所在单位">
        <el-option label="全部单位" value="" />
        <el-option label="计算机学院" value="计算机学院" />
        <el-option label="机械学院" value="机械学院" />
        <el-option label="电子学院" value="电子学院" />
        <el-option label="经济学院" value="经济学院" />
      </el-select>
      <el-select v-model="typeFilter" class="filter-select" placeholder="请选择辅导员类型">
        <el-option label="全部类型" value="" />
        <el-option label="专职辅导员" value="专职辅导员" />
        <el-option label="兼职辅导员" value="兼职辅导员" />
      </el-select>
      <el-select v-model="statusFilter" class="filter-select" placeholder="请选择岗位状态">
        <el-option label="全部状态" value="" />
        <el-option label="在岗" value="在岗" />
        <el-option label="休假" value="休假" />
        <el-option label="离职" value="离职" />
      </el-select>
      <el-input 
        v-model="searchKeyword" 
        class="search-input" 
        placeholder="请输入辅导员姓名/学号/工号关键词查询"
        @keyup.enter="loadMemberList"
      />
      <el-button @click="loadMemberList" class="search-btn">
        <el-icon><Search /></el-icon>
        查询
      </el-button>
      <div class="action-buttons">
        <el-button type="primary" @click="goToAddPage" class="add-btn">
          <el-icon><Plus /></el-icon>
          添加辅导员
        </el-button>
        <el-button @click="showImportModal = true" class="import-btn">
          <el-icon><Upload /></el-icon>
          导出名单
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <el-table :data="memberList" stripe border style="width: 100%" :pagination="false">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="辅导员姓名" width="120" />
        <el-table-column prop="username" label="学号/工号" width="120" />
        <el-table-column prop="position" label="辅导员职务" width="120" />
        <el-table-column prop="type" label="辅导员类型" width="120" />
        <el-table-column prop="jobStatus" label="岗位状态" width="100">
          <template #default="{ row }">
            <span :class="getJobStatusClass(row.jobStatus)">{{ row.jobStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="systemRole" label="系统角色" width="120" />
        <el-table-column prop="scope" label="管辖范围" width="100" />
        <el-table-column prop="approvalStatus" label="审批状态" width="100">
          <template #default="{ row }">
            <span :class="getApprovalClass(row.approvalStatus)">
              <span class="status-dot"></span>
              {{ row.approvalStatus }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewMember(row)" class="view-btn">查看信息</el-button>
            <el-button type="text" size="small" @click="showMore(row)" class="more-btn">更多</el-button>
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

    <!-- 添加辅导员弹窗 -->
    <el-dialog title="添加辅导员" :visible.sync="showAddModal" width="500px">
      <el-form :model="addForm" label-width="120px" class="add-form">
        <el-form-item label="辅导员姓名">
          <el-input v-model="addForm.name" placeholder="请输入辅导员姓名" />
        </el-form-item>
        <el-form-item label="学号/工号">
          <el-input v-model="addForm.username" placeholder="请输入学号或工号" />
        </el-form-item>
        <el-form-item label="所在单位">
          <el-select v-model="addForm.collegeName" placeholder="请选择单位">
            <el-option label="计算机学院" value="计算机学院" />
            <el-option label="机械学院" value="机械学院" />
            <el-option label="电子学院" value="电子学院" />
            <el-option label="经济学院" value="经济学院" />
          </el-select>
        </el-form-item>
        <el-form-item label="辅导员职务">
          <el-input v-model="addForm.position" placeholder="请输入职务" />
        </el-form-item>
        <el-form-item label="辅导员类型">
          <el-select v-model="addForm.type" placeholder="请选择类型">
            <el-option label="专职辅导员" value="专职辅导员" />
            <el-option label="兼职辅导员" value="兼职辅导员" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="addForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddModal = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Upload } from '@element-plus/icons-vue'
import { userApi } from '@/api'

export default {
  name: 'MemberPage',
  components: {
    Search,
    Plus,
    Upload
  },
  setup() {
    const router = useRouter()

    // 查询条件
    const collegeFilter = ref('')
    const typeFilter = ref('')
    const statusFilter = ref('')
    const searchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    const total = ref(0)
    
    // 数据列表
    const memberList = ref([])
    
    // 弹窗状态
    const showAddModal = ref(false)
    
    // 表单数据
    const addForm = ref({
      name: '',
      username: '',
      collegeName: '',
      position: '',
      type: '',
      phone: ''
    })

    const loadMemberList = async () => {
      try {
        const res = await userApi.getUserList()
        let data = res.data || []
        
        // 模拟更多字段
        data = data.map(item => ({
          ...item,
          position: '科级辅导员',
          type: item.role === 'COUNSELOR' ? '专职辅导员' : '兼职辅导员',
          jobStatus: '在岗',
          systemRole: item.role === 'ADMIN' ? '系统管理员' : item.role === 'COLLEGE' ? '学院管理员' : '发展管理员',
          scope: '全校',
          approvalStatus: '激活'
        }))
        
        // 筛选
        if (collegeFilter.value) {
          data = data.filter(d => d.collegeName === collegeFilter.value)
        }
        if (typeFilter.value) {
          data = data.filter(d => d.type === typeFilter.value)
        }
        if (statusFilter.value) {
          data = data.filter(d => d.jobStatus === statusFilter.value)
        }
        if (searchKeyword.value) {
          const keyword = searchKeyword.value.toLowerCase()
          data = data.filter(d => 
            (d.name?.toLowerCase().includes(keyword)) ||
            (d.username?.toLowerCase().includes(keyword))
          )
        }
        
        total.value = data.length
        memberList.value = data.slice(
          (currentPage.value - 1) * pageSize.value,
          currentPage.value * pageSize.value
        )
      } catch (error) {
        console.error('加载成员列表失败', error)
      }
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
      currentPage.value = 1
      loadMemberList()
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
      loadMemberList()
    }

    const getJobStatusClass = (status) => {
      const classes = {
        '在岗': 'status-in',
        '休假': 'status-vacation',
        '离职': 'status-out'
      }
      return classes[status] || ''
    }

    const getApprovalClass = (status) => {
      return status === '激活' ? 'approval-active' : 'approval-inactive'
    }

    const viewMember = (row) => {
      ElMessage.info(`查看 ${row.name} 的详细信息`)
    }

    const showMore = (row) => {
      ElMessage.info(`更多操作: ${row.name}`)
    }

    const goToAddPage = () => {
      router.push('/member/add')
    }

    const submitAdd = async () => {
      try {
        await userApi.addUser({
          username: addForm.value.username,
          password: '123456',
          name: addForm.value.name,
          phone: addForm.value.phone,
          collegeId: 1,
          role: 'COUNSELOR'
        })
        ElMessage.success('添加成功')
        showAddModal.value = false
        addForm.value = {
          name: '',
          username: '',
          collegeName: '',
          position: '',
          type: '',
          phone: ''
        }
        loadMemberList()
      } catch (error) {
        ElMessage.error('添加失败')
      }
    }

    onMounted(() => {
      loadMemberList()
    })

    return {
      collegeFilter,
      typeFilter,
      statusFilter,
      searchKeyword,
      currentPage,
      pageSize,
      total,
      memberList,
      showAddModal,
      addForm,
      loadMemberList,
      handleSizeChange,
      handleCurrentChange,
      getJobStatusClass,
      getApprovalClass,
      viewMember,
      showMore,
      goToAddPage,
      submitAdd
    }
  }
}
</script>

<style scoped>
.member-page {
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
  flex-wrap: wrap;
}

.filter-select {
  width: 140px;
}

.search-input {
  flex: 1;
  max-width: 250px;
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

.status-in {
  color: #67C23A;
}

.status-vacation {
  color: #E6A23C;
}

.status-out {
  color: #F56C6C;
}

.approval-active {
  color: #67C23A;
  display: flex;
  align-items: center;
  gap: 4px;
}

.approval-inactive {
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67C23A;
}

.approval-inactive .status-dot {
  background-color: #999;
}

.view-btn {
  color: #409EFF;
}

.more-btn {
  color: #67C23A;
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
</style>
