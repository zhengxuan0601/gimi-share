<template>
  <div class="setting-account">
    <h3>账号设置</h3>
    <div class="content">
      <div class="label-form">
        <p>邮箱</p>
        <span>{{ userInfo.email || '--' }}</span>
        <em v-if="!userInfo.email" @click="emailModalVisible = true">立即绑定</em>
      </div>
      <div class="label-form">
        <p>密码</p>
        <span>******</span>
        <em>重置</em>
      </div>
    </div>
    <EmailModal
      v-if="emailModalVisible"
      @close-modal="emailModalVisible = false" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EmailModal from '@/components/EmailModal.vue'
export default {
  name: 'AccountPage',
  components: { EmailModal },
  data () {
    return {
      emailModalVisible: false
    }
  },

  head() {
    return {
      title: this.userInfo.nickname + '账号修改',
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: this.userInfo.nickname + '账号修改' }
      ]
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  }
}
</script>

<style scoped lang="less">
.setting-account {
  h3 {
    color: #000;
    font-weight: bold;
    font-size: 22px;
    letter-spacing: 2px;
    border-bottom: 1px solid #f1f1f1;
    padding: 20px 30px;
  }
  .content {
    padding: 0 30px;
    margin-top: 20px;
    .label-form {
      display: flex;
      font-size: 16px;
      padding: 12px 0;
      span {
        flex: 1;
        padding: 0 20px;
        color: #999;
      }
      em {
        color: @primary-color;
        font-size: 14px;
        font-style: normal;
        cursor: pointer;
      }
    }
  }
}
</style>
