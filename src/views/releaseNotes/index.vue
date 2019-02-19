<template>
  <div class="info-container">
    <div>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>版本说明</span>
        </div>
        <div v-for="(item,index) in versionData" :key="index" class="version-item">
          <p class="item-head">
            <strong>{{item.version_num}}</strong>
            更新时间：{{item.update_time}}
          </p>
          <div class="word_wrap" v-html="item.version_content">
            {{item.version_content}}
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import { RequestVersionList } from "@/fetch/modules/optimizationTwo.js";
const _data = [
  {
    version_num: "1.0.1.8", // 版本号
    version_content: "", // 更新内容
    is_force: 1, // 是否强制更新 1是 2否
    update_time: "2018-09-19 09:30:03" // 更新时间
  },
  {
    version_num: "1.0.1.9", // 版本号
    version_content: "", // 更新内容
    is_force: 1, // 是否强制更新 1是 2否
    update_time: "2018-09-19 09:30:03" // 更新时间
  }
];
export default {
  data() {
    return {
      versionData: []
    };
  },
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    getData() {
      RequestVersionList({
        app_type: 6
      }).then(res => {
        this.versionData = res.map(item => {
          item.version_content = item.version_content.replace(/\r\n/g, "<br/>");
          return item;
        });
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;

  .version-item {
    padding: 10px 25px;

    p {
      line-height: 26px;
    }
    .item-head {
      color: #a6a6a6;
      strong {
        padding-right: 10px;
        color: #666;
      }
    }
  }

  @media (min-width: 1562px) and (max-width: 1920px) {
    .img-resopnse {
      width: 80%;
    }
  }

  @media (min-width: 1920px) {
    .img-resopnse {
      width: 50%;
      text-align: center;
    }
  }
}
</style>

