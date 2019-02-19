<template>
  <div class="scrollbar">
    <div class="line-wrapper">
      <!-- <i class="icon-zuobiao"></i> -->
      <!-- <span v-if="adminType!=0">小程序用户：</span> -->
      <div class="nav-wrapper">
        <ul class="count-time">
          <li @click="tabAddchanges(item.type)" :class="search.type==item.type?' bgColor':false" v-for="(item,index) in tabAdd" :key="index">{{item.name}}</li>
        </ul>
        <ul class="count-time" v-if="adminType==0">
          <li @click="tabUserchanges(item.userType)" :class="search.userType==item.userType?'zuobiao bgColor':false" v-for="(item,index) in tabUser" :key="index">{{item.name}}</li>
        </ul>
        <div class="line-nav">
          <ul class="count-time">
            <li @click="tabchanges(item.index)" :class="show==item.index?' bgColor':false" v-for="item in tabData" :key="item.index">{{item.values}}</li>
          </ul>
          <div class="count-picker">
            <el-date-picker unlink-panels size="medium" v-model="picker_time" type="daterange" :clearable='false' start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @blur="timeBlur" :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div>
        <div id="echartContainer4" style="width:100%;height:500px;margin-top: 40px"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/line");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib//component/graphic.js");
// require("echarts/lib//component/lien");
// import ElRow from "element-ui/packages/row/src/row";
// import ElCol from "element-ui/packages/col/src/col";
import CountTo from "vue-count-to";
import {
  sevenDays,
  thirtyDays,
  formatDate,
  getWeekStartDate,
  getWeekEndDate,
  getMonthStartDate,
  getMonthEndDate
} from "@/utils/time";
import HomeRequst from "@/fetch/modules/dashboard";
// 存储的cookies
import { getAdminType } from "@/utils/auth";
export default {
  components: {
    // ElCol,
    // ElRow,
    CountTo
  },
  data() {
    return {
      countDataList: "10",
      countViewDataList: "133",
      tabUser: [
        { userType: 1, name: "小程序用户" },
        { userType: 2, name: "合作用户" }
      ],
      tabAdd: [{ type: 1, name: "累计" }, { type: 2, name: "新增" }],
      count: {
        total_num_news: 0,
        total_num_user: 0,
        total_num_user_new: 0,
        total_num_user_seven: 0,
        news: {},
        mps: {},
        inst: {}
      },
      chart: null,
      activeChart: null,
      tabPosition: "1",
      show: 2,
      activeShow: 1,
      tabData: [
        // {
        //   index: 1,
        //   values: "默认"
        // },
        {
          index: 2,
          values: "默认"
        },
        {
          index: 3,
          values: "近一个月"
        }
      ],
      search: {
        userType: 1,
        type: 1,
        starttime: "",
        endtime: ""
      },
      picker_time: [],
      adminType: getAdminType(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      }
    };
  },
  created() {},
  mounted() {
    this.getChart();
  },

  methods: {
    getChart() {
      var args = this.search;
      for (let i in args) {
        if (args[i] === "") {
          delete args[i];
        }
      }
      HomeRequst.RequesCountUser(args).then(res => {
        if (res.code === 2000) {
          this.addCountInit(res.data);
        }
      });
    },
    // 用户增量统计
    addCountInit(data) {
      var chart = echarts.init(document.getElementById("echartContainer4"));
      window.onresize = chart.resize;
      var userType = this.search.userType == 1 ? "小程序用户" : "合作用户";
      var type = this.search.type == 1 ? "累计" : "新增";
      var titleCurser = type + userType + "总数";
      let args = {
        type: this.show
      };
      chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#23E9EE" },
            { offset: 1, color: "#0460F7" }
          ])
        ],
        grid: {
          top: 30,
          left: 10,
          right: 30,
          bottom: 50,
          containLabel: true
        },
        dataZoom: [
          {
            type: "inside"
          },
          {
            type: "slider",
            start: 2,
            bottom: 30,
            height: "15px",
            fillerColor: "rgba(202,223,255,.8)",
            borderColor: "#b6d2fc",
            handleStyle: {
              color: "#b6d2fc"
            },
            dataBackground: {
              lineStyle: {
                color: "#b6d2fc"
              },
              areaStyle: {
                color: "rgba(202,223,255,.8)"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#B3B3B3",
                fontSize: "8px"
              }
            },
            axisLabel: {
              color: "#454545",
              textStyle: {
                fontSize: "8px",
                color: "#000"
              }
            }
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#B3B3B3"
            }
          },
          axisLabel: {
            color: "#454545",
            fontSize: "8px",
            textStyle: {
              fontSize: "8px",
              color: "#000",
              align: "center"
            }
          },
          data: Object.keys(data) || []
        },
        series: [
          {
            name: titleCurser,
            type: "line",
            symbol: "emptyCircle",
            symbolSize: 2,
            showSymbol: false,
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(35,233,238,.4)" },
                  { offset: 1, color: "rgba(4,96,247,.4)" }
                ])
              }
            },
            lineStyle: {
              width: 1,
              color: "#59cef5"
            },
            itemStyle: {
              borderColor: "#59cef5",
              borderWidth: 2
            },
            data: Object.values(data) || []
          }
        ]
      });
    },

    activeTabchanges(index) {
      this.activeShow = index;
    },
    timeBlur() {
      if (this.picker_time[0] === formatDate(new Date())) {
        this.show = 1;
      } else if (
        this.picker_time[0] === getWeekStartDate() &&
        this.picker_time[1] === getWeekEndDate()
      ) {
        this.show = 2;
      } else if (
        this.picker_time[0] === getMonthStartDate() &&
        this.picker_time[1] === getMonthEndDate()
      ) {
        this.show = 3;
      } else {
        this.show = 0;
      }
      this.search.starttime = this.picker_time[0];
      this.search.endtime = this.picker_time[1];
      this.getChart();
    },
    disabledDate(time) {
      console.log(time);
    },
    tabUserchanges(userType) {
      this.search.userType = userType;
      this.getChart();
    },
    tabAddchanges(type) {
      this.search.type = type;
      this.getChart();
    },
    tabchanges(index) {
      this.show = index;
      this.picker_time = [];
      let _args = {};
      index == 1
        ? (_args = {
            starttime: "",
            endtime: ""
          })
        : index == 2
          ? (_args = {
              starttime: sevenDays().t2,
              endtime: sevenDays().t1
            })
          : (_args = {
              starttime: thirtyDays().t2,
              endtime: thirtyDays().t1
            });
      this.search = Object.assign(this.search, _args);
      this.getChart();
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    if (!this.activeChart) {
      return;
    }
    this.activeChart.dispose();
    this.activeChart = null;
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
// #echartContainer{float: right;}
.side-line-wrapper {
  float: left;
  padding: 100px 35px 0;
}
.nav-wrapper {
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.line-wrapper {
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
  // color: #23E9EE
}
.nav-left {
  float: left;
  padding: 30px;
}
.panel-text {
  margin: 18px auto auto;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    padding-bottom: 20px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    .card-title {
      padding-left: 25px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #eee;
      color: #000;
    }
    .pannel-list {
      padding: 20px 30px;
      line-height: 40px;
      font-size: 16px;
      span {
        font-size: 20px;
        // font-weight: bold;
      }
    }
  }
}
.panel-group {
  margin: 18px auto auto;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 135px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 25px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 58px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 40px 26px 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 18px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 26px;
      }
    }
  }
}
.statistics-wrapper {
  margin-top: 40px;
}
.count-view {
  width: 100%;
  height: 100px;
  background: #fff;
  overflow: hidden;
  border-radius: 3px;
  &-right {
    line-height: 40px;
    text-align: center;
    margin-top: 10px;
    & h3 {
      color: #8c8c8c;
    }
    & p {
      color: #666666;
    }
  }
  .icon-pepole {
    /*border: 1px red solid;*/
    font-size: 60px;
    color: #40c9c6;
    font-weight: 600;
  }
  .icon-read {
    font-size: 46px;
    color: #4ca4ff;
    font-weight: 600;
  }
}

