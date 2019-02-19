<template>
    <div class="info-container">
        <div>

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>公众号扩展</span>
                </div>
                <div class="card-content">
                    <p>
                        定位切换开启设置
                        <el-switch @change="setLock" class="switch-item" v-model="isLock" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="2">
                        </el-switch>
                    </p>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
import { RequestGroupLock, RequestGroupLockState } from "@/fetch/modules/optimizationTwo.js";
import { _debounce } from "@/utils/index";

export default {
  data() {
    return {
      isLock: "2"
    };
  },
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    getData() {
      RequestGroupLock().then(res => {
        console.log("RequestGroupLock", res);
        this.isLock = res.is_lock;
      });
    },
    setLock: _debounce(function(val) {
      console.log("setLock:", val);
      RequestGroupLockState().then(res => {
        console.log("RequestGroupLockState:", res);
      });
    }, 300)
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
.info-container {
  margin: 30px 15px;
  font-size: 14px;

  .card-content {
    padding: 10px 25px;

    .switch-item {
      margin-left: 200px;
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

