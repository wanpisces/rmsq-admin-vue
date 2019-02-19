<template>
  <div class="info-container">
    <el-card class="box-card">
      <section class="box-flex">
        <div v-for="(item,index)  in  itemData" :key="index" class="box-bg">
          <router-link :to="{name: item.url,query:{id:item.uId}}">
            <img :src="item.icon" alt="" width="46" height="48">
            <div>{{item.name}}</div>
          </router-link>
        </div>
      </section>

    </el-card>
  </div>
</template>
<script>
export default {
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     to.meta.perm.forEach((item, index) => {
  //       vm.perm[item.perm_name] && (vm.perm[item.perm_name] = item.is_select); // 2-不显示 1-显示
  //       console.log("------- vm --", item.perm_name, item.is_select);
  //     });
  //   });
  // },
  data() {
    return {
      perm: {
        mpBinding: 1, // 新增绑定
        mpEdit: 1, // 编辑
        mpDele: 1, // 删除
        mpHelp: 1 // 帮助,
      },
      itemData: [
        {
          name: "微信公众号",
          uId: "1",
          icon: "https://img.sqydt.darongshutech.com/token_file_201811061409243105.jpg",
          url: "mpList"
        },
        {
          name: "头条号",
          uId: "3",
          icon: "https://img.sqydt.darongshutech.com/token_file_201811081415598785.jpg",
          url: "toutiaoList"
        },
        {
          name: "新浪微博",
          uId: "2",
          icon: "https://img.sqydt.darongshutech.com/token_file_201811061409516893.jpg",
          url: "weiboList"
        },
        {
          name: "快传",
          uId: "4",
          icon: "https://img.sqydt.darongshutech.com/token_file_201811261014287968.jpg",
          url: "kuaichuanList"
        },
        {
          name: "百家号",
          uId: "5",
          icon: "https://img.sqydt.darongshutech.com/token_file_201901031408079460.jpg",
          url: "baijiaList"
        }
      ]
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;
  .box-card {
    margin-bottom: 30px;
  }
}
.box-flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.box-flex > div {
  width: 115px;
  border: 1px solid #eee;
  background: #fcfcfc;
  text-align: center;
  padding: 10px 0;
  margin-left: 30px;
  cursor: pointer;
}
.box-bg {
  background: #fcfcfc;
}
.box-bg:hover {
  color: #39bcf3;
  background: rbga(0, 0, 0, 0.3);
}
</style>

