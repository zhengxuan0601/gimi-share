<template>
  <div class="notify-comment">
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
                <p v-if="item.isReplyComment === '1'">
                  <nuxt-link class="name" :to="`/user/${item.sourceUserId}`">{{ item.sourceNickname }}</nuxt-link>
                  回复了你在{{ item.articleId ? '文章' : '' }}
                  <nuxt-link v-if="item.articleId" :to="`/post/${item.articleId}`">{{ item.articleTitle }}</nuxt-link>
                  <nuxt-link v-if="item.circleId" :to="`/sharecircle/${item.circleId}`">友圈分享</nuxt-link>
                  下的评论
                </p>
                <p v-else>
                  <nuxt-link class="name" :to="`/user/${item.sourceUserId}`">需要坚持的人</nuxt-link>
                  评论了你的{{ item.articleId ? '文章' : '' }}
                  <nuxt-link v-if="item.articleId" :to="`/post/${item.articleId}`">{{ item.articleTitle }}</nuxt-link>
                  <nuxt-link v-if="item.circleId" :to="`/sharecircle/${item.circleId}`">友圈分享</nuxt-link>
                </p>
                <div class="reply-comment">{{ item.comment }}</div>
              </div>
              <div v-if="item.circleContent" class="circlecontent">
                <nuxt-link :to="`/sharecircle/${item.circleId}`">{{ item.circleContent }}</nuxt-link>
              </div>
            </div>
            <div class="operate">
              <span class="time">{{ cycleDate(item.createTime) }}</span>
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
  name: 'NotifyComment',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const requestParams = {
        pageNo,
        pageSize,
        itemType: '4'
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
.notify-comment {
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
            .name {
              color: #000;
            }
          }
          .reply-comment {
            margin-bottom: 10px;
            padding: 10px;
            background: #fafbfc;
            border-radius: 3px;
            border: 1px solid #f1f1f2;
            margin-top: 10px;
            word-break: break-all;
          }
        }
        .circlecontent {
          width: 66px;
          padding: 9px;
          background: #f4f4f4;
          margin-left: 10px;
          flex-shrink: 0;
          height: 70px;
          a {
            font-size: 12px;
            height: 100%;
            color: #909090;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
        }
      }
      .operate {
        .time {
          color: #999;
        }
      }
    }
  }
}
</style>