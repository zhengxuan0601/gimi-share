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
              <a-icon v-if="sendLoading" type="loading" />
            </div>
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="code">
          <a-input
            v-model="emailForm.code"
            size="large"
            placeholder="请输入验证码">
            <div slot="suffix" class="send-email-code">
              <span v-if="countdown && !sendLoading">{{ countdown }} s后重新发送</span>
            </div>
          </a-input>
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