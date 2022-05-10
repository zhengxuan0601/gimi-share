<template>
  <div class="user-agree">
    <div class="agree-tab">
      <div 
        :class="{ active: currentKey === 'article' }" 
        @click="currentKey = 'article'">文章</div>
      <div 
        :class="{ active: currentKey === 'sharecircle' }" 
        @click="currentKey = 'sharecircle'">友圈</div>
    </div>
    <!-- 文章点赞 -->
    <ArticleCategory
      v-show="currentKey === 'article'" 
      :loading="loading"
      :article-list="articleList" />
    
    <!-- 友圈点赞 -->
    <ShareCircleCategory
      v-show="currentKey === 'sharecircle'" 
      :circle-list="circleList"
      :loading="loading" />
  </div>
</template>

<script>
import ArticleCategory from '../component/ArticleCategory'
import ShareCircleCategory from '../component/ShareCircleCategory'
export default {
  name: 'UserAgreeArticle',
  components: { ArticleCategory, ShareCircleCategory },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      articleList: [],
      circleList: [],
      loading: false,
      currentKey: 'article'
    }
  },

  created () {
    this.findAgreeArticles()
    this.findAgreeCircles()
  },

  methods: {
   /**
     * 查询该用户下已点赞的所有文章
     */
    async findAgreeArticles () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/articles/agreed?userId=${this.userId}`)
        this.articleList = data
      } catch (error) {} finally {
        this.loading = false
      }
    },

    /**
     * 查询该用户下已点赞的友圈列表
     */
    async findAgreeCircles () {
      try {
        const { data } = await this.$axios.get(`/api/v1/shares/agreecircles?userId=${this.userId}`)
        this.circleList = data
      } catch (error) {}
    }
  }
}
</script>

<style scoped lang="less">
.user-agree {
  .agree-tab {
    height: 48px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    justify-content: flex-end;
    padding: 0 20px;
    align-items: center;
    background: #fff;
    & > div {
      margin-left: 20px;
      cursor: pointer;
      font-weight: bold;
      &.active {
        color: #000;
      }
    }
  }
}
</style>
