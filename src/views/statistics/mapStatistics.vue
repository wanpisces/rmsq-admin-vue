<template>
  <div class="scrollbar">
    <div class="line-wrapper">
      <!-- <i class="icon-zuobiao"></i> -->
      <!-- <span v-if="adminType!=0">小程序用户：</span> -->

      <div style="padding:20px 0 20px 20px;">
        <div id="echartContainer2" style="width:100%;height:1000px;margin-top: 40px"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
import "echarts/lib/chart/map";
import "echarts/map/js/china.js";

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
        { newsType: 1, name: "阅读数" },
        { newsType: 2, name: "点赞数" },
        { newsType: 3, name: "评论数" }
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
      show: 1,
      activeShow: 1,
      tabData: [
        {
          index: 1,
          values: "默认"
        },
        // {
        //   index: 2,
        //   values: "默认"
        // },
        {
          index: 3,
          values: "近一个月"
        }
      ],
      search: {
        upper_region: 0
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
      HomeRequst.RequesCountArea(args).then(res => {
        if (res.code == 2000) {
          this.addCountInit(res.data);
        }
      });
    },
    //地区统计
    addCountInit(dataObj) {
      var myChart = echarts.init(document.getElementById("echartContainer2"));
      window.onresize = myChart.resize;
      var name_title = "人民社区用户的地区分布";
      var subname = "";
      var nameColor = " rgb(55, 75, 113)";
      var name_fontFamily = "等线";
      var subname_fontSize = 15;
      var name_fontSize = 18;
      var mapName = "china";
      var data = dataObj.miniProData;
      // for (let i = 0; i < data.length; i++) {
      //   data[i].value = data[i].value || 1;
      // }
      var geoCoordMap = {};
      var toolTipData = dataObj.totalData;

      /*获取地图数据*/
      myChart.showLoading();
      var mapFeatures = echarts.getMap(mapName).geoJson.features;
      myChart.hideLoading();
      mapFeatures.forEach(function(v) {
        // 地区名称
        // console.log(v);
        var id = v.id;
        // var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[id] = v.properties.cp;
      });
      console.log(data);
      var max = 480,
        min = 9; // todo
      var maxSize4Pin = 100,
        minSize4Pin = 20;

      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].id];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      var option = {
        title: {
          text: name_title,
          subtext: subname,
          x: "center",
          textStyle: {
            color: nameColor,
            fontFamily: name_fontFamily,
            fontSize: name_fontSize
          },
          subtextStyle: {
            fontSize: subname_fontSize,
            fontFamily: name_fontFamily
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            if (typeof params.value[2] == "undefined") {
              var toolTiphtml = "";
              for (var i = 0; i < toolTipData.length; i++) {
                if (params.name == toolTipData[i].name) {
                  toolTiphtml += toolTipData[i].name + ":<br>";
                  for (var j = 0; j < toolTipData[i].value.length; j++) {
                    toolTiphtml +=
                      toolTipData[i].value[j].name +
                      ":" +
                      toolTipData[i].value[j].value +
                      "<br>";
                  }
                }
              }
              // console.log(toolTiphtml);
              // console.log(convertData(data))
              return toolTiphtml;
            } else {
              var toolTiphtml = "";
              for (var i = 0; i < toolTipData.length; i++) {
                if (params.name == toolTipData[i].name) {
                  toolTiphtml += toolTipData[i].name + ":<br>";
                  for (var j = 0; j < toolTipData[i].value.length; j++) {
                    toolTiphtml +=
                      toolTipData[i].value[j].name +
                      ":" +
                      toolTipData[i].value[j].value +
                      "<br>";
                  }
                }
              }
              console.log(toolTiphtml);
              // console.log(convertData(data))
              return toolTiphtml;
            }
          }
        },
        // legend: {
        //     orient: 'vertical',
        //     y: 'bottom',
        //     x: 'right',
        //     data: ['credit_pm2.5'],
        //     textStyle: {
        //         color: '#fff'
        //     }
        // },
        visualMap: {
          show: true,
          min: 0,
          max: 200,
          left: "left",
          top: "bottom",
          text: ["高", "低"], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [1],
          inRange: {
            // color: ['#3B5077', '#031525'] // 蓝黑
            // color: ['#ffc0cb', '#800080'] // 红紫
            // color: ['#3C3B3F', '#605C3C'] // 黑绿
            // color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
            // color: ['#23074d', '#cc5333'] // 紫红
            color: ["#95bcf7", "#A5CC82", "#f3cc05", "#cc5333"] // 蓝绿
            //color: ["#1488CC", "#2B32B2"] // 浅蓝
            //color: ["#00467F", "#f3cc05"] // 蓝HUANG
          }
        },
        /*工具按钮组*/
        toolbox: {
          show: true,
          orient: "vertical",
          right: "20px",
          top: "center",
          feature: {
            // dataView: {
            //   readOnly: false
            // },
            restore: {},
            saveAsImage: {}
          }
        },
        geo: {
          show: true,
          map: mapName,
          label: {
            normal: {
              show: true,
              color: "#000"
            },
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "#031525",
              borderColor: "#eee"
            },
            emphasis: {
              areaColor: "#88c9fe"
            }
          }
        },
        series: [
          {
            name: "散点",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(data),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "inside",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#05C3F9"
              }
            }
          },
          {
            type: "map",
            map: mapName,
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: data
          }
          // {
          //   name: "点",
          //   type: "scatter",
          //   coordinateSystem: "geo",
          //   symbol: "pin", //气泡
          //   symbolSize: function(val) {
          //     var a = (maxSize4Pin - minSize4Pin) / (max - min);
          //     var b = minSize4Pin - a * min;
          //     b = maxSize4Pin - a * max;
          //     return a * val[2] + b;
          //   },
          //   label: {
          //     normal: {
          //       show: true,
          //       textStyle: {
          //         color: "#fff",
          //         fontSize: 9
          //       }
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: "#F62157" //标志颜色
          //     }
          //   },
          //   zlevel: 6,
          //   data: convertData(data)
          // }
          // {
          //   name: "Top 5",
          //   type: "effectScatter",
          //   coordinateSystem: "geo",
          //   data: convertData(
          //     data
          //       .sort(function(a, b) {
          //         return b.value - a.value;
          //       })
          //       .slice(0, 5)
          //   ),
          //   symbolSize: function(val) {
          //     return val[2] / 10;
          //   },
          //   showEffectOn: "render",
          //   rippleEffect: {
          //     brushType: "stroke"
          //   },
          //   hoverAnimation: true,
          //   label: {
          //     normal: {
          //       formatter: "{b}",
          //       position: "right",
          //       show: true
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: "yellow",
          //       shadowBlur: 10,
          //       shadowColor: "yellow"
          //     }
          //   },
          //   zlevel: 1
          // }
        ]
      };
      myChart.setOption(option);
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


