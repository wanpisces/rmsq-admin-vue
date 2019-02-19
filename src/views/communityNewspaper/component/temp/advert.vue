<template>
    <div>
        <div v-if="builderId==1">
            我是广告1
        </div>
        <div v-if="builderId==2">
            我是广告2
        </div>
        <div v-if="builderId==3">
            我是广告3
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
  created() {
    console.log(this.builderId, "aaaa");
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>
