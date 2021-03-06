<template>
  <div class="article-content-block w-1100">
    <client-only>
      <div slot="placeholder" style="background: #fff; padding: 50px;">
        <custom-skeleton />
        <a-skeleton active />
      </div>
      <div class="article-content">
        <div class="article-suspended-panel">
          <div
            class="modal" 
            :class="{ liker: articleDetail.isLiker }" 
            @click="isLikeArticle(articleDetail)">
            <span 
              class="iconfont icon-JC_052"></span>
            <em v-if="articleDetail.likeCounts">{{ articleDetail.likeCounts }}</em>
          </div>
          <div class="modal">
            <a href="#article-comments">
              <span class="iconfont icon-pinglun"></span>
              <em v-if="articleDetail.commentCounts">{{ articleDetail.commentCounts }}</em>
            </a>
          </div>
          <div
            class="modal" 
            :class="{ collecter: articleDetail.isFlower }" 
            @click="isCollectArticle(articleDetail)">
            <span class="iconfont icon-shoucangxing2"></span>
          </div>
        </div>
        <div class="title">{{ articleDetail.articleTitle }}</div>
        <div class="user-model">
          <nuxt-link target="_blank" :to="`/user/${articleDetail.userId}`" class="img">
            <img :src="articleDetail.avatar || require('@/assets/images/default.png')" alt="avatar">
          </nuxt-link>
          <div class="info">
            <p class="nickname">
              <nuxt-link target="_blank" :to="`/user/${articleDetail.userId}`">{{ articleDetail.nickname }}</nuxt-link>
              <em v-if="userInfo.id === articleDetail.userId">作者</em>
            </p>
            <p class="time">{{ articleDetail.createTime.replace('-', '年').replace('-', '月').replace(' ', '日 ') }} <span>· 阅读 {{ articleDetail.viewCounts }}</span></p>
          </div>
          <div 
            v-if="userInfo.id !== articleDetail.userId" 
            class="focus-user">
            <a-button 
              v-if="!isFocususer"
              type="dashed" 
              icon="user-add"
              @click="updateUserFocus(true)">关注</a-button>
            <a-button 
              v-else 
              type="dashed"
              icon="check"
              @click="updateUserFocus(false)">已关注</a-button>
          </div>
        </div>
        <img 
          v-if="articleDetail.coverImage"
          class="article-cover" 
          :src="articleDetail.coverImage" 
          alt="cover">
        <mavon-editor 
          :value="articleDetail.content"
          class="md"
          :subfield="false"
          default-open="preview"
          :toolbars-flag="false"
          :editable="false"
          :image-click="imagePreview"
          :box-shadow="false"
          preview-background="#fff"
          :transition="false"
          style="padding:20px">
        </mavon-editor>
        <div class="article-tag">
          <em>标签：</em>
          <span 
            v-for="(item, index) in articleDetail.tag.split(';')"
            :key="index">{{ tagMap[item] }}</span>
        </div>
        <div v-if="articleDetail.linkUrl && linkInfo" class="link-url">
          <em>参考链接：</em>
          <a-popover placement="topLeft">
            <template slot="content">
              <a style="display: flex; padding: 10px 16px; align-items: center;" target="_blank" :href="articleDetail.linkUrl">
                <img style="width: 32px" src="~/assets/images/link.svg" alt="link_img">
                <div style="margin-left: 6px; font-size: 12px; line-height: normal;">
                  <p style="color: #4c4c4c;">{{ linkInfo.title }}</p>
                  <span style="color: #999;">{{ linkInfo.url.split('/')[2] }}</span>
                </div>
              </a>
            </template>
            <p :href="articleDetail.linkUrl" target="blank">{{ articleDetail.linkUrl }}</p>
          </a-popover>
        </div>
        <div class="bottom-jy"></div>
      </div>
      <ArticleComment
        :article-detail="articleDetail" />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ArticleComment from './components/ArticleComments.vue'
