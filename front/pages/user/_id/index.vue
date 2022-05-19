<template>
  <div class="user-dynamic-modal">
    <div v-if="loading" style="background: #fff; padding: 20px;">
      <a-skeleton active />
    </div>
    <client-only v-else>
      <div 
        v-if="!pagination.list.length" 
        style="padding: 30px 0; background: #fff;">
        <a-empty 
          description="空空如也" 
          :image="require('@/assets/images/nodata.png')" /></div>
      <div v-else>
        <div 
          v-for="item in pagination.list" 
          :key="item.id" 
          class="content-block">
          <!-- 文章模块展示 -->
          <div v-if="item.articleId" class="articlelist-content">
            <div class="dynamic-title">
              <em>{{ cycleDate(item.createTime) }}</em>
              <span>{{ userNickname }}</span>
              {{ item.type === '1' ? '发布' : item.type === '2' ? '赞' : '收藏' }}了这篇文章
            </div>
            <div
              class="model"
              @click="$router.push(`/post/${item.articleId}`)">
              <div class="l">
                <div class="user-info">
                  <p @click.stop><nuxt-link :to="`/user/${item.pointInfo.userId}`">{{ item.pointInfo.nickname }}</nuxt-link></p>
                  <p>{{ cycleDate(item.pointInfo.createTime) }}</p>
                  <p>{{ categoryMap[item.pointInfo.category] }}</p>
                </div>
                <p class="article-title">{{ item.pointInfo.articleTitle }}</p>
                <p class="article-desc">{{ item.pointInfo.description }}</p>
                <div class="a-num">
                  <p>
                    <a-icon type="eye" /><span>{{ item.pointInfo.viewCounts }}</span>
                  </p>
                  <p 
                    :class="{ 'is-liker': item.pointInfo.isLiker }"
                    @click.stop="isLikeArticle(item.pointInfo)">
                    <a-icon type="like" />
                    <span v-if="item.pointInfo.likeCounts">{{ item.pointInfo.likeCounts }}</span>
                  </p>
                  <p>
                    <a-icon type="message" />
                    <span v-if="item.pointInfo.commentCounts">{{ item.pointInfo.commentCounts }}</span>
                  </p>
                </div>
              </div>
              <div v-if="item.pointInfo.coverImage" class="r">
                <img :src="item.pointInfo.coverImage" alt="cover-image">
              </div>
            </div> 
          </div>

          <!-- 友圈模块展示 -->
          <div v-if="item.circleId" class="circle-content-block">
            <div class="dynamic-title">
              <em>{{ cycleDate(item.createTime) }}</em>
              <span>{{ userNickname }}</span>
              {{ item.type === '1' ? '发布' : item.type === '2' ? '赞' : '收藏' }}了这篇友圈分享
            </div>
            <div 
              class="share-block">
              <div class="top">
                <div class="left-avatar">
                  <nuxt-link :to="`/user/${item.pointInfo.userId}`">
                    <img :src="item.pointInfo.avatar || require('~/assets/images/default.png')" alt="avatar">
                  </nuxt-link>
                </div>
                <div class="right-info">
                  <p class="nickname">
                    <nuxt-link :to="`/user/${item.pointInfo.userId}`">{{ item.pointInfo.nickname }}</nuxt-link>
                  </p>
                  <p class="desc"><span v-if="item.pointInfo.job">{{ item.pointInfo.job }} · </span>{{ cycleDate(item.pointInfo.createTime) }}</p>
                  <p class="share-info">{{ item.pointInfo.content }}</p>
                  <div 
                    v-if="item.pointInfo.picList && item.pointInfo.picList.length" 
                    class="img-box">
                    <div 
                      v-for="itemName in item.pointInfo.picList.split(';')"
                      :key="itemName" 
                      class="share-img" 
                      @click="handlePreview({ url: itemName })">
                      <img :src="itemName" alt="shareImg">
                    </div>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <div>
                  <nuxt-link target="_blank" :to="`/sharecircle/${item.pointInfo.id}`">
                    <a-icon type="message" />
                    <span v-if="item.pointInfo.commentCount">{{ item.pointInfo.commentCount }}</span>
                  </nuxt-link>
                </div>
                <div
                  :class="{ like: item.pointInfo.isLiker }" 
                  @click="isLikeCircle(item.pointInfo)">
                  <a-icon type="like" />
                  <span v-if="item.pointInfo.agreeCount">{{ item.pointInfo.agreeCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 用户关注模块 -->
          <div v-if="item.focusUserId" class="user-focus-content">
            <div class="focus-user">
              <div class="user-modal">
                <div class="avatar">
                  <img :src="userAvatar || require('~/assets/images/default.png')" alt="avatar">
                </div>
                <p class="nickname">
                  {{ userNickname }}
                  <span>关注了</span>
                  <nuxt-link 
                    target="_blank"
                    :to="`/user/${item.pointInfo.id}`">{{ item.pointInfo.nickname }}</nuxt-link>
                </p>
              </div>
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
  name: 'UserDynamic',
  props: {
    userId: {
      type: String,
      default: ''
    },
    userNickname: {
      type: String,
      default: ''
    },
    userAvatar: {
      type: String,
      default: ''
    }
  }, 
  data () {
    return {
      cycleDate,
      categoryMap,
      pagination: {
        list: [],
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      loading: true
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  created () {
    this.findDynamicList()
  },

  methods: {
    /**
     * find user dynamic list
     */
    async findDynamicList () {
      try {
        const { pageNo, pageSize } = this.pagination
        const { data } = await this.$axios.get(`/api/v1/dynamics?pageNo=${pageNo}&pageSize=${pageSize}&userId=${this.userId}`)
        this.pagination = {
          ...this.pagination,
          list: data.list,
          total: data.total
        }
      } catch (error) {} finally {
        this.loading = false
      }
    },

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
     * user like or unlike sharecircle
     * @param { Object } circleItem
     */
    async isLikeCircle (circleItem) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = circleItem.isLiker ? '/shares/unagree' : '/shares/agree'
        await this.$axios.get(`/api/v1${API}?id=${circleItem.id}`)
        if (circleItem.isLiker) {
          circleItem.agreeCount -= 1
        } else {
          circleItem.agreeCount += 1
        }
        circleItem.isLiker = !circleItem.isLiker
      } catch (error) {}
    },

    handlePreview (file) {
      this.$store.commit('UPDATE_PREVIEW_IMGSRC', file.url)
    }
  }
}
</script>

<style scoped lang="less">
.user-dynamic-modal {
  .content-block {
    margin-top: 10px;
    .articlelist-content {
      .model {
        &:hover {
          background: #fff;
        }
      }
    }
    .dynamic-title {
      line-height: 42px;
      border-bottom: 1px solid #f1f1f1;
      padding: 0 20px;
      background: #fff;
      font-size: 12px;
      em {
        font-style: normal;
        margin-right: 6px;
      }
      span {
        color: #999;
        margin-right: 4px;
      }
    }
    .share-block {
      margin-bottom: 0;
    }
    .user-focus-content {
      .focus-user {
        background: #fff;
        .user-modal {
          border-bottom: 1px solid #f1f1f1;
          display: flex;
          height: 60px;
          align-items: center;
          padding: 0 20px;
          .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
          .nickname {
            font-size: 14px;
            margin-left: 14px;
            font-weight: bold;
            flex: 1;
            width: 0;
            color: #000;
            span {
              color: #999;
              margin: 0 6px;
            }
            em {
              font-style: normal;
            }
          }
        }
      }
    }
  }
}
</style>