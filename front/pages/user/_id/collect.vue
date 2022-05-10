<template>
  <div>
    <ArticleCategory 
      :loading="loading"
      :article-list="articleList" />
  </div>
</template>

<script>
import ArticleCategory from '../component/ArticleCategory'
export default {
  name: 'UserCollect',
  components: { ArticleCategory },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      articleList: [],
      loading: false
    }
  },

  created () {
    this.findCollectArticles()
  },

  methods: {
    /**
     * 查询该用户下已收藏的所有文章
     */
    async findCollectArticles () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/articles/collected?userId=${this.userId}`)
        this.articleList = data
      } catch (error) {} finally {
        this.loading = false
      }
    }
  }
}
</script>
