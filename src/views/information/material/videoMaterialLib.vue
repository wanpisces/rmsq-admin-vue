<template>
  <div>
    <source-image :perm="perm"></source-image>
  </div>
</template>

<script>
import SourceImage from "@/components/Material/video.vue";
export default {
  components: { SourceImage },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      to.meta.perm.forEach((item, index) => {
        if (vm.perm[item.perm_name]) {
          vm.perm[item.perm_name] = item.is_select; // 2-不显示 1-显示
        }
      });
    });
  },
  data() {
    return {
      // 权限 2不显示 1显示
      perm: {
        materialArr: 1, //添加分类
        materialEdit: 1, // 编辑分类
        materialDele: 1, // 删除分类
        picDele: 1, // 图片删除
        picUpload: 1 // 图片上传
      }
    };
  },
  created() {},
  methods: {}
};
</script>


<style scoped>
</style>
