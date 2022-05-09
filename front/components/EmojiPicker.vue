<template>
  <div class="custom-emoji-picker">
    <a-popover 
      destroy-tooltip-on-hide
      placement="bottom" 
      trigger="click" 
      overlay-class-name="emoji-popover">
      <template slot="content">
        <div class="emoji-modal">
          <VEmojiPicker
            @select="emoji => $emit('select', emoji)" />
        </div>
      </template>
      <div class="show-group">
        <a-icon type="smile" />
        <span>表情</span>
      </div>
    </a-popover>
  </div>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker'
export default {
  components: { VEmojiPicker }
}
</script>

<style lang="less">
.custom-emoji-picker {
  position: relative;
  z-index: 99;
  .show-group {
    cursor: pointer;
    font-size: 14px;
    i {
      margin-right: 2px;
    }
  }
}
</style>