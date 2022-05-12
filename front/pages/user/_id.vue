<template>
  <div class="user-content w-1100">
    <div class="left-user-modal">
      <div class="user-info-block">
        <div class="avatar-img">
          <img :src="userInfo.avatar || require('@/assets/images/default.png')" alt="avatar">
        </div>
        <div class="info-desc">
          <h3>{{ userInfo.nickname }} 
            <span
              :class="{ 'icon-nan': userInfo.gender === '0', 'icon-nv' : userInfo.gender === '1' }" 
              class="iconfont"></span></h3>
          <div v-if="userInfo.id !== sessionInfo.id" class="desc">
            <p><span class="iconfont icon-ai-briefcase"></span>{{ userInfo.job || '该用户还未更新职业' }}</p>
            <p><span style="font-size: 18px" class="iconfont icon-mingpian"></span>{{ userInfo.description || '该用户什么都没留下' }}</p>
          </div>
          <div v-else class="desc update-desc">
            <p v-if="userInfo.job"><span class="iconfont icon-ai-briefcase"></span>{{ userInfo.job }}</p>
            <nuxt-link v-else to="/setting/profile">
              <a-icon type="edit" />你的职业是什么？
            </nuxt-link>
            <p v-if="userInfo.description"><span style="font-size: 18px" class="iconfont icon-mingpian"></span>{{ userInfo.description }}</p>
            <nuxt-link v-else to="/setting/profile">
              <a-icon type="edit" />你有什么想说的？
            </nuxt-link>
          </div>
        </div>
        <div class="right-operate">
          <div v-if="userInfo.id !== sessionInfo.id">
            <a-button 
              v-if="!isFocus"
              type="dashed"
              icon="user-add"
              @click="updateUserFocus(true)">关注</a-button>
            <a-button 
              v-else
              type="dashed"
              icon="check"
              @click="updateUserFocus(false)">已关注</a-button>
          </div>
          <a-button 
            v-else 
            type="dashed"
            icon="edit"
            @click="$router.push('/setting/profile')">编辑个人资料</a-button>
        </div>
      </div>
      <ul class="tab-tag">
        <li 
          v-for="item in userCategoryTabs"
          :key="item.url">
          <nuxt-link :to="`/user/${userInfo.id}${item.url}`">{{ item.label }}</nuxt-link>  
        </li>
      </ul>
      <div class="category-content">
        <nuxt-child 
          :user-avatar="userInfo.avatar"
          :user-nickname="userInfo.nickname"
          :user-id="userInfo.id"></nuxt-child>
      </div>
    </div>
    <div class="right-user-modal">
      <div class="focus-account">
        <div>
          <p>关注了</p>
          <nuxt-link :to="`/user/${userInfo.id}/focus`">{{ countInfo.focusCount || 0 }}</nuxt-link>
        </div>
        <div>
          <p>关注者</p>
          <nuxt-link :to="`/user/${userInfo.id}/focus`">{{ countInfo.focusedCount || 0 }}</nuxt-link>
        </div>
      </div>
      <div class="list-block">
        <div 
          class="block pointer" 
          @click="$router.push(`/user/${userInfo.id}/collect`)">
          <p>收藏</p>
          <span>{{ countInfo.collectCounts || 0 }}</span>
        </div>
        <div class="block">
          <p>加入于</p>
          <span>{{ userInfo.createTime.substr(0, 10) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { validateUniqId } from '~/util'
import { userCategoryTabs } from '@/config/optionMap'
export default {
  name: 'IserIndex',
  layout: 'BaseLayout',
  validate ({ params }) {
    return validateUniqId(params.id)
  },
  async asyncData ({ $axios, params }) {
    try {
      const { data } = await $axios.get(`/api/v1/users/userinfo?id=${params.id}`)
      return {
        userInfo: data
      }
    } catch (error) {
      return {
        userInfo: ''
      }
    }
  },
  data () {
    return {
      userCategoryTabs,
      countInfo: '',
      isFocus: false
    }
  },

  head() {
    return {
      title: this.userInfo.nickname + '的个人主页',
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: this.userInfo.nickname + '的个人主页' }
      ]
    }
  },

  computed: {
    ...mapState({
      sessionInfo: state => state.userInfo
    })
  },

  created () {
    this.finIsFocus()
    this.findAllCounts()
  },

  methods: {
    /**
     * 查询该用户是否已经被自己关注
     */
    async finIsFocus () {
      try {
         const { data } = await this.$axios(`/api/v1/users/isfocususer?focusId=${this.userInfo.id}`)
         this.isFocus = data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 查询关注、被关注以及收藏的数量
     */
    async findAllCounts () {
      try {
        const { data } = await this.$axios.get(`/api/v1/users/getcounts?userId=${this.userInfo.id}`)
        this.countInfo = data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * user focus user
     * @param { Boolean } state true - focus  false - unfocus
     */
    async updateUserFocus (state) {
      if (!this.sessionInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = state ? '/users/focususer' : '/users/unfocususer'
        const focusId = this.userInfo.id
        await this.$axios.get(`/api/v1${API}?focusId=${focusId}`)
        this.isFocus = !this.isFocus
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-content {
  .left-user-modal {
    width: 708px;
    .user-info-block {
      background: #fff;
      display: flex;
      padding: 30px;
      box-sizing: border-box;
      .avatar-img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .info-desc {
        padding: 0 20px;
        flex: 1;
        width: 0;
        h3 {
          font-size: 20px;
          color: #000;
          font-weight: bold;
          margin-bottom: 6px;
          span {
            position: relative;
            top: -10px;
            font-size: 12px;
            &.icon-nan {
              color: #2080f7;
            }
            &.icon-nv {
              color: rgb(255,77,148);
            }
          }
        }
        .desc {
          p {
            line-height: 28px;
            color: #72777b;
            span {
              margin-right: 8px;
            }
          }
        }
      }
      .update-desc {
        a {
          display: block;
          line-height: 28px;
          font-size: 12px;
          color: @primary-color;
          i {
            margin-right: 2px;
            font-size: 13px;
          }
        }
      }
    }
    .tab-tag {
      background: #fff;
      height: 46px;
      margin-top: 10px;
      list-style: none;
      display: flex;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #f1f1f1;
      li {
        margin-right: 30px;
        cursor: pointer;
        position: relative;
        a {
          color: #4c4c4c;
          position: relative;
          &.nuxt-link-exact-active {
            color: #000;
            &:after {
              content: "";
              width: 10px;
              height: 4px;
              position: absolute;
              background: @primary-color;
              bottom: -12px;
              left: 50%;
              margin-left: -5px;
              border-radius: 2px;
            }
          }
        }
      }
    }
  }
  .right-user-modal {
    position: fixed;
    top: 80px;
    margin-left: 736px;
    width: 240px;
    .focus-account {
      background: #fff;
      display: flex;
      padding: 16px 0 10px 0;
      & > div {
        width: 50%;
        text-align: center;
        position: relative;
        p {
          margin-bottom: 4px;
          color: #000;
          font-size: 16px;
        }
        a {
          color: #999;
          font-size: 16px;
        }
        &:first-child:after {
          content: "";
          width: 1px;
          height: 24px;
          background: #f0eeee;
          right: 0;
          top: 14px;
          position: absolute;
        }
      }
    }
    .list-block {
      margin-top: 10px;
      background: #fff;
      .block {
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        justify-content: space-between;
        &.pointer {
          cursor: pointer;
        }
        p {
          color: #000;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #f1f1f1;
        }
      }
    }
  }
}
</style>f