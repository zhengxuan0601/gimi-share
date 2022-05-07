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
          <nuxt-link :to="`/user/${articleDetail.userId}`" class="img">
            <img :src="articleDetail.avatar || require('@/assets/images/default.png')" alt="avatar">
          </nuxt-link>
          <div class="info">
            <p class="nickname">
              <nuxt-link :to="`/user/${articleDetail.userId}`">{{ articleDetail.nickname }}</nuxt-link>
              <em v-if="userInfo.id === articleDetail.userId">作者</em>
            </p>
            <p class="time">{{ articleDetail.createTime.replace('-', '年').replace('-', '月').replace(' ', '日 ') }} <span>· 阅读 {{ articleDetail.viewCounts }}</span></p>
          </div>
          <div v-if="userInfo.id !== articleDetail.userId" class="focus-user">
            <button 
              v-if="!isFocususer"
              class="a-primary 
              dashed" 
              @click="updateUserFocus(true)"><a-icon type="plus" />关注</button>
            <button 
              v-else 
              class="a-primary dashed"
              @click="updateUserFocus(false)">
              <a-icon type="check" />
              <em class="has">已</em><em class="dis">取消</em>关注</button>
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
          :subfield = "false"
          :default-open = "'preview'"
          :toolbars-flag = "false"
          :editable="false"
          style="padding:20px">
        </mavon-editor>
        <div class="article-tag">
          <em>标签：</em>
          <span 
            v-for="(item, index) in articleDetail.tag.split(';')"
            :key="index">{{ item }}</span>
        </div>
        <div class="bottom-jy">
          SAY：以 「早起」、「运动」、「冥想」、「写作」、「阅读」这五件能够快速改变人生的事情为切入点，帮助大家建立良好的生活习惯，技术的成长绝不是一朝一夕，良好的习惯将会帮助我们更快的进步，但在技术之外，我更希望大家能在这些事情的坚持中，收获一份自信，多一份底气，对人生多一份积极。
        </div>
      </div>
      <div id="article-comments" class="article-comments">
        <div class="user-submit">
          <h3>评论</h3>
          <div class="content">
            <div class="left">
              <img 
                :src="userInfo ? (userInfo.avatar || require('@/assets/images/default.png')) : require('@/assets/images/default.svg')" 
                alt="avatar">
            </div>
            <div class="right">
              <textarea v-model="comment" rows="3" placeholder="请输入您的评论吧~"></textarea>
              <div class="bottom-operate">
                <div class="left-emoji-pic">
                  <div>
                    表情
                    <VEmojiPicker  />
                  </div>
                </div>
                <button
                  :disabled="!comment"
                  class="a-primary" 
                  @click="submitComment(comment)">评论</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="commentList.length" class="comment-list">
          <h3>全部评论</h3>
          <div class="modal-list">
            <div v-for="item in commentList" :key="item.id" class="list">
              <div class="left">
                <nuxt-link :to="`/user/${item.userId}`">
                  <img 
                    :src="item.avatar || require('@/assets/images/default.png')" 
                    alt="avatar">
                </nuxt-link>
              </div>
              <div class="right">
                <div class="user">
                  <nuxt-link 
                    :to="`/user/${item.userId}`"
                    class="nickname">{{ item.nickname }}
                    <span 
                      v-if="item.userId === articleDetail.userId" 
                      class="is-author">(作者)</span>
                  </nuxt-link>
                  <p class="job">{{ item.job || '' }}</p>
                </div>
                <div class="comment">
                  <p>{{ item.content }}</p>
                  <span 
                    v-if="item.isAuthor || userInfo.id === articleDetail.userId" 
                    @click="deleteComment(item.id)">删除</span>
                </div>
                <div class="dz-pl">
                  <p 
                    :class="{ like: item.isLiker }"
                    @click="isLikeComment(item)"><a-icon type="like" /><span v-if="item.likeCounts">{{ item.likeCounts }}</span>
                  </p>
                  <p 
                    v-ClickOutside="() => item.replyState = false"
                    @click="item.replyState = true"><a-icon type="message" /><span v-if="item.replyCount">{{ item.replyCount }}</span></p>
                </div>
                <div
                  v-show="item.replyState" 
                  class="reply-submit">
                  <textarea v-model="item.replyComment" rows="3" placeholder="请输入您的评论吧~"></textarea>
                  <div class="bottom-operate">
                    <button
                      :disabled="!item.replyComment"
                      class="a-primary"
                      @click="submitComment(item.replyComment, item.id, item.id)" >评论</button>
                  </div>
                </div>
                <div
                  v-if="item.children && item.children.length"
                  class="reply-comment">
                  <div v-for="itemName in item.children" :key="itemName.id" class="list">
                    <div class="left">
                      <nuxt-link :to="`/user/${itemName.userId}`">
                        <img 
                          :src="itemName.avatar || require('@/assets/images/default.png')" 
                          alt="avatar">
                      </nuxt-link>
                    </div>
                    <div class="right">
                      <div class="user">
                        <nuxt-link
                          :to="`/user/${itemName.userId}`" 
                          class="nickname">{{ itemName.nickname }}
                          <span 
                            v-if="itemName.userId === articleDetail.userId" 
                            class="is-author">(作者)</span>
                        </nuxt-link>
                        <p class="job">{{ itemName.job || '' }}</p>
                        <span v-if="itemName.replyNickname">@</span>
                        <nuxt-link
                          :to="`/user/${itemName.replyUserId}`"  
                          class="nickname">{{ itemName.replyNickname }}</nuxt-link>
                      </div>
                      <div class="comment">
                        <p>{{ itemName.content }}</p>
                        <span 
                          v-if="itemName.isAuthor || userInfo.id === articleDetail.userId" 
                          @click="deleteComment(itemName.id)">删除</span>
                      </div>
                      <div v-if="itemName.replyComment" class="parent-comment">
                        <p>“{{ itemName.replyComment }}”</p>
                      </div>
                      <div class="dz-pl">
                        <p 
                          :class="{ like: itemName.isLiker }"
                          @click="isLikeComment(itemName)">
                          <a-icon type="like" /><span v-if="itemName.likeCounts">{{ itemName.likeCounts }}</span>
                        </p>
                        <p 
                          v-ClickOutside="() => itemName.replyState = false"
                          @click="itemName.replyState = true">
                          <a-icon type="message" /><span v-if="itemName.replyCount">{{ itemName.replyCount }}</span>
                        </p>
                      </div>
                      <div
                        v-show="itemName.replyState" 
                        class="reply-submit">
                        <textarea 
                          v-model="itemName.replyNewComment"
                          style="background: #fff" 
                          rows="3" 
                          placeholder="请输入您的评论吧~"></textarea>
                        <div class="bottom-operate">
                          <button
                            :disabled="!itemName.replyNewComment"
                            class="a-primary" 
                            @click="submitComment(itemName.replyNewComment, item.id, itemName.id, itemName.content, itemName.nickname, itemName.userId)">评论</button>
                        </div>
                      </div>
                    </div>
                    <div class="time">{{ cycleDate(itemName.createTime) }}</div>
                  </div>
                </div>
              </div>
              <div class="time">{{ cycleDate(item.createTime) }}</div>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { VEmojiPicker } from 'v-emoji-picker'