import { validateUniqId } from '~/util'
import CustomSkeleton from '~/components/CustomSkeleton'
import { tagMap } from '~/config/optionMap'
export default {
  name: 'PostIndex',
  components: { CustomSkeleton, ArticleComment },
  layout: 'BaseLayout',
  validate ({ params }) {
    return validateUniqId(params.id)
  },
  async asyncData ({ $axios, params }) {
    try {
      const articleDetail = (await $axios.get(`/api/v1/articles/articleinfo?id=${params.id}`)).data || {}
      const focusId = articleDetail.userId
      const isFocususer = (await $axios.get(`/api/v1/users/isfocususer?focusId=${focusId}`)).data
      return {
        articleDetail,
        isFocususer
      }
    } catch (error) {
      return {
        articleDetail: {},
        isFocususer: false
      }
    }
  },

  data () {
    return {
      tagMap,
      linkInfo: null
    }
  },

  head() {
    return {
      title: this.articleDetail.articleTitle,
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: this.articleDetail.articleTitle },
        { hid: 'keywords', name: 'keywords', content: this.articleDetail.tag.replace(/;/g, ',') }
      ]
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  watch: {
    articleDetail: {
      async handler (newVal) {
        if (newVal && newVal.linkUrl) {
          const { data } = await this.$axios.get(`/api/v1/unit/linkinfo?url=${newVal.linkUrl}`)
          this.linkInfo = data
        }
      },
      immediate: true,
      deep: true
    }
  },

  created () {
    if (this.userInfo) {
      this.generateHistory()
    }
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
    },

    /**
     * article collect
     * @param { Object } articleItem
     */
    async isCollectArticle (articleItem) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = articleItem.isFlower ? '/users/uncollectarticle' : '/users/collectarticle'
        await this.$axios.get(`/api/v1${API}?articleId=${articleItem.id}&uid=${articleItem.userId}`)
        articleItem.isFlower = !articleItem.isFlower
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * user focus user
     * @param { Boolean } state true - focus  false - unfocus
     */
    async updateUserFocus (state) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = state ? '/users/focususer' : '/users/unfocususer'
        const focusId = this.articleDetail.userId
        await this.$axios.get(`/api/v1${API}?focusId=${focusId}`)
        this.isFocususer = !this.isFocususer
      } catch (error) {
        console.log(error)
      }
    },

    generateHistory () {
      this.$axios.post('/api/v1/history/generate', { uid: this.articleDetail.userId, articleId: this.articleDetail.id })
    },

    imagePreview (e) {
      const img = e.getAttribute('src')
      this.$store.commit('UPDATE_PREVIEW_IMGSRC', img)
    }
  }
}
</script>

<style lang="less" scoped>
.article-content-block {
  width: 860px;
  margin: 20px auto 0;
}
.article-content {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  .article-suspended-panel {
    position: fixed;
    margin-left: -130px;
    top: 100px;
    .modal {
      position: relative;
      margin-bottom: 30px;
      width: 48px;
      height: 48px;
      background-color: #fff;
      background-position: 50%;
      background-repeat: no-repeat;
      border-radius: 50%;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.04);
      cursor: pointer;
      text-align: center;
      line-height: 48px;
      a {
        display: block;
        width: 100%;
        height: 100%;
      }
      span {
        color: #8a919f;
        font-size: 20px;
      }
      &:hover {
        span {
          color: #515767;
        }
      }
      em {
        position: absolute;
        top: 0;
        left: 75%;
        height: 17px;
        line-height: 17px;
        padding: 0 5px;
        border-radius: 9px;
        font-size: 11px;
        text-align: center;
        white-space: nowrap;
        background-color: #c2c8d1;
        color: #fff;
        font-style: normal;
      }
      &.liker {
        span {
          color: @primary-color;
        }
        em {
          background: @primary-color;
        }
      }
      &.collecter {
        span {
          color: #f1ca0a;
        }
      }
    }
  }
  .title {
    font-size: 30px;
    margin-bottom: 20px;
    color: #4c4c4c;
    font-weight: bold;
  }
  .user-model {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .info {
      flex: 1;
      .time {
        color: #999;
      }
      .nickname {
        a {
          color: #4c4c4c;
        }
        em {
          color: #f06909;
          font-style: normal;
          background: rgba(240,105,9,.3);
          font-size: 12px;
          padding: 1px 6px;
          border-radius: 2px;
          margin-left: 6px;
        }
      }
    }
    .focus-user {
      i {
        font-size: 13px;
        margin-right: 2px;
        position: relative;
        top: -1px;
      }
    }
  }
  .article-cover {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  .article-tag, .link-url {
    margin-top: 20px;
    em {
      font-style: normal;
      font-size: 12px;
    }
    span {
      background-color: #19c54a1a;
      color: @primary-color;
      font-size: 12px;
      padding: 0 12px;
      margin-right: 10px;
      border-radius: 2px;
      line-height: 28px;
      display: inline-block;
      cursor: default;
    }
    p {
      color: #4c4c4c;
      display: inline;
      cursor: pointer;
    }
  }
  .bottom-jy {
    font-size: 12px;
    line-height: 24px;
    padding-top: 20px;
    color: #000;
  }
}

::v-deep.markdown-body {
  padding: 0 !important;
  z-index: 998;
  border: none;
  .v-show-content {
    padding: 0 35px 15px !important;
  }
  ol, ul {
    li {
      font-size: 14px;
    }
  }
  p {
    font-size: 14px;
  }
  h5 {
    font-size: 15px;
  }
  img {
    max-width: 100%;
    max-height: 260px;
  }
  pre {
    border-radius: 4px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  mark {
    background-color: rgb(189 98 98 / 20%);
    font-size: 13px;
    color: #e94d4d;
    padding: 0px 5px;
    border-radius: 2px;
    margin: 0 2px;
  }
  .v-note-show.single-show {
    transition: none !important;
  }
}
</style>