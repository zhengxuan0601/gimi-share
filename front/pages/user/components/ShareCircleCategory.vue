<template>
  <div class="sharecircle-categoty-modal">
    <div v-if="loading" style="background: #fff; padding: 20px;">
      <a-skeleton active />
    </div>
    <client-only v-else>
      <div
        slot="placeholder" 
        style="background: #fff; padding: 30px 20px;">
        <a-skeleton active :paragraph="{ rows: 3 }" />
      </div>
      <div 
        v-if="!circleList.length" 
        style="padding: 30px 0;background: #fff;">
        <a-empty 
          description="空空如也" 
          :image="require('@/assets/images/nodata.png')" /></div>
      <!-- 友圈分享列表 -->
      <div v-else class="shart-list-block">
        <div 
          v-for="item in circleList" 
          :key="item.id" 
          class="share-block">
          <div class="top">
            <div class="left-avatar">
              <nuxt-link :to="`/user/${item.userId}`"><img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar"></nuxt-link>
            </div>
            <div class="right-info">
              <p class="nickname">
                <nuxt-link :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link>
              </p>
              <p class="desc"><span v-if="item.job">{{ item.job }} · </span>{{ cycleDate(item.createTime) }}</p>
              <p class="share-info">{{ item.content }}</p>
              <div 
                v-if="item.picList && item.picList.length" 
                class="img-box">
                <div 
                  v-for="itemName in item.picList"
                  :key="itemName" 
                  class="share-img" 
                  @click="handlePreview({ url: itemName })">
                  <img :src="itemName" alt="shareImg">
                </div>
              </div>
            </div>
            <a-popover 
              v-if="userInfo.id === item.userId && category === '1'" 
              placement="bottom">
              <template slot="content">
                <div class="circle-list-operate">
                  <p @click="deleteShareCircle(item.id)">删除</p>
                </div>
              </template>
              <div class="operate-fixed" @click.stop>
                <a-icon type="more" />
              </div>
            </a-popover>
          </div>
          <div class="bottom">
            <div><a-icon type="message" /><span></span></div>
            <div
              :class="{ like: item.isLiker }" 
              @click="isLikeCircle(item)">
              <a-icon type="like" />
              <span v-if="item.agreeCount">{{ item.agreeCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </client-only>
    <a-modal 
      :visible="previewVisible" 
      :footer="null" 
      @cancel="previewVisible = false">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cycleDate } from '~/util'
export default {
  props: {
    circleList: {
      type: Array,
      default: () => []
    },
    loading: Boolean,
    category: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      previewImage: null,
      previewVisible: false,
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
     * delete sircle
     */
    async deleteShareCircle (circleId) {
      try {
        await this.$axios.get(`/api/v1/shares/delete?id=${circleId}`)
        this.$message.success('删除成功')
        this.$emit('refreshCircle')
      } catch (error) {
        
      }
    },

    /**
     * user like or unlike sharecircle
     * @param { Object } circleItem
     */
    async isLikeCircle (circleItem) {
      try {
        const API = circleItem.isLiker ? '/shares/unagree' : '/shares/agree'
        await this.$axios.get(`/api/v1${API}?id=${circleItem.id}`)
        if (circleItem.isLiker) {
          circleItem.agreeCount -= 1
        } else {
          circleItem.agreeCount += 1
        }
        circleItem.isLiker = !circleItem.isLiker
      } catch (error) {}
    },

    handlePreview (file) {
      this.previewImage = file.url
      this.previewVisible = true
    }
  }
}
</script>
