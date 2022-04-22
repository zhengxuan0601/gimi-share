<template>
  <div class="writecenter-content">
    <div class="writemodel-title">
      <input 
        v-model="articleInfo.articleTitle"
        class="article-title" 
        type="text" 
        placeholder="输入文章标题...">
      <a-popover placement="bottomRight" trigger="click">
        <template slot="content">
          <div class="popover-form">
            <a-form-model 
              ref="articleForm"
              :model="articleInfo" 
              :rules="rules"
              :label-col="{ span: 6 }" 
              :wrapper-col="{ span: 18 }">
              <a-form-model-item label="文章分类" prop="articleClassify">
                <a-radio-group v-model="articleInfo.articleClassify">
                  <a-radio :value="1">旅行攻略</a-radio>
                  <a-radio :value="2"> 生活常识</a-radio>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="关键字" prop="keywords">
                <a-input v-model="articleInfo.keywords" placeholder="输入关键字，用;进行分隔" />
              </a-form-model-item>
              <a-form-model-item label="文章封面" style="margin-bottom: 0">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  action="https://zdxblog.cn/upload/uploadFile"
                  @change="handleChange"
                >
                  <img v-if="articleInfo.articleCover" :src="articleInfo.articleCover" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      Upload
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
              <a-form-model-item 
                style="margin-bottom: 0"
                :wrapper-col="{ span: 4, offset: 20 }">
                <a-button
                  :disabled="!articleInfo.articleTitle || !articleInfo.context"
                  type="primary"
                  @click="saveShareArticle">发布</a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </template>
        <a-button
          type="primary">提 交</a-button>
      </a-popover>
    </div>
    <div class="markdown-body">
      <client-only>
        <server-loading slot="placeholder"></server-loading>
        <mavon-editor 
          ref='md'
          v-model="articleInfo.context"
          :toolbars="toolbars" 
          :tab-size="4"
          :box-shadow="false"
          @imgAdd="uploadImageServer">
        </mavon-editor>
      </client-only>
    </div>
    <div class="article-bottom"></div>
  </div>
</template>

<script>
import axios from 'axios'
import ServerLoading from '@/components/ServerLoading'
export default {
  name: 'WriteCenter',
  components: { ServerLoading },
  
  async validate ({ params, $axios }) {
    if (!params.id) {
      return true
    }
    try {
      const { data } = await $axios.get(`/v1/gimshare/articleDetail?id=${params.id}`)
      if (!data) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  },

  async asyncData ({ $axios, params }) {
    const id = params.id
    if (id) {
      const { data } = await $axios.get(`/v1/gimshare/articleDetail?id=${id}`)
      return {
        id,
        initTitle: data.articleTitle,
        articleInfo: data
      }
    } else {
      return {
        articleInfo: {
          articleTitle: '',
          context: '',
          articleClassify: '',
          keywords: '',
          articleCover: ''
        }
      }
    }
  },

  data () {
    return {
      loading: false,
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
        help: true,
        code: true,
        table: true,
        subfield: true, 
        htmlcode: true,
        fullscreen: false,
        readmodel: true, 
        undo: true,
        trash: false, 
        save: false,
        navigation: true,
        preview: true
      },
      rules: {
        articleClassify: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        keywords: [
          { required: true, message: '请输入文章关键字', trigger: 'change' }
        ]
      }
    }
  },

  head() {
    return {
      title: !this.id ? '写作中心-写文章' : `写作中心-${this.initTitle}`
    }
  },

  methods: {
    saveShareArticle () {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
           try {
            const API = this.id ? '/v1/gimshare/editArticle' : '/v1/gimshare/additionArticle'
            await this.$axios.post(API, this.articleInfo)
            this.$message.success(this.id ? '编辑文章成功' : '添加文章成功')
            this.$router.push('/articleList')
          } catch (error) {
            console.log(error)
          }
        }
      })
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

    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.articleInfo.articleCover = info.file.response.data
        this.loading = false
      }
      if (info.file.status === 'error') {
        this.loading = false
      }
    },
  }
}
</script>

<style scoped lang="less">
.writecenter-content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .writemodel-title {
    background: #fff;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .article-title {
      height: 38px;
      outline: none;
      font-size: 20px;
      line-height: 38px;
      border: none;
      flex: 1;
      width: 0;
      &::placeholder {
        font-size: 18px;
      }
    }
    ::v-deep.ant-btn {
      flex-shrink: 0;
    }
  }
  .markdown-body {
    height: 0;
    flex: 1;
  }
  ::v-deep.v-note-wrapper {
    height: 100%;
    z-index: 999;
    .v-note-panel {
      .v-note-edit {
        border-right: 1px solid #f1f1f1;
        overflow-y: auto;
      }
    }
    .v-show-content {
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
  }
  .article-bottom {
    height: 24px;
    border-top: 1px solid #f1f1f1;
    background: #fff;
  }
}
::v-deep.bottom-btn {
  text-align: right;
  padding-top: 20px;
}

.popover-form {
  width: 400px;
  padding: 10px;
  ::v-deep.ant-form-item {
    margin-bottom: 10px;
  }
}
</style>
