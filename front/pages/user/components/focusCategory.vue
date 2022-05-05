<template>
  <div class="focus-category-modal">
    <div v-if="loading" style="padding: 20px;">
      <a-skeleton active />
    </div>
    <client-only v-else>
      <div 
        v-if="!focusUserList.length" 
        style="padding: 30px 0;">
        <a-empty 
          description="空空如也" 
          :image="require('@/assets/images/nodata.png')" /></div>
      <div v-else>
        <div class="focus-user">
          <div v-for="item in focusUserList" :key="item.id" class="user-modal">
            <div class="avatar">
              <nuxt-link :to="`/user/${item.id}`">
                <img :src="item.avatar || require('@/assets/images/default.png')" alt="avatar">
              </nuxt-link>
            </div>
            <p class="nickname">
              <nuxt-link :to="`/user/${item.id}`">{{ item.nickname }}</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    focusUserList: {
      type: Array,
      default: () => []
    },
    loading: Boolean
  }
}
</script>

<style scoped lang="less">
.focus-category-modal {
  background: #fff;
  .focus-user {
    .user-modal {
      border-bottom: 1px solid #f1f1f1;
      display: flex;
      height: 90px;
      align-items: center;
      padding: 0 30px;
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        a {
          display: block;
          height: 100%;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      .nickname {
        font-size: 18px;
        margin-left: 16px;
        font-weight: bold;
        flex: 1;
        width: 0;
        a {
          color: #000;
        }
      }
    }
  }
}
</style>