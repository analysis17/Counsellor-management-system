<template>
  <Layout>
    <div class="import-duty-page">
      <el-upload
        ref="uploadRef"
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        accept=".xlsx,.xls"
        drag
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xlsx/xls 文件
          </div>
        </template>
      </el-upload>

      <div class="preview-section" v-if="previewData.length > 0">
        <h4>数据预览</h4>
        <el-table :data="previewData" stripe style="width: 100%">
          <el-table-column prop="dutyDate" label="值班日期" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="userName" label="值班人" />
          <el-table-column prop="location" label="地点" />
        </el-table>

        <el-button type="primary" @click="submitImport" style="margin-top: 20px">
          确认导入
        </el-button>
      </div>
    </div>
  </Layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Layout from '@/components/Layout.vue'
import { dutyApi } from '@/api'

export default {
  name: 'ImportDutyPage',
  components: { Layout },
  setup() {
    const router = useRouter()
    const uploadRef = ref(null)
    const previewData = ref([])

    const handleFileChange = (file) => {
      // 这里应该解析Excel文件，简化处理
      // 实际项目中需要使用xlsx库解析
      ElMessage.info('文件已选择，请确认导入')
      
      // 模拟预览数据
      previewData.value = [
        { dutyDate: '2024-01-20', startTime: '08:00', endTime: '12:00', userName: '张三', location: '服务中心' },
        { dutyDate: '2024-01-21', startTime: '14:00', endTime: '18:00', userName: '李四', location: '服务中心' }
      ]
    }

    const submitImport = async () => {
      try {
        // 将预览数据转换为导入格式
        const importData = previewData.value.map(item => ({
          userId: 1, // 需要根据userName匹配
          collegeId: 1,
          dutyDate: item.dutyDate,
          startTime: item.startTime + ':00',
          endTime: item.endTime + ':00',
          location: item.location
        }))
        
        await dutyApi.batchImport(importData)
        ElMessage.success('导入成功')
        router.push('/arrangement')
      } catch (error) {
        console.error('导入失败', error)
      }
    }

    return {
      uploadRef,
      previewData,
      handleFileChange,
      submitImport
    }
  }
}
</script>

<style scoped>
.import-duty-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.preview-section {
  margin-top: 20px;
}

.preview-section h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
</style>