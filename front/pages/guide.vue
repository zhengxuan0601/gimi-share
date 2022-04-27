<template>
  <div class="index-content">
    <article>
      <nuxt-child></nuxt-child>
    </article>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'BaseLayout'
}
</script>

<style lang="less" scoped>
.index-content {
  position: relative;
}
</style>
