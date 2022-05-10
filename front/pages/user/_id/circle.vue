<template>
  <ShareCircleCategory
    :circle-list="circleList"
    category="1"
    :loading="loading"
    @refreshCircle="() => {
      pagination.pageNo = 1;
      findShareList()
    }" />
</template>

<script>
import ShareCircleCategory from '../components/ShareCircleCategory'
export default {
  name: 'UserCircle',
  components: { ShareCircleCategory },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pagination: {
        pageNo: 1,
        pageSize: 20
      },
      circleList: [],
      loading: false
    }
  },

  created () {
    this.findShareList()
  },

  methods: {
    /**
     * find user share cirlce list
     */
    async findShareList () {
      const { pageNo, pageSize } = this.pagination
      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/v1/shares?pageNo=${pageNo}&pageSize=${pageSize}&userId=${this.userId}`)
        this.circleList = data.list
      } catch (error) {} finally {
        this.loading = false
      }
    },
  }
}
</script>