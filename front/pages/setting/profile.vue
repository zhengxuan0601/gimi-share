<template>
  <div class="setting-profile">
    <h3>个人资料</h3>
    <a-form-model 
      :model="basicInfoForm" 
      layout="horizontal"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 20 }"
      label-align="left"
      @submit.native.prevent>
      <a-form-model-item label="昵称" :colon="false">
        <a-input v-model="basicInfoForm.nickname" size="large" placeholder="请输入昵称">
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="头像" :colon="false" style="margin-bottom: 0">
         <a-upload
          name="file"
          class="avatar-uploader"
          list-type="picture-card"
          :show-upload-list="false"
          action="https://zdxblog.cn/upload/uploadFile"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="basicInfoForm.avatar" :src="basicInfoForm.avatar" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="性别" :colon="false">
        <a-radio-group v-model="basicInfoForm.gender" name="gender">
          <a-radio value="0"> 男</a-radio>
          <a-radio value="1"> 女</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="职位" :colon="false">
        <a-input v-model="basicInfoForm.job" size="large" placeholder="请输入职位">
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="个人介绍" :colon="false">
        <a-textarea v-model="basicInfoForm.description" :rows="4" size="large" placeholder="请输入个人介绍">
        </a-textarea>
      </a-form-model-item>
      <div class="save-btn" @click="handleSubmit">
        <button class="a-primary dashed">立即保存</button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  asyncData ({ store }) {
    try {
      const userInfo = store.state.userInfo 
      const { nickname, job, avatar, description, gender } = userInfo
      return {
         basicInfoForm: {
          nickname,
          job,
          avatar,
          description,
          gender
        }
      }
    } catch (error) {
      return {
         basicInfoForm: {
          nickname: '',
          job: '',
          avatar: '',
          description: '',
          gender: ''
        },
      }
    }
  },
  data () {
    return {
      loading: false
    }
  },
  
  methods: {
    async handleSubmit () {
      try {
        await this.$axios.post('/api/v1/users/updateuser', this.basicInfoForm)
        this.$message.success('更新资料成功')
        const { data } = await this.$axios.get('/api/v1/users/sessionuserinfo')
        this.$store.commit('UPDATE_USER_INFO', data)
      } catch (error) {
        console.log(error)
      }
    },

    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },

    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.basicInfoForm.avatar = info.file.response.data
        this.loading = false
      }
      if (info.file.status === 'error') {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.setting-profile {
  h3 {
    color: #000;
    font-weight: bold;
    font-size: 22px;
    letter-spacing: 2px;
    border-bottom: 1px solid #f1f1f1;
    padding: 20px 30px;
  }
  .ant-form-horizontal {
    padding: 30px;
    width: 80%;
    .save-btn {
      padding: 0 68px;
    }
    ::v-deep.avatar-uploader > .ant-upload {
      width: 80px;
      height: 80px;
      .ant-upload {
        padding: 0;
      }
    }
    ::v-deep.ant-upload-select-picture-card i {
      font-size: 18px;
      color: #999;
    }
    ::v-deep.ant-upload-select-picture-card .ant-upload-text {
      margin-top: 0px;
      color: #666;
      font-size: 14px;
    }
  }
}
</style>

