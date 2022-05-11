<template>
  <div class="circle-simple-comment">
    <div class="submit-modal">
      <div class="left-avatar">
        <img 
          :src="!userInfo ? require('~/assets/images/default.svg') : userInfo.avatar || require('~/assets/images/default.png')" 
          alt="avatar">
      </div>
      <div class="right-input">
        <a-textarea
          id="commentInput"
          v-model="comment"
          :max-length="255"
          placeholder="输入评论" 
          :auto-size="{ minRows: 1, maxRows: 10 }" />
        <div class="bottom-operate">
          <div class="left-emoji-pic">
            <EmojiPicker @select="selectEmoji" />
          </div>
          <a-button
            :disabled="!comment" 
            type="primary" 
            @click="submitCircleComment">评论</a-button>
        </div>
      </div>
    </div>
    <div v-if="simpleInfo.list.length" class="comment-list">
      <h5>全部评论（{{ simpleInfo.total }}）</h5>
      <div v-for="item in simpleInfo.list" :key="item.id" class="comment-block">
        <div class="left-avatar">
          <nuxt-link :to="`/user/${item.userId}`">
            <img 
              :src="item.avatar || require('~/assets/images/default.png')" alt="avatar">
          </nuxt-link>
        </div>
        <div class="right-info">
          <div class="info">
            <p class="nickname">{{ item.nickname }}</p>
            <p v-if="item.job">{{ item.job }}</p>
            <p>{{ cycleDate(item.createTime) }}</p>
          </div>
          <p class="comment">{{ item.content }}</p>
          <div class="dz-pl">
            <p :class="{ like: item.isLiker }" @click="isLikeComment(item)">
              <a-icon type="like" />
              <span v-if="item.likeCount">{{ item.likeCount }}</span>
            </p>
            <p>
              <a-icon type="message" />
              <!-- <span>10</span> -->
            </p>
          </div>
          <span
            v-if="userInfo.id === item.userId 
              || userInfo.id === circieUserId" 
            class="delete" 
            @click="deleteComment(item.id)">删除</span>
        </div>
      </div>
      <nuxt-link 
        v-if="simpleInfo.total > 5" 
        to="/"
        class="show-comment-more">查看全部{{ simpleInfo.total }}条回复
        <a-icon type="double-right" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cycleDate } from '~/util'
import EmojiPicker from '~/components/EmojiPicker'
export default {
  name: 'SimlpeComment',
  components: { EmojiPicker },
  props: {
    circleId: {
      type: String,
      require: true,
      default: ''
    },
    circieUserId: {
      type: String,
      require: true,
      default: ''
    }
  },
  data () {
    return {
      cycleDate,
      comment: '',
      simpleInfo: {
        list: [],
        total: 0
      }
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  created () {
    this.finSimpleComments()
  },

  methods: {
    async submitCircleComment () {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const requestParams = {
          circleId: this.circleId,
          content: this.comment
        }
        await this.$axios.post('/api/v1/sharecircle/comments/create', requestParams)
        this.comment = ''
        this.finSimpleComments()
        this.$message.success('评论成功')
      } catch (error) {}
    },

    async finSimpleComments () {
      try {
        const { data } = await this.$axios.get(`/api/v1/sharecircle/comments/simplecomments?circleId=${this.circleId}`)
        this.simpleInfo = data
      } catch (error) {}
    },

    async isLikeComment (commentItem) {
      const API = commentItem.isLiker ? '/api/v1/users/unagreecomment' : '/api/v1/users/agreecomment'
      try {
        await this.$axios.get(`${API}?commentId=${commentItem.id}&itemType=2`)
        if (commentItem.isLiker) {
          commentItem.likeCount -= 1
        } else {
          commentItem.likeCount += 1
        }
        commentItem.isLiker = !commentItem.isLiker
      } catch (error) {}
    },

    async deleteComment (circleId) {
      try {
        await this.$axios.get(`/api/v1/sharecircle/comments/delete?id=${circleId}`)
        this.finSimpleComments()
      } catch (error) {}
    },

    /**
     * select emoji
     * @param { Object } emoji
     * @param { Object } commentItem
     */
    selectEmoji (emoji) {
      const input = document.getElementById('commentInput')
      const startPos = input.selectionStart
      const endPos = input.selectionEnd
      const resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
      input.value = resultText
      input.focus()
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      this.comment = resultText
    },
  }
}
</script>
<style scoped lang="less">
.circle-simple-comment {
  border-top: 1px solid #f1f1f1;
  position: relative;
  .submit-modal {
    padding: 20px;
    display: flex;
    .right-input {
      width: 0;
      flex: 1;
      textarea {
        resize: none;
        background: #f4f5f5;
        border: 1px solid #f4f5f5;
        padding: 8px 12px;
        &:focus {
          box-shadow: none;
          background: transparent;
          border-color: @primary-color;
        }
      }
      .bottom-operate {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        align-items: center;
      }
    }
  }
  .comment-list {
    padding: 20px;
    border-top: 1px solid #f1f1f1;
    h5 {
      font-size: 16px;
      margin-bottom: 16px;
    }
    .comment-block {
      padding: 18px 0 14px 0;
      display: flex;
      &:not(:last-of-type) {
        border-bottom: 1px solid #f1f1f170;
      }
      .right-info {
        width: 0;
        flex: 1;
        position: relative;
        .info {
          display: flex;
          p {
            color: #999;
            margin-right: 12px;
            &.nickname {
              color: #000;
            }
          }
        }
        .comment {
          padding: 10px 0;
          line-height: 22px;
        }
        .dz-pl {
          display: flex;
          p {
            margin-right: 20px;
            cursor: pointer;
            &.like, &:hover {
              color: @primary-color;
            }
          }
        }
        .delete {
          position: absolute;
          color: #c95858;
          font-size: 12px;
          cursor: pointer;
          right: 0;
          top: 0;
          display: none;
        }
        &:hover {
          .delete {
            display: block;
          }
        }
      }
    }
    .show-comment-more {
      display: block;
      text-align: center;
      color: #6a7e9a;
      i {
        transform: rotate(90deg);
        margin-left: 6px;
        position: relative;
        top: 1px;
      }
    }
  }
  .left-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
    flex-shrink: 0;
    a {
      display: block;
      width: 100%;
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  &::before {
    content: "";
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #f1f1f1;
    border-left: 10px solid transparent;
    position: absolute;
    left: 50%;
    top: -20px;
  }
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
    border-left: 8px solid transparent;
    position: absolute;
    left: 50%;
    top: -16px;
    margin-left: 2px;
    z-index: 2;
  }
}
</style>
