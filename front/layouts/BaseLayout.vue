<template>
  <div class="base-layout">
    <header>
      <div class="header-t w-1100">
        <div class="logo">
          <nuxt-link to="/">
            <img src="@/assets/images/logo.png" alt="">
          </nuxt-link>
        </div>
        <div class="nav-menu">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/sharecircle">友圈</nuxt-link>
          <nuxt-link to="/feedback">反馈</nuxt-link>
        </div>
        <div class="right-operate">
          <div class="search-model">
            <a-icon type="search" />
            <input 
              v-model="searchValue" 
              type="text" 
              placeholder="关键字搜索" 
              class="s-input"
              @keypress.enter="vagueSearch">
          </div>
          <a-button 
            type="primary"
            class="create-button"
            @click="toCreatorCenter">创作者中心</a-button>
          <a-badge v-if="userInfo" :count="notifyCount" dot style="margin-right: 16px;">
            <nuxt-link class="iconfont icon-notify" to="/notification"></nuxt-link>
          </a-badge>
          <a-button 
            v-if="!userInfo"
            type="dashed"
            @click="$store.commit('UPDATE_LOGIN_VISIBLE', true)">登录</a-button>
          <a-popover v-else trigger="hover" placement="bottom">
            <div slot="content" class="cover-image-popover">
              <div>
                <p><nuxt-link to="/writecenter" target="_blank"><i class="iconfont icon-article"></i>写文章</nuxt-link></p>
              </div>
              <div>
                <p><nuxt-link to="/setting/profile"><i class="iconfont icon-set_item1"></i>修改资料</nuxt-link></p>
                <p><nuxt-link :to="`/user/${userInfo.id}`"><i class="iconfont icon-40one"></i>我的主页</nuxt-link></p>
                <p><nuxt-link :to="`/user/${userInfo.id}/collect`"><i class="iconfont icon-shoucang"></i>我的收藏</nuxt-link></p>
                <p><nuxt-link :to="`/user/${userInfo.id}/focus`"><i class="iconfont icon-wodeguanzhu"></i>我的关注</nuxt-link></p>
                <p><nuxt-link :to="`/user/${userInfo.id}/agree`"><i class="iconfont icon-zan"></i>我的点赞</nuxt-link></p>
                <p><nuxt-link :to="`/browsehistory`"><i class="iconfont icon-liulan"></i>浏览记录</nuxt-link></p>
              </div>
              <div>
                <p class="pad-ing" @click="userLogout"><i class="iconfont icon-tuichudenglu"></i>退出登录</p>
              </div>
            </div>
            <div class="cover-img">
              <img :src="userInfo.avatar || require('@/assets/images/default.png')" alt="avatar">
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
    <a-modal 
      :visible="!!previewImgSrc" 
      :footer="null" 
      @cancel="$store.commit('UPDATE_PREVIEW_IMGSRC', null)">
      <img alt="example" style="width: 100%" :src="previewImgSrc" />
    </a-modal>
    <div class="fixed-operate-block">
      <a-back-top>
        <div class="ant-back-top-inner"><span class="iconfont icon-arrow-to-top"></span></div>
      </a-back-top>
      <nuxt-link class="feedback-submit-block" to="/feedback" target="_blank">
        <span class="icon-pinglun iconfont"></span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoginModal from '~/components/LoginModal'
export default {
  components: { LoginModal },
  data () {
    return {
      searchValue: ''
    }
  },
  computed: {
    ...mapState({
      loginModalVisible: state => state.loginModalVisible,
      userInfo: state => state.userInfo,
      notifyCount: state => state.notifyCount,
      previewImgSrc: state => state.previewImgSrc
    })
  },
  
  created () {
    if (this.userInfo && process.client) {
      this.getNotifyCount()
    }
  },

  methods: {
    userLogout () {
      this.$cookies.remove('ACCESS_TOKEN')
      this.$store.commit('UPDATE_USER_INFO', '')
      this.$router.replace('/')
      setTimeout(() => {
        location.reload()
      }, 300)
    },

    toCreatorCenter () {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      const routerObject= this.$router.resolve({ path: '/writecenter' })
      window.open(routerObject.href, '_blank')
    },

    async getNotifyCount () {
      try {
        const { data } = await this.$axios.get('/api/v1/messages/count')
        this.$store.commit('UPDATE_NOTIFY_COUNT', data.allCount)
      } catch (error) {}
    },

    vagueSearch () {
      if (this.searchValue) {
        this.$router.push({
          path: '/search',
          query: {
            value: this.searchValue,
            type: '1'
          }
        })
      }
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
      .logo {
        display: flex;
        align-items: center;
        img {
          height: 60px;
          display: block;
        }
      }
      .nav-menu {
        flex: 1;
        width: 0;
        padding: 0 20px;
        a {
          color: #86909c;
          margin-right: 20px;
          font-weight: bold;
          &.nuxt-link-exact-active {
            color: @primary-color;
          }
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
        .icon-notify {
          font-size: 22px;
          color: #999;
        }
        .cover-img {
          width: 36px;
          height: 36px;
          overflow: hidden;
          border-radius: 50%;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
          }
        }
      }
    }
  }
  section {
    padding-top: 60px;
    flex: 1;
    height: 0;
  }
  .fixed-operate-block {
    position: fixed;
    right: 30px;
    bottom: 20px;
    .ant-back-top {
      position: static
    }
    .feedback-submit-block, .ant-back-top-inner {
      height: 40px;
      width: 40px;
      line-height: 40px;
      border-radius: 4px;
      background-color: @primary-color;
      color: #fff;
      text-align: center;
      font-size: 20px;
      border-radius: 50%;
      margin-top: 20px;
      display: block;
    }
  }
}
</style>