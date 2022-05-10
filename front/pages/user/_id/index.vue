<template>
  <div>
    <ArticleCategory 
      :loading="loading"
      :article-list="articleList"
      category="1"
      @refresh="() => {
        pagination.pageNo = 1; 
        findArticleByUser()
      }" />
  </div>
</template>

<script>
import ArticleCategory from '../components/ArticleCategory'
export default {
  name: 'UserArticle',
  components: { ArticleCategory },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pagination: {
        pageNo: 1,
        pageSize: 20
      },
      articleList: [],
      loading: false
    }
  },

  created () {
    this.findArticleByUser()
  },

  methods: {
    /**
     * 分页查询该用户下的所有文章
     */
    async findArticleByUser () {
      this.loading = true
      const { pageNo, pageSize } = this.pagination
      try {
        const { data } = await this.$axios.get(`/api/v1/articles?pageNo=${pageNo}&pageSize=${pageSize}&userId=${this.userId}`)
        this.articleList = data.list
      } catch (error) {} finally {
        this.loading = false
      }
    }
  }
}
</script>
