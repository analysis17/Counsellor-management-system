<template>
  <div class="calendar-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">值班日历</h1>
    </div>
    
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="campus" class="campus-select" placeholder="全部校区">
        <el-option label="全部校区" value="" />
        <el-option label="A校区" value="A" />
        <el-option label="B校区" value="B" />
      </el-select>
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        @change="handleDateChange"
      />
      <el-button @click="goToday" class="today-btn">
        <el-icon><Calendar /></el-icon>
        今天
      </el-button>
      <el-button @click="prevDay" class="nav-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <el-button @click="nextDay" class="nav-btn">
        <el-icon><ArrowRight /></el-icon>
      </el-button>
      <div class="legend">
        <span class="legend-item">
          <span class="legend-dot empty"></span>
          <span>空闲</span>
        </span>
        <span class="legend-item">
          <span class="legend-dot pending"></span>
          <span>未开始</span>
        </span>
        <span class="legend-item">
          <span class="legend-dot active"></span>
          <span>值班中</span>
        </span>
        <span class="legend-item">
          <span class="legend-dot ended"></span>
          <span>已结束</span>
        </span>
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-container">
      <!-- 时间头部 -->
      <div class="time-header-row">
        <div class="corner-cell"></div>
        <div 
          class="time-header-cell" 
          v-for="hour in timeSlots" 
          :key="hour"
        >
          {{ hour }}:00
        </div>
      </div>
      
      <!-- 值班行 -->
      <div class="duty-rows">
        <div 
          class="duty-row" 
          v-for="(row, rowIndex) in dutyRows" 
          :key="rowIndex"
        >
          <div class="row-label">
            {{ rowIndex + 1 }}
          </div>
          <div class="row-cells">
            <div 
              class="hour-cell" 
              v-for="hour in timeSlots" 
              :key="hour"
              :class="{ 'has-duty': hasDutyAtHour(rowIndex, hour) }"
            >
              <div 
                v-for="duty in getDutiesForCell(rowIndex, hour)"
                :key="duty.id"
                class="duty-card"
                :class="getDutyStatus(duty)"
                :style="{ gridColumn: `span ${getDutySpan(duty)}` }"
              >
                <div class="duty-card-header">
                  <el-avatar :size="20" class="duty-avatar">
                    {{ getAvatarText(duty) }}
                  </el-avatar>
                  <span class="duty-name">{{ duty.userName || duty.userId || '未知' }}</span>
                  <span class="duty-status-badge" :class="getDutyStatus(duty)">
                    {{ getStatusText(duty) }}
                  </span>
                </div>
                <div class="duty-card-info">
                  <span>所在单位: {{ duty.collegeName }}</span>
                  <span>值班地址: {{ duty.location }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Calendar, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { dutyApi } from '@/api'
import dayjs from 'dayjs'

export default {
  name: 'CalendarPage',
  components: {
    Calendar,
    ArrowLeft,
    ArrowRight
  },
  setup() {
    const campus = ref('')
    const selectedDate = ref('2026-06-11')
    const dutyList = ref([])
    const dutyRowMap = ref({})

    // 时间槽: 08:00 - 23:00 (共16小时)
    const timeSlots = computed(() => {
      return Array.from({ length: 16 }, (_, i) => 8 + i)
    })

    // 值班行数（根据数据动态生成）
    const dutyRows = computed(() => {
      const duties = getDutiesForDate()
      // 重置行映射
      dutyRowMap.value = {}
      // 计算需要多少行来显示所有值班（避免重叠）
      const maxOverlap = calculateMaxOverlap(duties)
      return Array.from({ length: Math.max(maxOverlap, 6) }, (_, i) => i)
    })

    const goToday = () => {
      selectedDate.value = dayjs().format('YYYY-MM-DD')
      loadDutyData()
    }

    const prevDay = () => {
      const newDate = dayjs(selectedDate.value).subtract(1, 'day')
      selectedDate.value = newDate.format('YYYY-MM-DD')
      loadDutyData()
    }

    const nextDay = () => {
      const newDate = dayjs(selectedDate.value).add(1, 'day')
      selectedDate.value = newDate.format('YYYY-MM-DD')
      loadDutyData()
    }

    const handleDateChange = () => {
      loadDutyData()
    }

    const loadDutyData = async () => {
      try {
        const res = await dutyApi.getAll()
        dutyList.value = res.data || []
        // 重置行映射
        dutyRowMap.value = {}
      } catch (error) {
        console.error('加载值班数据失败', error)
      }
    }

    // 获取当天的值班
    const getDutiesForDate = () => {
      return dutyList.value.filter(duty => duty.dutyDate === selectedDate.value)
    }

    // 计算最大重叠数
    const calculateMaxOverlap = (duties) => {
      if (duties.length === 0) return 1
      
      const intervals = duties.map(duty => {
        const startHour = parseInt(duty.startTime?.substring(0, 2) || '0')
        const endHour = parseInt(duty.endTime?.substring(0, 2) || '0')
        return { start: startHour, end: endHour }
      })

      let maxOverlap = 1
      for (let hour = 8; hour <= 23; hour++) {
        let count = 0
        for (const interval of intervals) {
          if (hour >= interval.start && hour < interval.end) {
            count++
          }
        }
        maxOverlap = Math.max(maxOverlap, count)
      }
      return maxOverlap
    }

    // 为每个值班分配行索引
    const getDutyRowIndex = (duty) => {
      const dutyId = duty.id
      if (dutyRowMap.value[dutyId] !== undefined) {
        return dutyRowMap.value[dutyId]
      }

      const startHour = parseInt(duty.startTime?.substring(0, 2) || '0')
      const endHour = parseInt(duty.endTime?.substring(0, 2) || '0')
      const duties = getDutiesForDate()
      
      // 找到一个不冲突的行
      let row = 0
      while (row < 10) {
        let conflict = false
        for (const other of duties) {
          if (other.id === dutyId) continue
          if (dutyRowMap.value[other.id] !== row) continue
          
          const otherStart = parseInt(other.startTime?.substring(0, 2) || '0')
          const otherEnd = parseInt(other.endTime?.substring(0, 2) || '0')
          
          // 检查时间是否重叠
          if (!(endHour <= otherStart || startHour >= otherEnd)) {
            conflict = true
            break
          }
        }
        if (!conflict) {
          dutyRowMap.value[dutyId] = row
          return row
        }
        row++
      }
      return 0
    }

    // 检查某行某小时是否有值班
    const hasDutyAtHour = (rowIndex, hour) => {
      const duties = getDutiesForDate()
      return duties.some(duty => {
        const startHour = parseInt(duty.startTime?.substring(0, 2) || '0')
        if (startHour === hour) {
          const row = getDutyRowIndex(duty)
          return row === rowIndex
        }
        return false
      })
    }

    // 获取单元格中的值班（只在开始小时显示）
    const getDutiesForCell = (rowIndex, hour) => {
      return getDutiesForDate().filter(duty => {
        const startHour = parseInt(duty.startTime?.substring(0, 2) || '0')
        if (startHour === hour) {
          const row = getDutyRowIndex(duty)
          return row === rowIndex
        }
        return false
      })
    }

    // 获取值班跨越的小时数
    const getDutySpan = (duty) => {
      const startHour = parseInt(duty.startTime?.substring(0, 2) || '0')
      const endHour = parseInt(duty.endTime?.substring(0, 2) || '0')
      return endHour - startHour
    }

    const getDutyStatus = (duty) => {
      const now = dayjs()
      const dutyDate = dayjs(duty.dutyDate + ' ' + duty.startTime)
      const endDate = dayjs(duty.dutyDate + ' ' + duty.endTime)
      
      if (now.isBefore(dutyDate)) return 'pending'
      if (now.isAfter(endDate)) return 'ended'
      return 'active'
    }

    const getStatusText = (duty) => {
      const status = getDutyStatus(duty)
      const texts = {
        pending: '未开始',
        active: '值班中',
        ended: '已结束'
      }
      return texts[status] || '未知'
    }

    const getAvatarText = (duty) => {
      if (duty.userName) {
        return duty.userName.charAt(0)
      } else if (duty.userId) {
        return duty.userId.toString().charAt(0)
      }
      return '?'
    }

    onMounted(() => {
      loadDutyData()
    })

    return {
      campus,
      selectedDate,
      timeSlots,
      dutyRows,
      goToday,
      prevDay,
      nextDay,
      handleDateChange,
      hasDutyAtHour,
      getDutiesForCell,
      getDutySpan,
      getDutyStatus,
      getStatusText,
      getAvatarText
    }
  }
}
</script>

<style scoped>
.calendar-page {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.campus-select {
  width: 140px;
}

.today-btn {
  padding: 8px 16px;
}

.nav-btn {
  padding: 8px 12px;
}

.legend {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.empty {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.legend-dot.pending {
  background-color: #ff9800;
}

.legend-dot.active {
  background-color: #2196f3;
}

.legend-dot.ended {
  background-color: #9e9e9e;
}

.calendar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 0;
}

.time-header-row {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.corner-cell {
  width: 50px;
  border-right: 1px solid #eee;
  background-color: #fff;
}

.time-header-cell {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  border-right: 1px solid #eee;
}

.time-header-cell:last-child {
  border-right: none;
}

.duty-rows {
  flex: 1;
  overflow-y: auto;
}

.duty-row {
  display: flex;
  border-bottom: 1px solid #eee;
}

.row-label {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-right: 1px solid #eee;
  font-size: 12px;
  color: #999;
}

.row-cells {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  min-height: 80px;
}

.hour-cell {
  border-right: 1px solid #eee;
  padding: 4px;
  min-height: 80px;
}

.hour-cell:last-child {
  border-right: none;
}

.hour-cell:nth-child(odd) {
  background-color: #fafafa;
}

.hour-cell.has-duty {
  background-color: #fff;
}

.duty-card {
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  color: #fff;
  font-size: 12px;
  box-sizing: border-box;
  min-height: 60px;
}

.duty-card.pending {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.duty-card.active {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.duty-card.ended {
  background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
}

.duty-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.duty-avatar {
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
}

.duty-name {
  font-weight: 600;
  font-size: 12px;
  flex: 1;
}

.duty-status-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

.duty-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
  opacity: 0.9;
}
</style>