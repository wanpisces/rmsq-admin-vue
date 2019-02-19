<template>
  <div class="btn-wrap">
    <el-button v-for="(item, index) in switchData" :key="index"  @click="switchFn(index)">{{item}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'SwitchTable',
  // 通过props来接受从父组件传递过来的值
  props: {
    switchData:{
      type: Array,
      default: []
    }
  },
  methods: {
  },
  data () {
    return {
      active: 1,
    }
  },
  watch: {
  },
  methods: {
    switchFn (active) {
      this.active = active;
      this.$emit('switchFn', active);
    }
  }
}
</script>
<style scoped lang="scss">
  .btn-wrap{display: inline-block;margin-left: 10px;}
  .mo-paging {
    display: inline-block;
    padding: 0;
    margin: 1rem 0;
    font-size: 0;
    list-style: none;
    user-select: none;
  > .paging-item {
      display: inline;
      font-size: 14px;
      position: relative;
      padding: 6px 12px;
      line-height: 1.42857143;
      text-decoration: none;
      border: 1px solid #ccc;
      background-color: #fff;
      cursor: pointer;
      color: #7b7b7b;
      border-radius: 34px;
      margin-left: 10px;
  &:first-child {
     margin-left: 0;
   }
  &:hover {
     background-color: #f0f0f0;
     color: #409EFF;
   }
  &.paging-item--disabled,
  &.paging-item--more{
     background-color: #fff;
     color: #505050;
   }
  /*//禁用*/
        &.paging-item--disabled {
      cursor: not-allowed;
      opacity: .5;
    }
  &.paging-item--more,
  &.paging-item--current {
     cursor: default;
   }
  /*//选中*/
        &.paging-item--current {
      background-color: #409EFF;
      color:#fff;
      position: relative;
      z-index: 1;
      border-color: #409EFF;
    }
  }
  }
</style>