<template>
  <div class="index-content">
    <aside>
      <div 
        v-for="item in list" 
        :key="item.articleClassify" 
        class="a-menu">
        <p>{{ item.articleName }}</p>
          <nuxt-link 
            v-for="itemName in item.children"
            :key="itemName.id" 
            :to="`/guide/${itemName.id}`">{{ itemName.articleTitle }}</nuxt-link>  
      </div>
    </aside>
    <article>
      <nuxt-child></nuxt-child>
    </article>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    let list = [
      {
        articleClassify: 1,
        articleName: '旅行攻略',
        children: []
      },
      {
        articleClassify: 2,
        articleName: '生活常识',
        children: []
      }
    ]
    try {
      const { data } = await $axios.get('/v1/gimshare/articleList')
      list = list.map(o => {
        return {
          ...o,
          children: data.filter(x => o.articleClassify === x.articleClassify)
        }
      }).filter(o => o.children.length)
      return {
        list
      }
    } catch (error) {
      return {
        list: []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.index-content {
  position: relative;
  aside {
    width: 280px;
    border-right: 1px solid #f1f1f1;
    padding: 20px 10px 20px 0;
    position: fixed;
    top: 60px;
    left: ~"calc((100vw - 1100px) / 2)";
    bottom: 0;
    .a-menu {
      margin-bottom: 16px;
      p {
        font-size: 16px;
        color: rgb(96,111,123);
        line-height: 28px;
        margin-bottom: 6px;
      }
      a {
        font-size: 15px;
        line-height: 40px;
        display: block;
        padding: 0 10px;
        border-radius: 2px;
        color: rgb(47,73,94);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.nuxt-link-exact-active {
          background-color: rgba(240,255,244,1);
          color: rgba(0,197,142,1);
        }
      }
    }
  }
  article {
    padding: 20px 0 20px 320px;
  }
}
</style>
