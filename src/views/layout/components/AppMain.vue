<template>
  <!-- style="overflow-y: auto;padding:0 35px;height: calc(100vh - 84px)" -->
  <el-scrollbar style="height: calc(100vh - 84px);">
    <section class="app-main" style="overflow-y: auto;padding:0 35px;min-height: calc(100vh - 84px);height:100%">
      <transition name="fade" mode="out-in">
        <!-- <keep-alive :include="cachedViews">
          <router-view></router-view>
        </keep-alive> -->
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </section>
  </el-scrollbar>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
};
</script>
