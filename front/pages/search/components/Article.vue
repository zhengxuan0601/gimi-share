<template>
  <div class="vague-search-article">
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
      <nuxt-link
        v-for="item in list" 
        :key="item.id"
        target="_blank" :to="`/post/${item.id}`" class="modal">
        <div class="left">
          <p class="arc-title">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="item.articleTitle"></span>
          </p>
          <p class="arc-desc">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="item.description"></span>
          </p>
          <div class="info">
            <nuxt-link target="_blank" :to="`/user/${item.userId}`">{{ item.authorNickname }}</nuxt-link>
            <em>{{ item.viewCounts }} 阅读 · {{ item.likeCounts }} 赞 · {{ item.commentCounts }} 评论</em>
          </div>
        </div>
        <div v-if="item.coverImage" class="right">
          <img 
            :src="item.coverImage" alt="articlecover">
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchArticle',
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

  watch: {
    searchValue: {
      handler () {
        this.loading = true
        this.vagueSearchArticle()
      },
      immediate: true
    }
  },

  methods: {
    async vagueSearchArticle () {
      try {
        const searchParams = {
          value: this.searchValue,
          pageNo: this.pageNo,
          pageSize: 20,
          type: '1'
        }
        const { data } = await this.$axios.post('/api/v1/statistics/search', searchParams)
        this.list = data.list.map(u => {
          const oRegExp = new RegExp('(' + this.searchValue + ')', "ig")
          const htmlTitle = u.articleTitle.replace(oRegExp,`<i class="keyword">$1</i>`)
          const htmlDesc = u.description.replace(oRegExp,`<i class="keyword">$1</i>`)
          return {
            ...u,
            articleTitle: htmlTitle,
            description: htmlDesc
          }
        })
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
  }
}
</script>

<style lang="less">
.vague-search-article {
  .content {
    .modal {
      display: flex;
      padding: 20px;
      position: relative;
      border-bottom: 1px solid #f1f1f1;
      .delete-history {
        position: absolute;
        right: 0;
        top: 20px;
        cursor: pointer;
        font-size: 12px;
        display: none;
        transition: .2s;
      }
      &:hover {
        .delete-history {
          display: block;
        }
      }
      .left {
        flex: 1;
        width: 0;
        margin-right: 20px;
        p, a {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: block;
          &.arc-title {
            font-size: 15px;
            color: #000;
            font-weight: bold;
            &:hover {
              text-decoration: underline;
            }
            .keyword {
              font-style: normal;
              color: #f03535;
            }
          }
          &.arc-desc {
            font-size: 13px;
            color: #999;
            padding: 6px 0;
            .keyword {
              font-style: normal;
              color: #f03535;
            }
          }
        }
        .info {
          font-size: 12px;
          a {
            padding-right: 10px;
            color: #999;
            display: inline;
            &:hover {
              color: #1e80ff;
            }
          }
          em {
            color: #819a9f;
            font-style: normal;
          }
        }
      }
      .right {
        width: 120px;
        height: 80px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>