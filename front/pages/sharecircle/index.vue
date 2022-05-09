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
          style="background: #fff; padding: 30px 20px; margin-top: 20px;">
          <a-skeleton active avatar />
        </div>
        <div 
          v-if="!pagination.list.length" 
          style="padding: 30px 0;background: #fff;margin-top: 20px;">
          <a-empty 
            description="空空如也" 
            :image="require('@/assets/images/nodata.png')" /></div>
        <!-- 友圈分享列表 -->
        <div v-else class="shart-list-block">
          <div 
            v-for="item in pagination.list" 
            :key="item.id" 
            class="share-block">
            <div class="top">
              <div class="left-avatar">
                <nuxt-link to="/"><img :src="item.avatar || require('~/assets/images/default.png')" alt="avatar"></nuxt-link>
              </div>
              <div class="right-info">
                <p class="nickname">
                  <nuxt-link :to="`/user/${item.userId}`">{{ item.nickname }}</nuxt-link>
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
              <div><a-icon type="message" /><span>10</span></div>
              <div><a-icon type="like" /><span>11</span></div>
            </div>
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
          <div><p>友圈</p><span>{{ staticsCount.shareCount === undefined ? '-' : staticsCount.shareCount }}</span></div>
          <div><p>关注</p><span>{{ staticsCount.focusCount === undefined ? '-' : staticsCount.focusCount }}</span></div>
          <div><p>关注者</p><span>{{ staticsCount.focusedCount === undefined ? '-' : staticsCount.focusedCount }}</span></div>
        </div>
      </div>
    </div>
     <a-modal 
        :visible="previewVisible" 
        :footer="null" 
        @cancel="previewVisible = false">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getBase64, cycleDate } from '~/util'
import EmojiPicker from '~/components/EmojiPicker'
export default {
  name: 'ShareCircle',
  components: { EmojiPicker },
  layout: 'BaseLayout',
  data () {
    return {
      cycleDate,
      content: '',
      fileList: [],
      previewVisible: false,
      previewImage: null,
      pagination: {
        pageNo: 1,
        pageSize: 20,
        list: [],
        total: 0
      },
      publishLoading: false,
      staticsCount: ''
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

  created () {
    this.findShareList()
  },

  methods: {
    /**
     * publish share circle 
     */
    async publishShareCircle () {
      if (!this.userInfo) {
        this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
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
          this.findShareList()
          this.$message.success('发布友圈成功')
        } catch (error) {
          console.log(error)
        } finally {
          this.publishLoading = false
        }
      }
    },

    /**
     * find share circle page list
     */
    async findShareList () {
      const { pageNo, pageSize } = this.pagination
      try {
        const { data } = await this.$axios.get(`/api/v1/shares?pageNo=${pageNo}&pageSize=${pageSize}`)
        this.pagination = {
          ...this.pagination,
          ...data,
        }
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

    async getUserStatistics () {
      try {
        const { data } = await this.$axios.get(`/api/v1/users/getcounts?userId=${this.userInfo.id}`)
        console.log(data)
        this.staticsCount = data
      } catch (error) {
        console.log(error)
      }
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
      this.previewImage = file.url
      this.previewVisible = true
    }
  }
}
</script>

<style scoped lang="less">
.share-circle-content {
  .left-share-modal {
    width: 708px;
    .publish-block {
      position: relative;
      background: #fff;
      border-radius: 4px;
      padding: 20px;
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
    .shart-list-block {
      margin-top: 20px;
      .share-block {
        background: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        .top {
          display: flex;
          padding: 20px 20px 10px 20px;
          .left-avatar {
            width: 48px;
            height: 48px;
            a {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .right-info {
            width: 0;
            flex: 1;
            padding-left: 14px;
            .nickname {      
              font-size: 15px;
              a {
                color: #4c4c4c;
                &:hover {
                  color: #2080f7;
                }
              }
            }
            .desc {
              padding-bottom: 10px;
              font-size: 12px;
            }
            .share-info {
              color: #000;
            }
            .img-box {
              padding: 16px 0;
              display: flex;
              .share-img {
                margin-right: 4px;
                img {
                  display: block;
                  flex: 0 1 auto;
                  max-width: 100%;
                  min-width: 110px;
                  cursor: zoom-in;
                  min-height: 110px;
                  max-height: 230px;
                  -o-object-fit: cover;
                  object-fit: cover;
                }
                &:nth-child(1):nth-last-child(1) {
                   border-radius: 4px;
                  overflow: hidden;
                  img {
                    width: 200px;
                  }
                }
                &:nth-child(1):nth-last-child(2), 
                &:nth-child(2):nth-last-child(1), 
                &:nth-child(3):nth-last-child(1), 
                &:nth-child(2):nth-last-child(2), 
                &:nth-child(1):nth-last-child(3) {
                  img {
                    width: 110px;
                  }
                }
              }
            }
          }
        }
        .bottom {
          border-top: 1px solid #f1f1f1;
          display: flex;
          div {
            width: 50%;
            text-align: center;
            padding: 10px 0;
            cursor: pointer;
            color: #86909c;
            &:hover {
              opacity: .8;
            }
            i {
              position: relative;
              top: 1px;
              margin-right: 2px;
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