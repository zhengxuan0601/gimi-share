<template>
  <div class="share-circle-content w-1100">
    <div class="left-share-modal">
      <!-- 友圈分享发布模块 -->
      <div class="publish-block">
        <div class="input-block">
          <textarea 
            id="shareInput"
            v-model="content" 
            class="rich-editor"
            rows="4"
            maxlength="255"
            placeholder="快来分享你的新鲜事吧~"></textarea>
          <a-upload
            v-if="fileList.length"
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="beforeImageUpload"
            :custom-request="customHttpRequest"
            :remove="handleRemove"
            @preview="handlePreview">
            <div v-if="fileList.length < 3">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </div>
        <div class="publish-group">
          <div class="left-gropu">
            <EmojiPicker @select="selectEmoji" />
            <a-upload
              name="file"
              :before-upload="beforeImageUpload"
              :custom-request="customHttpRequest"
              action="#">
              <p class="select-pic"><a-icon type="file-image" />图片 </p>
            </a-upload>
          </div>
          <div>
            <a-button 
              :disabled="!content"
              :loading="publishLoading"
              type="primary"
              @click="publishShareCircle">发布</a-button>
          </div>
        </div>
      </div>

      <client-only>
        <div
          slot="placeholder" 
          style="background: #fff; padding: 30px 20px;">
          <a-skeleton active :paragraph="{ rows: 3 }" />
        </div>
        <div 
          v-if="!pagination.list.length" 
          style="padding: 30px 0;background: #fff;">
          <a-empty 
            description="空空如也" 
            :image="require('@/assets/images/nodata.png')" /></div>
        <div v-else class="shart-list-block">
          <div 
            v-for="item in pagination.list" 
            :key="item.id" 
            class="share-block">
            <div class="top">
              <div class="left-avatar">
                <nuxt-link 
                  target="_blank"
                  :to="`/user/${item.userId}`">
                  <img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar">
                </nuxt-link>
              </div>
              <div class="right-info">
                <p class="nickname">
                  <nuxt-link target="_blank" :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link>
                </p>
                <p class="desc"><span v-if="item.job">{{ item.job }} · </span>{{ cycleDate(item.createTime) }}</p>
                <p class="share-info">{{ item.content }}</p>
                <div 
                  v-if="item.picList && item.picList.length" 
                  class="img-box">
                  <div 
                    v-for="itemName in item.picList"
                    :key="itemName" 
                    class="share-img" 
                    @click="handlePreview({ url: itemName })">
                    <img :src="itemName" alt="shareImg">
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div 
                :class="{ like: item.replyState }"
                @click="item.replyState = !item.replyState">
                <a-icon :type="!item.replyState ? 'message' : 'sound'" />
                <span v-if="item.commentCount">{{ item.commentCount }}</span>
              </div>
              <div
                :class="{ like: item.isLiker }" 
                @click="isLikeCircle(item)">
                <a-icon type="like" />
                <span v-if="item.agreeCount">{{ item.agreeCount }}</span>
              </div>
            </div>
            <SimpleComment
              v-if="item.replyState"
              :circie-user-id="item.userId"
              :circle-id="item.id" />
          </div>
        </div>
      </client-only>
    </div>
    <div class="right-data-modal">
      <div class="user-modal">
        <div class="profile">
          <div class="avatar">
            <img 
              :src="!userInfo ? require('~/assets/images/default.svg') : userInfo.avatar || require('~/assets/images/default.png')" 
              alt="avatar">
          </div>
          <div class="user-info">
            <p class="nickname">
              <span v-if="userInfo">{{ userInfo.nickname }}</span>
              <em v-else @click="$store.commit('UPDATE_LOGIN_VISIBLE', true)">登录/注册</em>
            </p>
            <p class="job">{{ userInfo ? userInfo.job || '' : '即刻玩转友圈' }}</p>
          </div>
        </div>
        <div class="statistics">
          <div @click="userRouteLink('/circle')">
            <p>友圈</p>
            <span>{{ staticsCount.shareCount === undefined ? '-' : staticsCount.shareCount }}</span>
          </div>
          <div @click="userRouteLink('/focus')">
            <p>关注</p>
            <span>{{ staticsCount.focusCount === undefined ? '-' : staticsCount.focusCount }}</span>
          </div>
          <div @click="userRouteLink('/focus')">
            <p>关注者</p>
            <span>{{ staticsCount.focusedCount === undefined ? '-' : staticsCount.focusedCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SimpleComment from './components/SimpleComment'
import { getBase64, cycleDate } from '~/util'
import EmojiPicker from '~/components/EmojiPicker'
export default {
  name: 'ShareCircle',
  components: { EmojiPicker, SimpleComment },
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const { data } = await $axios.get(`/api/v1/shares?pageNo=${pageNo}&pageSize=${pageSize}`)
      const list = data.list.map(o => {
       return {
          ...o,
        replyState: false
       }
      })
      return {
        pagination: {
          ...data,
          list,
          pageSize
        }
      }
    } catch (error) {
      return {
        pagination: {
          pageNo: 1,
          pageSize: 20,
          list: [],
          total: 0
        }
      }
    }
  },
  data () {
    return {
      cycleDate,
      content: '',
      fileList: [],
      publishLoading: false,
      staticsCount: ''
    }
  },

  head() {
    return {
      title: '友圈分享 - GimiShare',
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: 'GimiShare，友圈分享' }
      ]
    }
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },

  watch: {
    userInfo: {
      handler (newval) {
        newval && this.getUserStatistics()
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    /**
     * publish share circle 
     */
    async publishShareCircle () {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      if (this.content || this.publishLoading) {
        this.publishLoading = true
        const data = new FormData()
        data.append('content', this.content)
        this.fileList.forEach(file => {
          data.append('file', file)
        })
        try {
          await this.$axios.post('/api/v1/shares/createshare', data)
          this.pagination.pageNo = 1
          this.content = ''
          this.fileList = []
          this.refreshShareList()
          this.$message.success('发布友圈成功')
        } catch (error) {
          console.log(error)
        } finally {
          this.publishLoading = false
        }
      }
    },

    /**
     * refresh share circle page list
     */
    async refreshShareList () {
      const [pageNo, pageSize] = [1, this.pagination.pageSize]
      try {
        const { data } = await this.$axios.get(`/api/v1/shares?pageNo=${pageNo}&pageSize=${pageSize}`)
        const list = data.list.map(o => {
          return {
              ...o,
            replyState: false
          }
        })
        this.pagination = {
          ...this.pagination,
          ...data,
          list
        }
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
        await this.$axios.get(`/api/v1${API}?id=${circleItem.id}&uid=${circleItem.userId}`)
        if (circleItem.isLiker) {
          circleItem.agreeCount -= 1
        } else {
          circleItem.agreeCount += 1
        }
        circleItem.isLiker = !circleItem.isLiker
      } catch (error) {}
    },

    async getUserStatistics () {
      try {
        const { data } = await this.$axios.get(`/api/v1/users/getcounts?userId=${this.userInfo.id}`)
        this.staticsCount = data
      } catch (error) {
        console.log(error)
      }
    },

      /**
     * select emoji
     * @param { Object } emoji
     * @param { Object } commentItem
     */
    selectEmoji (emoji) {
      const input = document.getElementById('shareInput')
      const startPos = input.selectionStart
      const endPos = input.selectionEnd
      const resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
      input.value = resultText
      input.focus()
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      this.content = resultText
    },

    userRouteLink (path) {
      if (!this.userInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      this.$router.push(`/user/${this.userInfo.id}${path}`)
    },

    async customHttpRequest ({ file }) {
      const picSrc = await getBase64(file)
      file.url = picSrc
      this.fileList = [...this.fileList, file]
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },

    beforeImageUpload (file) {
      const fileType = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase()
      if (!["jpeg", "jpg", 'svg', 'gif', 'png'].includes(fileType)) {
        this.$message.error('上传图片格式不正确')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头图片大小不能超过 2MB!')
      }
      return true
    },

    handlePreview (file) {
      this.$store.commit('UPDATE_PREVIEW_IMGSRC', file.url)
    }
  }
}
</script>

<style scoped lang="less">
.share-circle-content {
  margin-top: 20px;
  .left-share-modal {
    width: 708px;
    .publish-block {
      position: relative;
      background: #fff;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 20px;
      .input-block {
        background: #f2f3f5;
        border: 1px solid #f2f3f5;
        border-radius: 4px;
        padding: 10px 10px 0 10px;
        textarea {
          width: 100%;
          display: block;
          padding: 5px 10px;
          resize: none;
          border: none;
          outline: none;
          background: transparent;
        }
      }
      .publish-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        .left-gropu {
          display: flex;
          align-items: center;
          .select-pic {
            margin-left: 20px;
            cursor: pointer;
            i {
              margin-right: 3px;
            }
          }
        }
      }
    }
  }
  .right-data-modal {
    position: fixed;
    top: 80px;
    margin-left: 736px;
    width: 240px;
    .user-modal {
      background: #fff;
      padding: 20px;
      .profile {
        display: flex;
        align-items: center;
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
        .user-info {
          width: 0;
          flex: 1;
          padding-left: 10px;
          .nickname {
            em {
              color: @primary-color;
              cursor: pointer;
              font-style: normal;
            }
          }
          .job {
            color: #999;
            font-size: 12px;
          }
        }
      }
      .statistics {
        margin-top: 20px;
        display: flex;
        & > div {
          width: 100%;
          cursor: pointer;
          p {
            color: #000;
            margin-bottom: 4px;
          }
          span {
            color: #999;
          }
        }
      }
    }
  }
}
</style>