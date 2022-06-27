<template>
  <div class="writecenter-content">
    <client-only>
      <server-loading slot="placeholder"></server-loading>
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
                <a-form-model-item label="文章分类" prop="category">
                  <a-select v-model="articleInfo.category" placeholder="请选择分类">
                    <a-select-option 
                      v-for="item in categoryOption" 
                      :key="item.value" 
                      :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="标签" prop="tag">
                  <a-select 
                    v-model="articleInfo.tag" 
                    mode="multiple"
                    show-arrow
                    allow-clear
                    :show-search="false"
                    placeholder="请选择标签">
                    <a-select-option 
                      v-for="item in tagOptions.filter(i => i.pid === articleInfo.category)"
                      :key="item.value" 
                      :disabled="articleInfo.tag && articleInfo.tag.length > 1" 
                      :value="item.value">
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="文章封面" style="margin-bottom: 0">
                  <a-upload
                    name="file"
                    list-type="picture-card"
                    class="article-cover-uploader"
                    :show-upload-list="false"
                    action="https://image.zdxblog.cn/upload/uploadFile"
                    @change="handleChange"
                  >
                    <img v-if="articleInfo.coverImage" :src="articleInfo.coverImage" alt="avatar" />
                    <div v-else>
                      <a-icon :type="loading ? 'loading' : 'plus'" />
                      <div class="ant-upload-text">
                        Upload
                      </div>
                    </div>
                  </a-upload>
                </a-form-model-item>
                <a-form-model-item label="参考链接" prop="linkUrl">
                  <a-input v-model="articleInfo.linkUrl" placeholder="请输入文章参考链接" />
                </a-form-model-item>
                <a-form-model-item label="文章描述" prop="description">
                  <a-textarea v-model="articleInfo.description" placeholder="请输入文章描述" :rows="4" />
                </a-form-model-item>
                <a-form-model-item 
                  label=" "
                  :colon="false"
                  style="margin-bottom: 0;text-align: right;">
                  <a-button
                    :disabled="!articleInfo.articleTitle || !articleInfo.content"
                    type="primary"
                    @click="saveShareArticle">确认并发布</a-button>
                </a-form-model-item>
              </a-form-model>
            </div>
          </template>
          <a-button type="primary">提 交</a-button>
        </a-popover>
      </div>
      <div class="markdown-body">
        <mavon-editor 
          ref='md'
          v-model="articleInfo.content"
          :toolbars="toolbars" 
          :tab-size="4"
          :box-shadow="false"
          @imgAdd="uploadImageServer">
        </mavon-editor>
      </div>
      <div class="article-bottom"></div>
    </client-only>
  </div>
</template>

<script>
import axios from 'axios'
import { categoryOption, tagOptions } from '~/config/optionMap'
import ServerLoading from '~/components/ServerLoading'
export default {
  name: 'WriteCenter',
  components: { ServerLoading },
  async asyncData ({ $axios, params }) {
    const id = params.id
    if (id) {
      const { data } = await $axios.get(`/api/v1/articles/articleinfo?id=${id}`)
      return {
        id,
        initTitle: data.articleTitle,
        articleInfo: {
          ...data,
          tag: data.tag.split(';')
        }
      }
    } else {
      return {
        articleInfo: {
          articleTitle: '',
          content: '',
          category: undefined,
          tag: undefined,
          coverImage: '',
          description: '',
          linkUrl: ''
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
        category: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '请输入标签', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入文章描述', trigger: 'change' }
        ]
      },
      categoryOption,
      tagOptions
    }
  },

  head() {
    return {
      title: !this.id ? '写作中心-写文章' : `写作中心-${this.initTitle}`
    }
  },

  watch: {
    'articleInfo.category' () {
      this.articleInfo.tag = []
    }
  },

  methods: {
    saveShareArticle () {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
           try {
            const API = this.id ? '/api/v1/articles/updatearticle' : '/api/v1/articles/createarticle'
            const searchParams = {
              ...this.articleInfo,
              tag: this.articleInfo.tag.join(';')
            }
            await this.$axios.post(API, searchParams)
            this.$message.success(this.id ? '编辑文章成功' : '发布文章成功')
            this.$router.replace('/')
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
        url: 'https://image.zdxblog.cn/upload/uploadFile',
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
        this.articleInfo.coverImage = info.file.response.data
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
      mark {
        background-color: rgb(189 98 98 / 20%);
        font-size: 13px;
        color: #e94d4d;
        padding: 0px 5px;
        border-radius: 2px;
        margin: 0 2px;
      }
    }
  }
  .article-bottom {
    height: 24px;
    border-top: 1px solid #f1f1f1;
    background: #fff;
  }
}

.popover-form {
  width: 400px;
  padding: 20px;
  ::v-deep.ant-form-item {
    margin-bottom: 10px;
  }
}
</style>

<style lang="less">
.article-cover-uploader {
  & > .ant-upload {
    width: 128px;
    height: auto;
    max-height: 200px;
    min-height: 65px;
    .ant-upload {
      padding: 0;
      img {
        width: 100%;
      }
      .anticon {
        font-size: 20px;
        margin-top: 10px;
      }
      .ant-upload-text {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }
  }
}
</style>