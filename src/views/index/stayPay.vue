<template>
  <div class="stayPay">
    <div class="top">
      <div class="user-img">
        <img src="@/assets/mine/stayPay.png" alt="">
      </div>
      <div class="title">
        待支付订单
      </div>
    </div>
    <div class="row first-row">
      <div class="first-vertical">创建时间</div>
      <div class="second-vertical">{{ selectItem.created_at }}</div>
    </div>
    <div class="row">
      <div class="first-vertical">购买应用</div>
      <div class="second-vertical">{{ selectItem.name }} {{ selectItem.module_name }}</div>
    </div>
    <div class="row">
      <div class="first-vertical">类型</div>
      <div class="second-vertical">{{ selectItem.type }} {{ selectItem.remark }}</div>
    </div>
    <div class="row">
      <div class="first-vertical">共需支付</div>
      <div class="second-vertical money">￥{{  selectItem.price? selectItem.price/100 + '元' : selectItem.amount_text }}</div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" size="small" @click="gotoPay">立即支付</el-button>
    </div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="温 馨 提 示"
      width="40%"
      center>
      <div class="alertWord">平台暂不支持在线支付，您的订单已经成功提交到后台，业务员将在半个小时内联系您。您也可通过拨打400-886-2718主动联系平台。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" class="alert-btn" @click="centerDialogVisible = false">好 的</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { activeApp, renewApp } from '@/api/app.js'
export default {
  data () {
    return {
      form: {
        tenant_id: '',
        goods_id: '',
        duration: ''
      },
      selectItem: '',
      centerDialogVisible: false
    }
  },
  created () {
    // this.selectItem = JSON.parse(sessionStorage.selectItem)
    if (this.$route.query.info === '[object Object]') {
      this.selectItem = JSON.parse(sessionStorage.info)
    } else {
      this.selectItem = this.$route.query.info
      sessionStorage.setItem('info', JSON.stringify(this.selectItem))
    }
    this.form.tenant_id = this.selectItem.id
    this.form.goods_id = this.selectItem.price_id
  },
  methods: {
    gotoPay () {
      // 续费或者激活应用
      if (this.selectItem.type === '续费' || this.selectItem.remark === '续费') {
        renewApp(this.form).then(res => {
          if (res.data.status) {
            this.centerDialogVisible = true
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (this.selectItem.type === '激活' || this.selectItem.remark === '激活') {
        activeApp(this.form).then(res => {
          if (res.data.status) {
            this.centerDialogVisible = true
          } else {
            if (this.selectItem.remark === '激活') {
              this.centerDialogVisible = true
            } else {
              this.$message.error(res.data.message)
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$color-gray: #e8e8e8;
.stayPay{
  .top{
    display: flex;
    margin-top: 40px;
    margin-bottom: 33px;
    height: 60px;
    line-height: 60px;
    padding-left: 60px;
    .user-img{
      display: inline-block;
      margin-right: 30px;
      height: 60px;
      width: 60px;
      border-radius: 100%;
      overflow: hidden;
      border: 1px solid $color-gray;
      img{
        height: 100%;
        width: 100%;
        background: #fff;
        border-radius: 100%;
      }
    }
    .title{
      font-size: 20px;
      font-weight: 600;
    }
  }
  .row{
    display: flex;
    padding: 0 60px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid $color-gray;
    .first-vertical{
      width: 160px;
    }
    .second-vertical{
      flex: 1;
      overflow: hidden;
    }
    .money{
      color: #F85E5E;
    }
  }
  .first-row{
    border-top: 1px solid $color-gray;
  }
  .bottom-btn{
    margin-top: 40px;
    padding-left: 60px;
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
}
</style>
