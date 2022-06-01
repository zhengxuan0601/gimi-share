<template>
  <div class="vague-search-user">
    <div 
      v-if="loading"
      slot="placeholder" 
      style="background: #fff; padding: 20px 30px;">
      <a-skeleton active />
    </div>
    <div 
      v-if="!list.length && !loading" 
      style="padding: 30px 0; background: #FFF; margin-top: 16px;">
      <a-empty 
        description="空空如也" 
        :image="require('~/assets/images/nodata.png')" /></div>
    <div v-if="!loading" class="content">
      <div 
        v-for="item in list" 
        :key="item.id" 
        class="user-modal">
        <nuxt-link 
          :to="`/user/${item.id}`"
          target="_blank" 
          class="left-avatar">
          <img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar">
        </nuxt-link >
        <nuxt-link
          :to="`/user/${item.id}`"
          target="_blank" 
          class="center-info">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p><span v-html="item.nickname"></span><em v-if="item.job">{{ item.job }}</em></p>
          <div>
            <span v-if="item.circleCount">{{ item.circleCount }} 个友圈 ·</span>
            <span v-if="item.focusedCount">{{ item.focusedCount }} 个关注者 ·</span>
            <span v-if="item.articleCount">{{ item.articleCount }} 篇文章</span>
          </div>
        </nuxt-link >
        <div class="right-operate" @click.stop>
          <a-button 
            v-if="userInfo.id !== item.id"
            :icon="item.isFocuser ? 'check' : 'user-add'"
            type="dashed" 
            @click.stop="updateUserFocus(item, item.isFocuser)">{{ item.isFocuser ? '已关注' : '关注' }}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SearchUser',
  props: {
    searchValue: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      pageNo: 1,
      list: [],
      loading: false
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  watch: {
    searchValue: {
      handler () {
        this.loading = true
        this.vagueSearchUser()
      },
      immediate: true
    }
  },

  methods: {
    async vagueSearchUser () {
      try {
        const searchParams = {
          value: this.searchValue,
          pageNo: this.pageNo,
          pageSize: 20,
          type: '2'
        }
        const { data } = await this.$axios.post('/api/v1/statistics/search', searchParams)
        this.list = data.list.map(u => {
          const oRegExp = new RegExp('(' + this.searchValue + ')', "ig")
          const htmlNickname = u.nickname.replace(oRegExp,`<i class="keyword">$1</i>`)
          return {
            ...u,
            nickname: htmlNickname
          }
        })
      } catch (error) {
      } finally {
        this.loading = false
      }
    },

    /**
     * user focus user
     * @param { Object } userItem
     * @param { Boolean } state true - focus  false - unfocus
     */
    async updateUserFocus (userItem, state) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = !state ? '/users/focususer' : '/users/unfocususer'
        const focusId = userItem.id
        await this.$axios.get(`/api/v1${API}?focusId=${focusId}`)
        userItem.isFocuser = !userItem.isFocuser
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less">
.vague-search-user {
  .content {
    .user-modal {
      display: flex;
      padding: 20px;
      align-items: center;
      justify-content: space-between;
      &:not(:last-child) {
        border-bottom: 1px solid #f1f1f1;
      }
      .left-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        overflow: hidden;
        display: block;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .center-info {
        padding: 0 10px;
        flex: 1;
        display: block;
        & > p {
          span {
            color: #2e3135;
            font-size: 16px;
            font-weight: bold;
            .keyword {
              font-style: normal;
              color: #f03535;
            }
          }
          em {
            font-size: 12px;
            color: #999;
            font-style: normal;
            margin-left: 6px;
          }
        }
        & > div {
          margin-top: 2px;
          span {
            color: #8a9aa9;
            margin-right: 6px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>