// [{id: 110000, name: "北京", value: 0},
// {id: 120000, name: "天津", value: 0},
// {id: 130000, name: "河北省", value: 0},
// {id: 140000, name: "山西省", value: 0},
// {id: 150000, name: "内蒙古自治区", value: 0},
// {id: 210000, name: "辽宁省", value: 0},
// {id: 220000, name: "吉林省", value: 0},
// {id: 230000, name: "黑龙江省", value: 0},
// {id: 310000, name: "上海", value: 0},
// {id: 320000, name: "江苏省", value: 0},
// {id: 330000, name: "浙江省", value: 0},
// {id: 340000, name: "安徽省", value: 0},
// {id: 350000, name: "福建省", value: 0},
// {id: 360000, name: "江西省", value: 0},
// {id: 370000, name: "山东省", value: 0},
// {id: 410000, name: "河南省", value: 0},
// {id: 420000, name: "湖北省", value: 0},
// {id: 430000, name: "湖南省", value: 0},
// {id: 440000, name: "广东省", value: 0},
// {id: 450000, name: "广西壮族自治区", value: 0},
// {id: 460000, name: "海南省", value: 0},
// {id: 500000, name: "重庆", value: 0},
// {id: 510000, name: "四川省", value: "11"},
// {id: 520000, name: "贵州省", value: 0},
// {id: 530000, name: "云南省", value: 0},
// {id: 540000, name: "西藏自治区", value: 0},
// {id: 610000, name: "陕西省", value: 0},
// {id: 620000, name: "甘肃省", value: 0},
// {id: 630000, name: "青海省", value: 0},
// {id: 640000, name: "宁夏回族自治区", value: 0},
// {id: 650000, name: "新疆维吾尔自治区", value: 0},
// {id: 710000, name: "台湾", value: 0},
// {id: 810000, name: "香港特别行政区", value: 0},
// {id: 820000, name: "澳门特别行政区", value: 0}]