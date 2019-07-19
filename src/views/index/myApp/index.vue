<template>
  <div class="myapp">
    <div class="title">我的应用</div>
    <div class="app">
      <div v-for="(item, index) in modelList" :key="index" class="system">
        <div class="system-btn">
          <div class="system-name">{{ item.moduleName }}</div>
          <div class="system-img">
            <img v-if="item.moduleId == '1'" src="@/assets/mine/xyk.png">
            <img v-if="item.moduleId == '2'" src="@/assets/mine/dkcs.png">
            <img v-if="item.moduleId == '3'" src="@/assets/mine/wkzf.png">
            <img v-if="item.moduleId == '4'" src="@/assets/mine/dlxt.png">
          </div>
          <div class="system-cover">
            <el-button v-if="item.status === 1" class="btn goIn" size="small" @click="gotoApp(item)">进入应用</el-button>
            <el-button v-if="item.status === 0" class="btn" size="small" @click="activeApp(item)">激活应用</el-button>
          </div>
        </div>
        <div class="system-title">
          {{ item.name }}
        </div>
      </div>
      <div class="system add-box" @click="addApp">
        <div class="add-icon"><i class="el-icon-circle-plus-outline"/></div>
        <div>创建新应用</div>
      </div>
    </div>
    <!-- 新建应用弹窗 -->
    <el-dialog :visible.sync="addModelAlert" width="700px" title="创建新应用" class="dialog">
      <div v-for="(item, index) in systemList" :key="index" class="system-item" @click="addSystem(item.id)">
        <div class="system-name">{{ item.name }}</div>
        <div class="system-img">
          <img v-if="item.id == '1'" src="@/assets/mine/xyk.png">
          <img v-if="item.id == '2'" src="@/assets/mine/dkcs.png">
          <img v-if="item.id == '3'" src="@/assets/mine/wkzf.png">
          <img v-if="item.id == '4'" src="@/assets/mine/dlxt.png">
        </div>
      </div>
    </el-dialog>

    <!-- 设置应用名 -->
    <el-dialog :visible.sync="createApp2" width="700px" title="填写信息" class="dialog">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" class="el-dialog__body" label="应用名称 :">
          <el-input v-model="form.name" :autofocus="true"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="goPastOne">上一步</el-button>
        <el-button type="primary" size="small" @click="sureSubmit">确认</el-button>
      </div>
    </el-dialog>
    <!-- 激活弹窗 -->
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
        <div class="foot">
          <el-button size="small" type="primary" class="goPay" @click="gotoPay">前往支付</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAppLists, gatAppModuleLists, createApp, goinApp, appPriceList } from '@/api/app.js'
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      appList: [],
      modelList: [],
      addModelAlert: false,
      systemList: [],
      addAppSystem: [],
      formLabelWidth: '80px',
      createAlert: false,
      form: {
        module: [],
        name: ''
      },
      createApp1: false,
      createApp2: false,
      havaNull: true,
      priceArr: [],
      isAlert: false,
      alertHeadInfo: {
        name: '',
        status_text: ''
      },
      selectIndex: '',
      selectItem: {},
      times: 0 // 创建应用确认按钮点击次数
    }
  },
  beforeMount () {
    getAppLists().then(res => {
      this.appList = res.data.data
      this.appList.map((item, index) => {
        this.modelList.push({})
        this.modelList[index].name = item.name
        this.modelList[index].status = item.status
        this.modelList[index].moduleName = item.module[0].name
        this.modelList[index].moduleId = item.module[0].id
        this.modelList[index].id = item.id
        this.modelList[index].created_at = item.module[0].created_at.slice(0, 10)
        this.modelList[index].module = item.module
        this.modelList[index].status_text = item.status_text
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    gotoApp (item) {
      goinApp(item.id).then(res => {
        // console.log(res.data.code === 0, res.data.message)
        if (res.data.code === 0 && res.data.status) {
          window.location.href = res.data.data.domain + '/admin#/center?token=' + res.data.data.login.Authorization // 正式环境后端返回完整路径
        } else {
          this.$message({
            type: 'error',
            message: res.data.message,
            duration: 1000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addApp () {
      gatAppModuleLists().then((res) => {
        this.systemList = res.data.data
      }).catch(err => {
        console.log(err)
      })
      this.addModelAlert = true
    },
    addSystem (item) {
      this.form.module = []
      this.addModelAlert = false
      this.createApp2 = true
      this.form.module.push(item)
    },
    // 续费事件
    activeApp (item) {
      // 获取应用价格套餐列表
      appPriceList(item.id).then(res => {
        this.priceArr = res.data.data
      }).catch(err => {
        console.log(err)
      })
      this.selectItem = item
      this.alertHeadInfo.name = item.name
      this.alertHeadInfo.status_text = item.status_text
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
      if (this.selectIndex !== '') {
        sessionStorage.setItem('selectItem', JSON.stringify(this.selectItem))
        this.$emit('pay', this.selectItem)
        this.$router.push({ name: 'stayPay', query: { info: this.selectItem } })
      } else {
        this.$message.error('请选择一个激活套餐')
      }
    },
    // 创建新应用
    goPastOne () {
      this.form.module = []
      this.createApp2 = false
      this.addModelAlert = true
    },
    sureSubmit () {
      this.times += 1
      if (this.form.name === '') {
        this.$message.error('应用名不能为空，请重新输入')
      } else if (this.times < 2) {
        createApp(this.form).then(res => {
          if (res.data.status) {
            this.$message({
              message: '恭喜你，新增成功',
              type: 'success'
            })
            getAppLists().then(res => {
              if (res.data.status) {
                this.appList = res.data.data
                this.modelList = []
                this.appList.map((item, index) => {
                  this.modelList.push({})
                  this.modelList[index].name = item.name
                  this.modelList[index].status = item.status
                  this.modelList[index].id = item.id
                  this.modelList[index].moduleId = item.module[0].id
                  this.modelList[index].moduleName = item.module[0].name
                  this.modelList[index].module = item.module
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '应用更新失败',
                  duration: 700
                })
              }
            }).catch(err => {
              console.log(err)
            })
            this.createApp2 = false
            this.form = {
              module: [],
              name: ''
            }
          } else {
            this.createApp2 = false
            this.form = {
              module: [],
              name: ''
            }
            this.$message({
              type: 'error',
              message: '创建失败',
              duration: 700
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
      setTimeout(function () {
        this.times = 0
      }.bind(this), 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.myapp{
  padding: 32px 100px;
  flex: 1;
  overflow: auto;
  .title{
    margin-bottom: 15px;
    font-size: $font-20;
    line-height: 28px;
  }

  .app{
    .add-box{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .add-icon{
        margin-bottom: 12px;
        font-size: 21px;
        color: #ccc;
      }
    }
  }
  .system{
    float: left;
    margin-right: 30px;
    margin-bottom: 30px;
    height: 152px;
    width: 254px;
    background: #fff;
    border-radius: 4px;
    .system-btn{
      padding: 20px 25px;
      height: 116px;
      box-sizing: border-box;
      line-height: 116px;
      border-radius: 2px;
      background: #4993FF;
      position: relative;
      .system-name{
        font-size: 24px;
        color: #fff;
        font-weight: 600;
        font-family:PingFangSC-Semibold;
        line-height: 33px;
      }
      .system-img{
        height: 56px;
        width: 56px;
        margin-top: -10px;
        line-height: 56px;
        float: right;
        &>img{
          width: 56px;
          margin: 0px;
        }
      }
      .system-cover{
        position: absolute;
        text-align: center;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background: rgba($color: #000000, $alpha: 0.2);
        .btn{
          color: #4993FF;
        }
        .goIn{
          margin-top: 58px;
        }
      }
      &:hover .system-cover{
        display: block;
      }
    }
    .system-title{
      padding-left: 15px;
      line-height: 36px;
    }
  }
  // 添加模块弹窗里面的模块
  .addAlertNav{
    position: absolute;
    display: flex;
    top: 0;
    left: 110px;
    height: 56px;
    .navBar{
      padding: 0 10px;
      margin-right: 10px;
      height: 56px;
      text-align: center;
      line-height: 56px;
      font-weight: 600;
    }
    &>span{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 94px;
      background: $btn-color;
      transition: 0.8s;
    }
    .clicked{
      color: $btn-color;
    }
  }
  .system-item{
    float: left;
    padding: 30px 25px;
    margin-left: 48px;
    margin-bottom: 30px;
    height: 142px;
    width: 254px;
    box-sizing: border-box;
    line-height: 142px;
    border-radius: 4px;
    background: #F5F8FF;
    background-size: cover;
    .system-name{
        font-size: 24px;
        color: #4678D1;
        font-weight: 600;
        font-family:PingFangSC-Semibold;
        line-height: 33px;
      }
      .system-img{
         height: 56px;
        width: 56px;
        float: right;
        &>img{
          height: 100%;
          width: 100%;
        }
      }
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
      .foot{
        margin-top: 30px;
        text-align: center;
        .goPay{
          width: 260px;
        }
      }
    }

  }
}
</style>
