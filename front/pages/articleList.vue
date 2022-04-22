<template>
  <div class="articlelist-content">
    <div class="top-btn">
      <nuxt-link to="/writeCenter">
        <a-button type="primary">发布文章</a-button>
      </nuxt-link>
    </div>
    <div
      v-for="item in list" 
      :key="item.id" 
      class="model" 
      @click="$router.push('/writeCenter/' + item.id)">
      <div class="l">
        <p>{{ item.articleTitle }}</p>
        <span>{{ item.createTime }}</span>
      </div>
      <div class="r" @click.stop>
        <a-popover placement="bottom">
          <template slot="content">
            <p><a-button type="link" size="small" @click="deleteArticle(item.id)">删除</a-button></p>
          </template>
          <a-icon type="more" />
        </a-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    try {
      const { data } = await $axios.get('/v1/gimshare/articleList')
      return {
        list: data
      }
    } catch (error) {
      return {
        list: []
      }
    }

  },
  head () {
    return {
      title: '写作中心-文章列表'
    }
  },

  methods: {
    deleteArticle (id) {
      this.$confirm({
        title: '确认提示',
        content: '确认是否删除文章',
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            await this.$axios.get(`/v1/gimshare/deleteArticle?id=${id}`)
            this.$message.success('删除文章成功')
            const { data } = await this.$axios.get('/v1/gimshare/articleList')
            this.list = data
          } catch (error) {
            
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.articlelist-content {
  padding: 20px;
  .top-btn {
    margin-bottom: 20px;
  }
  .model {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f1f190;
    cursor: pointer;
    .l {
      width: 0;
      flex: 1;
      span {
        font-size: 12px;
        margin-top: 5px;
        display: block;
        color: #999;
      }
    }
    .r {
      margin-left: 30px;
      flex-shrink: 0;
      cursor: pointer;
    }
  }
}
</style>