import { validateUniqId, cycleDate } from '@/util'
import CustomSkeleton from '@/components/CustomSkeleton'
export default {
  name: 'PostIndex',
  components: { CustomSkeleton, VEmojiPicker },
  directives: { ClickOutside },
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
      cycleDate,
      comment: '',
      commentList: [],
      emoVisible: false
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

  created () {
    this.findComments()
  },

  mounted () {
    this.popupItem = this.$el
  },

  methods: {
    /**
     * submit comment
     * @param { String } comment
     * @param { String } topId
     * @param { String } replyId
     * @param { String } replyComment
     * @param { String } replyNickname
     * @param { String } replyUserId
     */
    async submitComment (comment, topId, replyId, replyComment, replyNickname, replyUserId) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const commentInfo = {
          articleId: this.articleDetail.id,
          topId,
          replyId,
          replyComment,
          content: comment,
          replyNickname,
          replyUserId
        }
        await this.$axios.post('/api/v1/article/comments/submit', commentInfo)
        this.comment = ''
        this.findComments()
        this.$message.success('评论成功')
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * find article comments
     */
    async findComments () {
      try {
        const { data } = await this.$axios.get(`/api/v1/article/comments?articleId=${this.articleDetail.id}`)
        this.treeStructure(data)
        this.commentList = data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * like comment
     * @params { String } commentItem
     */
    async isLikeComment (commentItem) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = commentItem.isLiker ? '/users/unagreecomment' : '/users/agreecomment'
        await this.$axios.get(`/api/v1${API}?commentId=${commentItem.id}&itemType=1`)
        if (commentItem.isLiker) {
          commentItem.likeCounts -= 1
        } else {
          commentItem.likeCounts += 1
        }
        commentItem.isLiker = !commentItem.isLiker
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * delete comment
     * @params { String } commentId
     */
    async deleteComment (commentId) {
      try {
        await this.$axios.get(`/api/v1/article/comments/delete?id=${commentId}`)
        this.findComments()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * package treestructure fileds
     * @param { Array } listTree
     */
    treeStructure (listTree) {
      for (let i = 0; i < listTree.length; i++) {
        listTree[i].replyState = false
        listTree[i].replyNewComment = ''
        if (listTree[i].children && listTree[i].children.length) {
          this.treeStructure(listTree[i].children)
        }
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
     * article collect
     * @param { Object } articleItem
     */
    async isCollectArticle (articleItem) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = articleItem.isFlower ? '/users/uncollectarticle' : '/users/collectarticle'
        await this.$axios.get(`/api/v1${API}?articleId=${articleItem.id}`)
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
    }
  }
}
</script>

<style lang="less" scoped>
.article-content-block {
  width: 860px;
  margin: 0 auto;
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
  .article-tag {
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
  }
  .bottom-jy {
    font-size: 12px;
    line-height: 24px;
    padding-top: 20px;
    color: #000;
  }
}
.article-comments {
  background: #fff;
  padding: 30px;
  margin-top: 30px;
  border-radius: 4px;
  .user-submit {
    h3 {
      color: #000;
      font-weight: bold;
    }
    .content {
      display: flex;
      margin-top: 20px;
      .left {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 20px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .right {
        flex: 1;
        widows: 0;
        textarea {
          background: rgb(243,242,245);
          border: none;
          outline: none;
          width: 100%;
          border-radius: 4px;
          padding: 10px 20px;
          resize: none;
        }
        .bottom-operate {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
        }
      }
    }
  }
  .comment-list {
    margin-top: 10px;
    h3 {
      color: #000;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .modal-list {
      .list {
        display: flex;
        padding: 16px 0;
        position: relative;
        .left {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 20px;
          a {
            display: block;
            height: 100%;
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
        .right {
          flex: 1;
          width: 0;
          .user {
            display: flex;
            .nickname {
              color: #4c4c4c;
              .is-author {
                padding: 0 4px 0 6px;
              }
            }
            .job {
              color: #d1b7b7;
              margin-left: 4px;
              font-size: 12px;
              position: relative;
              top: 2px;
            }
            span {
              padding: 0 12px;
              color: #999;
            }
          }
          .comment {
            padding: 10px 0;
            display: flex;
            p {
              color: #000;
              flex: 1;
              width: 0;
              padding-right: 20px;
            }
            span {
              color: #c95858;
              font-size: 12px;
              cursor: pointer;
              display: none;
            }
            &:hover {
              span {
                display: block;
              }
            }
          }
          .dz-pl {
            display: flex;
            p {
              margin-right: 20px;
              cursor: pointer;
              i {
                margin-right: 4px;
              }
              &.like, &:hover {
                color: @primary-color;
              }
            }
          }
          .reply-submit {
            margin-top: 10px;
            textarea {
              background: rgb(243,242,245);
              border: none;
              outline: none;
              width: 100%;
              border-radius: 4px;
              padding: 10px 20px;
              resize: none;
            }
            .bottom-operate {
              display: flex;
              justify-content: flex-end;
              margin-top: 5px;
            }
          }
          .reply-comment {
            background: #f5f5f5;
            padding: 10px 20px;
            margin-top: 15px;
            border-radius: 4px;
            .parent-comment {
              border: 1px solid #e4e6eb;
              background: #f2f3f5;
              border-radius: 4px;
              padding: 5px 10px;
              margin-bottom: 6px;
              p {
                color: #8a919f;
              }
            }
          }
        }
        .time {
          color: #999;
          font-size: 12px;
          position: absolute;
          right: 0;
          top: 20px;
        }
      }
    }
  }
}
::v-deep.markdown-body {
  padding: 0 !important;
  z-index: 998;
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
}
</style>