<template>
  <div>
    <div v-if="builderId==1" @click="$emit('emitClick',dataObj)">
      东桂社区 {{ dataObj.item_title }}
    </div>
    <div v-if="builderId==2" @click="$emit('emitClick',dataObj)">
      我是报头2
    </div>
    <div v-if="builderId==3" @click="$emit('emitClick',dataObj)">
      我是报头3
    </div>
  </div>
</template>

<script>
export default {
  props: {
    builderId: {
      type: String || Number,
      default: ""
    },
    dataObj: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style>
</style>
