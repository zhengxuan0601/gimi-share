<template>
  <div class="user-content">
    <div class="left-user-modal">
      <div class="user-info-block">
        <div class="avatar-img">
          <img src="https://p26-passport.byteacctimg.com/img/user-avatar/5ba0ae3b112a83b512e2ad3a0813aac4~300x300.image" alt="avatar">
        </div>
        <div class="info-desc">
          <h3>需要坚持的人</h3>
          <div v-if="false" class="desc">
            <p><span class="iconfont icon-ai-briefcase"></span>前端小学生</p>
            <p><span style="font-size: 18px" class="iconfont icon-mingpian"></span>擅长J你太美</p>
          </div>
          <div v-else class="update-desc">
            <nuxt-link to="/">
              <a-icon type="plus" />你的职业是什么？
            </nuxt-link>
            <nuxt-link to="/">
              <a-icon type="plus" />你有什么想说的？
            </nuxt-link>
          </div>
        </div>
        <div class="right-operate">
          <div v-if="false">
            <button class="a-primary dashed"><a-icon type="plus" />关注</button>
            <button 
              class="a-primary dashed">
              <a-icon type="check" />
              <em class="has">已</em><em class="dis">取消</em>关注</button>
          </div>
          <button v-else class="a-primary dashed"><a-icon type="edit" />编辑个人资料</button>
        </div>
      </div>
      <ul class="tab-tag">
        <li>文章</li>
        <li class="active">收藏</li>
        <li>关注</li>
        <li>点赞</li>
      </ul>
    </div>
    <div class="right-user-modal">
      <div class="focus-account">
        <div>
          <p>关注了</p>
          <span>250</span>
        </div>
        <div>
          <p>关注者</p>
          <span>200</span>
        </div>
      </div>
      <div class="list-block">
        <div class="block">
          <p>收藏</p>
          <span>10</span>
        </div>
        <div class="block">
          <p>加入于</p>
          <span>2018-05-21</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IserIndex',
  layout: 'BaseLayout',
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
        margin-right: 20px;
        cursor: pointer;
        position: relative;
        &.active {
          color: #000;
          &:after {
            content: "";
            width: 10px;
            height: 4px;
            position: absolute;
            background: #19c54a;
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