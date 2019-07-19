<template>
  <div class="order">
    <el-table :data="appLists">
      <el-table-column
        prop="id"
        label="ID"/>
      <el-table-column
        prop="created_at"
        label="应用创建时间"/>
      <el-table-column
        prop="name"
        label="应用名称"/>
      <el-table-column label="剩余有效期">
        <template slot-scope="scope">
          <div :class="{ red: scope.row.status === 0 || scope.row.module[0].validity_time_text === '未激活'}">
            {{ scope.row.status === 0 ? scope.row.status_text: scope.row.module[0].validity_time_text }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0 || scope.row.module[0].validity_time_text === '未激活'" class="continue-btn" type="primary" size="small" @click="continueUse(scope.$index, scope.row)">激活</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 续费弹窗 -->
    <div v-if="isAlert" class="continueAlert">
      <div class="alertMain">
        <i class="el-icon-close close-icon" @click="isAlert = false"/>
        <div class="leave-time">
          <span class="name">应用名称</span>
          <span class="item-info">{{ alertHeadInfo.name }}系统</span>
        </div>
        <div class="leave-time">
          <!-- <span class="name">剩余有效期</span>
          <span class="item-info">{{ alertHeadInfo.status === 0 ? alertHeadInfo.status_text : '未激活' }}</span> -->
        </div>
        <div class="alertContent">
          <div v-for="(item, index) in priceArr" :key="index" :class="{item: true, selected: selectIndex === index}" @click="selectAction(index, item)">
            <div class="item-img">
              <img v-if="index === 0" src="@/assets/mine/continue1.png">
              <img v-if="index === 1" src="@/assets/mine/continue2.png">
              <img v-if="index === 2" src="@/assets/mine/continue3.png">
            </div>
            <div class="item-time">{{ item.name }}</div>
            <div class="item-price">￥{{ item.amount_cent/100 }}.00</div>
            <div class="item-words">续费累加有效时间</div>
            <div v-if="index === 1" class="tag-img">
              <img src="@/assets/mine/tag.png">
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button size="small" type="primary" class="goPay" @click="gotoPay">前往支付</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="foot">
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
    </div> -->
  </div>
</template>
<script>
import { getAppLists, appPriceList } from '@/api/app.js'
export default {
  data () {
    return {
      appLists: [],
      continueAlert: true,
      priceArr: [],
      isAlert: false,
      alertHeadInfo: {
        name: '',
        status_text: ''
      },
      selectIndex: '',
      selectItem: {}
      // pageData: {
      //   page: 1,
      //   number: 10
      // },
      // stat: {}  // 分页
    }
  },
  beforeMount () {
    getAppLists().then(res => {
      res.data.data.map((item, index) => {
        item.index = index + 1
        item.created_at = item.created_at.toString().slice(0, 10)
      })
      this.appLists = res.data.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    // 续费事件
    continueUse (index, row) {
      // 获取应用价格套餐列表
      appPriceList(row.id).then(res => {
        this.priceArr = res.data.data
      }).catch(err => {
        console.log(err)
      })
      this.selectIndex = ''
      this.selectItem = row
      this.alertHeadInfo.name = row.name
      this.alertHeadInfo.status_text = row.status_text
      this.isAlert = true
    },
    // 选择续费时长
    selectAction (index, item) {
      this.selectItem.time = item.duration
      this.selectIndex = index
      this.selectItem.type = '激活'
      this.selectItem.price = item.amount_cent
      this.selectItem.price_id = item.id
    },
    gotoPay () {
      if (this.selectIndex === '') {
        this.$message.error('请选择一个续费套餐')
      } else {
        sessionStorage.setItem('selectItem', JSON.stringify(this.selectItem))
        this.$router.push({ name: 'stayPay', query: { info: this.selectItem } })
      }
    }
    // 点击分页器
    // handleSizeChange (val) {
    //   this.pageData.number = val
    //   orderList(this.pageData).then(res => {
    //     res.data.data.map((item, index) => {
    //       item.index = index + 1
    //       item.created_at = item.created_at.toString().slice(0, 10)
    //     })
    //     this.tableData = res.data.data
    //     this.stat = res.data.stat
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    // handleCurrentChange (val) {
    //   this.pageData.page = val
    //   orderList(this.pageData).then(res => {
    //     res.data.data.map((item, index) => {
    //       item.index = index + 1
    //       item.created_at = item.created_at.toString().slice(0, 10)
    //     })
    //     this.tableData = res.data.data
    //     this.stat = res.data.stat
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.order{
  flex: 1;
  padding: 16px;
  .continue-btn{
    width: 80px;
  }
  .continueAlert{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
    background: rgba($color: #000000, $alpha: 0.4);
    .close-icon{
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .alertMain{
      height: 492px;
      width: 800px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 4px;
      background: #fff;
      .leave-time{
        display: flex;
        height: 56px;
        padding-left: 40px;
        border-top: 1px solid #e8e8e8;
        line-height: 56px;
        font-weight: 700;
        .name{
          width: 70px;
        }
        .item-info{
          margin-left: 26px;
        }
      }
      .alertContent{
        display: flex;
        justify-content: space-between;
        padding: 0 40px;
        .item{
          height: 280px;
          width: 220px;
          position: relative;
          text-align: center;
          border: 2px solid #fff;
          background: #F5F8FF;
          .item-img{
            height: 65px;
            width: 65px;
            margin: 0 auto;
            margin-top: 30px;
            border-radius: 100%;
            overflow: hidden;
            &>img{
              height: 100%;
              width: 100%;
            }
          }
          .item-time{
            margin-top: 40px;
            font-size: $font-20;
            line-height: $font-28;
            font-weight: $font-600;
          }
          .item-price{
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: $font-30;
            font-weight: $font-600;
            color: $btn-color;
            line-height: 42px;
          }
          .item-words{
            color: $font-word-color;
            line-height: $font-20;
          }
          .tag-img{
            position: absolute;
            top: 5px;
            right: 0;
            height: 83px;
            width: 56px;
            &>img{
              width: 100%;
            }
          }
        }
        .selected{
          border: 2px solid #4993FF;
        }
      }
      .footer{
        margin-top: 30px;
        text-align: center;
        .goPay{
          width: 260px;
        }
      }
    }
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
  .red{
    color: #F85E5E;
  }
}
</style>
