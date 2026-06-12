<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">
        <div class="logo-icon">🏛️</div>
        <div class="logo-text">
          <div class="logo-title">辅导员值班工作</div>
        </div>
      </div>
      
      <div class="nav-menu">
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'calendar' }"
          @click="navigateTo('calendar')"
        >
          <el-icon class="nav-icon"><Calendar /></el-icon>
          <span class="nav-text">值班日历</span>
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'arrangement' }"
          @click="navigateTo('arrangement')"
        >
          <el-icon class="nav-icon"><List /></el-icon>
          <span class="nav-text">值班安排表</span>
        </div>
        
        <div 
          class="nav-item" 
          :class="{ active: activeMenu === 'member' }"
          @click="navigateTo('member')"
        >
          <el-icon class="nav-icon"><User /></el-icon>
          <span class="nav-text">值班成员</span>
        </div>
      </div>
      
      <div class="sidebar-decoration">
        <!-- 装饰图案 -->
        <div class="building-icon">🏯</div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <div class="header">
        <div class="header-left">
          <div class="user-info">
            <el-avatar :size="28" class="user-avatar">张</el-avatar>
            <span class="user-name">张小白 (管理员)</span>
            <el-tag size="small" type="danger" class="role-tag">与切换</el-tag>
          </div>
        </div>
        <div class="header-right">
          <el-button text class="back-home-btn">
            返回主页
            <el-icon><CircleClose /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 页面内容 -->
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar, List, User, CircleClose } from '@element-plus/icons-vue'

export default {
  name: 'Layout',
  components: {
    Calendar,
    List,
    User,
    CircleClose
  },
  data() {
    return {
      activeMenu: 'calendar'
    }
  },
  methods: {
    navigateTo(page) {
      this.activeMenu = page
      this.$router.push(`/${page}`)
    }
  },
  mounted() {
    // 根据当前路由设置激活的菜单
    const path = this.$route.path
    if (path.includes('calendar')) {
      this.activeMenu = 'calendar'
    } else if (path.includes('arrangement')) {
      this.activeMenu = 'arrangement'
    } else if (path.includes('member')) {
      this.activeMenu = 'member'
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100%;
  background-color: #f5f7fa;
}

/* 左侧导航栏 */
.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #B81F24 0%, #8B1518 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 32px;
  margin-right: 12px;
}

.logo-text {
  flex: 1;
}

.logo-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.nav-menu {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(255, 255, 255, 0.7);
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-left: 3px solid #fff;
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
}

.nav-text {
  font-size: 14px;
}

.sidebar-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  text-align: center;
  opacity: 0.1;
}

.building-icon {
  font-size: 120px;
}

/* 右侧内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  background-color: #B81F24;
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  color: #333;
  margin-right: 8px;
}

.role-tag {
  font-size: 12px;
}

.header-right {
  .back-home-btn {
    color: #B81F24;
    font-size: 14px;
    
    &:hover {
      background-color: rgba(184, 31, 36, 0.1);
    }
  }
}

/* 内容区 */
.content-wrapper {
  flex: 1;
  overflow: auto;
  padding: 20px;
}
</style>