/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
.scrollbar::-webkit-scrollbar {
  width: 0;
  height: 16px;
  background-color: #fff;
}
/*定义滚动条的轨道，内阴影及圆角*/
.scrollbar::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px #fff;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.chart-title {
  position: relative;
  top: 5px;
  font-size: 20px;
  font-weight: bold;
  margin-left: 4%;
  color: rgb(3, 3, 3);
}
.chart-active {
  color: #39bcf3;
  font-size: 14px;
}
.line-nav {
  float: right;
  justify-content: flex-end;
  padding: 30px;
}
.count-picker {
  display: inline-block;
  margin-left: 10px;
}

.el-radio-button,
.el-radio-button__inner {
  display: inline-block;
  position: relative;
  outline: 0;
  width: 50px;
  height: 35px;
  font-size: 10px;
}
.el-radio-button__inner {
  line-height: 35px;
  padding: 0;
}
.count-time {
  display: inline-block;
  list-style: none;
  //  width: 100%;
  height: 35px;
  padding: 0;
  font-size: 0;
  //  margin-right: 10px
  li {
    line-height: 35px;
    display: inline-block;
    padding: 0 10px;
    min-width: 60px;
    text-align: center;
    font-size: 10px;
    cursor: pointer;
    background: #fff;
    border: 1px #dcdfe6 solid;
  }
  li + li {
    border-left: none;
  }

  .bgColor {
    background-color: #39bcf3;
    color: #fff;
  }
}
</style>
