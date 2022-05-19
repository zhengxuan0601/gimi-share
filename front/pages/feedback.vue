<template>
  <div class="feedback-page w-960">
    <client-only>
      <div slot="placeholder">
        <div style="padding:30px;background:#fff">
          <a-skeleton :paragraph="{ rows: 6 }" active :title="{ width: 160 }" />
        </div>
      </div>
      <div class="edit-markdown-block">
        <div class="left-avatar">
          <img :src="userInfo ? userInfo.avatar || require('~/assets/images/default.png') : require('~/assets/images/default.svg')" alt="avatar">
        </div>
        <div class="mavon-edit">
          <mavon-editor 
            ref='md'
            v-model="content"
            toolbars-background="#f6f8fa"
            :toolbars="toolbars" 
            :tab-size="4"
            :subfield="false"
            placeholder="留下你宝贵的意见吧^^（最少输入20个字符）"
            :box-shadow="false"
            @imgAdd="uploadImageServer">
          </mavon-editor>
        </div>
        <div class="bottom-operate">
          <a-button 
            :disabled="content.length < 20"
            type="primary" 
            @click="submitFeedback">提交反馈</a-button>
        </div>
      </div>
      <div v-if="pagination.list.length" class="feedback-list-modal">
        <div v-for="item in pagination.list" :key="item.id" class="feedbak-block">
          <nuxt-link class="left-avatar" :to="`/user/${item.userId}`">
            <img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar">
          </nuxt-link>
          <div class="right-content">
            <div class="feed-title">
              <div>
                <nuxt-link :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link>
                <span>发布于{{ cycleDate(item.createTime) }}</span>
              </div>
              <div>
                <a-popover trigger="click" placement="top">
                  <template slot="content">
                    <div class="emoji-popover">
                      <p>👍</p>
                      <p>👎</p>
                      <p>🎉</p>
                      <p>❤️</p>
                      <p>🚀</p>
                      <p>👀</p>
                    </div>
                  </template>
                  <a-icon type="smile" />
                </a-popover>
                <a-popover 
                  v-if="userInfo.id === item.userId" 
                  trigger="click" 
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
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { cycleDate } from '@/util'
export default {
  name: 'FeedBack',
  layout: 'BaseLayout',
  data () {
    return {
      cycleDate,
      content: '',
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        mark: true,
        superscript: true,
        quote: true, 
        ol: true, 
        ul: true,
        link: true,
        imagelink: true,
        help: false,
        code: true,
        table: true,
        htmlcode: false,
        fullscreen: false,
        readmodel: false, 
        undo: true,
        trash: false, 
        save: false,
        navigation: false,
        preview: true
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        list: [],
        total: 0
      }
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
     * user submit feedback
     */
    async submitFeedback () {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        await this.$axios.post('/api/v1/feedbacks/create', { content: this.content })
        this.$message.success('提交反馈成功')
        this.content = ''
        this.pagination.pageNo = 1
        this.findFeedbackList()
      } catch (error) {}
    },

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

    uploadImageServer (pos, $file) {
      const formdata = new FormData();
      formdata.append('file', $file);
      axios({
        url: 'https://zdxblog.cn/upload/uploadFile',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(data => {
        this.$refs.md.$img2Url(pos, data.data.data)
      }).catch(() => {
        this.$message.error('上传图片失败，请重新上传')
      })
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
  .edit-markdown-block {
    margin-bottom: 30px;
    display: flex;
    background: #fff;
    padding: 50px 30px 30px;
    border-radius: 6px;
    flex-wrap: wrap;
    .left-avatar {
      width: 40px;
      height: 40px;
      overflow: hidden;
      display: block;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }
    .mavon-edit {
      width: 0;
      flex: 1;
      margin-left: 20px;
      position: relative;
      ::v-deep .v-note-wrapper {
        border: 1px solid #d0d7de;
        min-height: 200px;
        z-index: 99;
        .v-note-op {
          border-bottom: 1px solid #d0d7de;
        }
        .v-note-panel {
          .v-note-edit.divarea-wrapper.single-edit {
            max-height: 300px;
          }
        }
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
        z-index: 100;
        margin-left: 2px;
      }
    }
    .bottom-operate {
      width: 100%;
      margin-top: 30px;
      text-align: right;
    }
  }
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
            margin-left: 2px;
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
        }
      }
    }
  }
}
</style>