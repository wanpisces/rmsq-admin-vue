<template>
    <div>
        <div v-if="builderId==1">
            我是图文1
        </div>
        <div v-if="builderId==2">
            我是图文2
        </div>
        <div v-if="builderId==3">
            我是图文3
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