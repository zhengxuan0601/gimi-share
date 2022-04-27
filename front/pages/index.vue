<template>
  <div class="articlelist-content">
    <div
      v-for="item in pagination.list" 
      :key="item.id" 
      class="model" 
      @click="$router.push('/guide/' + item.id)">
      <div class="l">
        <div class="user-info">
          <p>{{ item.author.nickname }}</p>
          <p>{{ item.createTime }}</p>
          <p>{{ item.category }}·{{ item.tag }}</p>
        </div>
        <p class="article-title">{{ item.articleTitle }}</p>
        <p class="article-desc">{{ item.description }}</p>
        <div class="a-num">
          <p><a-icon type="eye" /><span>{{ item.viewCounts }}</span></p>
          <p @click.stop><a-icon type="like" /><span>{{ item.likeCounts }}</span></p>
          <p @click.stop><a-icon type="message" /><span>{{ item.commentCounts }}</span></p>
        </div>
      </div>
      <div v-if="item.coverImage" class="r">
        <img :src="item.coverImage" alt="cover-image">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'BaseLayout',
  async asyncData ({ $axios }) {
    const [pageNo, pageSize] = [1, 20]
    try {
      const { data } = await $axios.get(`/api/v1/articles?pageNo=${pageNo}&pageSize=${pageSize}`)
      return {
        pagination: data
      }
    } catch (error) {
      return {
        pagination: {
          list: [],
          pageNo: 1,
          total: 0
        }
      }
    }
  },
  head () {
    return {
      title: 'GimiShare-分享新鲜事'
    }
  }
}
</script>

<style lang="less" scoped>
.articlelist-content {
  background: #fff;
  .top-btn {
    margin-bottom: 20px;
  }
  .model {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f1f190;
    padding: 20px;
    cursor: pointer;
    &:hover {
      background: #fafafa;
    }
    .l {
      width: 0;
      flex: 1;
      .user-info {
        display: flex;
        padding: 6px 0;
        p {
          font-size: 14px;
          margin-right: 24px;
          position: relative;
          &:not(:last-child) {
            &:before {  
              content: "";
              width: 1px;
              position: absolute;
              height: 12px;
              background: #dedddd;
              top: 5px;
              right: -12px;
            }
          }
        }
      }
      .article-title {
        font-size: 16px;
        color: #1d2129;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .article-desc {
        color: #86909c;
        font-size: 12px;
        padding: 6px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .a-num {
        display: flex;
        margin-top: 6px;
        p {
          margin-right: 20px;
          span {
            font-size: 12px;
            margin-left: 4px;
          }
          &:not(:first-child) {
            &:hover {
              color: #2080f7;
            }
          }
        }
      }
    }
    .r {
      margin-left: 30px;
      flex-shrink: 0;
      img {
        width: 120px;
        height: 80px;
      }
    }
  }
}
</style>
