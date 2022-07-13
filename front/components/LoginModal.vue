<template>
  <div class="login-wrapper">
    <div class="modal">
      <a-icon 
        type="close" 
        @click="$store.commit('UPDATE_LOGIN_VISIBLE', false)" />
      <a-form-model
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
      >
        <h3 v-if="!isEmailVisible">用户名{{ isRegister ? '注册' : '登录' }}</h3>
        <h3 v-else>邮箱登录</h3>
        <!-- 用户名密码操作 -->
        <div v-if="!isEmailVisible">
          <a-form-model-item placeholder="" prop="username">
            <a-input 
              v-model="loginForm.username" 
              placeholder="请输入账号"
              size="large" />
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input-password
              v-model="loginForm.password"
              size="large" 
              placeholder="请输入密码" />
          </a-form-model-item>
          <a-form-model-item prop="code" style="display: flex;">
            <a-input
              v-model="loginForm.code"
              size="large"
              class="code-input"
              placeholder="请输入验证码" />
            <!-- eslint-disable vue/no-v-html -->
            <div
              style="cursor: pointer" 
              class="code" 
              @click="getVerificationcode" 
              v-html="codeImage"></div>
          </a-form-model-item>
        </div>
        <!-- 邮箱验证码操作 -->
        <div v-else>
          <a-form-model-item prop="email">
            <a-input 
              v-model="loginForm.email" 
              placeholder="请输入邮箱"
              size="large">
              <div slot="suffix" class="send-email-code">
                <p v-if="!countdown && !sendLoading" @click="sendEmail">发送验证码</p>
                <a-icon v-if="sendLoading" type="loading" />
              </div>
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="emailCode">
            <a-input
              v-model="loginForm.emailCode"
              size="large"
              placeholder="请输入验证码">
              <div slot="suffix" class="send-email-code">
                <span v-if="countdown && !sendLoading">{{ countdown }} s后重新发送</span>
              </div>
            </a-input>
          </a-form-model-item>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <a-button 
            v-if="!isRegister"
            style="padding: 0; font-size: 12px;"
            type="link"
            size="small" 
            @click="isEmailVisible = !isEmailVisible">{{ !isEmailVisible ? '邮箱登录' : '用户名登录' }}</a-button>
          <a-button
            v-if="!isEmailVisible" 
            style="padding: 0; font-size: 12px;"
            type="link"
            size="small" 
            @click="isRegister = !isRegister">前往{{ !isRegister ? '注册' : '登录' }}</a-button>
        </div>
        <a-button
          block 
          size="large" 
          type="primary" 
          @click="submituserInfo">立即{{ isRegister ? '注册' : '登录' }}</a-button>
        <p class="tip"><span>注册、登录</span> 后即可进行文章发布</p>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { encrypt } from '@/util'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        email: '',
        emailCode: ''
      },
      loginRules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 5, max: 16, message: 'Length should be 5 to 16', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { min: 5, max: 16, message: 'Length should be 5 to 16', trigger: 'blur' }
        ],
        code: [
          { required: true, message: 'Please input code', trigger: 'blur' },
          { min: 4, max: 4, message: 'Length should be 4', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email', type: 'email', trigger: 'blur' },
          { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/, message: 'email is not valid' }
        ],
        emailCode: [
          { required: true, message: 'Please input emailCode', trigger: 'blur' },
          { min: 4, max: 4, message: 'Length should be 4', trigger: 'blur' }
        ],
      },
      isRegister: false,
      codeImage: "",
      countdown: null,
      sendLoading: false,
      isEmailVisible: false
    }
  },

  created () {
    this.getVerificationcode()
  },

  methods: {
    async getVerificationcode () {
      const { data } = await this.$axios.get('/api/v1/unit/verificatecode')
      this.codeImage = data
    },

    /**
     * username or email login
     */
    submituserInfo () {
      this.$refs.loginForm.validate(value => {
        if (value) {
          if (!this.isRegister) {
            this.userEnterLogin()
          } else {
            this.userEnterRegister()
          }
        }
      })
    },

    /**
     * user login
     * @param { Boolean } isRegisterEnter 是否注册后直接登录
     */
    async userEnterLogin (isRegisterEnter) {
      try {
        const aesPublicKey = (await this.$axios.get('/api/v1/unit/getpublickey')).data
        const searchParams = this.isEmailVisible ? {
          email: this.loginForm.email,
          code: this.loginForm.emailCode,
          emailLogin: true
        } : {
          ...this.loginForm,
          password: encrypt(this.loginForm.password, aesPublicKey.aesKey, aesPublicKey.aesIv)
        }
        const { data } = await this.$axios.post(`/api/v1/users/login`, searchParams)
        !isRegisterEnter && this.$message.success('登录成功')
        this.$cookies.set('ACCESS_TOKEN', data.accessToken, {
          path: '/', 
          maxAge: 60 * 60 * 24
        })
        this.$store.commit('UPDATE_USER_INFO', data)
        location.reload()
      } catch (error) {}
    },

    /**
     * user register
     */
    async userEnterRegister () {
      const aesPublicKey = (await this.$axios.get('/api/v1/unit/getpublickey')).data
      try {
        const searchParams = {
          ...this.loginForm,
          password: encrypt(this.loginForm.password, aesPublicKey.aesKey, aesPublicKey.aesIv)
        }
        await this.$axios.post(`/api/v1/users/registeruser`, searchParams)
        this.$message.success('注册成功')
        this.userEnterLogin(true)
      } catch (error) {}
    },

    /**
     * send email
     */
    async sendEmail () {
      const REG_EMAIL = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!REG_EMAIL.test(this.loginForm.email)) {
        return this.$message.info('邮箱格式不正确')
      }
      this.sendLoading = true
      try {
        await this.$axios.get(`/api/v1/unit/emailcode?email=${this.loginForm.email}`)
        this.countdown = 60
        this.countdownTimer = setInterval(() => {
          this.countdown--
          if (this.countdown === 0) {
            this.countdown = null
            clearInterval(this.countdownTimer)
          }
        }, 1000)
      } catch (error) {} finally {
        this.sendLoading = false
      }
    }
  }
}
</script>