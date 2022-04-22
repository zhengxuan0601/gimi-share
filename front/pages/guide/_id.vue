<template>
  <div>
    <client-only>
      <div slot="placeholder">
        <div class="arc-skeleton">
          <div class="ske-title"></div>
          <div class="ske-nick"></div>
          <div class="ske-time"></div>
          <div class="ske-cover"></div>
        </div>
        <a-skeleton active />
      </div>
      <div class="article-content">
        <div class="title">{{ articleDetail.articleTitle }}</div>
        <p class="nickname">需要坚持的人</p>
        <p class="time">{{ articleDetail.createTime.replace('-', '年').replace('-', '月').replace(' ', '日 ') }}</p>
        <img 
          v-if="articleDetail.articleCover"
          class="article-cover" 
          :src="articleDetail.articleCover" 
          alt="cover">
        <mavon-editor 
          :value="articleDetail.context"
          class="md"
          :subfield = "false"
          :default-open = "'preview'"
          :toolbars-flag = "false"
          :editable="false"
          style="padding:20px">
        </mavon-editor>
        <div class="article-tag">
          <em>标签：</em>
          <span 
            v-for="(item, index) in articleDetail.keywords.split(';')"
            :key="index">{{ item }}</span>
        </div>
        <div class="bottom-jy">
          SAY：以 「早起」、「运动」、「冥想」、「写作」、「阅读」这五件能够快速改变人生的事情为切入点，帮助大家建立良好的生活习惯，技术的成长绝不是一朝一夕，良好的习惯将会帮助我们更快的进步，但在技术之外，我更希望大家能在这些事情的坚持中，收获一份自信，多一份底气，对人生多一份积极。
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'GuideIndex',
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
    try {
      const articleDetail = (await $axios.get(`/v1/gimshare/articleDetail?id=${params.id}`)).data || {}
      return {
        articleDetail
      }
    } catch (error) {
      return {
        articleDetail: {}
      }
    }
  },

  head() {
    return {
      title: this.articleDetail.articleTitle,
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: this.articleDetail.articleTitle },
        { hid: 'keywords', name: 'keywords', content: this.articleDetail.keywords }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.article-content {
  .title {
    font-size: 24px;
    margin-bottom: 10px;
    color: #4c4c4c;
    font-weight: bold;
  }
  .time {
    color: #999;
    margin-bottom: 20px;
  }
  .nickname {
    color: #4c4c4c;
  }
  .article-cover {
    display: block;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  .article-tag {
    margin-top: 20px;
    em {
      font-style: normal;
      font-size: 12px;
    }
    span {
      background-color: #f0fff8;
      color: #00c58e;
      font-size: 12px;
      padding: 0 12px;
      margin-right: 10px;
      border-radius: 2px;
      line-height: 28px;
      display: inline-block;
      cursor: default;
    }
  }
  .bottom-jy {
    font-size: 12px;
    line-height: 24px;
    padding-top: 20px;
    color: #000;
  }
}
::v-deep.markdown-body {
  padding: 0 !important;
  z-index: 998;
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
</style>

<style lang="less">
.arc-skeleton {
  .ske-title {
    height: 16px;
    margin-top: 16px;
    background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
    width: 200px;
    animation: skeleton-loading 1.4s ease infinite;
    background-size: 400% 100%;
  }
  .ske-nick {
    height: 10px;
    margin-top: 18px;
    background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
    width: 60px;
    margin-bottom: 4px;
    animation: skeleton-loading 1.4s ease infinite;
    background-size: 400% 100%;
  }
  .ske-time {
    height: 10px;
    background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
    width: 100px;
    margin-bottom: 20px;
    animation: skeleton-loading 1.4s ease infinite;
    background-size: 400% 100%;
  }
  .ske-cover {
    height: 360px;
    margin-top: 16px;
    background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
    margin-bottom: 20px;
    animation: skeleton-loading 1.4s ease infinite;
    background-size: 400% 100%;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>