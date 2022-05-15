<template>
  <div class="setting-page w-1100">
    <div class="breadcrumb">
      <p @click="$router.push(`/user/${userInfo.id}`)"><a-icon type="left" /> 返回个人主页</p>
    </div>
    <div class="setting-modal">
      <div class="left-menu">
        <ul>
          <li>
            <nuxt-link to="/setting/profile"><a-icon type="solution" />个人资料</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/setting/account"><a-icon type="setting" />账号设置</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="right-content">
        <nuxt-child></nuxt-child>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SettingPage',
  layout: 'BaseLayout',
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  }
}
</script>

<style scoped lang="less">
.setting-page {
  margin-top: 20px;
  .breadcrumb {
    background: #fff;
    padding: 0 20px;
    line-height: 46px;
    box-shadow: 0 0 2px 0 rgba(0,0,0,0.1);
    p {
      cursor: pointer;
      &:hover {
        color: @hover-primary-color;
      }
    }
  }
  .setting-modal {
    display: flex;
    margin-top: 20px;
    .left-menu {
      background: #fff;
      width: 230px;
      height: 600px;
      ul {
        list-style: none;
        padding: 8px 0;
        li {
          height: 42px;
          line-height: 42px;
          padding: 0 8px;
          a {
            color: #4e5969;
            display: block;
            padding: 0 20px;
            i {
              margin-right: 10px;
            }
            &.nuxt-link-exact-active {
              background: rgba(25,197,74,0.10196);
              color: @primary-color;
            }
          }
        }
      }
    }
    .right-content {
      background: #fff;
      flex: 1;
      width: 0;
      margin-left: 20px;
    }
  }
}
</style>
