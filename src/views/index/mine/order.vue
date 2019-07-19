<template>
  <div class="order">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"/>
      <el-table-column
        prop="created_at"
        label="时间"/>
      <el-table-column
        prop="module_name"
        label="产品类型"/>
      <el-table-column
        prop="remark"
        label="分类"/>
      <el-table-column
        prop="amount_text"
        label="应付金额"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :class="{point: true, red: scope.row.status == '0', green: scope.row.status_text == '1'}"/>
          <span>{{ scope.row.status_text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0" size="mini" type="primary" @click="gotoPay(scope.row)">立即支付</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-dialog
      :visible.sync="centerDialogVisible"
      title="温 馨 提 示"
      width="40%"
      center>
      <div class="alertWord">平台暂不支持在线支付，您的订单已经成功提交到后台，业务员将在半个小时内联系您。您也可通过拨打400-886-2718主动联系平台。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" class="alert-btn" @click="centerDialogVisible = false">好 的</el-button>
      </span>
    </el-dialog> -->
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
import { orderList } from '@/api/app.js'
export default {
  data () {
    return {
      tableData: [],
      centerDialogVisible: false,
      pageData: {
        page: 1,
        number: 10
      },
      stat: {}
    }
  },
  beforeMount () {
    orderList(this.pageData).then(res => {
      res.data.data.map((item, index) => {
        item.index = index + 1
        item.created_at = item.created_at.toString().slice(0, 10)
        if (this.$route.query.origin) {
          sessionStorage.setItem('leftIndex', '1')
        }
      })
      this.tableData = res.data.data
      this.stat = res.data.stat
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    gotoPay (row) {
      const info = row
      info.price_id = row.goods_id
      sessionStorage.setItem('selectItem', JSON.stringify(info))
      this.$router.push({ name: 'stayPay', query: { info: info } })
    },
    // 点击分页器
    handleSizeChange (val) {
      this.pageData.number = val
      orderList(this.pageData).then(res => {
        res.data.data.map((item, index) => {
          item.index = index + 1
          item.created_at = item.created_at.toString().slice(0, 10)
        })
        this.tableData = res.data.data
        this.stat = res.data.stat
      }).catch(err => {
        console.log(err)
      })
    },
    handleCurrentChange (val) {
      this.pageData.page = val
      orderList(this.pageData).then(res => {
        res.data.data.map((item, index) => {
          item.index = index + 1
          item.created_at = item.created_at.toString().slice(0, 10)
        })
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
  .point{
    display: inline-block;
    height: 6px;
    width: 6px;
    border-radius: 100%;
  }
  .red{
    background: #f00;
  }
  .green{
    background: #52C41A;
  }
  .alertWord{
    padding: 20px;
    // text-align: center;
    font-size: 16px;
    line-height: 30px;
  }
  .alert-btn{
    width: 120px;
  }
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
