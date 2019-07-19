<template>
  <div class="order">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="created_at"
        label="登录时间"/>
      <el-table-column
        prop="ip"
        label="IP地址"/>
      <el-table-column
        prop="address"
        label="登录地址"/>
      <el-table-column
        prop="agent"
        label="登录类型"/>
    </el-table>
    <div class="foot">
      <div class="sum">
        <div class="sum-num">共{{ stat.total_number }}条纪录</div>
        <div class="position">第{{ stat.page }}/{{ stat.total_page }}页</div>
      </div>
      <div class="page">
        <el-pagination
          :total="stat.total_number"
          :page-sizes="[10, 20, 30, 40]"
          popper-class="页"
          layout="prev, pager, next, sizes, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
  </div>
</template>
<script>
// import Footbar from '@/components/Footbar.vue'
import { getloginLog } from '@/api/app.js'
export default {
  // components: {
  //   Footbar
  // },
  data () {
    return {
      tableData: [],
      pageData: {
        page: 1,
        number: 10
      },
      stat: {}
    }
  },
  beforeMount () {
    getloginLog(this.pageData).then(res => {
      res.data.data.map((item, index) => {
        item.created_at = item.created_at.toString().slice(0, 10)
      })
      this.tableData = res.data.data
      this.stat = res.data.stat
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    handleSizeChange (val) {
      this.pageData.number = val
      getloginLog(this.pageData).then(res => {
        this.tableData = res.data.data
        this.stat = res.data.stat
      }).catch(err => {
        console.log(err)
      })
    },
    handleCurrentChange (val) {
      this.pageData.page = val
      getloginLog(this.pageData).then(res => {
        this.tableData = res.data.data
        this.stat = res.data.stat
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order{
  flex: 1;
  padding: 16px;
  .foot{
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    .sum{
      display: flex;
      line-height: 32px;
      .sum-num{
        margin-right: 5px;
      }
    }
  }
}
</style>
