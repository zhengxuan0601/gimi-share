<template>
  <div class="user-content w-1100">
    <div class="left-user-modal">
      <div class="user-info-block">
        <div class="avatar-img">
          <img :src="userInfo.avatar || require('@/assets/images/default.png')" alt="avatar">
        </div>
        <div class="info-desc">
          <h3>{{ userInfo.nickname }}</h3>
          <div v-if="userInfo.id !== sessionInfo.id" class="desc">
            <p><span class="iconfont icon-ai-briefcase"></span>{{ userInfo.job || '该用户还未更新职业' }}</p>
            <p><span style="font-size: 18px" class="iconfont icon-mingpian"></span>{{ userInfo.description || '该用户什么都没留下' }}</p>
          </div>
          <div v-else class="desc update-desc">
            <p v-if="userInfo.job"><span class="iconfont icon-ai-briefcase"></span>{{ userInfo.job }}</p>
            <nuxt-link v-else to="/setting/profile">
              <a-icon type="edit" />你的职业是什么？
            </nuxt-link>
            <p v-if="userInfo.description"><span style="font-size: 18px" class="iconfont icon-mingpian"></span>{{ userInfo.description }}</p>
            <nuxt-link v-else to="/setting/profile">
              <a-icon type="edit" />你有什么想说的？
            </nuxt-link>
          </div>
        </div>
        <div class="right-operate">
          <div v-if="userInfo.id !== sessionInfo.id">
            <button 
              v-if="!isFocus"
              class="a-primary dashed"
              @click="updateUserFocus(true)"><a-icon type="plus" />关注</button>
            <button 
              v-else
              class="a-primary dashed"
              @click="updateUserFocus(false)">
              <a-icon type="check" />
              <em class="has">已</em><em class="dis">取消</em>关注</button>
          </div>
          <button 
            v-else 
            class="a-primary dashed" 
            @click="$router.push('/setting/profile')"><a-icon type="edit" />编辑个人资料</button>
        </div>
      </div>
      <ul class="tab-tag">
        <li 
          v-for="item in categoryTab"
          :key="item.value"
          :class="{ active: currentCategory.value === item.value }" 
          @click="updateInfoCaterory(item)">{{ item.label }}</li>
      </ul>
      <div class="category-content">
        <!-- 文章 -->
        <articleCategory 
          v-if="currentCategory.type === 'article'"
          :category="currentCategory.value"
          :loading="loading"
          :article-list="articleList"
          @refresh="refreshArticles" />

        <!-- 关注用户 -->
        <focusCategory 
          v-if="currentCategory.type === 'user'"
          :loading="loading"
          :focus-user-list="focusUserList" />
      </div>
    </div>
    <div class="right-user-modal">
      <div class="focus-account">
        <div>
          <p>关注了</p>
          <span>{{ countInfo.focusCount || 0 }}</span>
        </div>
        <div>
          <p>关注者</p>
          <span>{{ countInfo.focusedCount || 0 }}</span>
        </div>
      </div>
      <div class="list-block">
        <div class="block pointer" @click="currentCategory = { value: '2', label: '收藏', type: 'article' }">
          <p>收藏</p>
          <span>{{ countInfo.collectCounts || 0 }}</span>
        </div>
        <div class="block">
          <p>加入于</p>
          <span>{{ userInfo.createTime.substr(0, 10) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import focusCategory from './components/focusCategory'
import articleCategory from './components/articleCategory'
import { validateUniqId } from '@/util'
export default {
  name: 'IserIndex',
  components: { articleCategory, focusCategory },
  layout: 'BaseLayout',
  validate ({ params }) {
    return validateUniqId(params.id)
  },
  async asyncData ({ $axios, params }) {
    try {
      const { data } = await $axios.get(`/api/v1/users/userinfo?id=${params.id}`)
      return {
        userInfo: data
      }
    } catch (error) {
      return {
        userInfo: ''
      }
    }
  },
  data () {
    return {
      categoryTab: [
        { value: '1', label: '文章', type: 'article' },
        { value: '2', label: '收藏', type: 'article' },
        { value: '3', label: '关注', type: 'user' },
        { value: '4', label: '点赞', type: 'article' }
      ],
      currentCategory: {
        value: '1',
        type: 'article'
      },
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      articleList: [],
      focusUserList: [],
      countInfo: '',
      loading: false,
      isFocus: false
    }
  },

  computed: {
    ...mapState({
      sessionInfo: state => state.userInfo
    })
  },

  watch: {
    currentCategory: {
      handler (cateItem) {
        switch (cateItem.value) {
          case '1':
            this.findArticleByUser()
            break;
          case '2':
              this.findCollectArticles()
              break;
          case '3':
              this.findFocusUsers()
              break;
          case '4':
              this.findAgreeArticles()
              break;
          default:
            break;
        }
      },
      deep: true
    }
  },

  created () {
    this.findArticleByUser()
    this.finIsFocus()
    this.findAllCounts()
  },

  methods: {
    /**
     * 查询该用户是否已经被自己关注
     */
    async finIsFocus () {
      try {
         const { data } = await this.$axios(`/api/v1/users/isfocususer?focusId=${this.userInfo.id}`)
         this.isFocus = data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 分页查询该用户下的所有文章
     */
    async findArticleByUser () {
      this.loading = true
      const { pageNo, pageSize } = this.pagination
      try {
        const { data } = await this.$axios.get(`/api/v1/articles?pageNo=${pageNo}&pageSize=${pageSize}&userId=${this.userInfo.id}`)
        this.articleList = data.list
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    /**
     * 查询该用户下已收藏的所有文章
     */
    async findCollectArticles () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/articles/collected?userId=${this.userInfo.id}`)
        this.articleList = data
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    /**
     * 查询该用户下已收藏的所有文章
     */
    async findAgreeArticles () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/articles/agreed?userId=${this.userInfo.id}`)
        this.articleList = data
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    /**
     * 查询用户关注用户列表
     */
    async findFocusUsers () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/users/focususers?userId=${this.userInfo.id}`)
        this.focusUserList = data
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },

    /**
     * 查询关注、被关注以及收藏的数量
     */
    async findAllCounts () {
      try {
        const { data } = await this.$axios.get(`/api/v1/users/getcounts?userId=${this.userInfo.id}`)
        this.countInfo = data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * user focus user
     * @param { Boolean } state true - focus  false - unfocus
     */
    async updateUserFocus (state) {
      if (!this.sessionInfo) {
        return this.$store.commit('UPDATE_LOGIN_VISIBLE', true)
      }
      try {
        const API = state ? '/users/focususer' : '/users/unfocususer'
        const focusId = this.userInfo.id
        await this.$axios.get(`/api/v1${API}?focusId=${focusId}`)
        this.isFocus = !this.isFocus
      } catch (error) {
        console.log(error)
      }
    },

    refreshArticles (category) {
      switch (category) {
        case '1':
          this.findArticleByUser()
          break;
        case '2':
            this.findCollectArticles()
            break;
        case '3':
            this.findFocusUsers()
            break;
        case '4':
            this.findAgreeArticles()
            break;
        default:
          break;
      }
    },

    updateInfoCaterory (cateItem) {
      if (cateItem.value === this.currentCategory.value) {
        return
      }
      this.articleList = []
      this.currentCategory = cateItem
    }
  }
}
</script>

<style scoped lang="less">
.user-content {
  .left-user-modal {
    width: 708px;
    .user-info-block {
      background: #fff;
      display: flex;
      padding: 30px;
      box-sizing: border-box;
      .avatar-img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
        }
      }
      .info-desc {
        padding: 0 20px;
        flex: 1;
        width: 0;
        h3 {
          font-size: 20px;
          color: #000;
          font-weight: bold;
          margin-bottom: 6px;
        }
        .desc {
          p {
            line-height: 28px;
            color: #72777b;
            span {
              margin-right: 8px;
            }
          }
        }
      }
      .update-desc {
        a {
          display: block;
          line-height: 28px;
          font-size: 12px;
          color: @primary-color;
          i {
            margin-right: 2px;
            font-size: 13px;
          }
        }
      }
    }
    .tab-tag {
      background: #fff;
      height: 46px;
      margin-top: 10px;
      list-style: none;
      display: flex;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #f1f1f1;
      li {
        margin-right: 30px;
        cursor: pointer;
        position: relative;
        &.active {
          color: #000;
          &:after {
            content: "";
            width: 10px;
            height: 4px;
            position: absolute;
            background: @primary-color;
            bottom: -12px;
            left: 50%;
            margin-left: -5px;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .right-user-modal {
    position: fixed;
    top: 80px;
    margin-left: 736px;
    width: 240px;
    .focus-account {
      background: #fff;
      display: flex;
      padding: 16px 0 10px 0;
      & > div {
        width: 50%;
        text-align: center;
        position: relative;
        p {
          margin-bottom: 4px;
          color: #000;
          font-size: 16px;
        }
        span {
          color: #999;
          font-size: 16px;
        }
        &:first-child:after {
          content: "";
          width: 1px;
          height: 24px;
          background: #f0eeee;
          right: 0;
          top: 14px;
          position: absolute;
        }
      }
    }
    .list-block {
      margin-top: 10px;
      background: #fff;
      .block {
        height: 42px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        justify-content: space-between;
        &.pointer {
          cursor: pointer;
        }
        p {
          color: #000;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #f1f1f1;
        }
      }
    }
  }
}
</style>f