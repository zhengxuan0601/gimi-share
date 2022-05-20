<template>
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
        :autofocus="true"
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
</template>

<script>
import axios from 'axios'
export default {
  props: {
    userInfo: {
      default: null,
      type: Object
    }
  },

  data () {
    return {
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
    }
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
        this.$message.success('提交反馈信息成功')
        this.content = ''
        this.$emit('success')
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
  }
}
</script>

<style lang="less" scoped>
.edit-markdown-block {
  display: flex;
  background: #fff;
  border-radius: 6px;
  flex-wrap: wrap;
  padding: 20px;
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
</style>