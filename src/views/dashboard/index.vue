<template>
  <div class="scrollbar">
    <el-row class="panel-group" :gutter="40" style="width:100%;">
      <el-col :xs="12" :sm="12" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总资讯数</div>
            <div style="text-align:right;">
              <count-to class="card-panel-num" :startVal="0" :endVal="+count.total_num_news " :duration="2600"></count-to>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="star" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总用户数</div>
            <div style="text-align:right;">
              <count-to class="card-panel-num" :startVal="0" :endVal="+count.total_num_user" :duration="3000"></count-to>
            </div>

          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="chart" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">昨日新增用户</div>
            <div style="text-align:right;">
              <count-to class="card-panel-num" :startVal="0" :endVal="+count.total_num_user_new" :duration="3200"></count-to>
            </div>

          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="tab" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">七日留存</div>
            <div style="text-align:right;">
              <count-to class="card-panel-num" :startVal="0" :endVal="+count.total_num_user_seven" :duration="3600"></count-to>
            </div>

          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="adminType==0">
      <el-row class="panel-text" :gutter="40" align="center">
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-title">已经开通单位统计</div>
            <el-row class="pannel-list">
              <el-col :xs="24" :sm="24" :lg="12">省开通单位总数
                <span>（{{count.inst.total_num_group_5 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">市开通单位总数
                <span>（{{count.inst.total_num_group_4 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">区县开通单位总数
                <span>（{{count.inst.total_num_group_3 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">街道办开通单位总数
                <span>（{{count.inst.total_num_group_2 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">社区开通单位总数
                <span>（{{count.inst.total_num_group_1 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">昨日开通单位总数
                <span>（{{count.inst.total_num_group_old || 0}}个）</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-title">资讯统计</div>
            <el-row class="pannel-list">
              <el-col :xs="24" :sm="24" :lg="12">资讯总数
                <span>（{{count.news.total_num_news || 0}}个）</span>
              </el-col>

              <el-col :xs="24" :sm="24" :lg="12">昨日被驳回
                <span>（{{count.news.total_num_news_audit_3 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">上线资讯
                <span>（{{count.news.total_num_news_status_1 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">昨日待审核
                <span>（{{count.news.total_num_news_audit_2 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">下线资讯
                <span>（{{count.news.total_num_news_status_2 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">昨日已上线
                <span>（{{count.news.total_num_news_status_0 || 0}}个）</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row class="panel-text" :gutter="40" align="center">
        <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
          <div class="card-panel">
            <div class="card-title">公众号统计</div>
            <el-row class="pannel-list">
              <el-col :xs="24" :sm="24" :lg="12">公众号总数
                <span>（{{count.mps.total_num_mp || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12"> 昨日新增公众号总数
                <span>（{{count.mps.total_num_mp_add || 0}}个）</span>
              </el-col>

              <el-col :xs="24" :sm="24" :lg="12">订阅号总数
                <span>（{{count.mps.total_num_mp_type_2 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">昨日新增订阅号总数
                <span>（{{count.mps.total_num_mp_type_2_add || 0}}个）</span>
              </el-col>

              <el-col :xs="24" :sm="24" :lg="12">服务号总数
                <span>（{{count.mps.total_num_mp_type_1 || 0}}个）</span>
              </el-col>
              <el-col :xs="24" :sm="24" :lg="12">昨日新增服务号总数
                <span>（{{count.mps.total_num_mp_type_1_add || 0}}个）</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="line-wrapper">
      <div class="line-nav">
        <ul class="count-time">
          <li @click="tabchanges(item.index)" :class="show==item.index?' bgColor':false" v-for="item in tabData" :key="item.index">{{item.values}}</li>
        </ul>
        <div class="count-picker">
          <el-date-picker unlink-panels size="medium" v-model="picker_time" type="daterange" :clearable='false' start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @blur="timeBlur" :picker-options="pickerOptions">
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
require("echarts/lib//component/graphic.js");
require("echarts/lib/component/legend");
// require("echarts/lib//component/lien");
// import ElRow from "element-ui/packages/row/src/row";
// import ElCol from "element-ui/packages/col/src/col";
import CountTo from "vue-count-to";
import { sevenDays, thirtyDays, formatDate, getWeekStartDate, getWeekEndDate, getMonthStartDate, getMonthEndDate } from "@/utils/time";
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
      show: 1,
      activeShow: 1,
      tabData: [
        {
          index: 1,
          values: "默认"
        },
        {
          index: 2,
          values: "近七天"
        },
        {
          index: 3,
          values: "近一个月"
        }
      ],
      picker_time: [],
      adminType: getAdminType(),
      pickerOptions: {
        disabledDate(time) {
          //  console.log('ssss',time)
          return time.getTime() >= Date.now();
        }
      }
    };
  },
  created() {
    console.log(sevenDays());
    this.countData();
  },
  mounted() {
    this.getChart();
  },

  methods: {
    // 用户数量
    countData() {
      HomeRequst.RequesHomeList().then(res => {
        !!res ? (this.count = res) : "";
      });
    },
    getChart(args) {
      HomeRequst.RequesHomeChart(args).then(res => {
        this.addCountInit(res);
      });
    },
    // 用户增量统计
    addCountInit(data) {
      var chart = echarts.init(document.getElementById("echartContainer"));
      window.onresize = chart.resize;
      let args = {
        type: this.show
      };
      chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "#23E9EE" }, { offset: 1, color: "#0460F7" }])],
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
            name: "累计小程序用户总数",
            type: "line",
            symbol: "emptyCircle",
            symbolSize: 2,
            showSymbol: false,
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(35,233,238,.4)" }, { offset: 1, color: "rgba(4,96,247,.4)" }])
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
      } else if (this.picker_time[0] === getWeekStartDate() && this.picker_time[1] === getWeekEndDate()) {
        this.show = 2;
      } else if (this.picker_time[0] === getMonthStartDate() && this.picker_time[1] === getMonthEndDate()) {
        this.show = 3;
      } else {
        this.show = 0;
      }
      this.getChart({
        starttime: this.picker_time[0],
        endtime: this.picker_time[1]
      });
    },
    disabledDate(time) {
      console.log(time);
    },
    tabchanges(index) {
      this.show = index;
      this.picker_time = [];
      let _args = {};
      index == 1
        ? ""
        : index == 2
          ? (_args = {
              starttime: sevenDays().t2,
              endtime: sevenDays().t1,
              type: 2
            })
          : (_args = {
              starttime: thirtyDays().t2,
              endtime: thirtyDays().t1,
              type: 2
            });
      this.getChart(_args);
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
.line-wrapper {
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
  // color: #23E9EE
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
        text-align: right;
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
  display: flex;
  justify-content: flex-end;
  padding: 30px;
}
.count-picker {
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
