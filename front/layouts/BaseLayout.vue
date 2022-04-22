<template>
  <div class="base-layout">
    <header>
      <div class="header-t w-1100">
        <div class="logo">
          <nuxt-link to="/">
            <img src="@/assets/images/logo.png" alt="">
          </nuxt-link>
        </div>
        <div class="right-operate">
          <div class="search-model">
            <a-icon type="search" />
            <input type="text" placeholder="" class="s-input">
          </div>
        </div>
      </div>
    </header>
    <section>
      <Nuxt></Nuxt>
    </section>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="less">
.base-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  header {
    height: 60px;
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    border-bottom: 1px solid #f1f1f1;
    z-index: 999;
    background: #fff;
    overflow: hidden;
    .header-t {
      align-items: center;
      display: flex;
      justify-content: space-between;
      .logo {
        display: flex;
        align-items: center;
        img {
          height: 60px;
          display: block;
        }
      }
      .right-operate {
        .search-model {
          position: relative;
          width: 216px;
          height: 30px;
          .s-input {
            width: 100%;
            height: 100%;
            outline: none;
            border: 1px solid #e3e3e3;
            border-radius: 15px;
            padding: 0 32px;
            box-sizing: border-box;
            font-size: 12px;
            transition: .2s;
            color: #000;
            &:focus {
              border-color: #42b983;
            }
          }
          .anticon-search {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            color: #999;
          }
        }
      }
    }
  }
  section {
    padding-top: 60px;
    flex: 1;
    height: 0;
    width: 1100px;
    margin: 0 auto;
  }
}

</style>