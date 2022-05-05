<template>
  <div class="login-wrapper">
    <div class="modal">
      <a-icon 
        type="close"
        @click="$emit('close-modal')"/>
      <a-form-model
        ref="emailForm"
        :model="emailForm"
        :rules="loginRules"
      >
        <h3>邮箱绑定</h3>
        <a-form-model-item prop="email">
          <a-input 
            v-model="emailForm.email" 
            placeholder="请输入邮箱"
            size="large">
            <div slot="suffix" class="send-email-code">
              <p v-if="!countdown && !sendLoading" @click="sendEmail">发送验证码</p>
              <span v-if="countdown && !sendLoading">{{ countdown }} s</span>
              <a-icon v-if="sendLoading" type="loading" />
            </div>
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="code">
          <a-input
            v-model="emailForm.code"
            size="large"
            class="code-input"
            placeholder="请输入验证码" />
        </a-form-model-item>
        <a-button
          block 
          size="large" 
          type="primary" 
          @click="submituserInfo">绑定</a-button>
        <p class="tip"><span>绑定邮箱</span>后可进行重置密码</p>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      emailForm: {
        email: '',
        code: ''
      },
      loginRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' }
        ],
        code: [
          { required: true, message: 'Please input code', trigger: 'blur' },
          { min: 4, max: 4, message: 'Length should be 4', trigger: 'blur' }
        ],
      },
      countdown: null,
      countdownTimer: null,
      sendLoading: false
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  beforeDestroy () {
    clearInterval(this.countdownTimer)
  },

  methods: {
    /**
     * bind email request
     */
    submituserInfo () {
      this.$refs.emailForm.validate(async value => {
        if (value) {
          try {
            await this.$axios.post('/api/v1/users/bindemail', this.emailForm)
            this.$message.success('绑定邮箱成功')
            this.$emit('close-modal')
            this.$store.commit('UPDATE_USER_INFO', {
              ...this.userInfo,
              email: this.emailForm.email
            })
          } catch (error) {
            console.log(error)
          }
        }
      })
    },

    /**
     * send email
     */
    async sendEmail () {
      if (!this.emailForm.email) {
        return this.$message.info('请输入邮箱')
      }
      const REG_EMAIL = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!REG_EMAIL.test(this.emailForm.email)) {
        return this.$message.info('邮箱格式不正确')
      }
      this.sendLoading = true
      try {
        await this.$axios.get(`/api/v1/unit/emailcode?email=${this.emailForm.email}`)
        this.sendLoading = false
        this.countdown = 60
        this.countdownTimer = setInterval(() => {
          this.countdown--
          if (this.countdown === 0) {
            this.countdown = null
            clearInterval(this.countdownTimer)
          }
        }, 1000)
      } catch (error) {
        this.sendLoading = false
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less">
.login-wrapper {
  position: fixed;
  background: rgba(0,0,0,.3);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .modal {
    padding: 30px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -160px;
    width: 320px;
    margin-top: -200px;
    box-shadow: 0 0 6px 3px rgba(0,0,0,.1);
    .anticon-close {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 14px;
      opacity: .8;
      cursor: pointer;
    }
    h3 {
      font-weight: bold;
      color: #252933;
      font-size: 16px;
      padding-bottom: 20px;
    }
    .ant-form-horizontal {
      .ant-form-item {
        margin-bottom: 12px;
        &:nth-of-type(3) {
          margin-bottom: 6px;
          .ant-form-item-control {
            line-height: normal;
          }
        }
        .ant-form-item-children {
          display: flex;
          align-items: center;
          .code-input {
            width: 110px;
            margin-right: 10px;
          }
        }
      }
      .ant-btn-block {
        font-size: 14px;
        margin-top: 10px;
      }
      .tip {
        margin-top: 20px;
        font-size: 12px;
        color: #999;
        span {
          color: #2080f7;
        }
      }
      .send-email-code {
        p {
          color: #2080f7;
          cursor: pointer;
          font-size: 12px;
        }
        span {
          color: #999;
        }
      }
    }
  }
}
</style>