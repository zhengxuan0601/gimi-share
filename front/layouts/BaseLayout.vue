<template>
  <div class="base-layout">
    <header>
      <div class="header-t w-1100">
        <div class="logo">
          <nuxt-link to="/">
            <img src="@/assets/images/logo.png" alt="">
          </nuxt-link>
        </div>
        <div class="right-operate">
          <div class="search-model">
            <a-icon type="search" />
            <input type="text" placeholder="关键字搜索" class="s-input">
          </div>
          <button class="a-primary create-button">创作者中心</button>
          <button 
            v-if="!userInfo"
            class="a-primary dashed"
            @click="$store.commit('UPDATE_LOGIN_VISIBLE', true)">登录</button>
          <a-popover v-else trigger="hover" placement="bottom">
            <div slot="content" class="cover-image-popover">
              <div class="nickname">{{ userInfo.nickname }}</div>
              <p><nuxt-link to="/writecenter"><a-icon type="file-add" />写文章</nuxt-link></p>
              <p><a-icon type="user" />我的主页</p>
              <p><a-icon type="form" />修改资料</p>
              <p @click="userLogout"><a-icon type="poweroff" />退出登录</p>
            </div>
            <div class="cover-img">
              <img :src="userInfo.avatar" alt="">
            </div>
          </a-popover>
        </div>
      </div>
    </header>
    <section>
      <Nuxt></Nuxt>
    </section>
    <LoginModal
      v-if="loginModalVisible" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoginModal from '@/components/LoginModal'
export default {
  components: { LoginModal },
  computed: {
    ...mapState({
      loginModalVisible: state => state.loginModalVisible,
      userInfo: state => state.userInfo
    })
  },

  methods: {
    userLogout () {
      this.$cookies.remove('ACCESS_TOKEN')
      localStorage.removeItem('accessToken')
      this.$store.commit('UPDATE_USER_INFO', '')
      this.$router.replace('/')
      setTimeout(() => {
        location.reload()
      }, 200)
    }
  }
}
</script>

<style scoped lang="less">
.base-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 30px;
  header {
    height: 60px;
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    border-bottom: 1px solid #f1f1f1;
    z-index: 999;
    background: #fff;
    overflow: hidden;
    .header-t {
      align-items: center;
      display: flex;
      justify-content: space-between;
      .logo {
        display: flex;
        align-items: center;
        img {
          height: 60px;
          display: block;
        }
      }
      .right-operate {
        display: flex;
        align-items: center;
        .search-model {
          position: relative;
          width: 216px;
          height: 30px;
          .s-input {
            width: 100%;
            height: 100%;
            outline: none;
            border: 1px solid #e3e3e3;
            border-radius: 15px;
            padding: 0 32px;
            box-sizing: border-box;
            font-size: 12px;
            transition: .2s;
            color: #000;
            &:focus {
              border-color: #42b983;
            }
          }
          .anticon-search {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            color: #999;
          }
        }
        .create-button {
          margin: 0 16px;
        }
        .cover-img {
          width: 36px;
          height: 36px;
          overflow: hidden;
          border-radius: 50%;
          cursor: pointer;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  section {
    padding-top: 80px;
    flex: 1;
    height: 0;
    width: 1100px;
    margin: 0 auto;
  }
}

</style>