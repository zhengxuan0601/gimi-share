<template>
  <div class="login-wrapper">
    <div class="modal">
      <a-icon 
        type="close"
        @click="$emit('close-modal')"/>
      <a-form-model
        ref="updatePasswordForm"
        :model="updatePasswordForm"
        :rules="loginRules"
      >
        <h3>{{ isEmailUpdate ? '邮箱' : '原密码' }}重置密码</h3>
        <a-form-model-item v-if="isEmailUpdate" prop="email">
          <a-input 
            v-model="updatePasswordForm.email" 
            placeholder="请输入邮箱"
            size="large">
            <div slot="suffix" class="send-email-code">
              <p v-if="!countdown && !sendLoading" @click="sendEmail">发送验证码</p>
              <a-icon v-if="sendLoading" type="loading" />
            </div>
          </a-input>
        </a-form-model-item>
        <a-form-model-item v-if="isEmailUpdate" prop="code">
          <a-input
            v-model="updatePasswordForm.code"
            size="large"
            placeholder="请输入验证码">
            <div slot="suffix" class="send-email-code">
              <span v-if="countdown && !sendLoading">{{ countdown }} s后重新发送</span>
            </div>
          </a-input>
        </a-form-model-item>
        <a-form-model-item v-if="!isEmailUpdate" prop="oldpassword">
          <a-input-password
            v-model="updatePasswordForm.oldpassword"
            size="large"
            placeholder="请输入旧密码">
          </a-input-password>
        </a-form-model-item>
        <a-form-model-item prop="newpassword">
          <a-input-password
            v-model="updatePasswordForm.newpassword"
            size="large"
            placeholder="请输入新密码">
          </a-input-password>
        </a-form-model-item>
        <a-button
          block 
          size="large" 
          type="primary" 
          @click="submitUpdatePassword">绑定</a-button>
        <p class="tip">使用
          <span 
            style="cursor: pointer;"
            @click="isEmailUpdate = !isEmailUpdate">{{ isEmailUpdate ? '密码' : '邮箱' }}</span>
          重置密码
        </p>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { encrypt } from '@/util'
export default {
  data () {
    return {
      updatePasswordForm: {
        email: '',
        code: '',
        oldpassword: '',
        newpassword: ''
      },
      loginRules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' }
        ],
        code: [
          { required: true, message: 'Please input code', trigger: 'blur' },
          { min: 4, max: 4, message: 'Length should be 4', trigger: 'blur' }
        ],
        oldpassword: [
          { required: true, message: 'Please input oldpassword', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: 'Please input newpassword', trigger: 'blur' }
        ]
      },
      countdown: null,
      countdownTimer: null,
      sendLoading: false,
      isEmailUpdate: true
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
     * change user password
     */
    submitUpdatePassword () {
      this.$refs.updatePasswordForm.validate(async value => {
        if (value) {
          try {
            const aesPublicKey = (await this.$axios.get('/api/v1/unit/getpublickey')).data
            const requestParams = {
              ...this.updatePasswordForm,
              oldpassword: encrypt(this.updatePasswordForm.oldpassword, aesPublicKey.aesKey, aesPublicKey.aesIv),
              newpassword: encrypt(this.updatePasswordForm.newpassword, aesPublicKey.aesKey, aesPublicKey.aesIv),
              type: this.isEmailUpdate ? '0' : '1'
            }
            await this.$axios.post('/api/v1/users/updatepassword', requestParams)
            this.$message.success('修改密码成功')
            this.$emit('close-modal')
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
      if (!this.updatePasswordForm.email) {
        return this.$message.info('请输入邮箱')
      }
      const REG_EMAIL = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!REG_EMAIL.test(this.updatePasswordForm.email)) {
        return this.$message.info('邮箱格式不正确')
      }
      this.sendLoading = true
      try {
        await this.$axios.get(`/api/v1/unit/emailcode?email=${this.updatePasswordForm.email}`)
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