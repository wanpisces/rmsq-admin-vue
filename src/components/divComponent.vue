<template>
  <div class="edit-div" :style="curStyle" v-html="innerText" :contenteditable="canEdit" @focus="isLocked = true" @blur="isLocked = false" @input="changeText">
  </div>
</template>
<script type="text/ecmascript-6">
let innerText = "";
export default {
  name: "editDiv",
  props: {
    value: {
      type: String,
      default: ""
    },
    nameVal: {
      type: String,
      default: ""
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 99999
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    curStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      innerText: this.value ? this.value : this.value + " ",
      isLocked: false
    };
  },
  watch: {
    value() {
      if (!this.isLocked || !this.innerText) {
        this.innerText = this.value;
      }
    }
  },
  methods: {
    changeText() {
      var obj = {
        value: this.$el.innerHTML,
        nameVal: this.nameVal
      };
      if (this.min <= obj.value.length && obj.value.length <= this.max) {
        innerText = obj.value;
        this.$emit("inputChangeText", obj, this.params);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.edit-div {
  width: 100%;
  height: 100%;
  min-height: 30px;
  font-size: 14px;
  border-bottom: 1px solid #d9dfe2;
  padding: 0px 5px;
  overflow: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  &[contenteditable="true"] {
    user-modify: read-write-plaintext-only;
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }
}
</style>
