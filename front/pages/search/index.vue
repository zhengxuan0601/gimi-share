<template>
  <div>
    <div class="fixed-search-category">
      <div class="category-tab w-720">
        <p 
          v-for="item in categoryOption"
          :key="item.value" 
          :class="{ active: categoryValue === item.value }"
          @click="updateCategory(item.value)">{{ item.label }}</p>
      </div>
    </div>
    <div class="search-modal w-720">
      <Article 
        v-if="categoryValue === '1'"
        :search-value="searchValue" />
      <User 
        v-if="categoryValue === '2'"
        :search-value="searchValue" />
    </div>  
  </div>
</template>

<script>
import Article from './components/Article'
import User from './components/User'
export default {
  name: 'SearchPage',
  components: { Article, User },
  layout: 'BaseLayout',
  data () {
    return {
      categoryOption: [{ label: '文章', value: '1' }, { label: '用户', value: '2' }],
      categoryValue: '',
      searchValue: ''
    }
  },

  head () {
    return {
      title: '搜索记录 - GimiShare'
    } 
  },

  watch: {
    '$route': {
      handler () {
        this.parseAddressurl()
      },
      deep: true
    }
  },

  created () {
    this.parseAddressurl()
  },

  methods: {
    parseAddressurl () {
      const query = this.$route.query
      this.searchValue = query.value
      this.categoryValue = query.type
    },

    updateCategory (categoryValue) {
      this.$router.push({
        path: '/search',
        query: {
          value: this.searchValue,
          type: categoryValue
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.fixed-search-category {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  border-bottom: 1px solid #f1f1f1;
  background: #fff;
  z-index: 999;
  .category-tab {
    height: 45px;
    display: flex;
    align-items: center;
    p {
      margin-right: 30px;
      cursor: pointer;
      font-size: 13px;
      &.active {
        color: @hover-primary-color;
      }
    }
  }
}

.search-modal {
  margin-top: 60px;
  background: #fff;
  border: 1px solid #f1f1f1;
}
</style>
