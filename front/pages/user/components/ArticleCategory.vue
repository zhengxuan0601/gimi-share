<template>
  <div class="articlelist-content article-category-modal">
    <div v-if="loading" style="background: #fff; padding: 20px;">
      <a-skeleton active />
    </div>
    <client-only v-else>
      <div 
        v-if="!articleList.length" 
        style="padding: 30px 0;">
        <a-empty 
          description="空空如也" 
          :image="require('@/assets/images/nodata.png')" /></div>
      <div v-else>
        <nuxt-link
          v-for="item in articleList" 
          :key="item.id" 
          class="model" 
          target="_blank"
          :to="`/post/${item.id}`">
          <div class="l">
            <div class="user-info">
              <p @click.stop><nuxt-link :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link></p>
              <p>{{ cycleDate(item.createTime) }}</p>
              <p>
                <em v-for="itemName in item.tag.split(';')" :key="itemName">{{ tagMap[itemName] }}</em>
              </p>
            </div>
            <p class="article-title">{{ item.articleTitle }}</p>
            <p class="article-desc">{{ item.description }}</p>
            <div class="a-num">
              <p><a-icon type="eye" /><span>{{ item.viewCounts }}</span></p>
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
          <a-popover 
            v-if="userInfo.id === item.userId && category === '1'" 
            placement="bottom">
            <template slot="content">
              <div class="artile-list-operate">
                <nuxt-link target="_blank" :to="`/writecenter/${item.id}`">编辑</nuxt-link>
                <p @click="deleteArticle(item.id)">删除</p>
              </div>
            </template>
            <div class="operate-fixed" @click.stop>
              <a-icon type="more" />
            </div>
          </a-popover>
        </nuxt-link>  
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cycleDate } from '~/util'
import { tagMap } from '~/config/optionMap'
export default {
  props: {
    articleList: {
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
      cycleDate,
      tagMap
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
        await this.$axios.get(`/api/v1${API}?articleId=${articleItem.id}`)
        if (articleItem.isLiker) {
          articleItem.likeCounts -= 1
        } else {
          articleItem.likeCounts += 1
        }
        articleItem.isLiker = !articleItem.isLiker
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * delete article
     * @param { String } articleId
     */
    deleteArticle (articleId) {
      this.$confirm({
        title: '删除提示',
        content: '确定删除这篇文章吗？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await this.$axios.get(`/api/v1/articles/deletearticle?id=${articleId}`)
            this.$message.success('删除文章成功')
            this.$emit('refresh', this.category)
          } catch (error) {
            console.log(error)
          }
        }
      });
    }
  }
}
</script>
