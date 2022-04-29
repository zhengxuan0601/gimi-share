<template>
  <div class="home-index-page">
    <client-only>
      <div slot="placeholder">
        <div style="padding:30px;background:#fff">
          <a-skeleton active />
        </div>
      </div>
      <div class="articlelist-content">
        <div
          v-for="item in pagination.list" 
          :key="item.id" 
          class="model" 
          @click="$router.push('/post/' + item.id)">
          <div class="l">
            <div class="user-info">
              <p>{{ item.author.nickname }}</p>
              <p>{{ item.createTime }}</p>
              <p>{{ categoryMap[item.category] }}</p>
            </div>
            <p class="article-title">{{ item.articleTitle }}</p>
            <p class="article-desc">{{ item.description }}</p>
            <div class="a-num">
              <p><a-icon type="eye" /><span>{{ item.viewCounts }}</span></p>
              <p 
                :class="{ 'is-liker': item.isLiker }"
                @click.stop="isLikeArticle(item)">
                <a-icon type="like" />
                <span>{{ item.likeCounts }}</span>
              </p>
              <p><a-icon type="message" /><span>{{ item.commentCounts }}</span></p>
            </div>
          </div>
          <div v-if="item.coverImage" class="r">
            <img :src="item.coverImage" alt="cover-image">
          </div>
        </div>  
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { categoryMap } from '@/util/options'
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
      categoryMap
    }
  },

  head () {
    return {
      title: 'GimiShare-分享新鲜事'
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
    }
  }
}
</script>

<style lang="less" scoped>
.home-index-page {
  .articlelist-content {
    background: #fff;
    .model {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f1f1f190;
      padding: 20px;
      cursor: pointer;
      &:hover {
        background: #fafafa;
      }
      .l {
        width: 0;
        flex: 1;
        .user-info {
          display: flex;
          padding: 6px 0;
          p {
            font-size: 14px;
            margin-right: 24px;
            position: relative;
            &:not(:last-child) {
              &:before {  
                content: "";
                width: 1px;
                position: absolute;
                height: 12px;
                background: #dedddd;
                top: 5px;
                right: -12px;
              }
            }
          }
        }
        .article-title {
          font-size: 16px;
          color: #1d2129;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .article-desc {
          color: #86909c;
          font-size: 12px;
          padding: 6px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .a-num {
          display: flex;
          margin-top: 6px;
          p {
            margin-right: 32px;
            display: flex;
            align-items: center;
            position: relative;
            &:not(:last-child):after {
              content: "";
              width: 1px;
              position: absolute;
              height: 11px;
              background: #ede3e3;
              top: 4px;
              right: -16px;
            }
            &.is-liker {
              color: #19c54a;
            }
            span {
              font-size: 12px;
              margin-left: 4px;
            }
            &:not(:first-child) {
              &:hover {
                color: #19c54a;
              }
            }
          }
        }
      }
      .r {
        margin-left: 30px;
        flex-shrink: 0;
        img {
          width: 120px;
          height: 80px;
        }
      }
    }
  }
}
</style>
