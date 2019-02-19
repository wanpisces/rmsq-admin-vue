<template>
    <div class="scrollbar" style="overflow-y: scroll;padding:0 35px;height: 90vh">
        <div class="line-wrapper">
            <div class="title">页面功能点击次数</div>
            <div class="line-nav">
                <ul class="count-time">
                    <li @click="tabchanges(item.index)" :class="show==item.index?' bgColor':false" v-for="item in tabData" :key="item.index">{{item.values}}</li>
                </ul>
                <div class="count-picker">
                    <el-date-picker size="medium" v-model="picker_time" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @blur="timeBlur">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <div id="echartContainer" style="width:100%;height:500px;margin-top: 40px"></div>
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

// import ElRow from "element-ui/packages/row/src/row";
// import ElCol from "element-ui/packages/col/src/col";
import CountTo from "vue-count-to";
import {
  getWeekStartDate,
  getWeekEndDate,
  getMonthStartDate,
  getMonthEndDate,
  formatDate
} from "../../utils/time";

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
      chart: null,
      activeChart: null,
      tabPosition: "1",
      show: 1,
      activeShow: 1,
      tabData: [
        {
          index: 1,
          values: "今日"
        },
        {
          index: 2,
          values: "本周"
        },
        {
          index: 3,
          values: "本月"
        }
      ],
      picker_time: []
    };
  },
  created() {
    let time = formatDate(new Date());
    this.picker_time = [time, time];
    this.countData();
    this.viewData();
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
  },
  methods: {
    // 用户数量
    countData() {},

    // 浏览量
    viewData() {},
    // 用户增量统计
    addCountInit() {
      var chart = echarts.init(document.getElementById("echartContainer"));
      window.onresize = chart.resize;
      let args = {
        type: this.show
      };
      chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [120, 132, 101, 134, 90, 230, 210],
            itemStyle: { normal: { color: "rgba(64, 201, 198,0.5)" } },
            smooth: true
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
    },
    tabchanges(index) {
      this.show = index;
      if (index == 1) {
        let startTime = formatDate(new Date());
        this.picker_time = [startTime, startTime];
      } else if (index == 2) {
        this.picker_time = [getWeekStartDate(), getWeekEndDate()];
      } else if (index == 3) {
        this.picker_time = [getMonthStartDate(), getMonthEndDate()];
      }
      this.addCountInit();
    }
  },
  mounted() {
    this.addCountInit();
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
// #echartContainer{float: right;}
.side-line-wrapper {
  float: left;
  padding: 100px 35px 0;
}
.line-wrapper {
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
}
.title {
  padding: 30px 30px 0;
  font-size: 22px;
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
  color: #6b6bec;
  font-size: 14px;
}
.line-nav {
  display: flex;
  padding: 30px;
}
.count-picker {
  margin-left: 10px;
  float: left;
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
  list-style: none;
  //  width: 100%;
  height: 35px;
  padding: 0;
  font-size: 0;
  //  margin-right: 10px
  li {
    line-height: 35px;
    display: inline-block;
    width: 60px;
    text-align: center;
    font-size: 10px;
    cursor: pointer;
    background: #fff;
  }
  li:nth-child(1) {
    border: 1px #dcdfe6 solid;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  li:nth-child(2) {
    border-bottom: 1px #dcdfe6 solid;
    border-top: 1px #dcdfe6 solid;
  }
  li:nth-child(3) {
    border: 1px #dcdfe6 solid;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .bgColor {
    background-color: #6b6bec;
    color: #fff;
  }
}
</style>
