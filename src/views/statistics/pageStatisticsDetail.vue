<template>
  <div class="scrollbar">
    <div class="line-wrapper">
      <div>
        <el-card>
          <div>
            <div class="line-nav">
              <div class="count-picker">
                <el-date-picker unlink-panels size="medium" v-model="pickerIndex" type="daterange" :clearable='false' start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @blur="timeBlur(1)" :picker-options="pickerOptions">
                </el-date-picker>
              </div>
            </div>
            <div class="line-nav">
              <div>首页：{{count.index}} </div>
              <ul class="count-time">
                <li @click="tabchanges(item.index,1)" :class="showIndex==item.index?' bgColor':false" v-for="item in tabData" :key="item.index">{{item.values}}</li>
              </ul>
            </div>
            <div>
              <div v-if="dataArr.length!=0">
                <div v-for="(item,index) in  dataArr.index" :key="index" class="count-display">
                  <div style="width:100px;text-align:right;padding-right:10px">{{item[0]}}:</div>
                  <div style="width:300px" class="count-display">
                    <div class="line-percent" :style="{width:count.index!=0?(item[1]/count.index )*100 +'%':'0px'}"></div>
                    <span>{{(item[1])}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-line">
            <div class="line-nav">
              <div class="count-picker">
                <el-date-picker unlink-panels size="medium" v-model="pickerService" type="daterange" :clearable='false' start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @blur="timeBlur(2)" :picker-options="pickerOptions">
                </el-date-picker>
              </div>
            </div>
            <div class="line-nav">
              <div>服务：{{count.service}} </div>
              <ul class="count-time">
                <li @click="tabchanges(item.index,2)" :class="showService==item.index?' bgColor':false" v-for="item in tabData" :key="item.index">{{item.values}}</li>
              </ul>
            </div>
            <div class="line-dis">
              <div v-if="dataArr.length!=0">
                <div v-for="(item,index) in  dataArr.service" :key="index" class="count-display">
                  <div style="width:100px;text-align:right;padding-right:10px">{{item[0]}}:</div>
                  <div style="width:300px" class="count-display">
                    <div class="line-percent" :style="{width:count.service!=0?(( item[1]/count.service)*100) +'%':'0px'}"></div>
                    <span>{{item[1]}}</span>
                  </div>
                  <div class="line-detail" @click="detailData= item">详情</div>
                </div>
              </div>

              <div style="margin-left:40px" v-if="detailData.length!=0" class="count-detail">
                <div>{{detailData[0]}}：{{detailData[1]}}</div>
                <div v-for="(item,index) in detailData[2]" :key="index" class="count-display ">
                  <div style="width:100px;text-align:right;padding-right:10px">{{item[0]}}:</div>
                  <div style="width:300px" class="count-display">
                    <div class="line-percent" :style="{width:count.service!=0?(( item[1]/count.service)*100) +'%':'0px'}"></div>
                    <span>{{item[1]}}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="p-line">
            <div class="line-nav">
              <div class="count-picker">
                <el-date-picker unlink-panels size="medium" v-model="pickerMine" type="daterange" :clearable='false' start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @blur="timeBlur(3)" :picker-options="pickerOptions">
                </el-date-picker>
              </div>
            </div>
            <div class="line-nav">
              <div>我的：{{count.mine}} </div>
              <ul class="count-time">
                <li @click="tabchanges(item.index,3)" :class="showMine==item.index?' bgColor':false" v-for="item in tabData" :key="item.index">{{item.values}}</li>
              </ul>
            </div>
            <div>
              <div v-if="dataArr.length!=0">
                <div v-for="(item,index) in  dataArr.mine" :key="index" class="count-display">
                  <div style="width:100px;text-align:right;padding-right:10px">{{item[0]}}:</div>
                  <div style="width:300px" class="count-display">
                    <div class="line-percent" :style="{width:count.mine!=0 ?((item[1]/count.mine)*100) +'%':'0px'}"></div>
                    <span>{{item[1]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </el-card>

      </div>
    </div>
  </div>
</template>
<script>
// 存储的cookies
import { getAdminType } from "@/utils/auth";
import HomeRequst from "@/fetch/modules/dashboard";
import { sevenDays, thirtyDays, formatDate, getWeekStartDate, getWeekEndDate, getMonthStartDate, getMonthEndDate } from "@/utils/time";
export default {
  components: {},
  data() {
    return {
      detailData: [],
      showIndex: 1,
      showService: 1,
      showMine: 1,
      activeShow: 1,
      tabData: [
        {
          index: 1,
          values: "今天"
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
      pickerIndex: [],
      pickerService: [],
      pickerMine: [],
      adminType: getAdminType(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
      dataArr: {
        index: [],
        mine: [],
        service: []
      },
      count: {
        index: 0,
        mine: 0,
        service: 0
      }
    };
  },
  created() {
    this.getData({ type: 4 }, 4);
  },
  mounted() {},

  methods: {
    tabchanges(index, type) {
      type == 2 ? (this.detailData = []) : "";
      type == 1 ? (this.showIndex = index) : type == 2 ? (this.showService = index) : (this.showMine = index);
      type == 1 ? (this.pickerIndex = []) : type == 2 ? (this.pickerService = []) : (this.pickerMine = []);
      let _args = {};
      index == 1
        ? ""
        : index == 2
          ? (_args = {
              starttime: sevenDays().t2,
              endtime: sevenDays().t1,
              type: type
            })
          : (_args = {
              starttime: thirtyDays().t2,
              endtime: thirtyDays().t1,
              type: type
            });
      this.getData(_args, type);
    },
    getData(param = {}, index) {
      console.log(index);
      HomeRequst.RequesCountModuleDetail(param).then(res => {
        let countIndex = 0,
          countMine = 0,
          countService = 0;
        switch (index) {
          case 4:
            for (let i in res.data.index) {
              console.log(res.data.index[i][1]);
              countIndex += res.data.index[i][1];
            }
            for (let j in res.data.mine) {
              countMine += res.data.mine[j][1];
            }
            for (let m in res.data.service) {
              countService += res.data.service[m][1];
            }
            this.count = {
              index: countIndex,
              mine: countMine,
              service: countService
            };
            this.dataArr = res.data;
            break;
          case 1:
            for (let i in res.data.index) {
              countIndex += res.data.index[i][1];
            }
            this.count.index = countIndex;
            this.dataArr.index = res.data.index;
            break;
          case 3:
            for (let i in res.data.mine) {
              countMine += res.data.mine[i][1];
            }
            this.count.mine = countMine;
            this.dataArr.mine = res.data.mine;
            break;
          case 2:
            for (let i in res.data.service) {
              countService += res.data.service[i][1];
            }
            this.count.service = countService;
            this.dataArr.service = res.data.service;
            break;
          default:
            break;
        }
      });
    },
    timeBlur(type) {
      type == 2 ? (this.detailData = []) : "";
      switch (type) {
        case 1:
          if (this.pickerIndex[0] === formatDate(new Date())) {
            this.showIndex = 1;
          } else if (this.pickerIndex[0] === getWeekStartDate() && this.pickerIndex[1] === getWeekEndDate()) {
            this.showIndex = 2;
          } else if (this.pickerIndex[0] === getMonthStartDate() && this.pickerIndex[1] === getMonthEndDate()) {
            this.showIndex = 3;
          } else {
            this.showIndex = 0;
          }
          break;
        case 2:
          if (this.pickerService[0] === formatDate(new Date())) {
            this.showService = 1;
          } else if (this.pickerService[0] === getWeekStartDate() && this.pickerService[1] === getWeekEndDate()) {
            this.showIndex = 2;
          } else if (this.pickerService[0] === getMonthStartDate() && this.pickerService[1] === getMonthEndDate()) {
            this.showService = 3;
          } else {
            this.showService = 0;
          }
          break;
        case 3:
          if (this.pickerMine[0] === formatDate(new Date())) {
            this.showMine = 1;
          } else if (this.pickerMine[0] === getWeekStartDate() && this.pickerMine[1] === getWeekEndDate()) {
            this.showIndex = 2;
          } else if (this.pickerMine[0] === getMonthStartDate() && this.pickerMine[1] === getMonthEndDate()) {
            this.showMine = 3;
          } else {
            this.showMine = 0;
          }
          break;

        default:
          break;
      }
      this.getData(
        {
          starttime: type == 1 ? this.pickerIndex[0] : type == 2 ? this.pickerService[0] : this.pickerMine[0],
          endtime: type == 1 ? this.pickerIndex[1] : type == 2 ? this.pickerService[1] : this.pickerMine[1],
          type: type
        },
        type
      );
    }
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

  border-radius: 10px;
  // color: #23E9EE
}
.count-time {
  list-style: none;
  //  width: 100%;
  height: 35px;
  padding: 0;
  font-size: 0;
  margin-left: 50px;

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
.line-nav {
  display: flex;
  justify-content: flex-start;
  padding: 10px 30px;
  align-items: center;
}
.count-display {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 0;
}
.count-detail {
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
.p-line {
  border-top: 1px dashed #999;
  padding-top: 20px;
  margin-top: 20px;
}
.line-dis {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.line-detail {
  color: #39bcf3;
  cursor: pointer;
  margin-left: 10px;
}
</style>
<style>
.count-display .el-progress-bar__outer {
  background: #fff;
}
.line-percent {
  background: #39bcf3;
  border-radius: 3px;
  height: 10px;
  margin-right: 5px;
}
</style>

