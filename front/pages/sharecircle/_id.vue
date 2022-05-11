<template>
  <div class="circle-content-block w-1100">
    <div class="circle-content-block-left">
      <client-only>
        <div slot="placeholder" style="background: #fff; padding: 20px 20px 30px;">
          <a-skeleton active :rows="4" />
        </div>
        <div class="share-block">
          <div class="top">
            <div class="left-avatar">
              <nuxt-link :to="`/user/${circleDetail.userId}`">
                <img 
                  :src="circleDetail.avatar || require('~/assets/images/default.png')" 
                  alt="avatar">
              </nuxt-link>
            </div>
            <div class="right-info">
              <p class="nickname">
                <nuxt-link :to="`/user/${circleDetail.userId}`">{{ circleDetail.nickname }}</nuxt-link>
              </p>
              <p class="desc"><span v-if="circleDetail.job">{{ circleDetail.job }} · </span>{{ cycleDate(circleDetail.createTime) }}</p>
              <p class="share-info">{{ circleDetail.content }}</p>
              <div 
                v-if="circleDetail.picList" 
                class="img-box">
                <div 
                  v-for="item in circleDetail.picList.split(';')"
                  :key="item" 
                  class="share-img" 
                  @click="handlePreview({ url: item })">
                  <img :src="item" alt="shareImg">
                </div>
              </div>
            </div>
            <div v-if="userInfo.id !== circleDetail.userId">
              <a-button
                v-if="!isFocususer"
                icon="user-add" 
                type="dashed" 
                class="focus-btn"
                @click="updateUserFocus(true)">关注</a-button>
              <a-button 
                v-else 
                type="dashed"
                icon="check"
                @click="updateUserFocus(false)">已关注</a-button>
            </div>
          </div>
          <div class="bottom">
            <div>
              <a-icon type="message" />
              <span v-if="circleDetail.commentCount">{{ circleDetail.commentCount }}</span>
            </div>
            <div 
              :class="{ like: circleDetail.isLiker }"
              @click="isLikeCircle">
              <a-icon type="like" />
              <span v-if="circleDetail.agreeCount">{{ circleDetail.agreeCount }}</span>
            </div>
          </div>
        </div>
        <CircleComments
          :circle-detail="circleDetail" />
      </client-only>
    </div>
    <div class="circle-content-block-right"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CircleComments from './components/CircleComments'
import { cycleDate, validateUniqId } from '~/util'
export default {
  name: 'ShareCircleDetail',
  components: { CircleComments },
  layout: 'BaseLayout',
  validate ({ params }) {
    return validateUniqId(params.id)
  },
  async asyncData ({ $axios, params }) {
    try {
      const { data = {} } = await $axios.get(`/api/v1/shares/info?circleId=${params.id}`)
      const focusId = data.userId
      const isFocususer = (await $axios.get(`/api/v1/users/isfocususer?focusId=${focusId}`)).data
      return {
        circleDetail: data,
        isFocususer
      }
    } catch (error) {
      return {
        circleDetail: {},
        isFocususer: false
      }
    }
  },

  data () {
    return {
      cycleDate
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
     * @param { Boolean } state true - focus  false - unfocus
     */
    async updateUserFocus (state) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = state ? '/users/focususer' : '/users/unfocususer'
        const focusId = this.circleDetail.userId
        await this.$axios.get(`/api/v1${API}?focusId=${focusId}`)
        this.isFocususer = !this.isFocususer
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * user like or unlike sharecircle
     * @param { Object } circleItem
     */
    async isLikeCircle () {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = this.circleDetail.isLiker ? '/shares/unagree' : '/shares/agree'
        await this.$axios.get(`/api/v1${API}?id=${this.circleDetail.id}`)
        if (this.circleDetail.isLiker) {
          this.circleDetail.agreeCount -= 1
        } else {
          this.circleDetail.agreeCount += 1
        }
        this.circleDetail.isLiker = !this.circleDetail.isLiker
      } catch (error) {}
    },
  }
}
</script>

<style scoped lang="less">
  .circle-content-block {
    &-left {
      width: 708px;
      .share-block {
        .top {
          position: relative;
          .focus-btn {
            position: absolute;
            right: 20px;
            top: 20px;
          }
        }
        .share-info  {
          padding: 10px 0;
        }
      }
    }
    &-right {
      position: fixed;
      top: 80px;
      margin-left: 736px;
      width: 240px;
    }
  }
</style>