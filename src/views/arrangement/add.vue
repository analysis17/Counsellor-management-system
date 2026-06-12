<template>
    <div class="add-duty-page">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="值班人" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择值班人">
            <el-option 
              v-for="user in counselorList" 
              :key="user.id" 
              :label="user.name" 
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="学院" prop="collegeId">
          <el-select v-model="form.collegeId" placeholder="请选择学院">
            <el-option 
              v-for="college in collegeList" 
              :key="college.id" 
              :label="college.name" 
              :value="college.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="值班日期" prop="dutyDate">
          <el-date-picker 
            v-model="form.dutyDate" 
            type="date" 
            placeholder="请选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker 
            v-model="form.startTime" 
            placeholder="请选择开始时间"
            format="HH:mm"
            value-format="HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker 
            v-model="form.endTime" 
            placeholder="请选择结束时间"
            format="HH:mm"
            value-format="HH:mm:ss"
          />
        </el-form-item>

        <el-form-item label="值班地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入值班地点" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { dutyApi, userApi, collegeApi } from '@/api'

export default {
  name: 'AddDutyPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const counselorList = ref([])
    const collegeList = ref([])

    const form = reactive({
      id: null,
      userId: null,
      collegeId: null,
      dutyDate: null,
      startTime: null,
      endTime: null,
      location: '',
      remark: ''
    })

    const rules = {
      userId: [{ required: true, message: '请选择值班人', trigger: 'change' }],
      collegeId: [{ required: true, message: '请选择学院', trigger: 'change' }],
      dutyDate: [{ required: true, message: '请选择值班日期', trigger: 'change' }],
      startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
      endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
    }

    const loadOptions = async () => {
      try {
        const [counselors, colleges] = await Promise.all([
          userApi.getCounselors(),
          collegeApi.getList()
        ])
        counselorList.value = counselors.data || []
        collegeList.value = colleges.data || []
      } catch (error) {
        console.error('加载选项失败', error)
      }
    }

    const loadDutyDetail = async (id) => {
      try {
        const res = await dutyApi.getAll()
        const duty = res.data?.find(d => d.id === id)
        if (duty) {
          Object.assign(form, duty)
        }
      } catch (error) {
        console.error('加载值班详情失败', error)
      }
    }

    const submitForm = async () => {
      try {
        await formRef.value.validate()
        if (form.id) {
          await dutyApi.update(form)
          ElMessage.success('更新成功')
        } else {
          await dutyApi.add(form)
          ElMessage.success('添加成功')
        }
        router.push('/arrangement')
      } catch (error) {
        console.error('提交失败', error)
      }
    }

    const resetForm = () => {
      formRef.value.resetFields()
    }

    onMounted(() => {
      loadOptions()
      if (route.query.id) {
        form.id = route.query.id
        loadDutyDetail(route.query.id)
      }
    })

    return {
      formRef,
      form,
      rules,
      counselorList,
      collegeList,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.add-duty-page {
  max-width: 600px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
</style>