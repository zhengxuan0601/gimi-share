<template>
  <div class="notify-focus">
    <client-only>
      <div slot="placeholder" style="background: #fff; padding: 20px;margin-top: 16px;">
        <a-skeleton avatar active />
      </div>
      <div 
        v-if="!list.length" 
        style="padding: 30px 0; background: #FFF; margin-top: 16px;">
        <a-empty 
          description="空空如也" 
          :image="require('~/assets/images/nodata.png')" /></div>
      <div v-else>
        <div v-for="item in list" :key="item.id" class="notify-modal">
          <div class="left-avatar">
            <nuxt-link :to="`/user/${item.sourceUserId}`">
              <img :src="item.sourceAvatar || require('~/assets/images/default.png')" alt="avatar">
            </nuxt-link>
          </div>
          <div class="right-info">
            <div class="info">
              <div class="comment">
                <p>
                  <nuxt-link class="name" :to="`/user/${item.sourceUserId}`">{{ item.sourceNickname }}</nuxt-link>
                  关注了你
                </p>
                <p class="time">{{ cycleDate(item.createTime) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { cycleDate } from '@/util'
export default {
  name: 'NotifyFocus',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const requestParams = {
        pageNo,
        pageSize,
        itemType: '3'
      }
      const { data } = await $axios.post('/api/v1/messages', requestParams)
      return {
        ...data,
        pageSize
      }
    } catch (error) {
      return {
        list: [],
        pageNo,
        pageSize,
        total: 0
      }
    }
  },
  data () {
    return {
      cycleDate
    }
  }
}
</script>

<style scoped lang="less">
.notify-focus {
  width: 720px;
  .notify-modal {
    background: #fff;
    margin-top: 16px;
    padding: 20px;
    display: flex;
    .left-avatar {
      width: 45px;
      height: 45px;
      flex-shrink: 0;
      a {
        display: block;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .right-info {
      padding-left: 20px;
      width: 0;
      flex: 1;
      .info {
        display: flex;
        .comment {
          flex: 1;
          width: 0;
          p {
            a {
              color: #000;
            }
            &.time {
              color: #999;
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
}
</style>