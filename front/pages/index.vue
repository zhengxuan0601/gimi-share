<template>
  <div class="home-index-page w-1100">
    <client-only>
      <div slot="placeholder">
        <div style="padding:30px;background:#fff">
          <a-skeleton :paragraph="{ rows: 6 }" active :title="{ width: 160 }" />
        </div>
      </div>
      <div class="articlelist-content">
        <div 
          v-if="!pagination.list.length" 
          style="padding: 30px 0;">
          <a-empty 
            description="空空如也" 
            :image="require('@/assets/images/nodata.png')" /></div>
        <div v-else>
          <div
            v-for="item in pagination.list" 
            :key="item.id" 
            class="model" 
            @click="$router.push('/post/' + item.id)">
            <div class="l">
              <div class="user-info">
                <p @click.stop><nuxt-link target="_blank" :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link></p>
                <p>{{ cycleDate(item.createTime) }}</p>
                <p>{{ categoryMap[item.category] }}</p>
              </div>
              <p class="article-title">{{ item.articleTitle }}</p>
              <p class="article-desc">{{ item.description }}</p>
              <div class="a-num">
                <p><a-icon type="eye" /><span v-if="item.viewCounts">{{ item.viewCounts }}</span></p>
                <p 
                  :class="{ 'is-liker': item.isLiker }"
                  @click.stop="isLikeArticle(item)">
                  <a-icon type="like" />
                  <span v-if="item.likeCounts">{{ item.likeCounts }}</span>
                </p>
                <p><a-icon type="message" /><span v-if="item.commentCounts">{{ item.commentCounts }}</span></p>
              </div>
            </div>
            <div v-if="item.coverImage" class="r">
              <img :src="item.coverImage" alt="cover-image">
            </div>
          </div> 
        </div> 
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cycleDate } from '~/util'
import { categoryMap } from '~/config/optionMap'
export default {
  name: 'IndexPage',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const { data } = await $axios.get(`/api/v1/articles?pageNo=${pageNo}&pageSize=${pageSize}`)
      return {
        pagination: data
      }
    } catch (error) {
      console.log(error)
      return {
        pagination: {
          list: [],
          pageNo: 1,
          total: 0
        }
      }
    }
  },

  data () {
    return {
      categoryMap,
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
     * article liker
     * @param { Object } articleItem
     */
    async isLikeArticle (articleItem) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = articleItem.isLiker ? '/users/unagreearticle' : '/users/agreearticle'
        await this.$axios.get(`/api/v1${API}?articleId=${articleItem.id}&uid=${articleItem.userId}`)
        if (articleItem.isLiker) {
          articleItem.likeCounts -= 1
        } else {
          articleItem.likeCounts += 1
        }
        articleItem.isLiker = !articleItem.isLiker
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-index-page {
  margin-top: 20px;
  .articlelist-content {
    width: 708px;
  }
}
</style>
