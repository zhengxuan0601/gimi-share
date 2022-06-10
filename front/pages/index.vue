<template>
  <div>
    <div class="fixed-article-category">
      <div class="category-tab w-1100">
        <p 
          :class="{ active: categoryValue === '' }"
          @click="updateCategory('')">全部</p>
        <p 
          v-for="item in categoryOption"
          :key="item.value" 
          :class="{ active: categoryValue === item.value }"
          @click="updateCategory(item.value)">{{ item.label }}</p>
      </div>
    </div>
    <div class="home-index-page w-1100">
      <client-only>
        <div slot="placeholder">
          <div style="padding:30px;background:#fff">
            <a-skeleton :paragraph="{ rows: 6 }" active :title="{ width: 160 }" />
          </div>
        </div>
        <div class="articlelist-content">
          <div 
            v-if="requestLoading" 
            style="padding:20px 30px;background:#fff">
            <a-skeleton  active :title="{ width: 160 }" />
          </div>
          <div 
            v-if="!pagination.list.length && !requestLoading" 
            style="padding: 30px 0;">
            <a-empty 
              description="空空如也" 
              :image="require('@/assets/images/nodata.png')" /></div>
          <div v-if="pagination.list.length && !requestLoading">
            <div
              v-for="item in pagination.list" 
              :key="item.id" 
              class="model"
              @click="openLink(item.id)">
              <div class="l">
                <div class="user-info">
                  <p @click.stop><nuxt-link target="_blank" :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link></p>
                  <p>{{ cycleDate(item.createTime) }}</p>
                  <p>
                    <em v-for="itemName in item.tag.split(';')" :key="itemName">{{ tagMap[itemName] }}</em>
                  </p>
                </div>
                <p class="article-title">{{ item.articleTitle }}</p>
                <p class="article-desc">{{ item.description }}</p>
                <div class="a-num">
                  <p><a-icon type="eye" /><span v-if="item.viewCounts">{{ item.viewCounts }}</span></p>
                  <p 
                    :class="{ 'is-liker': item.isLiker }"
                    @click.stop="isLikeArticle($event, item)">
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
        <div class="right-message">
          <div class="tip">
            <p><i class="iconfont icon-wenhouyin"></i>下午好！亲爱的{{ userInfo ? userInfo.nickname : '朋友' }}。</p>
            <span>愿你心情愉悦，笑口常开！</span>
          </div>
          <div class="author-rank">
            <div class="title">
              <p>🎖️ 作者榜</p>
            </div>
            <div class="rank-list">
              <nuxt-link 
                v-for="item in userRankList" 
                :key="item.id" 
                target="_blank"
                :to="`/user/${item.id}`" 
                class="block">
                <div class="left-avatar">
                  <img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar">
                </div>
                <div class="right-info">
                  <p>{{ item.nickname }}</p>
                  <span>{{ item.job || '--' }}</span>
                </div>
              </nuxt-link>
            </div>
          </div>
          <div class="author-rank">
            <div class="title">
              <p>🏷️ 标签集</p>
            </div>
            <div id="link-rotate" class="tag-rotate-list">
              <nuxt-link 
                v-for="item in tagOptions.slice(0, 24)"
                :key="item.value"
                class=""
                to="#"
                >{{ item.label }}</nuxt-link>
            </div>
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cycleDate } from '~/util'
import rotate from '~/util/rotate'
import { tagMap, categoryOption, tagOptions } from '~/config/optionMap'
export default {
  name: 'IndexPage',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const { data } = await $axios.get(`/api/v1/articles?pageNo=${pageNo}&pageSize=${pageSize}`)
      return {
        pagination: {
          ...data,
          pageSize
        }
      }
    } catch (error) {
      return {
        pagination: {
          list: [],
          pageNo: 1,
          total: 0,
          pageSize
        }
      }
    }
  },

  data () {
    return {
      tagMap,
      cycleDate,
      categoryOption,
      userRankList: [],
      categoryValue: '',
      requestLoading: false,
      tagOptions
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  created () {
    this.findUserRank()
    if (process.browser) {
      this.$nextTick(() => {
        setTimeout(rotate)
      })
    }
  },

  methods: {
    /**
     * article liker
     * @param { Object } articleItem
     */
    async isLikeArticle (e, articleItem) {
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
    },

    /**
     * find user rank
     */
    async findUserRank () {
      try {
        const { data } = await this.$axios.get(`/api/v1/statistics/userrank?pageNo=1&pageSize=3`)
        this.userRankList = data
      } catch (error) {}
    },

    async articleList () {
      try {
        const { pageNo, pageSize } = this.pagination
        const { data } = await this.$axios.get(`/api/v1/articles?pageNo=${pageNo}&pageSize=${pageSize}&category=${this.categoryValue}`)
        this.pagination = {
          ...data,
          pageSize
        }
      } catch (error) {} finally {
        this.requestLoading = false
      }
    },

    /**
     * update article category
     * @param { String } category
     */
    updateCategory (category) {
      if (this.categoryValue === category) {
        return
      }
      this.categoryValue = category
      this.pagination.pageNo = 1
      this.requestLoading = true
      this.articleList()
    },

    openLink (id) {
      const { href } = this.$router.resolve(`/post/${id}`)
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.fixed-article-category {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  border-bottom: 1px solid #f1f1f1;
  background: #fff;
  z-index: 999;
  .category-tab {
    height: 45px;
    display: flex;
    align-items: center;
    p {
      margin-right: 20px;
      cursor: pointer;
      &.active {
        color: @hover-primary-color;
      }
    }
  }
}
.home-index-page {
  margin-top: 65px;
  .articlelist-content {
    width: 708px;
  }
  .right-message {
    position: fixed;
    top: 125px;
    margin-left: 736px;
    width: 240px;
    .tip {
      background: #fff;
      padding: 16px;
      p {
        color: #000000;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        i {
          font-size: 20px;
          font-weight: normal;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      span {
        font-size: 12px;
        color: #4c4c4c;
        display: inline-block;
        padding-left: 28px;
      }
    }
    .author-rank {
      background: #fff;
      margin-top: 10px;
      .title {
        line-height: 42px;
        border-bottom: 1px solid #f1f1f190;
        padding: 0 16px;
      }
      .rank-list {
        .block {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          &:hover {
            background-color: hsla(0,0%,84.7%,.1);
          }
          .left-avatar {
            display: block;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            img {
              display: block;
              widows: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .right-info {
            width: 0;
            flex: 1;
            padding: 0 10px;
            p {
              color: #333;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 13px;
            }
            span {
              font-size: 12px;
              color: #999;
              display: block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .tag-rotate-list {
      position: relative;
      height: 240px; 
      background: #fff; 
      a {
        position: absolute;
        color: @primary-color;
      }
    }
  }
}
</style>
