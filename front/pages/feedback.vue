<template>
  <div class="feedback-page w-960">
    <client-only>
      <div slot="placeholder">
        <div style="padding:30px;background:#fff">
          <a-skeleton :paragraph="{ rows: 6 }" active :title="{ width: 160 }" />
        </div>
      </div>
      <div style="margin-bottom: 30px; padding: 30px 10px 10px; background:#fff; border-radius: 4px;">
        <FeedbackSubmitModal 
          :user-info="userInfo"
          @success="pagination.pageNo = 1; findFeedbackList()" />
      </div>
      <div v-if="pagination.list.length" class="feedback-list-modal">
        <div v-for="item in pagination.list" :key="item.id" class="feedbak-block">
          <nuxt-link class="left-avatar" target="_blank" :to="`/user/${item.userId}`">
            <img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar">
          </nuxt-link>
          <div class="right-content">
            <div class="feed-title">
              <div>
                <nuxt-link target="_blank" :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link>
                <span>发布于{{ cycleDate(item.createTime) }}</span>
              </div>
              <div>
                <a-popover placement="top">
                  <template slot="content">
                    <div class="emoji-popover">
                      <p :class="{ active: item.isLiker }" @click="submitAttitude(item, '1', 'isLiker', 'likeCount')">👍</p>
                      <p :class="{ active: item.isDisliker }" @click="submitAttitude(item, '2', 'isDisliker', 'dislikeCount')">👎</p>
                      <p :class="{ active: item.isGifter }" @click="submitAttitude(item, '3', 'isGifter', 'giftCount')">🎉</p>
                      <p :class="{ active: item.isHearter }" @click="submitAttitude(item, '4', 'isHearter', 'heartCount')">❤️</p>
                      <p :class="{ active: item.isRocketer }" @click="submitAttitude(item, '5', 'isRocketer', 'rocketCount')">🚀</p>
                      <p :class="{ active: item.isViewer }" @click="submitAttitude(item, '6', 'isViewer', 'viewCount')">👀</p>
                    </div>
                  </template>
                  <a-icon type="smile" />
                </a-popover>
                <a-popover 
                  v-if="userInfo.id === item.userId" 
                  placement="bottom">
                  <template slot="content">
                    <p style="font-size: 12px; padding: 8px 20px; cursor: pointer;" @click="deleteFeedback(item.id)">删除</p>
                  </template>
                  <a-icon type="ellipsis" />
                </a-popover>
              </div>
            </div>
            <div class="feed-block">
              <mavon-editor 
                class="md"
                :value="item.content"
                :subfield="false"
                default-open="preview"
                :toolbars-flag="false"
                :editable="false"
                :box-shadow="false"
                :image-click="imagePreview"
                style="padding:20px">
              </mavon-editor>
              <div 
                v-show="item.likeCount 
                  || item.dislikeCount 
                  || item.giftCount 
                  || item.heartCount 
                  || item.rocketCount 
                  || item.viewCount" class="attitude-count">
                <a-popover placement="top">
                  <template slot="content">
                    <div class="emoji-popover">
                      <p :class="{ active: item.isLiker }" @click="submitAttitude(item, '1', 'isLiker', 'likeCount')">👍</p>
                      <p :class="{ active: item.isDisliker }" @click="submitAttitude(item, '2', 'isDisliker', 'dislikeCount')">👎</p>
                      <p :class="{ active: item.isGifter }" @click="submitAttitude(item, '3', 'isGifter', 'giftCount')">🎉</p>
                      <p :class="{ active: item.isHearter }" @click="submitAttitude(item, '4', 'isHearter', 'heartCount')">❤️</p>
                      <p :class="{ active: item.isRocketer }" @click="submitAttitude(item, '5', 'isRocketer', 'rocketCount')">🚀</p>
                      <p :class="{ active: item.isViewer }" @click="submitAttitude(item, '6', 'isViewer', 'viewCount')">👀</p>
                    </div>
                  </template>
                  <a-icon type="smile" />
                </a-popover>
                <p v-if="item.likeCount" :class="{ active: item.isLiker }" @click="submitAttitude(item, '1', 'isLiker', 'likeCount')">👍<span>{{ item.likeCount }}</span></p>
                <p v-if="item.dislikeCount" :class="{ active: item.isDisliker }" @click="submitAttitude(item, '2', 'isDisliker', 'dislikeCount')">👎<span>{{ item.dislikeCount }}</span></p>
                <p v-if="item.giftCount" :class="{ active: item.isGifter }" @click="submitAttitude(item, '3', 'isGifter', 'giftCount')">🎉<span>{{ item.giftCount }}</span></p>
                <p v-if="item.heartCount" :class="{ active: item.isHearter }" @click="submitAttitude(item, '4', 'isHearter', 'heartCount')">❤️<span>{{ item.heartCount }}</span></p>
                <p v-if="item.rocketCount" :class="{ active: item.isRocketer }" @click="submitAttitude(item, '5', 'isRocketer', 'rocketCount')">🚀<span>{{ item.rocketCount }}</span></p>
                <p v-if="item.viewCount" :class="{ active: item.isViewer }" @click="submitAttitude(item, '6', 'isViewer', 'viewCount')">👀<span>{{ item.viewCount }}</span></p>
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
import { cycleDate } from '@/util'
import FeedbackSubmitModal from '@/components/FeedbackSubmitModal'
export default {
  name: 'FeedBack',
  components: { FeedbackSubmitModal },
  layout: 'BaseLayout',
  data () {
    return {
      cycleDate,
      pagination: {
        pageNo: 1,
        pageSize: 20,
        list: [],
        total: 0
      },
      attitudeLoading: false
    }
  },

  head() {
    return {
      title: 'GimiShare 反馈信息列表'
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  created () {
    this.findFeedbackList()
  },

  methods: {
    /**
     * find feedback list bu page
     */
    async findFeedbackList () {
      try {
        const { pageNo, pageSize } = this.pagination
        const { data } = await this.$axios.get(`/api/v1/feedbacks?pageNo=${pageNo}&pageSize=${pageSize}`)
        this.pagination = {
          ...data,
          pageSize: this.pagination.pageSize
        }
      } catch (error) {}
    },

    /**
     * delete feedback
     * @param { String } id 
     */
    async deleteFeedback (id) {
      try {
        await this.$axios.get(`/api/v1/feedbacks/delete?id=${id}`)
        this.$message.success('删除成功')
        const idx = this.pagination.list.findIndex(o => o.id === id)
        this.pagination.list.splice(idx, 1)
      } catch (error) {}
    },

    /**
     * user feedback attitude update
     * @param { Object } feedbackItem
     * @param { String } itemType
     * @param { String } attitudeState
     * @param { String } countfiled
     */
    async submitAttitude (feedbackItem, itemType, attitudeState, countfiled) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      if (this.attitudeLoading) return
      this.attitudeLoading = true
      try {
        const API = feedbackItem[attitudeState] ? '/api/v1/feedbacks/attitude/cancel' : '/api/v1/feedbacks/attitude/increase'
        await this.$axios.get(`${API}?feedbackId=${feedbackItem.id}&itemType=${itemType}`)
        if (feedbackItem[attitudeState]) {
          feedbackItem[countfiled] -= 1
        } else {
          feedbackItem[countfiled] += 1
        }
        feedbackItem[attitudeState] = !feedbackItem[attitudeState]
      } catch (error) {} finally {
        this.attitudeLoading = false
      }
    },

    imagePreview (e) {
      const img = e.getAttribute('src')
      this.$store.commit('UPDATE_PREVIEW_IMGSRC', img)
    }
  }
}
</script>
<style scoped lang="less">
.feedback-page {
  padding: 30px 50px;
  border-radius: 4px;
  .feedback-list-modal {
    background: #fff;
    padding: 50px 30px 30px;
    border-radius: 6px;
    .feedbak-block {
      margin-bottom: 30px;
      display: flex;
      .left-avatar {
        width: 40px;
        height: 40px;
        overflow: hidden;
        display: block;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      }
      .right-content {
        width: 0;
        flex: 1;
        padding-left: 20px;
        .feed-title {
          height: 38px;
          padding: 0 20px;
          background-color: #f6f8fa;
          border: 1px solid #d0d7de;
          border-radius: 8px 8px 0 0;
          font-size: 12px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          a {
            font-weight: bold;
            color: #24292f;
            &:hover {
              text-decoration: underline;
              color: @hover-primary-color;
            }
          }
          span {
            color: #999;
            margin-left: 8px;
          }
          i {
            font-size: 17px;
            margin-left: 6px;
            cursor: pointer;
          }
          &:after {
            content: "";
            position: absolute;
            top: 11px;
            right: 100%;
            left: -8px;
            display: block;
            width: 8px;
            height: 16px;
            pointer-events: none;
            -webkit-clip-path: polygon(0 50%, 100% 0, 100% 100%);
            clip-path: polygon(0 50%, 100% 0, 100% 100%);
            background-color: #d0d7de;
          }
          &:before {
            content: '';
            position: absolute;
            top: 11px;
            right: 100%;
            left: -8px;
            display: block;
            width: 8px;
            height: 16px;
            pointer-events: none;
            -webkit-clip-path: polygon(0 50%, 100% 0, 100% 100%);
            clip-path: polygon(0 50%, 100% 0, 100% 100%);
            background-color: #f6f8fa;
            z-index: 2;
            margin-left: 1px;
          }
        }
        .feed-block {
          padding: 10px 20px;
          border: 1px solid #d0d7de;
          margin-top: -1px;
          min-height: auto;
          border-radius: 0 0 8px 8px;
          .md {
            padding: 0 !important;
            border: none;
            min-height: auto;
            z-index: 20;
            ::v-deep.v-show-content {
              padding: 0 !important;
              background: transparent !important;
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
                max-width: 120px;
              }
            }
            .v-note-img-wrapper {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100vh;
            }
          }
          .attitude-count {
            display: flex;
            align-items: center;
            margin-top: 10px;
            i {
              cursor: pointer;
              font-size: 16px;
            }
            p {
              color: #24292f;
              font-size: 12px;
              margin-left: 12px;
              border: 1px solid #f1f1f1;
              padding: 2px 10px 3px;
              border-radius: 12px;
              cursor: pointer;
              &.active {
                background: #ebfbf2;
                border-color: #a3fec1;
                span {
                  color: #3fb867;
                }
              }
              span {
                margin-left: 4px;
                color: #999;
              }
            }
          }
        }
      }
    }
  }
}
</style>