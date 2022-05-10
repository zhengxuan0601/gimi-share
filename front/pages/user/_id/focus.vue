<template>
  <div>
    <UserCategory 
      :loading="loading"
      :focus-info="focusInfo" />
  </div>
</template>

<script>
import UserCategory from '../component/UserCategory'
export default {
  name: 'UserFocus',
  components: { UserCategory },
  props: {
    userId: {
      type: String,
      default: ''
    }
  }, 
  data () {
    return {
      focusInfo: undefined
    }
  },

  created () {
    this.findFocusUserInfo()
  },

  methods: {
    /**
     * 查询用户关注用户列表和用户被关注者列表集合
     */
    async findFocusUserInfo () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/users/focususers?userId=${this.userId}`)
        this.focusInfo = data
      } catch (error) {} finally {
        this.loading = false
      }
    },
  }
}
</script>
