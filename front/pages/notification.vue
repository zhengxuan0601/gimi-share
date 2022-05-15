<template>
  <div class="notification-page">
    <div class="view-nav">
      <div class="nav-list w-960">
        <ul>
          <li><nuxt-link to="/notification">评论消息 <em v-if="notifyCount.commentCount">{{ notifyCount.commentCount }}</em></nuxt-link></li>
          <li><nuxt-link to="/notification/agree">点赞消息 <em v-if="notifyCount.agreeCount">{{ notifyCount.agreeCount }}</em></nuxt-link></li>
          <li><nuxt-link to="/notification/focus">关注消息 <em v-if="notifyCount.focusCount">{{ notifyCount.focusCount }}</em></nuxt-link></li>
          <li><nuxt-link to="/notification/collect">收藏消息 <em v-if="notifyCount.collectCount">{{ notifyCount.collectCount }}</em></nuxt-link></li>
        </ul>
      </div>
    </div>
    <div class="w-960">
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationPage',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    try {
      const { data } = await $axios.get('/api/v1/messages/count')
      return {
        notifyCount: data
      }
    } catch (error) {
      return {
        notifyCount: {
          commentCount: 0,
          agreeCount: 0,
          focusCount: 0,
          collectCount: 0
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.notification-page {
  .view-nav {
    height: 52px;
    border-bottom: 1px solid #f1f1f1;
    background: #fff;
    .nav-list {
      height: 100%;
      ul {
        height: 100%;
        list-style: none;
        display: flex;
        align-items: center;
        li {
          margin-right: 40px;
          a {
            color: #71777c;
            position: relative;
            &.nuxt-link-exact-active {
              color: @hover-primary-color;
              font-weight: bold;
            }
            em {
              position: absolute;
              font-style: normal;
              background: #f5222d;
              color: #fff;
              font-size: 12px;
              border-radius: 50%;
              top: -10px;
              display: inline-block;
              width: 18px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              right: -18px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>