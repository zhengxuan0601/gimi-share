<template>
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
          <textarea id="commentInput" v-model="comment" rows="3" placeholder="请输入您的评论吧~"></textarea>
          <div class="bottom-operate">
            <div class="left-emoji-pic">
              <EmojiPicker @select="selectEmoji" />
            </div>
            <a-button
              :disabled="!comment"
              type="primary" 
              @click="submitComment(comment, {})">评论</a-button>
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
              <p @click="showCommentModal(item.id)">
                <a-icon type="message" />
                <span v-if="item.replyCount">{{ item.replyCount }}</span>
              </p>
            </div>
            <div
              v-if="item.id === currentCommentId" 
              class="reply-submit">
              <textarea 
                :id="`${item.id}input`"
                v-model="item.replyNewComment" rows="3" placeholder="请输入您的评论吧~"></textarea>
              <div class="bottom-operate">
                <div class="left-emoji-pic">
                  <EmojiPicker @select="selectEmoji($event, item)" />
                </div>
                <a-button
                  :disabled="!item.replyNewComment"
                  type="primary"
                  @click="submitComment(item.replyNewComment, {
                    topId: item.id, 
                    replyId: item.id
                  }, item)" >评论</a-button>
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
                    <p @click="showCommentModal(itemName.id)">
                      <a-icon type="message" />
                      <span v-if="itemName.replyCount">{{ itemName.replyCount }}</span>
                    </p>
                  </div>
                  <div
                    v-if="itemName.id === currentCommentId" 
                    class="reply-submit">
                    <textarea 
                      :id="`${itemName.id}input`"
                      v-model="itemName.replyNewComment"
                      style="background: #fff" 
                      rows="3" 
                      placeholder="请输入您的评论吧~"></textarea>
                    <div class="bottom-operate">
                      <div class="left-emoji-pic">
                        <EmojiPicker @select="selectEmoji($event, itemName)" />
                      </div>
                      <a-button
                        :disabled="!itemName.replyNewComment"
                        type="primary"
                        @click="submitComment(itemName.replyNewComment, {
                          topId: item.id, 
                          replyId: itemName.id, 
                          replyComment: itemName.content, 
                          replyNickname: itemName.nickname, 
                          replyUserId: itemName.userId
                        }, itemName)">评论</a-button>
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
</template>

<script>
import { mapState } from 'vuex'
import { cycleDate } from '~/util'
import EmojiPicker from '~/components/EmojiPicker'
export default {
  name: 'ArticleComment',
  components: { EmojiPicker },
  props: {
    articleDetail: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      cycleDate,
      comment: '',
      commentList: [],
      currentCommentId: null
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
    async submitComment (comment, { 
      topId, 
      replyId, 
      replyComment, 
      replyNickname, 
      replyUserId
     }, commentItem) {
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
        this.findComments()
        this.currentCommentId = null
        this.$message.success('评论成功')
        commentItem ? commentItem.replyNewComment = '' : this.comment = ''
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
     * @parma { String } commentId
     */
    showCommentModal (commentId) {
      if (commentId === this.currentCommentId) {
        return (this.currentCommentId = null)
      }
      this.currentCommentId = commentId
    },

    /**
     * select emoji
     * @param { Object } emoji
     * @param { Object } commentItem
     */
    selectEmoji (emoji, commentItem) {
      let input = document.getElementById('commentInput')
      commentItem && (input = document.getElementById(`${commentItem.id}input`))
      const startPos = input.selectionStart
      const endPos = input.selectionEnd
      const resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
      input.value = resultText
      input.focus()
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      if (commentItem) {
        commentItem.replyNewComment = resultText
      } else {
        this.comment = resultText
      }
    },

    /**
     * package treestructure fileds
     * @param { Array } listTree
     */
    treeStructure (listTree) {
      for (let i = 0; i < listTree.length; i++) {
        listTree[i].replyNewComment = ''
        if (listTree[i].children && listTree[i].children.length) {
          this.treeStructure(listTree[i].children)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
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
          &:focus {
            border: 1px solid @primary-color;
          }
        }
        .bottom-operate {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          align-items: center;
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
              transition: .2s;
              resize: none;
               &:focus {
                border: 1px solid @primary-color;
              }
            }
            .bottom-operate {
              display: flex;
              justify-content: space-between;
              margin-top: 5px;
              align-items: center;
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
</style>