<template>
  <div class="server-loading">
    <img src="@/assets/images/server-loading.gif" alt="">
    <p>Loading . . .</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.server-loading {
  position: relative;
  img {
    width: 300px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 200px;
  }
  p {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    top: 350px;
    font-weight: bold;
  }
}
</style>