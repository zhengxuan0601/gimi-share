<template>
  <div class="focus-category-modal">
    <div v-if="loading" style="padding: 20px;">
      <a-skeleton active />
    </div>
    <client-only v-else>
      <div class="focus-tab">
        <div 
          :class="{ active: currentKey === 'focusdata' }" 
          @click="currentKey = 'focusdata'">关注的用户</div>
        <div 
          :class="{ active: currentKey === 'focuseddata' }" 
          @click="currentKey = 'focuseddata'">关注者</div>
      </div>
      <div 
        v-if="!focusInfo[currentKey].length" 
        style="padding: 30px 0;">
        <a-empty 
          description="空空如也" 
          :image="require('@/assets/images/nodata.png')" /></div>
      <div v-else>
        <div class="focus-user">
          <div v-for="item in focusInfo[currentKey]" :key="item.id" class="user-modal">
            <div class="avatar">
              <nuxt-link :to="`/user/${item.id}`">
                <img :src="item.avatar || require('@/assets/images/default.png')" alt="avatar">
              </nuxt-link>
            </div>
            <p class="nickname">
              <nuxt-link :to="`/user/${item.id}`">{{ item.nickname }}</nuxt-link>
            </p>
            <div v-if="userInfo.id !== item.id">
              <a-button 
                v-if="!item.isFocus"
                type="dashed"
                icon="user-add"
                @click="updateUserFocus(item)">关注</a-button>
              <a-button 
                v-else
                type="dashed"
                icon="check"
                @click="updateUserFocus(item)">已关注</a-button>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    focusInfo: {
      type: Object,
      default: () => {
        return {
          focusdata: [],
          focuseddata: []
        }
      }
    },
    loading: Boolean
  },

  data () {
    return {
      currentKey: 'focusdata'
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  methods: {
     /**
     * user focus user
     * @param { Object } userItem
     */
    async updateUserFocus (userItem) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = !userItem.isFocus ? '/users/focususer' : '/users/unfocususer'
        await this.$axios.get(`/api/v1${API}?focusId=${userItem.id}`)
        userItem.isFocus = !userItem.isFocus
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
.focus-category-modal {
  background: #fff;
  .focus-tab {
    height: 48px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;
    align-items: center;
    & > div {
      margin-left: 20px;
      cursor: pointer;
      font-weight: bold;
      &.active {
        color: #000;
      }
    }
  }
  .focus-user {
    .user-modal {
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      height: 90px;
      align-items: center;
      padding: 0 30px;
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        a {
          display: block;
          height: 100%;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .nickname {
        font-size: 18px;
        margin-left: 16px;
        font-weight: bold;
        flex: 1;
        width: 0;
        a {
          color: #000;
        }
      }
    }
  }
}
</style>