<template>
    <div class="add-member-page">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="form.collegeId" placeholder="请选择学院">
            <el-option 
              v-for="college in collegeList" 
              :key="college.id" 
              :label="college.name" 
              :value="college.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="辅导员" value="COUNSELOR" />
            <el-option label="学院管理员" value="COLLEGE" />
            <el-option label="系统管理员" value="ADMIN" />
          </el-select>
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
import { userApi, collegeApi } from '@/api'

export default {
  name: 'AddMemberPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const collegeList = ref([])

    const form = reactive({
      id: null,
      name: '',
      username: '',
      password: '',
      phone: '',
      collegeId: null,
      role: 'COUNSELOR'
    })

    const rules = {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }]
    }

    const loadOptions = async () => {
      try {
        const res = await collegeApi.getList()
        collegeList.value = res.data || []
      } catch (error) {
        console.error('加载学院列表失败', error)
      }
    }

    const loadMemberDetail = async (id) => {
      try {
        const res = await userApi.getUserList()
        const member = res.data?.find(m => m.id === id)
        if (member) {
          Object.assign(form, member)
        }
      } catch (error) {
        console.error('加载成员详情失败', error)
      }
    }

    const submitForm = async () => {
      try {
        await formRef.value.validate()
        if (form.id) {
          await userApi.updateUser(form)
          ElMessage.success('更新成功')
        } else {
          await userApi.addUser(form)
          ElMessage.success('添加成功')
        }
        router.push('/member')
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
        loadMemberDetail(route.query.id)
      }
    })

    return {
      formRef,
      form,
      rules,
      collegeList,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.add-member-page {
  max-width: 600px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}
</style>