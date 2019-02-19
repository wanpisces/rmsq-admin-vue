<template>
    <div>
        <div v-if="builderId==1">
            我是纯文本1
        </div>
        <div v-if="builderId==2">
            我是纯文本2
        </div>
        <div v-if="builderId==3">
            我是纯文本3
        </div>
    </div>
</template>

<script>
export default {
  props: {
    builderId: {
      type: String || Number,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>