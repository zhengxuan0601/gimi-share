<template>
  <div class="gimshare-index">
    <div class="top-content">
      <h3><span>GIMSHARE</span></h3>
      <h3>帮你记录生活点滴~</h3>
      <p>Gimshare 记录美好生活~</p>
      <nuxt-link :to="`/guide/${id}`">进入分享 <a-icon type="arrow-right" /></nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    try {
      let { data } = (await $axios.get('/v1/gimshare/articleList'))
      data = data.sort((x, y) => x.articleClassify - y.articleClassify)
      return {
        id: data[0] ? data[0].id : ''
      }
    } catch (error) {
      return {
        id: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.gimshare-index {
  .top-content {
    padding: 96px 0;
    text-align: center;
    h3 {
      font-size: 36px;
      color: rgb(47,73,94);
      span {
        color: #00c58e;
      }
    }
    p {
      font-size: 16px;
      margin-top: 30px;
    }
    a {
      width: 146px;
      line-height: 50px;
      background: #00c58e;
      color: #fff;
      border-radius: 4px;
      font-size: 16px;
      margin-top: 80px;
      transition: .1s;
      display: inline-block;
      &:hover {
        background: #00e0a1;
      }
      i {
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
}
</style>