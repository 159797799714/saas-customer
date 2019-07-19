<template>
  <div class="foot">
    <div class="sum">
      <div class="sum-num">共{{ sum }}条纪录</div>
      <div class="position">第{{ item }}/{{ page }}页</div>
    </div>
    <div class="page">
      <el-pagination
        :total="sum"
        :page-sizes="[10, 20, 30, 40]"
        popper-class="页"
        layout="prev, pager, next, sizes, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Footbar',
  data() {
    return {
      currentPage: 4,
      sum: 100,
      item: 1,
      page: 10
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.page = Math.ceil(this.sum / val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.item = val
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>

