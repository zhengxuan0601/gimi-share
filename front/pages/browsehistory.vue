<template>
  <div class="browsehistory-page w-960">
    <div class="title"><p>浏览记录</p></div>
    <client-only>
      <div slot="placeholder">
        <div style="padding: 10px 20px;background:#fff">
          <a-skeleton active />
        </div>
      </div>
      <div 
        v-if="!list.length" 
        style="padding: 30px 0;">
        <a-empty 
          description="空空如也" 
          :image="require('@/assets/images/nodata.png')" /></div>
      <div v-else class="content">
        <div v-for="item in list" :key="item.date" class="modal">
          <div class="time-cat"><a-icon type="clock-circle" />{{ item.date }}</div>
          <div class="arc-list">
            <div v-for="itemName in item.children" :key="itemName.id" class="arc-modal">
              <div class="left">
                <nuxt-link target="_blank" :to="`/post/${itemName.articleId}`" class="arc-title">{{ itemName.articleTitle }}</nuxt-link>
                <p class="arc-desc">{{ itemName.description }}</p>
                <div class="info">
                  <nuxt-link target="_blank" :to="`/user/${itemName.uid}`">{{ itemName.authorNickname }}</nuxt-link>
                  <em>{{ itemName.viewCounts }}阅读 · {{ itemName.likeCounts }}赞 · {{ itemName.commentCounts }}评论</em>
                </div>
              </div>
              <div v-if="itemName.coverImage" class="right">
                <img 
                  :src="itemName.coverImage" alt="articlecover">
              </div>
              <a-icon type="close" class="delete-history" @click="deleteHistory(item, itemName)" />
            </div>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'BrowseHistory',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const { data } = await $axios.get(`/api/v1/history?pageNo=${pageNo}&pageSize=${pageSize}`)
      const list = data.list.reduce((prev, cur) => {
        const target = prev.find(o => o.date === cur.date)
        if (!target) {
          prev.push({ date: cur.date, children: [cur] })
        } else {
          target.children.push(cur)
        }
        return prev
      }, [])
      return {
        ...data,
        list,
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

  methods: {
    /**
     * delete user history
     */
    async deleteHistory(parentItem, hisItem) {
      const id = hisItem.id
      try {
        await this.$axios.get(`/api/v1/history/delete?id=${id}`)
        const idx = parentItem.children.findIndex(o => o.id === id)
        parentItem.children.splice(idx, 1)
        if (!parentItem.children.length) {
          const idx = this.list.findIndex(o => o.date === parentItem.date)
          this.list.splice(idx, 1)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
.browsehistory-page {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
  .title {
    p {
      font-size: 18px;
      color: #000;
      font-weight: bold;
    }
    margin-bottom: 20px;
  }
  .content {
    .modal {
      &:not(:last-child) {
        margin-bottom: 30px;
      }
      .time-cat {
        border-bottom: 1px solid #f1f1f190;
        padding-bottom: 6px;
        i {
          margin-right: 6px;
          color: @primary-color;
        }
      }
      .arc-list {
        .arc-modal {
          display: flex;
          padding: 10px 0;
          position: relative;
          .delete-history {
            position: absolute;
            right: 0;
            top: 20px;
            cursor: pointer;
            font-size: 12px;
            display: none;
            transition: .2s;
          }
          &:hover {
            .delete-history {
              display: block;
            }
          }
          .left {
            flex: 1;
            width: 0;
            margin-right: 20px;
            p, a {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: block;
              &.arc-title {
                font-size: 15px;
                color: #000;
                font-weight: bold;
                &:hover {
                  text-decoration: underline;
                }
              }
              &.arc-desc {
                font-size: 13px;
                color: #999;
                padding: 6px 0;
              }
            }
            .info {
              font-size: 12px;
              a {
                padding-right: 10px;
                color: #999;
                display: inline;
                &:hover {
                  color: #1e80ff;
                }
              }
              em {
                color: #819a9f;
                font-style: normal;
              }
            }
          }
          .right {
            width: 120px;
            height: 80px;
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>