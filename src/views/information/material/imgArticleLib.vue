<template>
  <div class="page_box">
    <image-text></image-text>
  </div>
</template>

<script>
import imageText from "@/components/Material/ImageText.vue";
// import { RequestMenuList, RequestDeleteMenu } from "@/fetch/modules/material.js";
export default {
  components: { imageText },

  data() {
    return {};
  },
  created() {
    console.log('11111____________')
  },
  methods: {}
};
</script>

<style scoped>
.page_box {
  padding: 20px;
}
</style>

