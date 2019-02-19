<template>

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
      default: 9999
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  watch: {},
  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
