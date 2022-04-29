<template>
   <div class="custom-skeleton">
    <div class="ske-title"></div>
    <div class="ske-info">
      <div class="ske-avatar"></div>
      <div class="ske-text">
        <div class="ske-nick"></div>
        <div class="ske-time"></div>
      </div>
    </div>
    <div class="ske-cover"></div>
  </div>
</template>

<script>
export default {
  name: "CustomSkeleton"
}
</script>

<style lang="less">
.custom-skeleton {
  .ske-title {
    height: 16px;
    margin-top: 16px;
    background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
    width: 200px;
    animation: skeleton-loading 1.4s ease infinite;
    background-size: 400% 100%;
  }
  .ske-info {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .ske-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 12px;
      background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
      animation: skeleton-loading 1.4s ease infinite;
      background-size: 400% 100%;
    }
    .ske-text {
      flex: 1;
      .ske-nick {
        height: 10px;
        background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
        width: 60px;
        margin-bottom: 4px;
        animation: skeleton-loading 1.4s ease infinite;
        background-size: 400% 100%;
      }
      .ske-time {
        height: 10px;
        background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
        width: 100px;
        animation: skeleton-loading 1.4s ease infinite;
        background-size: 400% 100%;
      }
    }
  }
  .ske-cover {
    height: 360px;
    margin-top: 16px;
    background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
    margin-bottom: 20px;
    animation: skeleton-loading 1.4s ease infinite;
    background-size: 400% 100%;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}
</style>