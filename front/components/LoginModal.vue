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
        <h3>用户{{ isRegister ? '注册' : '登录' }}</h3>
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
            class="code-input"
            placeholder="请输入验证码" />
          <!-- eslint-disable vue/no-v-html -->
          <div
            style="cursor: pointer" 
            class="code" 
            @click="getVerificationcode" 
            v-html="codeImage"></div>
        </a-form-model-item>
        <div>
          <a-button 
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
        code: ''
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
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 4, max: 4, message: 'Length should be 4', trigger: 'blur' }
        ],
      },
      isRegister: false,
      codeImage: ""
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

    submituserInfo () {
      this.$refs.loginForm.validate(async value => {
        if (value) {
          try {
            const API = this.isRegister ? '/users/registeruser' : '/users/login'
            const aesPublicKey = (await this.$axios.get('/api/v1/unit/getpublickey')).data
            const { data } = await this.$axios.post(`/api/v1${API}`, {
              ...this.loginForm,
              password: encrypt(this.loginForm.password, aesPublicKey.aesKey, aesPublicKey.aesIv)
            })
            this.$message.success(this.isRegister ? '注册成功' : '登录成功')
            if (!this.isRegister) {
              this.$cookies.set('ACCESS_TOKEN', data.accessToken, {
                path: '/', 
                maxAge: 60 * 60 * 24
              })
              this.$store.commit('UPDATE_LOGIN_VISIBLE', false)
              this.$store.commit('UPDATE_USER_INFO', data)
              location.reload()
            } else {
              this.getVerificationcode()
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
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
    }
  }
}
</style>